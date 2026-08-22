# OpenAI TTS — narration

> **⚠️ Selena Navarro is NO LONGER on OpenAI.** Recast 2026-08-22 (approved by Roger) to
> `fal-ai/minimax/speech-02-hd`, voice-design `ttv-voice-2026082200132526-qth65Vqj`.
> Everything below about `gpt-4o-mini-tts` / `sage` / the `instructions` string is the
> **retired** definition, kept so the v1 audio stays reproducible. Diane and Curtis are
> unchanged on `tts-1-hd`. Current definition: `presenters/selena-navarro.md`.


Two models, because one presenter is a client-approved exception. **The per-presenter recipe
is authoritative** — read `../presenters/<name>.md` before calling, and never mix settings
between presenters.

| Field | Value |
|---|---|
| Model IDs | `tts-1-hd` (Diane, Curtis) · `gpt-4o-mini-tts-2025-12-15` (Selena, **pinned snapshot**) |
| Provider | **OpenAI direct** |
| Method | **Sync** — the audio comes back in one call |
| Type | Text → audio |
| API key | env `OPENAI_API_KEY` |
| Cost | `tts-1-hd` **$30.00 / 1M characters** · `gpt-4o-mini-tts` **$0.60 / 1M text-in + $12.00 / 1M audio-out tokens** (≈$0.015/min) |

Run it through `scripts/tts-narration.mjs`, which holds the locked presenter table, writes a
per-segment `<id>.json` sidecar **and** the lesson's `_gate-a-summary.json`:

```bash
node scripts/tts-narration.mjs --lesson <lesson-id> --presenter <diane-marchetti|curtis-whitfield|selena-navarro> \
     --max-cost 0.32 --dry-run
```

Drop `--dry-run` only after quoting the cost and getting an explicit go. `--only intro,decision-1`
re-runs a subset.

## Request format

```json
{
  "model": "tts-1-hd",
  "voice": "shimmer",
  "input": "<verbatim narration for one segment>",
  "speed": 1.0,
  "response_format": "mp3"
}
```

Selena's call omits `speed` and carries `instructions` instead — the byte-exact 1133-character
string from `public/media/presenter-3-selena-navarro-voice-SELECTED.json`, sha256
`bdf6862d6f8dc101b66898b0d0b2d0df1c4946d62f02fa202bb4af932483eeda`. **Never retype it.**

## The mastering recipe — unchanged and still right

Target: **mp3 · 24 kHz · mono · 128 kbps · −24.5 LUFS integrated.**
A single calibrated encode from raw, **linear gain only — never compression or limiting**,
calibrated against a **throwaway probe encode** because a decode→re-encode generation costs
a uniform ~0.5 dB:

```
I_raw   = ebur128(raw)
g1      = -24.5 - I_raw
probe   = encode(raw, g1)          # discarded
g_final = g1 + (-24.5 - I_probe)
master  = encode(raw, g_final)     # the single encode from raw
```

Calibrating on the raw input instead lands the output ~0.5 dB low and fails the ±0.3 gate.

**Measure integrated LUFS over the narration window only.** Padding with 0.48 s of digital
silence moved siu-01's `resolution-3` from −24.5 to −24.8 without touching a sample.

## Notes — the cost model has a hole

**`gpt-4o-mini-tts` bills audio-out tokens that `scripts/tts-narration.mjs` does not count.**
Its price model counts characters only, so Selena's recorded $0.0059 is text-in alone and is
not her real spend. **Read the OpenAI billing record.** Fix the price model before the
267-run, or her per-video figure stays wrong forever.

**The estimator's `charsPerSec` values are stale for two of three presenters.** Measured:
Diane **15.81** (estimator correct), Curtis **15.89** (estimator 16.24), Selena **14.24**
(estimator 16.0, ~12% high). The estimator feeds the `duration` row and the batch plan.
Correct it, or size batch plans from the measured rates.

**Re-verify prices at developers.openai.com/api/docs/pricing before any large run.**
