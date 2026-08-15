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
  holdMs = 6500,
  fadeMs = 700,
}: {
  /** How long it stays fully visible before fading. */
  holdMs?: number;
  /** Fade-out duration. */
  fadeMs?: number;
}) {
  const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fading"), holdMs);
    const t2 = setTimeout(() => setPhase("gone"), holdMs + fadeMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [holdMs, fadeMs]);

  if (phase === "gone") return null;

  return (
    // Announced once to screen readers; never intercepts clicks. Dark/navy
    // treatment keeps the small type readable over the presenter footage.
    // Pinned into its OWN vertical band (`top-16`) that sits clearly BELOW the
    // presenter lower-third chip (which lives at `top-5`, desktop only), so the
    // two never overlap on any breakpoint — the chip keeps its approved
    // position and this notice occupies the row beneath it.
    <div
      role="note"
      aria-label="AI presenter disclosure"
      className={`pointer-events-none absolute inset-x-0 top-16 z-20 flex justify-center px-3 transition-opacity ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${fadeMs}ms` }}
    >
      <p className="max-w-[94%] rounded-lg bg-navy-950/85 px-3.5 py-2 text-center font-sans text-[11px] font-medium leading-snug text-ink-100 ring-1 ring-white/15 backdrop-blur-sm sm:max-w-[80%] sm:text-[12px]">
        {AI_DISCLOSURE_TEXT}
      </p>
    </div>
  );
}
