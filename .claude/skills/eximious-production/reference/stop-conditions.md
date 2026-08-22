# Stop conditions, retry rules and escalation

## Hard stops — stop and ask, never work around

**Sources and scope**
- A controlled source conflicts with another controlled source, or with the code.
  **Flag it. Do not reconcile it silently.**
- Narration text cannot be traced to the authoritative script.
- A lesson would need a component change rather than data.
- A change would alter a locked behaviour: the start gate, the colour roles, the AI-disclosure
  wording or placement, the "Course Presenter" lower-third, the identity-acknowledgement
  cadence, or the presence-check budget.

**Gates**
- Gate A fails any row that is not the explained `duration` case.
- Gate B fails any row outside the accepted blink-rate tolerance.
- Gate C fails any row that is not on the accepted-tolerance list in `known-failures.md`.
- `returned frames != blocks × 16` on any call.
- Gate D half 1 reports fewer than 18/18 — **after** verifying the harness itself.

**Money**
- Projected spend exceeds the quoted figure.
- Per-video spend would exceed **$5.62**.
- A paid call would run without a `--dry-run` first and an explicit go.
- The KIE credit balance has not been checked before a Kling run.

**Assets**
- Anything would modify an approved master in place.
- A presenter has no QA-passed motion base, or no driving base longer than the longest
  planned call.
- A batch plan violates any of its three hard constraints.
- A defect is found in a delivered asset whose raw LatentSync return is **no longer on disk**.
  The fix is now paid, not free — **that is Luis's decision, not yours.**

**Confidentiality**
- Anything confidential would reach a committed file, a public URL, or an anonymous host.
- A sidecar about to be committed contains `batch_audio_url`, `hosted_at` or `image_url`.

## The retry rule

**A paid re-run is ONLY justified when the return itself is unusable** — wrong block count, or
too little tail to split.

It is **never** justified for a UI, caption, colour, routing, scoring or packaging change.
That is pipeline rule 8 doing its job.

**A re-cut of a segment whose raw LatentSync return is still on disk costs $0.00** — no
regeneration, no replanning, the batch plan and offsets untouched.

**Motion-base retries:** generate one, QA it, and only buy another if it fails. Before buying,
ask **"is the defect confined to a window?"** — a partial pass is usable, and that question
saved a take on Curtis. When you do retry, strengthen **only** the constraints that actually
failed, and escalate `cfg_scale` rather than rewriting the prompt.

## Escalate to Luis, do not decide alone

- Accepting a new tolerance, or re-raising an existing accepted one.
- Any spend above the quoted plan.
- Any change to a locked presenter definition, provider, model or template behaviour.
- Any finding that would change what was already delivered to the client.
- Anything that needs Roger: exhibit photographs, the opening-frame mouth position, the
  synthesised claims-01 frame, AI-disclosure scope, presenter names on the hub.

## Never claim

- A real-device pass. It has not happened on any pilot.
- A Thinkific upload. It has never happened, by any route.
- That the Admin API can or cannot upload an HTML5 package. **Unknown.**
- That a harness failure is real before verifying the harness.
- A cost figure whose units you have not checked.
