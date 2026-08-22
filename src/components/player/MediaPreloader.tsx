"use client";

/**
 * MediaPreloader
 * ============================================================================
 * Warms the browser's media pipeline for a set of URLs by mounting hidden
 * elements off-screen. Used on the four feedback assets while a decision is on
 * screen, so the moment the learner picks an option its feedback starts with no
 * perceptible dead air. Uses real <video>/<audio> elements (not fetch) so the
 * connection, the container index and the opening bytes are reused by the
 * visible player for the same URL.
 *
 * `preload="metadata"`, NOT `"auto"` — deliberate, and do not raise it.
 * `"auto"` asks the browser to fetch each clip in full. A decision has four
 * feedback clips, and on this catalog they run up to 19 MB each, so `"auto"`
 * put ~40-60 MB in flight over the same connection as the video the learner is
 * actually watching. Measured 2026-08-22 against the deployed preview: four
 * concurrent clips each crawled at ~140 KB/s for 14 s, starving playback.
 * `"metadata"` fetches the header and index only — a few hundred KB — which is
 * what actually removes the dead air, because it is the part that must arrive
 * before a play() can start. Rule 8 keeps this player-side: no re-render.
 */
export function MediaPreloader({ urls }: { urls: (string | undefined)[] }) {
  const seen = new Set<string>();
  const list = urls.filter((u): u is string => {
    if (!u || seen.has(u)) return false;
    seen.add(u);
    return true;
  });
  if (list.length === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
      style={{ left: -99999, top: 0 }}
    >
      {list.map((u) =>
        u.endsWith(".mp3") ? (
          <audio key={u} src={u} preload="metadata" muted />
        ) : (
          <video key={u} src={u} preload="metadata" muted playsInline />
        ),
      )}
    </div>
  );
}
