/**
 * Branching engine — pure state machine
 * ============================================================================
 * No React, no DOM, no side effects. Given a Lesson and the learner's history,
 * it computes the current scene and the next state after each transition. This
 * is what makes the branching logic testable in isolation and reusable across
 * any player UI. The React layer (useLessonMachine) is a thin wrapper.
 */

import type {
  DecisionScene,
  Lesson,
  OptionId,
  Scene,
  SceneId,
} from "./types";

export type MachineStatus =
  | "playing" // a narrative/feedback scene is on screen (auto-advances)
  | "awaiting-decision" // a decision scene is waiting for a choice
  | "complete"; // reached a scene with next === null

export interface DecisionRecord {
  sceneId: SceneId;
  optionId: OptionId;
  isCorrect: boolean;
  /** 1-based index of this decision within the lesson's decision order. */
  decisionIndex: number;
  atMs: number;
}

export interface MachineState {
  lessonId: string;
  currentSceneId: SceneId;
  /** Ordered list of every scene the learner has entered. */
  visited: SceneId[];
  /** One record per decision made, keyed by decision scene id. */
  decisions: Record<SceneId, DecisionRecord>;
  status: MachineStatus;
}

/** Thrown when a lesson references a scene that does not exist. */
export class LessonIntegrityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LessonIntegrityError";
  }
}

function statusForScene(scene: Scene): MachineStatus {
  if (scene.type === "decision") return "awaiting-decision";
  if (scene.type === "narrative" && scene.next === null) return "complete";
  return "playing";
}

export function getScene(lesson: Lesson, sceneId: SceneId): Scene {
  const scene = lesson.scenes[sceneId];
  if (!scene) {
    throw new LessonIntegrityError(
      `Lesson "${lesson.id}" references missing scene "${sceneId}".`,
    );
  }
  return scene;
}

/** Ordered ids of the decision scenes as reached from the start of the graph. */
export function decisionOrder(lesson: Lesson): SceneId[] {
  const order: SceneId[] = [];
  const seen = new Set<SceneId>();
  let cursor: SceneId | null = lesson.startSceneId;

  // Walk the "correct-ish" spine: for decisions, follow the first correct
  // option's rejoin so we can number decisions deterministically without
  // running the graph. Guard against cycles.
  while (cursor && !seen.has(cursor)) {
    seen.add(cursor);
    const scene: Scene = getScene(lesson, cursor);
    if (scene.type === "decision") {
      order.push(scene.id);
      const via =
        scene.options.find((o) => o.isCorrect) ?? scene.options[0];
      const feedback = getScene(lesson, via.feedbackSceneId);
      cursor = feedback.type === "feedback" ? feedback.next : null;
    } else if (scene.type === "narrative") {
      cursor = scene.next;
    } else {
      cursor = scene.next;
    }
  }
  return order;
}

export interface OutlineStep {
  id: SceneId;
  label: string;
  kind: "narrative" | "decision";
}

/**
 * The lesson "spine": the ordered narrative + decision scenes along the primary
 * path (following each decision's correct option's rejoin). Feedback branches
 * are not spine steps — they map back to their decision. Drives the progress
 * rail regardless of which branch the learner took.
 */
export function lessonOutline(lesson: Lesson): OutlineStep[] {
  const steps: OutlineStep[] = [];
  const seen = new Set<SceneId>();
  let cursor: SceneId | null = lesson.startSceneId;

  while (cursor && !seen.has(cursor)) {
    seen.add(cursor);
    const scene: Scene = getScene(lesson, cursor);
    if (scene.type === "decision") {
      steps.push({ id: scene.id, label: scene.label, kind: "decision" });
      const via = scene.options.find((o) => o.isCorrect) ?? scene.options[0];
      const feedback = getScene(lesson, via.feedbackSceneId);
      cursor = feedback.type === "feedback" ? feedback.next : null;
    } else if (scene.type === "narrative") {
      steps.push({ id: scene.id, label: scene.label, kind: "narrative" });
      cursor = scene.next;
    } else {
      // A feedback scene should not appear on the spine, but guard anyway.
      cursor = scene.next;
    }
  }
  return steps;
}

/** Index of the outline step the given scene belongs to (feedback → its decision). */
export function outlineIndexForScene(
  lesson: Lesson,
  sceneId: SceneId,
): number {
  const outline = lessonOutline(lesson);
  const scene = lesson.scenes[sceneId];
  if (scene && scene.type === "feedback") {
    return outline.findIndex((o) => o.id === scene.forDecisionId);
  }
  return outline.findIndex((o) => o.id === sceneId);
}

export function initMachine(lesson: Lesson, nowMs: number): MachineState {
  const start = getScene(lesson, lesson.startSceneId);
  return {
    lessonId: lesson.id,
    currentSceneId: lesson.startSceneId,
    visited: [lesson.startSceneId],
    decisions: {},
    status: statusForScene(start),
  };
}

/** Advance from a narrative/feedback scene to its `next`. No-op on decisions. */
export function advance(state: MachineState, lesson: Lesson): MachineState {
  const scene = getScene(lesson, state.currentSceneId);
  if (scene.type === "decision") return state; // must choose first

  const nextId = scene.next;
  if (nextId === null) {
    return { ...state, status: "complete" };
  }
  const next = getScene(lesson, nextId);
  return {
    ...state,
    currentSceneId: nextId,
    visited: [...state.visited, nextId],
    status: statusForScene(next),
  };
}

/**
 * Record a decision and route to the chosen option's feedback scene.
 * Ignores the call if the current scene is not the decision being answered.
 */
export function selectOption(
  state: MachineState,
  lesson: Lesson,
  decisionSceneId: SceneId,
  optionId: OptionId,
  nowMs: number,
): MachineState {
  const scene = getScene(lesson, decisionSceneId);
  if (scene.type !== "decision" || state.currentSceneId !== decisionSceneId) {
    return state;
  }
  const option = scene.options.find((o) => o.id === optionId);
  if (!option) {
    throw new LessonIntegrityError(
      `Decision "${decisionSceneId}" has no option "${optionId}".`,
    );
  }
  const feedback = getScene(lesson, option.feedbackSceneId);
  const order = decisionOrder(lesson);
  const decisionIndex = order.indexOf(decisionSceneId) + 1;

  return {
    ...state,
    currentSceneId: option.feedbackSceneId,
    visited: [...state.visited, option.feedbackSceneId],
    status: statusForScene(feedback),
    decisions: {
      ...state.decisions,
      [decisionSceneId]: {
        sceneId: decisionSceneId,
        optionId,
        isCorrect: option.isCorrect,
        decisionIndex: decisionIndex > 0 ? decisionIndex : order.length + 1,
        atMs: nowMs,
      },
    },
  };
}

/** Jump directly to a scene (used by the progress rail for review). */
export function goToScene(
  state: MachineState,
  lesson: Lesson,
  sceneId: SceneId,
): MachineState {
  const scene = getScene(lesson, sceneId);
  return {
    ...state,
    currentSceneId: sceneId,
    visited: state.visited.includes(sceneId)
      ? state.visited
      : [...state.visited, sceneId],
    status: statusForScene(scene),
  };
}

export function restart(lesson: Lesson, nowMs: number): MachineState {
  return initMachine(lesson, nowMs);
}

/**
 * Validate a lesson graph: every referenced scene exists, decisions have four
 * options with exactly one correct, and every branch rejoins somewhere. Returns
 * a list of human-readable problems (empty = valid). Used by a dev-time check
 * and the test suite so authors catch config mistakes before shipping.
 */
export function validateLesson(lesson: Lesson): string[] {
  const problems: string[] = [];
  const ids = new Set(Object.keys(lesson.scenes));

  if (!ids.has(lesson.startSceneId)) {
    problems.push(`startSceneId "${lesson.startSceneId}" does not exist.`);
  }

  const ref = (from: SceneId, to: SceneId | null, why: string) => {
    if (to !== null && !ids.has(to)) {
      problems.push(`Scene "${from}" ${why} missing scene "${to}".`);
    }
  };

  for (const [id, scene] of Object.entries(lesson.scenes)) {
    if (scene.id !== id) {
      problems.push(`Scene keyed "${id}" has mismatched id "${scene.id}".`);
    }
    if (scene.type === "narrative" || scene.type === "feedback") {
      ref(id, scene.next, "advances to");
    }
    if (scene.type === "decision") {
      const d = scene as DecisionScene;
      if (d.options.length !== 4) {
        problems.push(
          `Decision "${id}" has ${d.options.length} options (expected 4: A/B/C/D).`,
        );
      }
      const correct = d.options.filter((o) => o.isCorrect).length;
      if (correct !== 1) {
        problems.push(
          `Decision "${id}" has ${correct} correct options (expected exactly 1).`,
        );
      }
      const seenIds = new Set<string>();
      for (const o of d.options) {
        if (seenIds.has(o.id)) {
          problems.push(`Decision "${id}" repeats option id "${o.id}".`);
        }
        seenIds.add(o.id);
        ref(id, o.feedbackSceneId, `option ${o.id} routes to`);
        const fb = lesson.scenes[o.feedbackSceneId];
        if (fb && fb.type !== "feedback") {
          problems.push(
            `Decision "${id}" option ${o.id} routes to non-feedback scene "${o.feedbackSceneId}".`,
          );
        }
      }
    }
  }

  // Every feedback scene for a given decision should rejoin the same scene, so
  // all branches converge. Warn if a decision's branches diverge.
  const decisions = Object.values(lesson.scenes).filter(
    (s): s is DecisionScene => s.type === "decision",
  );
  for (const d of decisions) {
    const rejoinTargets = new Set<string>();
    for (const o of d.options) {
      const fb = lesson.scenes[o.feedbackSceneId];
      if (fb && fb.type === "feedback") rejoinTargets.add(fb.next);
    }
    if (rejoinTargets.size > 1) {
      problems.push(
        `Decision "${d.id}" branches rejoin at different scenes: ${[...rejoinTargets].join(", ")}. Expected a single common continuation.`,
      );
    }
  }

  return problems;
}
