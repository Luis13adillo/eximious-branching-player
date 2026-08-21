#!/usr/bin/env node
/**
 * Assemble the per-video SOURCE deliverable required by Agreement A §2.3 / §2.3.1.
 *
 *   node scripts/package-source.mjs --lesson siu-01-av1 --slug siu-01 --av 1
 *
 * A §2.3.1 asks for four things per video, and this produces exactly those:
 *   1. full player source
 *   2. the per-video config/data — decisions, options, feedback routing, retry
 *   3. all raw video and audio as DISCRETE files (main narration + every feedback branch)
 *   4. brief written docs so a competent developer can modify and re-export WITHOUT us
 *
 * Naming is B §3: `EA_[course-slug]_AV[n]_source.zip`.
 *
 * WHAT IS DELIBERATELY EXCLUDED, and why
 * --------------------------------------
 * - `docs/source/*.pdf` and `docs/confidential/` — the signed agreement carries signatures
 *   and PII, and the brand documents and scripts are confidential. They are git-ignored for
 *   the same reason. A source package is a thing that gets forwarded; these must never ride
 *   along in one.
 * - `node_modules` and build output — reproducible from the committed lockfile.
 * - Other videos' lessons and media. This is a PER-VIDEO deliverable; shipping the whole
 *   catalog in each one would multiply confidential script text across every hand-off.
 *
 * Costs $0.00.
 */

import {
  readFileSync, writeFileSync, mkdirSync, copyFileSync,
  readdirSync, rmSync, existsSync, statSync,
} from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));

function arg(name, fb = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fb;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}

const lessonId = arg("lesson");
const courseSlug = arg("slug");
const avNum = arg("av", "1");
if (!lessonId || !courseSlug) {
  console.error(
    "usage: --lesson <lesson-id> --slug <course-slug> [--av <n>] [--lesson-module <module-id>]",
  );
  process.exit(2);
}

/**
 * The lesson GRAPH module is usually named after the lesson id, and defaults to it.
 * claims-01 is the exception: its media, narration and test suite are keyed `claims-01-av1`
 * while its graph module — and therefore its REGISTRY SLUG, which the route and
 * `EXPORT_LESSON_SLUG` both resolve by — is `claims-investigation-application-1`. Those are
 * two different identifiers and a single one cannot address both, so the module id is
 * separately overridable. Assuming they matched is what made the first claims-01 source
 * build fail outright (ENOENT on `claims-01-av1.ts`).
 */
const lessonModule = arg("lesson-module", lessonId);

const name = `EA_${courseSlug}_AV${avNum}_source`;
const out = join(REPO, name);
if (existsSync(out)) rmSync(out, { recursive: true, force: true });

const copied = [];
function copyInto(srcRel, destRel = srcRel) {
  const src = join(REPO, srcRel);
  if (!existsSync(src)) return false;
  const dest = join(out, destRel);
  if (statSync(src).isDirectory()) {
    for (const e of readdirSync(src, { withFileTypes: true })) {
      copyInto(join(srcRel, e.name), join(destRel, e.name));
    }
    return true;
  }
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  copied.push(destRel);
  return true;
}

// ---------------------------------------------------------------- 1. player source
// The whole player boundary, engine and shared UI, plus the routes that mount them.
for (const d of [
  "src/components", "src/lib/branching", "src/app",
]) copyInto(d);

/**
 * `engine.test.ts` is dropped from the package, and only that file.
 *
 * It exercises the engine against OTHER videos' lessons (`water-damage-claim`,
 * `claims-investigation-application-1`), which a per-video source package must not carry —
 * shipping them would put another course's script text into this hand-off. Rather than ship
 * a suite that cannot pass, it is removed and its absence is explained in the README. The
 * engine SOURCE is fully present, and `${lessonId}.test.ts` exercises the same routing,
 * retry and rejoin behaviour against this video's own graph.
 */
const droppedTests = ["src/lib/branching/engine.test.ts"];
for (const t of droppedTests) {
  const f = join(out, t);
  if (existsSync(f)) { rmSync(f); copied.splice(copied.indexOf(t), 1); }
}

// Root config the build needs. package-lock.json is included so `npm ci` reproduces the
// exact dependency tree that was tested, rather than whatever resolves on the day.
for (const f of [
  "package.json", "package-lock.json", "tsconfig.json", "next.config.ts",
  "postcss.config.mjs", "eslint.config.mjs", "next-env.d.ts",
  // Supplies the "@" -> ./src alias to the TEST RUNNER. Without it every test fails to
  // resolve its imports, which is exactly how the first build of this package failed.
  "vitest.config.mts",
]) copyInto(f);

// ---------------------------------------------------------------- 2. per-video config/data
// The lesson graph (decisions, options, feedback routing, retry) and its narration data,
// plus the registry that mounts it and the test suite that guards it.
for (const f of [
  `src/lib/lessons/${lessonModule}.ts`,
  `src/lib/lessons/${lessonId}.narration.ts`,
  `src/lib/lessons/${lessonId}.test.ts`,
  "src/lib/lessons/index.ts",
]) copyInto(f);

/**
 * The registry imports every lesson, so a package carrying only this one would not compile.
 * Rather than ship the other videos' data, the registry is rewritten to register just this
 * lesson — which is also what a developer modifying THIS video wants to see.
 */
const regPath = join(out, "src/lib/lessons/index.ts");
let reg = readFileSync(regPath, "utf8");
const lessonSrc = readFileSync(join(REPO, `src/lib/lessons/${lessonModule}.ts`), "utf8");
const exportName = lessonSrc.match(/export const (\w+): Lesson/)?.[1]
  ?? lessonSrc.match(/export const (\w+)\s*=/)?.[1];
if (!exportName) throw new Error(`cannot find the exported lesson const in ${lessonModule}.ts`);
reg = reg
  .replace(/^import \{ [^}]+ \} from "\.\/(?!.*branching)(?!index)[^"]+";\n/gm, "")
  .replace(/const allLessons: Lesson\[\] = \[[\s\S]*?\];/,
    `const allLessons: Lesson[] = [${exportName}];`)
  .replace(/export const FEATURED_LESSON_SLUG = \w+\.slug;/,
    `export const FEATURED_LESSON_SLUG = ${exportName}.slug;`);
reg = `import { ${exportName} } from "./${lessonModule}";\n` + reg;
writeFileSync(regPath, reg);

// ---------------------------------------------------------------- 3. raw media, discrete
// Every delivered clip, every narration master, and every provenance sidecar — the main
// narration and all twelve feedback branches as separate files, per A §2.3.
copyInto(`public/media/${lessonId}`, `public/media/${lessonId}`);

// The presenter still the player uses as its poster, and the brand logo.
const lessonFile = readFileSync(join(REPO, `src/lib/lessons/${lessonModule}.ts`), "utf8");
for (const m of lessonFile.matchAll(/"\/media\/([A-Za-z0-9._-]+\.(?:png|jpg|jpeg|webp))"/g)) {
  copyInto(`public/media/${m[1]}`, `public/media/${m[1]}`);
}
for (const l of ["eximious-academy-logo-reverse.png", "eximious-academy-logo.png"]) {
  copyInto(`public/${l}`, `public/${l}`);
}

// ---------------------------------------------------------------- 4. the re-export toolchain
for (const f of readdirSync(join(REPO, "export-thinkific"))) {
  if (f === "node_modules" || f === "dist") continue;
  copyInto(join("export-thinkific", f), join("export-thinkific", f));
}

/**
 * `export-thinkific/` has its own package.json and its own install step, so the root
 * typecheck must not reach into it — otherwise `npm run build` fails on missing Vite
 * plugins before the developer has had any reason to install them.
 */
/**
 * `tsconfig.json` is JSONC, not JSON — TypeScript and Next both accept `//` comments in it,
 * and the repo's copy carries one explaining why the built deliverables are excluded. A bare
 * `JSON.parse` throws on that, which took this whole script down. Strip comments first, and
 * do it with an actual string-state scan rather than a regex: a naive `//` strip would eat
 * the rest of the line inside any path or URL that contains a double slash.
 */
function stripJsonComments(src) {
  let out = "";
  let inStr = false, esc = false, line = false, block = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (line) { if (c === "\n") { line = false; out += c; } continue; }
    if (block) { if (c === "*" && n === "/") { block = false; i++; } continue; }
    if (inStr) {
      out += c;
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; out += c; continue; }
    if (c === "/" && n === "/") { line = true; i++; continue; }
    if (c === "/" && n === "*") { block = true; i++; continue; }
    out += c;
  }
  // trailing commas are legal in tsconfig too, and illegal in JSON
  return out.replace(/,(\s*[}\]])/g, "$1");
}

const tsconfigPath = join(out, "tsconfig.json");
const tsconfig = JSON.parse(stripJsonComments(readFileSync(tsconfigPath, "utf8")));
/**
 * `EA_*` and the legacy package names exclude the repo's own BUILT DELIVERABLES from the
 * root typecheck. They are meaningless inside a source package — it contains no such
 * directories — so they are dropped rather than shipped as puzzling dead config.
 */
tsconfig.exclude = [...new Set([...(tsconfig.exclude ?? []), "export-thinkific"])]
  .filter((e) => !e.startsWith("EA_") && !e.startsWith("eximious-"));
writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");

// ---------------------------------------------------------------- guard: nothing confidential
const banned = copied.filter((f) =>
  f.includes("docs/source/") || f.includes("docs/confidential") ||
  /\.env/.test(f) || /\.pdf$/i.test(f));
if (banned.length) {
  console.error("!! CONFIDENTIAL MATERIAL IN THE PACKAGE:", banned.join(", "));
  process.exit(1);
}

// ---------------------------------------------------------------- written docs (A §2.3.1)
const car = (id) => JSON.parse(readFileSync(join(REPO, `public/media/${lessonId}/${id}.mp4.json`), "utf8"));
const ids = readdirSync(join(REPO, `public/media/${lessonId}`))
  .filter((f) => f.endsWith(".mp4.json")).map((f) => f.replace(".mp4.json", "")).sort();
const first = car(ids[0]);
const runtime = ids.reduce((a, id) => a + car(id).split.video_dur_s, 0);

writeFileSync(join(out, "README.md"), `# ${name}

Source deliverable for **${first.video}** — Agreement A §2.3 / §2.3.1, naming per B §3.

Presenter: **${first.presenter}**. ${ids.length} narration segments, ${(runtime / 60).toFixed(1)} min total runtime,
delivered at ${first.delivery.dims} / ${first.delivery.fps}.

---

## What is in here

| Path | What it is |
|---|---|
| \`src/components/\` | the player: stage, controls, captions, disclosure, decision and feedback UI |
| \`src/lib/branching/\` | the engine — scene graph types, validation, and the state machine that routes decisions, feedback, retry and rejoin |
| \`src/lib/lessons/${lessonModule}.ts\` | **this video's config**: every scene, decision, option, feedback route and rejoin |
| \`src/lib/lessons/${lessonId}.narration.ts\` | verbatim script per segment, its sha256, measured duration, caption cues, asset URL |
| \`src/lib/lessons/${lessonId}.test.ts\` | the guard suite — storyboard shape, branch routing, narration hashes, delivered-media checks |
| \`src/app/\` | the Next.js routes that mount the player (\`/lesson/[slug]\`, \`/embed/[slug]\`) |
| \`public/media/${lessonId}/\` | **all raw media as discrete files** — see below |
| \`export-thinkific/\` | the toolchain that produces the uploadable HTML5 package |

\`src/lib/branching/engine.test.ts\` is the one file held back: it exercises the engine against
other videos' lessons, which this per-video package does not carry. The engine source is
complete, and \`${lessonId}.test.ts\` covers the same routing, retry and rejoin behaviour
against this video's own graph.

### Raw media (A §2.3)

Every segment ships as its own file — main narration and each feedback branch separately:

- \`<id>.mp4\` — the delivered clip, ${first.delivery.dims}, ${first.delivery.fps}
- \`<id>.mp3\` — the narration master it carries: 24 kHz mono 128 kbps at −24.5 LUFS
- \`<id>.mp4.json\` / \`<id>.json\` — provenance: model, seed, request id, cut offsets, QA rows

The \`.mp3\` is the audio source of record. The \`.mp4\` carries a byte-identical copy of it —
the lip-sync model's own audio output is discarded and the master is remuxed, so the sound
never passes through a second encode.

---

## Build and run it

\`\`\`bash
npm ci
npm run dev     # http://localhost:3000/lesson/${lessonModule}
npm test        # the guard suite
npm run build   # production build
\`\`\`

## Re-export the Thinkific package

\`\`\`bash
cd export-thinkific && npm ci
EXPORT_LESSON_SLUG=${lessonModule} npm run build
EXPORT_PACKAGE_NAME=EA_${courseSlug}_AV${avNum} EXPORT_MAX_VIDEO_MBPS=2.2 node assemble.mjs
cd ../EA_${courseSlug}_AV${avNum} && zip -r -X ../EA_${courseSlug}_AV${avNum}.zip . -x '*.DS_Store'
\`\`\`

\`EXPORT_MAX_VIDEO_MBPS\` re-encodes only the copies **inside the package** — \`public/media\`
is never touched, and audio is copied rather than re-encoded, so the approved sound survives
whatever video bitrate you choose. Without it the clips are copied verbatim and this video's
package would be ${(ids.reduce((a, id) => a + statSync(join(REPO, `public/media/${lessonId}/${id}.mp4`)).size, 0) / 1e6).toFixed(0)} MB — over Thinkific's 200 MB limit.

---

## How to change things

**Wording of a decision, an option, feedback text, routing, retry, scoring, colours, layout,
captions:** all of it is data or player code. Edit \`${lessonModule}.ts\` or the components and
re-export. **No video is re-rendered and nothing is re-billed.**

**Spoken words:** that is the only change that costs money. The narration has to be
re-synthesised and re-lip-synced for the affected segment.

**If you re-cut or replace a clip**, update \`durationSec\` in the narration file to the new
measured length. The test suite reads durations back out of the sidecars and will fail if the
lesson data and the files disagree — that is deliberate; a mismatch desyncs the scrubber and
auto-advance.

### Two things that will bite you if you don't know them

1. **Segments open and close on 0.24 s of digital silence.** The clips are cut at the midpoint
   of the silence between segments, not at the first word, because the lip-sync model starts
   moving the mouth about six frames before any sound. Cutting at the first word leaves an open
   mouth with visible teeth on the frame the player holds. Caption cues are therefore offset by
   +0.24 s against narration time.

2. **Asset URLs must be written out in full.** The Thinkific export finds media by scanning the
   built output for literal URL strings. A path assembled at runtime from a base plus an id
   cannot be found, and the package would ship with no media in it.

---

## Not included, deliberately

The signed agreement, brand guidelines and course scripts under \`docs/source/\`, and anything
in \`docs/confidential/\`. They carry signatures, PII and confidential material, and a source
package is a thing that gets forwarded onward. Other videos' lessons and media are also
excluded — this is a per-video deliverable.
`);

// ---------------------------------------------------------------- report
const walk = (d) => readdirSync(d, { withFileTypes: true }).reduce((t, e) => {
  const p = join(d, e.name);
  return t + (e.isDirectory() ? walk(p) : statSync(p).size);
}, 0);

console.log(`\n${name}`);
console.log(`  files            : ${copied.length + 1}`);
console.log(`  media segments   : ${ids.length} mp4 + ${ids.length} mp3 + sidecars`);
console.log(`  size             : ${(walk(out) / 1e6).toFixed(1)} MB`);
console.log(`  confidential     : none (asserted)`);
console.log(`  -> ${relative(REPO, out)}\n`);
