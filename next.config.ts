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
    ];
  },
};

export default nextConfig;
