#!/usr/bin/env node
/**
 * Re-wire a narration module to the MEASURED delivered durations.
 *
 *   node scripts/rewire-narration.mjs --lesson ew-01-av1 [--check]
 *
 * WHAT IT CHANGES, AND NOTHING ELSE
 * ---------------------------------
 *  - `durationSec` per segment  <- `<id>.mp4.json` -> split.video_dur_s (the delivered mp4)
 *  - every caption cue's `start` / `end`, re-allocated across the new duration
 *
 * It NEVER touches narration text or cue text. It edits numeric literals in place, so the
 * strings cannot move even by accident, and it re-verifies NARRATION_SHA256 afterwards —
 * if a single character of what the presenter says had changed, that check fails.
 *
 * CUE TIMING IS PROPORTIONAL, NOT FORCE-ALIGNED. Boundaries are allocated by cue character
 * count across the segment's measured length. That is a known limitation, recorded in the
 * delivery docs: it tracks the speech closely on short cues and can drift on long ones.
 * Force-alignment would need per-word timestamps for every segment and is a separate job.
 *
 * The invariants the test suite asserts are enforced here by construction:
 *   first cue starts at 0 · every cue starts exactly where the previous ended ·
 *   the last cue ends exactly at durationSec · cue text is untouched, so joining the
 *   cues with a single space still reproduces the segment text byte-for-byte.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const arg = (n, d = null) => {
  const i = process.argv.indexOf(`--${n}`);
  if (i === -1) return d;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
};
const lessonId = arg("lesson");
const checkOnly = arg("check") === true;
if (!lessonId) { console.error("usage: --lesson <id> [--check]"); process.exit(2); }

const dir = join(REPO, "public/media", lessonId);
const tsPath = join(REPO, "src/lib/lessons", `${lessonId}.narration.ts`);
const mod = await import(tsPath);
const { NARRATION, NARRATION_ORDER, NARRATION_SHA256 } = mod;

console.log(`\nEXIMIOUS — re-wire narration to measured delivered durations`);
console.log(`  lesson : ${lessonId}\n`);

// -------------------------------------------------------------- measured durations
const want = {};
for (const id of NARRATION_ORDER) {
  const p = join(dir, `${id}.mp4.json`);
  if (!existsSync(p)) { console.error(`  missing delivered sidecar ${id}.mp4.json — deliver first`); process.exit(1); }
  const s = JSON.parse(readFileSync(p, "utf8"));
  const d = s.split?.video_dur_s;
  if (typeof d !== "number") { console.error(`  ${id}.mp4.json has no split.video_dur_s`); process.exit(1); }
  want[id] = d;
}

let src = readFileSync(tsPath, "utf8");
let changedDur = 0, changedCues = 0;

for (const id of NARRATION_ORDER) {
  const seg = NARRATION[id];
  const dur = want[id];

  // Locate this segment's block: from its key to the start of the next key (or the end).
  const keyIdx = src.indexOf(`  "${id}": {`);
  if (keyIdx === -1) { console.error(`  cannot locate "${id}" in the module`); process.exit(1); }
  const nextIdx = NARRATION_ORDER.indexOf(id) === NARRATION_ORDER.length - 1
    ? src.length
    : src.indexOf(`  "${NARRATION_ORDER[NARRATION_ORDER.indexOf(id) + 1]}": {`);
  let block = src.slice(keyIdx, nextIdx);

  // ---- durationSec
  const before = block;
  block = block.replace(/(\n    durationSec: )(-?[\d.]+)(,)/, (m, a, oldv, c) => {
    if (Number(oldv) !== dur) changedDur++;
    return `${a}${dur}${c}`;
  });

  // ---- cue boundaries, proportional to cue character length
  const lens = seg.captions.map((c) => c.text.length);
  const total = lens.reduce((a, b) => a + b, 0);
  const bounds = [0];
  let acc = 0;
  for (let i = 0; i < lens.length - 1; i++) {
    acc += lens[i];
    bounds.push(+((acc / total) * dur).toFixed(2));
  }
  bounds.push(dur);
  // Monotonic by construction after rounding: never let a boundary fall behind its
  // predecessor, or the "starts where the previous ended" assertion breaks.
  for (let i = 1; i < bounds.length; i++) if (bounds[i] < bounds[i - 1]) bounds[i] = bounds[i - 1];
  bounds[bounds.length - 1] = dur;

  let n = 0;
  block = block.replace(/\{ start: (-?[\d.]+), end: (-?[\d.]+), text:/g, (m, s0, e0) => {
    const s1 = bounds[n], e1 = bounds[n + 1];
    if (Number(s0) !== s1 || Number(e0) !== e1) changedCues++;
    n++;
    return `{ start: ${s1}, end: ${e1}, text:`;
  });
  if (n !== seg.captions.length) { console.error(`  ${id}: rewrote ${n} cues but the module declares ${seg.captions.length}`); process.exit(1); }

  if (block !== before) src = src.slice(0, keyIdx) + block + src.slice(nextIdx);
}

console.log(`  durations rewritten : ${changedDur}/${NARRATION_ORDER.length}`);
console.log(`  cue boundaries moved: ${changedCues}`);

if (checkOnly) { console.log(`\n  --check: nothing written.\n`); process.exit(0); }

writeFileSync(tsPath, src);

// -------------------------------------------------------------- verify, hard
const fresh = await import(`${tsPath}?v=${Date.now()}`);
const F = fresh.NARRATION, O = fresh.NARRATION_ORDER;
const combined = createHash("sha256").update(O.map((i) => F[i].text).join("\n"), "utf8").digest("hex");
const problems = [];
if (combined !== NARRATION_SHA256) problems.push(`narration fingerprint MOVED: ${combined} != ${NARRATION_SHA256}`);
for (const id of O) {
  const s = F[id];
  if (Math.abs(s.durationSec - want[id]) > 1e-9) problems.push(`${id}: durationSec ${s.durationSec} != measured ${want[id]}`);
  if (s.captions[0].start !== 0) problems.push(`${id}: first cue starts at ${s.captions[0].start}`);
  if (s.captions.at(-1).end !== s.durationSec) problems.push(`${id}: last cue ends at ${s.captions.at(-1).end}, not ${s.durationSec}`);
  for (let i = 1; i < s.captions.length; i++) {
    if (s.captions[i].start !== s.captions[i - 1].end) problems.push(`${id}: cue ${i} starts at ${s.captions[i].start}, previous ended ${s.captions[i - 1].end}`);
  }
  if (s.captions.map((c) => c.text).join(" ") !== s.text) problems.push(`${id}: cue text no longer reproduces the segment text`);
  if (createHash("sha256").update(s.text, "utf8").digest("hex") !== s.scriptSha256) problems.push(`${id}: text no longer matches its own scriptSha256`);
}
if (problems.length) {
  console.error(`\n  VERIFY FAILED:`);
  for (const p of problems) console.error(`    ${p}`);
  process.exit(1);
}
console.log(`\n  VERIFIED  narration fingerprint unchanged (${combined.slice(0, 16)}...)`);
console.log(`            ${O.length}/${O.length} segments: cues tile [0, durationSec] contiguously and still reproduce the text\n`);
