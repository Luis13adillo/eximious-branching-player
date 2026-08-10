"use client";

import type { Lesson, SceneId } from "@/lib/branching/types";
import { lessonOutline, outlineIndexForScene } from "@/lib/branching/engine";
import { CheckIcon } from "@/components/ui/icons";

/**
 * ProgressRail — shows the learner where they are along the lesson spine
 * (intro → evidence → decision → resolution). Feedback branches map back to
 * their decision step, so the rail is stable no matter which answer was chosen.
 */
export function ProgressRail({
  lesson,
  currentSceneId,
}: {
  lesson: Lesson;
  currentSceneId: SceneId;
}) {
  const outline = lessonOutline(lesson);
  const activeIndex = outlineIndexForScene(lesson, currentSceneId);

  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {outline.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <div key={step.id} className="flex items-center gap-1.5">
            <span
              title={step.label}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                active
                  ? "w-7 bg-gold-500"
                  : done
                    ? "w-4 bg-gold-700"
                    : "w-4 bg-white/15"
              } ${step.kind === "decision" || step.kind === "quiz" ? "ring-1 ring-gold-400/40" : ""}`}
            />
          </div>
        );
      })}
    </div>
  );
}

/**
 * A labeled, vertical case-progress tracker. Fills the interaction panel with a
 * purposeful element (instead of dead space) and gives the learner a clear map
 * of where they are in the case. Branch-stable (feedback maps to its decision).
 */
export function LessonStepList({
  lesson,
  currentSceneId,
  className = "",
}: {
  lesson: Lesson;
  currentSceneId: SceneId;
  className?: string;
}) {
  const outline = lessonOutline(lesson);
  const activeIndex = outlineIndexForScene(lesson, currentSceneId);

  return (
    <nav aria-label="Case progress" className={className}>
      <div className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-400">
        Case progress
      </div>
      <ol className="space-y-1">
        {outline.map((step, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li key={step.id} className="flex items-center gap-3">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${
                  active
                    ? "bg-gold-500 text-navy-950"
                    : done
                      ? "bg-gold-500/15 text-gold-300"
                      : "bg-white/8 text-ink-400"
                }`}
              >
                {done ? <CheckIcon className="h-3 w-3" /> : i + 1}
              </span>
              <span
                className={`font-sans text-[13px] transition-colors ${
                  active
                    ? "font-medium text-ink-100"
                    : done
                      ? "text-ink-300"
                      : "text-ink-400"
                }`}
              >
                {step.label}
              </span>
              {step.kind === "decision" && (
                <span className="ml-auto rounded-full bg-white/5 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-widest text-gold-300">
                  Decision
                </span>
              )}
              {step.kind === "quiz" && (
                <span className="ml-auto rounded-full bg-white/5 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-widest text-gold-300">
                  Quiz
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Accessible text version, e.g. "Step 3 of 6 · Your determination". */
export function ProgressLabel({
  lesson,
  currentSceneId,
}: {
  lesson: Lesson;
  currentSceneId: SceneId;
}) {
  const outline = lessonOutline(lesson);
  const idx = outlineIndexForScene(lesson, currentSceneId);
  const step = outline[idx];
  return (
    <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink-400">
      Step {idx + 1} of {outline.length}
      {step ? ` · ${step.label}` : ""}
    </span>
  );
}
