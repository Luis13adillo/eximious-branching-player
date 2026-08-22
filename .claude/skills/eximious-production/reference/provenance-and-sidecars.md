# Provenance and sidecars

**Four records per video, no exceptions.** The three pilots are asymmetric here and it is a
real gap — this is what closes it for the remaining 264.

| Record | claims-01 | siu-01 | ew-01 |
|---|---|---|---|
| `_gate-a-summary.json` | **absent** | present | reconstructed |
| `_lipsync-batch-plan.json` | **absent** | present | present |
| `_call-N-request.json` | **absent** | 6 | 9 (incl. 1 superseded) |
| Per-segment ASR adjudication | **none** | **none** | **25/25** |

claims-01's batch and call provenance survives only inside its 22 `*.mp4.json` sidecars.
**ew-01 is the only pilot with a complete ASR script-fidelity record.**

## The four records

All under `public/media/<lesson-id>/`.

**1. `_gate-a-summary.json`** — every Gate A row for every segment, plus
`asr_adjudications`. Note the internal naming: the key `gate_b` holds the audio rows.

**2. `_lipsync-batch-plan.json`** — the plan the spend was authorised against. Carries the
locked call parameters, the driving base and its duration, the rule constants, and every
segment's batch index and offset.

**3. `_call-N-request.json`** — one per call, **written at SUBMIT time, before polling.**
Do not rely on stdout. A parallel runner plus a `tail` pipe lost `request_id` on 5 of 8 calls,
permanently. A superseded call keeps its own file, named so the record shows what happened —
e.g. `_call-5-request-run1-145blk-superseded.json`, with its raw return kept alongside.

**4. `<segment>.mp4.json`** — the per-asset sidecar.

## Sidecar fields

Top-level keys as delivered: `asset` · `video` · `presenter` · `motion_base` ·
`driving_base` · `lipsync` · `split` · `audio` · `delivery` · `measured` · `cost_usd` ·
`sha256` · `date` · `revision`.

`lipsync` carries `provider`, `model`, `loop_mode`, `loop_mode_note`, `seed`,
`guidance_scale`, `request_id`, `batch_index`, `batch_segments`, `batch_padded_s`.

`driving_base` carries the file, its **sha256**, duration, fps, frames, method, and the QA
guarantees the build asserted.

`split` carries `lead_s`, `tail_s`, the batch offsets, and — where it applies —
`decoder_delay_fix_frames`.

`measured` carries `frames`, `video_dur_s`, `video_start_s`, `align_err_ms`.

`visual_qa` carries the human mouth-state verdict, **stamped with the sha256 and cut offset it
was judged against**, so a verdict can never be silently inherited by a different file.

## Two rules that are not optional

**Measure, do not derive.** Every number in a delivery record comes from `ffprobe` against the
**delivered file**. A frame-grid formula reproduced 20 of claims-01's 22 segments and
disagreed on two — and one of those was a **real one-frame shortfall** where video did not
cover audio. Deriving would have hidden it.

**Nothing committed may contain `batch_audio_url`, `hosted_at` or `image_url`.** They point at
permanent, undeletable fal objects holding verbatim confidential narration, and
`public/media/` is tracked. Strip them from motion-base sidecars too.

## Why the checksums matter

Pipeline rule 6 says approved masters stay byte-identical. The pilots proved it the only way
that counts: **316/316 files checksummed after packaging, 0 changed.** Re-checksum after every
build, and after every driving-base build re-checksum the upstream assets too
(`source_integrity`).

**A zip rebuild changes the archive digest even when contents are identical.** If a digest has
already been sent to the client, record **both**.
