import type { Lesson, LessonSummary } from "@/lib/branching/types";
import { waterDamageClaim } from "./water-damage-claim";

/**
 * LESSON REGISTRY
 * ============================================================================
 * The single place lessons are registered. Adding lesson #2 … #267 is one line
 * here plus one config file — no player, route, or component changes. Routes
 * resolve a lesson by slug via `getLesson`, and the catalog is generated from
 * `listLessons()`.
 *
 * At production scale you would likely load these from a CMS or JSON files and
 * key them the same way; the player only depends on the `Lesson` shape, not on
 * where the data comes from.
 */
const registry: Record<string, Lesson> = {
  [waterDamageClaim.slug]: waterDamageClaim,
};

export function getLesson(slug: string): Lesson | undefined {
  return registry[slug];
}

export function getAllLessonSlugs(): string[] {
  return Object.keys(registry);
}

function countDecisions(lesson: Lesson): number {
  return Object.values(lesson.scenes).filter((s) => s.type === "decision")
    .length;
}

export function toSummary(lesson: Lesson): LessonSummary {
  return {
    id: lesson.id,
    slug: lesson.slug,
    courseTitle: lesson.courseTitle,
    title: lesson.title,
    subtitle: lesson.subtitle,
    estimatedMinutes: lesson.estimatedMinutes,
    decisionCount: countDecisions(lesson),
    caseId: lesson.meta?.caseId,
  };
}

export function listLessons(): LessonSummary[] {
  return Object.values(registry).map(toSummary);
}

export const DEMO_LESSON_SLUG = waterDamageClaim.slug;
