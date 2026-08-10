"use client";

import { useEffect, useRef } from "react";
import type { FeedbackScene, Lesson } from "@/lib/branching/types";
import type { MachineState } from "@/lib/branching/engine";
import { lessonOutline } from "@/lib/branching/engine";
import { ArrowRightIcon, CheckIcon, ReplayIcon, XIcon } from "@/components/ui/icons";

function ContinueButton({
  label,
  onClick,
  emphatic,
  autoFocus,
}: {
  label: string;
  onClick: () => void;
  emphatic?: boolean;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus({ preventScroll: true });
  }, [autoFocus]);
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={`group/cta inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 font-sans text-sm font-semibold transition-all ${
        emphatic
          ? "bg-gold-500 text-navy-950 shadow-lg shadow-gold-900/40 hover:bg-gold-400"
          : "bg-white/10 text-ink-100 hover:bg-white/16"
      }`}
    >
      {label}
      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5" />
    </button>
  );
}

/** Headline + body for exhibit scenes, shown in the panel (not over the video). */
export function SceneContext({
  kicker,
  headline,
  subhead,
  body,
}: {
  kicker?: string;
  headline?: string;
  subhead?: string;
  body?: string;
}) {
  if (!headline && !body) return null;
  return (
    <div className="ex-animate-fade mb-5 border-b border-white/8 pb-5">
      {kicker && (
        <div className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300">
          {kicker}
        </div>
      )}
      {headline && (
        <h2 className="font-[family-name:var(--font-display)] text-2xl leading-tight text-ink-100 sm:text-[28px]">
          {headline}
        </h2>
      )}
      {subhead && (
        <p className="mt-1 font-sans text-[15px] text-ink-300">{subhead}</p>
      )}
      {body && (
        <p className="mt-3 max-w-2xl font-sans text-[15px] leading-relaxed text-ink-200">
          {body}
        </p>
      )}
    </div>
  );
}

/** Continuation control for narrative scenes. */
export function ContinueBar({
  label,
  onContinue,
  ready,
}: {
  label: string;
  onContinue: () => void;
  /** true once the segment has finished playing → emphasize + focus */
  ready: boolean;
}) {
  return (
    <div className="ex-animate-fade flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <p className="font-sans text-sm text-ink-300">
        {ready ? "Ready when you are." : "Watch the segment, or continue when ready."}
      </p>
      <div className="sm:shrink-0">
        {/* Primary action is always prominent (gold) — including on mobile,
            where a muted pill read as disabled. `ready` still drives autofocus. */}
        <ContinueButton
          label={label}
          onClick={onContinue}
          emphatic
          autoFocus={ready}
        />
      </div>
    </div>
  );
}

/** Branch feedback: verdict + written rationale + continue to the rejoin. */
export function FeedbackNote({
  scene,
  onContinue,
  ready,
}: {
  scene: FeedbackScene;
  onContinue: () => void;
  ready: boolean;
}) {
  const correct = scene.verdict === "correct";
  return (
    <div className="ex-animate-drift">
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`flex h-8 items-center gap-1.5 rounded-full px-3 font-sans text-xs font-bold uppercase tracking-widest ${
            correct
              ? "bg-[color:var(--color-verdict-correct-soft)] text-[color:var(--color-verdict-correct)]"
              : "bg-[color:var(--color-verdict-incorrect-soft)] text-[color:var(--color-verdict-incorrect)]"
          }`}
        >
          {correct ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <XIcon className="h-3.5 w-3.5" />
          )}
          {correct ? "Correct" : "Not quite"}
        </span>
        <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink-300">
          You chose {scene.forOptionId}
        </span>
      </div>

      {scene.headline && (
        <h2 className="font-[family-name:var(--font-display)] text-xl leading-snug text-ink-100 sm:text-2xl">
          {scene.headline}
        </h2>
      )}
      {scene.body && (
        <p className="mt-2 max-w-2xl font-sans text-[15px] leading-relaxed text-ink-200">
          {scene.body}
        </p>
      )}

      <div className="mt-5">
        <ContinueButton
          label={correct ? "Continue" : "Try again"}
          onClick={onContinue}
          emphatic
          autoFocus={ready}
        />
      </div>
    </div>
  );
}

/** End-of-lesson summary with a review of the decision(s) and a restart. */
export function CompletionSummary({
  lesson,
  state,
  onRestart,
}: {
  lesson: Lesson;
  state: MachineState;
  onRestart: () => void;
}) {
  const outline = lessonOutline(lesson);
  const decisions = outline.filter((o) => o.kind === "decision");
  const records = decisions.map((d) => ({
    step: d,
    rec: state.decisions[d.id],
  }));
  const correctCount = records.filter((r) => r.rec?.isCorrect).length;
  const total = decisions.length;
  const allCorrect = correctCount === total;

  // All lesson-specific copy comes from data (lesson.completion), with generic
  // fallbacks — nothing here is hard-coded to a particular lesson.
  const headline = allCorrect
    ? (lesson.completion?.headlineAllCorrect ?? "Handled to standard.")
    : (lesson.completion?.headlinePartial ?? "Case resolved — here's the takeaway.");

  return (
    <div className="ex-animate-drift">
      <div className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-300">
        Lesson complete
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl leading-tight text-ink-100 sm:text-3xl">
        {headline}
      </h2>
      <p className="mt-2 max-w-2xl font-sans text-[15px] leading-relaxed text-ink-200">
        {allCorrect ? (
          <>
            You made {correctCount} of {total} decision
            {total === 1 ? "" : "s"} the way a seasoned professional would.
          </>
        ) : (
          <>
            The case resolves correctly no matter what you chose — but your call
            would have put it at risk. You matched the professional standard on{" "}
            {correctCount} of {total} decision{total === 1 ? "" : "s"} this time.
          </>
        )}
        {lesson.completion?.takeaway && (
          <>
            {" "}
            The rule to carry forward: {lesson.completion.takeaway}
          </>
        )}
      </p>

      <div className="mt-5 flex flex-col gap-2">
        {records.map(({ step, rec }) => (
          <div
            key={step.id}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-navy-900/40 px-4 py-2.5"
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                rec?.isCorrect
                  ? "bg-[color:var(--color-verdict-correct-soft)] text-[color:var(--color-verdict-correct)]"
                  : "bg-[color:var(--color-verdict-incorrect-soft)] text-[color:var(--color-verdict-incorrect)]"
              }`}
            >
              {rec?.isCorrect ? (
                <CheckIcon className="h-3.5 w-3.5" />
              ) : (
                <XIcon className="h-3 w-3" />
              )}
            </span>
            <span className="flex-1 font-sans text-sm text-ink-200">
              {step.label}
            </span>
            <span className="font-sans text-xs text-ink-400">
              chose {rec?.optionId ?? "—"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 font-sans text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
        >
          <ReplayIcon className="h-4 w-4" />
          Restart the case
        </button>
      </div>
    </div>
  );
}
