/**
 * Dump a lesson's expected scene graph as JSON, for scripts/acceptance-package.mjs to
 * check the package against. Reads the lesson from the registry, so it works for any of
 * the 267 videos, not just the pilots.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/dump-lesson-graph.ts <out.json> [slug]
 *
 * Carries NO script text — ids, routing, media URLs and the authored continue labels only.
 * Costs $0.00.
 */
import { writeFileSync } from "node:fs";
import { getLesson, getAllLessonSlugs } from "@/lib/lessons";

const out = process.argv[2];
const slug = process.argv[3] ?? "ew-01-av1";
if (!out) {
  console.error("usage: dump-lesson-graph.ts <out.json> [slug]");
  process.exit(2);
}
const lesson = getLesson(slug);
if (!lesson) {
  console.error(`no lesson "${slug}". registered: ${getAllLessonSlugs().join(", ")}`);
  process.exit(2);
}

const scenes = lesson.scenes as Record<string, any>;
const decisions = Object.values(scenes)
  .filter((s: any) => s.type === "decision")
  .map((d: any) => ({
    id: d.id,
    options: d.options.map((o: any) => ({
      id: o.id,
      correct: !!o.isCorrect,
      feedback: o.feedbackSceneId ?? null,
    })),
  }));

writeFileSync(
  out,
  JSON.stringify(
    {
      slug: lesson.slug,
      sceneCount: Object.keys(scenes).length,
      sceneTypes: Object.fromEntries(Object.entries(scenes).map(([k, v]: any) => [k, v.type])),
      videoUrls: Object.fromEntries(
        Object.entries(scenes).map(([k, v]: any) => [k, v.media?.videoUrl ?? null]),
      ),
      decisions,
      // The advance control is authored PER SCENE ("See who you are", "Take the call", …).
      // The driver needs the real labels; matching on "Continue" alone stalls at the intro.
      continueLabels: [
        ...new Set(Object.values(scenes).map((s: any) => s.continueLabel).filter(Boolean)),
      ],
    },
    null,
    2,
  ),
);
console.log(
  `${lesson.slug}: ${Object.keys(scenes).length} scenes, ${decisions.length} decisions, ` +
    `${decisions.reduce((a, d) => a + d.options.length, 0)} options -> ${out}`,
);
