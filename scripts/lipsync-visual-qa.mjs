#!/usr/bin/env node
/**
 * Gate C visual QA: build the contact sheets a human (or the model) must LOOK AT.
 *
 *   node scripts/lipsync-visual-qa.mjs --lesson siu-01-av1 --call 6
 *
 * WHY SHEETS AND NOT A METRIC
 * ---------------------------
 * Curtis's own motion-base gate settled this. Take 2's record: "its mouth METRICS look mild
 * (aperture range 12.8% of mean, tracked frame-to-frame max 6.2/255) while the eye sees
 * teeth." A share-above-luma-150 box calibrated against take 2's known-open frames 5-40 and
 * known-closed frames 41-121 does not separate them at all (best gap 0.0000) - his beard and
 * skin tone flatten exactly the contrast the metric relies on.
 *
 * Known-mistakes #18 is therefore binding here: every mouth claim is confirmed BY EYE at
 * 2-3x zoom, never from a pixel metric alone. These sheets exist to be looked at. The
 * numbers printed alongside are supporting evidence, not the verdict.
 *
 * Costs $0.00 - ffmpeg only.
 */

import { readFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const SCRATCH = process.env.SCRATCH || "/tmp";
const ff = (a) => execFileSync("ffmpeg", ["-hide_banner", "-nostats", "-loglevel", "error", ...a], { encoding: "utf8" });

function arg(n, fb = null) {
  const i = process.argv.indexOf(`--${n}`);
  if (i === -1) return fb;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}

const lessonId = arg("lesson");
const callNo = Number(arg("call"));
const mediaDir = join(REPO, "public/media", lessonId);
const outDir = join(SCRATCH, `${lessonId}-call${callNo}`, "visual");
mkdirSync(outDir, { recursive: true });

const plan = JSON.parse(readFileSync(join(mediaDir, "_lipsync-batch-plan.json"), "utf8"));
const row = plan.plan.find((p) => p.call === callNo);

/**
 * Mouth region per presenter, seated composition. Generous box: the eye needs surrounding
 * context (beard line or jaw line, nostrils, chin) to judge lip closure, not a tight crop.
 *
 * Keyed on the APPROVED DRIVING BASE, not on the lesson, so a lesson can never be sheeted
 * against another presenter's crop - which is exactly what a hard-coded box would have done
 * the first time this ran on anyone but Curtis. Each box was set by extracting frame 1 of
 * that presenter's own base and LOOKING at it (known-mistakes #18).
 */
const MOUTH_BY_BASE = {
  "presenter-2-curtis-whitfield-driving-base.mp4": { x: 1120, y: 260, w: 260, h: 220 },
  "presenter-3-selena-navarro-driving-base.mp4": { x: 1070, y: 246, w: 260, h: 220 },
};
const baseFile = plan.driving_base.file.split("/").pop();
const MOUTH = MOUTH_BY_BASE[baseFile];
if (!MOUTH) throw new Error(`no mouth region recorded for driving base ${baseFile} - measure it by eye before sheeting`);
const crop = `crop=${MOUTH.w}:${MOUTH.h}:${MOUTH.x}:${MOUTH.y}`;

console.log(`\nGate C visual QA sheets -> ${outDir}\n`);

// ---- 1. First and last frame of every segment, mouth zoom -------------------
// The lips must be CLOSED at both ends of every segment: an open mouth on the first or last
// frame is what the player shows while a segment is paused or a decision overlay is up.
for (const o of row.offsets) {
  const mp4 = join(mediaDir, `${o.id}.mp4`);
  const n = Number(execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-count_frames",
    "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", mp4], { encoding: "utf8" }).trim());
  ff(["-y", "-i", mp4, "-vf", `select='eq(n\\,0)',${crop},scale=520:440:flags=neighbor`, "-frames:v", "1", join(outDir, `${o.id}-FIRST.png`)]);
  ff(["-y", "-i", mp4, "-vf", `select='eq(n\\,${n - 1})',${crop},scale=520:440:flags=neighbor`, "-vsync", "0", "-frames:v", "1", join(outDir, `${o.id}-LAST.png`)]);
  console.log(`  ${o.id.padEnd(14)} first/last of ${n} frames -> ${o.id}-FIRST.png / -LAST.png`);
}

// One sheet with all ten, so open-vs-closed is judged by comparison rather than in isolation.
// Columns = segments in this call, so row 1 really is every FIRST frame and row 2 every
// LAST frame, for any call size. The old fixed 5-wide layout only produced that on a 5-segment
// call and interleaved first/last on every other one.
const cols = row.offsets.length;
const ends = [...row.offsets.map((o) => `${o.id}-FIRST.png`), ...row.offsets.map((o) => `${o.id}-LAST.png`)];
ff(["-y", ...ends.flatMap((f) => ["-i", join(outDir, f)]),
  "-filter_complex", `${ends.map((_, i) => `[${i}:v]`).join("")}xstack=inputs=${ends.length}:layout=${ends.map((_, i) => `${(i % cols) * 520}_${Math.floor(i / cols) * 440}`).join("|")}[v]`,
  "-map", "[v]", join(outDir, "SHEET-first-last.png")]);
console.log(`\n  -> SHEET-first-last.png   (row 1 = FIRST frames, row 2 = LAST frames, all ${cols} segments)`);

// ---- 2. Articulation strip -------------------------------------------------
// Consecutive frames through a speaking stretch: the mouth must be visibly MOVING and the
// shapes must vary. A frozen or near-frozen mouth is the failure this catches.
const longest = row.offsets.reduce((a, b) => (b.audio_dur_s > a.audio_dur_s ? b : a));
const startFrame = Math.round(3.0 * 25);
ff(["-y", "-i", join(mediaDir, `${longest.id}.mp4`),
  "-vf", `select='gte(n\\,${startFrame})*lt(n\\,${startFrame + 12})',${crop},scale=320:270:flags=neighbor,tile=6x2`,
  "-frames:v", "1", join(outDir, "SHEET-articulation.png")]);
console.log(`  -> SHEET-articulation.png (${longest.id}, 12 consecutive frames from 3.00 s)`);

// ---- 3. Framing / whole-frame integrity ------------------------------------
// Full frames across the batch, against the approved base's own first frame. Catches camera
// drift, crop, zoom, warping, or anything the model invented outside the mouth.
const basePath = join(REPO, plan.driving_base.file.startsWith("public/media/") ? plan.driving_base.file : join("public/media", plan.driving_base.file));
ff(["-y", "-i", basePath, "-frames:v", "1", "-vf", "scale=640:360", join(outDir, "frame-BASE.png")]);
const picks = row.offsets.map((o) => o.id);
for (const id of picks) {
  ff(["-y", "-i", join(mediaDir, `${id}.mp4`), "-frames:v", "1", "-vf", "scale=640:360", join(outDir, `frame-${id}.png`)]);
}
const framing = ["frame-BASE.png", ...picks.map((p) => `frame-${p}.png`)];
const fcols = Math.ceil(Math.sqrt(framing.length));
ff(["-y", ...framing.flatMap((f) => ["-i", join(outDir, f)]),
  "-filter_complex", `${framing.map((_, i) => `[${i}:v]`).join("")}xstack=inputs=${framing.length}:layout=${framing.map((_, i) => `${(i % fcols) * 640}_${Math.floor(i / fcols) * 360}`).join("|")}[v]`,
  "-map", "[v]", join(outDir, "SHEET-framing.png")]);
console.log(`  -> SHEET-framing.png      (top-left = approved BASE, then first frame of each segment)\n`);
