# Cost controls

**Target: $3.40 per video · $908 for 267 · ~$1,090 at 20% revisions · ceiling $1,500 for the
whole catalog media/API spend.**

Against the $8,000 fixed contract, media/API is a small slice — but **an architecture mistake
scales by 267**, so every change gets costed before adoption.

## The model

| | Per video |
|---|---|
| TTS (OpenAI, locked voices) | **$0.23** |
| Lip-sync (`fal-ai/latentsync`, **batched**) | **$3.02** |
| Exhibit imagery (~3/video) | **$0.15** |
| Rendering, compositing, player, Thinkific export | **$0.00** |
| **Total** | **$3.40** |

One-time (production stills + motion bases) ≈ **$3–$8** across all presenters.

**Biggest cost driver: lip-synced presenter seconds — 89% of per-video spend.** Within it the
controllable factor is the **$0.20 per-call minimum**, which is why batching is worth 44% on
its own (see `../stages/06-batch-plan.md`).

## What the three pilots actually cost

| | TTS | Lip-sync | Notes |
|---|---|---|---|
| claims-01 (Diane, 22 seg) | $0.2196 | **$2.372** (4 calls) | plus v1 $2.376 + v2 $2.376 + the rejected demo-driven route ~$3.18 of **rework** |
| siu-01 (Curtis, 22 seg) | $0.2797 | **$3.0048** (6 calls) | clean run, no re-calls |
| ew-01 (Selena, 25 seg) | **$0.0059 text-in only — INCOMPLETE** | **$3.5616** (8 calls) + **$0.464 wasted** | the wasted call is the missing 0.24 s delivery pad |

**The model holds.** siu-01's $3.28 all-in and ew-01's ~$3.57 sit right on the $3.40
projection. Diane's total is far higher and **every dollar of the excess is rework** — the
blink defect and the rejected demo-driven route, not the architecture.

## Verified unit prices — checked 2026-08-18, re-verify before large runs

| Item | Price |
|---|---|
| `fal-ai/latentsync` | **$0.20 for ≤40 s, then $0.005/sec** |
| `kling/v2-1-pro` (KIE) **5 s** 1080p | **50 credits = $0.25** (measured cleanly, twice) |
| `kling/v2-1-pro` (KIE) 10 s 1080p | **100 credits = $0.50** (measured) |
| KIE credit | $0.005 |
| OpenAI `tts-1-hd` | $30.00 / 1M characters |
| **fal → MiniMax `speech-02-hd`** (Selena, from 2026-08-22) | billed **per 1,000 characters**; read `x-fal-billable-units` from the response. ew-01 v2: **9.881 units / 9,881 chars** |
| OpenAI `gpt-4o-mini-tts` *(retired for Selena 2026-08-22)* | $0.60/1M text-in + $12.00/1M audio-out ≈ $0.015/min |
| `topaz/image-upscale` ≤2K | 10 credits = $0.05 |
| `fal-ai/sync-lipsync` v1 (fallback, not approved) | $0.70 / minute |
| ffmpeg · Remotion · player · Thinkific export | **$0.00** |

**Route through fal.** The *same* models cost 2–10× more elsewhere: LatentSync is $0.005/s on
fal and $0.05/s on WaveSpeed. **Routing matters as much as model choice.**

## Three cost facts the earlier model got wrong or missed

- **`kling/v2-1-pro` is $0.25 at `duration: 5`**, not $0.50 — the $0.50 figure is the 10 s
  clip Diane used. **Read a cost figure's units before quoting it.**
- **Selena's v1 TTS spend is not recoverable from the repo.** `gpt-4o-mini-tts` bills audio-out
  tokens the script's price model never counted. Read the OpenAI billing record. **This no
  longer applies going forward** — she was recast to fal/MiniMax on 2026-08-22, and fal
  returns the billed unit count in a response header, which the script now records.
- **UNRESOLVED: 50 KIE credits went missing twice** between Selena's takes with no generation
  call in between. If that is delayed settlement, the true per-take price is **$0.50 and her
  three takes cost $1.50, not $0.75**. **Check the KIE dashboard before the next paid run.**

**No consolidated ledger exists across the three pilots.** Per-pilot figures are verified; the
all-in total is not written down anywhere and should be reconstructed once.

## The guardrails

1. **Quote before every paid call. Wait for an explicit go. One approval = one run.**
2. **Dry-run first** — every paid script takes `--dry-run`; `lipsync-batch.mjs` also takes
   `--build-only`.
3. **Pass `--max-cost` every time.** The scripts abort above the ceiling before anything is
   sent.
4. **If projected per-video spend exceeds $5.62, STOP.** The architecture has drifted.
5. **The free gates run before the paid steps.** Gate A failure stops the spend.
6. **Never re-run lip-sync for a player-side change.** UI, colour, font, captions, routing,
   scoring, packaging and layout are all **$0.00** under pipeline rule 8.
7. **Keep the raw LatentSync return until sign-off.** With it, a re-cut is $0.00. Without it,
   the same fix is ≈$2.37 — that is exactly what happened to Diane.
8. **Generate ONE motion base, QA it, buy another only if it fails.** ~1 in 4 pass. Ask "is
   the defect confined to a window?" before spending again.

## What is generated once, forever

Presenter production still · motion base · driving base. Reused across every video that
presenter fronts. A new one is required **only** if Roger changes an approved appearance —
a new approval under pipeline rule 7, not a technical decision.

## Withdrawn architectures — costed and recorded so they are not re-proposed

| Route | Catalog cost | Why it is out |
|---|---|---|
| `volcengine/video-to-video-lip-sync` (KIE) @ $0.04/s | **$6,552** | 5.2× over ceiling. The original proposal — priced lip-sync without surveying the dubbing market and assumed one call per segment |
| `fal-ai/sync-lipsync` v1, whole catalog | **$1,984** base | Quality-first fallback only |
| **Arch 2b hybrid** — 9 wrong-answer branches as title card + voiceover | $1,406 | **Changes the storyboard and needs Roger's approval.** Not needed to hit budget, not recommended. Recorded so it is visible and costed, **not so it can be slipped in** |
| KIE `infinitalk` / HeyGen | — | Permanently excluded |
| HyperFrames | — | Adds nothing. Rendering and compositing are already $0 |

**Pre-costed targeted fallback:** if Roger rejects Curtis's beard softness, route **Curtis
only** to `fal-ai/sync-lipsync` v1 → ≈ **+$274**, catalog ≈$1,364 at 20% revisions. Still
inside $1,500, nothing else changes.
