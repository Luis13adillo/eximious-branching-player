"use client";

/**
 * useLessonMachine
 * ============================================================================
 * Thin React binding over the pure engine. Owns the machine state, exposes the
 * current scene, and fires player events. Components never touch the engine
 * internals — they call `select`, `next`, `restart` and read `current`.
 */

import { useCallback, useMemo, useRef, useState } from "react";
import type { Lesson, OptionId, Scene, SceneId } from "./types";
import {
  advance,
  decisionOrder,
  getScene,
  initMachine,
  restart as restartMachine,
  selectOption,
  type MachineState,
} from "./engine";
import type { PlayerEventHandlers } from "./events";

const now = () => (typeof Date !== "undefined" ? Date.now() : 0);

export interface LessonMachine {
  state: MachineState;
  current: Scene;
  /** Ordered decision scene ids, for numbering + progress. */
  decisionIds: SceneId[];
  isComplete: boolean;
  /** Wrong options already tried at the current decision (for retry marking). */
  attemptsForCurrent: OptionId[];
  select: (optionId: OptionId) => void;
  next: () => void;
  restart: () => void;
}

export function useLessonMachine(
  lesson: Lesson,
  handlers?: PlayerEventHandlers,
): LessonMachine {
  const [state, setState] = useState<MachineState>(() =>
    initMachine(lesson, now()),
  );

  // Keep handlers in a ref so changing them never resets lesson state.
  const handlersRef = useRef<PlayerEventHandlers | undefined>(handlers);
  handlersRef.current = handlers;

  const decisionIds = useMemo(() => decisionOrder(lesson), [lesson]);

  const emitSceneEnter = useCallback(
    (sceneId: SceneId) => {
      const scene = getScene(lesson, sceneId);
      handlersRef.current?.onSceneEnter?.({
        lessonId: lesson.id,
        sceneId,
        sceneType: scene.type,
        timestampMs: now(),
      });
    },
    [lesson],
  );

  const maybeEmitComplete = useCallback(
    (nextState: MachineState) => {
      if (nextState.status !== "complete") return;
      const results: Record<SceneId, boolean> = {};
      let correctCount = 0;
      for (const rec of Object.values(nextState.decisions)) {
        results[rec.sceneId] = rec.isCorrect;
        if (rec.isCorrect) correctCount += 1;
      }
      handlersRef.current?.onLessonComplete?.({
        lessonId: lesson.id,
        results,
        correctCount,
        decisionCount: decisionIds.length,
        timestampMs: now(),
      });
    },
    [lesson.id, decisionIds.length],
  );

  const select = useCallback(
    (optionId: OptionId) => {
      setState((prev) => {
        const scene = getScene(lesson, prev.currentSceneId);
        if (scene.type !== "decision") return prev;
        const option = scene.options.find((o) => o.id === optionId);
        const nextState = selectOption(
          prev,
          lesson,
          prev.currentSceneId,
          optionId,
          now(),
        );
        if (nextState === prev) return prev;

        // Fire the analytics seam.
        if (option) {
          const rec = nextState.decisions[prev.currentSceneId];
          handlersRef.current?.onAnswerSelected?.({
            lessonId: lesson.id,
            sceneId: prev.currentSceneId,
            optionId,
            isCorrect: option.isCorrect,
            decisionIndex: rec?.decisionIndex ?? 0,
            timestampMs: now(),
          });
        }
        emitSceneEnter(nextState.currentSceneId);
        maybeEmitComplete(nextState);
        return nextState;
      });
    },
    [lesson, emitSceneEnter, maybeEmitComplete],
  );

  const next = useCallback(() => {
    setState((prev) => {
      const nextState = advance(prev, lesson);
      if (nextState === prev) return prev;
      if (nextState.currentSceneId !== prev.currentSceneId) {
        emitSceneEnter(nextState.currentSceneId);
      }
      maybeEmitComplete(nextState);
      return nextState;
    });
  }, [lesson, emitSceneEnter, maybeEmitComplete]);

  const restart = useCallback(() => {
    setState(restartMachine(lesson, now()));
  }, [lesson]);

  const current = getScene(lesson, state.currentSceneId);

  return {
    state,
    current,
    decisionIds,
    isComplete: state.status === "complete",
    attemptsForCurrent: state.attempts[state.currentSceneId] ?? [],
    select,
    next,
    restart,
  };
}
