import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * Iframe embedding (Thinkific / any LMS)
 * --------------------------------------------------------------
 * We deliberately do NOT send X-Frame-Options (which would block framing).
 * Instead we set a CSP `frame-ancestors` directive. It is permissive by default
 * so the POC can be embedded anywhere; for production, replace `*` with the
 * specific hosts allowed to embed, e.g.:
 *
 *   "frame-ancestors 'self' https://*.thinkific.com https://*.thinkificsites.com;"
 *
 * Only `frame-ancestors` is set, so no other resource loading is restricted.
 */
const FRAME_ANCESTORS =
  process.env.NEXT_PUBLIC_FRAME_ANCESTORS ?? "frame-ancestors *;";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray lockfile elsewhere on the machine can't
  // confuse dev/build root detection (and Vercel).
  turbopack: { root: projectRoot },
  // Hide the Next dev overlay button — it otherwise floats over the player UI.
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: FRAME_ANCESTORS,
          },
        ],
      },
      {
        // Narration media caching.
        //
        // Next.js serves everything in `public/` as
        // `cache-control: public, max-age=0, must-revalidate`, which tells the
        // browser it may not reuse a file without asking the server first. For
        // 1080p narration that is expensive: a <video> issues many range
        // requests per clip, and iOS Safari evicts media buffers early under
        // memory pressure, so a phone re-fetches video it already had. Measured
        // 2026-08-22 on the deployed preview: transfers pinned at ~120 KB/s
        // against the ~2.8-3.4 Mbps these clips need to play in real time.
        //
        // SIXTY SECONDS, and do not raise it without a cache-busting URL.
        // Delivered media is replaced IN PLACE at the same path (the Selena
        // recast, 2026-08-22), so any meaningful max-age can leave a reviewer
        // playing a superseded cut with no way to tell. This was set to 3600
        // earlier the same day and reduced after a reviewer reported not
        // hearing the recast: an hour of stale audio during an active review
        // is a worse failure than a slow load. Sixty seconds still lets one
        // playback reuse its own range requests, which is where most of the
        // benefit was. No `stale-while-revalidate`, same reason.
        //
        // The real fix, if long caching is ever wanted, is a content hash in
        // the media URL so a new cut is a new URL. Until then, keep this low.
        //
        // Preview-side only: the Thinkific package is served by Thinkific with
        // their own headers, so this does not travel with the deliverable.
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
