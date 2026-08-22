#!/usr/bin/env node
/**
 * Record a Gate C VISUAL verdict against the file it was judged on.
 *
 *   node scripts/stamp-visual-qa.mjs --lesson ew-01-av1 --verdicts /tmp/verdicts.json
 *
 * A visual verdict is about SPECIFIC FRAMES of a SPECIFIC file. A re-delivery can move the
 * cut, which makes "the first frame" a different frame — so the verdict is stamped with the
 * asset sha256 and the cut offset it was judged against. `lipsync-deliver.mjs` marks a
 * carried verdict STALE when either moves, and the lesson test refuses a stale one.
 *
 * THIS SCRIPT DOES NOT JUDGE ANYTHING. It records a judgement a human (or the model, at
 * 2-3x zoom on the sheets from `lipsync-visual-qa.mjs`) has already made by eye.
 * known-mistakes #18 is binding: no mouth claim comes from a pixel metric.
 *
 * verdicts.json:
 *   { "judged_by": "...", "method": "...",
 *     "segments": { "intro": { "first_frame_mouth": "parted", "last_frame_mouth": "parted",
 *                              "teeth_visible": true, "note": "..." }, ... } }
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const arg = (n, d = null) => { const i = process.argv.indexOf(`--${n}`); if (i === -1) return d;
  const v = process.argv[i + 1]; return v && !v.startsWith("--") ? v : true; };
const lessonId = arg("lesson"), vPath = arg("verdicts");
if (!lessonId || !vPath) { console.error("usage: --lesson <id> --verdicts <file.json>"); process.exit(2); }

const dir = join(REPO, "public/media", lessonId);
const V = JSON.parse(readFileSync(vPath, "utf8"));
const ALLOWED = ["closed", "parted", "open"];

let n = 0;
const missing = [];
for (const [id, v] of Object.entries(V.segments)) {
  const p = join(dir, `${id}.mp4.json`);
  if (!existsSync(p)) { missing.push(id); continue; }
  const s = JSON.parse(readFileSync(p, "utf8"));
  for (const k of ["first_frame_mouth", "last_frame_mouth"]) {
    if (!ALLOWED.includes(v[k])) throw new Error(`${id}: ${k}="${v[k]}" is not one of ${ALLOWED.join("/")}`);
  }
  s.visual_qa = {
    judged_by: V.judged_by,
    judged_on: new Date().toISOString().slice(0, 10),
    method: V.method,
    // The two fields that make the verdict refutable rather than decorative.
    judged_asset_sha256: s.sha256,
    judged_cut_video_start_s: s.split.video_start_s,
    first_frame_mouth: v.first_frame_mouth,
    last_frame_mouth: v.last_frame_mouth,
    teeth_visible: v.teeth_visible ?? null,
    framing_matches_base: v.framing_matches_base ?? true,
    articulation: v.articulation ?? null,
    note: v.note ?? null,
  };
  writeFileSync(p, JSON.stringify(s, null, 2) + "\n");
  n++;
}
if (missing.length) { console.error(`no delivered sidecar for: ${missing.join(", ")}`); process.exit(1); }
const counts = {};
for (const v of Object.values(V.segments)) {
  for (const k of ["first_frame_mouth", "last_frame_mouth"]) counts[`${k}=${v[k]}`] = (counts[`${k}=${v[k]}`] || 0) + 1;
}
console.log(`\nstamped ${n} visual verdicts on ${lessonId}`);
for (const [k, c] of Object.entries(counts).sort()) console.log(`  ${k.padEnd(28)} ${c}`);
console.log();
