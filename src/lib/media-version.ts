/**
 * Media cache-busting (web preview only)
 * ============================================================================
 * Delivered media (`/media/<lesson>/<seg>.mp4`, posters, captions) is replaced
 * IN PLACE at the same path when a cut is re-delivered — e.g. Selena's voice
 * recast on 2026-08-22. Because the URL does not change, a browser that already
 * cached the old file keeps playing it until its `max-age` expires. During an
 * active review that means a reviewer can hear a superseded voice with no way
 * to tell (this happened: a reviewer on the production URL kept hearing the
 * pre-recast voice). `next.config.ts` documents the same fix in the media
 * cache-control comment: "a content hash in the media URL so a new cut is a new
 * URL."
 *
 * `mediaSrc()` appends `?v=<version>` to every `/media/...` URL at the point it
 * becomes a `src`/`poster`/`track` attribute. `<version>` changes on every
 * deploy (the git commit sha — see `NEXT_PUBLIC_MEDIA_VERSION` in
 * `next.config.ts`), so a redeployed cut is a brand-new URL that no browser can
 * have cached. Freshness is then guaranteed regardless of `max-age`.
 *
 * WEB-ONLY, by construction:
 *   - `NEXT_PUBLIC_MEDIA_VERSION` is injected by `next.config.ts`, which only
 *     the Next.js build evaluates. The offline Thinkific package is a separate
 *     Vite app (`export-thinkific/`) that never sets it, so there the version
 *     is empty and URLs stay bare — exactly what the offline package needs
 *     (Thinkific serves it under its own scheme and headers).
 *   - The `typeof process` guard keeps this from throwing if the function is
 *     ever bundled into a browser context where `process` is undefined (e.g.
 *     that Vite build); it simply returns the URL unchanged.
 *
 * Pure string function. Apply it ONLY at the final attribute binding, never to
 * a value used for logic (`u.endsWith(".mp3")`, `key={u}`) — those must see the
 * bare path.
 */
const MEDIA_VERSION =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_MEDIA_VERSION) ||
  "";

export function mediaSrc(url: string | undefined): string | undefined {
  if (!url || !MEDIA_VERSION) return url; // no version (dev/offline export) -> bare
  if (!url.startsWith("/media/")) return url; // only version delivered media
  if (url.includes("?")) return url; // never double-stamp
  return `${url}?v=${MEDIA_VERSION}`;
}
