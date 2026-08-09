"use client";

import type { FeedbackScene } from "@/lib/branching/types";
import { CheckIcon, XIcon } from "@/components/ui/icons";

/**
 * ConsequenceStage
 * ============================================================================
 * The "shown, not told" branch beat. When the learner picks an option, the
 * stage visibly reacts: a color-graded verdict (gold for correct, muted red for
 * incorrect) and a present-tense line stating what their choice DOES — before
 * the written rationale in the panel below. This is what makes each branch feel
 * like a distinct scene rather than a quiz result over an idle presenter.
 */
export function ConsequenceStage({ scene }: { scene: FeedbackScene }) {
  const correct = scene.verdict === "correct";

  return (
    <div className="absolute inset-0">
      {/* verdict color wash tying the whole frame to the outcome */}
      <div
        className="absolute inset-0"
        style={{
          background: correct
            ? "radial-gradient(90% 70% at 50% 40%, rgba(199,162,84,0.20), rgba(5,15,31,0) 70%)"
            : "radial-gradient(90% 70% at 50% 40%, rgba(201,119,106,0.20), rgba(5,15,31,0) 70%)",
        }}
      />

      <div className="ex-animate-drift absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 pb-20 pt-16 text-center sm:px-10">
        {/* verdict mark */}
        <div className="relative">
          <span
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: correct
                ? "0 0 0 0 rgba(199,162,84,0.5)"
                : "0 0 0 0 rgba(201,119,106,0.5)",
              animation: "exPulseRing 2.4s var(--ease-cinematic) infinite",
              background: correct
                ? "var(--color-verdict-correct)"
                : "var(--color-verdict-incorrect)",
              opacity: 0.25,
            }}
          />
          <span
            className={`relative flex h-16 w-16 items-center justify-center rounded-full ring-1 sm:h-20 sm:w-20 ${
              correct
                ? "bg-[color:var(--color-verdict-correct-soft)] text-[color:var(--color-verdict-correct)] ring-[color:var(--color-verdict-correct)]/50"
                : "bg-[color:var(--color-verdict-incorrect-soft)] text-[color:var(--color-verdict-incorrect)] ring-[color:var(--color-verdict-incorrect)]/50"
            }`}
          >
            {correct ? (
              <CheckIcon className="h-8 w-8 sm:h-9 sm:w-9" />
            ) : (
              <XIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            )}
          </span>
        </div>

        <div
          className={`font-sans text-[11px] font-bold uppercase tracking-[0.28em] ${
            correct
              ? "text-[color:var(--color-verdict-correct)]"
              : "text-[color:var(--color-verdict-incorrect)]"
          }`}
        >
          {correct ? "On the right track" : "Here's what that does"}
        </div>

        {scene.consequence && (
          <p
            className="max-w-xl font-[family-name:var(--font-display)] text-xl leading-snug text-ink-100 sm:text-2xl md:text-[26px]"
            style={{ textShadow: "0 2px 14px rgba(0,0,0,0.5)" }}
          >
            {scene.consequence}
          </p>
        )}
      </div>
    </div>
  );
}
