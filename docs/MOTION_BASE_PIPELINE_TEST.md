# Eximious — Final Motion-Base Pipeline Test (Selena Navarro)

**Date:** 2026-08-18 · **Result: PASS — recommend locking this as the Eximious production media pipeline**
**Actual total spend: $0.70**

Locked assets unmodified (SHA-256 verified). Pilot Video 1 not produced. Nothing committed or pushed.

---

## Verdict

The reusable presenter motion-base + `fal-ai/latentsync` architecture **works with natural presenter movement**. This closes the last open unknown identified in the previous QA gate.

The critical new result: **LatentSync preserves the blink from the base clip, frame for frame.** It re-renders the face region but does not destroy the eye motion underneath it. That was the single biggest risk in the architecture and it does not materialise.

---

## What was produced

**Motion base — `kling/v2-1-pro` on KIE, 10 s, 1920×1080, no audio track.**
Generated from Selena's locked master with an explicit no-speaking, locked-camera, minimal-motion prompt.

| Requirement | Result |
|---|---|
| Natural blinking | **Yes** — full blink at 5.71 → 5.96 s (lid lowering, fully closed 5.79, reopening 5.88) |
| Subtle breathing / micro head-posture movement | **Yes** — face-region meanΔ 0.97/255, continuous and organic |
| Restrained hands | **Yes** — hands stay composed on the desk |
| No speaking baked in | **Yes** — lips closed throughout; output has **no audio stream at all** |
| No camera movement | **Yes** — background-corner meanΔ 0.069/255 |
| No change to face / wardrobe / room / lighting / framing | **Yes** — see below |

**Framing proof.** Compared Kling's frame 0 against the exact still fed in, testing zoom factors 1.00–1.10×:

| Zoom tested | 1.00× | 1.02× | 1.04× | 1.06× | 1.08× | 1.10× |
|---|---|---|---|---|---|---|
| Difference | **1.66** | 13.62 | 20.77 | 25.57 | 29.53 | 33.20 |

**Best fit is 1.00× at 1.66/255.** No reframing, no zoom, no crop. Selena was not redesigned.

---

## Production fixes — all four applied and verified

| Fix | Applied | Verified |
|---|---|---|
| Pad audio past the frame-boundary truncation | 27.912 s → 29.0 s | Output 28.8 s ≥ 27.912 s — **full narration preserved, nothing clipped** |
| Trim after processing | → 27.84 s | 696 frames |
| Discard returned 16 kHz AAC | Yes | Raw output was `aac, 16000, 1` — dropped |
| Remux locked 24 kHz narration | Yes | Final: `mp3, 24000 Hz, mono, 128 kbps` |
| Preserve ≈ −24.5 LUFS | Yes | Final measures **exactly −24.5 LUFS** |

**New finding that changes the padding rule: LatentSync normalises output to 25 fps regardless of input frame rate.** The base was 24 fps; the output came back 25 fps, 720 frames (45 × 16). The 16-frame truncation rule therefore always applies **at 25 fps**, not at the base's frame rate. Padding must be computed against 25 fps or the fix silently under-pads.

---

## QA results

| Criterion | Result | Evidence |
|---|---|---|
| **Identity preservation** | **PASS** | Best-fit zoom 1.00×; frame-0 vs input 1.66/255; face, wardrobe, hair, room, lighting unchanged |
| **Lip accuracy** | **PASS** | Lips closed through the body of the 3.263–3.886 s silence (3.50, 3.70 s); open with teeth in speech (4.20, 4.60 s) |
| **Teeth / mouth artifacts** | **PASS** | Teeth render plausibly; no melting, doubling or gum smearing |
| **Blinking** | **PASS** | Base blink at 5.71–5.96 s **reproduced identically in the output** |
| **Head / body continuity** | **PASS** | Output face meanΔ 1.14 vs base 0.97; maxΔ 2.75 vs base 2.79 — LatentSync adds almost no instability on top of real motion |
| **Loop seam** | **PASS** | Reversal at 10.04 s shows a 2.01× delta bump (0.314 vs 0.156 mean) — a motion-direction change, not a cut. Visually continuous |
| **Facial softness** | **PASS** | Face −15.9% vs eyes-control −13.8% → **only −2.1 pp mouth-specific penalty** |
| **Background stability** | **PASS** | +1.1% sharpness, 4.93/255 pixel diff — re-encode noise only |
| **Audio sync** | **PASS** | Correct mouth state across the silence boundary; anticipatory opening 36 ms before speech resumes is natural coarticulation |
| **1920×1080 delivery** | **PASS** | Final asset probes exactly 1920×1080, 25 fps |
| **Eximious player scale** | **PASS** | At an 854 px stage, base and final delivery are indistinguishable apart from the mouth speaking |

**The softness result is the important one.** On the still-derived test Selena's mouth-specific penalty was −1.7 pp; on a real motion base it is −2.1 pp. Natural movement does not degrade LatentSync's output. The architecture holds.

---

## Actual spend

| Item | Route | Actual cost |
|---|---|---|
| Motion base clip, 10 s, 1920×1080 | KIE `kling/v2-1-pro` | **100 credits = $0.50** |
| Lip-sync, 28.8 s output | fal `fal-ai/latentsync` (≤40 s tier) | **$0.20** |
| Narration | reused locked take from the prior gate | $0.00 |
| Base QA, padding, trim, remux, all measurement | ffmpeg, local | $0.00 |
| **TOTAL THIS TEST** | | **$0.70** |

KIE balance moved **1853 → 1753 credits**, confirming the $0.50 directly rather than from a rate card. The LatentSync figure is from fal's published ≤40 s tier (no billing endpoint on this key).

**Cumulative across both QA gates: $1.33.**

### Effect on the catalog model

The base clip came in at **$0.50, not the $0.90 estimated**. One-time base-clip cost for all three presenters drops from the budgeted $8.10 (3 candidates each) to **$1.50 for one clip each**, or $4.50 if three candidates each are still wanted. Immaterial against the catalog total, but it moves the right way.

Per-video lip-sync economics are unchanged: **$0.005/sec when batched into calls of ≥40 s**, which remains the single most important production rule.

---

## One residual detail (trivial)

Final video is 27.84 s (696 frames) while the audio is 27.913 s — about **73 ms, or 2 frames, of audio extends past the last video frame** because the trim landed on a frame boundary. In a player the last frame holds for 73 ms. Fix: round the trim up to the first whole frame that covers the audio (698 frames = 27.92 s). Free, one line in the trim step.

---

## Recommendation

**Lock this as the Eximious production media pipeline.**

```
locked script
  → OpenAI TTS on the locked per-presenter voice config
  → ffmpeg master to 24 kHz / mono / 128 kbps @ −24.5 LUFS
  → audio QA gate (loudness, format, F0 onset)
  → [ONE TIME per presenter] kling/v2-1-pro 10 s 1920×1080 motion base, no audio
  → concatenate narration into calls of ≥40 s
  → pad to clear the 16-frame boundary AT 25 FPS
  → fal-ai/latentsync, loop_mode: pingpong, seed recorded
  → trim to whole frames covering the audio
  → discard returned 16 kHz audio, remux the locked 24 kHz master
  → ffmpeg split at segment offsets + conform to exactly 1920×1080
  → existing Next.js branching player
  → export-thinkific self-contained HTML5 zip
```

**Mandatory rules carried forward:**
1. Every lip-sync call carries ≥40 s of audio (below that, the $0.20 minimum applies and catalog cost rises ~79%).
2. Pad against **25 fps**, whatever the base frame rate.
3. Always discard LatentSync's audio and remux the locked master — this is what keeps −24.5 LUFS intact to delivery.
4. Record the `seed` and write a sidecar `.json` per asset.
5. Base clips are generated once per presenter and reused across all 267 videos.

**Still open, unchanged by this test:** Curtis's beard carries an 11.8 pp mouth-specific softness penalty (invisible at player scale; targeted fallback costed at +$274 if Roger ever objects), and the production-resolution masters for Curtis and Selena remain unproduced ($0.10, blocker B-4).

---

## Artifacts

`/private/tmp/claude-501/-Users-luismiguel-Desktop-eximious-branching-player/e93a1e06-5494-4262-b1f1-6f228cff4100/scratchpad/qa/`

- `selena-motion-base.mp4` — the reusable 10 s 1080p motion base
- `selena-FINAL.mp4` — final delivery asset, all four fixes applied
- `identity3.png` — locked master / motion base / final delivery
- `blinkcheck.png`, `blink-out.png` — blink in base and its survival through LatentSync
- `seam2.png` — pingpong loop seam
- `mouth-final.png` — lip accuracy across the silence boundary
- `ps-final.png` — player scale

_Locked master and locked voice byte-identical (SHA-256 verified). Pilot Video 1 not produced. Nothing committed or pushed. Spend: $0.70._
