"use client";

import { useRef } from "react";
import type { Lesson } from "@/lib/branching/types";
import type { PlayerEventHandlers } from "@/lib/branching/events";
import { useLessonMachine } from "@/lib/branching/useLessonMachine";
import { useMediaClock } from "./useMediaClock";
import { MediaStage } from "./MediaStage";
import { DecisionPanel } from "./DecisionPanel";
import { ProgressRail, ProgressLabel, LessonStepList } from "./ProgressRail";
import {
  ContinueBar,
  FeedbackNote,
  CompletionSummary,
  SceneContext,
} from "./interaction";
import { BrandMark } from "@/components/ui/BrandMark";

/**
 * LessonPlayer — the reusable, data-driven player.
 * Give it any Lesson (and optional analytics handlers) and it runs the whole
 * branching experience. It has no knowledge of THIS lesson's content — the same
 * component runs lesson #1 and lesson #267, one decision or three.
 */

const CONTINUE_LABEL: Record<string, string> = {
  intro: "Review the evidence",
  evidence: "Continue",
  briefing: "Make the call",
  continuation: "See the resolution",
};

export function LessonPlayer({
  lesson,
  handlers,
  embed = false,
}: {
  lesson: Lesson;
  handlers?: PlayerEventHandlers;
  embed?: boolean;
}) {
  const machine = useLessonMachine(lesson, handlers);
  const { current, state } = machine;
  const mediaRef = useRef<HTMLMediaElement | null>(null);

  const clock = useMediaClock(current.media.durationSec, {
    sceneKey: current.id,
    autoplay: true,
    mediaRef,
    hasRealMedia: !!current.media.videoUrl,
  });

  const ready = clock.ended;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-4 pb-6 pt-4 sm:px-6 sm:pt-5 lg:h-[100dvh] lg:min-h-0 lg:overflow-hidden lg:pb-5">
      {/* header */}
      <header className="mb-4 flex items-center justify-between gap-4">
        <BrandMark size={embed ? "sm" : "md"} showWordmark={!embed} />
        <div className="flex flex-col items-end gap-1.5">
          <div className="hidden sm:block">
            <ProgressLabel lesson={lesson} currentSceneId={current.id} />
          </div>
          <ProgressRail lesson={lesson} currentSceneId={current.id} />
        </div>
      </header>

      {/* case meta strip */}
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[11px] text-ink-400">
        <span className="font-semibold uppercase tracking-[0.18em] text-gold-300">
          {lesson.courseTitle}
        </span>
        {lesson.meta?.module && (
          <>
            <span aria-hidden>·</span>
            <span>{lesson.meta.module}</span>
          </>
        )}
        {lesson.meta?.caseId && (
          <>
            <span aria-hidden>·</span>
            <span>Case {lesson.meta.caseId}</span>
          </>
        )}
        {lesson.estimatedMinutes && (
          <>
            <span aria-hidden>·</span>
            <span>{lesson.estimatedMinutes} min</span>
          </>
        )}
      </div>

      {/* Desktop: stage + panel side-by-side so the decision options are always
          visible without scrolling. Mobile/tablet: stacked. */}
      <main className="flex flex-1 flex-col gap-4 lg:min-h-0 lg:flex-row lg:items-stretch lg:gap-5">
        {/* video stage */}
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 ring-1 ring-black/20 lg:h-full lg:min-h-0 lg:flex-[1.55] lg:min-w-0">
          <MediaStage scene={current} clock={clock} mediaRef={mediaRef} />
        </div>

        {/* interaction area */}
        <section
          key={current.id}
          aria-label="Lesson interaction"
          className="rounded-2xl border border-white/10 bg-navy-900/40 p-5 sm:p-6 lg:h-full lg:min-h-0 lg:flex-1 lg:min-w-0 lg:overflow-y-auto"
        >
          <div className="lg:flex lg:min-h-full lg:flex-col">
            {/* interaction — vertically centered in the space above the tracker */}
            <div className="lg:flex lg:flex-1 lg:flex-col lg:justify-center">
              {machine.isComplete ? (
                <CompletionSummary
                  lesson={lesson}
                  state={state}
                  onRestart={machine.restart}
                />
              ) : current.type === "decision" ? (
                <DecisionPanel scene={current} onSelect={machine.select} />
              ) : current.type === "feedback" ? (
                <FeedbackNote
                  scene={current}
                  onContinue={machine.next}
                  ready={ready}
                />
              ) : (
                <>
                  <SceneContext
                    kicker={current.kicker}
                    headline={current.headline}
                    subhead={current.subhead}
                    body={current.body}
                  />
                  <ContinueBar
                    label={CONTINUE_LABEL[current.role] ?? "Continue"}
                    onContinue={machine.next}
                    ready={ready}
                  />
                </>
              )}
            </div>

            {/* case-progress tracker pinned to the bottom (desktop) — turns the
                panel's spare height into a purposeful map instead of dead space */}
            {!machine.isComplete && (
              <LessonStepList
                lesson={lesson}
                currentSceneId={current.id}
                className="mt-8 hidden border-t border-white/8 pt-5 lg:block"
              />
            )}
          </div>
        </section>
      </main>

      {!embed && (
        <footer className="mt-5 flex items-center justify-between gap-3 border-t border-white/8 pt-3 font-sans text-[11px] text-ink-400">
          <span>Eximious Academy · Interactive Case Study</span>
          <span className="hidden sm:block">Property Claims Investigation · Module 2</span>
        </footer>
      )}
    </div>
  );
}
