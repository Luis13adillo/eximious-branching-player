#!/usr/bin/env node
/**
 * Canonical fal upload helper for Eximious TEMPORARY INPUT assets.
 *
 * WHY THIS EXISTS
 * ---------------
 * fal CDN objects are write-once and, for an ordinary account key, PERMANENT. Verified
 * during the Video 1 run (2026-08-19): DELETE returns 403 under every auth scheme including
 * no auth at all, so the refusal is method-level rather than a credentials problem; the
 * storage management routes on rest.alpha.fal.ai 404 for a normal key; and fal's own docs
 * state that the request-delete API removes request payloads and OUTPUT CDN files but that
 * "CDN files found in the input of the request are not deleted, as they may be used by
 * other requests." Every asset we upload to drive a generation is an input.
 *
 * Video 1 alone therefore left 9 permanent, undeletable objects — including narration audio
 * carrying verbatim confidential pilot-script content. Across the 267-video catalog that
 * pattern would accumulate on the order of 2,400 objects that can never be removed.
 *
 * Retention can only be set AT UPLOAD TIME. It cannot be applied retroactively. That makes
 * this helper the single control point, so ALL temporary Eximious fal inputs must go
 * through it.
 *
 * RETENTION: 24 hours. See RETENTION_SECONDS below for the reasoning.
 *
 * SCOPE — inputs only.
 * Do NOT use this for anything delivered or approved. Presenter masters, motion bases,
 * narration masters and delivered segments live in the repo under public/media/ and are
 * permanent by design. This helper is exclusively for the throwaway copies that exist only
 * so a generation endpoint can fetch them over HTTP.
 *
 * USAGE
 *   node scripts/fal-upload.mjs <file> [content-type] [--retain-seconds N]
 * Prints the resulting public URL on stdout. Reads FAL_KEY from the environment or from the
 * authorized shared credential store; never prints or persists it.
 */

import { readFileSync, existsSync } from "node:fs";
import { basename } from "node:path";

/**
 * 24 hours.
 *
 * The remote object is needed ONLY while a generation endpoint is fetching it: the queue
 * wait plus inference, plus any retry. It is NOT needed for QA — every gate in this pipeline
 * runs on the downloaded local files — and it is never needed for delivery.
 *
 * Measured on the Video 1 run: a LatentSync call took 5-10 minutes, the Kling motion base
 * ~2.5 minutes, and the complete media run (TTS -> batching -> 8 lip-sync calls with QA
 * gates between the canaries) spanned roughly 2-3 hours wall clock.
 *
 * 24 h gives that session ~8x headroom and, importantly, survives an overnight pause so a
 * next-morning retry does not 404 and force a re-upload. Rejected alternatives:
 *   1 h  - too tight; one queued batch plus a QA gate plus a retry can exceed it.
 *   6 h  - covers a working session but not an overnight pause.
 *   48 h+ - no benefit, since retries happen same-session or next-morning, and it only
 *           increases how much is live at any moment.
 * This is the shortest duration that safely covers generation + retry without ever forcing
 * redundant re-uploads of confidential material.
 */
const RETENTION_SECONDS = 86_400;

const ENV_FALLBACK = "/Users/luismiguel/Desktop/rubric/templates/generations/.env";

function falKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  if (existsSync(ENV_FALLBACK)) {
    for (const line of readFileSync(ENV_FALLBACK, "utf8").split("\n")) {
      if (line.trim().startsWith("FAL_KEY=")) {
        return line.split("=").slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
      }
    }
  }
  throw new Error("FAL_KEY not found (env or credential store)");
}

const CT = {
  ".wav": "audio/wav", ".mp3": "audio/mpeg", ".mp4": "video/mp4",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
};

export async function uploadTemporaryInput(path, contentType, retainSeconds = RETENTION_SECONDS) {
  const ct = contentType || CT[path.slice(path.lastIndexOf(".")).toLowerCase()] || "application/octet-stream";
  const key = falKey();

  // Retention is only settable here, at upload time. Never omit this header.
  const lifecycle = JSON.stringify({ expiration_duration_seconds: retainSeconds });

  const init = await fetch(
    "https://rest.alpha.fal.ai/storage/upload/initiate?storage_type=fal-cdn-v3",
    {
      method: "POST",
      headers: {
        Authorization: `Key ${key}`,
        "Content-Type": "application/json",
        "X-Fal-Object-Lifecycle-Preference": lifecycle,
      },
      body: JSON.stringify({ content_type: ct, file_name: basename(path) }),
    }
  );
  if (!init.ok) throw new Error(`initiate failed: ${init.status} ${await init.text()}`);
  const { upload_url, file_url } = await init.json();

  const put = await fetch(upload_url, {
    method: "PUT",
    headers: {
      "Content-Type": ct,
      "X-Fal-Object-Lifecycle-Preference": lifecycle,
    },
    body: readFileSync(path),
  });
  if (!put.ok) throw new Error(`upload failed: ${put.status} ${await put.text()}`);

  // VERIFY THE POLICY ACTUALLY LANDED.
  //
  // This guard is not paranoia. Measured 2026-08-19: fal does NOT validate this header --
  // sending `X-Fal-Object-Lifecycle-Preference: not-json` still returns HTTP 200 and simply
  // ignores it, producing a PERMANENT, undeletable object with no error anywhere. A typo
  // would therefore be silent, and silence is exactly how a catalog run accumulates
  // thousands of unremovable objects holding confidential narration.
  //
  // An object carrying a lifecycle answers HEAD with `x-fal-object-lifecycle-expiration`
  // (Unix ms). An object without one omits the header entirely and falls back to a 60-day
  // cache-control. So the presence of that header is the assertion.
  const head = await fetch(file_url, { method: "HEAD" });
  const expMs = head.headers.get("x-fal-object-lifecycle-expiration");
  if (!expMs) {
    throw new Error(
      `RETENTION NOT APPLIED to ${file_url} - fal accepted the upload but set no expiry, ` +
      `so this object is permanent and cannot be deleted. Check the header value.`
    );
  }
  const hours = (Number(expMs) - Date.now()) / 3_600_000;
  const wantHours = retainSeconds / 3600;
  if (!(hours > wantHours * 0.9 && hours < wantHours * 1.1 + 1)) {
    throw new Error(
      `RETENTION MISMATCH on ${file_url}: expires in ${hours.toFixed(2)}h, expected ~${wantHours}h`
    );
  }

  return { url: file_url, contentType: ct, retainSeconds, expiresAt: new Date(Number(expMs)).toISOString() };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const i = args.indexOf("--retain-seconds");
  const retain = i === -1 ? RETENTION_SECONDS : Number(args[i + 1]);
  const positional = args.filter((a, n) => a !== "--retain-seconds" && (i === -1 || n !== i + 1));
  if (!positional[0]) {
    console.error("usage: node scripts/fal-upload.mjs <file> [content-type] [--retain-seconds N]");
    process.exit(1);
  }
  const r = await uploadTemporaryInput(positional[0], positional[1], retain);
  console.error(`uploaded as temporary input; expiry VERIFIED, expires ${r.expiresAt} (${r.retainSeconds / 3600}h)`);
  console.log(r.url);
}
