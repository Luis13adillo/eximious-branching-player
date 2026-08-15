"use client";

import { useEffect, useRef, useState } from "react";
import type { Lesson, IdentityCheckConfig } from "@/lib/branching/types";
import type { PlayerEventHandlers } from "@/lib/branching/events";
import { useLessonMachine } from "@/lib/branching/useLessonMachine";
import { useMediaClock } from "./useMediaClock";
import { MediaStage } from "./MediaStage";
import { DecisionPanel } from "./DecisionPanel";
import { IdentityCheck } from "./IdentityCheck";
import { AiDisclosure } from "./AiDisclosure";
import { MediaPreloader } from "./MediaPreloader";
import { QuizPanel } from "./QuizPanel";
import { getScene } from "@/lib/branching/engine";
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
  intro: "Open the file",
  evidence: "Continue",
  briefing: "Make the call",
  continuation: "Continue",
  resolution: "Continue",
};

/**
 * Template-level default for the presence check. Configurable per deployment by
 * passing `identityCheck` to <LessonPlayer>; the timing lives here, never
 * hard-coded into individual lessons. `enabled: false` turns it off entirely.
 */
const DEFAULT_IDENTITY_CHECK: Required<
  Pick<IdentityCheckConfig, "enabled" | "everyScenes" | "title" | "body" | "acknowledgeLabel">
> = {
  enabled: true,
  everyScenes: 6,
  title: "Are you still there?",
  body: "To confirm you're still completing this lesson, please acknowledge you're present. Your place is saved and the lesson will resume where it paused.",
  acknowledgeLabel: "I'm still here — continue",
};

export function LessonPlayer({
  lesson,
  handlers,
  embed = false,
  identityCheck,
  shuffleOptionsOnRetry = true,
}: {
  lesson: Lesson;
  handlers?: PlayerEventHandlers;
  embed?: boolean;
  /** Override the presence-check timing/copy (falls back to template defaults). */
  identityCheck?: IdentityCheckConfig;
  /** Reshuffle answer order after a wrong answer (template default: on). */
  shuffleOptionsOnRetry?: boolean;
}) {
  const machine = useLessonMachine(lesson, handlers);
  const { current, state } = machine;
  const mediaRef = useRef<HTMLMediaElement | null>(null);

  const idCfg = { ...DEFAULT_IDENTITY_CHECK, ...identityCheck };

  // Retry re-entry: on the FIRST visit to a decision the question autoplays;
  // when the learner returns after a wrong answer (there are recorded attempts)
  // the question does NOT auto-replay — they choose again immediately, and can
  // use the "Replay question" control if they want to hear it again. Every
  // other scene autoplays as before.
  const isDecisionRetry =
    current.type === "decision" && machine.attemptsForCurrent.length > 0;
  const autoplayScene = !isDecisionRetry;

  const clock = useMediaClock(current.media.durationSec, {
    sceneKey: current.id,
    autoplay: autoplayScene,
    mediaRef,
    hasRealMedia: !!(current.media.videoUrl || current.media.audioUrl),
  });

  const ready = clock.ended;

  // Preload all four feedback assets for the active decision so picking an
  // option starts its feedback with no perceptible dead air.
  const feedbackUrls =
    current.type === "decision"
      ? current.options.map((o) => {
          const fb = getScene(lesson, o.feedbackSceneId);
          return fb.media.videoUrl ?? fb.media.audioUrl;
        })
      : [];

  // ---- Presence check (identity acknowledgment) --------------------------
  // Counts scene entries and, at the configured interval (or on a configured
  // checkpoint scene), pauses media and blocks progress until the learner
  // acknowledges they're present. Decisions/quiz are never interrupted in
  // interval mode, so the prompt can't collide with a choice in progress.
  const [identityOpen, setIdentityOpen] = useState(false);
  const identityOpenRef = useRef(false);
  identityOpenRef.current = identityOpen;
  const sceneCountRef = useRef(0);
  const firstSceneRef = useRef(true);

  useEffect(() => {
    if (!idCfg.enabled || machine.isComplete) return;
    // Don't fire on the very first scene the lesson opens on.
    if (firstSceneRef.current) {
      firstSceneRef.current = false;
      return;
    }
    const usingCheckpoints = !!(idCfg.checkpoints && idCfg.checkpoints.length > 0);
    let shouldPrompt = false;
    if (usingCheckpoints) {
      shouldPrompt = idCfg.checkpoints!.includes(current.id);
    } else {
      sceneCountRef.current += 1;
      const interruptible =
        current.type === "narrative" || current.type === "feedback";
      if (
        sceneCountRef.current >=
          (idCfg.everyScenes ?? DEFAULT_IDENTITY_CHECK.everyScenes) &&
        interruptible
      ) {
        shouldPrompt = true;
        sceneCountRef.current = 0;
      }
    }
    if (shouldPrompt) {
      identityOpenRef.current = true; // set now so the focus effect below skips
      setIdentityOpen(true);
      clock.pause(); // pause cleanly while the prompt is up (one source, stopped)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.id]);

  const acknowledgeIdentity = () => {
    identityOpenRef.current = false;
    setIdentityOpen(false);
    clock.play(); // resume the same scene (acknowledge is the user gesture)
  };

  // Move focus into the interaction panel on each scene change so keyboard
  // users don't lose their place (focus never drops to <body>) and screen
  // readers land on the new content — but not while the presence prompt owns
  // focus.
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (identityOpenRef.current) return;
    panelRef.current?.focus({ preventScroll: true });
  }, [current.id]);

  // A single persistent live region reliably announces each scene to screen
  // readers (a per-scene region that mounts with its text already present is
  // often not spoken).
  const announcement = machine.isComplete
    ? `Lesson complete. ${lesson.title}.`
    : current.type === "decision"
      ? `Decision. ${current.prompt}`
      : current.type === "quiz"
        ? `Graded completion quiz. ${current.passPct} percent required to pass.`
        : current.type === "feedback"
          ? `${current.verdict === "correct" ? "Correct." : "Not quite."} ${current.headline ?? current.consequence ?? ""}. ${current.body ?? ""}`
          : `${current.headline ?? current.label}. ${current.subhead ?? ""}`;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-4 pb-6 pt-4 sm:px-6 sm:pt-5 lg:h-[100dvh] lg:min-h-0 lg:overflow-hidden lg:pb-5">
      {/* preload the active decision's four feedback clips (off-screen) */}
      {feedbackUrls.length > 0 && <MediaPreloader urls={feedbackUrls} />}

      {/* one page heading + a persistent live region for scene announcements */}
      <h1 className="sr-only">
        {lesson.courseTitle}: {lesson.title}
      </h1>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* header */}
      <header className="mb-4 flex items-center justify-between gap-4">
        <BrandMark size={embed ? "sm" : "md"} />
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
        <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 ring-1 ring-black/20 lg:h-full lg:min-h-0 lg:flex-[1.55] lg:min-w-0">
          <MediaStage scene={current} clock={clock} mediaRef={mediaRef} />
          {/* Contract-required AI disclosure — briefly at the opening, then fades. */}
          <AiDisclosure />
        </div>

        {/* interaction area */}
        <section
          key={current.id}
          ref={panelRef}
          tabIndex={-1}
          aria-label="Lesson interaction"
          className="rounded-2xl border border-white/10 bg-navy-900/40 p-5 outline-none [outline-offset:-3px] sm:p-6 lg:h-full lg:min-h-0 lg:flex-1 lg:min-w-0 lg:overflow-y-auto"
        >
          {/* Center the interaction + tracker as one group so short scenes
              don't leave a dead band between them. */}
          <div className="lg:flex lg:min-h-full lg:flex-col lg:justify-center">
            <div>
              {machine.isComplete ? (
                <CompletionSummary
                  lesson={lesson}
                  state={state}
                  onRestart={machine.restart}
                />
              ) : current.type === "decision" ? (
                <DecisionPanel
                  scene={current}
                  onSelect={machine.select}
                  attempted={machine.attemptsForCurrent}
                  onReplayQuestion={clock.replay}
                  shuffleOnRetry={shuffleOptionsOnRetry}
                />
              ) : current.type === "quiz" ? (
                <QuizPanel
                  scene={current}
                  onRestartLesson={machine.restart}
                  onCompleted={(r) =>
                    handlers?.onQuizCompleted?.({
                      lessonId: lesson.id,
                      sceneId: current.id,
                      correct: r.correct,
                      total: r.total,
                      scorePct: r.scorePct,
                      passPct: r.passPct,
                      passed: r.passed,
                      timestampMs: Date.now(),
                    })
                  }
                />
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
                    label={
                      current.continueLabel ??
                      CONTINUE_LABEL[current.role] ??
                      "Continue"
                    }
                    onContinue={machine.next}
                    ready={ready}
                  />
                </>
              )}
            </div>

            {/* case-progress tracker (desktop) — a purposeful case map that
                fills the panel's spare height instead of dead space. Hidden on
                the decision scene, whose four options already fill the panel. */}
            {!machine.isComplete &&
              current.type !== "decision" &&
              current.type !== "quiz" && (
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
          <span className="hidden sm:block">
            {lesson.courseTitle}
            {lesson.meta?.module ? ` · ${lesson.meta.module}` : ""}
          </span>
        </footer>
      )}

      {/* Presence check — overlays everything, pauses media, resumes on ack. */}
      {identityOpen && (
        <IdentityCheck
          title={idCfg.title}
          body={idCfg.body}
          acknowledgeLabel={idCfg.acknowledgeLabel}
          onAcknowledge={acknowledgeIdentity}
        />
      )}
    </div>
  );
}
