"use client";

/**
 * MediaPreloader
 * ============================================================================
 * Warms the browser's media buffer for a set of URLs by mounting hidden
 * `preload="auto"` elements off-screen. Used to preload all four feedback
 * assets while a decision is on screen, so the moment the learner picks an
 * option its feedback starts with no perceptible dead air. Uses real <video>/
 * <audio> elements (not fetch) so the buffered data — including range requests —
 * is reused by the visible player for the same URL.
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
          <audio key={u} src={u} preload="auto" muted />
        ) : (
          <video key={u} src={u} preload="auto" muted playsInline />
        ),
      )}
    </div>
  );
}
