# Stage 3 — TTS narration and mastering

**Cost ~$0.22–0.30 per video. This is the first paid step. Quote it and get a go.**

## Run it

```bash
node scripts/tts-narration.mjs --lesson <lesson-id> \
     --presenter <diane-marchetti|curtis-whitfield|selena-navarro> \
     --max-cost 0.32 --dry-run
```

Read the projection, **quote it, wait for an explicit go**, then re-run without `--dry-run`.
`--only intro,decision-1` re-runs a subset.

The script holds the LOCKED presenter table. **Do not edit it without explicit written
approval.** Per-presenter settings and the reasoning behind each: `../presenters/`.
Model behaviour and pricing: `../models/openai-tts.md`.

## What it produces

- One mastered mp3 per segment in `public/media/<lesson-id>/`
- A per-segment `<id>.json` sidecar
- `_gate-a-summary.json` for the lesson

**The audio standard is the same for every presenter and every asset:**
**mp3 · 24 kHz · mono · 128 kbps · −24.5 LUFS integrated.**

## Mastering — the part that is easy to get subtly wrong

Single calibrated encode from raw, **linear gain only — never compression or limiting**,
calibrated against a **throwaway probe encode**:

```
I_raw   = ebur128(raw)
g1      = -24.5 - I_raw
probe   = encode(raw, g1)          # discarded
g_final = g1 + (-24.5 - I_probe)
master  = encode(raw, g_final)     # the single encode from raw
```

A decode→re-encode generation costs a uniform ~0.5 dB. Calibrating against the raw input
lands the output ~0.5 dB low and fails a ±0.3 gate.

**Measure integrated LUFS over the narration window only.** Padding with 0.48 s of digital
silence moved siu-01's `resolution-3` from −24.5 to −24.8 without touching a narration
sample.

## Duration estimates

Use the presenter's **measured** rate: Diane 15.81, Curtis 15.89, Selena 14.24 chars/sec.
The estimator in the script still carries pre-production values for Curtis (16.24) and Selena
(16.0). **Correct it, or override the estimate.** It feeds Gate A's `duration` row and your
pre-flight cost estimate. It does **not** feed the batch plan — the planner reads measured
durations from the Gate A sidecars.

## Stop conditions

- Selena's `instructions` string does not hash to
  `bdf6862d6f8dc101b66898b0d0b2d0df1c4946d62f02fa202bb4af932483eeda`.
- The projected cost exceeds the quoted figure.
- Any narration text does not match its recorded `scriptSha256`.

## Cost note

**Selena is on fal → MiniMax from 2026-08-22, not OpenAI.** fal bills MiniMax TTS **per
1,000 characters** and returns the count in the `x-fal-billable-units` response header;
`scripts/tts-narration.mjs` records it per segment in `_gate-a-summary.json` under
`provider_billed_units`. **That header is the authoritative number** — the script's own
`$/1M characters` model is an estimate for the pre-flight ceiling only. Her ew-01 v2 run
billed **9.881 units for 9,881 characters**, plus 0.757 for one redraw.

The retired `gpt-4o-mini-tts` route had the opposite problem: it billed **audio-out tokens
the price model never counted**, so her v1 recorded spend understates her real v1 cost. If
you need the v1 figure, read the OpenAI billing record; do not quote the script's.
