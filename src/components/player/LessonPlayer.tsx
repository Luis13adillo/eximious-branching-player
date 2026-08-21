"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Lesson,
  IdentityCheckConfig,
  Scene,
  SceneId,
} from "@/lib/branching/types";
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
import { ExhibitPanel } from "./exhibits";
import { RejoinSummaryCard } from "./RejoinSummaryCard";
import { EvidenceComparisonCard } from "./EvidenceComparison";
import { EvidenceInventoryCard } from "./EvidenceInventory";
import { ProcessChainCard } from "./ProcessChainCard";

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
  Pick<
    IdentityCheckConfig,
    | "enabled"
    | "inactivitySeconds"
    | "maxPerVideo"
    | "title"
    | "body"
    | "acknowledgeLabel"
  >
> = {
  enabled: true,
  // THE TIMER RULE — 120 s of no learner interaction.
  // Chosen against the content, not picked round: the longest delivered segment
  // in the pilot is 38.8 s, so a learner who is actually working the case
  // interacts (continue / answer / retry / exhibit / control) at least every
  // ~40 s. 120 s is three of those windows — long enough that it cannot
  // interrupt someone who is engaged, short enough to catch someone who walked
  // away mid-segment.
  inactivitySeconds: 120,
  // LOCKED TEMPLATE VALUE — "exactly 1 identity acknowledgment per application
  // video" (Production Spec §2 row 4 / §3 C-3, client-approved).
  maxPerVideo: 1,
  title: "Are you still there?",
  body: "To confirm you're still completing this lesson, please acknowledge you're present. Your place is saved and the lesson will resume where it paused.",
  acknowledgeLabel: "I'm still here — continue",
};

/**
 * Every gesture that counts as the learner being present. Captured at the
 * player root, so it covers play/pause, scrubbing, answer selection, retry,
 * continue, exhibit tabs, caption/volume/fullscreen controls and keyboard
 * shortcuts without each component having to report activity itself.
 *
 * `pointerdown` fires at the START of a touch or drag, `keydown` covers the
 * keyboard paths (space/k, arrows, A–D, c, m, f), and `input` catches a slider
 * being dragged. Media events are deliberately NOT in this list: a video
 * playing on its own is not the learner being present.
 */
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "input"] as const;

/**
 * SceneExtras — the template-level, data-configured content blocks a scene may
 * carry in the content panel, in the order the Guidelines lay out: exhibits,
 * the graded inventory, the process chain, the `A ≠ B` comparison, then the
 * four-icon rejoin summary.
 *
 * All of them are pure configuration. A scene with none of them renders
 * nothing, which is why the same player runs every one of the 267 videos. They
 * live in the PANEL, not baked into footage: generated video carries the
 * presenter speaking and nothing else (locked pipeline rule 8), so a later
 * revision to a card costs a redeploy, never a re-render.
 */
function SceneExtras({ scene }: { scene: Scene }) {
  // When the scene has no presenter footage, MediaStage already shows the
  // exhibits full-bleed (EvidenceStage) — don't render them twice.
  const stageShowsExhibits = !scene.media.videoUrl && scene.type !== "feedback";
  const hasEvidence =
    !!scene.evidence && scene.evidence.length > 0 && !stageShowsExhibits;
  if (
    !hasEvidence &&
    !scene.inventory &&
    !scene.chain &&
    !scene.comparison &&
    !scene.summaryCard
  ) {
    return null;
  }
  return (
    <>
      {hasEvidence && (
        <ExhibitPanel evidence={scene.evidence!} sceneKey={scene.id} />
      )}
      {scene.inventory && <EvidenceInventoryCard inventory={scene.inventory} />}
      {scene.chain && <ProcessChainCard chain={scene.chain} />}
      {scene.comparison && (
        <EvidenceComparisonCard comparison={scene.comparison} />
      )}
      {scene.summaryCard && <RejoinSummaryCard card={scene.summaryCard} />}
    </>
  );
}

export function LessonPlayer({
  lesson,
  handlers,
  embed = false,
  identityCheck,
  shuffleOptionsOnRetry = true,
  requireStart = true,
}: {
  lesson: Lesson;
  handlers?: PlayerEventHandlers;
  embed?: boolean;
  /** Override the presence-check timing/copy (falls back to template defaults). */
  identityCheck?: IdentityCheckConfig;
  /** Reshuffle answer order after a wrong answer (template default: on). */
  shuffleOptionsOnRetry?: boolean;
  /**
   * LOCKED TEMPLATE VALUE — no autoplay at initial load.
   * The lesson opens on its first frame behind a Start control and waits; the
   * learner's press starts picture and sound together. After that, segment
   * transitions continue automatically, so the deliberate start is asked for
   * once per video and never again. Applies to all 267 application videos;
   * pass `false` only for a deployment that must genuinely play unattended.
   */
  requireStart?: boolean;
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
    requireStart,
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
  // The lesson's LAST scene has `next: null`, so the engine reports "complete"
  // the moment the learner ENTERS it. Without this gate the completion summary
  // would replace the closing segment's on-screen content while the presenter
  // is still delivering it. Template-level: the final segment plays like any
  // other and its continue control (label from data, e.g. the script's
  // "Continue to the next lessons" hand-off) opens the summary.
  // Stored as the scene it was opened FROM, so a restart (which moves the
  // learner back to the start scene) drops it with no reset effect.
  const [summaryFor, setSummaryFor] = useState<SceneId | null>(null);
  const showSummary = machine.isComplete && summaryFor === current.id;
  const isFinalScene = machine.isComplete && !showSummary;

  const [identityOpen, setIdentityOpen] = useState(false);
  const identityOpenRef = useRef(false);
  identityOpenRef.current = identityOpen;
  // How many times the check has fired in THIS run of the video.
  const identityFiredRef = useRef(0);
  // Whether media was actually playing when we interrupted, so acknowledging
  // resumes a paused segment rather than restarting a finished one.
  const wasPlayingRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const idleMs =
    (idCfg.inactivitySeconds ?? DEFAULT_IDENTITY_CHECK.inactivitySeconds) * 1000;
  const idCap = idCfg.maxPerVideo ?? DEFAULT_IDENTITY_CHECK.maxPerVideo;

  // Keep the values the timer callback needs in refs so re-arming does not
  // depend on render-time closures (the timer outlives many renders). Synced in
  // an effect rather than during render; the callback reads them minutes later,
  // long after any commit.
  const clockRef = useRef(clock);
  const completeRef = useRef(machine.isComplete);
  useEffect(() => {
    clockRef.current = clock;
    completeRef.current = machine.isComplete;
  });

  /**
   * THE TIMER RULE
   * --------------------------------------------------------------------------
   * 1. A single timer counts down `inactivitySeconds` (default 120) from the
   *    last learner interaction.
   * 2. ANY of pointerdown / keydown / input anywhere inside the player restarts
   *    it — play/pause, seeking, answer selection, retry, continue, exhibit
   *    tabs, captions, volume, fullscreen, keyboard shortcuts.
   * 3. Media playing on its own does NOT restart it. Watching without touching
   *    anything is exactly the state a presence check exists to catch.
   * 4. When it expires the prompt opens, media pauses, and progress is blocked
   *    until the learner acknowledges.
   * 5. It fires at most `maxPerVideo` times (locked: 1). After that the timer
   *    is never re-armed, so an engaged learner is never interrupted twice.
   * 6. Restarting the case starts a new run and restores the budget.
   * 7. It never arms once the lesson is complete.
   * 8. It does not arm until the learner has STARTED the lesson. The player no
   *    longer autoplays, so the page can now sit on its opening frame while
   *    someone reads the case meta. Counting that as inactivity would spend the
   *    single locked acknowledgment before the video had played a frame, and
   *    the check would then never fire during the lesson it exists to police.
   *    The countdown, the triggers and the once-per-video budget are unchanged;
   *    only the moment the first one arms moved from page load to Start.
   */
  const armIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = null;
    if (!idCfg.enabled) return;
    if (idCap > 0 && identityFiredRef.current >= idCap) return;
    if (identityOpenRef.current) return;
    if (completeRef.current) return;
    if (!clockRef.current.started) return; // rule 8 — not before Start
    idleTimerRef.current = setTimeout(() => {
      // Re-check at fire time: the budget or the lesson state may have moved.
      if (identityOpenRef.current) return;
      if (idCap > 0 && identityFiredRef.current >= idCap) return;
      identityFiredRef.current += 1;
      wasPlayingRef.current = clockRef.current.playing;
      identityOpenRef.current = true; // set now so the focus effect below skips
      setIdentityOpen(true);
      if (wasPlayingRef.current) clockRef.current.pause();
    }, idleMs);
  }, [idCfg.enabled, idCap, idleMs]);

  // Arm on mount, re-arm on every learner interaction. Listeners are attached
  // to the player root in the CAPTURE phase so a handler that stops propagation
  // (or a disabled control) can never swallow the activity signal.
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onActivity = () => armIdleTimer();
    for (const ev of ACTIVITY_EVENTS) {
      el.addEventListener(ev, onActivity, { capture: true, passive: true });
    }
    armIdleTimer();
    return () => {
      for (const ev of ACTIVITY_EVENTS) {
        el.removeEventListener(ev, onActivity, { capture: true });
      }
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [armIdleTimer]);

  // Start the countdown at the moment the learner starts the lesson (rule 8).
  // Before that `armIdleTimer` is a no-op, so this is the first arming.
  useEffect(() => {
    if (clock.started) armIdleTimer();
  }, [clock.started, armIdleTimer]);

  // A restart is a new run of the video: the once-per-video budget returns and
  // the countdown starts again.
  useEffect(() => {
    identityFiredRef.current = 0;
    armIdleTimer();
  }, [machine.runId, armIdleTimer]);

  const acknowledgeIdentity = () => {
    identityOpenRef.current = false;
    setIdentityOpen(false);
    // Resume only what was actually interrupted. Acknowledging is itself the
    // user gesture that keeps audio unlocked.
    if (wasPlayingRef.current) clock.play();
    armIdleTimer(); // no-op once the budget is spent; correct if it is not
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
  const announcement = showSummary
    ? `Lesson complete. ${lesson.title}.`
    : current.type === "decision"
      ? `Decision. ${current.prompt}`
      : current.type === "quiz"
        ? `Graded completion quiz. ${current.passPct} percent required to pass.`
        : current.type === "feedback"
          ? `${current.verdict === "correct" ? "Correct." : "Not quite."} ${current.headline ?? current.consequence ?? ""}. ${current.body ?? ""}`
          : `${current.headline ?? current.label}. ${current.subhead ?? ""}`;

  return (
    <div
      ref={rootRef}
      className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-4 pb-6 pt-4 sm:px-6 sm:pt-5 lg:h-[100dvh] lg:min-h-0 lg:overflow-hidden lg:pb-5"
    >
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
        <div className="flex min-w-0 flex-1 flex-col items-end gap-1.5">
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
          {/* Contract-required AI disclosure — briefly at the opening, then
              fades. Its hold starts when the LESSON does, not when the page
              loads, so it is on screen while the presenter actually speaks. */}
          <AiDisclosure started={clock.started} />
        </div>

        {/* interaction area — the gold panel frame is the approved case-panel
            treatment for the whole catalog: one border here, so every scene
            (context, assignment, decision, feedback, rejoin, quiz, summary)
            and every presenter's lesson carries it without a per-lesson edit. */}
        <section
          key={current.id}
          ref={panelRef}
          tabIndex={-1}
          aria-label="Lesson interaction"
          className="rounded-2xl border border-gold-500/70 bg-navy-900/40 p-5 outline-none [outline-offset:-3px] sm:p-6 lg:h-full lg:min-h-0 lg:flex-1 lg:min-w-0 lg:overflow-y-auto"
        >
          {/* Center the interaction + tracker as one group so short scenes
              don't leave a dead band between them. */}
          <div className="lg:flex lg:min-h-full lg:flex-col lg:justify-center">
            <div>
              {showSummary ? (
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
                <>
                  <SceneExtras scene={current} />
                  <FeedbackNote
                    scene={current}
                    onContinue={machine.next}
                    ready={ready}
                  />
                </>
              ) : (
                <>
                  <SceneContext
                    kicker={current.kicker}
                    headline={current.headline}
                    subhead={current.subhead}
                    body={current.body}
                  />
                  <SceneExtras scene={current} />
                  <ContinueBar
                    label={
                      current.continueLabel ??
                      CONTINUE_LABEL[current.role] ??
                      "Continue"
                    }
                    onContinue={isFinalScene ? () => setSummaryFor(current.id) : machine.next}
                    ready={ready}
                  />
                </>
              )}
            </div>

            {/* case-progress tracker (desktop) — a purposeful case map that
                fills the panel's spare height instead of dead space. Hidden on
                the decision scene, whose four options already fill the panel. */}
            {!showSummary &&
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
