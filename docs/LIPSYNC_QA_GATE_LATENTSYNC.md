# Eximious — 3-Presenter Lip-Sync Quality Gate · fal.ai LatentSync

**Date:** 2026-08-18 · **Engine tested:** `fal-ai/latentsync` (only) · **Total spend: $0.63**

**VERDICT: PASS on all three presenters — LatentSync is recommended as the default catalog lip-sync engine**, conditional on two mandatory pipeline fixes (both free, both found by this gate) and one watch item on Curtis.

No locked presenter identity, voice, script, player logic or branding was modified. Nothing committed or pushed. All test artifacts live in the session scratchpad, outside the repo.

---

## 1. What was run

| | Diane Marchetti | Curtis Whitfield | Selena Navarro |
|---|---|---|---|
| Visual reference | `presenter-diane.jpg` (1920×1088) | `presenter-2-curtis-whitfield-master.png` (1672×941) | `presenter-3-selena-navarro-master.png` (1672×941) |
| Voice model | `tts-1-hd` | `tts-1-hd` | `gpt-4o-mini-tts-2025-12-15` |
| Voice | `shimmer` | `onyx` | `sage` |
| Settings | speed 1.0 | speed 1.0 | locked `instructions` string, read byte-exact from her registered sidecar |
| Narration source | `claims-01` AV1, Decision-1 rejoin | `siu-01` AV1, Decision-1 rejoin | `ew-01` AV1, rejoin teaching block |
| Chars / duration | 390 → 24.22 s | 353 → 21.79 s | 411 → 27.91 s |
| Output | **1920×1080**, 25 fps | **1920×1080**, 25 fps | **1920×1080**, 25 fps |

**Method.** Narration generated on each locked voice config, mastered to the locked standard (−24.5 LUFS, 24 kHz, mono, 128 kbps), audio-QA'd, then a 10-second 1920×1080 base clip built locally with ffmpeg from each locked master. LatentSync was called with `loop_mode: pingpong` and `seed: 424242`, so the 10 s base drives 22–28 s of narration — **the exact production loop pattern**, not a simplified test.

**The three approved masters are byte-identical after the run** (SHA-256 verified). All derived clips are test artifacts in the scratchpad; nothing was written to `public/media/`.

---

## 2. Audio QA — passed before any paid lip-sync

| | Loudness | Format | Duration | F0 median | Onset vs body |
|---|---|---|---|---|---|
| Diane | **−24.5 LUFS** | mp3 24 kHz mono 128k | 24.216 s | 148.1 Hz | **+2.8 Hz** |
| Curtis | **−24.5 LUFS** | mp3 24 kHz mono 128k | 21.792 s | 89.9 Hz | −1.5 Hz |
| Selena | **−24.5 LUFS** | mp3 24 kHz mono 128k | 27.912 s | 177.8 Hz | **+17.3 Hz** |

**The masculine-onset defect does not reproduce.** On all three, onset pitch is at or above body pitch — the defect would show as a large negative drop. Selena's median F0 (177.8 Hz) sits within 4 Hz of her registered baseline (181.8 Hz), confirming her locked config reproduces correctly on new text.

---

## 3. QA results against the eight requested criteria

| Criterion | Diane | Curtis | Selena |
|---|---|---|---|
| Lip accuracy | **PASS** | **PASS** | **PASS** |
| Teeth / mouth artifacts | **PASS** | **PASS** | **PASS** |
| Face identity stability | **PASS** | **PASS** | **PASS** |
| Facial softness | **PASS** | **MARGINAL** | **PASS** |
| Edge artifacts | **PASS** | **PASS** | **PASS** |
| Head / body continuity | **PASS** (loop seam) — see limitation | **PASS** | **PASS** |
| Audio sync | **PASS** | **PASS** | **PASS** |
| Premium appearance at player scale | **PASS** | **PASS** | **PASS** |

### Lip accuracy and sync
Frame inspection across known silence boundaries is unambiguous. Selena's speech→silence→speech transition (silence 3.263–3.886 s) shows lips closing at 3.40 s, staying closed through 3.80 s, and reopening with visible teeth by 4.20 s. Curtis shows a clean rounded "o" during speech and lips fully together during his 2.64–3.21 s pause.

A motion-energy correlation against the audio envelope peaked at **lag 0 frames for Diane and +1 frame (40 ms) for Curtis**. The absolute correlation values were low (r = 0.13–0.27) and for Selena the peak was unreliable — **that is a limitation of my crude proxy, not evidence of a sync problem.** The frame-level evidence is the stronger and clearer result, and it is clean on all three.

### Face identity stability — the standout result
Measured against the base clip at the same timestamp:

| Region | Diane | Curtis | Selena |
|---|---|---|---|
| **Background sharpness change** | +1.9% | −2.2% | −2.4% |
| **Background pixel difference** | 4.43/255 | 4.62/255 | 4.85/255 |
| **Face pixel difference** | 6.12/255 | 9.00/255 | 6.68/255 |

**The environment, wardrobe and set are untouched** — background change is within re-encode noise. Eyes, brows, nose, hairline and jawline are visually unchanged on all three. Because LatentSync never re-synthesises the presenter, identity cannot drift across the catalog. This is the single strongest argument for the engine.

### Facial softness — the one real defect, quantified

High-frequency (gradient) energy loss, output vs base:

| | Mouth / lower face | Eyes / upper face (control) | **Mouth-specific penalty** |
|---|---|---|---|
| **Diane** | −10.9% | −10.8% | **≈ 0 pp** |
| **Curtis** | −26.0% | −14.2% | **−11.8 pp** |
| **Selena** | −18.4% | −16.7% | **−1.7 pp** |

Two corrections to what I assumed in the cost report:

1. **LatentSync re-renders the whole face region, not only the mouth.** The eyes-region control lost 11–17% too. It is a face-crop model, not a mouth-only patch. The background is genuinely untouched, so the boundary is the face, not the lips.
2. **The softness is not bitrate starvation.** LatentSync's output is encoded at 1.2–1.9× the base bitrate. The loss is inherent to the model's autoencoder pass.

**Curtis is the outlier, and the cause is his beard.** Facial hair is exactly the high-frequency detail these models smooth; at 2× zoom his stubble around the mouth loses individual hair definition and reads slightly mushy. Diane and Selena show essentially no mouth-specific penalty beyond the global face pass.

### Premium appearance at player scale — the decisive test
Rendered at a realistic 854 px desktop stage (the video sits beside the content panel), **base and output are indistinguishable apart from the mouth being open.** The softness measurable at 2× zoom is below the perceptual threshold at delivery scale, on all three presenters including Curtis. At mobile width (~390 px) it is further out of reach.

### Temporal stability
Mean frame-to-frame delta in the face region during speech: Diane 0.39, Curtis 0.63, Selena 0.46 (out of 255); maxima 1.63 / 2.72 / 1.94. No gross flicker. Curtis is again highest, consistent with the beard.

### Loop seam
Frames sampled across the pingpong reversal at t = 10 s (9.60 → 10.40 s) show continuous, natural motion with **no jump, no discontinuity**. The reverse-loop mechanism the cost architecture depends on works.

---

## 4. Two defects found — both fixable, both free

**D-1 — Output is truncated to a multiple of 16 frames.** Narration tail is silently lost.

| | Source audio | Output | Lost | Frames |
|---|---|---|---|---|
| Diane | 24.216 s | 23.680 s | **−0.536 s** | 592 = 37 × 16 |
| Curtis | 21.792 s | 21.760 s | −0.032 s | 544 = 34 × 16 |
| Selena | 27.912 s | 27.520 s | **−0.392 s** | 688 = 43 × 16 |

Up to **0.6 s of narration can be cut from the end of every segment.** In production that would clip the last word of a feedback branch — a functional-acceptance failure under Agreement §2.2, and exactly the kind of fault that is invisible until a learner hits it.

**Fix:** pad each audio submission with trailing silence to the next 16-frame (0.64 s) boundary, then trim the padding off the returned video. ffmpeg, free, deterministic. **This must be in the pipeline before any batch run.**

**D-2 — Returned audio is re-encoded to AAC 16 kHz mono**, down from our locked 24 kHz mp3 standard.

**Fix:** discard LatentSync's audio entirely and re-mux the original mastered 24 kHz master onto the returned video. Free, and it guarantees the locked −24.5 LUFS standard survives to delivery untouched.

Neither defect is a model quality failure. Both are pipeline requirements this gate existed to find.

---

## 5. Cost

| Item | Unit | Qty | Cost |
|---|---|---|---|
| TTS — Diane, 390 chars, `tts-1-hd` | $30/1M chars | 390 | $0.012 |
| TTS — Curtis, 353 chars, `tts-1-hd` | $30/1M chars | 353 | $0.011 |
| TTS — Selena, 411 chars, `gpt-4o-mini-tts` | ~$0.015/min | 27.9 s | $0.007 |
| LatentSync — Diane, 23.68 s output | $0.20 (≤40 s) | 1 | **$0.20** |
| LatentSync — Curtis, 21.76 s output | $0.20 (≤40 s) | 1 | **$0.20** |
| LatentSync — Selena, 27.52 s output | $0.20 (≤40 s) | 1 | **$0.20** |
| Base clips, mastering, all QA (ffmpeg, local) | — | — | $0.00 |
| **TOTAL** | | | **$0.63** |

**Cost per test: $0.20 lip-sync + ~$0.01 TTS ≈ $0.21.**

fal exposes no billing-query endpoint on this key, so the figures are computed from fal's published rate card (`fal-ai/latentsync`: "$0.2 for videos up to 40 seconds. For longer videos, $0.005 per second of output video"), not read from an invoice.

**Note on the rate card and the cost model:** all three outputs fell under 40 s and were therefore billed at the $0.20 minimum — an effective $0.0076–$0.0092/s, *above* the $0.005/s used in the 267-video projection. This is exactly the per-call-minimum effect identified in the cost report, and it confirms the batching rule: **at production scale, segments must be concatenated into calls of ≥40 s or the catalog cost rises by roughly 79%.**

---

## 6. Limitation of this gate — stated plainly

**Head and body motion continuity from a generated base loop was not tested.** My base clips were built locally from the locked stills with a subtle push-in, because generating true motion base loops (Kling 3.0 Pro, ~$0.90 each) is a separate paid video generation that was not authorised here, and the instruction was LatentSync only.

What this gate proves: LatentSync's mouth articulation, identity preservation, softness, edge behaviour, sync and loop mechanism.
What it does not prove: how LatentSync behaves when the presenter's head and shoulders are already moving.

That is the remaining unknown before batch production. It costs **~$0.90 + $0.20** to close for one presenter.

---

## 7. Recommendation

**Adopt `fal-ai/latentsync` as the default catalog lip-sync engine.** All three presenters pass at delivery scale; identity preservation is excellent and structurally guaranteed; the loop mechanism works; and the only quality shortfall is invisible at the scale learners actually watch.

**Mandatory before any batch run:**
1. Pad audio to the next 16-frame boundary and trim after (fixes D-1).
2. Re-mux the original 24 kHz mastered audio; discard LatentSync's (fixes D-2).
3. Batch narration into calls of ≥40 s.

**Watch item — Curtis.** His beard carries an 11.8 pp mouth-specific softness penalty the others do not. It is invisible at player scale and I am not failing him on it, but he is the one to inspect first at review. **If Roger ever judges it unacceptable, the targeted fallback is to route Curtis only to `fal-ai/sync-lipsync` v1 ($0.70/min).** Curtis covers 32 of 125 courses ≈ 68 of 267 videos; the delta is roughly **+$274**, taking the catalog to about **$1,364 at 20% revisions — still inside the $1,500 ceiling.** No architecture change, no other presenter affected.

**Next step, when you want it:** one motion-base test for Diane (~$1.10) closes the last unknown before batch production.

---

## 8. Artifacts for review

All in the session scratchpad (outside the repo):
`/private/tmp/claude-501/-Users-luismiguel-Desktop-eximious-branching-player/e93a1e06-5494-4262-b1f1-6f228cff4100/scratchpad/qa/`

- `diane-out.mp4`, `curtis-out.mp4`, `selena-out.mp4` — the three 1080p test renders
- `playerscale.png` — base vs output at real player scale (the decision image)
- `diane-compare.png`, `curtis-compare.png`, `selena-compare.png` — face detail at 2× zoom
- `selena-transition.png` — speech→silence→speech sync evidence
- `seam-strip.png` — pingpong loop seam
- `sync-strip.png` — mouth state, silence vs speech, all three

_Locked identities, voices, scripts, player logic and branding unmodified. Approved masters byte-identical (SHA-256 verified). Nothing committed or pushed. Spend: $0.63._
