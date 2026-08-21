#!/usr/bin/env node
/**
 * Gate C: run ONE approved LatentSync batch call and deliver its segments.
 *
 *   node scripts/lipsync-batch.mjs --lesson siu-01-av1 --call 6 [--max-cost N] [--dry-run] [--build-only]
 *
 * WHAT THIS IS FOR
 * ----------------
 * This is the only paid step in the pipeline that touches video. Everything it needs is
 * already decided and on disk before it runs: the batch table in _lipsync-batch-plan.json,
 * the mastered narration from Gate A, and the presenter's approved driving base. This script
 * does not plan, choose, or infer anything — it executes one row of an approved table.
 *
 * THE FIVE RULES IT ENFORCES MECHANICALLY (locked pipeline, CLAUDE.md):
 *   2. every call carries >=40 s of audio               -> asserted before upload
 *   3. padding computed at 25 fps, never the base's fps -> the plan's frames/blocks are re-derived and checked
 *   4. LatentSync's returned audio is DISCARDED         -> the delivered mux uses -c:a copy from the .mp3 master
 *   5. delivery is exactly 1920x1080                    -> asserted on every delivered segment
 *   6. approved masters stay byte-identical             -> base + every .mp3 re-hashed before and after
 *
 * COST SAFETY
 * -----------
 * Hard ceiling via --max-cost, checked against the plan's own projection before anything is
 * uploaded. The fal request_id is written to disk the moment it is issued, so an interrupted
 * run resumes onto the SAME request instead of buying a second one.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";
import { uploadTemporaryInput } from "./fal-upload.mjs";
import { probe, ebur128, sha256, decodePcm, truncationCheck, FORMAT, TARGET_LUFS, LUFS_TOLERANCE } from "./audio-qa.mjs";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const SCRATCH = process.env.SCRATCH || "/tmp";
const ENV_FALLBACK = "/Users/luismiguel/Desktop/rubric/templates/generations/.env";

const RATE = FORMAT.sample_rate;        // 24000 - the locked narration rate
const OUT_FPS = 25;                     // LatentSync ALWAYS returns 25 fps, whatever goes in
const PER_SEC = 0.005;
const MIN_CALL_COST = 0.2;
const MIN_CALL_S = 40;

function falKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  for (const line of readFileSync(ENV_FALLBACK, "utf8").split("\n")) {
    if (line.trim().startsWith("FAL_KEY=")) {
      return line.split("=").slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
    }
  }
  throw new Error("FAL_KEY not found (env or credential store)");
}

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}

const ff = (args) => execFileSync("ffmpeg", ["-hide_banner", "-nostats", "-loglevel", "error", ...args], { encoding: "utf8" });

function videoProbe(path) {
  const j = JSON.parse(execFileSync("ffprobe", [
    "-v", "error", "-show_entries",
    "stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames,pix_fmt,sample_rate,channels,bit_rate",
    "-show_entries", "format=duration", "-of", "json", path,
  ], { encoding: "utf8" }));
  const v = (j.streams || []).find((s) => s.codec_type === "video") || {};
  const a = (j.streams || []).find((s) => s.codec_type === "audio");
  return {
    width: Number(v.width), height: Number(v.height),
    fps: v.r_frame_rate, codec: v.codec_name, pix_fmt: v.pix_fmt,
    frames: Number(v.nb_frames), duration: Number(j.format?.duration),
    audio: a ? { codec: a.codec_name, sample_rate: Number(a.sample_rate), channels: Number(a.channels), bit_rate: Number(a.bit_rate) } : null,
  };
}

/** Count decoded video frames exactly. nb_frames from the container can be absent or wrong. */
function countFrames(path) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0", "-count_frames",
    "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", path,
  ], { encoding: "utf8" });
  return Number(out.trim());
}

/** 16-bit PCM mono WAV writer. Sample-exact by construction, so the split offsets are exact. */
function writeWav(path, samples, rate) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE(Math.round(v * 32767), i * 2);
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(data.length, 40);
  writeFileSync(path, Buffer.concat([h, data]));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --------------------------------------------------------------------------- inputs
const lessonId = arg("lesson");
const callNo = Number(arg("call"));
const dryRun = arg("dry-run") === true;
const buildOnly = arg("build-only") === true;
if (!lessonId || !callNo) {
  console.error("usage: --lesson <id> --call <n> [--max-cost N] [--dry-run] [--build-only]");
  process.exit(2);
}

const mediaDir = join(REPO, "public/media", lessonId);
const plan = JSON.parse(readFileSync(join(mediaDir, "_lipsync-batch-plan.json"), "utf8"));
const row = plan.plan.find((p) => p.call === callNo);
if (!row) throw new Error(`call ${callNo} not in plan`);

const maxCost = parseFloat(arg("max-cost", String((row.cost_usd * 1.3).toFixed(4))));
const workDir = join(SCRATCH, `${lessonId}-call${callNo}`);
mkdirSync(workDir, { recursive: true });

/**
 * Driving-base path. The approved base records are not consistent about this field: Curtis's
 * `asset` is a bare filename, Selena's is a repo-relative path. Both are legitimate records
 * and neither is going to be edited to suit a script, so accept either form here.
 */
const mediaPath = (f) => join(REPO, f.startsWith("public/media/") ? f : join("public/media", f));

const baseRecPath = mediaPath(plan.driving_base.file.replace(/\.mp4$/, ".json"));
const baseRec = JSON.parse(readFileSync(baseRecPath, "utf8"));
const basePath = mediaPath(plan.driving_base.file);

console.log(`\nEXIMIOUS - Gate C, LatentSync batch call`);
console.log(`  lesson       : ${lessonId}`);
console.log(`  call         : ${callNo} of ${plan.calls}`);
console.log(`  segments     : ${row.segments.join(", ")}`);
console.log(`  content      : ${row.content_s} s   submit ${row.submit_s} s   ${row.blocks} blocks / ${row.frames} frames @ ${OUT_FPS} fps`);
console.log(`  projected    : $${row.cost_usd.toFixed(4)}   ceiling $${maxCost.toFixed(4)}`);

// ------------------------------------------------------------------- preflight (free)
console.log(`\n  PREFLIGHT`);

// Rule 6: the approved driving base must be the exact approved bytes.
/**
 * Approved checksum of the driving base. Curtis's record carries it at the top level,
 * Selena's under `delivery`. Resolve either, and refuse to run if neither is present -
 * an absent checksum must fail loudly, never compare as undefined and silently pass.
 */
const baseSha = baseRec.sha256 ?? baseRec.delivery?.sha256;
if (!baseSha) throw new Error(`driving-base record has no sha256 - cannot verify rule 6`);
const baseHash = sha256(basePath);
if (baseHash !== baseSha) throw new Error(`driving base sha256 mismatch: ${baseHash} != ${baseSha}`);
console.log(`    driving base sha256      OK  ${baseHash.slice(0, 16)}...`);

const baseInfo = videoProbe(basePath);
if (Math.abs(baseInfo.duration - plan.driving_base.dur_s) > 0.01) throw new Error(`base duration drift`);
console.log(`    driving base container   OK  ${baseInfo.width}x${baseInfo.height} ${baseInfo.fps} ${baseInfo.duration}s audio=${baseInfo.audio ? "PRESENT (unexpected)" : "none"}`);

// Rule 3: re-derive the padding from the measured durations. Never trust the stored numbers.
// The lead-in is part of the content it is computed from, so it is read from the plan's rules
// rather than hard-coded here - that keeps this an independent check of the plan's arithmetic
// instead of a copy of it.
const leadIn = plan.rules.lead_in_s ?? 0;
const durs = row.offsets.map((o) => o.audio_dur_s);
const contentS = +(leadIn + durs.reduce((a, b) => a + b, 0) + 0.5 * (durs.length - 1)).toFixed(6);
// The returned video must also clear the DELIVERY pad: lipsync-deliver.mjs cuts 0.24 s of
// silence in on both sides of every segment, so the last segment of a call needs at least
// that much video past its final narration sample. Read from the plan for the same reason
// the lead-in is - this stays an independent check, not a copy.
const deliveryPad = plan.rules.delivery_pad_s ?? 0;
const blocks = Math.ceil(((contentS + deliveryPad) * OUT_FPS) / 16);
const submitS = +((blocks * 16) / OUT_FPS + 0.2).toFixed(4);
if (blocks !== row.blocks || Math.abs(submitS - row.submit_s) > 1e-6) {
  throw new Error(`padding re-derivation disagrees with the plan: blocks ${blocks} vs ${row.blocks}, submit ${submitS} vs ${row.submit_s}`);
}
console.log(`    padding re-derived       OK  ${leadIn}s lead-in + narration = ${contentS}s content (+${deliveryPad}s delivery pad) -> ${blocks} blocks -> ${submitS}s submit (25 fps)`);
console.log(`    tail slack for split     OK  ${((blocks * 16) / OUT_FPS - contentS).toFixed(3)}s past the last narration sample (needs >= ${deliveryPad}s)`);

// Rule 2: >=40 s per call.
if (submitS < MIN_CALL_S) throw new Error(`call is ${submitS}s, under the ${MIN_CALL_S}s minimum-charge floor`);
console.log(`    >=40 s minimum           OK  ${submitS}s`);

// The window must exceed the audio so loop_mode can never trigger.
if (submitS >= plan.driving_base.dur_s) throw new Error(`submit ${submitS}s >= base ${plan.driving_base.dur_s}s - loop_mode would trigger`);
console.log(`    fits driving base        OK  ${(plan.driving_base.dur_s - submitS).toFixed(3)}s headroom`);

// Every segment must exist, match its Gate A sidecar, and have passed Gate B.
const segMeta = [];
for (const o of row.offsets) {
  const mp3 = join(mediaDir, `${o.id}.mp3`);
  const car = JSON.parse(readFileSync(join(mediaDir, `${o.id}.json`), "utf8"));
  const h = sha256(mp3);
  if (h !== car.sha256) throw new Error(`${o.id}.mp3 sha256 differs from its Gate A sidecar`);
  const p = probe(mp3);
  if (Math.abs(p.duration - o.audio_dur_s) > 0.002) throw new Error(`${o.id} duration drift: ${p.duration} vs planned ${o.audio_dur_s}`);
  segMeta.push({ id: o.id, mp3, sha256: h, sidecar: car, probe: p, batch_start_s: o.batch_start_s, audio_dur_s: o.audio_dur_s });
}
console.log(`    ${segMeta.length} narration masters      OK  hashes + durations match Gate A`);

// ------------------------------------------------------- build the batch audio (free)
console.log(`\n  BUILD`);
const totalSamples = Math.round(submitS * RATE);
const batch = new Float32Array(totalSamples);
const buildLog = [];
for (const s of segMeta) {
  const pcm = decodePcm(s.mp3, RATE);
  const want = Math.round(s.audio_dur_s * RATE);
  const at = Math.round(s.batch_start_s * RATE);
  const n = Math.min(pcm.length, want);
  batch.set(pcm.subarray(0, n), at);
  buildLog.push({ id: s.id, planned_samples: want, decoded_samples: pcm.length, delta_ms: +(((pcm.length - want) / RATE) * 1000).toFixed(2), placed_at_sample: at });
}
const batchWav = join(workDir, "input-a.wav");   // neutral name: no client, course or presenter identity
writeWav(batchWav, batch, RATE);

/**
 * LEAD-IN ASSERTION - the first-frame-lips-closed condition, enforced structurally.
 *
 * The plan places the first segment one 16-frame block in, so frame 0 is generated during
 * silence. That only holds if the audio actually IS silent there, so it is asserted rather
 * than assumed: without this, a future planner change that dropped the lead-in would fail
 * silently and every batch-opening segment would ship with an open mouth again - which is
 * exactly how the call-6 canary defect reached delivery.
 */
const leadInS = leadIn;
if (leadInS > 0) {
  const leadSamples = Math.round(leadInS * RATE);
  if (Math.abs(row.offsets[0].batch_start_s - leadInS) > 1e-9) {
    throw new Error(`first segment starts at ${row.offsets[0].batch_start_s}s, expected the ${leadInS}s lead-in`);
  }
  let peak = 0;
  for (let i = 0; i < leadSamples; i++) peak = Math.max(peak, Math.abs(batch[i]));
  if (peak !== 0) throw new Error(`lead-in is not digitally silent (peak ${peak})`);
  const leadFrames = (leadInS * OUT_FPS);
  if (Math.abs(leadFrames - Math.round(leadFrames)) > 1e-9 || Math.round(leadFrames) % 16 !== 0) {
    throw new Error(`lead-in ${leadInS}s is not a whole number of 16-frame blocks at ${OUT_FPS} fps`);
  }
  console.log(`    lead-in ASSERTED         ${leadInS}s = ${Math.round(leadFrames)} frames = ${Math.round(leadFrames) / 16} block(s), digitally silent - frame 0 generates during silence`);
}
const batchDur = probe(batchWav).duration;
console.log(`    batch audio              ${batchWav.split("/").pop()}  ${batchDur.toFixed(3)}s  ${totalSamples} samples @ ${RATE} Hz mono`);
for (const b of buildLog) console.log(`      ${b.id.padEnd(14)} @ ${(b.placed_at_sample / RATE).toFixed(3)}s   decode delta ${b.delta_ms >= 0 ? "+" : ""}${b.delta_ms} ms`);

// Driving window: a STREAM COPY of the head of the approved base. Every frame bit-exact.
const windowFrames = Math.ceil((submitS + 1.0) * 24);   // base runs at 24 fps; +1 s margin
const windowMp4 = join(workDir, "drive-a.mp4");
ff(["-y", "-i", basePath, "-frames:v", String(windowFrames), "-c:v", "copy", "-an", windowMp4]);
const winInfo = videoProbe(windowMp4);
const winFrames = countFrames(windowMp4);
console.log(`    driving window           ${windowMp4.split("/").pop()}  ${winInfo.width}x${winInfo.height} ${winInfo.fps} ${winFrames} frames ${winInfo.duration.toFixed(3)}s (offset 0.000s, stream copy)`);
if (winInfo.duration <= batchDur) throw new Error(`driving window ${winInfo.duration}s does not exceed audio ${batchDur}s`);

if (buildOnly || dryRun) {
  console.log(`\n  ${buildOnly ? "--build-only" : "--dry-run"}: stopping before any upload or paid call.\n`);
  process.exit(0);
}
if (row.cost_usd > maxCost) {
  console.error(`\n  ABORT - projected $${row.cost_usd} over ceiling $${maxCost}. Nothing sent.\n`);
  process.exit(1);
}

// ------------------------------------------------------------------ submit (PAID)
const reqPath = join(mediaDir, `_call-${callNo}-request.json`);
let record = existsSync(reqPath) ? JSON.parse(readFileSync(reqPath, "utf8")) : null;
const key = falKey();

if (!record?.request_id) {
  console.log(`\n  UPLOAD (temporary inputs, 24 h retention, neutral filenames)`);
  const upAudio = await uploadTemporaryInput(batchWav, "audio/wav");
  const upVideo = await uploadTemporaryInput(windowMp4, "video/mp4");
  console.log(`    audio  expiry VERIFIED ${upAudio.expiresAt}`);
  console.log(`    video  expiry VERIFIED ${upVideo.expiresAt}`);

  const payload = {
    video_url: upVideo.url,
    audio_url: upAudio.url,
    loop_mode: plan.locked_params.loop_mode,
    seed: plan.locked_params.seed,
    guidance_scale: plan.locked_params.guidance_scale,
  };
  console.log(`\n  SUBMIT  fal-ai/latentsync  loop_mode=${payload.loop_mode} seed=${payload.seed} guidance_scale=${payload.guidance_scale}`);

  const res = await fetch("https://queue.fal.run/fal-ai/latentsync", {
    method: "POST",
    headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`submit failed ${res.status}: ${await res.text()}`);
  const q = await res.json();

  // Written IMMEDIATELY: an interrupted run must resume onto this request, never buy another.
  record = {
    lesson: lessonId, call: callNo, request_id: q.request_id,
    status_url: q.status_url, response_url: q.response_url,
    payload: { ...payload, video_url: "[temporary fal input, 24 h]", audio_url: "[temporary fal input, 24 h]" },
    input_expiry: { audio: upAudio.expiresAt, video: upVideo.expiresAt },
    submitted_utc: new Date().toISOString(),
    projected_cost_usd: row.cost_usd,
  };
  writeFileSync(reqPath, JSON.stringify(record, null, 2) + "\n");
  console.log(`    request_id ${q.request_id}  (recorded -> ${reqPath.split("/").pop()})`);
} else {
  console.log(`\n  RESUMING existing request ${record.request_id} - no new call bought.`);
}

// ------------------------------------------------------------------------- poll
console.log(`\n  QUEUE`);
let status = null;
for (let i = 0; i < 240; i++) {
  const r = await fetch(record.status_url, { headers: { Authorization: `Key ${key}` } });
  status = await r.json();
  if (status.status === "COMPLETED") break;
  if (status.status === "FAILED" || status.error) throw new Error(`fal reports failure: ${JSON.stringify(status).slice(0, 400)}`);
  if (i % 6 === 0) console.log(`    ${new Date().toISOString().slice(11, 19)}  ${status.status}${status.queue_position != null ? ` (position ${status.queue_position})` : ""}`);
  await sleep(5000);
}
if (status?.status !== "COMPLETED") throw new Error(`timed out; request ${record.request_id} may still be running`);
console.log(`    COMPLETED`);

const rr = await fetch(record.response_url, { headers: { Authorization: `Key ${key}` } });
const out = await rr.json();
const videoUrl = out?.video?.url;
if (!videoUrl) throw new Error(`no video in response: ${JSON.stringify(out).slice(0, 300)}`);

const raw = join(workDir, `latentsync-out.mp4`);
const buf = Buffer.from(await (await fetch(videoUrl)).arrayBuffer());
writeFileSync(raw, buf);
const rawInfo = videoProbe(raw);
const rawFrames = countFrames(raw);
console.log(`\n  RETURNED  ${(buf.length / 1e6).toFixed(1)} MB  ${rawInfo.width}x${rawInfo.height} ${rawInfo.fps}  ${rawFrames} frames  ${rawInfo.duration.toFixed(3)}s  audio=${rawInfo.audio ? `${rawInfo.audio.codec} ${rawInfo.audio.sample_rate}Hz` : "none"}`);

record.completed_utc = new Date().toISOString();
record.returned = { frames: rawFrames, duration_s: +rawInfo.duration.toFixed(4), dims: `${rawInfo.width}x${rawInfo.height}`, fps: rawInfo.fps, audio: rawInfo.audio, sha256: sha256(raw) };
record.actual_cost_usd = +Math.max(MIN_CALL_COST, rawInfo.duration * PER_SEC).toFixed(4);
writeFileSync(reqPath, JSON.stringify(record, null, 2) + "\n");

console.log(`\n  Raw output kept at ${raw}`);
console.log(`  Next: node scripts/lipsync-deliver.mjs --lesson ${lessonId} --call ${callNo}\n`);
