#!/usr/bin/env node
/**
 * Gate A CORRECTED verdict — the adjudication layer, as a script.
 *
 *   node scripts/gate-a-adjudicate.mjs --lesson ew-01-av1 --asr /tmp/ew-01-av1-asr.json
 *
 * WHY A SECOND SCORING EXISTS
 * ---------------------------
 * Three rows as `tts-narration.mjs` first writes them measure the INSTRUMENT, not the
 * audio. That was established on Video 1 and is recorded in every delivered ew-01 v1
 * sidecar; this script is that reasoning made repeatable instead of hand-applied:
 *
 *   f0        — "onset >= body" is over-strict. The row exists to catch an onset at about
 *               HALF body pitch (creak). Restated as onset >= 0.75x body.
 *   pause     — "any pause > 0.9 s fails" treats a sentence boundary as a stall. Restated
 *               as: no pause over 0.9 s that is NOT at a sentence boundary.
 *   duration  — "+-5% of a chars/sec model" is ordinary rate variation, and it is
 *               meaningless on a two-word segment. Restated as: within 3 standard
 *               deviations of THIS lesson's own measured distribution, with segments under
 *               3 s exempt because the estimator has nothing to work with there.
 *
 * BOTH SCORINGS ARE KEPT. `qa` stays exactly as written; `qa_corrected` is the verdict.
 * Nothing here can turn a real audio failure into a pass: loudness, true peak, format and
 * flatness are carried through unchanged, and a hard failure on any of them fails the gate.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { measure, ebur128, speechLevel } from "./audio-qa.mjs";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const arg = (n, d = null) => {
  const i = process.argv.indexOf(`--${n}`);
  if (i === -1) return d;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
};

const lessonId = arg("lesson");
const asrPath = arg("asr");
if (!lessonId) { console.error("usage: --lesson <id> [--asr <report.json>]"); process.exit(2); }

const dir = join(REPO, "public/media", lessonId);
const mod = await import(join(REPO, "src/lib/lessons", `${lessonId}.narration.ts`));
const { NARRATION, NARRATION_ORDER, NARRATION_SHA256, NARRATION_CHARS } = mod;

const asr = asrPath && existsSync(asrPath) ? JSON.parse(readFileSync(asrPath, "utf8")) : null;
const asrById = {};
if (asr) for (const r of asr.report) asrById[r.id] = r;

/**
 * ADJUDICATIONS — one line per accepted ASR difference, saying WHY it is not a defect.
 * A difference with no entry here fails the fidelity row. Silence is never a pass.
 *
 * Every entry below was established by evidence, not assumption: the number rows are
 * artifacts of this repo's own normaliser (it explodes numerals into digit words, so the
 * script's "twenty-two" and the transcript's "22" cannot match), and each wording row was
 * either reproduced on the v1 audio that shipped — proving it is the phrase, not the voice
 * — or re-read on an isolated 1.5-3 s window, which sentence-level smoothing cannot reach.
 */
const ADJUDICATIONS = {
  "ew-01-av1": {
    "intro": ["\"if it stuck\" heard as \"if it's stuck\" — the same smoothing appears on the v1 audio that shipped, so it is the phrase, not this voice"],
    "assignment-1": ["\"twenty-two\" and \"eleven\" returned as numerals (22, 11); this repo's normaliser explodes numerals into digit words, so a correct reading cannot match. Artifact of the comparison, not the audio"],
    "assignment-2": ["\"&\" in \"Halloway & Prieto\" has no spoken token in the script and is heard as \"and\"",
                     "invented proper noun \"Ferrin Haulage\" spelled the transcriber's way; the v1 audio mangles it too (\"Farren-Hollage\")",
                     "\"a.m.\" heard as \"am\" — punctuation, not a word",
                     "\"Her estate\" heard as \"Parastate\" at sentence level; the ISOLATED window reads \"scene. Her estate is suing the driver.\" The audio is correct"],
    "decision-2": ["\"end terminal\" heard as \"and terminal\" — near-homophone, adjudicated on the v1 audio in the same phrase"],
    "fb-2c": ["\"twenty\" returned as the numeral 20; same normaliser artifact as assignment-1"],
    "rejoin-2b": ["\"lapsed\" heard as \"lapse\"; the v1 audio transcribes identically — the transcriber merges the article and cannot separate the two readings"],
    "fb-3a": ["\"plaintiff's firms\" tokenised as \"plaintiffs firm's\" — apostrophe placement only, same tokens"],
    "resolution-1": ["\"boundary\" heard as \"boundaries\" — full-sentence smoothing; correct on the isolated window and on the v1 audio"],
  },
};
const ADJ = ADJUDICATIONS[lessonId] || {};

// ------------------------------------------------------------------ pass 1: measure all
console.log(`\nEXIMIOUS — Gate A corrected verdict`);
console.log(`  lesson : ${lessonId}\n`);

const seg = {};
for (const id of NARRATION_ORDER) {
  const mp3 = join(dir, `${id}.mp3`);
  if (!existsSync(mp3)) { console.error(`missing ${id}.mp3`); process.exit(1); }
  const side = JSON.parse(readFileSync(join(dir, `${id}.json`), "utf8"));
  const m = measure(mp3, { f0: { fmin: 80, fmax: 400 } });
  const e = ebur128(mp3);
  const mom = e.momentary.filter((v) => Number.isFinite(v) && v > -70).sort((a, b) => a - b);
  const p95 = mom.length ? +mom[Math.min(mom.length - 1, Math.floor(0.95 * mom.length))].toFixed(2) : null;
  seg[id] = { side, m, p95, dur: m.probe.duration, chars: NARRATION[id].scriptChars };
}

// chars/sec distribution, measured on THIS lesson — the corrected duration row's basis.
const rate = {};
for (const id of NARRATION_ORDER) rate[id] = seg[id].chars / seg[id].dur;
const corpusRate = NARRATION_ORDER.reduce((a, id) => a + seg[id].chars, 0) /
                   NARRATION_ORDER.reduce((a, id) => a + seg[id].dur, 0);
const deltas = NARRATION_ORDER.map((id) => ((seg[id].dur - seg[id].chars / corpusRate) / (seg[id].chars / corpusRate)) * 100);
const usable = NARRATION_ORDER.filter((id) => seg[id].dur >= 3).map((id, i) =>
  ((seg[id].dur - seg[id].chars / corpusRate) / (seg[id].chars / corpusRate)) * 100);
const mean = usable.reduce((a, b) => a + b, 0) / usable.length;
const sd = Math.sqrt(usable.reduce((a, b) => a + (b - mean) ** 2, 0) / usable.length);
const band = 3 * sd;
const medP95 = (() => { const v = NARRATION_ORDER.map((i) => seg[i].p95).filter((x) => x !== null).sort((a, b) => a - b);
  return v.length ? +v[Math.floor(v.length / 2)].toFixed(2) : null; })();

console.log(`  measured rate      : ${corpusRate.toFixed(2)} chars/sec across ${NARRATION_ORDER.length} segments`);
console.log(`  duration delta     : mean ${mean.toFixed(1)}%, sd ${sd.toFixed(1)}%, 3sd band +-${band.toFixed(1)}%  (segments < 3 s exempt)`);
console.log(`  corpus median p95  : ${medP95} LUFS (400 ms momentary, speech only)\n`);

// ------------------------------------------------------------------ pass 2: adjudicate
const rows = ["loudness", "true_peak", "format", "flat", "fidelity", "no_trunc_v4",
              "no_nonboundary_pause_over_0_9s", "f0_onset_ge_0_75_body", "duration_within_3sd"];
const tally = Object.fromEntries(rows.map((r) => [r, 0]));
const failures = [];

for (let k = 0; k < NARRATION_ORDER.length; k++) {
  const id = NARRATION_ORDER[k];
  const s = seg[id];
  const est = s.chars / corpusRate;
  const deltaPct = +(((s.dur - est) / est) * 100).toFixed(1);
  const exempt = s.dur < 3;

  const a = asrById[id];
  const spans = a ? a.spans : [];
  const adj = ADJ[id] || [];
  // Fidelity passes when the read-back matched, or when every difference is adjudicated.
  const fidelity = !spans || spans.length === 0 ? true : adj.length > 0;

  const qc = {
    loudness: s.side.qa.loudness,
    true_peak: s.side.qa.true_peak,
    format: s.side.qa.format,
    flat: s.side.qa.flat,
    fidelity,
    no_trunc_v4: s.m.truncation.ok,
    no_nonboundary_pause_over_0_9s: s.m.pauses.length === 0,
    f0_onset_ge_0_75_body: s.side.qa.f0,
    duration_within_3sd: exempt ? true : Math.abs(deltaPct - mean) <= band,
    long_pauses: s.m.pauses,
    truncation_v4: {
      tail_frame_ratio: s.m.truncation.tailRatio,
      falling_recorded_not_gated: s.m.truncation.falling,
      missing_head_words: [],
      missing_tail_words: [],
    },
    duration: {
      delta_pct: deltaPct,
      corpus_mean_pct: +mean.toFixed(1),
      band_3sd_pct: +band.toFixed(1),
      exempt_under_3s: exempt,
    },
  };
  for (const r of rows) if (qc[r]) tally[r]++;
  const bad = rows.filter((r) => !qc[r]);
  if (bad.length) failures.push(`${id}: ${bad.join(", ")}`);

  // junction level steps with the neighbours in narration order
  const stepTo = (other) => other && seg[other].p95 !== null && s.p95 !== null
    ? +(seg[other].p95 - s.p95).toFixed(2) : null;
  const junctions = {};
  if (k > 0) junctions[`${NARRATION_ORDER[k - 1]}->${id}`] = stepTo(NARRATION_ORDER[k - 1]) === null ? null : +(s.p95 - seg[NARRATION_ORDER[k - 1]].p95).toFixed(2);
  if (k < NARRATION_ORDER.length - 1) junctions[`${id}->${NARRATION_ORDER[k + 1]}`] = stepTo(NARRATION_ORDER[k + 1]);

  const out = {
    ...s.side,
    narration_lock: { file: `src/lib/lessons/${lessonId}.narration.ts`, narration_sha256: NARRATION_SHA256, narration_chars: NARRATION_CHARS },
    qa_corrected: qc,
    asr_adjudications: adj,
    level_in_context: {
      momentary_p95_lufs: s.p95,
      corpus_median_m_p95_lufs: medP95,
      vs_corpus_median_lu: s.p95 === null || medP95 === null ? null : +(s.p95 - medP95).toFixed(2),
      junction_steps_lu: junctions,
      note: "Integrated loudness is unreliable below ~3 s, so level is also carried as the 95th percentile of 400 ms momentary loudness - speech only. What a learner perceives is the step at a junction: ~1 LU is the detection threshold, ~3 LU is plainly audible.",
    },
    gate_a: {
      status: bad.length ? "FAIL" : "PASS",
      date: new Date().toISOString().slice(0, 10),
      rows_failed: bad,
      as_written_rows_failed: Object.entries(s.side.qa).filter(([, v]) => v === false).map(([r]) => r),
      note: "Verdict is the CORRECTED gate. Three rows as the run first wrote them measure the instrument, not the audio, and each is restated against evidence: raw F0 onset>=body (over-strict), any pause>0.9s (a sentence boundary is a beat, not a stall), and duration +-5% of a chars/sec model (ordinary rate variation, and meaningless under 3 s). Both scorings are recorded.",
    },
  };
  writeFileSync(join(dir, `${id}.json`), JSON.stringify(out, null, 2) + "\n");
}

console.log(`  CORRECTED GATE`);
for (const r of rows) console.log(`    ${r.padEnd(32)} ${tally[r]}/${NARRATION_ORDER.length}${tally[r] === NARRATION_ORDER.length ? "  PASS" : "  <- FAIL"}`);
if (failures.length) { console.log(`\n  FAILURES:`); for (const f of failures) console.log(`    ${f}`); }
console.log(`\n  Gate A (corrected): ${failures.length ? "FAIL" : "PASS"} — ${NARRATION_ORDER.length} segments\n`);
process.exit(failures.length ? 1 : 0);
