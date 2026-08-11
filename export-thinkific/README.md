# Eximious — Thinkific HTML5 export

This folder builds the approved **claims-investigation** lesson into a
**self-contained static HTML5 web package** for Thinkific's *HTML5 Multimedia
Lesson* upload. It does **not** change the Next.js app — it reuses the exact
approved player, engine, and lesson data from `../src` and produces a static
bundle that runs with no server, no APIs, and no Vercel.

## What it produces

- `../eximious-claims-investigation-thinkific-html5/` — the unzipped package
  (kept for inspection).
- `../eximious-claims-investigation-thinkific-html5.zip` — the upload file
  (`index.html` at the archive **root**, ~19 MB, well under Thinkific's 200 MB).

Package layout (index.html at root, no parent folder):

```
index.html                         # the whole app: JS + CSS + fonts inlined
eximious-academy-logo-reverse.png  # brand logo (relative path)
media/                             # 27 referenced clips/images (relative paths)
```

## How to rebuild

```bash
cd export-thinkific
npm install
npm run build        # Vite -> dist/index.html (single self-contained file)
node assemble.mjs    # relativize asset URLs + copy referenced media -> ../<package dir>
# then zip the package CONTENTS so index.html is at the archive root:
cd ../eximious-claims-investigation-thinkific-html5
zip -r -X ../eximious-claims-investigation-thinkific-html5.zip . -x '*.DS_Store' -x '__MACOSX*'
```

## How it works (why it's Thinkific-safe)

- **`base: "./"` + `vite-plugin-singlefile`** — all JavaScript, CSS, and the two
  variable fonts are inlined into one `index.html`, so the only external files
  are the relative `media/` assets and the logo. Nothing loads from a server.
- **`resolve.alias "@" -> ../src`** — the build imports the *exact approved*
  player/engine/lesson source. No fork, no behavior change. (`resolve.dedupe`
  forces a single React copy since the shared source lives outside this folder.)
- **`assemble.mjs`** strips the leading slash from the only root-absolute
  runtime URLs (`/media/...`, `/eximious-...png`) so every asset resolves
  **relative to `index.html`** — which is what Thinkific needs when it serves
  the package from an unknown subpath.
- **Fonts** are self-hosted via `@fontsource-variable/{fraunces,inter}` (the same
  faces the Next app loads with `next/font`), inlined as data URIs — zero
  external font requests.

## Updating the lesson or media later

Edit the approved source in `../src` (components, engine, or
`../src/lib/lessons/claims-investigation-application-1.ts`) and/or the media in
`../public/media`, then rebuild with the steps above. `assemble.mjs` copies
exactly the media the lesson references, so adding/removing a clip needs no
change here.

## Notes for the course admin (Thinkific upload)

- Upload the `.zip` as an **HTML5 package** (this is web content, **not SCORM**).
- Requires a modern browser (uses ES modules) — true of all current browsers.
- The presenter video **autoplays muted** and turns sound on at the learner's
  first interaction (click/tap/key); this is the approved behavior and avoids a
  separate "tap for sound" step. It also satisfies browser autoplay rules.
- Assumes Thinkific serves `index.html` as the package entry (the standard
  behavior), so the relative `media/` paths resolve within the package.
