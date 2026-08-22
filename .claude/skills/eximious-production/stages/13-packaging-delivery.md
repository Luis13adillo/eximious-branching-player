# Stage 13 — Packaging and delivery readiness

**Cost $0.00. Two deliverables per video, per Agreement B §3 and §2.3.1.**

## Build both

```bash
EXPORT_PACKAGE_NAME=EA_<slug>_AV<n> [EXPORT_MAX_VIDEO_MBPS=1.9] node export-thinkific/assemble.mjs
node scripts/package-source.mjs --lesson <lesson-id> --slug <slug> --av <n>
```

Naming is fixed: **`EA_[course-slug]_AV[n].zip`** and **`EA_[course-slug]_AV[n]_source.zip`**.

## Verify three invariants after the build — do not assume them

| Invariant | Rule | How |
|---|---|---|
| Masters byte-identical | rule 6 | re-checksum every file in `public/media` (the pilots ran **316/316 files, 0 changed**) |
| Packaged audio identical to the locked master | rule 4 | `-c:a copy` from the master, verified |
| Packaged video exactly 1920×1080 / 25 fps | rule 5 | ffprobe every packaged asset |

## The 200 MB Thinkific ceiling binds on every video

Delivered masters alone measure **196.8 MB** (Diane), **199.4 MB** (Curtis) and **259.2 MB**
(Selena) — at or over the ceiling as a straight copy.

**It is not a bitrate problem.** All three sit at 2.5–2.9 Mbps from
`libx264 -preset slow -crf 18`; ew-01 is simply longer.

`EXPORT_MAX_VIDEO_MBPS` re-encodes **only the copies inside the package**. It never touches
`public/media` (rule 6) and never touches the audio (`-c:a copy`, rule 4).
Executed: **1.9 Mbps** for claims-01 and ew-01, **2.2 Mbps** for siu-01.
Resulting PSNR against the masters: 50.7–51.4 / 49.1–50.3 / 47.1–49.1 dB — visually lossless,
verified by eye at 3× on the mouth and jaw.

**Read the units.** The repo quotes sizes in both MiB and decimal MB for the same files.
Thinkific's limit is stated as **200 MB — assume decimal and leave headroom.** The MiB
reading makes Curtis look like he has 10 MB of room when he has none. **Measure, do not
quote.**

## Platform requirements the package must satisfy

| Requirement | Note |
|---|---|
| `.zip` only | |
| **Max 200 MB** | decimal |
| **`index.html` at the archive ROOT** | not inside a wrapping folder |
| No junk entries | zero `__MACOSX`, zero `.DS_Store` |

The root-level rule is the one that actually bites — Thinkific has a whole support article
about HTML5 exports failing because the zip wraps its contents in a folder. **Always zip the
package CONTENTS, never the package directory:**

```bash
cd EA_<slug>_AV<n> && zip -r -X ../EA_<slug>_AV<n>.zip . -x '*.DS_Store' -x '__MACOSX*'
```

## Record BOTH hashes if one was already sent

**A zip rebuild changes the digest even when the contents are identical** — zips embed file
timestamps. ew-01's recorded hash had to be corrected for exactly this reason. If a digest has
already gone to the client, **record both. Do not overwrite one.**

## Repo hygiene

Generated deliverables inside the repo break the repo's own build. Each `_source.zip` carries
a full copy of `src/` and `export-thinkific/`, which is why `EA_*` is excluded in
`tsconfig.json`. **A green local build is not evidence a deploy works** — the root tsconfig's
`"**/*.ts"` include type-checked a separate workspace and **every production deploy failed for
ten days** while a stale build kept serving. Reproduce the deploy environment; do not infer it.

Current exclusions: `["node_modules", "EA_*", "eximious-*-thinkific-html5*", "export-thinkific"]`.

## Deployment readiness — internal preview only

Vercel is an **internal preview**, not a delivery channel. Before a production embed,
**narrow `next.config.ts`'s `frame-ancestors *` to the Thinkific hosts.** Currently open.

## HELD / EXTERNAL — Thinkific upload

**Nothing has ever been uploaded to Thinkific, for any pilot, by any route.**

- No credential exists in the repo. No Thinkific code in `scripts/` or `src/`. The only
  Thinkific commit in git history is the export *build* path.
- **It is UNKNOWN whether the Admin API (`https://api.thinkific.com/api/public/v1`) can
  upload an HTML5 package.** Their public docs describe it only as an admin-UI action.
  **Do not assert either way, and do not guess from the presence of a `/courses` endpoint** —
  creating a lesson record is not the same as uploading a package into it.
- The lesson type is **Multimedia** — **not SCORM** unless requested in writing (Agreement A §2).
- **Do not invent a procedure. Do not claim one exists.**

**Whether Thinkific serves byte ranges is unknown.** It serves the package differently from a
LAN static server, and byte ranges are the one property that decides whether feedback clips
play at all. **Verify it on the first upload.**

### What must still happen before an upload counts as delivered

1. Upload to a Thinkific **Multimedia** lesson.
2. Re-run Agreement §2.2 functional acceptance **inside Thinkific**.
   `scripts/acceptance-package.mjs` covers a local package but cannot reach a Thinkific-hosted
   lesson.
3. Real-device round 1 on **iOS Safari and Android Chrome** (stage 12, half 2).

## Exit criteria for this skill's scope

Both zips built, named per spec, hashed, and the three invariants verified.
Upload and real-device testing reported as **held**, with their true status.

**Then write the production record — `../records/production-record-template.md`. The video is
not finished until that record exists.**
