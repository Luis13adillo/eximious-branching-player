#!/usr/bin/env node
/**
 * LatentSync batch planner.
 *
 *   node scripts/plan-lipsync-batches.mjs --lesson siu-01-av1 \
 *        --base public/media/presenter-2-curtis-whitfield-driving-base.json
 *
 * Durations come from the DELIVERED mastered audio (ffprobe via the Gate A sidecars),
 * never from a chars/sec estimate. Video 1's BLOCKING FIX 2 exists because a batch plan
 * built on estimates does not survive contact with the real audio.
 *
 * THE RULES, reverse-engineered from Diane's four EXECUTED calls and verified to
 * reproduce all four declared `batch_padded_s` values exactly (119.24 / 123.08 / 107.08
 * / 125.00), not from the superseded 8-call plan in VIDEO_1_GENERATION_CONFIGS.md:
 *
 *   content = sum(segment durations) + 0.5 s between adjacent segments
 *   blocks  = ceil(content * 25 / 16)          <- 25 fps ALWAYS, whatever the base runs at
 *   padded  = blocks * 16 / 25 + 0.2 s         <- the 0.2 s CLEARS the block boundary
 *   cost    = max($0.20, padded * $0.005)
 *
 * Why 25 fps even though Curtis's driving base is 24 fps: LatentSync always RETURNS 25
 * fps regardless of input frame rate. Computing the 16-frame padding at the base's own
 * rate under-pads and silently clips the tail of the narration.
 *
 * Why the 0.2 s: the audio must EXCEED the block boundary so the model emits the full
 * block count rather than one block short. Diane's canary confirmed it — 46.28 s
 * submitted returned exactly 72 x 16 = 1152 frames = 46.080 s of video.
 *
 * HARD CONSTRAINTS CHECKED HERE
 *   1. every call >= 40 s      — below that the $0.20 per-call minimum applies and
 *                                per-segment calling raises catalog cost ~79%
 *   2. every call <  base_s    — the driving window must exceed its audio so pingpong
 *                                never triggers mid-call (see the delivered sidecars'
 *                                `loop_mode_note`)
 *   3. every call <= CHUNK CEILING (~120 s, default 125 s)
 *
 * ON THE CHUNK CEILING — this is NOT the same limit as the driving base, and conflating
 * the two is a trap. docs/COST_OPTIMIZATION_267.md 6.2 fixes the batching rule as "batch
 * per video, chunk at ~120 s", for two reasons that have nothing to do with base length:
 * LatentSync's single-call maximum duration is UNDOCUMENTED, and mouth-region temporal
 * flicker grows on long takes. Chunking is explicitly "cost identical to one long call",
 * so respecting the ceiling is free.
 *
 * Curtis's driving base is 142.083 s precisely BECAUSE of that ceiling — its own record
 * says v1 (101.917 s) was replaced because it "sat UNDER the documented ~120 s chunk
 * ceiling, so a long call could still have triggered loop_mode", and that v2 carries
 * "18.4% headroom above the ~120 s chunk ceiling". The base is sized to COMFORTABLY CLEAR
 * 120 s calls, not to be filled to 142 s.
 *
 * The default ceiling here is 125 s: the longest call Diane actually executed and that
 * was accepted at review, which is what "~120 s" has meant in practice on this project.
 *
 * Batches are CONTIGUOUS RUNS IN ALPHABETICAL SEGMENT ORDER, which is what Diane's four
 * executed calls actually were. Order within a call is irrelevant to the result — every
 * segment is re-split out afterwards at its recorded offset — so the ordering exists only
 * to make the plan reproducible and reviewable.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));

const GAP_S = 0.5;
const FPS = 25;              // LatentSync's OUTPUT rate — never the base's rate
const BLOCK = 16;

/**
 * SILENT LEAD-IN before the first narrated segment of every batch. ONE FULL 16-FRAME BLOCK.
 *
 * WHY IT EXISTS — the Curtis canary (call 6, request 01a021be-5da7-7333-b6ff-a49788d562cb).
 * `rejoin-3` sat at batch offset 0.000 with its narration starting on sample 0, so LatentSync
 * correctly opened the mouth on frame 0 to match the audio it was given, and the delivered
 * segment's FIRST FRAME showed open lips and visible teeth. The same condition is present on
 * all four batch-opening segments of the approved, delivered Diane v4 set, so it is not a
 * Curtis defect — it is a defect in the batching rule itself, and it had never been caught.
 *
 * WHY ONE BLOCK AND NOT LESS. Measured on the canary's own four inter-segment gaps, which are
 * 0.5 s (12.5 frames) of digital silence: mouth ACTIVITY sits at the re-encode noise floor
 * from 6 frames before onset right through the onset frame, and all 28 frames inspected by
 * eye across the four gaps show lips CLOSED — including the frame where audio begins. So a
 * segment whose onset is preceded by 12.5 silent frames reliably starts closed. One block is
 * 16 frames, MORE silence than the condition already proven to work, and it is the smallest
 * lead-in that is STRUCTURAL rather than empirical: the model demonstrably processes in
 * 16-frame blocks (the canary returned exactly 145 x 16 = 2320 frames), so a full-block
 * lead-in guarantees frame 0's entire processing block is silent. A 5- or 8-frame lead-in
 * would rest on the measurement alone and would leave frame 0 sharing its block with speech.
 *
 * WHY IT DOES NOT DISTURB THE PADDING RULE. One block of lead-in adds exactly one block:
 *   ceil((content + 16/25) * 25/16) === ceil(content * 25/16) + 1
 * so `blocks` rises by exactly 1 and `padded` by exactly 0.64 s per call, with no rounding
 * interaction. Cost is +$0.0032 per call.
 *
 * The lead-in is DISCARDED at the split — the first segment is cut from LEAD_IN_S, so the
 * delivered first frame is the audio-onset frame, which is the frame the gap evidence proves
 * is closed. No narration, order, seed, guidance, loop mode or driving base changes.
 */
const LEAD_IN_BLOCKS = 1;
const LEAD_IN_S = +((LEAD_IN_BLOCKS * BLOCK) / FPS).toFixed(4);   // 0.64 s
const CLEAR_S = 0.2;
/**
 * Tail room for the DELIVERY pad. lipsync-deliver.mjs cuts LEAD_S (0.24 s) of silence in on
 * BOTH sides of every segment, so the returned video must extend at least that far past the
 * last narration sample or the final segment of a call cannot be split at all.
 *
 * The returned video is blocks x 16 / 25 - CLEAR_S does NOT affect it (that only lengthens the
 * audio we submit). So the block count must be derived from content + this pad, not content.
 * Found when ew-01 call 5 returned 92.80 s against 92.576 s of content: 0.224 s of slack where
 * the tail pad needs 0.24 s, stranding rejoin-1a by 16 ms.
 */
const DELIVERY_PAD_S = 0.24;
const MIN_CALL_S = 40;
/** docs/COST_OPTIMIZATION_267.md 6.2 "chunk at ~120 s"; 125 s = Diane's longest executed call. */
const DEFAULT_CHUNK_CEILING_S = 125.0;
const PER_SEC = 0.005;
const MIN_CALL_COST = 0.2;

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}

/** content seconds -> what must actually be submitted */
function padded(contentS) {
  const blocks = Math.ceil(((contentS + DELIVERY_PAD_S) * FPS) / BLOCK);
  return { blocks, frames: blocks * BLOCK, paddedS: +((blocks * BLOCK) / FPS + CLEAR_S).toFixed(4) };
}
const contentOf = (durs) => LEAD_IN_S + durs.reduce((a, b) => a + b, 0) + GAP_S * (durs.length - 1);
const costOf = (paddedS) => Math.max(MIN_CALL_COST, paddedS * PER_SEC);

/**
 * Best contiguous partition into exactly k runs, minimising the largest padded call.
 * Exact DP — with 22 segments the table is trivial, so there is no reason to approximate.
 * Ties broken on total padded seconds, which is what the bill is computed from.
 */
function partition(ids, durs, k) {
  const n = ids.length;
  const INF = Infinity;
  // best[i][j] = { max, total } for first i segments in j runs
  const best = Array.from({ length: n + 1 }, () => Array.from({ length: k + 1 }, () => ({ max: INF, total: INF, cut: -1 })));
  best[0][0] = { max: 0, total: 0, cut: -1 };
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= k; j++) {
      for (let p = j - 1; p < i; p++) {
        if (best[p][j - 1].max === INF) continue;
        const { paddedS } = padded(contentOf(durs.slice(p, i)));
        const mx = Math.max(best[p][j - 1].max, paddedS);
        const tt = best[p][j - 1].total + paddedS;
        const cur = best[i][j];
        if (mx < cur.max - 1e-9 || (Math.abs(mx - cur.max) < 1e-9 && tt < cur.total - 1e-9)) {
          best[i][j] = { max: mx, total: tt, cut: p };
        }
      }
    }
  }
  if (best[n][k].max === INF) return null;
  const runs = [];
  let i = n, j = k;
  while (j > 0) {
    const p = best[i][j].cut;
    runs.unshift(ids.slice(p, i));
    i = p; j--;
  }
  return { runs, max: best[n][k].max, total: best[n][k].total };
}

// --------------------------------------------------------------------------- main
const lessonId = arg("lesson");
const basePath = arg("base");
if (!lessonId || !basePath) {
  console.error("usage: --lesson <id> --base <driving-base.json>");
  process.exit(2);
}

const base = JSON.parse(readFileSync(join(REPO, basePath), "utf8"));
const baseS = base.delivery.dur_s;
const chunkCeiling = parseFloat(arg("max-call-s", String(DEFAULT_CHUNK_CEILING_S)));
// The binding limit is whichever is tighter. On every presenter so far that is the
// documented chunk ceiling, NOT the base — which is the point of sizing bases above it.
const callLimit = Math.min(chunkCeiling, baseS - 1e-9);
const dir = join(REPO, "public/media", lessonId);
const mod = await import(join(REPO, "src/lib/lessons", `${lessonId}.narration.ts`));

// MEASURED durations, straight from the Gate A sidecars.
const ids = [...mod.NARRATION_ORDER].sort();
const dur = {};
for (const id of ids) {
  const p = join(dir, `${id}.json`);
  if (!existsSync(p)) { console.error(`missing Gate A sidecar for ${id} — run tts-narration.mjs first`); process.exit(1); }
  const s = JSON.parse(readFileSync(p, "utf8"));
  if (!s.qa.loudness || !s.qa.format) { console.error(`${id} has not passed Gate B — refusing to plan paid work on it`); process.exit(1); }
  dur[id] = s.audio.duration_s;
}
const durs = ids.map((id) => dur[id]);
const totalAudio = durs.reduce((a, b) => a + b, 0);

console.log(`\nEXIMIOUS — LatentSync batch plan`);
console.log(`  lesson       : ${lessonId}`);
console.log(`  segments     : ${ids.length}`);
console.log(`  measured audio: ${totalAudio.toFixed(3)} s  (from the delivered masters, not estimates)`);
console.log(`  driving base : ${base.asset}`);
console.log(`                 ${baseS} s / ${base.delivery.frames} frames @ ${base.delivery.fps}`);
console.log(`  rules        : lead-in ${LEAD_IN_S}s (${LEAD_IN_BLOCKS} block) · gap ${GAP_S}s · blocks of ${BLOCK} @ ${FPS}fps · +${CLEAR_S}s clearance · $${PER_SEC}/s over ${MIN_CALL_S}s`);
console.log(`  chunk ceiling: ${chunkCeiling} s (documented ~120 s rule)   driving base: ${baseS} s`);
console.log(`  binding limit: ${callLimit.toFixed(3)} s  <- ${chunkCeiling <= baseS ? "the chunk ceiling" : "the driving base"}\n`);

// Smallest feasible call count, then the most balanced arrangement at that count.
let chosen = null;
for (let k = 1; k <= ids.length; k++) {
  const p = partition(ids, durs, k);
  if (!p) continue;
  const okBase = p.max <= callLimit;
  const minCall = Math.min(...p.runs.map((r) => padded(contentOf(r.map((i) => dur[i]))).paddedS));
  if (okBase && minCall >= MIN_CALL_S) { chosen = { k, ...p }; break; }
}
if (!chosen) { console.error("  no feasible plan — no call count satisfies both constraints"); process.exit(1); }

console.log(`  minimum feasible call count: ${chosen.k}`);
console.log(`  (fewer calls would need a call longer than the ${callLimit.toFixed(2)} s limit)\n`);

console.log("  call  n  segments");
console.log("        content    blocks   frames   submit(s)   cost      headroom vs base");
let totalPadded = 0, totalCost = 0;
const plan = [];
chosen.runs.forEach((run, idx) => {
  const d = run.map((i) => dur[i]);
  const content = contentOf(d);
  const { blocks, frames, paddedS } = padded(content);
  const cost = costOf(paddedS);
  totalPadded += paddedS; totalCost += cost;
  plan.push({ call: idx + 1, segments: run, raw_s: +d.reduce((a, b) => a + b, 0).toFixed(3), content_s: +content.toFixed(3), blocks, frames, submit_s: paddedS, cost_usd: +cost.toFixed(4), headroom_s: +(baseS - paddedS).toFixed(3) });
  console.log(`  ${String(idx + 1).padStart(4)} ${String(run.length).padStart(2)}  ${run.join(", ")}`);
  console.log(`        ${content.toFixed(2).padStart(7)}s ${String(blocks).padStart(9)} ${String(frames).padStart(8)} ${paddedS.toFixed(2).padStart(11)} $${cost.toFixed(4).padStart(7)} ${(baseS - paddedS).toFixed(2).padStart(15)}s`);
});

console.log(`\n  ${chosen.k} calls · ${totalPadded.toFixed(2)} s submitted · PROJECTED COST $${totalCost.toFixed(4)}`);
console.log(`  longest call  : ${chosen.max.toFixed(2)} s   (base ${baseS} s — headroom ${(baseS - chosen.max).toFixed(2)} s)`);
console.log(`  shortest call : ${Math.min(...plan.map((p) => p.submit_s)).toFixed(2)} s   (>= ${MIN_CALL_S} s minimum: ${Math.min(...plan.map((p) => p.submit_s)) >= MIN_CALL_S ? "PASS" : "FAIL"})`);
console.log(`  every call <= chunk ceiling ${chunkCeiling} s : ${plan.every((p) => p.submit_s <= chunkCeiling) ? "PASS" : "FAIL"}`);
console.log(`  every call <  driving base ${baseS} s   : ${plan.every((p) => p.submit_s < baseS) ? "PASS" : "FAIL"}  (min headroom ${Math.min(...plan.map((p) => baseS - p.submit_s)).toFixed(2)} s)`);
console.log(`  padding overhead: ${(totalPadded - totalAudio).toFixed(2)} s over ${totalAudio.toFixed(2)} s of narration (${(100 * (totalPadded - totalAudio) / totalAudio).toFixed(1)}%)`);

// Split offsets each segment will be extracted at, so Gate D is fully determined now.
for (const p of plan) {
  let t = LEAD_IN_S;   // frame 0 is silence; the first segment starts one block in
  p.offsets = p.segments.map((id) => { const o = { id, batch_start_s: +t.toFixed(3), audio_dur_s: dur[id] }; t += dur[id] + GAP_S; return o; });
}

const out = {
  lesson: lessonId,
  generated_from: "measured mastered-audio durations (Gate A sidecars)",
  driving_base: { file: base.asset, dur_s: baseS, fps: base.delivery.fps, frames: base.delivery.frames },
  rules: { chunk_ceiling_s: chunkCeiling, call_limit_s: +callLimit.toFixed(3), lead_in_s: LEAD_IN_S, lead_in_blocks: LEAD_IN_BLOCKS, lead_in_reason: "One full 16-frame block of silence before the first narrated segment, so frame 0 is generated during silence and the delivered first frame has lips closed. Motivated by the call-6 canary: rejoin-3 at offset 0.000 returned an open mouth with visible teeth on frame 1.", gap_s: GAP_S, fps: FPS, block: BLOCK, clearance_s: CLEAR_S, delivery_pad_s: DELIVERY_PAD_S, delivery_pad_reason: "Blocks are derived from content + this pad so the returned video always extends far enough past the last narration sample for lipsync-deliver.mjs to cut its trailing 0.24 s of silence. Without it the final segment of a call can be unsplittable.", min_call_s: MIN_CALL_S, per_sec_usd: PER_SEC, min_call_cost_usd: MIN_CALL_COST },
  locked_params: { model: "fal-ai/latentsync", loop_mode: "pingpong", seed: 20260820, guidance_scale: 1 },
  calls: chosen.k,
  total_audio_s: +totalAudio.toFixed(3),
  total_submitted_s: +totalPadded.toFixed(3),
  projected_cost_usd: +totalCost.toFixed(4),
  longest_call_s: +chosen.max.toFixed(3),
  plan,
};
writeFileSync(join(dir, "_lipsync-batch-plan.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`\n  wrote public/media/${lessonId}/_lipsync-batch-plan.json\n`);
