"use client";

import { useEffect, useMemo, useState } from "react";
import type { DecisionScene, OptionId } from "@/lib/branching/types";
import { orderOptionsForAttempt } from "@/lib/branching/shuffle";
import { ReplayIcon, XIcon } from "@/components/ui/icons";

const POSITION_LETTERS = ["A", "B", "C", "D"] as const;

/**
 * DecisionPanel — the A/B/C/D choice. Options are buttons (each routes the
 * learner immediately), laid out 2×2 on desktop and stacked on mobile. Clear
 * hover / focus / selected states; answerable by clicking or pressing A–D.
 *
 * Retry-until-correct: options the learner already tried and got wrong come
 * back marked "Tried" and disabled, so on re-entry they can see what they've
 * ruled out and pick a different answer. The learner keeps choosing until they
 * actively select the correct option.
 */
export function DecisionPanel({
  scene,
  onSelect,
  attempted = [],
  onReplayQuestion,
  shuffleOnRetry = true,
}: {
  scene: DecisionScene;
  onSelect: (id: OptionId) => void;
  /** Wrong options already tried at this decision (marked + disabled). */
  attempted?: OptionId[];
  /** Manually replay the question video/narration (used after a retry re-entry). */
  onReplayQuestion?: () => void;
  /** Reshuffle answer order after a wrong answer (template default: on). */
  shuffleOnRetry?: boolean;
}) {
  const [chosen, setChosen] = useState<OptionId | null>(null);
  const retrying = attempted.length > 0;

  // DISPLAY order only. First visit (no attempts) = lesson-defined order; each
  // retry reshuffles deterministically. The option OBJECTS are untouched, so
  // correctness, feedback routing, analytics, and the "tried" marking all stay
  // bound to the option's identity (its id), never to its screen position.
  const displayOptions = useMemo(
    () =>
      shuffleOnRetry
        ? orderOptionsForAttempt(scene.options, scene.id, attempted.length)
        : scene.options.slice(),
    [scene.id, scene.options, attempted.length, shuffleOnRetry],
  );

  // LAYOUT — the option board adapts to the length of the authored answers.
  // In two columns each option gets roughly 120px of text width, so a long
  // answer wraps to three words a line and reads as a shredded column. Past
  // these thresholds the options take the panel's full width instead, and past
  // the denser one the type, letter chip and padding tighten so all four still
  // land in view. This is template behavior driven by the copy itself — no
  // lesson has to opt in, and the short-answer 2x2 board is unchanged.
  const lengths = displayOptions.map(
    (o) => o.label.length + (o.detail?.length ?? 0),
  );
  const longest = Math.max(...lengths, 0);
  const totalLength = lengths.reduce((n, len) => n + len, 0);
  const stacked = longest > 70 || totalLength > 200;
  const dense = longest > 190 || totalLength > 420;

  const choose = (id: OptionId) => {
    if (chosen || attempted.includes(id)) return;
    setChosen(id);
    // brief visual acknowledgement, then route to feedback (kept short so the
    // pre-loaded feedback media starts with no perceptible dead air)
    window.setTimeout(() => onSelect(id), 140);
  };

  // reset the local acknowledgement whenever the decision (re)mounts
  useEffect(() => setChosen(null), [scene.id]);

  // keyboard: A / B / C / D map to DISPLAYED position (so the letters the
  // learner sees always match the keys), then resolve to that option's identity
  // (skips options already tried).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = e.key.toUpperCase();
      const idx = POSITION_LETTERS.indexOf(k as (typeof POSITION_LETTERS)[number]);
      if (idx >= 0 && idx < displayOptions.length) {
        const opt = displayOptions[idx];
        if (opt && !attempted.includes(opt.id)) {
          e.preventDefault();
          choose(opt.id);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id, chosen, attempted, displayOptions]);

  return (
    <div className="ex-animate-drift">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2
          className={`font-[family-name:var(--font-display)] leading-snug text-ink-100 ${
            dense ? "text-[17px] sm:text-lg" : "text-lg sm:text-xl"
          }`}
        >
          {scene.prompt}
        </h2>
        <span className="hidden shrink-0 font-sans text-[11px] uppercase tracking-[0.18em] text-sky-300 sm:block">
          {scene.decisionLabel ?? scene.kicker}
        </span>
      </div>

      {/* manual replay — the question no longer auto-replays on a retry re-entry */}
      {onReplayQuestion && (
        <button
          type="button"
          onClick={onReplayQuestion}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 font-sans text-[12px] text-ink-200 transition-colors hover:border-sky-500/50 hover:text-ink-100"
        >
          <ReplayIcon className="h-3.5 w-3.5" />
          Replay question
        </button>
      )}

      {/* retry hint — shown once the learner has a wrong attempt on this decision */}
      {retrying && (
        <p className="ex-animate-fade mb-3 flex items-center gap-2 rounded-lg border border-[color:var(--color-verdict-incorrect)]/30 bg-[color:var(--color-verdict-incorrect-soft)] px-3 py-2 font-sans text-[13px] text-[color:var(--color-verdict-incorrect)]">
          <XIcon className="h-3.5 w-3.5 shrink-0" />
          Not quite — pick a different answer to continue.
        </p>
      )}

      <div
        role="group"
        aria-label="Choose your answer"
        className={`grid ${dense ? "gap-2 sm:gap-2.5" : "gap-2.5 sm:gap-3"} ${
          stacked ? "" : "sm:grid-cols-2"
        }`}
      >
        {displayOptions.map((o, idx) => {
          const isChosen = chosen === o.id;
          const isTried = attempted.includes(o.id);
          const dim = (chosen && !isChosen) || isTried;
          const letter = POSITION_LETTERS[idx];
          return (
            <button
              key={o.id}
              type="button"
              // Stable identity handle — the option's own id, independent of its
              // shuffled screen position (used by state, analytics, and tests).
              data-option-id={o.id}
              disabled={!!chosen || isTried}
              onClick={() => choose(o.id)}
              aria-label={isTried ? `${o.label} — already tried, incorrect` : o.label}
              className={`group/opt flex items-start rounded-xl border text-left transition-all duration-200 ${
                dense
                  ? "gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3"
                  : "gap-3 p-3.5 sm:p-4"
              } ${
                isChosen
                  ? "border-sky-500 bg-sky-500/12 ring-2 ring-sky-500/50"
                  : isTried
                    ? "border-[color:var(--color-verdict-incorrect)]/30 bg-navy-900/40"
                    : "border-white/12 bg-navy-900/50 hover:border-sky-500/60 hover:bg-navy-800/60"
              } ${dim ? "opacity-50" : ""} ${chosen || isTried ? "cursor-default" : "cursor-pointer"}`}
            >
              <span
                className={`mt-0.5 flex shrink-0 items-center justify-center rounded-lg font-[family-name:var(--font-display)] font-semibold transition-colors ${
                  dense ? "h-7 w-7 text-[13px]" : "h-8 w-8 text-base"
                } ${
                  isChosen
                    ? "bg-sky-500 text-navy-950"
                    : isTried
                      ? "bg-[color:var(--color-verdict-incorrect-soft)] text-[color:var(--color-verdict-incorrect)]"
                      : "bg-white/8 text-sky-300 group-hover/opt:bg-sky-500 group-hover/opt:text-navy-950"
                }`}
              >
                {isTried ? <XIcon className="h-4 w-4" /> : letter}
              </span>
              <span className="min-w-0">
                <span
                  className={`block font-sans font-medium text-ink-100 ${
                    dense ? "text-[14px]" : "text-[15px]"
                  } ${stacked ? "leading-[1.45]" : "leading-snug"}`}
                >
                  {o.label}
                </span>
                {isTried ? (
                  <span className="mt-0.5 block font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-verdict-incorrect)]">
                    Tried · incorrect
                  </span>
                ) : (
                  o.detail && (
                    <span className="mt-0.5 block font-sans text-[13px] leading-snug text-ink-200">
                      {o.detail}
                    </span>
                  )
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p
        className={`hidden font-sans text-[11px] text-ink-400 sm:block ${
          dense ? "mt-2.5" : "mt-3"
        }`}
      >
        Tip — you can also press{" "}
        <span className="font-semibold text-ink-200">A</span>,{" "}
        <span className="font-semibold text-ink-200">B</span>,{" "}
        <span className="font-semibold text-ink-200">C</span>, or{" "}
        <span className="font-semibold text-ink-200">D</span> to choose.
      </p>
    </div>
  );
}
