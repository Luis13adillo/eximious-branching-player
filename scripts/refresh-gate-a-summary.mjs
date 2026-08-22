#!/usr/bin/env node
/**
 * Rebuild `_gate-a-summary.json` from the sidecars actually on disk.
 *
 *   node scripts/refresh-gate-a-summary.mjs --lesson ew-01-av1
 *
 * `tts-narration.mjs` writes the summary at the end of ITS run, so any later correction —
 * a `redraw-verify.mjs` redraw, an adjudication pass — leaves the summary describing a set
 * of files that no longer exists. This re-derives it from the sidecars, which are the
 * record of what was really produced, and carries the recorded spend forward rather than
 * recomputing it (a redraw costs money that the character count alone cannot see).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const arg = (n, d = null) => { const i = process.argv.indexOf(`--${n}`); if (i === -1) return d;
  const v = process.argv[i + 1]; return v && !v.startsWith("--") ? v : true; };
const lessonId = arg("lesson");
if (!lessonId) { console.error("usage: --lesson <id>"); process.exit(2); }

const dir = join(REPO, "public/media", lessonId);
const mod = await import(join(REPO, "src/lib/lessons", `${lessonId}.narration.ts`));
const { NARRATION, NARRATION_ORDER, NARRATION_SHA256, NARRATION_CHARS } = mod;
const sumPath = join(dir, "_gate-a-summary.json");
const prev = existsSync(sumPath) ? JSON.parse(readFileSync(sumPath, "utf8")) : {};

const seg = NARRATION_ORDER.map((id) => ({ id, s: JSON.parse(readFileSync(join(dir, `${id}.json`), "utf8")) }));
const totalDur = seg.reduce((a, x) => a + x.s.audio.duration_s, 0);
const asWritten = ["loudness", "true_peak", "format", "flat", "no_trunc", "pause", "f0", "duration"];
const corrected = ["loudness", "true_peak", "format", "flat", "fidelity", "no_trunc_v4",
                   "no_nonboundary_pause_over_0_9s", "f0_onset_ge_0_75_body", "duration_within_3sd"];
const count = (rows, pick) => Object.fromEntries(rows.map((r) =>
  [r, `${seg.filter((x) => pick(x.s)?.[r] === true).length}/${seg.length}`]));

// A redraw is marked by its RECORDED REASON, not by a draw count: a redraw that succeeds
// on its first attempt still has draws === 1, and that is exactly the case this must catch.
const redraws = seg.filter((x) => (x.s.synthesis?.resynthesis_reasons || []).length > 0)
  .map((x) => ({ id: x.id, draws: x.s.synthesis.draws, accepted_draw: x.s.synthesis.accepted_draw,
                 reasons: x.s.synthesis.resynthesis_reasons }));
/**
 * Billed units, carried forward and de-duplicated by (id, note) — NOT by (id, units).
 * A redraw of a segment bills exactly the same unit count as the original draw of that
 * segment, because fal bills per character and the text is identical, so keying on the
 * number silently swallows the redraw's cost.
 */
const billed = (prev.provider_billed_units || []).map((b) => ({ ...b, note: b.note ?? "initial draw" }));
for (const x of seg) for (const d of x.s.synthesis?.draw_log || []) {
  const note = `redraw ${d.draw}${d.accepted ? " (accepted)" : " (rejected)"}`;
  if (!billed.some((b) => b.id === x.id && b.note === note))
    billed.push({ id: x.id, billable_units: d.billable_units, note });
}
const billedTotal = billed.reduce((a, b) => a + (parseFloat(b.billable_units) || 0), 0);

const out = {
  lesson: lessonId,
  presenter: seg[0].s.presenter,
  provider: seg[0].s.provider,
  endpoint: seg[0].s.endpoint,
  model: seg[0].s.model,
  voice: seg[0].s.voice,
  voice_label: seg[0].s.voice_label ?? null,
  date: new Date().toISOString(),
  rebuilt_from: "the per-segment Gate A sidecars on disk, not from a synthesis run",
  narration_lock: { narration_sha256: NARRATION_SHA256, narration_chars: NARRATION_CHARS },
  segments: seg.length,
  characters: NARRATION_ORDER.reduce((a, id) => a + NARRATION[id].scriptChars, 0),
  spend_usd: prev.spend_usd ?? null,
  spend_note: prev.spend_note ?? null,
  provider_billed_units: billed.length ? billed : null,
  provider_billed_units_total: +billedTotal.toFixed(3),
  provider_billing_note:
    "fal bills MiniMax TTS per 1,000 characters; one unit = 1,000 characters. These are the counts fal " +
    "returned in the x-fal-billable-units response header and are AUTHORITATIVE over any $/1M estimate. " +
    "The list is only as complete as the runs that wrote it — a summary rebuilt after a partial run cannot " +
    "recover entries an earlier overwrite dropped, so treat the total as a floor, not a closed account.",
  measured_total_s: +totalDur.toFixed(3),
  measured_chars_per_sec: +(NARRATION_ORDER.reduce((a, id) => a + NARRATION[id].scriptChars, 0) / totalDur).toFixed(2),
  gate_b_as_written: count(asWritten, (s) => s.qa),
  gate_b_corrected: count(corrected, (s) => s.qa_corrected),
  gate_a_verdict: seg.every((x) => x.s.gate_a?.status === "PASS") ? "PASS" : "FAIL",
  redraws: redraws.length ? redraws : null,
  asr_fidelity: {
    status: seg.every((x) => x.s.qa_corrected?.fidelity) ? "COMPLETE" : "INCOMPLETE",
    adjudicated_segments: seg.filter((x) => (x.s.asr_adjudications || []).length).map((x) => x.id),
  },
  segments_detail: seg.map((x) => ({
    id: x.id, chars: x.s.script_chars, duration_s: x.s.audio.duration_s,
    lufs: x.s.audio.lufs_integrated, speech_lufs: x.s.audio.speech_lufs,
    true_peak: x.s.audio.true_peak_dbfs, sha256: x.s.sha256,
    gate_a: x.s.gate_a?.status ?? null,
  })),
};
writeFileSync(sumPath, JSON.stringify(out, null, 2) + "\n");
console.log(`\nrebuilt ${sumPath.replace(REPO + "/", "")}`);
console.log(`  ${out.segments} segments · ${out.measured_total_s}s · ${out.measured_chars_per_sec} chars/sec`);
console.log(`  Gate A verdict: ${out.gate_a_verdict}   redraws: ${redraws.length}\n`);
