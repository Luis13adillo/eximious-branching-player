# Eximious Academy — Project Instructions

This repository is exclusively for the Eximious Academy interactive training-video program.

## Authoritative Sources

Before making production-level changes, consult:

1. `docs/source/executed-agreement.pdf`
2. `docs/source/video-production-spec.pdf`
3. `docs/source/pilot-scripts.pdf`
4. `docs/EXIMIOUS_PRODUCTION_SPEC.md`
5. `docs/source/eximious-corporate-brand-guidelines.pdf`
6. `docs/source/eximious-video-production-guidelines.pdf`

> Note: every source PDF under `docs/source/` is kept **local-only and git-ignored**
> (`docs/source/*.pdf`) because they contain the signed agreement (signatures /
> PII) and confidential brand documents and course scripts. They are available at
> these paths on the working machine but must never be committed or pushed.

Source precedence:

- Executed Agreement = contractual authority
- Roger's Video Production Spec = production authority
- Roger's Pilot Scripts = content authority for the three pilots
- EXIMIOUS_PRODUCTION_SPEC.md = consolidated implementation specification,
  including later client-approved decisions
- Corporate Brand Guidelines = corporate visual authority
- Interactive Video Production Guidelines = video-production visual/system
  authority (inherits the corporate brand)

If sources conflict, flag the conflict. Do not silently reconcile it.

Later explicit client-approved decisions recorded in `docs/EXIMIOUS_PRODUCTION_SPEC.md`
supersede earlier conflicting implementation guidance, except where doing so would
conflict with the Executed Agreement.

Never treat superseded guidance as an unresolved approval item.

Do not substitute the existing water-damage demo for pilot content.
It is a technical/template reference only.

## Current Pilot

Three pilot videos:

- claims-01 AV1 — Marcus Delaney
- siu-01 AV1 — Marcus Delacroix
- ew-01 AV1 — Prieto expert-witness case

All three must use the reusable player architecture rather than bespoke implementations.

Do not create bespoke player behavior for an individual pilot when the requirement
belongs in the reusable template. Pilot implementation must prove the architecture
intended for the full 267-video catalog.

## Critical Rule

Do not silently invent, reinterpret, or remove client requirements.

If code conflicts with the authoritative specifications, flag the conflict before making a destructive or expensive change.

Do not render expensive media until the relevant presenter identity, script, configuration, and template requirements are locked.

Before generating or rendering production media, verify that the applicable presenter,
script, interaction configuration, visual rules, disclosure behavior, captions, and
required reusable components comply with the controlled sources.

Do not use the water-damage demo's content, labels, decisions, or scene structure as
pilot content.

## Mandatory — read controlled sources before any production work

Before any Eximious visual, presenter, UI, media, rendering, or package-production work, read and reconcile:

- the authoritative Agreement / Production Spec / applicable Pilot Script
- `docs/EXIMIOUS_PRODUCTION_SPEC.md`
- the Corporate Brand Guidelines where corporate-brand decisions apply
- the Interactive Video Production Guidelines for all video-production decisions

The Interactive Video Production Guidelines are mandatory across all 267 application videos.

Do not generate from memory if the controlled requirements are available.

---

## ★ LOCKED — Production Media Pipeline (verified by QA gate, 2026-08-18)

Passed two paid QA gates. Evidence: `docs/PRODUCTION_READINESS_COST_LOCK.md`,
`docs/LIPSYNC_QA_GATE_LATENTSYNC.md`, `docs/MOTION_BASE_PIPELINE_TEST.md`.
**Only verified, approved decisions are recorded here.**

### Presenters — identities, visual direction and voices are LOCKED

| | Diane Marchetti | Curtis Whitfield | Selena Navarro |
|---|---|---|---|
| Track group | Claims & Coverage (1, 4, 6, 10, 12) | Investigation & Fraud (5, 7, 8, 9, 15) | Professional Practice & Business (2, 3, 11, 13, 14) |
| Courses | 51 | 32 | 42 |
| Approved visual reference | `public/media/presenter-diane.jpg` (1920×1088, **original dark office**) — meets the 1080p floor; production base | `public/media/presenter-2-curtis-whitfield-master.png` (1672×941) — approved visual reference ONLY, NOT a production master | `public/media/presenter-3-selena-navarro-master.png` (1672×941) — approved visual reference ONLY, NOT a production master |
| Provider / model | OpenAI `tts-1-hd` | OpenAI `tts-1-hd` | **fal.ai → MiniMax `speech-02-hd`** (recast 2026-08-22) |
| Voice | `shimmer` | `onyx` | **voice-design `ttv-voice-2026082200132526-qth65Vqj`** ("LA-1-mexican-american") |
| Required settings | `speed: 1.0`, `response_format: mp3` | `speed: 1.0`, `response_format: mp3` | `voice_setting: {speed: 1, vol: 1, pitch: 0}`; raw requested at 44.1 kHz / 256 kbps mono, then mastered to the locked standard |

### ★ RECAST 2026-08-22 — Selena Navarro's voice

**Approved by Roger, relayed by Luis, 2026-08-22.** Selena moves from OpenAI
`gpt-4o-mini-tts-2025-12-15` / `sage` to a MiniMax voice-design voice served through fal.
This was a **production rule 9 change (provider *and* model) and a client recasting
decision**; both were approved together. Canonical record:
`public/media/presenter-3-selena-navarro-voice-SELECTED.json`.

| | |
|---|---|
| Endpoint | `POST https://fal.run/fal-ai/minimax/speech-02-hd` |
| `voice_id` | `ttv-voice-2026082200132526-qth65Vqj` |
| Origin | `fal-ai/minimax/voice-design`, prompt-designed 2026-08-22 (prompt recorded in the sidecar) |
| Measured | 154.8 Hz body pitch, 159 wpm on the audition; **~42 Hz deeper than the superseded `sage`** |
| Audio standard | **UNCHANGED** — still 24 kHz / mono / 128 kbps / −24.5 LUFS, linear gain only |

**This reverses the superseded voice's own written direction.** The retired 1133-character
`instructions` string said *"Do not add a Spanish or Hispanic accent and do not stylise the
delivery around ethnicity in any way."* The recast deliberately reverses that. It is
recorded here so no later session "corrects" it back. MiniMax takes no `instructions`
parameter at all — delivery is carried by the designed voice itself.

**The superseded definition is retained, not deleted**, so the audio that shipped on
2026-08-21 stays reproducible:
`public/media/presenter-3-selena-navarro-voice-SELECTED-v1-sage-superseded.json` (carries
the `instructions` string byte-exact, sha256 `bdf6862d…83eeda`, 1133 characters) and
`…-v1-sage-superseded.mp3`. Presenter key `selena-navarro-v1-sage` in
`scripts/tts-narration.mjs` reproduces it and **aborts if selected** — using it again is a
new client approval, not a fallback.

> **★ RISK — carried, not solved.** The `voice_id` is an **account-scoped MiniMax
> voice-design ID, and voice-design is not deterministic**: the recorded design prompt is
> not guaranteed to return this voice again. Selena carries **42 courses**. If the ID
> lapses before they are rendered, this exact voice may be unrecoverable. **Mitigation:
> render early and keep every raw synthesis.** This exposure did not exist on `sage`,
> which is a catalogued OpenAI voice plus a text string held in this repo.

Selena's **seated** version is the speaking video; her **standing** version is course
pages / title cards only.

### Audio standard — every narration asset, every presenter

**mp3 · 24 kHz · mono · 128 kbps · −24.5 LUFS integrated.** Calibrated single encode from
raw, **linear gain only** — never compression or limiting. Verify with `ffmpeg ebur128`
before any paid downstream step.

### The pipeline — LOCKED

```
locked script
  → TTS on the locked per-presenter voice config
    (OpenAI tts-1-hd for Diane and Curtis; fal → MiniMax speech-02-hd for Selena)
  → ffmpeg master to 24 kHz / mono / 128 kbps @ −24.5 LUFS
  → audio QA gate (loudness, format, F0 onset) — MUST pass before any paid step
  → [ONE TIME per presenter] kling/v2-1-pro (KIE), 10 s, 1920×1080, NO audio → motion base
  → concatenate narration into calls of ≥40 s
  → pad to clear the 16-frame boundary, CALCULATED AT 25 FPS
  → fal-ai/latentsync · loop_mode: pingpong · seed recorded
  → trim to whole frames, ROUNDING UP one frame so video covers the audio
  → discard LatentSync's returned audio; remux the locked 24 kHz narration
  → ffmpeg split at segment offsets + conform to exactly 1920×1080
  → encode the delivered audio to AAC-LC 128k / 24 kHz / mono, video stream COPIED
  → existing Next.js branching player
  → export-thinkific self-contained HTML5 zip
```

### Non-negotiable production rules

1. **`fal-ai/latentsync` is the default catalog lip-sync engine.** Do not substitute a
   provider or model without explicit written approval. **Specifically excluded: HeyGen
   (never used on this project) and InfiniTalk / KIE `infinitalk` (superseded — 720p max
   against the contractual 1920×1080 floor, ~12× the per-second cost).** Any reference to
   either in older docs, demo lesson data or the `MediaProvider` type is historical and is
   not a production route.
2. **Every lip-sync call must carry ≥40 seconds of audio.** Below 40 s the $0.20 per-call
   minimum applies; per-segment calling raises catalog cost ~79%.
3. **LatentSync always returns 25 fps**, whatever the input frame rate. Compute the
   16-frame padding at 25 fps or the fix under-pads and silently clips narration.
4. **The locked narration is the only audio that reaches delivery, and it must be in a
   codec every browser decodes.** Three parts, all binding:
   - **Always discard LatentSync's returned audio** (it comes back AAC 16 kHz). The
     authoritative source is always the locked **24 kHz / mono / 128 kbps / −24.5 LUFS**
     master produced at the mastering step. Nothing else may be substituted for it.
   - **The delivered MP4's audio must be AAC-LC** (`mp4a.40.2`), 128 kbps / 24 kHz / mono,
     transcoded once from that master with the video stream copied (`-c:v copy`), plus
     `+faststart`. −24.5 LUFS must survive the transcode — verify with `ebur128`.
   - **MP3 inside the final MP4 is forbidden.** A stream-copied `.mp3` becomes an `mp4a`
     sample entry with ESDS objectTypeIndication `0x69` (`mp4a.69`), which **WebKit refuses
     to decode**. Every iOS browser is WebKit, so all three pilots shipped 2026-08-21 with
     picture and silence on iPhone and iPad. Corrected the same day at $0.00 by
     re-containering; nothing was regenerated. An mp3 intermediate inside the working
     directory is fine and is where the byte-exactness proofs run — it must not be the
     delivered file.

   **Never judge delivery audio by codec name or by "is the locked master in the file?"
   alone.** In the defect above the master WAS in the file, bit-exact. Assert what the
   browser can actually decode: Gate C rows `delivered_audio_browser_safe`, `delivered_dims`,
   `delivered_video_bit_identical`, `delivered_frames_identical`, `delivered_loudness`.
5. **Delivery is exactly 1920×1080.** Conform every asset; never assume the model's output
   dimensions are correct.
6. **Approved masters stay byte-identical.** Never regenerate, edit, crop, recolour,
   enhance or upscale them in place. Derive test/production artifacts to new files and
   verify the originals by checksum afterwards.
7. **Motion bases are generated once per presenter and reused across all 267 videos.**
   A new base is required only if Roger changes an approved appearance — a new approval.
8. **Never bake text, UI, branding, decisions, options, feedback, captions or overlays into
   generated video.** The player and Remotion composite all of that at runtime. Generated
   video carries the presenter speaking and nothing else. This is what keeps a UI revision
   from costing a re-render across the catalog.
9. **No recasting, redesigning, or changing providers/models without explicit approval.**
10. **Optimize against the established ~$1,000–$1,500 total catalog media/API budget.**
    Any architecture change must be costed against it before adoption.

### Player template — LOCKED (no autoplay at initial load)

**Locked 2026-08-19. Applies to all 267 application videos.** An application video
**must not start playing on load.** It opens on its first frame behind a labelled
Start control; the learner's press starts **picture and sound together**. After that,
segment transitions continue automatically — the deliberate start is asked for once
per video. `LessonPlayer` prop `requireStart`, template default `true`.

An unstarted stage shows the opening frame, the lower-third, the controls and the Start
control — nothing else. Three knock-on rules move with it and nothing else: the AI
disclosure now appears when the VIDEO opens (not the page) and then holds and fades as
approved; the caption band is empty until the lesson starts; and the 120 s presence-check
countdown arms at Start instead of at page load. Wording, placement, interval and the
locked once-per-video budget are unchanged. Full rule and rationale:
`docs/EXIMIOUS_PRODUCTION_SPEC.md`, "★ LOCKED — Playback start behavior".

This is player behavior only. **It re-renders no media** — which is precisely what
pipeline rule 8 exists to guarantee.

### Verified unit prices (checked 2026-08-18 — re-verify before large runs)

| Item | Price |
|---|---|
| `fal-ai/latentsync` | **$0.20 for ≤40 s, then $0.005/sec** |
| `kling/v2-1-pro` (KIE), 10 s 1080p motion base | **100 credits = $0.50** (measured) |
| KIE credit | $0.005 |
| OpenAI `tts-1-hd` | $30.00 / 1M characters |
| OpenAI `gpt-4o-mini-tts` | $0.60 / 1M text-in + $12.00 / 1M audio-out tokens |
| Fallback `fal-ai/sync-lipsync` v1 | $0.70 / minute |
| ffmpeg · Remotion · player · Thinkific export | $0.00 |

### QA status — verified

- **Lip-sync gate (all three presenters): PASS.** Identity preserved (background change
  within re-encode noise), correct mouth state through silence/speech, teeth clean, loop
  seam invisible, indistinguishable from base at player scale.
- **Selena motion-base gate: PASS.** Natural blinking **survives LatentSync frame-for-frame**;
  Kling reframing measured at 1.00× (no zoom/crop); mouth-specific softness only −2.1 pp;
  all four production fixes verified end-to-end.
- **Curtis beard softness is ACCEPTED.** He carries an ~11.8 pp mouth-specific softness
  penalty (facial hair). It is invisible at player scale. **Do not act on this unless Roger
  rejects it at review** — the fallback is then to route **Curtis only** to
  `fal-ai/sync-lipsync` v1 ($0.70/min, ≈ +$274 catalog), changing nothing else.

### Open before production use

- **Curtis and Selena still require compliant 1920×1080+ production-resolution masters.**
  Both approved files are 1672×941. Produce via precision upscale to **new files**
  (≈$0.05 each); never alter the approved references.
- **Diane and Curtis still need production motion bases** before their first production
  use. Only Selena's has been generated and QA-passed.
- Selena's **standing** course-page / title-card asset is not yet on disk.

---

@AGENTS.md
