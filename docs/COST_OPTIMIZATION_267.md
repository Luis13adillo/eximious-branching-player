# Eximious — 267-Video Cost Optimization · Hard Cost Gate

**Date:** 2026-08-18 · **Target:** $1,000–$1,500 total media/API spend for 267 videos
**Verdict:** **TARGET IS ACHIEVABLE — ~$1,090 at 20% revisions, with zero change to Roger's storyboard or experience.**

Nothing was generated. Nothing was bought. No presenter, voice, or line of code was touched. Total spend producing this report: **$0**.

The previously proposed $5,156 architecture is withdrawn. It was wrong in one specific, identifiable way: it priced lip-sync at **$0.04/sec** on KIE without surveying the dubbing-model market, and it assumed one API call per script segment. Both assumptions were expensive. Correcting them cuts the catalog cost by **86%**.

---

## Executive answer

| | |
|---|---|
| **Cheapest architecture satisfying every locked requirement** | Reusable 1080p base performance loop + **`fal-ai/latentsync`** batched dubbing + ffmpeg split |
| **Cost per video** | **$3.40** |
| **267-video base** | **$908** |
| **20% revision-adjusted** | **$1,090** |
| **Storyboard change required** | **None.** 100% of narration stays presenter-on-camera |
| **Biggest cost driver** | Lip-synced presenter seconds — 89% of per-video spend |
| **Single largest saving** | **Batching calls to ≥40 s** — worth 44% on its own |

---

## 1. BOTTOM-UP MODEL — derived from the actual scripts

### 1.1 Generated presenter minutes per video

Character counts extracted from `docs/source/pilot-scripts.pdf`, with bracketed on-screen cues, headers and the A–D option text removed (options are displayed, not spoken). Seconds = characters ÷ each locked voice's **measured** rate, taken from the approved audition files themselves.

| Pilot | Presenter · voice | Spoken chars | Measured rate | Narration |
|---|---|---|---|---|
| `claims-01` | Diane · `shimmer` | 7,411 | 15.53 ch/s | **477 s (7.95 min)** |
| `siu-01` | Curtis · `onyx` | 9,496 | 16.24 ch/s | **585 s (9.75 min)** |
| `ew-01` | Selena · `sage` | 10,314 | 13.73 ch/s | **751 s (12.52 min)** |
| **Total** | | **27,221** | | **1,813 s (30.2 min)** |

**Planning figure: 604 s = 10.07 minutes of generated presenter narration per video**, across roughly 24–30 discrete segments (opening, assignment, 3 decision questions, 12 per-option feedback, 3 rejoins, resolution beats, quiz hand-off).

Rates are measured, not assumed: Curtis's selected take is 43 words / 253 chars in 15.576 s; Selena's is 48 words / 289 chars in 21.048 s; Diane's is derived from the shipped demo narration (4,592 caption chars over 295.6 s).

### 1.2 What must be unique per video vs. what is reused

| Asset | Unique or reused | Paid? |
|---|---|---|
| Narration audio, every branch | **Unique** — script differs | Yes, per video |
| Mouth movement matching that narration | **Unique** | Yes, per video |
| Presenter identity, face, wardrobe, environment, lighting | **Reused across all 267** | One-time |
| Presenter body performance / head motion | **Reused across all 267** | One-time |
| Exhibit imagery (~3 photographic per video) | Unique | Yes, ~$0.15/video |
| Player, branching engine, retry/rejoin/scoring | Reused | $0 |
| Template components, overlays, captions, lower-third, AI disclosure | Reused | $0 |
| Thinkific export pipeline | Reused | $0 |

### 1.3 Does lip-sync really need to be generated per narrated second?

**Per on-camera second: yes. Per *frame*: emphatically no — and that is where the money is.**

A dubbing model (LatentSync, sync-lipsync, volcengine v2v) takes existing video plus audio and **repaints only the mouth region**. Everything else in the frame — face, hair, wardrobe, desk, office, lighting — passes through untouched from the base clip. So:

- **~95–97% of every delivered frame is reused base footage.** Only the mouth area (roughly 2–5% of frame area) is regenerated.
- **Presenter identity cannot drift**, because it is never re-synthesised. This is a consistency win across a 267-video catalog, not just a cost win.
- The base performance clip is generated **once per presenter, ever**.

This is why an avatar model that regenerates the whole person from a still (Kling AI Avatar, InfiniTalk) is the wrong tool here: it pays to re-invent the presenter on every call.

### 1.4 The binding constraint is not seconds — it is the per-call minimum

`fal-ai/latentsync` bills **$0.20 flat for anything up to 40 seconds, then $0.005 per second**. Our segments run 2.6 s to 24 s. Called naively, one API call per script segment:

- ~27 segments × $0.20 = **$5.40/video** → 267 videos = **$1,442**

Batched — concatenate the narration with 0.5 s of silence between segments, run one call, split the returned video at the known offsets with ffmpeg:

- 604 s × $0.005 = **$3.02/video** → 267 videos = **$806**

**Batching alone saves 44%** and is the difference between scraping under the ceiling and sitting comfortably below it. The split step is free, local, and deterministic. Cutting mid-silence means the presenter's mouth is closed at every boundary.

Chunking is cost-neutral: five 120-second calls cost exactly the same as one 600-second call, because every chunk clears the 40-second minimum. That de-risks any undocumented duration cap entirely — see §6.

### 1.5 Does HyperFrames or Motion tooling change the economics?

**No.** Stated plainly because the question was asked directly:

- The HyperFrames CLI is **not installed** on this machine (skill files exist; no binary on PATH).
- Rendering and compositing are **already $0**. Remotion is already a devDependency (`npm run remotion`), and `remotion/IntroSegment.tsx` **already implements the exact pattern this architecture needs** — looping a ~10 s Kling presenter clip across 33 s of narration with the brand grade applied.
- More importantly, the player composites overlays **at runtime in HTML**. Captions, decisions, options, feedback, progress rail, lower-third and AI disclosure are never baked into video. There is no rendering cost to remove.

HyperFrames would add a second motion framework without eliminating a single dollar. Not recommended.

**Local free lip-sync** (Wav2Lip / LatentSync / MuseTalk on this machine) would be $0 marginal cost, but neither `torch` nor `onnxruntime` is installed, and the instruction was not to buy or install. Recorded as a future option, not proposed.

---

## 2. VERIFIED UNIT PRICES

All read from the provider's own pricing surface today. Nothing below is remembered or inferred.

### Lip-sync / dubbing — full market survey

| Model | Provider | Price | Per-second | Notes |
|---|---|---|---|---|
| **`fal-ai/latentsync`** | **fal.ai** *(key held)* | **$0.20 ≤40 s, then $0.005/s** | **$0.0050** | Video-to-video dubbing. `loop_mode: pingpong` |
| `fal-ai/sync-lipsync` (v1) | fal.ai *(key held)* | $0.70 / minute | $0.0117 | sync.so 1.7.1 / 1.8.0 / 1.9.0-beta |
| `sync/lipsync-1.9.0-beta` | WaveSpeed | $0.025 / s | $0.0250 | **Same model, 2.1× fal's price** |
| `pruna-ai/p-video/avatar` | WaveSpeed | $0.025 / s | $0.0250 | |
| **`volcengine/video-to-video-lip-sync`** | KIE *(key held)* | 8 cr/s | **$0.0400** | *Previously proposed. 8× LatentSync* |
| `wavespeed-ai/latentsync` | WaveSpeed | $0.05 / s | $0.0500 | **Same model, 10× fal's price** |
| `sync/lipsync-2` | WaveSpeed | $0.05 / s | $0.0500 | |
| `fal-ai/sync-lipsync/v2` | fal.ai | $3.00 / minute | $0.0500 | lipsync-2 / lipsync-2-pro |
| `infinitalk/from-audio` @720p | KIE | 12 cr/s | $0.0600 | **720p max — non-compliant** |
| `kling/ai-avatar-pro` @1080p | KIE | 16 cr/s | $0.0800 | Regenerates whole presenter |
| `fal-ai/kling-video/ai-avatar/v2/pro` | fal.ai | $0.115 / s | $0.1150 | |
| `fal-ai/sync-lipsync/v3/image-to-video` | fal.ai | $0.1333 / s | $0.1333 | |
| `veed/fabric-1.0` @720p | fal.ai | $0.15 / s | $0.1500 | Non-compliant |

**The same models are priced very differently across aggregators.** LatentSync is $0.005/s on fal and $0.05/s on WaveSpeed — a 10× spread for identical output. sync 1.9.0-beta is $0.0117/s on fal and $0.025/s on WaveSpeed. Routing matters as much as model choice.

*(WaveSpeed `base_price` confirmed as per-second, from its own model page: "$0.05 per second of input video".)*

### TTS — locked, unchanged

| Model | Price | Source |
|---|---|---|
| `tts-1-hd` (Diane `shimmer`, Curtis `onyx`) | **$30.00 / 1M characters** | developers.openai.com/api/docs/pricing |
| `gpt-4o-mini-tts` (Selena `sage`) | **$0.60 / 1M text-in + $12.00 / 1M audio-out tokens** ≈ $0.015/min | same |

### Supporting generation

| Item | Price | Source |
|---|---|---|
| KIE `kling-3-0` Pro, no audio (base loop) | 18 cr/s = **$0.090/s** | kie.ai |
| KIE `topaz/image-upscale` ≤2K (presenter master) | 10 cr = **$0.05** | kie.ai |
| Nano Banana 2 (exhibit imagery) | ~**$0.034**/1K image | Google direct |
| **KIE credit rate** | **$0.005 USD** | kie.ai |
| ffmpeg · Remotion · player · export | **$0.00** | local / in-repo |

---

## 3. COST CATEGORIES A–G

Per finished video, at **100% on-camera narration** — no storyboard change.

| | Category | Tool | Per video |
|---|---|---|---|
| **A** | **TTS** | OpenAI, locked per presenter | **$0.23** |
| **B** | **Presenter / lip-sync** | `fal-ai/latentsync`, batched | **$3.02** |
| **C** | **Video generation** | Kling 3.0 Pro base loops | **$0.00** (one-time) |
| **C2** | Exhibit imagery | Nano Banana 2, ~3/video | **$0.15** |
| **D** | **Rendering / compositing** | ffmpeg + Remotion, local | **$0.00** |
| **E** | **Interactive player** | existing Next.js player | **$0.00** |
| **F** | **Hosting / delivery** | self-contained zip; Thinkific hosts | **$0.00** |
| | **Total** | | **$3.40** |
| **G** | **Revisions** | +10% / +20% overlay | see §4 |

**A — TTS blend.** Diane 51 courses, Curtis 32, Selena 42. At 9,074 chars/video: `tts-1-hd` presenters $0.27, Selena ~$0.155 (incl. her `instructions` string re-sent on every call). Allocation-weighted: **$0.231/video**.

**F — Hosting is genuinely $0.** The deliverable is a self-contained HTML5 zip that Thinkific serves. No CDN, no egress, no external calls (verified: the export relativises every asset URL). Vercel is internal preview only, on free tier.

---

## 4. THREE ARCHITECTURES COMPARED

Common to all: locked voices, locked presenters, 1920×1080 output, existing player, existing export, ffmpeg/Remotion compositing, one-time base loops.

**One-time cost, identical across all three:**

| Item | Cost |
|---|---|
| Presenter 1920×1080 masters — Topaz upscale, 3 + Selena standing | $0.20 |
| Base performance loops — Kling 3.0 Pro, 3 presenters × 3 candidates × 10 s | $8.10 |
| **Total one-time** | **$8.30** |

---

### ARCHITECTURE 1 — LatentSync, batched **(RECOMMENDED)**

**Tools:** OpenAI TTS (locked) → ffmpeg concat → **`fal-ai/latentsync`** (`loop_mode: pingpong`, `seed` recorded) → ffmpeg split + conform → existing player → `export-thinkific`

| | |
|---|---|
| Cost per generated presenter minute | **$0.30/min** |
| Cost per finished video | **$3.40** |
| One-time | $8.30 |
| **3-video pilot** | **$18.49** (media $10.19 + one-time $8.30) |
| **267-video base** | **$908** |
| +10% revisions | **$999** |
| +20% revisions | **$1,090** |
| **Total projected API/media spend** | **~$1,090** |

**Advantages**
- Cheapest verified route by 2.3× over the next option.
- **Identity cannot drift** — the presenter is never re-synthesised, only the mouth is repainted. The strongest possible consistency guarantee across 267 videos and multiple years.
- `loop_mode: pingpong` loops the base clip forward-then-backward, so a 10 s base drives 10 minutes of narration with no visible seam.
- `seed` parameter → reproducible, satisfying the source-file and reproducibility obligations.
- Fits **all three budget tiers**, including the $1,000 tier at 10% revisions.
- **Zero storyboard change.** Every narrated second stays presenter-on-camera.

**Quality risks**
- LatentSync processes the face region at limited internal resolution and composites back. On a tight close-up the mouth can read softer than the surrounding native-resolution frame. **All three approved masters are medium seated-desk shots — the favourable case** — but this must be gated on real output, not assumed.
- Possible temporal flicker in the mouth region on long takes. Chunking to ~120 s per call limits exposure.
- Batch-and-split adds a step that must be exactly right; a bad split desynchronises a segment. Build once, test hard, verify every boundary automatically.

**Scalability risks**
- Open-source model on a hosted endpoint — fal could deprecate or reprice it. **Mitigated:** raw narration ships as discrete source files per A §2.3, so the catalog never depends on the API staying up; and Architecture 2 is a drop-in fallback at 2.3× cost, still under $1,500 with the hybrid option.
- fal rate limits at 267-video volume are unverified.
- Single-call maximum duration is undocumented. **Cost-neutral to mitigate** — chunk at 120 s.

**Satisfies Roger's locked requirements?** **Yes, in full.** Speaking AI presenters throughout · 1920×1080 · 3 decisions × 4 options · individual feedback for all 12 · storyboard fidelity · reusable player · Thinkific delivery · no static-card substitution.

---

### ARCHITECTURE 2 — sync-lipsync v1 (quality-first fallback)

**Tools:** identical, swapping the dubbing model for `fal-ai/sync-lipsync` (`lipsync-1.9.0-beta`, `sync_mode: bounce`)

| | |
|---|---|
| Cost per generated presenter minute | **$0.70/min** |
| Cost per finished video | **$7.43** |
| **3-video pilot** | **$30.56** |
| **267-video base** | **$1,984** |
| +10% / +20% revisions | $2,182 / **$2,381** |

**Advantages** — commercial model with a stronger quality reputation than open-source LatentSync; `sync_mode: bounce` gives the same seamless loop; same identity-preservation property; no per-call minimum, so batching is optional.

**Risks** — **exceeds the $1,500 ceiling by 59%** at 20% revisions.

**Satisfies requirements?** Yes on experience — **no on budget.**

> **Architecture 2b — sync-lipsync + hybrid on-camera.** Delivering the 9 wrong-answer feedback segments as title card + voiceover over 1920×1080 exhibit stills cuts on-camera time to ~57%: **$4.39/video → $1,172 base → $1,406 at 20%.** Fits the $1,500 tier. **This changes the storyboard and requires Roger's approval — it is listed here as a costed option, not a recommendation, and must not be adopted silently.**

---

### ARCHITECTURE 3 — KIE volcengine v2v (the withdrawn proposal)

**Tools:** identical, swapping in `volcengine/video-to-video-lip-sync` at $0.04/s

| | |
|---|---|
| Cost per generated presenter minute | **$2.40/min** |
| Cost per finished video | **$24.54** |
| **3-video pilot** | **$82.16** |
| **267-video base** | **$6,552** |
| +10% / +20% revisions | $7,207 / **$7,862** |

**Advantages** — commercial Chinese-cloud model; explicit 1080p handling; already holds a KIE key.

**Risks** — **5.2× over the ceiling.** Exceeds the entire $8,000 contract at 20% revisions when labor is added.

**Satisfies requirements?** Yes on experience — **decisively no on budget. Withdrawn.**

---

### Side by side

| | Arch 1 · LatentSync | Arch 2 · sync v1 | Arch 2b · sync + hybrid | Arch 3 · volcengine |
|---|---|---|---|---|
| $/presenter minute | **$0.30** | $0.70 | $0.70 | $2.40 |
| $/video | **$3.40** | $7.43 | $4.39 | $24.54 |
| 3-pilot | **$18.49** | $30.56 | $21.47 | $82.16 |
| 267 base | **$908** | $1,984 | $1,172 | $6,552 |
| +10% | **$999** | $2,182 | $1,289 | $7,207 |
| +20% | **$1,090** | $2,381 | $1,406 | $7,862 |
| Under $1,500? | ✅ | ❌ | ✅ | ❌ |
| Under $1,250? | ✅ | ❌ | ❌ | ❌ |
| Under $1,000? | ✅ *(at 10%)* | ❌ | ❌ | ❌ |
| Storyboard unchanged? | ✅ | ✅ | ⚠️ **needs approval** | ✅ |

---

## 5. MAXIMUM PAID-GENERATION BUDGET PER VIDEO

| Ceiling | Max per finished video | Arch 1 at $3.40 |
|---|---|---|
| **267 under $1,000** | **$3.745** | ✅ fits (base $3.40; $3.74 at 10% revisions) |
| **267 under $1,250** | **$4.682** | ✅ fits with 20% revisions ($4.08) |
| **267 under $1,500** | **$5.618** | ✅ fits with 65% revision headroom |

**The $1,000–$1,500 target is achievable and is not close.** Architecture 1 lands at $908 base / $1,090 at 20% revisions, with **no reduction to Roger's required experience**. No mathematical impossibility argument is needed, and none is offered.

Headroom check: at $5.618/video the ceiling permits **1,124 seconds** of lip-sync per video at $0.005/s — 86% more than the 604 s the scripts actually require. Even a 50% underestimate of script length stays inside $1,500.

---

## 6. IMPLEMENTATION RULES THAT PROTECT THE BUDGET

1. **Never call the dubbing model with less than 40 seconds of audio.** Below 40 s you pay the $0.20 minimum regardless. This one rule is worth 44%.
2. **Batch per video, chunk at ~120 s.** Concatenate all segment audio with 0.5 s silence between, chunk to ~120 s, one call per chunk, split at known offsets. Cost is identical to one long call and it removes the undocumented-duration-cap risk.
3. **Cut only inside silence.** Mouth closed at every boundary; no visible discontinuity.
4. **Never re-run lip-sync for a UI change.** Decisions, options, feedback routing, retry, reshuffle, scoring, rejoin, overlays, captions, colours, fonts and layout are all player-side data. Confirmed in `src/lib/branching/types.ts` — no branching logic lives in any component. Only a change to *spoken words* costs money.
5. **Base loops are generated once, ever.** A new base clip is needed only if Roger changes an approved appearance — a new approval, not routine work.
6. **Record the `seed` on every call** and write a sidecar `.json` per asset, so any segment is reproducible years later.
7. **Route through fal for dubbing.** The identical models cost 2–10× more on WaveSpeed.

---

## 7. REQUIRED FIGURES

| | |
|---|---|
| **TARGET ARCHITECTURE** | Reusable 1080p presenter base loop + **`fal-ai/latentsync`** batched video-to-video dubbing (`loop_mode: pingpong`) + ffmpeg concat/split/conform + existing Next.js branching player + `export-thinkific` HTML5 package. TTS unchanged and locked: `tts-1-hd`·`shimmer` / `tts-1-hd`·`onyx` / `gpt-4o-mini-tts-2025-12-15`·`sage` |
| **ONE-TIME COST** | **$8.30** — 3 presenter masters + Selena standing ($0.20) · 9 candidate base loops ($8.10) |
| **COST PER VIDEO** | **$3.40** — TTS $0.23 · lip-sync $3.02 · exhibits $0.15 |
| **3-PILOT COST** | **$18.49** |
| **267-VIDEO COST** | **$908** base (+ $8.30 one-time = **$916**) |
| **20% REVISION-ADJUSTED** | **$1,090** |
| **COST PER COURSE** | **$7.27** base · **$8.72** at 20% revisions (125 courses, 2.14 videos each) |
| **PAID GENERATION MINUTES REQUIRED** | **2,689 minutes** of lip-sync (44.8 hours) + **1.5 minutes** one-time base footage |
| **REUSED MEDIA PERCENTAGE** | Presenter identity, wardrobe, environment and body performance: **100% reused across all 267 videos.** Per delivered frame, **~95–97% is untouched base footage** — only the mouth region is regenerated. Paid generated footage that is reused rather than re-made: **99.94%** (1.5 min generated once vs. 2,689 min that would otherwise be re-synthesised from scratch) |
| **BIGGEST COST DRIVER** | **Lip-synced presenter seconds — $3.02 of $3.40 per video (89%).** Within it, the controllable factor is the **$0.20 per-call minimum**: naive per-segment calling costs $5.40/video instead of $3.02, a 79% penalty |

---

## 8. PRICING EVIDENCE CITED

| Claim | Evidence |
|---|---|
| LatentSync $0.20 ≤40 s, then $0.005/s | fal.ai model page cost box, `fal-ai/latentsync`: *"Your request will cost $0.2 for videos up to 40 seconds. For longer videos, you will be charged $0.005 per second of output video."* |
| LatentSync has `loop_mode: pingpong \| loop`, `seed` | fal queue OpenAPI schema, `LatentsyncInput` |
| sync-lipsync v1 $0.70/min | fal.ai model page, `fal-ai/sync-lipsync` |
| sync-lipsync v2 $3.00/min | fal.ai model page, `fal-ai/sync-lipsync/v2` |
| WaveSpeed prices are per second | wavespeed.ai model page, `sync/lipsync-2`: *"$0.05 per second of input video"* |
| WaveSpeed catalog + `base_price` (991 models) | live `GET /api/v3/models` |
| LatentSync $0.05/s on WaveSpeed; min 3 s / $0.09 | wavespeed.ai model page, `wavespeed-ai/latentsync` |
| KIE credit = $0.005 | kie.ai pricing data: *"Each credit is valued at $0.005 USD"* |
| volcengine v2v = 8 cr/s ($0.04/s), input 360p–1080p | kie.ai model page + `docs.kie.ai/market/volcengine/video-to-video-lip-sync` |
| InfiniTalk = 480p/720p only, 12 cr/s @720p, 15 s cap | kie.ai model page + `docs.kie.ai/market/infinitalk/from-audio` (`resolution` enum) |
| Kling AI Avatar Pro = 16 cr/s @1080p | kie.ai model page, `kling/ai-avatar-pro` |
| Kling 3.0 Pro no-audio = 18 cr/s ($0.09/s) | kie.ai model page, `kling-3-0` |
| Topaz image upscale = 10 cr ($0.05) ≤2K | kie.ai model page, `topaz/image-upscale` |
| `tts-1-hd` $30/1M chars; `gpt-4o-mini-tts` $0.60/1M in + $12/1M audio-out | developers.openai.com/api/docs/pricing |
| Narration seconds | Character counts from `docs/source/pilot-scripts.pdf` ÷ rates measured from the approved audition files |
| Rendering/compositing is $0 | `ffmpeg`/`ffprobe` on PATH; Remotion in `package.json` devDependencies; `remotion/IntroSegment.tsx` already loops a 10 s clip over 33 s of narration |
| Branching is data-only | `src/lib/branching/types.ts` — scene graph in data, no branching logic in components |
| HyperFrames CLI absent | not on PATH |

---

## 9. WHAT NEEDS APPROVAL — separated, as instructed

**Requires no approval — no change to Roger's experience:**
Architecture 1 in full. Every narrated second stays presenter-on-camera. No static-card substitution. Same storyboard, same structure, same 12 feedback branches, same 1080p output. This is purely a change of vendor and call-batching behind the scenes.

**Requires Roger's approval if ever adopted — listed only for completeness:**
Architecture 2b's hybrid treatment (9 wrong-answer feedback segments as title card + voiceover over exhibit stills). It is **not needed to hit the budget** and is **not recommended**. It is recorded so the option is visible and costed, not so it can be slipped in.

**Needs one line of sign-off, not an approval round:**
The presenter-master fit decision (pad vs. crop to exact 16:9). Diane is 1920×1088, Curtis and Selena 1672×941. Recommend padding. Carried forward from the readiness report.

---

## 10. WHAT I WOULD PROVE IN THE PILOT

The whole architecture rests on one unverified assumption: **that LatentSync's output quality is acceptable for a premium catalog at 1080p.** That is a quality judgement, not a number, and it should be settled before any batch commitment.

**Cost to settle it: $0.20.** One 40-second call, on the real Diane base loop, with real narration.

Gate criteria: output is exactly 1920×1080 · mouth sharpness holds against the surrounding frame at 100% zoom · no temporal flicker across 40 s · identity unchanged vs. the approved master · loop seam invisible · audio in sync throughout.

If it passes, the catalog costs **$1,090**. If it fails, fall back to Architecture 2 and either accept $2,381, or put the hybrid option to Roger to land at $1,406. Either way the decision is made for twenty cents, before anything is committed.

---

_No media generated. No purchases. No presenter, voice, or code modified. Nothing committed or pushed. Spend: $0._
