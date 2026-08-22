---
name: eximious-production
description: Produce one Eximious Academy interactive application video end to end - script validation, lesson branching, TTS, audio QA, driving base, LatentSync batching, split/remux/conform, media QA, player integration, functional acceptance and packaging. Triggers on produce an Eximious video, application video, AV1, run the pipeline, batch the lip-sync, Gate A, Gate B, Gate C, Gate D, motion base, driving base, narration masters, Thinkific package.
---

# Eximious production — v1

One reusable pipeline for all 267 application videos. Presenter-specific settings live in
`presenters/`; provider and model settings live in `models/`. **No lesson content lives in
this skill.** You produce whatever approved storyboard you are given, with whichever
presenter that course's track assigns.

Validated against the three executed pilots (claims-01 / Diane, siu-01 / Curtis,
ew-01 / Selena, all released 2026-08-21). Every constant here was measured, not estimated.

---

## 0. Read before you act — every time

Controlled sources come first. Never generate from memory when the requirement is on disk.

1. `docs/EXIMIOUS_PRODUCTION_SPEC.md` — consolidated implementation spec
2. The applicable pilot / course script — content authority
3. `docs/source/eximious-video-production-guidelines.pdf` — video-production visual authority
4. `docs/source/executed-agreement.pdf` — contractual authority
5. Project `CLAUDE.md`

**Source PDFs under `docs/source/` are confidential and git-ignored. Never commit, push,
upload or paste their contents anywhere.**

**If sources conflict, flag the conflict and stop. Do not silently reconcile it.**

**Known stale:** spec §6 and §7 F-1 still read "no 1920×1080+ master exists for Curtis or
Selena — OPEN, blocks pilot render". That closed 2026-08-20. Do not treat it as open.

---

## The stage map

Run in order. Each stage has its own file; read it when you reach it. A stage that ends in
a gate does not hand off until the gate passes.

| # | Stage | File | Gate | Cost |
|---|---|---|---|---|
| 1 | Script / storyboard validation | `stages/01-script-storyboard.md` | — | $0.00 |
| 2 | Lesson + branching validation | `stages/02-lesson-branching.md` | build-time validator | $0.00 |
| 3 | TTS narration + mastering | `stages/03-tts-narration.md` | — | ~$0.22–0.30 |
| 4 | Audio QA | `stages/04-gate-a-audio.md` | **GATE A** | $0.00 |
| 5 | Motion base → driving base | `stages/05-driving-base.md` | **GATE B** | $0.25–0.50 once per presenter, then $0.00 |
| 6 | Batch planning | `stages/06-batch-plan.md` | 3 hard constraints | $0.00 |
| 7 | Canary calls | `stages/07-canary.md` | frame assertion | ~$0.40 (inside the batch spend) |
| 8 | LatentSync run | `stages/08-lipsync-run.md` | frame assertion per call | ~$2.37–3.56 |
| 9 | Split / remux / conform | `stages/09-split-remux-conform.md` | — | $0.00 |
| 10 | Delivered-media QA | `stages/10-gate-c-media-qa.md` | **GATE C** | $0.00 |
| 11 | Player integration | `stages/11-player-integration.md` | test suite | $0.00 |
| 12 | Functional acceptance | `stages/12-gate-d-acceptance.md` | **GATE D pt 1** | $0.00 |
| 13 | Packaging + delivery readiness | `stages/13-packaging-delivery.md` | 3 invariants | $0.00 |

**Gates A and B are free and both sit before paid work. Run them. They exist because they
have already caught faults that would otherwise have shipped clipped narration across the
catalog.**

Canonical gate naming — the repo contradicts itself, so use this:
**Gate A = audio · Gate B = motion / driving base · Gate C = delivered asset · Gate D =
functional acceptance + real devices.** Inside `_gate-a-summary.json` the key `gate_b`
means the audio rows and `asr_adjudications` means script fidelity.

---

## Presenter routing

One consistent voice per track. Read the profile before touching that presenter's assets.

| Tracks | Presenter | Profile | Courses |
|---|---|---|---|
| 1, 4, 6, 10, 12 — Claims & Coverage | Diane Marchetti | `presenters/diane-marchetti.md` | 51 |
| 5, 7, 8, 9, 15 — Investigation & Fraud | Curtis Whitfield | `presenters/curtis-whitfield.md` | 32 |
| 2, 3, 11, 13, 14 — Professional Practice & Business | Selena Navarro | `presenters/selena-navarro.md` | 42 |

Identities, visual direction and voices are **CLIENT APPROVED / LOCKED**. No recasting,
redesigning or model change without explicit written approval.

---

## Provider and model routing

**This is not a cheapest-wins router.** The models are locked by client approval and by
pipeline rule 1. The locked route already *is* the verified cheapest route for each job —
LatentSync is $0.005/s on fal against $0.05/s on WaveSpeed, a 10× difference. Changing a
route needs written approval **and** a re-cost against the catalog budget, in that order.

| Job | Model | Provider | Recipe | Auth |
|---|---|---|---|---|
| Narration — Diane, Curtis | `tts-1-hd` | OpenAI direct | `models/openai-tts.md` | `OPENAI_API_KEY` |
| Narration — **Selena** | `minimax/speech-02-hd`, voice-design `ttv-voice-2026082200132526-qth65Vqj` | **fal.ai** | `presenters/selena-navarro.md` | `Key FAL_KEY` |
| Motion base (once per presenter) | `kling/v2-1-pro` | KIE | `models/kie-kling-v2-1-pro.md` | `Bearer KIE_API_KEY` |
| Lip-sync (the catalog default) | `fal-ai/latentsync` | fal.ai | `models/fal-latentsync.md` | `Key FAL_KEY` |
| Presenter still upscale | `topaz/image-upscale` | KIE | `models/kie-topaz-image-upscale.md` | `Bearer KIE_API_KEY` |
| Lip-sync fallback — **not approved for use** | `fal-ai/sync-lipsync` v1 | fal.ai | `models/fal-sync-lipsync-fallback.md` | `Key FAL_KEY` |

**Explicitly excluded, permanently:** HeyGen (never used on this project) and
InfiniTalk / KIE `infinitalk` (720p max against a contractual 1920×1080 floor, ~12× the
per-second cost). Any reference to either in older docs or in the `MediaProvider` type is
historical and is not a production route.

Keys are read from the environment. Never paste a key into a file, a sidecar, a log or a
commit.

---

## Cost guardrails

**Target: $3.40 per video · $908 for 267 · ~$1,090 at 20% revisions · hard ceiling $1,500
for the whole catalog.**

1. **Quote before every paid call and wait for an explicit go.** State model, provider,
   duration or character count, and dollars. Quoting is not approval. **One approval covers
   one run.**
2. **Dry-run first.** Every paid script takes `--dry-run` (and `lipsync-batch.mjs` also
   takes `--build-only`). Run it, read the projection, then ask.
3. **Pass `--max-cost` on every paid invocation.** The scripts abort above the ceiling
   before anything is sent.
4. **If projected per-video spend exceeds $5.62, STOP.** That is the point where the
   architecture has drifted. Re-cost it before continuing.
5. **The free gates run before the paid steps, without exception.** A Gate A failure stops
   the spend. The batch planner refuses to plan paid work on a segment that has not passed
   Gate A — do not work around it.
6. **Never re-run lip-sync for a player-side change.** UI, captions, colour, routing,
   scoring, packaging and layout are all $0.00 (pipeline rule 8). See
   `reference/cost-controls.md` for the full list of what costs money and what does not.
7. **Keep the raw LatentSync return on disk until delivery is signed off.** With it, a
   re-cut is $0.00. Diane's were discarded, which is the only reason her opening-frame
   defect costs ≈$2.37 to fix instead of nothing.
8. **Check the KIE credit balance before any Kling run.** 50 credits went unaccounted for
   twice during Selena's takes. If that is delayed settlement the true per-take price is
   $0.50, not $0.25 — unresolved.
9. **Re-verify unit prices before any large run.** Prices in `models/` were checked
   2026-08-18.

---

## Stop conditions — hard

Stop and ask. Do not work around any of these.

- A controlled source conflicts with another controlled source, or with the code.
- Gate A, B or C fails on any row that is not on the accepted-tolerance list in
  `reference/known-failures.md`.
- A batch plan violates any of its three hard constraints (every call ≥40 s · every call
  shorter than the driving base · every call ≤ the chunk ceiling).
- `returned frames != blocks × 16` on any call.
- Projected spend exceeds the quoted figure, or per-video spend exceeds $5.62.
- A presenter has no QA-passed motion base or no driving base longer than the chunk ceiling.
- Anything would modify an approved master in place.
- A change would bake text, UI, branding or captions into generated video.
- A defect is found in a delivered asset whose raw LatentSync return is no longer on disk
  (the fix is now paid, not free — that is a decision for Luis, not for you).

---

## Held for v1 — external gates, do not automate

These are outside this skill deliberately. Report them as held; never report them as passed.

- **Thinkific upload.** Never done, for any pilot, by any route. No credentials, no
  procedure, and it is **unknown** whether the Admin API can upload an HTML5 package. Do not
  invent a procedure and do not assert the API can or cannot do it. The lesson type is
  **Multimedia**, not SCORM.
- **Real-device testing (Gate D part 2).** iOS Safari + Android Chrome on real handsets.
  Deferred, not waived, on all three pilots. It is a human step.
- **Parallel / high-volume batch execution.** v1 runs one call at a time. fal rate limits at
  267-video volume are unverified, and a parallel runner is exactly what lost `request_id`
  on 5 of 8 calls. Add it only after this skill is validated in use.

---

## Provenance — four records per video, no exceptions

The pilots are asymmetric here and it is a real gap. Every video from now on emits all four:

1. `public/media/<lesson>/_gate-a-summary.json` — audio gate, all rows
2. `public/media/<lesson>/_lipsync-batch-plan.json` — the plan the spend was authorised against
3. `public/media/<lesson>/_call-N-request.json` — written **at submit time**, one per call
4. `public/media/<lesson>/<segment>.mp4.json` — per-asset sidecar with measured values

Plus per-segment ASR adjudications. Details and the required fields:
`reference/provenance-and-sidecars.md`.

**Nothing committed may contain `batch_audio_url`, `hosted_at` or `image_url`.** Those point
at permanent fal objects holding verbatim confidential narration, and `public/media/` is
tracked.

---

## When the video is done — write the production record

Every completed production writes a standardized record back to the Second Brain at
`~/.claude/projects/-Users-luismiguel-Desktop-eximious-branching-player/memory/`, so the
knowledge base stays current as the catalog runs.

Use `records/production-record-template.md`. It defines the file, the frontmatter, the
required fields, the index line, and what to do when a production teaches something new.
**A production is not finished until its record is written.**

---

## Never do these

- Modify an approved master in place. Derive to a **new** file and checksum the original
  afterwards (rule 6).
- Substitute the lip-sync provider or model without written approval (rule 1).
- Bake text, UI, branding, decisions, options, feedback, captions or overlays into generated
  video (rule 8). This is the rule that keeps a UI revision from costing a catalog re-render.
- Use the **water-damage demo** as content — labels, decisions, scene structure or its
  invented quiz. It is a template proof only and must never appear on a client-facing
  surface.
- Upload anything confidential to an anonymous public host. Use `scripts/fal-upload.mjs`,
  which sets 24 h retention and asserts it landed.
- Call LatentSync with less than 40 seconds of audio.
- Compute the 16-frame padding at anything other than **25 fps**.
- Keep LatentSync's returned audio.
- Ship an asset that is not exactly 1920×1080 / 25 fps.
- Adopt the Arch 2b hybrid (feedback branches as title cards). It changes the storyboard and
  needs Roger's approval.
- Claim a real-device pass, or a Thinkific upload, that did not happen.

---

## Supporting reference

- `reference/cost-controls.md` — unit prices, the batching economics, withdrawn architectures
- `reference/known-failures.md` — 38 traps already paid for once, plus the accepted tolerances
- `reference/stop-conditions.md` — the full stop / retry / escalation rules
- `reference/provenance-and-sidecars.md` — required records and their fields
