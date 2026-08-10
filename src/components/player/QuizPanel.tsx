"use client";

import { useEffect, useRef, useState } from "react";
import type { OptionId, QuizScene } from "@/lib/branching/types";
import {
  ArrowRightIcon,
  CheckIcon,
  ReplayIcon,
  XIcon,
} from "@/components/ui/icons";

/**
 * QuizPanel — the terminal graded completion quiz.
 * ============================================================================
 * Fully data-driven: it renders whatever questions the lesson's QuizScene
 * defines and passes at the lesson's own `passPct`. One question at a time,
 * with a scored result screen, per-question review, and retry — so the same
 * component runs the quiz for lesson #1 and lesson #267 with no code changes.
 *
 * The quiz gates completion: the learner must score at or above the pass mark.
 * Selection is by click or the A–D keys, matching the decision interaction.
 */

export interface QuizResult {
  correct: number;
  total: number;
  scorePct: number;
  passPct: number;
  passed: boolean;
}

export function QuizPanel({
  scene,
  onCompleted,
  onRestartLesson,
}: {
  scene: QuizScene;
  onCompleted?: (result: QuizResult) => void;
  onRestartLesson: () => void;
}) {
  const questions = scene.questions;
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(OptionId | null)[]>(
    () => questions.map(() => null),
  );
  const [phase, setPhase] = useState<"asking" | "result">("asking");
  const firedRef = useRef(false);

  const current = questions[index];
  const chosen = answers[index];

  const choose = (id: OptionId) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = id;
      return next;
    });
  };

  const goNext = () => {
    if (chosen == null) return;
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      setPhase("result");
    }
  };

  // keyboard: A / B / C / D to select, Enter to advance (asking phase only)
  useEffect(() => {
    if (phase !== "asking") return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(k)) {
        const opt = current.options.find((o) => o.id === (k as OptionId));
        if (opt) {
          e.preventDefault();
          choose(opt.id);
        }
      } else if (e.key === "Enter" && chosen != null) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, chosen]);

  // Score + fire the completion event once, when the result screen appears.
  const correctCount = answers.reduce((n, ans, i) => {
    const correctId = questions[i].options.find((o) => o.isCorrect)?.id;
    return n + (ans && ans === correctId ? 1 : 0);
  }, 0);
  const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const passed = scorePct >= scene.passPct;

  useEffect(() => {
    if (phase === "result" && !firedRef.current) {
      firedRef.current = true;
      onCompleted?.({
        correct: correctCount,
        total,
        scorePct,
        passPct: scene.passPct,
        passed,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const retry = () => {
    setAnswers(questions.map(() => null));
    setIndex(0);
    setPhase("asking");
    firedRef.current = false;
  };

  // ---------------------------------------------------------------- result
  if (phase === "result") {
    const headline = passed
      ? (scene.result?.passHeadline ?? "Passed — lesson complete.")
      : (scene.result?.failHeadline ?? "Not yet — review and try again.");
    const note = passed
      ? scene.result?.passNote
      : scene.result?.failNote;

    return (
      <div className="ex-animate-drift">
        <div className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-300">
          Completion quiz
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl leading-tight text-ink-100 sm:text-3xl">
            {headline}
          </h2>
          <span
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 font-sans text-xs font-bold uppercase tracking-widest ${
              passed
                ? "bg-[color:var(--color-verdict-correct-soft)] text-[color:var(--color-verdict-correct)]"
                : "bg-[color:var(--color-verdict-incorrect-soft)] text-[color:var(--color-verdict-incorrect)]"
            }`}
          >
            {passed ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <XIcon className="h-3.5 w-3.5" />
            )}
            {scorePct}% · {passed ? "Pass" : "Fail"}
          </span>
        </div>
        <p className="mt-2 max-w-2xl font-sans text-[15px] leading-relaxed text-ink-200">
          You answered {correctCount} of {total} correctly.{" "}
          {scene.passPct}% is required to pass.
          {note ? ` ${note}` : ""}
        </p>

        {/* per-question review */}
        <ol className="mt-5 flex flex-col gap-2.5">
          {questions.map((q, i) => {
            const ans = answers[i];
            const correctOpt = q.options.find((o) => o.isCorrect);
            const isRight = ans === correctOpt?.id;
            const chosenOpt = q.options.find((o) => o.id === ans);
            return (
              <li
                key={q.id}
                className="rounded-lg border border-white/10 bg-navy-900/40 p-3.5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] ${
                      isRight
                        ? "bg-[color:var(--color-verdict-correct-soft)] text-[color:var(--color-verdict-correct)]"
                        : "bg-[color:var(--color-verdict-incorrect-soft)] text-[color:var(--color-verdict-incorrect)]"
                    }`}
                  >
                    {isRight ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : (
                      <XIcon className="h-3 w-3" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="font-sans text-[14px] font-medium leading-snug text-ink-100">
                      {i + 1}. {q.prompt}
                    </p>
                    {!isRight && (
                      <p className="mt-1 font-sans text-[13px] leading-snug text-ink-300">
                        You chose:{" "}
                        <span className="text-ink-200">
                          {chosenOpt ? chosenOpt.label : "—"}
                        </span>
                      </p>
                    )}
                    <p className="mt-1 font-sans text-[13px] leading-snug text-ink-300">
                      Correct:{" "}
                      <span className="text-[color:var(--color-verdict-correct)]">
                        {correctOpt?.label}
                      </span>
                    </p>
                    {q.explanation && (
                      <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-ink-200">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {!passed && (
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 font-sans text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
            >
              <ReplayIcon className="h-4 w-4" />
              Retry the quiz
            </button>
          )}
          <button
            type="button"
            onClick={onRestartLesson}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-semibold transition-colors ${
              passed
                ? "bg-gold-500 text-navy-950 hover:bg-gold-400"
                : "bg-white/10 text-ink-100 hover:bg-white/16"
            }`}
          >
            <ReplayIcon className="h-4 w-4" />
            Restart the case
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- asking
  return (
    <div className="ex-animate-drift">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <div className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-300">
            Completion quiz · {scene.passPct}% to pass
          </div>
          {index === 0 && scene.intro && (
            <p className="mb-2 max-w-xl font-sans text-[13px] leading-relaxed text-ink-300">
              {scene.intro}
            </p>
          )}
          <h2 className="font-[family-name:var(--font-display)] text-lg leading-snug text-ink-100 sm:text-xl">
            {current.prompt}
          </h2>
        </div>
        <span className="hidden shrink-0 font-sans text-[11px] uppercase tracking-[0.18em] text-gold-300 sm:block">
          {index + 1} / {total}
        </span>
      </div>

      {/* progress dots */}
      <div className="mb-4 flex items-center gap-1.5" aria-hidden="true">
        {questions.map((q, i) => (
          <span
            key={q.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index
                ? "w-6 bg-gold-500"
                : answers[i] != null
                  ? "w-4 bg-gold-700"
                  : "w-4 bg-white/15"
            }`}
          />
        ))}
      </div>

      <div
        role="group"
        aria-label="Choose your answer"
        className="grid gap-2.5"
      >
        {current.options.map((o) => {
          const isChosen = chosen === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o.id)}
              aria-pressed={isChosen}
              className={`group/opt flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                isChosen
                  ? "border-gold-500 bg-gold-500/12 ring-2 ring-gold-500/50"
                  : "border-white/12 bg-navy-900/50 hover:border-gold-500/60 hover:bg-navy-800/60"
              }`}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-[family-name:var(--font-display)] text-base font-semibold transition-colors ${
                  isChosen
                    ? "bg-gold-500 text-navy-950"
                    : "bg-white/8 text-gold-300 group-hover/opt:bg-gold-500 group-hover/opt:text-navy-950"
                }`}
              >
                {o.id}
              </span>
              <span className="min-w-0 self-center font-sans text-[15px] font-medium leading-snug text-ink-100">
                {o.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="hidden font-sans text-[11px] text-ink-400 sm:block">
          Press{" "}
          <span className="font-semibold text-ink-200">A</span>–
          <span className="font-semibold text-ink-200">D</span> to choose.
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={chosen == null}
          className={`group/cta inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 font-sans text-sm font-semibold transition-all ${
            chosen == null
              ? "cursor-not-allowed bg-white/8 text-ink-400"
              : "bg-gold-500 text-navy-950 shadow-lg shadow-gold-900/40 hover:bg-gold-400"
          }`}
        >
          {index < total - 1 ? "Next question" : "See results"}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
