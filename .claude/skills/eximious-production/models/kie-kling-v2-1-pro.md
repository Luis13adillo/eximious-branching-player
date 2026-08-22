# kling/v2-1-pro (KIE) — presenter motion base

Generates the short silent clip that a driving base is built from. **Run once per presenter,
ever** (pipeline rule 7). A new base is required only if Roger changes an approved
appearance — which is a new approval, not a technical decision.

| Field | Value |
|---|---|
| Model ID | `kling/v2-1-pro` |
| Provider | **KIE** |
| Method | **Async** — createTask, then poll |
| Type | Image → video |
| API key | env `KIE_API_KEY`, header `Authorization: Bearer {KIE_API_KEY}` |
| Cost | **50 credits = $0.25 at `duration: 5`** · 100 credits = $0.50 at `duration: 10`. KIE credit = $0.005 |

**Prefer 5 seconds.** The driving base only needs one clean, **re-enterable** blink. Diane's
10 s clip cost twice as much and did not buy a better base.

**Check the KIE credit balance before any run.** 50 credits went unaccounted for twice
between Selena's takes with no generation call in between. If that is delayed settlement,
the true per-take price is **$0.50, not $0.25**. Unresolved.

## Endpoint

```
POST https://api.kie.ai/api/v1/jobs/createTask
Authorization: Bearer {KIE_API_KEY}
```

## Request format

```json
{
  "model": "kling/v2-1-pro",
  "input": {
    "prompt": "<presenter prompt — see below>",
    "image_url": "<the 1920x1080 production still>",
    "duration": 5,
    "negative_prompt": "<generic, reused unchanged>",
    "cfg_scale": 0.8
  }
}
```

**There is NO `seed` parameter.** Inputs are `prompt`, `image_url`, `duration`,
`negative_prompt`, `cfg_scale` and nothing else. A retry is a plain re-draw and is **not
reproducible**, so **the accepted clip is the artifact of record** — store it, checksum it,
and store its prompt in the sidecar.

The canonical prompt shapes are in the accepted sidecars, e.g.
`public/media/presenter-2-curtis-whitfield-motion-base-take2.json` → `request.input.prompt`.
Copy from there; do not rewrite from memory.

## Response handling

`createTask` returns a `taskId`. Poll the job-status endpoint until it completes, then
download the result. Record `taskId`, the full request, the cost and the QA verdict in the
sidecar beside the mp4.

## `cfg_scale` is the escalation lever

It governs adherence to the conditioning **including the negative prompt**. Raising it is
the tool for **suppressing** unwanted motion — it is not a risk factor for it.

| Presenter | Passed at | History |
|---|---|---|
| Diane | **0.5** | 1 of 4 draws passed |
| Selena | **0.8** | take 1 failed on presenter motion, take 2 rejected for a push-in |
| Curtis | **1.0** | take 1 at 0.8 pushed in to 1.18× *and* opened his mouth |

Escalate only against an **observed** failure, and strengthen only the constraints that
actually failed. **The negative prompt has a documented ~500-character limit**, so adding
terms means dropping others — drop only terms redundant with one that stays, or that guard
a failure this take showed no sign of. Curtis's take 2 dropped five to add four.

## Prompt requirements — each tied to an observed failure

- **Camera: state it as an OUTCOME, not a list of negatives.** "The framing at the last frame
  is identical to the first: same crop, same distance, same position in frame." The locked
  prompt already forbade zoom/pan/tilt/drift and still drifted 3 times in 4.
- **Blinking: make it countable.** "Roughly every three to four seconds — neither rapid
  fluttering nor a fixed stare." "A relaxed human rate" produced 41.8, 17.9, 12.0 and 6.0.
- **Mouth: name the jaw.** "Lips stay closed and together for the entire clip, and the jaw
  does not move."
- Subtle breathing and micro head-posture settling. Hands composed. No change to face,
  wardrobe, room, lighting or framing.
- **Rewrite three sentences per presenter, reuse the rest verbatim**: the opening
  description, the hands sentence, the set-dressing sentence — each written against that
  presenter's actual still. Both Curtis's and Selena's frames carry Eximious lettering that
  an unqualified "no text" would erase.

## Notes

- **Generate ONE, QA it, buy another only if it fails.** Expect roughly **1 in 4** clean.
  Four blind draws cost $2.00; the QA is free and takes about two minutes.
- **A PARTIAL pass is usable.** Ask "is the defect confined to a window?" before spending
  again. Curtis's take 2 failed one of twelve rows, confined to frames 5–40, and frames
  41–121 became his production base with no take 3 bought.
- **Kling lifts exposure** (~9.5% on Diane). The correction is a per-frame **multiplicative
  gain** applied in **16-bit** (`format=gbrp16le`) — an 8-bit round trip costs 0.32/255 of
  identity versus 0.003/255 at 16-bit. **Conditional, not automatic**: Curtis's drift was
  smaller than his clip's own frame-to-frame noise, so correcting it would have been damage.
- **Rename a failed take immediately** — `…-takeN-REJECTED.mp4` — so it can never be picked
  up as the base for 51 courses.
- **Prompt from the requirement, not the document.** CONFIG 1's "holding still and listening
  between takes" is a minimal-motion prompt and produced 0.42 px head RMS on Diane. If
  liveliness is the standard, that needs a movement-positive prompt that still keeps the
  lips closed and puts a blink inside the moving passage.
