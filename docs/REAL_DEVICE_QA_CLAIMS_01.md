# CLAIMS-01 AV1 — Real-device QA log

Interactive Video Production Guidelines §04 requires that real-device testing
record **device, browser, viewport, defects and final disposition**. This is that
record for `EA_claims-01_AV1`.

Package under test: the assembled Thinkific HTML5 package, served over the LAN
as a plain static site (no Next.js server involved) — i.e. the deliverable
itself, not the development app.

---

## Final disposition — Stage 2 SHIPPED 2026-08-19

**This log is closed except for R1-5 (iOS audio).** The blink fix was not merely
proposed: it was built, executed and QA-passed on 2026-08-19.

| | |
|---|---|
| Stage 1 — corrected driving base | **Complete.** `presenter-1-diane-marchetti-driving-base-corrected.mp4`, built with ffmpeg from approved frames, **$0.00** |
| Stage 2 — re-run LatentSync | **EXECUTED 2026-08-19 ~17:28**, same 8 batched calls, same seed `20260818`, **$2.376 actual** |
| Delivered assets | **22/22 segments regenerated** at `public/media/claims-01-av1/`; all 22 sidecars name the corrected driving base (sha256 `e61587b9…`) and all 22 carry a `request_id` |
| Stage 2 QA | **22/22 PASS** on every check — see §Stage 2 QA |
| Blink rate | **48.9/min → 13.3/min**, irregular 1.62–8.33 s gaps, **0 reversed blinks**, no repeating pattern |
| v1 | archived byte-identical, 88 files, at `public/media/claims-01-av1-v1-superseded/` |
| Defects R1-1 / R1-2 / R1-3 | **FIXED and delivered** |
| Defect R1-4 | **VERIFIED non-interactive**, no change needed |
| Defect R1-5 (iOS Safari opening audio) | **OPEN — deliberately not acted on.** The only item still outstanding |

No client approval was needed for the fix: the corrected base is the same approved
pixels in a different order, so Diane's appearance is unchanged.

**Nothing here is awaiting a go-ahead.** Stage 2 already ran.

---

## Round 1 — 2026-08-19, Luis

| | |
|---|---|
| Devices | Samsung Galaxy S24 Ultra (Chrome) · older iPhone (Safari) |
| Serving | LAN static server, HTTP byte-range enabled |
| Scope | Full lesson walkthrough, portrait |

### Defects raised

| # | Defect | Severity | Disposition |
|---|---|---|---|
| R1‑1 | Diane appears to blink too frequently | **High** — presenter realism, affects all 267 | **FIXED and delivered (2026-08-19).** 22/22 replacement segments pass; 13.3 blinks/min, irregular, none reversed. Spend $2.376. |
| R1‑2 | "Are you still there?" fired on a scene counter, not on real inactivity | Medium | **FIXED.** Now a true inactivity timer, 120 s, max once per video. |
| R1‑3 | `Adjusting → Investigation → SIU` cramped / awkward arrow placement on a phone | Medium | **FIXED.** Card now stacks one stage per row below a 448 px container with the connector centred between rows. |
| R1‑4 | Evidence inventory might read as clickable | Low | **VERIFIED non-interactive**, no change needed. See §Evidence inventory. |
| R1‑5 | Opening audio did not play on the older iPhone / Safari | **OPEN** | **NOT DIAGNOSED. NO PRODUCTION CHANGE MADE.** See §iOS audio. |

---

## iOS audio — OPEN

| | |
|---|---|
| Works | Samsung Galaxy S24 Ultra · Chrome — audio plays |
| Fails | Older iPhone · Safari — opening audio did not play |
| Status | **Open observation. Deliberately not acted on.** |

One older handset is not enough to change production audio logic. iOS gates
autoplay on a user gesture, and the player's design is that the learner's first
interaction anywhere unlocks sound for the rest of the lesson — a behaviour that
differs across iOS versions and with Low Power Mode, silent-switch state and
per-site Safari auto-play settings.

**Required before any change:** a second test on a current iOS Safari, recording
iOS version, device, Low Power Mode state, ringer/silent switch position, and
whether audio starts after the first deliberate tap. Only then is it clear
whether this is a player defect, an OS-version behaviour, or device state.

---

## Blink analysis — root cause

> **This section replaces an earlier version of itself.** The first pass measured
> mean luminance in a FIXED box on the face. That box measures head drift, not
> eyelids — this motion base translates the face by up to 26 px across its five
> seconds, which swamps the eyelid signal. Every number it produced was wrong,
> including the headline rate and the "forward repeat, not pingpong" finding.
> The measurements below are re-derived and each one is tied to evidence that
> does not depend on a detector.

### Method

Three independent methods, deliberately overlapping:

1. **Ground truth by eye.** Frame-by-frame contact sheets of the eye region of
   the motion base, all 121 frames. Blinks are counted by looking at them.
2. **Motion-tracked detector.** Track the face each frame (integer search
   minimising mean-abs-difference against frame 0 over two patches that contain
   no eyes — brow ridge and nose/cheek), crop both eye apertures at the tracked
   offset, and take the mean-abs-difference against the previous frame's tracked
   crop. A blink is the fastest thing that ever happens in the eye region, so it
   is a sharp isolated spike. *Validated against 1:* the four true onsets score
   36.2, 31.1, 25.5, 33.5 — the four largest values in the whole clip; the
   largest non-blink value is 15.2. No misses, no false positives.
3. **Driving-frame recovery.** LatentSync only regenerates the mouth, so for
   each delivered frame the driving frame it came from is the base frame that
   minimises whole-frame difference with the mouth masked out. This recovers the
   exact driving index sequence with no thresholds involved.

### What the motion base actually contains

`presenter-1-diane-marchetti-motion-base.mp4` — 121 frames, 5.04 s, 24 fps.

| Blink | Frames | Onset |
|---|---|---|
| 1 | 13–18 | 0.542 s |
| 2 | 34–38 | 1.417 s |
| 3 | 56–59 | 2.333 s |
| 4 | 105–110 | 4.375 s |

**Four blinks in 5.04 s = 47.6 blinks/min, in the source itself.**

The clip also has two distinct halves: frames 0–60 are a one-way settling drift
(the head moves into position and never returns), frames 60–120 are the settled
on-camera pose.

### What the delivered segments do with it

Driving-frame recovery on `rejoin-2.mp4` shows the driving index climbing
0→~106, then descending ~106→0, then climbing again — period 240 frames.
**It is pingpong, and the sidecars are correct.** (The earlier claim of a
forward repeat was an artefact of the broken metric.)

Measured on the delivered segments:

| Clip | Duration | Blinks | Rate |
|---|---:|---:|---:|
| `intro` | 8.88 s | 8 | 54.1/min |
| `assignment-1` | 32.08 s | 26 | 48.6/min |
| `resolution-1` | 31.96 s | 26 | 48.8/min |
| `fb-2a` | 33.04 s | 26 | 47.2/min |
| `rejoin-2` | 38.80 s | 32 | 49.5/min |
| **Overall** | **144.76 s** | **118** | **48.9/min** |

Every segment shows the same gap sequence, on repeat:

```
0.92  0.88  1.08  0.88  0.92  2.04  1.32  2.04   ->  sums to 10.08 s
```

That is the pingpong period: 4 blinks on the forward leg, 4 on the reverse leg,
every 10 seconds, for the whole video.

### The cause — three findings, not one

1. **The motion base blinks 47.6 times a minute.** This is the primary defect
   and it is upstream of everything. Cause **(a)**, the reusable motion base.
2. **The pingpong loop repeats those four blinks every 10 s** on a fixed beat a
   viewer can count. Cause **(c)**, the loop.
3. **Half of every delivered blink plays BACKWARDS.** On the reverse leg of the
   pingpong the lid opens slowly and snaps shut — the opposite of how a blink
   moves. 40 of every 80 blinks. This was not in the earlier analysis at all.

LatentSync is not at fault and neither is the compositing: both faithfully
reproduce what the driving video does.

For scale — the approved pre-production demo (`intro-appvideo-v1.mp4`, counted
frame by frame, not by detector) blinks 4 times in 8.08 s = **29.7/min**, with
irregular gaps of 1.36 / 1.96 / 3.64 s and none reversed. Normal for someone
speaking to camera is roughly 15–20/min.

### The correction — built, $0.00 spent

`diane-driving-base-corrected.mp4` — 2391 frames, 99.62 s, 24 fps, 1920×1080,
silent. Built with ffmpeg from the approved base. **Every output frame is a
bit-exact copy of a frame of the approved base; only the order changes.** No
regeneration, no filtering, no upscale, no new Kling call, no new TTS.

Construction:

- **Only the settled region (frames 60–120) is used.** It holds exactly ONE
  blink (105–110), so blink density becomes a free parameter instead of being
  fixed at 4-per-5-seconds. The settling drift at 0–60 is discarded: it carries
  three of the four blinks and cannot be revisited without a visible pose jump.
- The output is a **continuous walk** along the source frame index — every step
  is ±1 — so there is no cut inside a move. Blink-free time is made by wandering
  inside frames 60–104 with varied turn points; direction runs are 12–55 frames
  (0.50–2.29 s), never shorter, so turns read as the head settling.
- **Blinks are only ever entered travelling forward.** Verified structurally:
  22 traversals, every one exactly `[105,106,107,108,109,110]`, zero entered
  backwards.
- Returning from the blink to the working range uses **one join per blink**,
  chosen from the most similar frame pairs in the entire clip and varied so no
  two blinks are surrounded by the same frames.

Join visibility, measured as whole-frame RMS:

| | RMS |
|---|---:|
| Two *genuinely consecutive* frames of the approved base — median | 0.728 |
| Same — 95th percentile | 1.494 |
| Same — **maximum** | **2.045** |
| The 22 joins in the corrected base — mean | 1.330 |
| The 22 joins — **maximum** | **1.675** |

Every join is a smaller visual step than steps the approved base already takes
between two of its own consecutive frames; 3 of the base's 120 consecutive-frame
steps are larger than the largest join. For comparison, a plain forward loop
would wrap f120→f0 at RMS 9.233 — 4.5× the source's largest genuine step.

Result:

| | Now (shipping) | Corrected |
|---|---:|---:|
| Blinks | 80 in 99.6 s | 22 in 99.6 s |
| Rate | 48.2/min | **13.3/min** |
| Gaps | 0.88–2.05 s | **1.6–8.3 s** |
| Repeating pattern | every 10.0 s | **none** |
| Blinks played backwards | 40 of 80 | **0** |

Encode fidelity against the exact re-ordered approved pixels: PSNR average
55.64 dB (Y 54.74, min 52.91), using the same `libx264 -preset slow -crf 12`
settings the approved base itself was encoded with.

### Cost to finish — projected before Stage 2 (actual matched exactly)

This was the estimate written before the re-run. **It was executed on 2026-08-19 and
the actual spend was identical — $2.376.** Kept as the projection of record; the
executed run is in §Stage 2 below.

| Step | Cost |
|---|---:|
| Corrected driving base (ffmpeg, approved frames) | **$0.00 — done** |
| New Kling motion base | **not needed** |
| New TTS narration | **not needed** |
| Re-run LatentSync, the same 8 calls, same batching, same seed | **$2.376** |
| Re-split / remux / conform / delivery QA gate | $0.00 |
| **Total** | **$2.376** |

The corrected base is 99.6 s, longer than the longest call (85.12 s), so
**LatentSync never loops it** — which removes the repeating pattern and the
reversed blinks structurally, not just statistically.

Diane's appearance is unaffected: the driving frames are the same pixels in a
different order, so this needs no new client approval.

### Stage 2 — executed 2026-08-19

The same 8 LatentSync calls, re-run against the corrected driving base. Same
model, same seed (20260818), same batching, same locked audio masters, same
split offsets. Only the driving video changed.

**Actual spend: $2.376.** Identical to the original run. The longer driving base
does not raise the bill — the 2491-frame pass is face-detection preprocessing;
billed inference runs over the audio length only (verified on the canary: 1152
frames returned for 46.08 s of audio). It does cost wall clock: 442 s for the
canary against a faster original.

| Call | Request ID | Frames | Cost |
|---|---|---:|---:|
| 1 | `01a01b25-874c-7e83-870a-36094c0fdd1c` | 1440 = 90×16 | $0.288 |
| 2 | `01a01b25-872b-7513-b3af-96b4e839af94` | 1408 = 88×16 | $0.282 |
| 3 | `01a01b25-8749-79a0-9f38-8a4cf8a966bf` | 1328 = 83×16 | $0.266 |
| 4 | `01a01b25-8757-7132-abbd-a11542d64a55` | 1488 = 93×16 | $0.298 |
| 5 | `01a01b25-8748-7aa3-a23e-3759a073ec2e` | 1264 = 79×16 | $0.253 |
| 6 | `01a01b1a-bd72-7491-a3a3-53b0e96c2830` | 1152 = 72×16 | $0.231 |
| 7 | `01a01b25-8750-76d3-9377-44485c2d0ad7` | 1632 = 102×16 | $0.326 |
| 8 | `01a01b25-8757-7132-abbd-a0fe143a2a9e` | 2128 = 133×16 | $0.426 |

Every call satisfied `returned == blocks × 16`.

**Incident.** A local DNS failure (`ENOTFOUND queue.fal.run`) killed all seven
pollers at once while the jobs kept running. Nothing was lost and nothing was
double-spent: request IDs are now written to disk at submit time, so a dead
poller reattaches instead of resubmitting. This closes the gap the original
sidecars had to record (`request_id: null`, lost to a tail pipe). Downloads were
moved to curl with retries — node's `fetch` hangs indefinitely with no timeout.

### Stage 2 QA — 22/22 PASS

| Check | Result |
|---|---|
| Dimensions | 22/22 exactly 1920×1080 |
| Frame rate | 22/22 exactly 25/1 |
| Frame counts | 22/22 match the plan exactly |
| Video ≥ audio | 22/22 |
| Audio stream | 22/22 `mp3, 24000, 1, 128000` |
| Loudness | 22/22 at −24.5 LUFS |
| Audio is the locked master | 22/22 exact — decoded PCM identical; LatentSync's aac 16 kHz discarded (rule 4) |
| Segment boundaries | 22/22 cut at the recorded offsets, same durations as v1 |
| **Planned blinks delivered** | **103/103**, zero missed |
| Blink rate | **13.3/min** aggregate (was 48.9/min) |
| Blink spacing | 1.62–8.33 s, median 4.04 s, sd 1.95 s (was a fixed 10.0 s repeat) |
| Reversed blinks | **0** — structural proof, plus three frame-by-frame confirmations |
| Articulation | at parity with v1 (1.28× vs 1.30× mouth motion, speech vs pauses) |
| Identity | uniform across all 22, no outliers |
| Delivery-encode fidelity | 53.55–54.64 dB PSNR vs the LatentSync return |
| Approved masters | all three byte-identical |
| Unit tests | 179/179 |
| App regression | 212/212 |
| Package regression | 212/212 |

**Blink measurement note.** The predictive test is the load-bearing one: each
segment's expected onsets are derived from the driving-base frame plan plus its
batch offset *before* measuring. All 103 landed within 0.10 s. The detector also
reports ~31 extra onsets across the 22 files; three were checked frame by frame
in three different calls (rejoin-2 f195, resolution-3 f144, assignment-2 f85–92)
and the eyes are open in every one. They are tracking jitter at the low
threshold this low-motion footage produces, not blinks.

**Two measurements that did NOT work**, recorded so they are not repeated:
driving-index recovery jitters ±3 frames in the settled region and reported 103
reversed blinks in files that structurally contain zero; and correlating mouth
motion against the audio envelope returns r≈0.15 for the shipping files too, so
it cannot grade lip-sync. Both were replaced — reversal by blink *shape* with the
v1 files as a positive control, articulation by mouth motion during speech versus
during pauses.

### Delivery encode — deviation, flagged

Delivered segments are re-encoded at **crf 17** (was ~3.17 Mbps). The v1 files
were encoded above their own source rate: the LatentSync return is 2.14 Mbps and
v1 stored it at 3.17 Mbps, spending package size on nothing. Measured against the
return: crf 19 → 53.3 dB, crf 17 → 54.4 dB, crf 15 → 55.3 dB. crf 17 gives
2.28 Mbps — essentially the source's own rate, visually transparent.

Consequence: the 22 segments drop 196.3 MB → 145.0 MB, and the package drops
**197.3 MB → 146.0 MB** (188.2 → 139.2 MiB). Upload zip: **145.5 MB**, against
Thinkific's 200 MB ceiling — headroom goes from ~3 MB to ~54 MB.

### Superseded files

v1 segments are preserved byte-identical at
`public/media/claims-01-av1-v1-superseded/` (88 files). Every v2 sidecar records
`revision.supersedes` and `revision.supersedes_sha256`.

**Repository status: not committed, not pushed** (verified 2026-08-19 — this doc and
`public/media/**` are untracked on `main`). This is a working-tree state only; it does
not qualify the delivery above, which is produced and QA-passed on disk.

---

## "Are you still there?" — the timer rule (FIXED)

1. One timer counts down **120 s** from the learner's last interaction.
2. **Any** of `pointerdown` / `keydown` / `input` anywhere inside the player
   restarts it: play/pause, seeking, answer selection, retry, continue, exhibit
   tabs, captions, volume, fullscreen, keyboard shortcuts. Listeners are attached
   at the player root in the capture phase, so nothing can swallow the signal.
3. Media playing on its own does **not** restart it. Watching without touching
   anything is exactly the state a presence check exists to catch.
4. On expiry: the prompt opens, media pauses, progress is blocked until
   acknowledged. Acknowledging resumes only what was actually playing.
5. It fires at most **once per video** (`maxPerVideo: 1`, client-approved). After
   that the timer is never re-armed.
6. Restarting the case starts a new run and restores the budget.
7. It never arms once the lesson is complete.

**Why 120 s:** the longest delivered segment in this pilot is 38.8 s, so a
learner actually working the case interacts at least every ~40 s. 120 s is three
of those windows — long enough that it cannot interrupt someone engaged, short
enough to catch someone who walked away mid-segment.

---

## Evidence inventory — confirmed non-interactive

It is informational and stays informational. Verified in-browser against the
rendered component, not by reading the source:

| Check | Result |
|---|---|
| `button`, `a[href]`, `input`, `select`, `textarea`, `[role=button|tab|checkbox|option]`, `[onclick]`, `[tabindex]` inside the card | **0** |
| Elements with `cursor: pointer` | **0** |
| Keyboard-focusable elements | **0** |
| Item markup | plain `<li>` inside `<ul>` |
| Appearance change on hover (background / border / transform) | **none** |
| Effect of clicking an item | **none** — player state unchanged |

Nothing in it presents a selection affordance. No change made.
