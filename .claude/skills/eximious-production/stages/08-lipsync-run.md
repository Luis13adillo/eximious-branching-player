# Stage 8 — LatentSync run

**Cost ~$2.37–3.56 per video. This is 89% of the video's spend.**

Model behaviour, endpoint, locked parameters and the five things you must design around:
`../models/fal-latentsync.md`.

## Run each call, one at a time

```bash
node scripts/lipsync-batch.mjs --lesson <lesson-id> --call <n> --max-cost <ceiling>
```

**v1 runs calls sequentially.** Do not parallelise. fal rate limits at 267-video volume are
unverified, and a parallel runner is exactly what discarded returned metadata and left
`request_id: null` on 5 of 8 calls, permanently.

## The locked call

`fal-ai/latentsync` · `loop_mode: "pingpong"` · **`seed: 20260820`** · `guidance_scale: 1`.

Inputs uploaded **only** through `scripts/fal-upload.mjs` (24 h retention, asserted).
`loop_mode` is locked but must never actually trigger — every call is shorter than the
driving base, which is what keeps it inert.

## Non-negotiable per call

1. **Write `_call-N-request.json` at SUBMIT time**, before polling. Do not rely on stdout;
   a `tail` pipe truncated the one log that held the missing ids.
2. **Assert `returned frames == blocks × 16`.** A mismatch is a hard stop.
3. **Keep the raw return** (`latentsync-out.mp4`) on disk until delivery is signed off.
4. **Never keep the returned audio.** It comes back AAC 16 kHz. It is discarded at stage 9.
5. If a call is superseded, **retain both** the superseded request and its raw return, named
   so the record shows what happened — e.g.
   `_call-5-request-run1-145blk-superseded.json` and `latentsync-out-RUN1-145blk.mp4`.

## Executed batch shapes, for scale

| | calls | audio | lip-sync spend |
|---|---|---|---|
| claims-01 (Diane, 22 seg) | **4** (119.24 / 123.08 / 107.08 / **125.00** s) | 463 s | **$2.372** |
| siu-01 (Curtis, 22 seg) | **6** | 586.872 s | **$3.0048** — clean run, no re-calls |
| ew-01 (Selena, 25 seg) | **8** | 694.056 s | **$3.5616** delivered + **$0.464** wasted = **$4.0256** |

A clean 22-segment video is 4–6 calls. If a plan produces many more, check the driving base
length — a short base forces short calls.

## Stop conditions

- Frame count mismatch on any call.
- Cumulative spend exceeds the quoted plan total.
- A call would be submitted at or above the driving base duration.
- Anything would upload to a host other than fal storage through `fal-upload.mjs`.
