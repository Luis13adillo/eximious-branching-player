import { writeFileSync } from "node:fs";
import path from "node:path";
import { getLesson } from "@/lib/lessons";

/**
 * Bake the three native pilot lessons into STANDALONE modules.
 * ============================================================================
 * The preview versions clone their dubbed twin and swap "/media/<x>/" ->
 * "/media/<x>-native/" at runtime. That works in the player but breaks the
 * Thinkific export: the export copies exactly the media that appears as a
 * LITERAL path in the built file, and a runtime-computed path is invisible to
 * it. This rewrites each native lesson as a plain data module with every media
 * path baked in literally, so it exports to a self-contained package and, for
 * the handoff, carries no dependency on any other lesson.
 *
 * Idempotent: re-running reads the already-baked module (identical native
 * paths) and writes the same output.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/bake-deliverable-lessons.ts
 */
const targets = [
  ["claims-01-av1-native", "claims01Av1Native"],
  ["siu-01-av1-native", "siu01Av1Native"],
  ["ew-01-av1-native", "ew01Av1Native"],
] as const;

for (const [slug, name] of targets) {
  const lesson = getLesson(slug);
  if (!lesson) throw new Error(`no registered lesson for slug "${slug}"`);
  // Strip any stale display-only fields so a re-bake stays clean.
  for (const scene of Object.values(lesson.scenes)) {
    const m = scene.media as unknown as Record<string, unknown> | undefined;
    if (m) delete m.presenterFraming;
  }
  const json = JSON.stringify(lesson, null, 2);
  const content = `import type { Lesson } from "@/lib/branching/types";

/**
 * DELIVERABLE pilot lesson — ${slug} (native cut), STANDALONE.
 * ============================================================================
 * Every media path is a literal, baked from the resolved lesson — no dependency
 * on any other lesson module — so this exports cleanly to a self-contained
 * Thinkific HTML5 package. Regenerate with scripts/bake-deliverable-lessons.ts.
 */
export const ${name}: Lesson = ${json} as Lesson;
`;
  const out = path.resolve(process.cwd(), `src/lib/lessons/${slug}.ts`);
  writeFileSync(out, content);
  console.log(`baked ${slug} -> ${name} (${(json.length / 1024).toFixed(0)} KB literal)`);
}
