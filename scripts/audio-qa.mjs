#!/usr/bin/env node
/**
 * Eximious narration measurement + mastering library.
 *
 * WHY THIS EXISTS
 * ---------------
 * Video 1 (Diane / claims-01) was mastered and QA'd by an ad-hoc scratchpad script that
 * did not survive the session. The measurements are recorded in
 * docs/VIDEO_1_GENERATION_CONFIGS.md and in the per-segment sidecars, but the code that
 * produced them is gone, so Video 2 would otherwise have to re-derive it from prose.
 * Across 267 videos that is a correctness risk, not just an inconvenience: the locked
 * audio standard is only meaningful if every presenter is measured by the SAME code.
 *
 * Everything here is measurement and linear gain. Nothing in this file is a creative or
 * approval decision, and nothing here calls a paid API.
 *
 * VERIFIED against Diane's delivered claims-01 masters: this code reproduces the values
 * already recorded in public/media/claims-01-av1/*.json (e.g. intro.mp3 -> I -24.5,
 * LRA 3.9, true peak -6.7 dBFS).
 */

import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";

/** The locked audio standard. docs/EXIMIOUS_PRODUCTION_SPEC.md, "Audio standard". */
export const TARGET_LUFS = -24.5;
export const LUFS_TOLERANCE = 0.3;
export const TRUE_PEAK_CEILING = -3.0;
export const FORMAT = { sample_rate: 24000, channels: 1, bit_rate: 128000 };

/**
 * ffmpeg writes ALL of its measurements (ebur128, astats, silencedetect) to STDERR, so
 * this must capture stderr, not stdout. Reading stdout alone silently yields empty
 * strings and every measurement parses as null.
 */
function ff(args) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", ...args], {
    encoding: "utf8",
    maxBuffer: 512 * 1024 * 1024,
  });
  return `${r.stdout || ""}${r.stderr || ""}`;
}

function ffWithErr(args) {
  const r = execFileSync("ffmpeg", ["-hide_banner", "-nostats", ...args], {
    encoding: "buffer",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 512 * 1024 * 1024,
  });
  return r;
}

/**
 * EBU R128 scan. Returns the Summary block (integrated, LRA, true peak) AND the
 * per-frame momentary/short-term series, which is what makes short-segment
 * verification possible — see `speechLevel`.
 */
export function ebur128(path) {
  const out = ff(["-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"]);
  const stderr = out;

  const summary = stderr.slice(stderr.lastIndexOf("Summary:"));
  const grab = (re) => {
    const m = summary.match(re);
    return m ? parseFloat(m[1]) : null;
  };

  const momentary = [];
  const shortTerm = [];
  for (const line of stderr.split("\n")) {
    const m = line.match(/M:\s*(-?[\d.]+)/);
    const s = line.match(/S:\s*(-?[\d.]+)/);
    if (m) momentary.push(parseFloat(m[1]));
    if (s) shortTerm.push(parseFloat(s[1]));
  }

  return {
    integrated: grab(/I:\s*(-?[\d.]+)\s*LUFS/),
    threshold: grab(/Threshold:\s*(-?[\d.]+)\s*LUFS/),
    lra: grab(/LRA:\s*(-?[\d.]+)\s*LU/),
    truePeak: grab(/Peak:\s*(-?[\d.]+)\s*dBFS/),
    momentary,
    shortTerm,
  };
}

/**
 * LENGTH-INDEPENDENT LEVEL MEASURE.
 *
 * Integrated loudness applies BS.1770 relative gating over the whole programme, so its
 * reliability degrades as a file gets short (few 400 ms blocks, and the relative gate can
 * end up computed from a handful of them). `speechLevel` sidesteps that: it takes the mean
 * of the momentary (400 ms) loudness values that sit within `windowLu` of the file's own
 * momentary peak — i.e. the level of the SPEECH, ignoring leading/trailing silence and
 * ignoring how much of the file is silence.
 *
 * That makes it comparable across segments of any length, which is exactly what is needed
 * to prove a 2.6 s segment sits at the same perceived level as a 60 s one.
 */
export function speechLevel(momentary, windowLu = 20) {
  const voiced = momentary.filter((v) => v > -70);
  if (voiced.length === 0) return { speechLufs: null, frames: 0, peakM: null };
  const peakM = Math.max(...voiced);
  const active = voiced.filter((v) => v >= peakM - windowLu);
  // Mean in the energy domain, not the log domain — averaging dB understates loud frames.
  const meanEnergy =
    active.reduce((a, v) => a + Math.pow(10, v / 10), 0) / active.length;
  return {
    speechLufs: 10 * Math.log10(meanEnergy),
    frames: active.length,
    peakM,
  };
}

export function probe(path) {
  const out = execFileSync(
    "ffprobe",
    [
      "-v", "error",
      "-select_streams", "a:0",
      "-show_entries", "stream=sample_rate,channels,bit_rate,codec_name:format=duration",
      "-of", "json",
      path,
    ],
    { encoding: "utf8" }
  );
  const j = JSON.parse(out);
  const s = j.streams?.[0] || {};
  return {
    codec: s.codec_name,
    sample_rate: Number(s.sample_rate),
    channels: Number(s.channels),
    bit_rate: Number(s.bit_rate),
    duration: Number(j.format?.duration),
    streams: (j.streams || []).length,
  };
}

/** astats -> Flat factor. Non-zero means consecutive identical samples (digital flat/stuck). */
export function flatFactor(path) {
  const out = ff(["-i", path, "-af", "astats=metadata=1:reset=0", "-f", "null", "-"]);
  const vals = [...out.matchAll(/Flat factor:\s*([\d.]+)/g)].map((m) => parseFloat(m[1]));
  return vals.length ? Math.max(...vals) : null;
}

/** Internal pauses longer than `minDur` seconds, excluding leading/trailing silence. */
export function internalPauses(path, duration, minDur = 0.9, noiseDb = -50) {
  const out = ff([
    "-i", path,
    "-af", `silencedetect=n=${noiseDb}dB:d=${minDur}`,
    "-f", "null", "-",
  ]);
  const starts = [...out.matchAll(/silence_start:\s*(-?[\d.]+)/g)].map((m) => parseFloat(m[1]));
  const ends = [...out.matchAll(/silence_end:\s*(-?[\d.]+)/g)].map((m) => parseFloat(m[1]));
  const pauses = [];
  for (let i = 0; i < starts.length; i++) {
    const st = starts[i];
    const en = i < ends.length ? ends[i] : duration;
    // Leading and trailing silence are not "internal".
    if (st <= 0.05) continue;
    if (en >= duration - 0.05) continue;
    pauses.push({ start: +st.toFixed(3), end: +en.toFixed(3), dur: +(en - st).toFixed(3) });
  }
  return pauses;
}

/** Decode to mono float samples at `rate`. */
export function decodePcm(path, rate = 24000) {
  const buf = ffWithErr([
    "-i", path, "-f", "s16le", "-acodec", "pcm_s16le",
    "-ar", String(rate), "-ac", "1", "-",
  ]);
  const n = Math.floor(buf.length / 2);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = buf.readInt16LE(i * 2) / 32768;
  return out;
}

/**
 * Autocorrelation F0, with the two corrections the Video 1 run required:
 *   - a confidence floor of 0.60 (the draft's 0.30 accepted the glottal attack transient
 *     and produced a spurious 72 Hz "masculine onset" reading on Diane's fb-1a), and
 *   - onset reported as the MEDIAN of the first 5 confidently voiced frames, not the
 *     single first frame.
 * See docs/VIDEO_1_GENERATION_CONFIGS.md, "Three apparent defects".
 */
export function f0(path, { fmin = 55, fmax = 400, rate = 24000, minCorr = 0.6 } = {}) {
  const x = decodePcm(path, rate);
  const frame = Math.round(0.04 * rate);
  const hop = Math.round(0.01 * rate);
  const minLag = Math.floor(rate / fmax);
  const maxLag = Math.ceil(rate / fmin);
  const voiced = [];

  for (let s = 0; s + frame + maxLag < x.length; s += hop) {
    let mean = 0;
    for (let i = 0; i < frame; i++) mean += x[s + i];
    mean /= frame;

    let e0 = 0;
    for (let i = 0; i < frame; i++) {
      const v = x[s + i] - mean;
      e0 += v * v;
    }
    if (e0 < 1e-6) continue;

    let bestCorr = 0;
    let bestLag = 0;
    for (let lag = minLag; lag <= maxLag; lag++) {
      let num = 0;
      let e1 = 0;
      for (let i = 0; i < frame; i++) {
        const a = x[s + i] - mean;
        const b = x[s + i + lag] - mean;
        num += a * b;
        e1 += b * b;
      }
      if (e1 < 1e-9) continue;
      const c = num / Math.sqrt(e0 * e1);
      if (c > bestCorr) {
        bestCorr = c;
        bestLag = lag;
      }
    }
    if (bestCorr >= minCorr && bestLag > 0) {
      voiced.push({ t: s / rate, hz: rate / bestLag, corr: bestCorr });
    }
  }

  const median = (a) => {
    if (!a.length) return null;
    const b = [...a].sort((p, q) => p - q);
    const m = b.length >> 1;
    return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
  };

  return {
    onsetHz: median(voiced.slice(0, 5).map((v) => v.hz)),
    bodyHz: median(voiced.map((v) => v.hz)),
    voicedFrames: voiced.length,
  };
}

/**
 * Truncation test, v3 (the version that survived Video 1).
 * v1 required >=0.30 s of trailing silence — that is just silencedetect's minimum
 * duration, so clean files failed. v2 measured the max of the final 200 ms, which
 * flagged the fricative in segments ending in /s/. v3 measures the final frame's level
 * relative to the file's own speech level and confirms it is decaying.
 */
export function truncationCheck(path, rate = 24000) {
  const x = decodePcm(path, rate);
  if (x.length < rate * 0.2) return { ok: false, reason: "file too short to test" };

  const rms = (from, to) => {
    let s = 0;
    for (let i = from; i < to; i++) s += x[i] * x[i];
    return Math.sqrt(s / Math.max(1, to - from));
  };

  const speech = rms(0, x.length);
  const tailN = Math.round(0.02 * rate);
  const last = rms(x.length - tailN, x.length);
  const prev = rms(x.length - 3 * tailN, x.length - 2 * tailN);
  const ratio = last / (speech || 1e-9);

  return {
    ok: ratio < 0.05 && last <= prev * 1.5,
    tailRatio: +ratio.toFixed(5),
    falling: last <= prev * 1.5,
  };
}

/**
 * THE LOCKED MASTERING PROCEDURE.
 *
 * The raw OpenAI tts-1-hd output is ALREADY mp3 / 24 kHz / mono / 128 kbps and already
 * sits near -24.5 LUFS, so mastering only has to calibrate loudness. But a decode ->
 * re-encode generation costs a uniform ~0.5 dB, so calibrating against the INPUT lands the
 * OUTPUT ~0.5 dB low (Video 1's first master run produced -24.9/-25.0 and failed the gate).
 *
 * Hence the two-pass calibration: a throwaway probe encode measures the generation loss,
 * and the single delivered encode is made from RAW with the corrected gain.
 * Linear gain only. Never compression, never limiting.
 *
 * `volume` MUST carry the explicit `dB` suffix — a bare number is a linear amplitude
 * multiplier, which would be a ~9x gain error.
 */
export function master(rawPath, outPath, { target = TARGET_LUFS, tol = 0.049, maxPasses = 5 } = {}) {
  const encode = (gainDb, dest) =>
    ff([
      "-y", "-i", rawPath,
      "-af", `volume=${gainDb.toFixed(4)}dB`,
      "-ar", String(FORMAT.sample_rate),
      "-ac", String(FORMAT.channels),
      "-c:a", "libmp3lame",
      "-b:a", "128k",
      dest,
    ]);

  const iRaw = ebur128(rawPath).integrated;
  let gain = target - iRaw;
  const passes = [];

  // Each pass is a COMPLETE encode from raw at a single candidate gain, so whatever is
  // sitting at outPath when the loop exits is by construction "one calibrated encode from
  // raw, linear gain only" — the locked procedure. Earlier passes are simply discarded by
  // being overwritten; none of them is ever cascaded into the next.
  //
  // Video 1 used exactly two passes because a decode->re-encode generation costs a uniform
  // ~0.5 dB. That constant is only approximately constant: on siu-01 it left fb-3d and
  // resolution-1 at -24.60 — inside the +-0.3 gate, but off the 22/22-at-exactly--24.50
  // standard Video 1 actually delivered. Iterating to +-0.05 closes that gap at zero cost
  // and changes no locked parameter.
  let i = null;
  for (let p = 0; p < maxPasses; p++) {
    encode(gain, outPath);
    i = ebur128(outPath).integrated;
    passes.push({ gain_db: +gain.toFixed(4), measured: i });
    if (Math.abs(i - target) <= tol) break;
    gain += target - i;
  }

  return { iRaw, gainDb: +gain.toFixed(4), passes, finalI: i };
}

export function sha256(pathOrBuf) {
  const buf = typeof pathOrBuf === "string" ? readFileSync(pathOrBuf) : pathOrBuf;
  return execFileSync("shasum", ["-a", "256"], { input: buf, encoding: "utf8" })
    .split(" ")[0]
    .trim();
}

export function sha256Text(text) {
  return execFileSync("shasum", ["-a", "256"], {
    input: Buffer.from(text, "utf8"),
    encoding: "utf8",
  })
    .split(" ")[0]
    .trim();
}

/** Full Gate B measurement set for one mastered segment. */
export function measure(path, opts = {}) {
  const p = probe(path);
  const e = ebur128(path);
  const sl = speechLevel(e.momentary);
  return {
    probe: p,
    integrated: e.integrated,
    lra: e.lra,
    truePeak: e.truePeak,
    threshold: e.threshold,
    speechLufs: sl.speechLufs === null ? null : +sl.speechLufs.toFixed(2),
    speechFrames: sl.frames,
    momentaryCount: e.momentary.length,
    flat: flatFactor(path),
    pauses: internalPauses(path, p.duration, opts.pauseMin ?? 0.9),
    f0: f0(path, opts.f0 || {}),
    truncation: truncationCheck(path),
  };
}

export { writeFileSync };
