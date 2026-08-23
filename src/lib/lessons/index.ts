import type { Lesson, LessonSummary } from "@/lib/branching/types";
import { validateLesson } from "@/lib/branching/engine";
import { claimsInvestigationApplication1 } from "./claims-investigation-application-1";
import { claims01Av1Native } from "./claims-01-av1-native"; // native pilot
import { ew01Av1 } from "./ew-01-av1";
import { siu01Av1 } from "./siu-01-av1";
import { siu01Av1Native } from "./siu-01-av1-native"; // native pilot
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
const allLessons: Lesson[] = [
  claimsInvestigationApplication1,
  claims01Av1Native, // native pilot
  siu01Av1,
  siu01Av1Native, // native pilot
  ew01Av1,
  waterDamageClaim,
];

/**
 * Validate every lesson graph as the registry loads. Because this module is
 * evaluated during `next build`, a malformed lesson (missing scene reference,
 * a decision without exactly one correct answer, branches that don't rejoin,
 * etc.) FAILS THE BUILD rather than crashing a learner at runtime. This is the
 * guardrail that keeps 267 hand-authored lessons safe.
 */
for (const lesson of allLessons) {
  const problems = validateLesson(lesson);
  if (problems.length > 0) {
    const message = `Invalid lesson "${lesson.id}":\n  - ${problems.join("\n  - ")}`;
    if (process.env.NODE_ENV === "production") {
      // Fail the build so bad data never ships.
      throw new Error(message);
    } else {
      console.error(`[Eximious] ${message}`);
    }
  }
}

const registry: Record<string, Lesson> = Object.fromEntries(
  allLessons.map((lesson) => [lesson.slug, lesson]),
);

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

export const FEATURED_LESSON_SLUG = claimsInvestigationApplication1.slug;
