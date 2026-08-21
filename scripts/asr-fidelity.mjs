#!/usr/bin/env node
/**
 * Gate B script-fidelity row: ASR read-back of every delivered narration master.
 *
 *   node scripts/asr-fidelity.mjs --lesson siu-01-av1 [--max-cost 0.08] [--dry-run]
 *
 * WHY ASR AT ALL
 * --------------
 * The synthesis INPUT is already proven verbatim (sha256, checked before the call by
 * scripts/tts-narration.mjs). What that cannot catch is the model mis-reading correct
 * input: a dropped word, a wrong homograph, a mangled number. The only way to check what
 * the audio actually SAYS is to listen to it, so the delivered masters are transcribed and
 * diffed against the script.
 *
 * READ THE DIFFS, DO NOT AUTO-FAIL ON THEM. On Video 1 all three apparent defects were
 * ASR artifacts, not audio defects: whisper smoothed a rare word ("defensibly" ->
 * "defensively"), and dropped a spoken "oh" when rendering a claim number as a numeral.
 * A raw word-error rate is therefore a TRIAGE SIGNAL, not a verdict — every difference is
 * listed for judgement rather than silently counted.
 *
 * This reads delivered assets and changes nothing. It is QA tooling spend, itemised
 * separately from production media.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { probe } from "./audio-qa.mjs";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const ENV_FALLBACK = "/Users/luismiguel/Desktop/rubric/templates/generations/.env";

/** developers.openai.com/api/docs/pricing */
const WHISPER_PER_MINUTE = 0.006;

function openaiKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  if (existsSync(ENV_FALLBACK)) {
    for (const line of readFileSync(ENV_FALLBACK, "utf8").split("\n")) {
      if (line.trim().startsWith("OPENAI_API_KEY=")) {
        return line.split("=").slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
      }
    }
  }
  throw new Error("OPENAI_API_KEY not found (environment or credential store)");
}

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

/**
 * Canonical token form for comparison.
 *
 * Numbers are the whole problem: the script writes "4471-88203" while a transcript may
 * return the same utterance as digits, as words, grouped differently, or with a spoken
 * "oh" silently converted to "0". Every numeral is therefore exploded into its individual
 * DIGIT WORDS, and the digit-word spellings a reader actually uses ("oh"/"o" for zero) are
 * folded onto the same token. That makes "4471" and "four four seven one" identical, which
 * is what we want: the row is testing whether the words were SAID, not how the transcriber
 * chose to spell them.
 */
function normalise(text) {
  let t = text.toLowerCase();
  t = t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
  t = t.replace(/[—–]/g, " ");
  // digits -> digit words, one per digit
  t = t.replace(/\d/g, (d) => ` ${ONES[+d]} `);
  t = t.replace(/[^a-z' ]/g, " ");
  const map = { oh: "zero", o: "zero", nought: "zero", percent: "percent" };
  return t
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/^'+|'+$/g, ""))
    .filter(Boolean)
    .map((w) => map[w] || w);
}

/** Word-level alignment; returns the differing spans only. */
function diff(a, b) {
  const n = a.length, m = b.length;
  // Standard edit-distance DP with backtrace. Segment-sized inputs, so O(nm) is fine.
  const d = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      d[i][j] = a[i - 1] === b[j - 1]
        ? d[i - 1][j - 1]
        : 1 + Math.min(d[i - 1][j - 1], d[i - 1][j], d[i][j - 1]);

  const ops = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) { ops.push({ op: "=", a: a[i - 1] }); i--; j--; }
    else if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + 1) { ops.push({ op: "~", a: a[i - 1], b: b[j - 1] }); i--; j--; }
    else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { ops.push({ op: "-", a: a[i - 1] }); i--; }
    else { ops.push({ op: "+", b: b[j - 1] }); j--; }
  }
  ops.reverse();

  // Group runs of non-equal ops, with a little equal-context either side.
  const spans = [];
  for (let k = 0; k < ops.length; k++) {
    if (ops[k].op === "=") continue;
    let e = k;
    while (e + 1 < ops.length && ops[e + 1].op !== "=") e++;
    spans.push({
      before: ops.slice(Math.max(0, k - 4), k).map((o) => o.a).join(" "),
      script: ops.slice(k, e + 1).filter((o) => o.a !== undefined).map((o) => o.a).join(" "),
      heard: ops.slice(k, e + 1).filter((o) => o.b !== undefined).map((o) => o.b).join(" "),
      after: ops.slice(e + 1, e + 5).map((o) => o.a).filter(Boolean).join(" "),
    });
    k = e;
  }
  return { distance: d[n][m], spans };
}

async function transcribe(key, path) {
  const fd = new FormData();
  fd.append("file", new Blob([readFileSync(path)], { type: "audio/mpeg" }), path.split("/").pop());
  fd.append("model", "whisper-1");
  fd.append("response_format", "json");
  // No `prompt`: priming whisper with the expected text would bias it toward reporting
  // what we hope to hear, which defeats the entire point of the read-back.
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: fd,
    });
    if (res.ok) return (await res.json()).text;
    if (attempt === 4) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    await new Promise((r) => setTimeout(r, 1500 * attempt));
  }
}

// --------------------------------------------------------------------------- main
const lessonId = arg("lesson");
const dryRun = arg("dry-run") === true;
const maxCost = parseFloat(arg("max-cost", "0.08"));
if (!lessonId) { console.error("usage: --lesson <id> [--max-cost N] [--dry-run]"); process.exit(2); }

const mod = await import(join(REPO, "src/lib/lessons", `${lessonId}.narration.ts`));
const { NARRATION, NARRATION_ORDER } = mod;
const dir = join(REPO, "public/media", lessonId);

const totalSec = NARRATION_ORDER.reduce((a, id) => a + probe(join(dir, `${id}.mp3`)).duration, 0);
const projected = (totalSec / 60) * WHISPER_PER_MINUTE;

console.log(`\nEXIMIOUS — Gate B script-fidelity read-back`);
console.log(`  lesson    : ${lessonId}`);
console.log(`  segments  : ${NARRATION_ORDER.length}`);
console.log(`  audio     : ${totalSec.toFixed(3)} s (${(totalSec / 60).toFixed(2)} min)`);
console.log(`  model     : whisper-1 @ $${WHISPER_PER_MINUTE}/min`);
console.log(`  projected : $${projected.toFixed(4)}   ceiling $${maxCost.toFixed(4)}`);
if (projected > maxCost) { console.error(`\n  ABORT — over ceiling. Nothing sent.`); process.exit(1); }
if (dryRun) { console.log("\n--dry-run: stopping before any API call."); process.exit(0); }

const key = openaiKey();
const report = [];
let totalWords = 0, totalDist = 0;

console.log(`\n  id             words   editDist   WER      spans`);
for (const id of NARRATION_ORDER) {
  const heardRaw = await transcribe(key, join(dir, `${id}.mp3`));
  const a = normalise(NARRATION[id].text);
  const b = normalise(heardRaw);
  const { distance, spans } = diff(a, b);
  totalWords += a.length;
  totalDist += distance;
  report.push({ id, words: a.length, distance, wer: distance / a.length, spans, heardRaw });
  console.log(
    `  ${id.padEnd(14)} ${String(a.length).padStart(5)}  ${String(distance).padStart(8)}   ${(100 * distance / a.length).toFixed(2).padStart(5)}%   ${spans.length}`
  );
}

console.log(`\n  OVERALL: ${totalDist} word edits over ${totalWords} words = ${(100 * totalDist / totalWords).toFixed(3)}% WER`);
console.log(`  segments transcribed exactly: ${report.filter((r) => r.distance === 0).length}/${report.length}`);
console.log(`  ACTUAL SPEND: $${projected.toFixed(4)}\n`);

if (totalDist > 0) {
  console.log(`  EVERY DIFFERENCE, for judgement:`);
  for (const r of report) {
    if (!r.spans.length) continue;
    console.log(`\n  --- ${r.id} (${r.distance} edit${r.distance > 1 ? "s" : ""}) ---`);
    for (const s of r.spans) {
      console.log(`    ...${s.before}  [ script: "${s.script}" | heard: "${s.heard}" ]  ${s.after}...`);
    }
  }
}

// The transcript is confidential client narration; it stays in the scratchpad, never the repo.
const outPath = join(process.env.SCRATCH || "/tmp", `${lessonId}-asr.json`);
writeFileSync(outPath, JSON.stringify({ lesson: lessonId, model: "whisper-1", spend_usd: +projected.toFixed(4), total_wer: totalDist / totalWords, report }, null, 2) + "\n");
console.log(`\n  full transcripts -> ${outPath} (scratchpad: confidential, not in the repo)\n`);
