import { existsSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Static export build for Thinkific (HTML5 web package).
 * --------------------------------------------------------------
 * - `base: "./"`            → every bundled URL is RELATIVE, so the package
 *                             works when Thinkific serves it from any subpath.
 * - viteSingleFile()        → all JS + CSS + fonts are inlined into index.html,
 *                             so the only external files are the relative media
 *                             assets and the logo. Nothing loads from a server.
 * - alias "@" → ../src      → reuses the EXACT approved player/engine/lesson
 *                             source. No forking, no behavior change.
 * - publicDir: false        → media/logo are assembled into the deliverable by
 *                             the package script, not copied by Vite.
 */
/**
 * Which lesson this package carries. Defaults to the approved claims-investigation
 * pilot so an argument-less build keeps producing exactly what it produced before.
 * `main.tsx` resolves it through the shared lesson registry and fails the build if
 * the slug is not registered.
 */
const EXPORT_LESSON_SLUG =
  process.env.EXPORT_LESSON_SLUG || "claims-investigation-application-1";

/**
 * The lesson module is aliased in BY PATH, not looked up through the registry.
 *
 * Importing `@/lib/lessons` would pull every registered lesson into the bundle, and
 * with them every literal asset URL they carry — the closure scan in assemble.mjs
 * would then copy all four videos' media into one package. Measured: 319.7 MB and
 * a hard failure on media that has not been produced yet. Aliasing one module keeps
 * exactly one lesson's data, and its media, in the deliverable.
 *
 * Lesson slugs and their filenames are the same string by convention; the alias
 * fails loudly at build time if that ever stops being true.
 */
const lessonModulePath = path.resolve(
  dir,
  `../src/lib/lessons/${EXPORT_LESSON_SLUG}.ts`,
);
if (!existsSync(lessonModulePath)) {
  throw new Error(
    `EXPORT_LESSON_SLUG "${EXPORT_LESSON_SLUG}" has no module at ${lessonModulePath}`,
  );
}

export default defineConfig({
  base: "./",
  define: { EXPORT_LESSON_SLUG: JSON.stringify(EXPORT_LESSON_SLUG) },
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(dir, "../src"),
      "@export-lesson": lessonModulePath,
    },
    // The shared components live in ../src (outside this workspace), so without
    // this Vite would resolve their `react`/`react-dom` imports to the Next
    // app's node_modules while the entry resolves them here — two React copies,
    // which breaks hooks ("null.useState"). Dedupe forces a single copy.
    dedupe: ["react", "react-dom"],
  },
  publicDir: false,
  build: {
    // Force fonts (and any other CSS-referenced asset) to inline as data URIs
    // so the single index.html makes zero external requests for code/styles.
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    // Broad support target; ES modules are inlined into the page.
    target: "es2020",
    emptyOutDir: true,
  },
});
