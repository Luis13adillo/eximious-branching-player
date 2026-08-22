# Curtis Whitfield — Presenter 2

Investigation & Fraud. **Tracks 5, 7, 8, 9, 15 · 32 courses.**
Identity, visual direction and voice are **CLIENT APPROVED / LOCKED**.

## Voice recipe — locked

| Field | Value |
|---|---|
| Provider / model | OpenAI **`tts-1-hd`** |
| Voice | **`onyx`** |
| Required settings | `speed: 1.0`, `response_format: mp3` |
| `instructions` | none — `tts-1-hd` has no such parameter |
| F0 window (Gate A) | `fmin 55`, `fmax 320` — **male register; the floor must sit below Diane's or the estimator octave-doubles** |
| **Measured chars/sec** | **15.89** (586.872 s / 9,325 chars, delivered siu-01) |
| Estimator in `scripts/tts-narration.mjs` | **16.24 — STALE, 2.2% high.** Pre-production estimate, never updated after his run |

**Correct the estimator, or size his batch plan from the measured 15.89.** A 2.2%
over-estimate shortens every projected duration slightly. It is far less damaging than
Selena's 12%, but it is the same class of error.

## Assets on disk

| Step | File | Notes |
|---|---|---|
| Approved reference | `public/media/presenter-2-curtis-whitfield-master.png` | 1672×941, sha `c3226a91…`. **REFERENCE ONLY — never a production master.** Byte-identical throughout production |
| Production still | `public/media/presenter-2-curtis-whitfield-production-still-1920x1080.png` | sha `74e03fb4…`. KIE `topaz/image-upscale` **×2 → 3344×1882 → crop 1 row → lanczos to 1920×1080**, 16-bit intermediate. **$0.05** |
| Motion base | `public/media/presenter-2-curtis-whitfield-motion-base-take2.mp4` | sha `1a7740bb…`, **5 s**, **`cfg_scale: 1.0`**, **$0.25**. **PARTIAL pass — clean window is frames 41–121 only** |
| Driving base | `public/media/presenter-2-curtis-whitfield-driving-base.mp4` | **142.083 s**, 3410 frames @ 24 fps, 30 joins, **12.67 blinks/min**, frame PSNR **53.79 dB**, built from frames **41–121**. **$0.00** |

**Why ×2 then down, and not 1672→1920 directly.** 3344×1881 is exactly 16:9, so the
downscale is a uniform 0.574163× on both axes. Going straight to 1920 lands at 1081 and
forces distortion. Detail gain 2.43× whole-frame and **2.75× in the beard/mouth region** —
which is exactly where his watch item is.

**Take 1 was REJECTED** (push-in to 1.18× *and* an opening mouth) at `cfg_scale: 0.8`.
Take 2 at **1.0** fixed both and passes **11 of 12 rows** — the single failure is lips
parted with visible teeth on **frames 5–40**. **No take 3 was bought.** A partial pass is
usable when the defect is confined to a window; ask that question before spending again.

**Driving base v1 (101.9 s) is superseded** by the current v2 as a **strict extension** —
same seed, first 2378 frames byte-identical. Kept on disk as
`…-driving-base-v1-superseded.mp4`. Extending a driving base is always $0.00 and always
additive; never rebuild one from scratch to make it longer.

**Photometric correction was NOT applied and must not be.** His channel spread across the
window is 0.799/255, *below* the 1.103 RMS the clip already moves between two consecutive
frames. Correcting that would rewrite every pixel to chase a difference smaller than the
source's own noise. (Diane needed correction; Curtis does not. **Measure first.**)

## Presenter-specific exceptions

**ACCEPTED — beard softness, ~11.8 pp mouth-specific penalty.** Measurable at 2× zoom,
invisible at player scale. It is facial hair, not a lip-sync failure.
**Do not act on this unless Roger rejects it at review.** If he does, the fallback is to
route **Curtis only** to `fal-ai/sync-lipsync` v1 at $0.70/min — ≈ **+$274** across the
catalog, ≈$1,364 at 20% revisions, still inside the $1,500 ceiling, and **nothing else
changes**. See `../models/fal-sync-lipsync-fallback.md`.

**A luma-share metric cannot judge his mouth state.** Calibrated on known-open and
known-closed Curtis frames it separated them by **0.0000**. Judge by eye at 2–3.5× zoom
(Gate C), never by a pixel metric.

**siu-01 residual boundary frames on `fb-3c` and `intro`** — recorded, deliberately not
acted on, out of scope at release. No spend was authorised against it.

**siu-01's "22/22 first and last frames closed" was not re-verified** in the later ew-01
pass. If Roger raises the opening-frame finding on ew-01, re-judging siu-01's 22 by the same
method is the first thing to do — it decides whether the defect is Selena-specific or a
standard that was applied loosely.

## Motion-base prompt notes — if a new base is ever approved

Rewrite three sentences and reuse the rest verbatim. **Curtis's fingers are interlocked.**
His frame carries **Eximious lettering on a mug** that an unqualified "no text" in the
negative prompt would erase — name what must stay.
He needed **`cfg_scale: 1.0`** after failing at 0.8. The negative prompt has a documented
~500-character limit, so adding terms means dropping others: his take 2 dropped five to add
four, and only the two constraints that actually failed were strengthened.

Recipe: `../models/kie-kling-v2-1-pro.md`. Method: `../stages/05-driving-base.md`.
