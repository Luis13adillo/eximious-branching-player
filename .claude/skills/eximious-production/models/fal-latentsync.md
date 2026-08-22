# fal-ai/latentsync — the catalog lip-sync engine

The default and only approved lip-sync route for all 267 videos (pipeline rule 1).
It is a **dubbing** model, not an avatar model: it takes existing video plus audio and
re-renders only the **face region**. Background, wardrobe, set and lighting pass through
untouched, so **presenter identity cannot drift** across the catalog — it is never
re-synthesised. Roughly 95–97% of every delivered frame is reused base footage.

| Field | Value |
|---|---|
| Model ID | `fal-ai/latentsync` |
| Provider | **fal.ai** |
| Method | **Async** — submit to the queue, then poll |
| Type | Video (video + audio in, video out) |
| API key | env `FAL_KEY`, header `Authorization: Key {FAL_KEY}` |
| Cost | **$0.20 flat for ≤40 s, then $0.005/sec** (verified 2026-08-18) |

**Route through fal.** The same model is $0.05/s on WaveSpeed — 10× more. Routing matters
as much as model choice here.

## Endpoint

```
POST https://queue.fal.run/fal-ai/latentsync
```

## Request format — the locked parameters

```json
{
  "video_url":  "<fal URL of the driving-base window>",
  "audio_url":  "<fal URL of the batch WAV>",
  "loop_mode":  "pingpong",
  "seed":       20260820,
  "guidance_scale": 1
}
```

`loop_mode: "pingpong"` is locked but **must never actually trigger** — every call is
shorter than the driving base, which is what makes it inert. If it fires it plays half of
every blink backwards.

Inputs are uploaded **only** through `scripts/fal-upload.mjs` (24 h retention, asserted).
Never upload by hand and never to an anonymous host.

## Response handling

Queue submit returns a `request_id` and a status URL. Poll the status URL until it reports
completion, then read the output video URL and **download immediately** — result URLs
expire. `scripts/lipsync-batch.mjs` does all of this.

**Write `_call-N-request.json` at SUBMIT time, before polling.** A parallel runner that
kept metadata in memory lost `request_id` on 5 of 8 calls, permanently.

## The five behaviours you must design around

1. **It always returns 25 fps**, whatever the input frame rate. The driving bases are 24 fps;
   the output is 25. **Compute all padding at 25 fps** or the fix under-pads and silently
   clips narration.
2. **It floors output to a multiple of 16 frames.** Up to 0.6 s of narration is silently cut
   from the end. Pad past the boundary, then trim after.
3. **It returns AAC 16 kHz audio.** Discard it and remux the locked 24 kHz master, or
   −24.5 LUFS never reaches delivery.
4. **It articulates BEFORE the sound** — measured at ~6 frames / 250 ms of anticipation.
   This is why segments are cut at the silence midpoint, never at the audio onset.
5. **It has a ~3-frame cold start**, returning an open mouth on frames 0–2 even when the
   audio is digitally silent. This is one of the two reasons every batch opens with a full
   16-frame block of silence.

**Assert `returned frames == blocks × 16` on every call.** All six siu-01 calls and all
eight ew-01 calls matched their plan exactly. A mismatch is a hard stop.

**Its true single-call maximum is undocumented.** That is why a chunk ceiling exists at all.
**125 s** is the accepted figure — Diane's longest executed and accepted call. Chunking is
cost-identical to one long call, so respecting the ceiling is free.

## Notes

- Cost is computed from **padded** seconds, which is what the bill is based on. The planner
  tie-breaks on total padded seconds for exactly this reason.
- It re-renders the **whole face region**, not just the mouth — the eyes control lost 11–17%
  too. The background is genuinely untouched, so the boundary is the face.
- fal input CDN objects **cannot be deleted** by an ordinary account key. Retention is
  settable **only at upload time**, and fal returns HTTP 200 even when it silently ignores a
  malformed retention header. `scripts/fal-upload.mjs` HEADs the object afterwards and
  throws if the expiry is missing or wrong.
- **fal rate limits at 267-video volume are unverified.** v1 runs one call at a time.
