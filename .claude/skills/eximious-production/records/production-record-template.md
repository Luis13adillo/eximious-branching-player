# Production record — write one per completed video

**A production is not finished until this record exists.** It is what keeps the Second Brain
current as the catalog runs, so session 200 knows what session 4 learned.

## Where it goes

```
~/.claude/projects/-Users-luismiguel-Desktop-eximious-branching-player/memory/
    eximious-production-<lesson-id>.md
```

Then add **one line** to `MEMORY.md` in that folder:

```
- [<lesson-id> delivered](eximious-production-<lesson-id>.md) — <presenter>, <n> segments, <gate D result>, <what it cost>
```

`MEMORY.md` is an index. One line per memory, never content.

## The template

```markdown
---
name: eximious-production-<lesson-id>
description: <lesson-id> production record — <presenter>, <n> segments, delivered <date>, and what this run cost and taught
metadata:
  type: project
---

Produced with the `eximious-production` skill on <absolute date>. Presenter profile:
[[eximious-presenters-locked]]. Pipeline: [[eximious-production-pipeline-locked]].

## Identity

| | |
|---|---|
| Lesson id / media key | `<lesson-id>` |
| Registry slug | `<slug>` — **state it even if it matches; claims-01's does not** |
| Course / track | |
| Presenter | |
| Segments | |
| Delivered duration | |
| Correct answers | D1= · D2= · D3=  (or "player-native, 3/3") |
| Rejoin segments | |

## Gates

| Gate | Result |
|---|---|
| A — audio | <n>/<n> rows, all segments · any `duration` failures and their explanation |
| B — motion / driving base | reused / rebuilt · which base, which sha256 |
| C — delivered asset | <n>/<n> · any accepted tolerance, named |
| D pt 1 — driven acceptance | **__/18** |
| D pt 2 — real devices | **HELD** — state plainly whether it ran |
| Thinkific upload | **HELD** — state plainly whether it happened |

## Batching

| | |
|---|---|
| Calls | |
| Longest call | |
| Driving base and its duration | |
| Frame assertion `frames == blocks × 16` | pass / fail per call |
| Canaries run | which, and what they showed |
| Re-runs | how many, why, and what they cost |

## Spend

| Item | Projected | Actual |
|---|---|---|
| TTS | | |
| Lip-sync | | |
| Other | | |
| **Total** | | |

Against the **$3.40** model. If it exceeded **$5.62**, say why in one sentence.

## Deliverables

| | |
|---|---|
| Package | `EA_<slug>_AV<n>.zip`, <size> MB (decimal), sha256 |
| Source | `EA_<slug>_AV<n>_source.zip`, <size> MB, <n> files, sha256 |
| Re-encode cap | `EXPORT_MAX_VIDEO_MBPS=` |
| PSNR vs masters | |
| Three invariants | masters byte-identical <n>/<n> · audio `-c:a copy` · video 1920×1080/25 fps |

## Accepted / open at release

List each, with who accepted it and on what evidence. Do not soften anything.

## What this run TAUGHT

**The most important section. Skip it and the skill stops improving.**

- A new failure mode → add it to `reference/known-failures.md` **and**
  [[eximious-known-mistakes]].
- A measurement that contradicts a recorded constant → say which, with the measurement.
- A presenter-specific behaviour → update that presenter's profile in `presenters/`.
- A price that has moved → update `reference/cost-controls.md` and
  [[eximious-cost-controls]].
- Nothing new → write "nothing new" explicitly. That is itself a useful signal, and three
  consecutive "nothing new" runs are what would justify enabling parallel batch execution.

Related: [[eximious-pilots-delivered]], [[eximious-qa-gates]],
[[eximious-lipsync-batching-executed]].
```

## Rules for writing it

- **Absolute dates**, never "yesterday" or "last week".
- **Measure, do not derive** every number in it.
- **Decimal MB**, not MiB.
- **Name what did not happen.** "Real devices: not run" is a finding. "Gate D: passed" without
  saying which half is a false claim.
- If a figure disagrees with an existing memory, **say so in the record** and correct the
  memory — do not leave two numbers standing.
