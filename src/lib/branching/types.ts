/**
 * Branching engine — data model
 * ============================================================================
 * A lesson is a directed graph of "scenes". The player walks the graph:
 * narrative scenes play then advance to `next`; decision scenes wait for the
 * learner to pick an option, which routes to that option's feedback scene;
 * feedback scenes play then advance to a common `next` (the rejoin point).
 *
 * Everything a lesson needs lives in this data — no branching logic is
 * hard-coded into pages or components. Adding a lesson = adding one more
 * `Lesson` object to the registry. Adding a decision point = adding one more
 * `decision` scene to the graph. This is what lets the same player run one
 * decision or three, and one lesson or 267, without code changes.
 */

/** Every scene has a unique id within its lesson. */
export type SceneId = string;

export type OptionId = "A" | "B" | "C" | "D";

/**
 * How a media provider is fulfilled. Swapping providers is a data change.
 *
 * NOTE: this union describes what the PLAYER can render, not how Eximious media
 * is produced. Delivered production assets are always `"file"` — mp4s under
 * public/media/ built by the locked pipeline (see CLAUDE.md ★ LOCKED).
 * `"heygen"` and `"elevenlabs"` are unused legacy members kept only so old
 * lesson data still type-checks; HeyGen is NOT used on this project and no
 * provider may be substituted without written approval.
 */
export type MediaProvider =
  | "placeholder" // no final asset yet — render the polished placeholder stage
  | "file" // any direct video/audio file URL — THE PRODUCTION PROVIDER
  | "mux" // hosted video (Mux playback)
  | "heygen" // LEGACY / UNUSED — not a production route
  | "elevenlabs"; // LEGACY / UNUSED — not a production route

/**
 * A media descriptor. The player renders a real <video>/<audio> element when
 * `videoUrl`/`audioUrl` is present, and the placeholder stage otherwise.
 * Delivered segments from the locked production pipeline drop in here without
 * touching the branching engine or the player components.
 */
export interface MediaSource {
  provider: MediaProvider;
  /** Final video asset (mp4/hls). When set, a real <video> renders. */
  videoUrl?: string;
  /** Narration audio, used with the placeholder/stills stage. */
  audioUrl?: string;
  /** Poster / still frame shown before playback and behind narration. */
  posterUrl?: string;
  /** WebVTT caption track URL (preferred for real assets). */
  captionsUrl?: string;
  /** Inline caption cues — used to caption placeholder playback. */
  captions?: Caption[];
  /** Playback length in seconds. Drives the scrubber + auto-advance. */
  durationSec: number;
  /**
   * Loop the video instead of holding on its last frame. Use for short ambient
   * "living-still" presenter clips; leave false/undefined for real narrated
   * footage that should play once and let the learner continue.
   */
  loop?: boolean;
  /**
   * The media carries an audio track (e.g. baked voiceover). The player starts
   * muted (autoplay policy) and shows a "tap for sound" control so the learner
   * can turn it on with a gesture.
   */
  hasAudio?: boolean;
  /**
   * Name of a registered fallback backdrop (see SceneBackdrop). Gives a
   * polished look before final footage exists. Ignored once `videoUrl` is set.
   */
  placeholderScene?: PlaceholderSceneName;
}

export type PlaceholderSceneName =
  | "storm-exterior"
  | "flooded-interior"
  | "moisture-map"
  | "claim-desk"
  | "policy-document"
  | "resolution";

export interface Caption {
  /** Seconds from scene start. */
  start: number;
  end: number;
  text: string;
}

/** Presenter identity shown in the avatar layout. */
export interface Presenter {
  name: string;
  role: string;
  /** Optional avatar image; falls back to a monogrammed placeholder. */
  imageUrl?: string;
}

/**
 * A piece of supporting evidence rendered in fullscreen scenes. `illustration`
 * names a built-in vector illustration; `imageUrl` uses a real asset instead.
 */
export interface EvidenceItem {
  id: string;
  kind: "diagram" | "photo" | "document" | "chart";
  title: string;
  caption?: string;
  illustration?: EvidenceIllustration;
  imageUrl?: string;
}

export type EvidenceIllustration =
  | "floor-plan"
  | "moisture-readings"
  | "timeline"
  | "policy-clause"
  | "coverage-clause"
  | "damage-photo";

/** Layout mode for a scene's media stage. */
export type SceneLayout = "avatar" | "fullscreen";

interface SceneCommon {
  id: SceneId;
  /** Short human label — used in the progress rail and for debugging. */
  label: string;
  layout: SceneLayout;
  media: MediaSource;
  presenter?: Presenter;
  /** Kicker shown above the headline (e.g. "CASE FILE 2043-RW"). */
  kicker?: string;
  headline?: string;
  subhead?: string;
  /** Longer narration/summary body shown beside or below the stage. */
  body?: string;
  evidence?: EvidenceItem[];
  /**
   * Optional per-scene label for the primary "continue" control. Keeps
   * lesson-specific wording in DATA (e.g. "Begin the graded quiz") instead of
   * hard-coding it in the player. Falls back to a role-based default.
   */
  continueLabel?: string;
}

/** Plays, then advances to `next`. `next: null` ends the lesson. */
export interface NarrativeScene extends SceneCommon {
  type: "narrative";
  role: "intro" | "evidence" | "briefing" | "continuation" | "resolution";
  next: SceneId | null;
}

/** Waits for a learner choice; each option routes to its own feedback scene. */
export interface DecisionScene extends SceneCommon {
  type: "decision";
  prompt: string;
  options: DecisionOption[];
  /** Optional label like "Decision 1 of 3" — otherwise derived automatically. */
  decisionLabel?: string;
}

export interface DecisionOption {
  id: OptionId;
  label: string;
  detail?: string;
  isCorrect: boolean;
  /** Scene the learner is routed to when they choose this option. */
  feedbackSceneId: SceneId;
}

/** Branch-specific feedback that plays, then rejoins at `next`. */
export interface FeedbackScene extends SceneCommon {
  type: "feedback";
  verdict: "correct" | "incorrect";
  forDecisionId: SceneId;
  forOptionId: OptionId;
  /**
   * A short, present-tense line describing what the learner's choice DOES —
   * shown large on the stage as a "consequence beat" so the case visibly reacts
   * to the decision before the written rationale. e.g. "You deny the claim —
   * before the cause is even established."
   */
  consequence?: string;
  /** The common rejoin scene every branch of this decision returns to. */
  next: SceneId;
}

/** One option in a quiz question. */
export interface QuizOption {
  id: OptionId;
  label: string;
  isCorrect: boolean;
}

/** One graded question inside a QuizScene. */
export interface QuizQuestion {
  id: string;
  prompt: string;
  /** Two to four options; exactly one is correct. */
  options: QuizOption[];
  /** Reasoning revealed after answering — tie it to the lesson's teaching. */
  explanation?: string;
}

/**
 * A terminal, graded completion quiz. Data-driven like everything else: each
 * lesson defines its own questions and pass threshold, so the same player runs
 * the quiz for lesson #1 and lesson #267 with no code changes. Reached as the
 * `next` of the final resolution scene; the quiz itself has no `next` (it ends
 * the lesson, gating completion on the pass mark).
 */
export interface QuizScene extends SceneCommon {
  type: "quiz";
  /** Percent correct required to pass, e.g. 80. */
  passPct: number;
  questions: QuizQuestion[];
  /** Short line shown above the first question. */
  intro?: string;
  /** Pass/fail result copy (kept in data, not hard-coded in the component). */
  result?: {
    passHeadline?: string;
    failHeadline?: string;
    passNote?: string;
    failNote?: string;
  };
}

export type Scene =
  | NarrativeScene
  | DecisionScene
  | FeedbackScene
  | QuizScene;

/**
 * Configurable "are you still there?" presence check. This is a TEMPLATE-level
 * behavior: the timing lives here in config (a default in the player, optionally
 * overridden per deployment), never hard-coded scene-by-scene into a lesson.
 * Deliberately simple — a single acknowledgement, no biometrics/login/identity
 * services.
 */
export interface IdentityCheckConfig {
  /** Master switch. Default: on. */
  enabled?: boolean;
  /**
   * Interval mode: prompt after this many scene entries (counted across the
   * whole lesson, decisions included in the count but never interrupted).
   */
  everyScenes?: number;
  /**
   * Checkpoint mode: prompt when the learner enters any of these scene ids.
   * When provided, this takes precedence over `everyScenes`.
   */
  checkpoints?: SceneId[];
  title?: string;
  body?: string;
  acknowledgeLabel?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  courseTitle: string;
  title: string;
  subtitle?: string;
  summary?: string;
  estimatedMinutes?: number;
  startSceneId: SceneId;
  scenes: Record<SceneId, Scene>;
  /**
   * Per-lesson completion copy shown on the summary screen. Optional — the
   * player falls back to generic wording. This keeps lesson-specific text in
   * DATA (never hard-coded into the shared player component).
   */
  completion?: {
    /** The one-line takeaway, e.g. "Establish cause of loss, then coverage." */
    takeaway: string;
    /** Headline when every decision was answered correctly. */
    headlineAllCorrect?: string;
    /** Headline when at least one decision was missed. */
    headlinePartial?: string;
  };
  meta?: {
    module?: string;
    lessonNumber?: number;
    author?: string;
    caseId?: string;
  };
}

/** Lightweight catalog entry for listing lessons without loading full graphs. */
export interface LessonSummary {
  id: string;
  slug: string;
  courseTitle: string;
  title: string;
  subtitle?: string;
  estimatedMinutes?: number;
  decisionCount: number;
  caseId?: string;
}
