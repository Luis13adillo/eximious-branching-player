# Selena Navarro — Presenter 3

Professional Practice & Business. **Tracks 2, 3, 11, 13, 14 · 42 courses.**
Identity, visual direction and voice are **CLIENT APPROVED / LOCKED**.

## Voice recipe — ★ RECAST 2026-08-22, approved by Roger

She is **no longer on OpenAI**. Roger approved a recast on 2026-08-22 from
`gpt-4o-mini-tts-2025-12-15` / `sage` to a MiniMax voice-design voice served through fal.
That is a production **rule 9 provider *and* model change** as well as a client recasting
decision; both were approved together.

| Field | Value |
|---|---|
| Provider / endpoint | **fal.ai → MiniMax**, `POST https://fal.run/fal-ai/minimax/speech-02-hd` |
| Model | **`minimax/speech-02-hd`** |
| `voice_id` | **`ttv-voice-2026082200132526-qth65Vqj`** ("LA-1-mexican-american") |
| Voice origin | `fal-ai/minimax/voice-design`, prompt-designed 2026-08-22 |
| `voice_setting` | `{ speed: 1, vol: 1, pitch: 0 }` |
| `audio_setting` (raw) | `{ sample_rate: 44100, bitrate: 256000, format: "mp3", channel: 1 }` — highest-quality raw, then ONE calibrated master down to the locked 24 kHz / 128 kbps |
| `instructions` | **none — MiniMax takes no such parameter.** Delivery is carried by the designed voice |
| F0 window (Gate A) | `fmin 80`, `fmax 400` (unchanged) |
| **Measured chars/sec** | **14.32** (690.1 s / 9,881 chars, delivered ew-01 v2) |
| Measured pitch / pace | **~162 Hz body across the delivered masters**, 159 wpm. ~42 Hz DEEPER than the retired `sage` |
| Canonical record | `public/media/presenter-3-selena-navarro-voice-SELECTED.json` |
| Billing | fal bills **per 1,000 characters**. The response header `x-fal-billable-units` is the authoritative unit count — record it, do not estimate |

> **★ THE RISK THAT MATTERS — carried, not solved.** The `voice_id` is an **account-scoped
> MiniMax voice-design ID and voice-design is NOT deterministic.** The recorded design
> prompt is not guaranteed to return this voice again. **She carries 42 courses.** If the
> ID lapses before they are rendered, this exact voice may be unrecoverable, and videos
> #1–N would be in a voice #N+1 cannot match. **Render early. Keep every raw synthesis.**
> `sage` had no such exposure — it is a catalogued voice plus a text string in the repo.

**This recast reverses the retired voice's own written direction.** The 1133-character
`instructions` string said *"Do not add a Spanish or Hispanic accent and do not stylise the
delivery around ethnicity in any way."* Roger reversed that deliberately. **Do not
"correct" it back.**

**The retired definition is preserved, not deleted.** Presenter key
`selena-navarro-v1-sage` in `scripts/tts-narration.mjs` reproduces it and **aborts if
selected**; the string lives byte-exact in
`public/media/presenter-3-selena-navarro-voice-SELECTED-v1-sage-superseded.json`
(sha256 `bdf6862d…83eeda`, 1133 chars). Using it again is a new client approval.

### Watch for a bad draw — MiniMax is non-deterministic per call

The ew-01 v2 run caught **`rejoin-2a` rendering "voir dire" as something the transcriber
heard as "voie de rue"** — a mangled legal term of art in an expert-witness course. It was
**not systematic**: three fresh draws of the same clause on the same config all said it
correctly. Remedy is the pipeline's own generate-and-verify rule, now scripted as
`scripts/redraw-verify.mjs`:

```bash
node scripts/redraw-verify.mjs --lesson ew-01-av1 --presenter selena-navarro \
     --segment rejoin-2a --require "voir dire" --draws 4
```

**Judge a disputed phrase on an ISOLATED 1.5–3 s window, never on the whole-segment
transcript.** Sentence-level ASR smoothing both invents differences and hides real ones —
the old draw's full read-back said "voie de rue" but the isolated window said "Vote the
way", and the corrected draw's window says "voir dire".

<details>
<summary>Retired voice recipe (OpenAI / sage) — historical record, do not act on it</summary>

### Retired recipe as it stood until 2026-08-22

| Field | Value |
|---|---|
| Provider / model | OpenAI **`gpt-4o-mini-tts-2025-12-15`** — a **pinned snapshot**, not the floating alias |
| Voice | **`sage`** |
| Required settings | `response_format: mp3` **+ the exact locked `instructions` string** |
| `speed` | **not set** — her locked definition directs delivery through `instructions`, not `speed` |
| `instructions` source | `public/media/presenter-3-selena-navarro-voice-SELECTED.json` |
| `instructions` sha256 | `bdf6862d6f8dc101b66898b0d0b2d0df1c4946d62f02fa202bb4af932483eeda` (1133 characters) |
| F0 window (Gate A) | `fmin 80`, `fmax 400` |
| **Measured chars/sec** | **14.24** (694.056 s / 9,881 chars, delivered ew-01) |
| Estimator in `scripts/tts-narration.mjs` | **16.0 — STALE, ~12% high.** Source of 12/25 false `duration` failures at her Gate A |

**Read the `instructions` string byte-exact from the sidecar. Never retype or paraphrase
it. Her voice is not reproducible without it.** A byte-identical copy is also in the
project `CLAUDE.md`; verify either against the sha256 above before use.

**She runs ~10% slower than the two `tts-1-hd` voices.** Estimate narration duration **per
presenter, never per project**. Her batch plan was never at risk — the planner reads measured
audio — but the stale rate produced **12 of 25 false `duration` failures** at her Gate A and
mis-sizes any pre-flight cost estimate. Use 14.24 until the estimator is corrected.

**Why she is on a different model (client-approved exception, spec §7 F-6).** `tts-1-hd`'s
female roster was exhausted against her casting brief (`shimmer` is Diane's; `nova`, `coral`
and `fable` were rejected) **and** `tts-1-hd` has no `instructions` parameter, so delivery
could not be directed. `sage` was rejected on `tts-1-hd` and won on `gpt-4o-mini-tts` once
delivery could be shaped. The cost of the exception is one extra deprecation surface —
which is why the snapshot is pinned.

**Her recorded TTS spend of $0.0059 is text-in only and is NOT her real cost.**
`gpt-4o-mini-tts` bills $0.60/1M text-in characters **and** $12.00/1M audio-out tokens; the
script's price model counts characters alone, so the audio-out portion was never metered.
**Do not quote $0.0059.** Read the OpenAI billing record for the true figure. It changes no
decision — even generously estimated she sits far inside the catalog budget.


</details>

## Assets on disk

| Step | File | Notes |
|---|---|---|
| Approved reference | `public/media/presenter-3-selena-navarro-master.png` | 1672×941, sha `fbbd1f22…`. **REFERENCE ONLY.** Byte-identical throughout |
| Production still | `public/media/presenter-3-selena-navarro-production-still-1920x1080.png` | sha `bbf914e2…`. Pure lanczos: `scale=1920:1081:flags=lanczos,crop=1920:1080:0:1`. **$0.00**, PSNR 47.334 dB round-trip, colour within 0.03/255 |
| Motion base | `public/media/presenter-3-selena-navarro-motion-base.mp4` | **take 3**, sha `6fd0f857…`, **5 s**, **`cfg_scale: 0.8`**, **$0.25** + a $0.00 ffmpeg exposure correction |
| Driving base | `public/media/presenter-3-selena-navarro-driving-base.mp4` | **143.417 s**, 3442 frames @ 24 fps, 31 joins, **12.97 blinks/min**, frame PSNR **52.97 dB**, sha `2b879a22…`, built from frames **1–51**. **$0.00** |

**The budgeted $0.05 Topaz route was NOT used.** At 1.148× a precision resample reproduces
the approved appearance without a model reinterpreting an approved face. **FLAGGED:**
cost-lock 1.4 recommended "pad, do not crop"; this crops one row of empty wall. Reversible
for $0.00 if anyone objects.

**Take 1 failed on presenter motion; take 2 was REJECTED for a continuous push-in.** Take 3
at `cfg_scale: 0.8` was accepted.

## Presenter-specific constraints

**Only 51 of her 121 motion-base frames are usable, and that is deliberate.** Her base has
two blinks but **only blink 1 (frames 23–27) is re-enterable** — reaching blink 2 needs a
backward join of 10.975 RMS, a six-frame jump at the extreme tail of anything the source
does. The consequence is that **the clip's largest head movement is unreachable.** Measured,
not an oversight.

**The frame window also enforces expression consistency.** Her lip-aperture proxy runs 75–85
on frames 1–51 and 56–60 on frames 57–121 — a closed-lip smile relaxing to neutral.
Building inside one half means the base never oscillates between the two.

**ACCEPTED at release — ew-01 first frame lips closed 2/25, last frame 9/25.** Luis accepted
it ("this is the best it is going to look"). **The cause was never established**: cut offset,
silence length, block alignment, driving base and regeneration were each tested and each
refuted. Her mouth also tracks her audio less closely than the other two (peak
cross-correlation **0.177** vs Curtis 0.315, Diane 0.222), and the A/V sync fix did not move
it — so it is **not** a timing offset. Any remedy is player-side and $0.00.

**ACCEPTED — two 3-frame direction legs** in her driving base (1.0% of legs, 0.125 s each).

## Still open

**Her STANDING course-page / title-card asset is not on disk at all.** The designation is
locked — **seated = the speaking video, standing = course pages and title cards only** — and
the file must still be produced at 1920×1080 or better. This does not block application-video
production; it blocks course-page assembly.

## Motion-base prompt notes — if a new base is ever approved

Rewrite three sentences and reuse the rest verbatim. **Selena's fingers are loosely
clasped.** Her frame carries **Eximious lettering on the wall** that an unqualified "no
text" in the negative prompt would erase — name what must stay.
She passed at **`cfg_scale: 0.8`**. Prefer a take whose blink sits in a calm passage: hers
does not, which is what cost her 70 frames of usable base.

Recipe: `../models/kie-kling-v2-1-pro.md`. Method: `../stages/05-driving-base.md`.
