"use client";

import type { Lesson, SceneId } from "@/lib/branching/types";
import { lessonOutline, outlineIndexForScene } from "@/lib/branching/engine";

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
              } ${step.kind === "decision" ? "ring-1 ring-gold-400/40" : ""}`}
            />
          </div>
        );
      })}
    </div>
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
