# Diane Marchetti — Presenter 1

Claims & Coverage. **Tracks 1, 4, 6, 10, 12 · 51 courses.**
Identity, visual direction and voice are **CLIENT APPROVED / LOCKED**.

## Voice recipe — locked

| Field | Value |
|---|---|
| Provider / model | OpenAI **`tts-1-hd`** |
| Voice | **`shimmer`** |
| Required settings | `speed: 1.0`, `response_format: mp3` |
| `instructions` | none — `tts-1-hd` has no such parameter |
| F0 window (Gate A) | `fmin 80`, `fmax 400` |
| **Measured chars/sec** | **15.81** (462.912 s / 7,319 chars, delivered claims-01) |
| Estimator in `scripts/tts-narration.mjs` | **15.81 — correct, matches the measurement** |

The 16.03 chars/sec pre-production estimate was within 0.15% on her. That is Diane's result
only; do not generalise it — see Selena.

**The masculine-onset defect is `shimmer`-specific.** `gpt-4o-mini-tts` was abandoned early
for a masculine→feminine onset drift on `shimmer` (fixed by commit `6692f8a`, which moved to
`tts-1-hd`). Gate A's F0-onset row exists to catch it.

## Assets on disk

| Step | File | Notes |
|---|---|---|
| Approved reference | `public/media/presenter-diane.jpg` | 1920×1088, **original dark office**. Unlike the other two this is a **production base**, not reference-only — it already meets the 1080p floor |
| Production still | `public/media/presenter-1-diane-marchetti-production-still-1920x1080.png` | exact symmetric **4 px top/bottom crop**. An internal technical conform, expressly permitted — **not** a client approval |
| Motion base | `public/media/presenter-1-diane-marchetti-motion-base.mp4` | `kling/v2-1-pro`, **10 s**, **`cfg_scale: 0.5`**, task `9a16ce87…`, **$0.50**. 1 of 4 draws passed |
| Driving base | `public/media/presenter-1-diane-marchetti-driving-base-corrected.mp4` | **99.625 s**, 2391 frames @ 24 fps, 22 joins, **13.25 blinks/min**, frame PSNR **55.64 dB**, sha `e61587b9…` |

**Superseded, never a production base:** `presenter-diane-brighter-office-approval.png` and
`presenter-diane-light-studio-approval.png`. The dark office is locked. Keep them on disk as
historical exploration only.

## Presenter-specific constraints

**Her on-disk driving base is 99.625 s, which is BELOW the 125 s chunk ceiling.** The batch
planner reads `driving_base.dur_s` and caps calls at `min(ceiling, base − ε)`, so with this
base her calls are capped at **< 99.625 s**, not 125 s. That is not a fault — it is a
smaller headroom than Curtis (142.083 s) or Selena (143.417 s), and it will produce more,
shorter calls on a long lesson.

**Her delivered claims-01 was NOT driven by that file.** The sidecars name
`scratchpad diane_drive_base2.mp4`, 480 s, 11,520 frames, 103 joins, 12.9 blinks/min,
sha `11156d1b…` — **and that file is not in the repo.** Her delivered pilot is therefore not
reproducible from tracked assets. Either rebuild an extended base from the tracked motion
base (**$0.00**, strictly additive — Curtis's v1→v2 extension kept its first 2378 frames
byte-identical), or locate the scratchpad file and store it properly. Do this before her
next production.

**Head movement is 0.42 px RMS.** She blinks and breathes but barely moves, against the
demo's 6.16. Accepted as delivered. If more liveliness is ever wanted it needs a **new**
motion base from a movement-positive prompt that still keeps the lips closed and puts a
blink inside the moving passage — a new approval under pipeline rule 7, ~$0.25–0.50.

**Her delivered segments are cut at the AUDIO ONSET, not the silence midpoint.** claims-01
predates the midpoint rule, so most of its 22 segments — including `intro`, the frame the
Start gate holds on screen — open on slightly parted lips. **Known open defect, not fixed.**
Her raw LatentSync returns were **not retained**, so the free re-cut is unavailable to her
and the fix is ≈$2.37. Every video produced from now on uses the midpoint rule
(`stages/09-split-remux-conform.md`).

**claims-01 `decision-3` carries one synthesised frame.** It was 156 frames of picture
against 6.241 s of audio, breaching the trim-UP rule, and was extended to 157 by cloning
the final frame once (`tpad=stop_mode=clone:stop=1`, 62.4 dB PSNR, in trailing silence with
the mouth closed). Recorded as synthesised. Original archived at
`public/media/claims-01-av1-v4-decision3-156f-superseded/`.

**Registry slug trap.** claims-01's lesson slug is **`claims-investigation-application-1`**,
not `claims-01-av1`. Its media, narration and test suite are keyed `claims-01-av1` but its
lesson module and slug are not. Passing the wrong one to `dump-lesson-graph.ts` fails
outright. siu-01 and ew-01 are consistent.

## Motion-base prompt notes — if a new base is ever approved

Rewrite three sentences and reuse the rest verbatim: the opening description (person and
setting), the **hands** sentence, and the set-dressing sentence.
**Diane's hands are folded and still on the desk** — write it because it is true of her
still, not as a style choice. The negative prompt is generic and reused unchanged.
She passed at **`cfg_scale: 0.5`**; escalate only against an observed failure.

Recipe: `../models/kie-kling-v2-1-pro.md`. Method: `../stages/05-driving-base.md`.
