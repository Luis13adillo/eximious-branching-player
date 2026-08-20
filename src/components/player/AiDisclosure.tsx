"use client";

import { useEffect, useState } from "react";

/**
 * Contract-required AI-presenter disclosure (Agreement §1.4 / Video Production
 * Spec §6). The wording is FIXED — do not alter it. Shown briefly at the opening
 * of every lesson, then fades out (never permanently displayed). Rendered at the
 * template level so it carries across all lessons/presenters automatically.
 */
export const AI_DISCLOSURE_TEXT =
  "Your presenter is AI-generated. All course content is authored by Roger M. Naut, drawn from 35 years in insurance claims investigation and adjusting.";

export function AiDisclosure({
  started = true,
  holdMs = 2400,
  fadeMs = 600,
}: {
  /**
   * Whether the lesson has actually begun. The notice appears WITH the video,
   * not with the page: the player no longer autoplays, so a disclosure timed
   * from page load could hold and fade while the lesson still sat unstarted,
   * satisfying "shown at the opening of the application video" on paper only.
   * Mounting it at the start also keeps the locked bottom-left position clear
   * of the Start control, which owns the centre of an unstarted stage.
   */
  started?: boolean;
  /** How long it stays fully visible before fading (~2–3s total with fade). */
  holdMs?: number;
  /** Fade-out duration. */
  fadeMs?: number;
}) {
  const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");

  // `phase` starts at "visible" and only ever moves forward, and these timers
  // are the only thing that moves it — so arming them when the lesson starts is
  // the whole behaviour. No reset needed: the notice shows once per video.
  useEffect(() => {
    if (!started) return;
    const t1 = setTimeout(() => setPhase("fading"), holdMs);
    const t2 = setTimeout(() => setPhase("gone"), holdMs + fadeMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [started, holdMs, fadeMs]);

  // Nothing before the lesson starts — the video has not opened yet.
  if (!started || phase === "gone") return null;

  return (
    // Small, subtle, SECONDARY notice pinned to the BOTTOM-LEFT of the video,
    // lifted to sit immediately ABOVE the caption band (which lives at
    // bottom-14/16) so the two never overlap — and still clear of Diane (centre)
    // and the Course Presenter lower-third (top-left). Never intercepts
    // clicks; dark scrim keeps the small type readable over the footage. It is
    // rendered once per application video in LessonPlayer's persistent stage
    // wrapper (not keyed to scenes), so it shows at the opening only and never
    // reappears when later segments load.
    <div
      role="note"
      aria-label="AI presenter disclosure"
      className={`pointer-events-none absolute bottom-24 left-4 z-20 max-w-[62%] transition-opacity sm:bottom-28 sm:left-6 sm:max-w-[46%] ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${fadeMs}ms` }}
    >
      <p className="rounded-md bg-navy-950/70 px-2.5 py-1.5 text-left font-sans text-[10px] leading-snug text-ink-300 ring-1 ring-white/10 backdrop-blur-sm sm:text-[11px]">
        {AI_DISCLOSURE_TEXT}
      </p>
    </div>
  );
}
