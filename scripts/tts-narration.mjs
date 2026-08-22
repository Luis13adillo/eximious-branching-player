#!/usr/bin/env node
/**
 * Eximious narration TTS + mastering + Gate B QA.
 *
 *   node scripts/tts-narration.mjs --lesson siu-01-av1 --presenter curtis-whitfield \
 *        [--max-cost 0.32] [--dry-run] [--only intro,decision-1]
 *
 * WHAT THIS IS
 * ------------
 * Phase 1 ("Gate A") of the locked production pipeline, for any lesson and any presenter:
 *
 *     locked script -> TTS on the locked per-presenter voice config
 *                      (OpenAI for Diane/Curtis; fal -> MiniMax for Selena from 2026-08-22)
 *                   -> ffmpeg master to 24 kHz / mono / 128 kbps @ -24.5 LUFS
 *                   -> audio QA gate  <- MUST pass before any paid downstream step
 *
 * It does not batch, does not call any lip-sync provider, and does not touch video.
 *
 * SAFETY PROPERTIES
 * -----------------
 *  - FIDELITY PREFLIGHT. Every segment's text is re-hashed and re-counted against the
 *    values recorded in the narration module before a single character is sent. A drifted
 *    or edited script aborts the run rather than being spoken aloud and paid for.
 *  - HARD COST CEILING. The projected spend is computed from real character counts and
 *    compared to --max-cost before the first call. Over ceiling = abort.
 *  - RESUMABLE, NEVER DOUBLE-SPENT. A segment whose master already exists with a sidecar
 *    recording the same script_sha256 and the same voice config is skipped.
 *  - THE KEY IS NEVER PRINTED OR PERSISTED. Resolved from the environment or the
 *    authorized shared credential store, exactly as scripts/fal-upload.mjs does.
 *
 * The presenter table below is a TRANSCRIPTION of locked, client-approved definitions
 * (CLAUDE.md "Presenters"; docs/EXIMIOUS_PRODUCTION_SPEC.md). It is not a place to make
 * choices. Selena's `instructions` string is deliberately NOT duplicated here — it is read
 * from her tracked sidecar so there is exactly one canonical copy in the repo.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { master, measure, sha256, sha256Text, TARGET_LUFS, LUFS_TOLERANCE, TRUE_PEAK_CEILING, FORMAT } from "./audio-qa.mjs";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));

/** LOCKED presenter voice definitions. Do not edit without explicit written approval. */
const PRESENTERS = {
  "diane-marchetti": {
    label: "Diane Marchetti (Presenter 1)",
    model: "tts-1-hd",
    voice: "shimmer",
    speed: 1.0,
    instructions: null,
    f0: { fmin: 80, fmax: 400 },
    // Measured on the delivered claims-01 run (462.912 s / 7,319 chars).
    charsPerSec: 15.81,
  },
  "curtis-whitfield": {
    label: "Curtis Whitfield (Presenter 2)",
    model: "tts-1-hd",
    voice: "onyx",
    speed: 1.0,
    instructions: null,
    // Male register — the floor must sit below Diane's or the estimator will octave-double.
    f0: { fmin: 55, fmax: 320 },
    charsPerSec: 16.24,
  },
  /**
   * ★ RECAST 2026-08-22 — approved by Roger, relayed by Luis.
   *
   * Selena moves from OpenAI `gpt-4o-mini-tts` / `sage` to a MiniMax voice-design voice
   * served through fal. This is a production-rule-9 change (provider AND model) and a
   * client recasting decision; both were approved together. The superseded definition is
   * retained immediately below as `selena-navarro-v1-sage` so the shipped v1 audio stays
   * reproducible — it is NOT a fallback and must not be selected without a new approval.
   *
   * The 1133-character `instructions` string belonged to the OpenAI voice and does not
   * transfer: MiniMax takes no such parameter, and the delivery it described (including
   * "Do not add a Spanish or Hispanic accent") is precisely what this recast reverses.
   * Delivery here is carried by the designed voice itself.
   *
   * RISK, recorded rather than solved: `voice_id` is an account-scoped MiniMax
   * voice-design ID. voice-design is not deterministic, so the same design prompt is not
   * guaranteed to return this voice again. If the ID lapses, this voice may be
   * unrecoverable across the 42 courses Selena carries. Render early, keep the raws.
   */
  "selena-navarro": {
    label: "Selena Navarro (Presenter 3)",
    provider: "fal-minimax",
    endpoint: "fal-ai/minimax/speech-02-hd",
    model: "minimax/speech-02-hd",
    voice: "ttv-voice-2026082200132526-qth65Vqj",
    voiceLabel: "LA-1-mexican-american (voice-design, 2026-08-22)",
    speed: 1,
    vol: 1,
    pitch: 0,
    instructions: null,
    f0: { fmin: 80, fmax: 400 },
    // Measured on the LA-1 audition: 159 wpm / 154.8 Hz. Re-measured after the real run.
    charsPerSec: 14.24,
  },

  /** SUPERSEDED 2026-08-22 by the recast above. Kept only so v1 stays reproducible. */
  "selena-navarro-v1-sage": {
    label: "Selena Navarro (Presenter 3) — SUPERSEDED v1 sage",
    provider: "openai",
    superseded: "Replaced 2026-08-22 by the MiniMax LA-1 recast. Do not use without a new approval.",
    model: "gpt-4o-mini-tts-2025-12-15",
    voice: "sage",
    speed: null, // her locked definition directs delivery via `instructions`, not `speed`
    instructionsFrom: "public/media/presenter-3-selena-navarro-voice-SELECTED-v1-sage-superseded.json",
    instructionsSha256:
      "bdf6862d6f8dc101b66898b0d0b2d0df1c4946d62f02fa202bb4af932483eeda",
    f0: { fmin: 80, fmax: 400 },
    charsPerSec: 16.0,
  },
};

/** developers.openai.com/api/docs/pricing — re-verify before large runs. */
const PRICE = {
  "tts-1-hd": { perMillionChars: 30.0 },
  "gpt-4o-mini-tts-2025-12-15": { perMillionChars: 0.6, note: "text-in only; audio-out billed separately" },
  // fal bills MiniMax TTS per 1,000 characters. Recorded as $/1M for one comparable unit.
  // Re-verify before large runs; the run also records fal's own billed units from the
  // response headers, which is the figure that actually settles.
  "minimax/speech-02-hd": { perMillionChars: 100.0, note: "fal per-1k-character billing; header-reported units are authoritative" },
};

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
  return null;
}

/** Never printed, never persisted — same contract as scripts/fal-upload.mjs. */
function providerKey(provider) {
  if (provider === "fal-minimax") {
    const k = envValue("FAL_KEY");
    if (!k) throw new Error("FAL_KEY not found (environment or credential store)");
    return k;
  }
  return openaiKey();
}

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

function resolveInstructions(p) {
  if (!p.instructionsFrom) return null;
  const j = JSON.parse(readFileSync(join(REPO, p.instructionsFrom), "utf8"));
  const s = j.instructions ?? j.voiceConfig?.instructions;
  if (!s) throw new Error(`no instructions string in ${p.instructionsFrom}`);
  const got = sha256Text(s);
  if (p.instructionsSha256 && got !== p.instructionsSha256) {
    throw new Error(
      `instructions string sha256 mismatch\n  expected ${p.instructionsSha256}\n  got      ${got}\n` +
        `This string is part of a LOCKED presenter definition. Aborting.`
    );
  }
  return s;
}

/**
 * MiniMax speech-02-hd through fal. Returns { buf, billed } — `billed` is whatever fal
 * reported for the call, so the audit record carries the provider's own number rather
 * than our estimate.
 *
 * The raw is requested at 44.1 kHz / 256 kbps mono so the single calibrated master down to
 * the locked 24 kHz / 128 kbps has the cleanest possible source. Mastering is unchanged:
 * linear gain only, no compression, no limiting.
 */
async function minimaxTts({ key, endpoint, voice, speed, vol, pitch, input }) {
  const body = {
    text: input,
    voice_setting: { voice_id: voice, speed, vol, pitch },
    audio_setting: { sample_rate: 44100, bitrate: 256000, format: "mp3", channel: 1 },
  };
  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(`https://fal.run/${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        // Never echo the request body — it is confidential client script text.
        throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
      }
      const billed = {
        billable_units: res.headers.get("x-fal-billable-units"),
        request_id: res.headers.get("x-fal-request-id"),
      };
      const j = await res.json();
      const url = j?.audio?.url;
      if (!url) throw new Error(`no audio in response: ${JSON.stringify(j).slice(0, 200)}`);
      const ar = await fetch(url);
      if (!ar.ok) throw new Error(`audio download failed ${ar.status}`);
      return { buf: Buffer.from(await ar.arrayBuffer()), billed };
    } catch (e) {
      lastErr = e;
      if (attempt < 4) await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw lastErr;
}

async function tts({ key, model, voice, speed, instructions, input }) {
  const body = { model, voice, input, response_format: "mp3" };
  if (speed !== null && speed !== undefined) body.speed = speed;
  if (instructions) body.instructions = instructions;

  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const txt = await res.text();
        // Never echo the request body — it is confidential client script text.
        throw new Error(`HTTP ${res.status}: ${txt.slice(0, 300)}`);
      }
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      lastErr = e;
      if (attempt < 4) await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw lastErr;
}

// --------------------------------------------------------------------------- main

const lessonId = arg("lesson");
const presenterId = arg("presenter");
const dryRun = arg("dry-run") === true;
const maxCost = parseFloat(arg("max-cost", "0.35"));
const remaster = arg("remaster") === true;
const only = arg("only") ? String(arg("only")).split(",").map((s) => s.trim()) : null;

if (!lessonId || !presenterId) {
  console.error("usage: --lesson <id> --presenter <id> [--max-cost N] [--dry-run] [--only a,b]");
  process.exit(2);
}
const P = PRESENTERS[presenterId];
if (!P) {
  console.error(`unknown presenter "${presenterId}". known: ${Object.keys(PRESENTERS).join(", ")}`);
  process.exit(2);
}

const narrationPath = join(REPO, "src/lib/lessons", `${lessonId}.narration.ts`);
const mod = await import(narrationPath);
const { NARRATION, NARRATION_ORDER, NARRATION_SHA256 } = mod;

const outDir = join(REPO, "public/media", lessonId);
mkdirSync(outDir, { recursive: true });

const instructions = resolveInstructions(P);

console.log(`\nEXIMIOUS — Gate A narration`);
console.log(`  lesson    : ${lessonId}`);
console.log(`  presenter : ${P.label}`);
console.log(`  provider  : ${P.provider === "fal-minimax" ? `fal.ai -> MiniMax (${P.endpoint})` : "OpenAI"}`);
console.log(`  model     : ${P.model}   voice: ${P.voiceLabel ? `${P.voiceLabel}` : P.voice}   speed: ${P.speed ?? "n/a"}`);
if (P.provider === "fal-minimax") console.log(`  voice_id  : ${P.voice}`);
if (P.superseded) { console.error(`\n  ABORT — this presenter definition is SUPERSEDED: ${P.superseded}\n`); process.exit(2); }
console.log(`  instructions: ${instructions ? `locked string, sha256 ${P.instructionsSha256.slice(0, 16)}...` : "none (model takes no such parameter)"}`);
console.log(`  output    : public/media/${lessonId}/\n`);

// ---- 1. FIDELITY PREFLIGHT ------------------------------------------------
console.log("[1/4] Fidelity preflight — re-hashing every segment against the module...");
const ids = (only || NARRATION_ORDER).filter((id) => NARRATION[id]);
if (only && ids.length !== only.length) {
  console.error(`  unknown segment id(s) in --only`);
  process.exit(2);
}
let bad = 0;
for (const id of NARRATION_ORDER) {
  const seg = NARRATION[id];
  const h = sha256Text(seg.text);
  const okHash = h === seg.scriptSha256;
  const okLen = seg.text.length === seg.scriptChars;
  if (!okHash || !okLen) {
    bad++;
    console.error(`  DRIFT ${id}: hash ${okHash ? "ok" : `${h} != ${seg.scriptSha256}`}, chars ${okLen ? "ok" : `${seg.text.length} != ${seg.scriptChars}`}`);
  }
}
const combined = sha256Text(NARRATION_ORDER.map((id) => NARRATION[id].text).join("\n"));
if (combined !== NARRATION_SHA256) {
  bad++;
  console.error(`  DRIFT combined: ${combined} != ${NARRATION_SHA256}`);
}
if (bad) {
  console.error(`\n  ABORT — ${bad} fidelity failure(s). Nothing sent, nothing spent.`);
  process.exit(1);
}
console.log(`  ${NARRATION_ORDER.length}/${NARRATION_ORDER.length} segments verbatim; combined sha256 matches.\n`);

// ---- 2. COST PREFLIGHT ----------------------------------------------------
const totalChars = ids.reduce((a, id) => a + NARRATION[id].scriptChars, 0);
const price = PRICE[P.model];
const projected = (totalChars / 1e6) * price.perMillionChars;
console.log(`[2/4] Cost preflight`);
console.log(`  segments      : ${ids.length}`);
console.log(`  characters    : ${totalChars.toLocaleString()}`);
console.log(`  rate          : $${price.perMillionChars.toFixed(2)} / 1M characters (${P.model})`);
console.log(`  projected     : $${projected.toFixed(4)}`);
console.log(`  ceiling       : $${maxCost.toFixed(4)}`);
if (projected > maxCost) {
  console.error(`\n  ABORT — projected spend exceeds the ceiling. Nothing sent, nothing spent.`);
  process.exit(1);
}
console.log(`  within ceiling.\n`);

if (dryRun) {
  console.log("--dry-run: stopping before any API call.");
  process.exit(0);
}

// ---- 3. SYNTHESIS + MASTERING --------------------------------------------
const key = remaster ? null : providerKey(P.provider || "openai");
const scratch = process.env.SCRATCH || join(REPO, ".tts-raw");
mkdirSync(scratch, { recursive: true });

console.log("[3/4] Synthesis + mastering");
const results = [];
const billedUnits = [];
let spentChars = 0;
let skipped = 0;

for (const id of ids) {
  const seg = NARRATION[id];
  const outPath = join(outDir, `${id}.mp3`);
  const sidePath = join(outDir, `${id}.json`);

  if (!remaster && existsSync(outPath) && existsSync(sidePath)) {
    const prev = JSON.parse(readFileSync(sidePath, "utf8"));
    if (prev.script_sha256 === seg.scriptSha256 && prev.model === P.model && prev.voice === P.voice) {
      console.log(`  ${id.padEnd(14)} SKIP (already rendered, script unchanged)`);
      results.push({ id, ...prev, skipped: true });
      skipped++;
      continue;
    }
  }

  const rawPath = join(scratch, `${id}.raw.mp3`);
  const t0 = Date.now();

  // --remaster re-derives the delivered master from the raw synthesis already on disk.
  // It re-runs mastering and the full QA gate but NEVER calls the API, so it cannot spend.
  if (remaster) {
    if (!existsSync(rawPath)) {
      console.error(`  ${id.padEnd(14)} ABORT — --remaster needs the raw at ${rawPath}, which is absent.`);
      process.exit(1);
    }
  } else {
    let buf, billed = null;
    if (P.provider === "fal-minimax") {
      const r = await minimaxTts({
        key,
        endpoint: P.endpoint,
        voice: P.voice,
        speed: P.speed,
        vol: P.vol,
        pitch: P.pitch,
        input: seg.text,
      });
      buf = r.buf;
      billed = r.billed;
    } else {
      buf = await tts({
        key,
        model: P.model,
        voice: P.voice,
        speed: P.speed,
        instructions,
        input: seg.text,
      });
    }
    writeFileSync(rawPath, buf);
    if (billed) billedUnits.push({ id, ...billed });
    spentChars += seg.scriptChars;
  }

  const m = master(rawPath, outPath);
  const meas = measure(outPath, { f0: P.f0 });

  const sidecar = {
    asset: `${id}.mp3`,
    lesson: lessonId,
    presenter: P.label,
    provider: P.provider === "fal-minimax" ? "fal.ai -> MiniMax" : "OpenAI",
    endpoint:
      P.provider === "fal-minimax"
        ? `POST https://fal.run/${P.endpoint}`
        : "POST https://api.openai.com/v1/audio/speech",
    model: P.model,
    voice: P.voice,
    voice_label: P.voiceLabel ?? null,
    voice_setting:
      P.provider === "fal-minimax" ? { voice_id: P.voice, speed: P.speed, vol: P.vol, pitch: P.pitch } : null,
    raw_audio_setting:
      P.provider === "fal-minimax" ? { sample_rate: 44100, bitrate: 256000, format: "mp3", channel: 1 } : null,
    speed: P.speed,
    response_format: "mp3",
    instructions: instructions ? `LOCKED string, sha256 ${P.instructionsSha256}` : null,
    note:
      P.provider === "fal-minimax"
        ? "MiniMax takes no `instructions` parameter — delivery is carried by the designed voice itself. Recast approved by Roger 2026-08-22; supersedes gpt-4o-mini-tts/sage."
        : instructions
          ? "Delivery is directed by the locked `instructions` string; the string itself is not duplicated here."
          : "tts-1-hd takes no `instructions` parameter; that belongs to Selena's locked config only.",
    // Text itself is NEVER written to a sidecar — it is confidential client script.
    script_chars: seg.scriptChars,
    script_sha256: seg.scriptSha256,
    mastering:
      "single calibrated encode from raw; linear gain only (ffmpeg volume=NdB); no compression, no limiting",
    mastering_detail: { i_raw: m.iRaw, gain_db: m.gainDb, calibration_passes: m.passes },
    audio: {
      lufs_integrated: meas.integrated,
      lra: meas.lra,
      true_peak_dbfs: meas.truePeak,
      speech_lufs: meas.speechLufs,
      sample_rate: meas.probe.sample_rate,
      channels: meas.probe.channels,
      bit_rate: meas.probe.bit_rate,
      duration_s: +meas.probe.duration.toFixed(3),
    },
    f0: {
      onset_hz: meas.f0.onsetHz === null ? null : +meas.f0.onsetHz.toFixed(1),
      body_hz: meas.f0.bodyHz === null ? null : +meas.f0.bodyHz.toFixed(1),
      voiced_frames: meas.f0.voicedFrames,
    },
    qa: {},
    sha256: sha256(outPath),
    date: new Date().toISOString().slice(0, 10),
  };

  // ---- Gate B rows ----
  const a = sidecar.audio;
  const est = seg.scriptChars / P.charsPerSec;
  sidecar.qa = {
    loudness: Math.abs(a.lufs_integrated - TARGET_LUFS) <= LUFS_TOLERANCE,
    true_peak: a.true_peak_dbfs <= TRUE_PEAK_CEILING,
    format:
      a.sample_rate === FORMAT.sample_rate &&
      a.channels === FORMAT.channels &&
      Math.abs(a.bit_rate - FORMAT.bit_rate) < 4000 &&
      meas.probe.streams === 1,
    flat: meas.flat === 0,
    no_trunc: meas.truncation.ok,
    // Restated per the Video 1 finding: boundary pauses are prosody, not stalls.
    pause: meas.pauses.length === 0,
    // Restated per the Video 1 finding: the row exists to catch an onset at ~half body
    // pitch, so the calibrated threshold is 0.75x body, not ">= body".
    f0: meas.f0.onsetHz !== null && meas.f0.bodyHz !== null && meas.f0.onsetHz >= 0.75 * meas.f0.bodyHz,
    duration: Math.abs(a.duration_s - est) / est <= 0.05,
  };
  sidecar.qa_detail = {
    pauses: meas.pauses,
    estimated_s: +est.toFixed(3),
    duration_delta_pct: +(((a.duration_s - est) / est) * 100).toFixed(1),
    truncation: meas.truncation,
    f0_onset_ratio: meas.f0.bodyHz ? +(meas.f0.onsetHz / meas.f0.bodyHz).toFixed(3) : null,
    momentary_frames: meas.momentaryCount,
  };

  writeFileSync(sidePath, JSON.stringify(sidecar, null, 2) + "\n");
  results.push({ id, ...sidecar, skipped: false });

  const fails = Object.entries(sidecar.qa).filter(([, v]) => !v).map(([k]) => k);
  console.log(
    `  ${id.padEnd(14)} ${String(seg.scriptChars).padStart(5)}ch  ${a.duration_s.toFixed(3).padStart(7)}s  ` +
      `I ${a.lufs_integrated.toFixed(2)}  TP ${String(a.true_peak_dbfs).padStart(5)}  ` +
      `F0 ${String(sidecar.f0.onset_hz).padStart(5)}/${String(sidecar.f0.body_hz).padStart(5)}  ` +
      `${fails.length ? `FLAG: ${fails.join(",")}` : "clean"}  (${((Date.now() - t0) / 1000).toFixed(1)}s)`
  );
}

// ---- 4. SUMMARY -----------------------------------------------------------
// A --remaster run sends nothing, so `spentChars` is 0. The summary is the AUDIT RECORD
// of what this lesson's narration cost, so a re-master must carry the prior figure
// forward rather than overwrite it with $0.00.
const summaryPath = join(outDir, "_gate-a-summary.json");
const priorSpend =
  existsSync(summaryPath) ? (JSON.parse(readFileSync(summaryPath, "utf8")).spend_usd ?? 0) : 0;
const thisRunSpend = (spentChars / 1e6) * price.perMillionChars;
const actualSpend = remaster ? priorSpend : priorSpend + thisRunSpend;
const totalDur = results.reduce((a, r) => a + r.audio.duration_s, 0);
const rows = ["loudness", "true_peak", "format", "flat", "no_trunc", "pause", "f0", "duration"];

console.log(`\n[4/4] Gate B summary`);
for (const row of rows) {
  const pass = results.filter((r) => r.qa[row]).length;
  console.log(`  ${row.padEnd(12)} ${pass}/${results.length}${pass === results.length ? "  PASS" : "  -> see flags"}`);
}
console.log(`\n  characters synthesised : ${spentChars.toLocaleString()}  (${skipped} segment(s) skipped, already rendered)`);
console.log(`  spend THIS RUN         : $${thisRunSpend.toFixed(4)}${remaster ? "  (--remaster: no API calls)" : ""}`);
console.log(`  GATE A SPEND TO DATE   : $${actualSpend.toFixed(4)}`);
console.log(`  measured narration     : ${totalDur.toFixed(3)} s  (${(totalDur / 60).toFixed(2)} min)`);
console.log(`  measured rate          : ${(totalChars / totalDur).toFixed(2)} chars/sec  (model assumed ${P.charsPerSec})`);

writeFileSync(
  summaryPath,
  JSON.stringify(
    {
      lesson: lessonId,
      presenter: P.label,
      provider: P.provider === "fal-minimax" ? "fal.ai -> MiniMax" : "OpenAI",
      endpoint: P.provider === "fal-minimax" ? `https://fal.run/${P.endpoint}` : "https://api.openai.com/v1/audio/speech",
      model: P.model,
      voice: P.voice,
      voice_label: P.voiceLabel ?? null,
      date: new Date().toISOString(),
      segments: results.length,
      characters: totalChars,
      characters_synthesised: spentChars,
      spend_usd: +actualSpend.toFixed(4),
      spend_this_run_usd: +thisRunSpend.toFixed(4),
      measured_total_s: +totalDur.toFixed(3),
      measured_chars_per_sec: +(totalChars / totalDur).toFixed(2),
      provider_billed_units: billedUnits.length ? billedUnits : null,
      gate_b: Object.fromEntries(rows.map((r) => [r, `${results.filter((x) => x.qa[r]).length}/${results.length}`])),
      segments_detail: results.map((r) => ({
        id: r.id,
        chars: r.script_chars,
        duration_s: r.audio.duration_s,
        lufs: r.audio.lufs_integrated,
        speech_lufs: r.audio.speech_lufs,
        true_peak: r.audio.true_peak_dbfs,
        qa: r.qa,
      })),
    },
    null,
    2
  ) + "\n"
);
console.log(`\n  wrote public/media/${lessonId}/_gate-a-summary.json\n`);
