# CLAIMS-01 AV1 — Real-device QA log

Interactive Video Production Guidelines §04 requires that real-device testing
record **device, browser, viewport, defects and final disposition**. This is that
record for `EA_claims-01_AV1`.

Package under test: the assembled Thinkific HTML5 package, served over the LAN
as a plain static site (no Next.js server involved) — i.e. the deliverable
itself, not the development app.

---

## Final disposition — Stage 2 SHIPPED 2026-08-19

> **SUPERSEDED — read §v4 RELEASE at the end of this file for what actually ships.**
> This section describes the **v2** package and the round 1 that was run against it on
> 2026-08-19. The delivered media has been fully replaced since (v3 demo-driven, rejected
> → v4 purpose-made non-speaking base) and the package has been rebuilt and renamed
> `EA_claims-01_AV1`. Round 1 below does **not** transfer to v4.

**This log was closed except for R1-5 (iOS audio) at v2.** The blink fix was not merely
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

---

# v4 RELEASE — 2026-08-21

**This log is no longer closed at Stage 2.** Everything above describes the **v2** package
that round 1 was run against on 2026-08-19. The delivered media has since been replaced
(v3 demo-driven, rejected → v4 purpose-made non-speaking base), and the package has been
rebuilt and renamed to the contractual name. This section is the record for what actually
ships.

## Final disposition — v4

| | |
|---|---|
| Status | **RELEASED FOR DELIVERY 2026-08-21 by Luis.** Both deliverables built and named per spec; functional acceptance 18/18 against the assembled package. Real-device round 1 on v4 is **deferred, not waived** — see §Deferred at release (v4). |
| Package | **BUILT 2026-08-21** — `EA_claims-01_AV1`, 110.4 MB, zip **115.2 MB**, 26 files, `index.html` at the archive root. Well under Thinkific's 200 MB ceiling |
| Package SHA-256 | `7cacea398fabd6f3ba90e706dc3cd8524275268ac1f9e47d64dbc5905551d206` |
| Source deliverable | **BUILT 2026-08-21** — `EA_claims-01_AV1_source.zip`, **204.8 MB**, 154 files. Agreement §2.3.1. Asserted to carry no confidential material, and independently re-checked |
| Source SHA-256 | `61006c5cfe291f3a0de22fa01d9209cd119507272f6da643287788b23255569c` |
| **Gate D functional acceptance (A §2.2)** | **PASS — 18/18**, driven through a real browser against the assembled package. First Gate D run on this pilot |
| Delivery-record integrity | **RESTORED — 22/22.** See §Sidecar records restored |
| `decision-3` frame shortfall | **FIXED — $0.00.** See §decision-3 |
| Segments delivered | **22/22** — `public/media/claims-01-av1/`, 463.32 s (7.72 min) |
| Masters byte-identical after packaging (rule 6) | **PASS — 316/316 files checksummed, 0 changed** |
| Packaged audio identical to locked master (rule 4) | **PASS — 22/22** |
| Packaged video 1920×1080 / 25 fps (rule 5) | **PASS — 22/22** |
| Unit tests | **474 passed / 1 skipped / 0 failed** (was 452 passed / 22 failed) |
| Real devices on v4 | **DEFERRED at release — not run.** See §Deferred at release (v4) |
| Thinkific upload | **NOT YET DONE** — true of all three pilots |
| Spend this release | **$0.00** |

---

## Sidecar records restored — 22/22

The v4 delivery legitimately replaced each segment's provenance sidecar, but the writer
that produced them dropped `video_dur_s`, `frames`, `video_start_s` and `align_err_ms` from
the `split` block. This was **not corruption and not a media defect** — the delivered files
were fine; the record of them was incomplete. The visible symptom was **22 failing tests**
in `claims-01-av1.test.ts:59`, all on `split.video_dur_s` being `undefined`.

All 22 were re-measured with `ffprobe` **against the actual v4 mp4s on disk** and rewritten.
The committed v3 values were deliberately *not* restored: those describe different files at
different batch offsets (v3 `decision-3` sat at batch offset 39.284 s, v4 at 56.192 s).

Semantics of the restored fields, recovered from the last-committed record and re-derived:

- `video_start_s` — the batch offset snapped **down** to the 25 fps frame grid.
- `align_err_ms` — that snap, `video_start_s − batch_start_s`. Always ≤ 0, so a cut never
  starts late. Range across the 22: 0 to −32 ms.
- `frames`, `video_dur_s` — **measured**, not derived.

Measuring rather than deriving mattered. A frame-grid formula reproduced 20 of the 22 files
exactly and disagreed on two. One of those (`fb-3d`, 506 frames vs a derived 507) is **not**
a defect — the file covers its audio and the narration already declared 20.24 s; the formula
simply rounds from nominal narration length rather than the delivered stream. The other was
a real defect:

## decision-3 — one frame short, fixed at $0.00

| | |
|---|---|
| Symptom | 156 frames = **6.240 s** of picture against **6.241 s** of embedded audio. Video did not cover audio, breaching the locked rule that trims *up* a frame. Narration and captions both already declared **6.28 s** (157 frames) |
| Fix | Extended to **157 frames / 6.280 s** by cloning the delivered final frame once (`tpad=stop_mode=clone:stop=1`), re-encoded with the delivery pipeline's own settings, then remuxed against the **original** audio with `-c:a copy` |
| Synthesised? | **Yes, explicitly.** Frame 156 is a hold on frame 155, not footage LatentSync produced. It sits in the trailing silence after the last narrated word with the mouth already closed. 62.4 dB PSNR against the frame it repeats |
| Audio | **Byte-identical** — audio-stream sha256 `a66fa961…` before and after |
| Retained picture | Frames 0–155 are a second h264 generation at **53.4 dB** average PSNR — visually lossless, and far smaller than the 1.9 Mbps re-encode the package applies anyway |
| Cost | **$0.00.** The alternative — regenerating so the frame is genuine — was costed at **≈$2.37** and not taken |
| Approval | Luis, 2026-08-21, having been told plainly that it synthesises a frame |
| Superseded original | Archived byte-identical at `public/media/claims-01-av1-v4-decision3-156f-superseded/` |

**A bit-exact route was tried first and rejected.** Concatenating at the container level
kept all 156 original frames bit-identical (PSNR `inf`), but left a 120 ms frame-duration
stall at the join and a 6.32 s container duration against 6.28 s of picture. A raw h264
elementary-stream concat was also tried and **lost two frames**. The re-encode is the only
route that produced regular 40 ms frame timing across all 157 frames.

---

## Gate D functional acceptance — 18/18 PASS, 2026-08-21

Driven through a real Chromium browser against the **assembled package** served over the
range-capable server — not the dev app, and not the lesson data in isolation. Playback is
fast-forwarded so the routing is what is under test, not the wall clock.

```bash
node scripts/serve-package.mjs ./EA_claims-01_AV1 8914 &
npx tsx --tsconfig tsconfig.json scripts/dump-lesson-graph.ts /tmp/graph.json claims-investigation-application-1
node scripts/acceptance-package.mjs http://127.0.0.1:8914 /tmp/graph.json
```

Note the graph slug: claims-01's registry slug is **`claims-investigation-application-1`**,
not `claims-01-av1`. Its media, narration and test suite are keyed `claims-01-av1` but its
lesson module and slug are not. Passing the wrong one fails outright.

The walk clicks **all 12 options** — every wrong answer at every decision, then the right
one — and checks each against the routing the lesson data declares.

| Check | Result |
|---|---|
| Does not autoplay at load | PASS — `paused=true t=0.00` |
| Start control present behind the opening frame | PASS |
| Start begins picture and sound together | PASS — `playing=true src=intro.mp4` |
| All three decisions reached | PASS |
| 9 incorrect options each play their own feedback segment | PASS — 9/9 |
| Each incorrect option's feedback is distinct | PASS — 9 distinct across 9 |
| Each routes to the feedback its data names | PASS — 9/9 matched |
| Correct verdicts are player-native, no video | PASS — 3/3 by design (`fb-1d`/`fb-2b`/`fb-3b` carry no media) |
| Retry returns to the SAME decision | PASS — 9/9 |
| All paths rejoin, lesson plays start → finish | PASS |
| Every rejoin segment reached | PASS — 4 rejoin segments played |
| Every delivered segment reachable through the UI | PASS — 22/22 |
| Never more than one audible media element | PASS — max 1 |
| No failed network requests | PASS |
| No 4xx/5xx responses | PASS |
| No console or page errors | PASS |

**Defect found and fixed in the QA harness itself.** `acceptance-package.mjs` hardcoded
`fb-1b/2b/3b` — ew-01's player-native beats — into the evidence string it prints for every
video. claims-01's are `fb-1d/2b/3b`, so the QA record it produced named the wrong scenes
while the assertion underneath was computed correctly. The ids are now read from the
lesson's own graph. The check never passed incorrectly; only the printed record was wrong.

---

## Round 1 (v4) — real devices

_Not yet run on v4. Record one row per device._

| | |
|---|---|
| Date | |
| Tester | |
| Devices | |
| Serving | LAN static server (`scripts/serve-package.mjs`), HTTP byte-range enabled |
| Scope | Full lesson walkthrough, portrait |

### Acceptance checks (Agreement §2.2)

Rows marked **desktop PASS** were verified automatically against the package — they still
need confirming on a real handset, because a headless desktop browser is not a phone.

| Check | Result |
|---|---|
| Plays start → finish | **desktop PASS** |
| All 12 options route to their own individual feedback | **desktop PASS** — 9 incorrect play their own distinct segment; the 3 correct verdicts are player-native by design |
| Retry returns to the same decision | **desktop PASS** — 9/9 |
| All paths rejoin | **desktop PASS** — 4/4 rejoin segments reached |
| Every delivered segment reachable | **desktop PASS** — 22/22 |
| Audio clean — no extraneous audio, dead segments, or manual muting | **desktop PASS** — never more than one audible media element |
| Start gate: does not autoplay; Start begins picture and sound together | **desktop PASS** |
| Captions legible at phone width | _needs a phone_ |
| First frame behind Start shows closed mouth | **Known FAIL — see §Opening-frame mouth state (v4)** |
| R1-5 iOS opening audio | _still open, still one data point_ |

### Defects raised

| # | Defect | Severity | Disposition |
|---|---|---|---|
| | | | |

---

## Opening-frame mouth state (v4) — KNOWN OPEN DEFECT, not fixed

Diane's v4 segments are cut **at the audio onset**, not at the midpoint of the surrounding
silence. LatentSync opens the mouth roughly 6 frames *before* the first audible sample, so
an onset cut lands inside that anticipation and the segment opens on parted lips with teeth
visible, during digital silence. The same applies to closing frames.

This includes the **`intro` first frame — the one held behind the Start control**, which is
the single most-looked-at frame in the video.

**Not fixed, and deliberately so.** Correcting it in the media means re-cutting at the
silence midpoint and re-rendering: **≈$2.37, which is not approved.** It is recorded here as
an open defect rather than silently accepted.

siu-01 records 22/22 first and last frames closed under the midpoint rule, and ew-01 records
the same failure as claims-01 and accepted it at release. Any remedy belongs in the
**player** — a poster frame or a held opening frame is a player change at $0.00 with no
re-render, which is exactly what pipeline rule 8 exists to protect.

---

## Deferred at release (v4)

Released 2026-08-21 on Luis's decision, with real-device round 1 on the v4 package **not yet
run**. This is a deliberate, recorded deferral — **not waived**, and not a claim that it
passed. Round 1 on 2026-08-19 was run against the **v2** package and does not transfer:
the media has been fully replaced since.

| Item | State at release |
|---|---|
| iOS Safari, real handset | Not run on v4 |
| Android Chrome, real handset | Not run on v4 |
| Captions legible at phone width | Not checked on a phone |
| Functional acceptance **inside a Thinkific lesson** | Not run — the package has never been uploaded, by any pilot |
| R1-5 iOS opening audio | Still open, still one data point |

**What this exposure actually is.** The package is static and self-contained, the routing is
verified 18/18 in a real browser engine, and the audio is the byte-identical locked master.
The realistic phone-only risks are iOS autoplay refusing the opening audio — which the
locked Start gate is expected to have already fixed — and caption legibility at phone width.
Neither can corrupt the deliverable; both would be player-side fixes at $0.00 with no
re-render.

**Close it at the earliest of:** the pilot review, or the first time this package is opened
on a phone. Two clean handsets close R1-5 for all three pilots at once.
