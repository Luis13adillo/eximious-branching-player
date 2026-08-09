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
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-4">
      <p
        key={cue.text}
        className="ex-animate-fade max-w-[34ch] rounded bg-navy-950/40 px-2.5 py-1 text-center font-sans text-[12px] leading-snug text-ink-100 backdrop-blur-[2px] sm:max-w-[42ch] sm:text-[13.5px]"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.6)" }}
      >
        {cue.text}
      </p>
    </div>
  );
}
