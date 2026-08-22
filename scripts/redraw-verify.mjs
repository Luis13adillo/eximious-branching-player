#!/usr/bin/env node
/**
 * Generate-and-verify redraw of a single narration segment.
 *
 *   node scripts/redraw-verify.mjs --lesson ew-01-av1 --presenter selena-navarro \
 *        --segment rejoin-2a --require "voir dire" [--draws 4] [--max-cost 0.40]
 *
 * WHY THIS EXISTS
 * ---------------
 * Gate B's ASR read-back is a TRIAGE SIGNAL, not a verdict: most differences are the
 * transcriber smoothing, not the audio. But some are real, and the locked pipeline's
 * remedy for a real one is already written down — "generate-and-verify: every draw read
 * back by ASR ... a draw missing scripted words at head or tail, carrying an internal
 * hole, or peaking above -3.0 dBFS was discarded and redrawn on the same locked config".
 * That procedure had no script. This is it.
 *
 * WHAT IT DOES NOT DO
 * -------------------
 *  - It never edits the narration text. The segment's sha256 is re-checked against the
 *    locked module before anything is sent, exactly as tts-narration.mjs does.
 *  - It never changes the voice config. A redraw is the SAME locked config, drawn again.
 *    If every draw fails, the problem is systematic and needs a decision, not a retry.
 *  - It only replaces the delivered master once a draw has PASSED both the phrase check
 *    and the full audio gate. A failing run leaves the existing master untouched.
 *
 * THE PHRASE CHECK IS RUN ON THE ISOLATED CLAUSE, not the whole segment, because
 * sentence-level ASR smoothing is exactly what produces the false positives this is
 * meant to filter. A term that reads correctly in a 3-second window was said correctly.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { master, measure, sha256, sha256Text, TARGET_LUFS, LUFS_TOLERANCE, TRUE_PEAK_CEILING, FORMAT } from "./audio-qa.mjs";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const ENV_FALLBACK = "/Users/luismiguel/Desktop/rubric/templates/generations/.env";

function envValue(name) {
  if (process.env[name]) return process.env[name];
  if (existsSync(ENV_FALLBACK)) {
    for (const line of readFileSync(ENV_FALLBACK, "utf8").split("\n")) {
      if (line.trim().startsWith(`${name}=`)) {
        return line.split("=").slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
      }
    }
  }
  throw new Error(`${name} not found (environment or credential store)`);
}

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}

const lessonId = arg("lesson");
const presenterId = arg("presenter");
const segId = arg("segment");
const require_ = arg("require");
const draws = Number(arg("draws", "4"));
const maxCost = parseFloat(arg("max-cost", "0.40"));
if (!lessonId || !presenterId || !segId || !require_) {
  console.error('usage: --lesson <id> --presenter <id> --segment <id> --require "<phrase>" [--draws N] [--max-cost N]');
  process.exit(2);
}

// The presenter table lives in tts-narration.mjs. Rather than duplicate it — which is how
// a locked definition drifts — the config is read back out of the segment's own Gate A
// sidecar, which tts-narration.mjs wrote from that table on the run being corrected.
const mediaDir = join(REPO, "public/media", lessonId);
const sidePath = join(mediaDir, `${segId}.json`);
if (!existsSync(sidePath)) throw new Error(`no Gate A sidecar for ${segId} — run tts-narration.mjs first`);
const prev = JSON.parse(readFileSync(sidePath, "utf8"));
if (prev.provider !== "fal.ai -> MiniMax") {
  throw new Error(`this script currently implements the fal/MiniMax path only; ${segId} was rendered on ${prev.provider}`);
}

const mod = await import(join(REPO, "src/lib/lessons", `${lessonId}.narration.ts`));
const seg = mod.NARRATION[segId];
if (!seg) throw new Error(`${segId} is not in ${lessonId}.narration.ts`);

// FIDELITY PREFLIGHT — same contract as tts-narration.mjs. A drifted script aborts.
const h = sha256Text(seg.text);
if (h !== seg.scriptSha256 || seg.text.length !== seg.scriptChars) {
  throw new Error(`fidelity drift on ${segId}: refusing to synthesise`);
}
if (!seg.text.includes(require_)) {
  throw new Error(`the locked script for ${segId} does not contain "${require_}" — check the phrase`);
}

const PER_M = 100.0;
const projected = (seg.scriptChars / 1e6) * PER_M * draws;
console.log(`\nEXIMIOUS — generate-and-verify redraw`);
console.log(`  lesson/segment : ${lessonId} / ${segId}`);
console.log(`  config         : ${prev.provider} · ${prev.model} · ${prev.voice_label ?? prev.voice}  (UNCHANGED — a redraw, not a recast)`);
console.log(`  required phrase: "${require_}"  (checked on the ISOLATED clause)`);
console.log(`  draws          : up to ${draws}   projected worst case $${projected.toFixed(4)}   ceiling $${maxCost.toFixed(4)}`);
if (projected > maxCost) { console.error(`\n  ABORT — over ceiling. Nothing sent.\n`); process.exit(1); }

const FAL = envValue("FAL_KEY");
const OAI = envValue("OPENAI_API_KEY");
const scratch = process.env.SCRATCH || join(REPO, ".tts-raw");
mkdirSync(scratch, { recursive: true });

// The clause containing the phrase — the isolated window the check is run on.
const clause = seg.text.split(/(?<=[.?!])\s+/).find((s) => s.includes(require_));
if (!clause) throw new Error(`could not isolate a clause containing "${require_}"`);

async function synth(text) {
  const r = await fetch(`https://fal.run/${prev.endpoint.replace(/^POST https:\/\/fal\.run\//, "")}`, {
    method: "POST",
    headers: { Authorization: `Key ${FAL}`, "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice_setting: prev.voice_setting, audio_setting: prev.raw_audio_setting }),
  });
  if (!r.ok) throw new Error(`fal HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  const billed = r.headers.get("x-fal-billable-units");
  return { buf: Buffer.from(await (await fetch(j.audio.url)).arrayBuffer()), billed };
}
async function hear(buf) {
  const fd = new FormData();
  fd.append("file", new Blob([buf], { type: "audio/mpeg" }), "a.mp3");
  fd.append("model", "whisper-1");
  fd.append("response_format", "json");
  const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST", headers: { Authorization: `Bearer ${OAI}` }, body: fd,
  });
  if (!r.ok) throw new Error(`whisper HTTP ${r.status}`);
  return (await r.json()).text.trim();
}
const norm = (s) => s.toLowerCase().replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();

console.log(`\n  DRAWS`);
let accepted = null;
const log = [];
for (let d = 1; d <= draws; d++) {
  const { buf, billed } = await synth(seg.text);
  const rawPath = join(scratch, `${segId}.redraw${d}.mp3`);
  writeFileSync(rawPath, buf);

  // Isolated-clause check: synthesising the clause alone would be a DIFFERENT draw, so the
  // clause is located inside THIS draw by word timestamps and cut out of it.
  const fd = new FormData();
  fd.append("file", new Blob([buf], { type: "audio/mpeg" }), "a.mp3");
  fd.append("model", "whisper-1");
  fd.append("response_format", "verbose_json");
  fd.append("timestamp_granularities[]", "word");
  const wr = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST", headers: { Authorization: `Bearer ${OAI}` }, body: fd,
  });
  const words = wr.ok ? ((await wr.json()).words || []) : [];
  const target = norm(require_).split(" ")[0];
  const anchorWords = norm(clause).split(" ");
  const idx = anchorWords.indexOf(target);
  // Map the clause's word position onto the draw's word list by matching the run of words
  // just before the phrase, which is robust to the transcriber renaming the phrase itself.
  let cut = null;
  if (idx > 1 && words.length) {
    const key = anchorWords.slice(Math.max(0, idx - 2), idx).join(" ");
    for (let i = 0; i + 1 < words.length; i++) {
      if (norm(words[i].word + " " + words[i + 1].word) === key) {
        cut = { s: Math.max(0, words[i].start - 0.15), e: words[Math.min(words.length - 1, i + 4)].end + 0.15 };
        break;
      }
    }
  }
  let isolated = null;
  if (cut) {
    // Re-ENCODE the window rather than stream-copy it. A copy cut at an arbitrary offset
    // can leave a partial MP3 frame, and the transcriber rejects the result with a 400 —
    // which reads as "the phrase is wrong" when in fact nothing was ever listened to.
    // The window is also floored at 1.2 s for the same reason: too short is not evidence.
    const { execFileSync } = await import("node:child_process");
    const clip = join(scratch, `${segId}.redraw${d}.window.mp3`);
    const s0 = cut.s;
    const e0 = Math.max(cut.e, cut.s + 1.2);
    execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", rawPath,
      "-ss", String(s0), "-to", String(e0), "-ac", "1", "-ar", "24000",
      "-c:a", "libmp3lame", "-b:a", "128k", clip]);
    try {
      isolated = await hear(readFileSync(clip));
    } catch (e) {
      console.log(`      (isolated window unreadable: ${e.message} — falling back to the full read-back)`);
      isolated = null;
    }
  }
  // Fall back to the whole-segment transcript only if the window could not be produced.
  // It is weaker evidence — sentence smoothing can hide a bad reading — so a pass here is
  // recorded as such rather than silently treated as equivalent.
  let viaFullRead = false;
  if (isolated === null) {
    isolated = await hear(readFileSync(rawPath));
    viaFullRead = true;
  }
  const ok = isolated !== null && norm(isolated).includes(norm(require_));
  log.push({ draw: d, billed, checked_on: viaFullRead ? "full segment" : "isolated window", heard: isolated, accepted: ok });
  console.log(`    draw ${d}  billed ${billed}  ${viaFullRead ? "full read-back" : "isolated window"}: ${isolated === null ? "(none)" : `"${isolated.length > 120 ? "..." + isolated.slice(-120) : isolated}"`}  ${ok ? "ACCEPT" : "reject"}`);
  if (ok) { accepted = { d, rawPath, billed }; break; }
}
if (!accepted) {
  console.error(`\n  NO DRAW PASSED after ${draws} attempts. The existing master is UNCHANGED.`);
  console.error(`  ${draws} consecutive failures means this is systematic, not a bad draw — that is a`);
  console.error(`  decision (pronunciation dictionary, or accept the reading), not something to retry.\n`);
  process.exit(1);
}

// ------------------------------------------------------------------ master + full gate
console.log(`\n  MASTER + GATE (draw ${accepted.d})`);
const outPath = join(mediaDir, `${segId}.mp3`);
const tmpOut = join(scratch, `${segId}.candidate.mp3`);
const m = master(accepted.rawPath, tmpOut);
const meas = measure(tmpOut, { f0: prev.f0_config ?? { fmin: 80, fmax: 400 } });
const a = {
  lufs_integrated: meas.integrated, lra: meas.lra, true_peak_dbfs: meas.truePeak,
  speech_lufs: meas.speechLufs, sample_rate: meas.probe.sample_rate, channels: meas.probe.channels,
  bit_rate: meas.probe.bit_rate, duration_s: +meas.probe.duration.toFixed(3),
};
const qa = {
  loudness: Math.abs(a.lufs_integrated - TARGET_LUFS) <= LUFS_TOLERANCE,
  true_peak: a.true_peak_dbfs <= TRUE_PEAK_CEILING,
  format: a.sample_rate === FORMAT.sample_rate && a.channels === FORMAT.channels &&
          Math.abs(a.bit_rate - FORMAT.bit_rate) < 4000 && meas.probe.streams === 1,
  flat: meas.flat === 0,
  no_trunc: meas.truncation.ok,
  pause: meas.pauses.length === 0,
  f0: meas.f0.onsetHz !== null && meas.f0.bodyHz !== null && meas.f0.onsetHz >= 0.75 * meas.f0.bodyHz,
};
for (const [k, v] of Object.entries(qa)) console.log(`    ${k.padEnd(11)} ${v ? "PASS" : "FAIL"}`);
const hard = ["loudness", "true_peak", "format", "flat", "no_trunc"];
const failed = hard.filter((k) => !qa[k]);
if (failed.length) {
  console.error(`\n  REJECTED — the accepted draw fails ${failed.join(", ")}. Master UNCHANGED.\n`);
  process.exit(1);
}

writeFileSync(outPath, readFileSync(tmpOut));

/**
 * PROMOTE THE ACCEPTED DRAW TO BE *THE* RAW ON DISK.
 *
 * Without this, `<id>.raw.mp3` in the scratch directory is still the REJECTED draw, and
 * `tts-narration.mjs --remaster` — which is documented as free and safe because it re-derives
 * the master from the raw without calling any API — would silently restore the bad reading
 * and pass every audio gate while doing it. The rejected draw is kept beside it, renamed,
 * so the evidence is not lost.
 */
const rawCanonical = join(scratch, `${segId}.raw.mp3`);
if (existsSync(rawCanonical)) {
  writeFileSync(join(scratch, `${segId}.raw.REJECTED-draw-superseded.mp3`), readFileSync(rawCanonical));
}
writeFileSync(rawCanonical, readFileSync(accepted.rawPath));
console.log(`    promoted draw ${accepted.d} to ${segId}.raw.mp3 — a later --remaster now re-derives the ACCEPTED reading`);
const side = {
  ...prev,
  mastering_detail: { i_raw: m.iRaw, gain_db: m.gainDb, calibration_passes: m.passes },
  audio: a,
  f0: {
    onset_hz: meas.f0.onsetHz === null ? null : +meas.f0.onsetHz.toFixed(1),
    body_hz: meas.f0.bodyHz === null ? null : +meas.f0.bodyHz.toFixed(1),
    voiced_frames: meas.f0.voicedFrames,
  },
  qa: { ...qa, duration: prev.qa?.duration ?? null },
  synthesis: {
    source: `redraw ${accepted.d}`,
    accepted_draw: accepted.d,
    draws: log.length,
    resynthesis_reasons: [`Gate B ASR: "${require_}" was not rendered correctly on the delivered draw`],
    method: "generate-and-verify on the SAME locked voice config; each draw read back by ASR and the " +
            "disputed clause re-checked on an isolated window, which sentence-level smoothing cannot reach",
    draw_log: log.map((l) => ({ draw: l.draw, billable_units: l.billed, checked_on: l.checked_on, accepted: l.accepted })),
  },
  sha256: sha256(outPath),
  date: new Date().toISOString().slice(0, 10),
};
writeFileSync(sidePath, JSON.stringify(side, null, 2) + "\n");
console.log(`\n  REPLACED  ${segId}.mp3  ${a.duration_s}s  I ${a.lufs_integrated}  sha256 ${side.sha256.slice(0, 16)}...`);
console.log(`  Durations moved — re-run scripts/plan-lipsync-batches.mjs before any paid video work.\n`);
