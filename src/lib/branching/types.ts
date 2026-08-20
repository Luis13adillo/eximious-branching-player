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

/**
 * One side of an `A ≠ B` evidence comparison.
 * `imageUrl`/`illustration` are optional: with neither, the side renders as a
 * typographic exhibit card, which is what most conflicts need (a statement vs a
 * statement). Nothing here is lesson-specific.
 */
export interface ComparisonSide {
  /** Short source label, e.g. "Told the FNOL rep". */
  label: string;
  /** The fact in conflict, e.g. "Left the store at 8:15". */
  value: string;
  /** Optional supporting line under the value. */
  detail?: string;
  imageUrl?: string;
  illustration?: EvidenceIllustration;
}

/**
 * The locked `A ≠ B` evidence-comparison pattern (Interactive Video Production
 * Guidelines §03 "States & Components"): two labelled exhibits side by side
 * under a line stating the conflict. Everything — both labels, the conflict
 * line, and the relation glyph — is configuration, so the one component serves
 * all 267 videos without a per-video fork.
 */
export interface EvidenceComparison {
  /** Small kicker above the pair. Defaults to "Evidence exhibit". */
  kicker?: string;
  /** The line that states the conflict. Required — it is the whole point. */
  conflict: string;
  /** Relation glyph shown between the two sides. Defaults to "≠". */
  operator?: string;
  a: ComparisonSide;
  b: ComparisonSide;
  /** Optional closing line under the pair. */
  note?: string;
}

/**
 * Status of one line item in an evidence inventory.
 * Rendered with a distinct glyph as well as a distinct colour, so the state is
 * never carried by colour alone (Guidelines §03 accessibility).
 */
export type InventoryStatus = "have" | "need" | "unavailable";

export interface InventoryEntry {
  /** What the item is, e.g. "Forced entry". */
  label: string;
  status: InventoryStatus;
  /** The one-line grading note from the script. */
  note?: string;
  /**
   * In hand, but the sources disagree — reads "have, conflicting". Pair it with
   * an `EvidenceComparison` to show the conflict itself.
   */
  conflicted?: boolean;
}

/**
 * A configurable evidence inventory — the "grade the file honestly" exhibit.
 * Columns are configuration (defaulting to the script's HAVE / NEED /
 * UNAVAILABLE), so a video that grades on different axes reuses the component
 * rather than forking it. Empty columns still render: an empty UNAVAILABLE
 * column is itself a finding.
 */
export interface EvidenceInventory {
  kicker?: string;
  title?: string;
  /** Column order and headings. Defaults to HAVE / NEED / UNAVAILABLE. */
  columns?: { status: InventoryStatus; label: string }[];
  entries: InventoryEntry[];
  /** Shown in a column with no entries. Defaults to "None recorded". */
  emptyLabel?: string;
}

export interface ProcessStage {
  label: string;
  /** Short line saying what happens in this stage. */
  detail?: string;
  /** The stage the learner is operating in. At most one should be current. */
  current?: boolean;
}

/**
 * An ordered process chain, e.g. "Adjusting → Investigation → SIU". Stages, the
 * connector glyph and the takeaway are all configuration, so the same component
 * carries any escalation path, workflow or sequence across the catalog.
 */
export interface ProcessChain {
  kicker?: string;
  stages: ProcessStage[];
  /** Glyph between stages. Defaults to "→". */
  connector?: string;
  takeaway?: string;
}

/**
 * Icon vocabulary for the four-icon rejoin summary card. Deliberately GENERIC
 * (investigation concepts, not one case's nouns) so the same registry carries
 * across the catalog. An unregistered name renders a neutral marker rather
 * than throwing, so adding a lesson can never break the player.
 */
export type SummaryIconName =
  | "facts"
  | "coverage"
  | "damages"
  | "timing"
  | "issue"
  | "burden"
  | "standard"
  | "evidence";

export interface SummaryCardItem {
  icon: SummaryIconName;
  label: string;
  detail?: string;
}

/**
 * The locked four-icon rejoin summary card (Guidelines §03: "configurable
 * four-icon rejoin summary restores context"). Four categories plus a single
 * takeaway line. Exactly four items is the template contract — the tuple type
 * makes a three- or five-item card a compile error rather than a QA finding.
 */
export interface SummaryCard {
  /** Small kicker above the card. Defaults to "On screen". */
  kicker?: string;
  title?: string;
  items: [SummaryCardItem, SummaryCardItem, SummaryCardItem, SummaryCardItem];
  /** The one-line takeaway printed under the four icons. */
  takeaway?: string;
  /** Number the items 1–4 (use for an ordered chain, e.g. Issue → Evidence). */
  numbered?: boolean;
}

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
   * Four-icon rejoin summary card rendered in the content panel. Template-level
   * component; the lesson supplies only the four categories and the takeaway.
   */
  summaryCard?: SummaryCard;
  /**
   * `A ≠ B` evidence comparison rendered in the content panel. Template-level
   * component; the lesson supplies only the two sides and the conflict line.
   */
  comparison?: EvidenceComparison;
  /**
   * Evidence inventory (HAVE / NEED / UNAVAILABLE) rendered in the content
   * panel. Template-level component; the lesson supplies only the line items.
   */
  inventory?: EvidenceInventory;
  /**
   * Ordered process chain (e.g. Adjusting → Investigation → SIU) rendered in
   * the content panel. Template-level component; the lesson supplies the stages.
   */
  chain?: ProcessChain;
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
 * Configurable "are you still there?" presence check.
 * ============================================================================
 * TEMPLATE-level behaviour: the timing lives here in config (a default in the
 * player, optionally overridden per deployment), never hard-coded scene-by-scene
 * into a lesson. Deliberately simple — a single acknowledgement, no biometrics,
 * no login, no identity service.
 *
 * It is driven purely by INACTIVITY. An earlier build fired it on a scene
 * counter, which meant it could interrupt a learner who was working steadily
 * and could miss one who had walked away mid-segment. A presence check has to
 * measure absence.
 */
export interface IdentityCheckConfig {
  /** Master switch. Default: on. */
  enabled?: boolean;
  /**
   * INACTIVITY THRESHOLD, in seconds. The prompt appears only after this long
   * with NO learner interaction — it is a presence check, so it must be driven
   * by silence, not by how many scenes have gone by. Default: 120.
   */
  inactivitySeconds?: number;
  /**
   * Hard cap on how many times the check may fire in one run of one video.
   * The locked template value is 1 — "exactly one identity acknowledgment per
   * application video" (Production Spec §2 row 4, client-approved). A restart
   * begins a new run.
   */
  maxPerVideo?: number;
  title?: string;
  body?: string;
  acknowledgeLabel?: string;
}

/**
 * One learner-facing progress milestone.
 * ============================================================================
 * The scene graph and the progress rail are deliberately DIFFERENT resolutions.
 * A lesson may split a single teaching beat across several scenes because the
 * script cues a new on-screen state mid-beat (and the media pipeline splits at
 * those cues) — but the learner's map should show the beat, not the plumbing.
 *
 * A milestone therefore claims one or more spine scenes. `validateLesson`
 * enforces that the milestones cover every spine scene exactly once, so a
 * milestone map can never silently hide a scene from the rail. A lesson with no
 * `progress` map falls back to one milestone per spine scene.
 */
export interface ProgressMilestone {
  /** Unique within the lesson. */
  id: string;
  /** Short label shown in the rail tooltip and the case-progress tracker. */
  label: string;
  /** Spine scenes this milestone covers, in order. At least one. */
  scenes: SceneId[];
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
   * Learner-facing progress milestones. Optional — omit it and the rail shows
   * one step per spine scene. Supply it to hold the rail at the approved step
   * count while the scene graph stays at whatever the script requires.
   */
  progress?: ProgressMilestone[];
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
