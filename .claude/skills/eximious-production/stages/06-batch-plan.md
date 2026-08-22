# Stage 6 — Batch planning

**Cost $0.00. This stage decides ~89% of the video's spend.**

```bash
node scripts/plan-lipsync-batches.mjs --lesson <lesson-id> \
     --base public/media/presenter-N-<name>-driving-base.json \
     [--max-call-s 125]
```

Durations come from the **DELIVERED mastered audio** (ffprobe via the Gate A sidecars),
**never from a chars/sec estimate**.

## The five timing constants

| Constant | Value | Why |
|---|---|---|
| `GAP_S` | **0.5 s** | silence between segments inside a batch |
| `FPS` | **25** | LatentSync's **OUTPUT** rate, never the driving base's 24 |
| `BLOCK` | **16 frames** | the model processes in 16-frame blocks |
| `LEAD_IN_S` | **0.64 s = one full block** | see below |
| `CLEAR_S` | **0.2 s** | the audio must *exceed* the block boundary so the model emits the full block count |
| `DELIVERY_PAD_S` | **0.24 s** | see below |
| `MIN_CALL_S` | **40 s** | below it the $0.20 per-call minimum applies |
| chunk ceiling | **125 s** | Diane's longest executed and accepted call |

**Blocks are derived from `content + DELIVERY_PAD_S`, not from content:**

```
blocks   = ceil((content + 0.24) × 25 / 16)
padded_s = blocks × 16 / 25 + 0.2
content  = LEAD_IN_S + sum(durations) + 0.5 × (n − 1)
cost     = max(0.20, padded_s × 0.005)
```

## The silent lead-in — 0.64 s at the head of EVERY batch

**Why it exists.** A batch whose first segment starts at offset 0.000 has narration on
sample 0, so LatentSync correctly opens the mouth on frame 0 and **the delivered first frame
shows open lips and visible teeth.** Found on the Curtis canary (call 6, request
`01a021be-5da7-7333-b6ff-a49788d562cb`). **All four batch-opening segments of the already
approved, delivered Diane v4 set carry the same defect** — so it is a defect in the batching
rule, not a presenter defect, and it had never been caught.

**Why a full block and not fewer frames.** Measured on the canary's own four 0.5 s gaps,
mouth activity sits at the re-encode noise floor from 6 frames before onset through the
onset frame, and all 28 inspected frames show lips closed. One block is *more* silence than
that, and it is **structural rather than empirical** — the model demonstrably works in
16-frame blocks, so frame 0's entire processing block is silent. A 5- or 8-frame lead-in
would leave frame 0 sharing its block with speech. It also absorbs LatentSync's own 3-frame
cold start.

It does not disturb the padding rule:
`ceil((c + 16/25) × 25/16) === ceil(c × 25/16) + 1`. Cost **+$0.0032 per call**.
The lead-in is **discarded at the split**.

## The delivery pad — 0.24 s, and it cost $0.464 to learn

`lipsync-deliver.mjs` cuts 0.24 s of silence in on **both** sides of every segment, so the
returned video must extend at least that far past the last narration sample, or **the final
segment of a call cannot be split at all**. `CLEAR_S` does not help — it lengthens the
submitted audio, not the returned block count.

**ew-01 call 5, run 1** was planned at 145 blocks and returned 92.80 s against 92.576 s of
content: **0.224 s of slack where the pad needs 0.24 s**, stranding `rejoin-1a` by 16 ms.
Re-run at 146 blocks. **$0.464 gone.** siu-01 had shown the same symptom without paying for
it (call 5 left 0.020 s, call 2 left 0.032 s) and survived only because every Gate A master
carries 400–600 ms of its own trailing silence.

## Partitioning — exact DP, not a greedy fill

Batches are **contiguous runs in alphabetical segment order**. The planner runs an exact
dynamic program over `k` runs, minimising the **largest padded call**, tie-broken on **total
padded seconds** — which is what the bill is computed from. With 22–25 segments the table is
trivial, so there is no reason to approximate.

Order inside a call is irrelevant: every segment is re-split at its recorded offset
afterwards.

## Three hard constraints, checked before any spend

1. **Every call ≥ 40 s** — below it the $0.20 minimum applies.
2. **Every call strictly shorter than the driving base** — so pingpong never triggers.
3. **Every call ≤ the chunk ceiling (125 s).**

The planner also **refuses to plan paid work on a segment that has not passed Gate A** —
specifically it exits if the segment's `loudness` or `format` row is not true.

**The chunk ceiling and the base length are different limits, and conflating them is a trap.**
The ceiling exists because LatentSync's single-call maximum is **undocumented** and
mouth-region temporal flicker grows on long takes. Chunking is cost-identical to one long
call, so respecting it is free. The base length is a separate, physical constraint.

## Why this stage is worth 44%

Segments run 2.6–24 s. One call per segment is ~27 × $0.20 = **$5.40/video → $1,442** for the
catalog. Batched to ≥40 s: 604 s × $0.005 = **$3.02/video → $806**.
**Batching alone saves 44%, and nothing else in the pipeline comes close.**

## Output

`public/media/<lesson-id>/_lipsync-batch-plan.json` — the plan the spend is authorised
against. It carries the locked call parameters, the driving base and its duration, and every
segment's batch index and offset.

**Quote the plan's total before running a single call.**

## Stop conditions

- Any hard constraint fails.
- The projected total exceeds the per-video sanity ceiling of $5.62.
- The driving base is shorter than the longest planned call (rebuild it — $0.00).
