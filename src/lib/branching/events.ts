/**
 * Player event interface
 * ============================================================================
 * The player emits a small, stable set of events. Analytics, an LMS/xAPI
 * bridge, or a scoring service can be added later by passing handlers to the
 * player — nothing inside the branching engine has to change. This is the
 * `onAnswerSelected()` seam called out in the brief.
 */

import type { OptionId, SceneId } from "./types";

export interface AnswerSelectedEvent {
  lessonId: string;
  /** The decision scene that was answered. */
  sceneId: SceneId;
  optionId: OptionId;
  isCorrect: boolean;
  /** 1-based position of this decision within the lesson. */
  decisionIndex: number;
  /** Epoch milliseconds when the answer was chosen. */
  timestampMs: number;
}

export interface SceneEnterEvent {
  lessonId: string;
  sceneId: SceneId;
  sceneType: "narrative" | "decision" | "feedback";
  timestampMs: number;
}

export interface LessonCompleteEvent {
  lessonId: string;
  /** Decision scene id -> whether the chosen option was correct. */
  results: Record<SceneId, boolean>;
  correctCount: number;
  decisionCount: number;
  timestampMs: number;
}

/**
 * Optional handlers. Everything is optional so the player runs standalone with
 * zero wiring, and a host can subscribe to only what it needs.
 */
export interface PlayerEventHandlers {
  onAnswerSelected?: (event: AnswerSelectedEvent) => void;
  onSceneEnter?: (event: SceneEnterEvent) => void;
  onLessonComplete?: (event: LessonCompleteEvent) => void;
}
