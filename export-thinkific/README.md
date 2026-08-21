# Eximious — Thinkific HTML5 export

This folder builds an approved lesson (selected by `EXPORT_LESSON_SLUG`) into a
**self-contained static HTML5 web package** for Thinkific's *HTML5 Multimedia
Lesson* upload. It does **not** change the Next.js app — it reuses the exact
approved player, engine, and lesson data from `../src` and produces a static
bundle that runs with no server, no APIs, and no Vercel.

## What it produces

- `../<EXPORT_PACKAGE_NAME>/` — the unzipped package (kept for inspection).
- `../eximious-claims-investigation-thinkific-html5.zip` — the upload file
  (`index.html` at the archive **root**, **~189 MB**). Thinkific's HTML5 limit is
  200 MB, so the headroom is thin: the 22 delivered clips are 1080p and account
  for 188 MB of it. Video is already compressed, so zipping saves nothing — the
  archive is the same size as the folder. **If an upload is ever rejected for
  size**, re-encode the copies *inside the package* to a lower bitrate (~139 MB
  at 2.3 Mbps) and leave `../public/media` untouched; the masters must stay
  byte-identical.

Package layout (index.html at root, no parent folder):

```
index.html                         # the whole app: JS + CSS + fonts inlined
eximious-academy-logo-reverse.png  # brand logo (relative path)
media/                             # 24 referenced clips/images (relative paths)
```

## How to rebuild

Three environment variables select the lesson, name the deliverable, and cap video
bitrate. With none set, the build reproduces the original claims-investigation package
exactly as before.

| Variable | Meaning |
|---|---|
| `EXPORT_LESSON_SLUG` | which lesson to package (default `claims-investigation-application-1`) |
| `EXPORT_PACKAGE_NAME` | deliverable directory/zip name — use `EA_<video>_AV1` per the agreement |
| `EXPORT_MAX_VIDEO_MBPS` | re-encode the packaged video copies to this bitrate; omit to copy verbatim |

```bash
cd export-thinkific
npm install

# claims-01 (Diane) — unchanged behaviour
npm run build && node assemble.mjs

# siu-01 (Curtis) — needs the bitrate cap, see below
EXPORT_LESSON_SLUG=siu-01-av1 npm run build
EXPORT_PACKAGE_NAME=EA_siu-01_AV1 EXPORT_MAX_VIDEO_MBPS=2.2 node assemble.mjs

# then zip the package CONTENTS so index.html is at the archive root:
cd ../EA_siu-01_AV1
zip -r -X ../EA_siu-01_AV1.zip . -x '*.DS_Store' -x '__MACOSX*'
```

### Why siu-01 needs `EXPORT_MAX_VIDEO_MBPS`

Curtis's 22 delivered clips are **199.4 MB** on their own — over Thinkific's 200 MB
limit before `index.html` is added. At 2.2 Mbps the package is **163 MB** (zip 176 MB),
leaving real headroom.

Two invariants the re-encode must not break, both asserted by `assemble.mjs`, which
fails the build rather than shipping a violation:

- **`public/media` is never touched.** Only the copies inside the package are re-encoded;
  the delivered masters stay byte-identical (rule 6).
- **Audio is `-c:a copy`.** The locked 24 kHz / −24.5 LUFS master passes through unchanged
  (rule 4) — verified byte-identical on all 22 packaged clips. Video bitrate has no effect
  on the sound.

Dimensions are re-probed afterwards because delivery is exactly 1920×1080 (rule 5).

### One lesson per package

`vite.config.ts` aliases `@export-lesson` to a single lesson module rather than importing
the registry. Importing `@/lib/lessons` pulls in **every** registered lesson, and with them
every literal asset URL they carry — the closure scan then copies all four videos' media
into one package. Measured before the fix: **319.7 MB** and a hard failure on `ew-01` media
that has not been produced yet.

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
- The presenter video **does not start on its own** — this is the locked template
  behavior for all 267 application videos. The lesson opens on its first frame
  behind a labelled Start control, and the learner's press starts **picture and
  sound together**. After that, segment transitions continue automatically. The
  earlier "autoplays muted, sound on first interaction" behavior described here
  was superseded on 2026-08-19; see "★ LOCKED — Playback start behavior" in
  `../docs/EXIMIOUS_PRODUCTION_SPEC.md`.
- Assumes Thinkific serves `index.html` as the package entry (the standard
  behavior), so the relative `media/` paths resolve within the package.
