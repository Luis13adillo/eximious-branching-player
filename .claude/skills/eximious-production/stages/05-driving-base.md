# Stage 5 — Motion base → driving base · GATE B

**Once per presenter, ever. $0.25–0.50 for the motion base, $0.00 for the driving base.**

All three current presenters already have both. **Skip to stage 6 unless you are onboarding
a new presenter or an approved appearance has changed** (pipeline rule 7 — that is a new
client approval, not a technical decision).

Check first:

| Presenter | Driving base | Duration | Headroom over the 125 s ceiling |
|---|---|---|---|
| Diane | `presenter-1-diane-marchetti-driving-base-corrected.mp4` | **99.625 s** | **NONE — caps her calls below 99.625 s** |
| Curtis | `presenter-2-curtis-whitfield-driving-base.mp4` | 142.083 s | 18.4% |
| Selena | `presenter-3-selena-navarro-driving-base.mp4` | 143.417 s | 19.5% |

**Diane needs an extension rebuild ($0.00) before a lesson that wants long calls**, and her
delivered claims-01 was driven by a 480 s scratchpad file that is not in the repo. See
`../presenters/diane-marchetti.md`.

---

## Part 1 — the motion base (paid, once)

Recipe, prompt requirements and the `cfg_scale` escalation table:
`../models/kie-kling-v2-1-pro.md`.

**Generate ONE, QA it, buy another only if it fails.** Expect roughly 1 in 4 clean. Four
blind draws cost $2.00; the QA is free and takes about two minutes.
**Prefer `duration: 5`** — the driving base needs one clean, **re-enterable** blink, and
Diane's 10 s clip cost twice as much without buying a better base.

### GATE B, first half — the motion base

| Row | Threshold |
|---|---|
| dimensions | probes **exactly 1920×1080** |
| audio | **no audio stream at all** |
| camera lock | background meanΔ **< ~0.1/255**, measured on the **TEXTURED side of frame** |
| reframing | best-fit zoom vs the input still = **1.00×** |
| lips closed | **for the whole clip**, by **lip aperture** (dark row-mean never below ~48/255; an exposed oral cavity reads under 30) **and by eye at 4×** |
| blink | natural blink present, ~13–20/min, irregular |
| loop seam | reads as a motion-direction change, not a cut |

**Measure camera drift on the TEXTURED side.** The stills' camera-left corners are near-black
(mean 11.1, std 1.29) and pass even when the camera moves. Diane's three failures measured
0.24 / 0.60 / 0.63 against a ~0.1 gate — obvious once you look in the right place.

**Never test "lips closed" with mouth-region pixel change.** A luma-share metric calibrated
on known-open and known-closed Curtis frames separated them by **0.0000**.

**A PARTIAL pass is usable.** Ask "is the defect confined to a window?" before spending
again. Curtis's take 2 failed one of twelve rows, confined to frames 5–40; frames 41–121
became his production base and no take 3 was bought.

**FAIL → rename `…-takeN-REJECTED.mp4` immediately**, so it can never be picked up as the
base for 51 courses.

**Photometric correction is conditional, not automatic.** Kling lifts exposure (~9.5% on
Diane). Correct with a per-frame **multiplicative gain in 16-bit** (`format=gbrp16le`) —
an 8-bit round trip costs 0.32/255 of identity versus 0.003/255 at 16-bit. **But measure
first:** Curtis's channel spread across his window was 0.799/255, *below* the 1.103 RMS his
clip already moves between two consecutive frames. Correcting that would have been damage.

---

## Part 2 — the driving base (free, once)

**This is a permanent pipeline stage, not a one-off fix.** All three presenters ship on one.

A motion base is 5–10 s. LatentSync calls run 77–125 s. Feeding it the short clip triggers
`loop_mode: pingpong`, which produces a countable repeat and **plays half of every blink
backwards**. The driving base removes that structurally: take the QA-clean window and
**re-order its frames** into a continuous 100–143 s walk, so the base is always longer than
the longest call and pingpong **never fires**.

**Every output frame is a bit-exact copy of a source frame. Only the order changes.**
ffmpeg only. **$0.00.** No generation, no interpolation, no synthetic frames, no colour
work, no scaling.

### Build rules

- **Continuous walk.** Every step is ±1 along the source frame index, so no move contains a
  cut. A direction change reads as the head settling. Direction legs run ~12+ frames.
- **Blinks are only ever walked FORWARD.** A reversed blink — the lid opening slowly then
  snapping shut — is the defect that got Diane's first cut rebuilt.
- **One join per blink**, and **every join must be a smaller visual step than one the source
  already takes between two of its own consecutive frames.** That is the test for "does it
  read as a cut". Measured: Diane max join 1.675 vs source max step 2.045; Selena 3.317–4.154
  vs the source's own 2-frame max of 4.873.
- **Assert source containment.** Refuse any frame outside the clean window — Curtis 41–121,
  Selena 1–51.
- **Reproducible**: fixed-seed LCG (`20260820`), plus a `.seq` frame plan, a `.plan.json` and
  the `.build.py` stored beside the mp4.
- **Encode**: `libx264 -preset slow -crf 12 -pix_fmt yuv420p -an -movflags +faststart`.
- **Length: size it above the ~125 s chunk ceiling**, not above one lesson's longest call.
  Extending later is **strictly additive at $0.00** — Curtis's v1→v2 kept its first 2378
  frames byte-identical. Never rebuild from scratch to make one longer.

### GATE B, second half — run on the DELIVERED file, every frame

`container` · `audio` (must be none) · `source_containment` ·
**`frame_fidelity`** (per-frame PSNR against the exact planned frames — Diane 55.64 dB,
Curtis 53.79, Selena 52.97, minimum measured 49.65; this simultaneously proves every frame is
the frame the plan named) · `camera_lock` (best-fit zoom **1.000×**, measured on
**presenter-free** background regions) · `lips_sealed` · `blink_validity` ·
`continuity_and_joins` · `photometric_stability` · `loop_fit` ·
**`source_integrity`** (re-checksum every upstream asset after the build).

### Blink rate — the accepted tolerance

Target **13–20/min, irregular**. Shipped: Diane 13.25, Curtis **12.67**, Selena **12.97**.
All three sit marginally under the floor and all three were **ACCEPTED as a documented
non-blocking tolerance**, deliberately not recorded as numeric passes.

Why that is defensible and carries forward: on a driving base the rate is a **free build
parameter**, not a property of a bought generation; the schedule cannot be tuned finer than
~0.42/min at this length; and the failure the target exists to catch is the opposite one —
Diane's first base shipped at **47.6/min**. Changing it costs $0.00 (add a gap to `GAPS`,
re-run).

### Two measured limits worth not rediscovering

- **A blink you cannot re-enter is a blink you cannot use.** Selena's base has two; only
  blink 1 (frames 23–27) is reachable, because reaching blink 2 needs a backward join of
  10.975 RMS. So 51 of 121 frames are used and her clip's largest head movement is
  unreachable. Deliberate and measured.
- **Frame windows also enforce expression consistency.** Selena's lip-aperture proxy runs
  75–85 on frames 1–51 and 56–60 on 57–121. Building inside one half means the base never
  oscillates between the two.

## Stop conditions

- Any Gate B row fails outside the accepted blink-rate tolerance.
- A join exceeds the source's own maximum consecutive-frame step.
- A blink would be walked backward.
- The driving base is not longer than the longest planned call.
