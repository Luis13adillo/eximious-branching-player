"use client";

import type { Lesson } from "@/lib/branching/types";
import type { PlayerEventHandlers } from "@/lib/branching/events";
import { LessonPlayer } from "./LessonPlayer";

/**
 * Client boundary for the player. Server pages resolve the (serializable)
 * lesson data and hand it here; this file wires the analytics event handlers.
 *
 * The default handlers just log to the console so an integrator can SEE the
 * `onAnswerSelected` / `onSceneEnter` / `onLessonComplete` events firing. Swap
 * `defaultHandlers` for a real analytics/xAPI sink — no other change needed.
 */
const defaultHandlers: PlayerEventHandlers = {
  onAnswerSelected: (e) => {
    // Example seam: send to analytics here.
    if (typeof console !== "undefined") console.info("[Eximious] onAnswerSelected", e);
  },
  onSceneEnter: (e) => {
    if (typeof console !== "undefined") console.debug("[Eximious] onSceneEnter", e);
  },
  onLessonComplete: (e) => {
    if (typeof console !== "undefined") console.info("[Eximious] onLessonComplete", e);
  },
};

export function PlayerClient({
  lesson,
  embed = false,
}: {
  lesson: Lesson;
  embed?: boolean;
}) {
  return <LessonPlayer lesson={lesson} handlers={defaultHandlers} embed={embed} />;
}
