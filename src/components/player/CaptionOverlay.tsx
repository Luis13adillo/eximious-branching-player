"use client";

import type { Caption } from "@/lib/branching/types";

/**
 * Caption overlay. Renders the active cue for the current playback time. For
 * placeholder scenes this doubles as the visible narration, so the lesson is
 * fully readable and accessible before any voiceover asset exists.
 */
export function CaptionOverlay({
  captions,
  currentTime,
  visible,
}: {
  captions?: Caption[];
  currentTime: number;
  visible: boolean;
}) {
  if (!visible || !captions || captions.length === 0) return null;
  const cue = captions.find(
    (c) => currentTime >= c.start && currentTime < c.end,
  );
  if (!cue) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-4"
      aria-live="polite"
    >
      <p
        key={cue.text}
        className="ex-animate-fade max-w-[52ch] rounded-lg bg-navy-950/78 px-4 py-2 text-center font-sans text-[15px] leading-snug text-ink-100 shadow-lg backdrop-blur-sm sm:text-base"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
      >
        {cue.text}
      </p>
    </div>
  );
}
