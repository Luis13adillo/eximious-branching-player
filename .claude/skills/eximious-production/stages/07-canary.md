# Stage 7 — Canary calls

**Cost: inside the batch spend, not additional. This stage is about ORDER, not extra money.**

Before committing the whole plan, run **one mid-length call, then the longest call**. Then
stop and look at what came back.

## Why this order

- **The mid-length call proves the padding arithmetic.** Diane's canary confirmed the 0.2 s
  clearance: 46.28 s submitted returned exactly 72 × 16 = **1152 frames**.
- **The longest call proves the constraints at their limit** — the driving base is long
  enough, the ceiling holds, and nothing degrades on a long take.

**A canary is where the two most expensive rules in this pipeline were discovered.** Curtis's
call 6 canary produced the 0.64 s lead-in rule, which affects every batch of every one of the
267 videos. ew-01's missing delivery pad was found the other way — by paying $0.464 for a
call that could not be split.

## Run one call

```bash
node scripts/lipsync-batch.mjs --lesson <lesson-id> --call <n> --max-cost <ceiling> --dry-run
# read the projection, quote it, get an explicit go, then:
node scripts/lipsync-batch.mjs --lesson <lesson-id> --call <n> --max-cost <ceiling>
```

`--build-only` stops after building the batch audio and before any upload or paid call.
The script also refuses to submit if `submit_s >= driving_base.dur_s`.

## What to check before the next call

1. **`returned frames == blocks × 16`.** Hard assertion. All six siu-01 calls and all eight
   ew-01 calls matched their plan exactly. **A mismatch is a hard stop, not a retry.**
2. **Tail slack ≥ 0.24 s** past the last narration sample. If it is short, the final segment
   of the call cannot be split and the call must be re-run one block longer — at your cost.
3. **The first delivered frame of the batch-opening segment shows closed lips.** That is what
   the lead-in buys. If it does not, the lead-in was not applied.
4. **`_call-N-request.json` exists on disk**, written at submit time.

## Then commit the rest

Only after both canaries pass. Quote the remaining total again if anything in the plan moved.

## The retry rule

**A re-run is ONLY justified when the return itself is unusable** — wrong block count, or too
little tail to split.

It is **never** justified for a UI, caption, colour, routing, scoring or packaging change
(pipeline rule 8). And **a re-cut of a segment whose raw LatentSync return is still on disk
costs $0.00** — no regeneration, no replanning, the batch plan and offsets untouched.

**Keep every raw return until delivery is signed off.** Diane's were not retained, which is
the only reason her opening-frame defect costs ≈$2.37 to fix instead of nothing.
