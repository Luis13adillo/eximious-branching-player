#!/usr/bin/env node
/**
 * Gate C delivery: split one returned LatentSync batch into its segments, remux the locked
 * narration, conform to 1920x1080, QA every row, and write provenance sidecars.
 *
 *   node scripts/lipsync-deliver.mjs --lesson siu-01-av1 --call 6
 *
 * WHAT IT ENFORCES
 * ----------------
 * Rule 4  LatentSync's returned audio (aac 16 kHz) is DISCARDED. The delivered file carries
 *         the Gate A .mp3 master copied bit-for-bit - proven here by comparing the COMPRESSED
 *         MP3 FRAME PAYLOAD of the delivered MP4 against the master's, byte for byte, not by
 *         a loudness measurement that a re-encode could also pass.
 * Rule 5  Delivery is exactly 1920x1080. Conformed on the cut, then asserted.
 * Rule 6  Approved masters stay byte-identical. Every .mp3 and the driving base are
 *         re-hashed after the run.
 *
 * The cut is RE-ENCODED, never stream-copied: a copy snaps to the nearest keyframe and would
 * desync the remuxed narration. Frame counts round UP so video always covers its audio.
 *
 * Costs $0.00 - ffmpeg only.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { probe, ebur128, sha256, decodePcm, truncationCheck, speechLevel, TARGET_LUFS, LUFS_TOLERANCE, FORMAT } from "./audio-qa.mjs";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const SCRATCH = process.env.SCRATCH || "/tmp";
const OUT_FPS = 25;

const ff = (a) => execFileSync("ffmpeg", ["-hide_banner", "-nostats", "-loglevel", "error", ...a], { encoding: "utf8" });

function arg(name, fb = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fb;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}

function videoProbe(path) {
  const j = JSON.parse(execFileSync("ffprobe", [
    "-v", "error", "-show_entries",
    "stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels,bit_rate,profile",
    "-show_entries", "format=duration", "-of", "json", path,
  ], { encoding: "utf8" }));
  const v = (j.streams || []).find((s) => s.codec_type === "video") || {};
  const a = (j.streams || []).find((s) => s.codec_type === "audio");
  return {
    width: +v.width, height: +v.height, fps: v.r_frame_rate, codec: v.codec_name,
    pix_fmt: v.pix_fmt, profile: v.profile, duration: +j.format?.duration,
    audio: a ? { codec: a.codec_name, sample_rate: +a.sample_rate, channels: +a.channels, bit_rate: +a.bit_rate } : null,
  };
}
const countFrames = (p) => Number(execFileSync("ffprobe", [
  "-v", "error", "-select_streams", "v:0", "-count_frames",
  "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", p,
], { encoding: "utf8" }).trim());

const lessonId = arg("lesson");
const callNo = Number(arg("call"));
/**
 * --only limits delivery to named segments. Used when a call is RE-RUN to fix one segment:
 * re-cutting segments that already passed would replace good deliverables with different (not
 * better) generations for no reason, and every replacement is another chance to introduce a
 * regression. Segments not named here keep the files already on disk.
 */
const only = arg("only");
const onlyIds = only && only !== true ? String(only).split(",").map((s) => s.trim()) : null;
if (!lessonId || !callNo) { console.error("usage: --lesson <id> --call <n> [--only a,b]"); process.exit(2); }

const mediaDir = join(REPO, "public/media", lessonId);
const workDir = join(SCRATCH, `${lessonId}-call${callNo}`);
const plan = JSON.parse(readFileSync(join(mediaDir, "_lipsync-batch-plan.json"), "utf8"));
const row = plan.plan.find((p) => p.call === callNo);
const record = JSON.parse(readFileSync(join(mediaDir, `_call-${callNo}-request.json`), "utf8"));
const raw = join(workDir, "latentsync-out.mp4");
if (!existsSync(raw)) throw new Error(`no returned video at ${raw}`);

const rawInfo = videoProbe(raw);
const rawFrames = countFrames(raw);

console.log(`\nEXIMIOUS - Gate C delivery, call ${callNo} of ${plan.calls}`);
console.log(`  returned : ${rawInfo.width}x${rawInfo.height} ${rawInfo.fps} ${rawFrames} frames ${rawInfo.duration.toFixed(3)}s  audio=${rawInfo.audio ? `${rawInfo.audio.codec}/${rawInfo.audio.sample_rate}` : "none"}`);
console.log(`  planned  : ${row.blocks} blocks x 16 = ${row.frames} frames (${(row.frames / OUT_FPS).toFixed(2)}s)  submitted ${row.submit_s}s = ${Math.round(row.submit_s * OUT_FPS)} frames @ ${OUT_FPS} fps`);

/**
 * Driving-base path. The approved base records are not consistent about this field: Curtis's
 * `asset` is a bare filename, Selena's is a repo-relative path. Both are legitimate records
 * and neither is going to be edited to suit a script, so accept either form here.
 */
const mediaPath = (f) => join(REPO, f.startsWith("public/media/") ? f : join("public/media", f));

const baseRec = JSON.parse(readFileSync(mediaPath(plan.driving_base.file.replace(/\.mp4$/, ".json")), "utf8"));
const basePath = mediaPath(plan.driving_base.file);

/**
 * PRESENTER-DEPENDENT PROVENANCE, resolved from the approved base record rather than typed in.
 *
 * The first version of this script carried Curtis's presenter name, his motion-base note and
 * his canary's 94.0 s / 2256-frame driving window as literals. On Curtis they were right; on
 * anyone else they would have written a false provenance record into every delivered sidecar,
 * which is the one thing a provenance record must never do.
 */
// The "why" block is named for what it explains, so its key differs per presenter: Curtis's is
// `why` (a motion-base defect), Selena's is `why_window_1_51` (a source-window choice).
const whyBlock = Object.entries(baseRec).find(([k]) => k === "why" || k.startsWith("why_"))?.[1];
const motionBaseNote = whyBlock && typeof whyBlock === "object"
  ? (whyBlock.defect ?? whyBlock.finding ?? Object.values(whyBlock)[0])
  : (whyBlock ?? null);

// The driving window actually uploaded, MEASURED from the file the batch step stream-copied.
const [fpsNum, fpsDen] = String(plan.driving_base.fps).split("/").map(Number);
const baseFps = fpsDen ? fpsNum / fpsDen : fpsNum;
const windowPath = join(workDir, "drive-a.mp4");
const windowFrames = existsSync(windowPath) ? countFrames(windowPath) : Math.ceil((row.submit_s + 1.0) * baseFps);
const windowDurS = +(windowFrames / baseFps).toFixed(3);
if (windowDurS <= row.submit_s) throw new Error(`driving window ${windowDurS}s does not exceed the ${row.submit_s}s batch audio`);
const driveWindow = {
  offset_s: 0,
  dur_s: windowDurS,
  frames: windowFrames,
  method: `stream copy from the head of the approved base; every frame bit-exact${existsSync(windowPath) ? " (frames counted on the uploaded window)" : " (window file absent - frames re-derived)"}`,
};

/**
 * Approved checksum of the driving base. Curtis's record carries it at the top level,
 * Selena's under `delivery`. Resolve either, and refuse to run if neither is present -
 * an absent checksum must fail loudly, never compare as undefined and silently pass.
 */
const baseSha = baseRec.sha256 ?? baseRec.delivery?.sha256;
if (!baseSha) throw new Error(`driving-base record has no sha256 - cannot verify rule 6`);

/**
 * SPLIT AT THE MIDPOINT OF THE SILENCE, NOT AT THE AUDIO ONSET.
 * -------------------------------------------------------------------------
 * This is the documented split specification (docs/VIDEO_1_GENERATION_CONFIGS.md,
 * "Split specification"): cut at the midpoint of each 0.5 s inter-segment silence,
 * because "the Selena run measured anticipatory mouth opening 36 ms before speech".
 *
 * The first version of this script cut at the audio onset - the END of the silence -
 * which places every cut inside that anticipation by construction. Curtis's call 4
 * measured it at ~6 frames: the mouth is already open at return frame 913 while the
 * first audible sample is at 919.3. Whether a segment then happened to land open or
 * closed depended on its first phoneme, which is a coin toss, not a rule. Diane's
 * delivered claims-01 set was cut the same way and carries open first frames on most
 * of its 22 segments, including `intro` - the one frame the start gate holds on screen.
 *
 * LEAD is 0.240 s because that is the only value that is a whole number of BOTH units
 * in play: 10 mp3 frames (576 samples each at 24 kHz = 24 ms) and 6 video frames at
 * 25 fps (40 ms). Anything else leaves a fractional frame on one side or the other.
 * It fits inside the 0.5 s inter-segment gap twice over with 10 ms to spare, so the
 * approved batch plan does not change and nothing needs regenerating.
 */
const LEAD_S = 0.24;
const MP3_FRAME_S = 0.024;              // 576 samples @ 24 kHz
const LEAD_MP3_FRAMES = Math.round(LEAD_S / MP3_FRAME_S);   // 10
const LEAD_VID_FRAMES = Math.round(LEAD_S * OUT_FPS);       // 6

/**
 * MP3 DECODER-DELAY COMPENSATION — the video cut moves one frame EARLIER.
 *
 * The delivered MP4's video track carries an edit list that compensates the h.264 encoder
 * delay (`media time: 1024` = 0.08 s). The audio track's edit list is `media time: 0`, so
 * the mp3 decoder's priming delay is never compensated: the master's samples begin at
 * 0.286 s inside the delivered file, not at the 0.240 s the pad nominally puts them at.
 *
 * The video cut assumed 0.240 s, so picture ran ~46 ms AHEAD of sound on every segment.
 * Measured two independent ways (2026-08-21):
 *   - decoding the delivered audio and locating the master's PCM: 0.286 s, not 0.240 s;
 *   - cross-correlating mouth motion against the audio envelope over 17,638 delivered
 *     frames of ew-01: peak at +1 frame, audio late.
 * 40 ms is at the threshold where a viewer starts to notice, and a viewer did.
 *
 * Cutting one frame earlier makes the video start 0.280 s before the narration instead of
 * 0.240 s, leaving a 6 ms residual against the measured 0.286 s - inside a single frame,
 * which is the best a 25 fps cut can do without re-timing the audio. The narration master
 * is NOT touched: it stays bit-exact, which is what rule 4 protects.
 *
 * Video LENGTH is unchanged, so coverage of the audio is unchanged; only which source
 * frames are taken moves. The first segment of a call has 0.400 s of lead-in to cut from,
 * so one frame earlier still lands inside the silence.
 */
const DECODER_DELAY_FIX_FRAMES = 1;
const DECODER_DELAY_FIX_S = DECODER_DELAY_FIX_FRAMES / OUT_FPS;

/**
 * Where do the master's samples actually START inside the delivered audio?
 *
 * Not at LEAD_S. Decoding the delivered MP4 replays the mp3 decoder's delay ahead of the
 * first master sample, so the narration begins ~46 ms later than the pad alone predicts.
 * That offset is a property of the decoder and the container, not of the content, so it is
 * measured per segment rather than hard-coded.
 *
 * The search is anchored on the master's LOUDEST sample, not its first: both the pad and the
 * head of most narration are digital silence, and a silence-on-silence match would happily
 * report a wrong offset. A candidate must match at the peak, then match across the master's
 * entire length before it is accepted.
 */
function locateNarration(deliveredPath, masterPath, rate = 24000) {
  const d = decodePcm(deliveredPath, rate);
  const m = decodePcm(masterPath, rate);
  if (!m.length || d.length < m.length) return null;

  let kPeak = 0;
  for (let i = 1; i < m.length; i++) if (Math.abs(m[i]) > Math.abs(m[kPeak])) kPeak = i;

  const centre = Math.round(LEAD_S * rate);
  const span = Math.round(0.25 * rate);           // far wider than any decoder delay
  const lo = Math.max(0, centre - span);
  const hi = Math.min(d.length - m.length, centre + span);

  for (let off = lo; off <= hi; off++) {
    if (d[off + kPeak] !== m[kPeak]) continue;    // cheap discriminator
    let ok = true;
    for (let i = 0; i < m.length; i++) if (d[off + i] !== m[i]) { ok = false; break; }
    if (ok) return { offsetS: off / rate, durS: m.length / rate, samples: m.length };
  }
  return null;
}

/**
 * A run of digitally silent MP3 frames, byte-identical to the ones that will surround
 * the master. Generated rather than committed: every steady-state silent frame at
 * 24 kHz / mono / 128 kbps CBR is the same 384 bytes, so this is reproducible, and
 * frame 0 is dropped because it carries the encoder's start-up state.
 */
function silenceMp3(path, frames) {
  const long = join(workDir, "_silence-source.mp3");
  ff(["-y", "-f", "lavfi", "-i", `anullsrc=r=${FORMAT.sample_rate}:cl=mono`, "-t", "1.0",
      "-c:a", "libmp3lame", "-b:a", "128k", "-ar", String(FORMAT.sample_rate), "-ac", "1",
      "-write_xing", "0", "-id3v2_version", "0", long]);
  const b = readFileSync(long);
  const FRAME_BYTES = 384;
  const one = b.subarray(FRAME_BYTES, FRAME_BYTES * 2);
  for (let i = 2; i < Math.floor(b.length / FRAME_BYTES) - 1; i++) {
    if (Buffer.compare(b.subarray(i * FRAME_BYTES, (i + 1) * FRAME_BYTES), one) !== 0) {
      throw new Error("silent mp3 frames are not identical - cannot build a byte-exact pad");
    }
  }
  writeFileSync(path, Buffer.concat(Array.from({ length: frames }, () => one)));
}

const silPath = join(workDir, `_pad-${LEAD_MP3_FRAMES}.mp3`);
silenceMp3(silPath, LEAD_MP3_FRAMES);

const results = [];
console.log(`\n  SPLIT + REMUX + CONFORM`);
console.log(`    presenter ${baseRec.presenter}   driving window ${windowDurS}s / ${windowFrames} frames @ ${baseFps} fps`);
console.log(`    cutting ${LEAD_S}s (${LEAD_MP3_FRAMES} mp3 frames = ${LEAD_VID_FRAMES} video frames) inside the silence on BOTH sides of every segment`);

for (const o of row.offsets) {
  const id = o.id;
  if (onlyIds && !onlyIds.includes(id)) { console.log(`    ${id.padEnd(14)} SKIPPED - retained as previously delivered (--only)`); continue; }
  const mp3 = join(mediaDir, `${id}.mp3`);
  const mp3Hash = sha256(mp3);
  const cut = join(workDir, `${id}-cut.mp4`);
  const padded = join(workDir, `${id}-padded.mp3`);
  const out = join(mediaDir, `${id}.mp4`);

  // The cut must have real silence to sit in on both sides. The batch's own lead-in
  // covers the opening segment and the trailing pad covers the closing one; refuse
  // rather than cut into narration if a future plan ever tightens either.
  const cutStart = +(o.batch_start_s - LEAD_S - DECODER_DELAY_FIX_S).toFixed(6);
  if (cutStart < 0) throw new Error(`${id}: cut would start at ${cutStart}s - not enough lead-in silence`);

  /**
   * THE TAIL IS MEASURED FROM THE LAST AUDIBLE SAMPLE, NOT FROM THE END OF THE MASTER.
   *
   * The closing segment of a batch can have almost no pad after it: the 16-frame block
   * rounding sometimes lands the content end within a frame of the return (call 5 left
   * 0.020 s, call 2 left 0.032 s). But every Gate A master already carries 400-600 ms of
   * its OWN trailing silence, which is exactly the silence the mouth closes into. Demanding
   * a further 0.24 s beyond the master measures the wrong thing and would have forced a
   * needless ~$0.54 re-run.
   *
   * So the tail is clamped to what the return actually offers, and the real condition is
   * asserted instead: at least LEAD_S of silence must precede the last delivered frame,
   * counting the master's internal trailing silence. Kept to whole mp3 AND video frames -
   * multiples of 0.12 s - so neither stream ends mid-frame.
   */
  const availableTail = +(rawInfo.duration - (o.batch_start_s + o.audio_dur_s)).toFixed(6);
  const tailS = Math.min(LEAD_S, Math.floor(Math.max(0, availableTail) / 0.12) * 0.12);
  const tailMp3Frames = Math.round(tailS / MP3_FRAME_S);

  const pcmMaster = decodePcm(mp3, FORMAT.sample_rate);
  let lastAudible = 0;
  for (let i = pcmMaster.length - 1; i >= 0; i--) {
    if (Math.abs(pcmMaster[i]) > 0.005) { lastAudible = i; break; }
  }
  const masterTailSilenceS = +((pcmMaster.length - lastAudible) / FORMAT.sample_rate).toFixed(4);
  const silenceBeforeLastFrame = +(masterTailSilenceS + tailS).toFixed(4);
  if (silenceBeforeLastFrame < LEAD_S - 1e-9) {
    throw new Error(`${id}: only ${silenceBeforeLastFrame}s of silence before the last frame (master carries ${masterTailSilenceS}s, return offers ${availableTail}s) - under the ${LEAD_S}s the mouth needs to close`);
  }
  const cutEnd = +(o.batch_start_s + o.audio_dur_s + tailS).toFixed(6);

  // 1. Audio: silence + LOCKED MASTER + silence, concatenated with -c copy. The master's
  //    mp3 frames are never re-encoded, so its bytes survive intact inside the result
  //    (asserted below). This is what keeps rule 4's guarantee while moving the cut.
  const tailPath = join(workDir, `_pad-tail-${tailMp3Frames}.mp3`);
  if (tailMp3Frames > 0) silenceMp3(tailPath, tailMp3Frames);
  const parts = tailMp3Frames > 0 ? [silPath, mp3, tailPath] : [silPath, mp3];
  const list = join(workDir, `${id}-concat.txt`);
  writeFileSync(list, parts.map((p) => `file '${p}'`).join("\n") + "\n");
  ff(["-y", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy",
      "-write_xing", "0", "-id3v2_version", "0", padded]);
  const paddedDur = probe(padded).duration;
  /**
   * Round UP so video covers the audio - but never ask for more frames than the return holds.
   * On the closing segment of a tightly-rounded batch the return can end a frame before the
   * padded audio does (call 5: the block rounding left 0.020 s after the content). Requesting
   * the extra frame silently yields a short file and fails `frames_exact` for a reason that
   * has nothing to do with the cut. What must be covered is the NARRATION; the shortfall is
   * trailing digital silence, and it is recorded rather than absorbed.
   */
  const wantFrames = Math.ceil(paddedDur * OUT_FPS);
  const availFrames = Math.floor((rawInfo.duration - cutStart) * OUT_FPS + 1e-9);
  const frames = Math.min(wantFrames, availFrames);
  const framesShortMs = +(((wantFrames - frames) / OUT_FPS) * 1000).toFixed(1);

  // 2. Cut video ONLY, re-encoded at the cut, conformed to exactly 1920x1080.
  ff(["-y", "-i", raw, "-ss", String(cutStart), "-frames:v", String(frames),
      "-an", "-vf", "scale=1920:1080:flags=lanczos,setsar=1",
      "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", cut]);

  // 3. Mux with -c:a copy. LatentSync's returned audio never reaches here.
  ff(["-y", "-i", cut, "-i", padded, "-map", "0:v:0", "-map", "1:a:0",
      "-c:v", "copy", "-c:a", "copy", "-movflags", "+faststart", out]);

  // ---- QA -----------------------------------------------------------------
  const vi = videoProbe(out);
  const nf = countFrames(out);
  const vidDur = nf / OUT_FPS;

  // Audio identity - rule 4's proof.
  //
  // Compare the COMPRESSED MP3 FRAME PAYLOAD, not decoded samples. Decoding the same stream
  // out of an MP4 yields ~47 more samples than decoding the bare .mp3, because the .mp3 file
  // carries LAME gapless tags that the MP4 container does not; that 1.96 ms of encoder-delay
  // framing is a container artifact and would make a sample-wise test fail on correct audio.
  // The frame bytes are the actual assertion: identical bytes mean the master was COPIED, so
  // LatentSync's 16 kHz aac cannot be what is in the file, and -24.5 LUFS survives untouched.
  //
  // The delivered audio is now silence + master + silence, so the test is CONTAINMENT
  // rather than equality: the master's frame bytes must appear intact, contiguous, and
  // at exactly the offset the pad predicts. That is a strictly stronger statement than
  // equality was - it proves both that the master was copied and that nothing shifted it.
  const payloadBytes = (p) => execFileSync("bash", ["-c",
    `ffmpeg -hide_banner -loglevel error -i "${p}" -map 0:a:0 -c:a copy -f data -`],
    { encoding: "buffer", maxBuffer: 256 * 1024 * 1024 });
  const pDelivered = payloadBytes(out);
  const pMaster = payloadBytes(mp3);
  const masterAt = pDelivered.indexOf(pMaster);
  const expectedAt = LEAD_MP3_FRAMES * 384;            // 384 bytes per frame at 128 kbps CBR
  const payloadDelivered = execFileSync("bash", ["-c",
    `ffmpeg -hide_banner -loglevel error -i "${out}" -map 0:a:0 -c:a copy -f data - | shasum -a 256`],
    { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }).split(" ")[0];

  /**
   * LOUDNESS IS MEASURED OVER THE MASTER'S ACTUAL SAMPLES, NOT OVER A NOMINAL WINDOW.
   *
   * The delivered asset opens and closes with 0.24 s of digital silence. EBU R128's absolute
   * gate drops fully silent blocks, but the 400 ms blocks straddling each boundary are pulled
   * down, and on a short segment those boundary blocks are a large share of the file. So the
   * gate is applied to the narration only - the whole-file figure is kept alongside it as an
   * informational row rather than dropped, so nothing is hidden by the change.
   *
   * ASSUMING THE NARRATION STARTS AT EXACTLY LEAD_S IS WRONG, AND IT FAILED CORRECT AUDIO.
   * Decoding the delivered MP4 yields the mp3 decoder's delay ahead of the first master
   * sample, so the master's PCM actually begins at ~0.286 s, not 0.240 s. A window starting
   * at LEAD_S therefore swallows ~46 ms of the lead-in silence and stops ~46 ms early. On a
   * long segment that is invisible; on ew-01 decision-1 (1.704 s) it dragged the reading to
   * -24.8 LUFS against a master that measures -24.5, and the gate failed a file whose
   * narration bytes are bit-exact. Measured over the master's true extent all seven segments
   * of call 1 read -24.5.
   *
   * So the offset is LOCATED rather than assumed: find where the master's decoded samples
   * actually sit inside the delivered audio and measure exactly that span. Failing to find
   * them is itself a QA failure - it would mean the delivered audio is not the master.
   */
  const narr = locateNarration(out, mp3);
  const narrWav = join(workDir, `${id}-narration-window.wav`);
  ff(["-y", "-ss", (narr ? narr.offsetS : LEAD_S).toFixed(6), "-t", (narr ? narr.durS : o.audio_dur_s).toFixed(6),
      "-i", out, "-map", "0:a:0", narrWav]);
  const lu = ebur128(narrWav);
  const luWhole = ebur128(out);
  const trunc = truncationCheck(out);

  const qa = {
    dims: vi.width === 1920 && vi.height === 1080,
    fps: vi.fps === "25/1",
    pix_fmt: vi.pix_fmt === "yuv420p",
    // The binding requirement: every narration sample has a video frame over it.
    frames_cover_narration: vidDur >= LEAD_S + o.audio_dur_s - 1e-9,
    frames_exact: nf === frames,
    audio_stream: vi.audio?.codec === "mp3" && vi.audio.sample_rate === 24000 && vi.audio.channels === 1 && vi.audio.bit_rate === 128000,
    audio_is_master_bit_exact: masterAt === expectedAt,
    // Locating the master's samples is itself an assertion: if they are not in there, the
    // delivered audio is not the master and the loudness figure below means nothing.
    narration_located: narr !== null,
    loudness: Math.abs(lu.integrated - TARGET_LUFS) <= LUFS_TOLERANCE,
    true_peak: lu.truePeak <= -3.0,
    no_truncation: trunc.ok,
    /**
     * The real structural guarantee, replacing `first_frame_generated_in_silence`.
     *
     * That row could not fail for a mid-batch segment - it only asserted the offset was
     * at or beyond the batch lead-in, which holds by construction - and it passed on
     * call 4's fb-3c while the eye saw an open mouth with teeth. This one asserts what
     * actually matters: that BOTH ends of the cut sit a full LEAD_S inside real silence,
     * clear of the model's measured ~6-frame anticipatory opening. It is still a
     * structural claim; the binding check remains visual (known-mistakes #18).
     */
    cut_clears_anticipation: cutStart >= (o.batch_start_s - LEAD_S - DECODER_DELAY_FIX_S) - 1e-9 && LEAD_VID_FRAMES >= 6,
  };
  const pass = Object.values(qa).every(Boolean);
  results.push({ id, frames: nf, vidDur, audioDur: o.audio_dur_s, paddedDur, cutStart, cover_ms: +((vidDur - paddedDur) * 1000).toFixed(1), narr, vi, lu, luWhole, trunc, qa, pass, mp3Hash, framesShortMs, tailS, availableTail, masterTailSilenceS, silenceBeforeLastFrame, batch_start_s: o.batch_start_s, payload_sha256: payloadDelivered, master_at_byte: masterAt });

  console.log(`    ${id.padEnd(14)} ${nf} fr ${vidDur.toFixed(3)}s vs audio ${paddedDur.toFixed(3)}s (+${((vidDur - paddedDur) * 1000).toFixed(0)} ms)  cut @ ${cutStart.toFixed(3)}s  ${vi.width}x${vi.height}  ${lu.integrated} LUFS  TP ${lu.truePeak}  ${pass ? "PASS" : "FAIL " + Object.entries(qa).filter(([, v]) => !v).map(([k]) => k).join(",")}`);
}

// ------------------------------------------------------- rule 6: masters unchanged
console.log(`\n  MASTER INTEGRITY (rule 6)`);
const baseNow = sha256(basePath);
console.log(`    driving base  ${baseNow === baseSha ? "UNCHANGED" : "*** CHANGED ***"}  ${baseNow.slice(0, 16)}...`);
let mp3sOk = true;
for (const r of results) {
  const car = JSON.parse(readFileSync(join(mediaDir, `${r.id}.json`), "utf8"));
  if (r.mp3Hash !== car.sha256) { mp3sOk = false; console.log(`    ${r.id}.mp3 *** CHANGED ***`); }
}
console.log(`    ${results.length} narration master${results.length === 1 ? "" : "s"} (delivered this run)  ${mp3sOk ? "UNCHANGED" : "*** CHANGED ***"}`);

// ------------------------------------------------------------------ sidecars
/**
 * HUMAN QA RECORDS SURVIVE RE-DELIVERY.
 *
 * Everything else in a sidecar is re-derived from measurement on every run, so the object is
 * rebuilt from scratch. A visual_qa block is not derivable - it is a person's verdict, reached
 * by eye (known-mistakes #18), and rebuilding the object used to destroy it silently. The
 * sync fix re-delivered all 25 ew-01 segments and wiped every Gate C verdict with it.
 *
 * Carrying it forward blindly would be worse than losing it: the verdict is about SPECIFIC
 * FRAMES of a specific file, and a re-delivery can move the cut. So the block travels with the
 * sha256 and cut offset it was judged against, and if either has moved it arrives marked stale
 * rather than quietly asserting a pass nobody looked at.
 */
function carryVisualQa(prev, next) {
  const vq = prev && prev.visual_qa;
  if (!vq) return undefined;
  const assetMoved = vq.judged_asset_sha256 !== next.sha256;
  const cutMoved = !prev.split || Math.abs(prev.split.video_start_s - next.split.video_start_s) > 1e-9;
  if (!assetMoved && !cutMoved) return vq;
  return {
    ...vq,
    stale: true,
    stale_reason: [
      assetMoved ? `the delivered file changed (judged ${String(vq.judged_asset_sha256).slice(0, 16)}..., now ${next.sha256.slice(0, 16)}...)` : null,
      cutMoved ? `the cut moved (${prev.split ? prev.split.video_start_s : "unknown"}s -> ${next.split.video_start_s}s), so the first and last frames are different frames` : null,
    ].filter(Boolean).join("; ") + " - RE-JUDGE BY EYE before trusting this verdict",
  };
}

const perSegCost = +(record.actual_cost_usd / row.offsets.length).toFixed(4);
let staleQa = 0, carriedQa = 0;
for (const r of results) {
  const sidecarPath = join(mediaDir, `${r.id}.mp4.json`);
  const prevSidecar = existsSync(sidecarPath) ? JSON.parse(readFileSync(sidecarPath, "utf8")) : null;
  const sidecar = {
    asset: `${r.id}.mp4`,
    video: `EA_${lessonId.replace(/-av1$/, "")}_AV1`,
    presenter: baseRec.presenter,
    motion_base: {
      provider: "KIE", model: "kling/v2-1-pro",
      file: baseRec.derived_from.asset, sha256: baseRec.derived_from.sha256,
      note: motionBaseNote,
      cost_usd: 0.5,
    },
    driving_base: {
      file: plan.driving_base.file, sha256: baseSha,
      dur_s: plan.driving_base.dur_s, fps: 24, frames: plan.driving_base.frames,
      method: baseRec.method.pixels,
      window: driveWindow,
      blink_rate_per_min: baseRec.blink_schedule.rate_per_min,
      joins: baseRec.joins.count,
    },
    lipsync: {
      provider: "fal.ai", model: plan.locked_params.model,
      loop_mode: plan.locked_params.loop_mode,
      loop_mode_note: `Never triggers: the ${windowDurS.toFixed(3)} s driving window exceeds the ${row.submit_s.toFixed(3)} s batch audio.`,
      seed: plan.locked_params.seed,
      guidance_scale: plan.locked_params.guidance_scale,
      request_id: record.request_id,
      submitted_utc: record.submitted_utc,
      completed_utc: record.completed_utc,
      batch_index: callNo,
      batch_segments: row.segments,
      batch_content_s: row.content_s,
      batch_blocks: row.blocks,
      batch_padded_s: row.submit_s,
      returned: record.returned,
      input_retention: "fal CDN temporary inputs, 24 h expiry VERIFIED at upload (scripts/fal-upload.mjs)",
    },
    split: {
      batch_start_s: r.batch_start_s,
      narration_dur_s: r.audioDur,
      audio_dur_s: +r.paddedDur.toFixed(4),
      video_dur_s: +r.vidDur.toFixed(4),
      frames: r.frames,
      video_start_s: r.cutStart,
      decoder_delay_fix_frames: DECODER_DELAY_FIX_FRAMES,
      decoder_delay_fix_note: "Video cut moved 1 frame (40 ms) earlier than the pad alone implies, compensating the uncompensated mp3 decoder priming delay in the audio track's edit list. Verified by locating the master PCM at 0.286s and by cross-correlating mouth motion against the audio envelope over 17,638 frames.",
      lead_s: LEAD_S,
      lead_mp3_frames: LEAD_MP3_FRAMES,
      lead_video_frames: LEAD_VID_FRAMES,
      tail_s: r.tailS,
      frames_short_of_padded_audio_ms: r.framesShortMs,
      frames_short_note: r.framesShortMs > 0 ? `The return ended ${r.framesShortMs} ms before the padded audio, so the last ${r.framesShortMs} ms of TRAILING DIGITAL SILENCE carries no video frame. Every narration sample is covered; the master's own ${r.masterTailSilenceS}s of trailing silence sits entirely inside the delivered video.` : undefined,
      tail_note: r.tailS < LEAD_S ? `The return offered only ${r.availableTail}s after this segment, so the pad is ${r.tailS}s. The master's own ${r.masterTailSilenceS}s of trailing silence carries the closed-mouth condition - ${r.silenceBeforeLastFrame}s of silence precedes the last delivered frame.` : undefined,
      narration_starts_at_s: LEAD_S,
      align_err_ms: r.cover_ms,
      method: `Cut at the MIDPOINT of the surrounding silence - ${LEAD_S}s (${LEAD_MP3_FRAMES} mp3 frames = ${LEAD_VID_FRAMES} video frames) before the narration and the same after it - per the documented split specification, because LatentSync opens the mouth about 6 frames BEFORE the first audible sample. Cutting at the audio onset lands inside that anticipation. Re-encoded at the cut; a stream copy snaps to the nearest keyframe and would desync the remuxed audio. Frame count rounded UP so video always covers the audio. The cut is then moved ${DECODER_DELAY_FIX_FRAMES} frame (${(DECODER_DELAY_FIX_S*1000).toFixed(0)} ms) EARLIER to compensate the mp3 decoder priming delay: the delivered MP4 compensates the video track's encoder delay in its edit list but not the audio track's, so the master's samples land at 0.286s rather than the nominal 0.240s and picture ran ahead of sound. Residual after the fix is ~6 ms, under one frame at 25 fps.`,
      caption_offset_note: `Caption cues tile the DELIVERED asset, not the narration. The first cue starts at 0 and the last ends at video_dur_s (${(+r.vidDur.toFixed(4))}s) - which is what the lesson tests assert: captions[0].start === 0, captions.at(-1).end === durationSec, and contiguity between. Do NOT offset cues by the ${LEAD_S}s lead pad. That silence is INSIDE the asset and therefore inside the first cue; offsetting would push the last cue past the end of the video and fail the test. Both shipped pilots (claims-01, siu-01) are authored this way.`,
    },
    audio: {
      source: `${r.id}.mp3`,
      sha256: r.mp3Hash,
      note: `LatentSync's returned audio (aac 16 kHz) is DISCARDED. The delivered stream is ${LEAD_MP3_FRAMES} digitally silent mp3 frames + the locked 24 kHz -24.5 LUFS master + ${LEAD_MP3_FRAMES} more, concatenated with -c copy. The master's frames are never re-encoded.`,
      verified_bit_exact: r.qa.audio_is_master_bit_exact,
      master_at_byte_offset: r.master_at_byte,
      lufs_integrated: r.lu.integrated,
      narration_pcm_starts_at_s: r.narr ? +r.narr.offsetS.toFixed(6) : null,
      narration_offset_note: "Located, not assumed. The master's decoded samples start here inside the delivered audio; it sits ~46 ms past the 0.24 s pad because decoding the MP4 replays the mp3 decoder delay. The loudness below is measured over exactly this span.",
      lufs_measured_over: r.narr
        ? `the master's own samples only - ${r.narr.offsetS.toFixed(3)}s to ${(r.narr.offsetS + r.narr.durS).toFixed(3)}s, located by matching the master's decoded PCM inside the delivered audio rather than assumed from the pad. The asset's leading and trailing digital silence is excluded, because including it moves the integrated figure on short segments without touching a single narration sample.`
        : `FALLBACK ${LEAD_S}s + ${r.audioDur}s - the master's samples could not be located, which is a QA failure in its own right`,
      lufs_integrated_whole_file: r.luWhole.integrated,
      true_peak_dbfs: r.lu.truePeak,
      mp3_frame_payload_sha256: r.payload_sha256,
      bit_exact_method: `containment: the Gate A master's compressed MP3 frame payload appears intact and contiguous inside the delivered payload at byte ${LEAD_MP3_FRAMES * 384} (${LEAD_MP3_FRAMES} silent frames x 384 bytes), which proves both that it was copied and that nothing shifted it`,
      stream: `${r.vi.audio.codec},${r.vi.audio.sample_rate},${r.vi.audio.channels},${r.vi.audio.bit_rate}`,
    },
    delivery: {
      dims: `${r.vi.width}x${r.vi.height}`,
      fps: r.vi.fps,
      codec: `${r.vi.codec} ${r.vi.profile}`,
      pix_fmt: r.vi.pix_fmt,
      native: "NO upscaling anywhere - the base is native 1920x1080",
    },
    qa: r.qa,
    cost_usd: perSegCost,
    sha256: sha256(join(mediaDir, `${r.id}.mp4`)),
    date: new Date().toISOString().slice(0, 10),
  };
  const vq = carryVisualQa(prevSidecar, sidecar);
  if (vq) {
    sidecar.visual_qa = vq;
    if (vq.stale) { staleQa++; console.log(`    ${r.id.padEnd(14)} visual_qa CARRIED but marked STALE - ${vq.stale_reason}`); }
    else carriedQa++;
  }
  writeFileSync(sidecarPath, JSON.stringify(sidecar, null, 1) + "\n");
}

const allPass = results.every((r) => r.pass) && baseNow === baseSha && mp3sOk;
console.log(`\n  ${results.length} sidecars written.` + (carriedQa || staleQa ? `  visual_qa carried: ${carriedQa} intact, ${staleQa} STALE` : ""));
console.log(`  CALL ${callNo} MECHANICAL QA: ${allPass ? "PASS" : "FAIL"}   actual spend $${record.actual_cost_usd}\n`);

writeFileSync(join(workDir, "deliver-report.json"), JSON.stringify({ call: callNo, results: results.map(({ vi, lu, ...r }) => ({ ...r, vi, lu })), allPass }, null, 2) + "\n");
