# Stage 4 — GATE A · audio

**Cost $0.00. MANDATORY before any paid lip-sync. A failure here stops the spend.**

This is the first of the two free gates that sit in front of the two paid steps. It has
already caught faults that would otherwise have shipped clipped narration across the catalog.

## The rows, and what each one actually tests

| Row | Threshold |
|---|---|
| `loudness` | **−24.50 LUFS ±0.3**, `ffmpeg ebur128`, over the **narration window only** |
| `true_peak` | ≤ **−3.0 dBFS** (the production run landed −4.9 to −7.2) |
| `format` | stream is exactly `mp3, 24000, 1, 128000` |
| `flat` | `flat_factor 0` — no silent or flat frames |
| `no_trunc` | a delivered file ends at 0.001–0.003 of its own speech level, **falling**. Measure the final frame **and the decay trend** |
| `pause` | inter-phrase pauses present and sane |
| `f0` | **onset ≥ 0.75× body pitch** |
| `duration` | **a chars/sec model, NOT the audio** — see below |

Plus **script fidelity by ASR read-back**:

```bash
node scripts/asr-fidelity.mjs --lesson <lesson-id> --max-cost 0.08 --dry-run
```

## Two rows that lie, and how to read them

**`duration` scores an estimate, not the audio.** It failed 3/22 on Curtis and 12/25 on
Selena while every one of those segments passes the corrected test (within 3 SD of the
corpus). **A `duration` failure means check the estimate, never that the audio is defective.**
The underlying cause is the stale `charsPerSec` values in `scripts/tts-narration.mjs`.

**ASR "errors" are usually the ASR.** Whisper reported "defensively" for "defensibly" and
8 digits for a 9-digit claim number; **both audio were correct.** Confirm with an
isolated-word render or syllable-nuclei analysis before believing a fidelity failure.

**The `f0` row is not calibrated.** A known-good approved asset sits exactly on the boundary.
Its real purpose is catching an onset near *half* body pitch — the `shimmer` masculine-onset
defect. State it as **≥0.75× body**, and use the presenter's own F0 window (Curtis's floor
must sit below Diane's or the estimator octave-doubles).

## Naming — the repo contradicts itself

`_gate-a-summary.json` internally calls its audio row-set **`gate_b`**, and the repo *also*
calls the ASR script-fidelity check "Gate B". **Canonically: Gate A = audio.** When reading
that file, `gate_b` means the audio rows and `asr_adjudications` means script fidelity.

## Exit criteria

- Every segment passes every row, or a `duration` failure is explained by the estimator.
- `_gate-a-summary.json` exists and covers every segment. **claims-01 has none at all** —
  that is the gap this stage closes for every future video.
- Per-segment ASR adjudications recorded. **Only ew-01 has a complete set.** Every video
  from now on emits them.

**The batch planner refuses to plan paid work on a segment that has not passed Gate A** — it
exits if a segment's `loudness` or `format` row is not true, and its error message calls that
"Gate B" (the naming collision above). **Do not work around it.**

## Stop conditions

Any row failing that is not the explained `duration` case, or an ASR discrepancy that
survives an isolated-word check.
