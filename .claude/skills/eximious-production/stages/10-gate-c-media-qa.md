# Stage 10 — GATE C · delivered-media QA

**Cost $0.00. Per delivered asset, after lip-sync.**

## The rows

| Row | Threshold |
|---|---|
| dimensions / rate | exactly **1920×1080, 25 fps** |
| audio stream | `mp3, 24000, 1, 128000` — **never** `aac/16000` |
| loudness | **−24.50 LUFS** preserved to delivery, measured over the narration window only |
| duration | **video duration ≥ audio duration** (trim rounds UP) |
| boundary lips | lips closed at every segment boundary (aperture ≥ ~40) |
| articulation | during speech, well above the non-speaking base floor — the production run measured **1.57–2.76×**, mean 2.13× |
| split alignment | error under half a frame (production run: **0–16 ms**) |
| frame assertion | **returned frames == blocks × 16** |
| framing | identical to the approved base |

## Judge mouth state by EYE, not by metric

```bash
node scripts/lipsync-visual-qa.mjs --lesson <lesson-id> --call <n>
```

Gate C's mouth rows are judged at **2× on contact sheets and 3.5× on the mouth line**, with
**no pixel metric used**. Curtis's motion-base gate proved why: a luma-share metric
calibrated on known-open and known-closed frames separated them by **0.0000**.

Per-segment verdicts go in each `*.mp4.json` under `visual_qa`, **stamped with the sha256 and
the cut offset they were judged against** — so a verdict can never be silently inherited by a
different file.

## Measurement discipline

- **Never score frames the split discards.** The 0.5 s inter-segment gaps and the 0.64 s
  lead-in never reach a delivered asset.
- **Measure against a control.** The non-speaking driving base gives the floor a closed mouth
  produces on the metric. Delivered silence should sit near that floor, **not at zero**.
- **Do not classify silence by RMS threshold.** A plosive closure (/p/, /t/, /b/) is a
  near-silent frame with *maximal* mouth movement.
- **Do not correlate mouth motion against audio RMS.** A sustained vowel is loud with a
  nearly still mouth.
- **Render the mouth box onto a real frame before trusting it.** A variance-map box took in
  cheek, jaw and chin, so head movement counted as mouth motion.
- **Measure, do not derive, anything you write into a record.** A frame-grid formula
  reproduced 20 of claims-01's 22 segments and disagreed on two — and one of those
  disagreements was a **real one-frame shortfall** where video did not cover audio.
  **Re-measure with `ffprobe` against the delivered file.**

## Accepted tolerances — recorded so they are not re-raised as failures

- **Curtis's ~11.8 pp mouth-specific softness** from his beard. Invisible at player scale.
  **Do not act unless Roger rejects it at review.**
- **Selena's first/last-frame mouth position** — ew-01 recorded first frame closed 2/25 and
  last frame 9/25, accepted at release. **Cause never established**; cut offset, silence
  length, block alignment, driving base and regeneration were each tested and refuted. Her
  mouth tracks her audio less closely than the other two (cross-correlation 0.177 vs Curtis
  0.315, Diane 0.222) and the A/V sync fix did not move it — so it is **not** a timing offset.
- **claims-01's open first/last frames** — her segments were cut at the audio onset. Known
  open defect. Every video from now on uses the midpoint rule.
- **claims-01 `decision-3` carries one synthesised cloned frame** — recorded as synthesised.

Anything **not** on this list that fails is a **stop**, not a tolerance.

## Exit criteria

Every row passes on every segment, or fails only into a listed tolerance, and every verdict
is recorded in the sidecar against a sha256.
