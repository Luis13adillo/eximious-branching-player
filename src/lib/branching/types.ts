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

/** How a media provider is fulfilled. Swapping providers is a data change. */
export type MediaProvider =
  | "placeholder" // no final asset yet — render the polished placeholder stage
  | "heygen" // AI avatar video (HeyGen output URL)
  | "elevenlabs" // narrated audio over stills (ElevenLabs output URL)
  | "mux" // hosted video (Mux playback)
  | "file"; // any direct video/audio file URL

/**
 * A media descriptor. The player renders a real <video>/<audio> element when
 * `videoUrl`/`audioUrl` is present, and the placeholder stage otherwise. Final
 * assets from HeyGen / ElevenLabs / Mux drop in here without touching the
 * branching engine or the player components.
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
   * Name of a registered placeholder backdrop (see PlaceholderStage). Lets the
   * demo look finished before real footage exists. Ignored once `videoUrl` set.
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

export type Scene = NarrativeScene | DecisionScene | FeedbackScene;

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
