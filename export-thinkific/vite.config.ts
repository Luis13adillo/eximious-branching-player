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
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: { "@": path.resolve(dir, "../src") },
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
