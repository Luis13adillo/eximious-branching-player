# Presenter 2 & 3 — Voice Approval Candidates

> ## ⚠️ IDENTITY UPDATE — read first
>
> **Roger has since APPROVED the Presenter 2 and Presenter 3 identities and their
> visuals.** The locked identities are:
>
> - **Presenter 2 — Curtis Whitfield** · Investigation & Fraud · 32 courses
> - **Presenter 3 — Selena Navarro** · Professional Practice & Business · 42 courses
>
> **"Simone" — the working first name used for Presenter 3 throughout the document
> below — is SUPERSEDED by Selena Navarro.** The Simone material is retained here as
> the accurate historical record of what was submitted for approval; it is **not** the
> current Presenter 3 identity. Filenames containing `simone` are likewise historical.
>
> Approved-appearance reference files (registered, unaltered):
> `public/media/presenter-2-curtis-whitfield-master.png` ·
> `public/media/presenter-3-selena-navarro-master.png`
>
> ⚠️ **Those two files are 1672×941 — below the 1920×1080 floor. They are approved
> APPEARANCE references, not production-resolution masters.** Compliant 1920×1080+
> masters are still to be produced and registered.
>
> ~~The voice candidates below are unaffected by that approval and remain candidates.~~
> **SUPERSEDED — voices are now APPROVED and LOCKED. See the box immediately below.**
> (Visual-master resolution, §7 F‑1, remains a separate open item.)
>
> ## ✅ VOICES NOW APPROVED AND LOCKED — both presenters
>
> Roger has selected both presenter voices from blind auditions. **This document's
> subject matter is CLOSED.** Everything below it is superseded history.
>
> | | Presenter 2 — Curtis Whitfield | Presenter 3 — Selena Navarro |
> |---|---|---|
> | **Status** | **APPROVED / LOCKED** | **APPROVED / LOCKED** |
> | Provider | OpenAI | OpenAI |
> | Model | **`tts-1-hd`** (Diane's pipeline) | **`gpt-4o-mini-tts-2025-12-15`** (pinned) |
> | **Voice** | **`onyx`** | **`sage`** |
> | Delivery control | none (`tts-1-hd` has no `instructions`) | `instructions` string — part of the locked definition |
> | Speed | 1.0 | model default |
> | Selected audio | `public/media/presenter-2-curtis-whitfield-voice-SELECTED.mp3` | `public/media/presenter-3-selena-navarro-voice-SELECTED.mp3` |
> | SHA-256 | `8e26f505…b1439f` | `803de3e5…c96bb2` |
> | Duration · loudness | 15.58 s · −24.49 LUFS | 21.05 s · −24.49 LUFS |
> | Audition origin | blind casting `Curtis-A` | blind casting `Selena-A` |
> | Format | mp3 · 24 kHz · mono · 128 kbps | mp3 · 24 kHz · mono · 128 kbps |
>
> ⚠️ **Selena sits on a DIFFERENT MODEL from Diane and Curtis.** This is a deliberate,
> client-approved exception — `tts-1-hd` has no `instructions` parameter and its female
> roster was exhausted against Selena's casting brief. Recorded as **F‑6** in
> `EXIMIOUS_PRODUCTION_SPEC.md` §7.
>
> **Reproducibility:** Selena requires model + voice **+ the exact `instructions` string**.
> Curtis requires model + voice + speed. Both are recorded in their `*-SELECTED.json`
> sidecars. Selected audio for both is preserved byte-for-byte and was never re-encoded.
>
> **Casting history:** Selena's voice went through four rounds — `tts-1-hd` blind
> (alloy/fable/nova/sage, all rejected), `coral` (too mature), `marin` × 3 on
> `gpt-4o-mini-tts` (rejected), then the final OpenAI round that produced `sage`. Note
> that `sage` was rejected in round one on `tts-1-hd`; it won on `gpt-4o-mini-tts` once
> delivery could be directed. That is the practical argument for the `instructions`
> parameter, and the reason for the model split.
>
> ---
>
> ⛔ **PIPELINE CORRECTION — the demos in this document are superseded experiments.**
> They were generated on **`gpt-4o-mini-tts`**, which is **not** the project's accepted
> voice pipeline. **Diane's accepted production narration uses `tts-1-hd`**, which this
> project switched to precisely because `gpt-4o-mini-tts` produced a masculine-onset
> defect on `shimmer` (commit `6692f8a`).
>
> **Outcome, now settled:** Curtis was cast on **`tts-1-hd`** (`onyx`) as this box
> directed. **Selena could not be** — `tts-1-hd`'s female roster was exhausted against
> her brief, and the model offers no `instructions` control, so she is cast on
> **`gpt-4o-mini-tts-2025-12-15`** (`sage`) by client-approved exception. The
> masculine-onset defect was explicitly QA-tested for on every Selena candidate and did
> **not** reproduce — it was a `shimmer`-specific fault, not a model-wide one. Both
> presenters are mp3, 24 kHz, mono, 128 kbps, matched to **−24.5 LUFS**. The superseded
> `ash` / `sage` audio files are retained unchanged as historical record.

**Status:** ~~Voice candidates submitted for Roger's approval. **Voices not approved. Not
production media.**~~ ⛔ **SUPERSEDED — both voices are APPROVED and LOCKED** (see the
box at the top of this file). This line records the document's state when written. Identities and visuals **are** now approved (see the box above).
At the time this document was written, voice only — no avatar imagery, no biography,
no visual direction had been created.

This closed the audio half of what was then the only remaining open client approval in
`EXIMIOUS_PRODUCTION_SPEC.md` §6 (Presenter 2 & 3 identities), per Video Production
Spec §2: _"Propose names for Presenters 2 and 3 with the pilot and I'll approve them."_
The identity half has since closed as recorded above.

---

## Route selected

> ### ⛔ CORRECTION — this section was wrong. Superseded.
>
> **The route recorded below (`gpt-4o-mini-tts`) is NOT the project's accepted voice
> pipeline, and the demos generated from it are superseded experiments.**
>
> **Diane's final accepted production narration uses `tts-1-hd`.** Traced from the
> repository, not from memory:
>
> - `src/lib/lessons/claims-investigation-application-1.ts:66` —
>   `shimmer voice (OpenAI tts-1-hd) → InfiniTalk`
>   *(quoted as it read on 2026-08-18. **That source comment has since been corrected**
>   and now reads `… → fal-ai/latentsync against Diane's reusable motion base → trim →
>   remux the locked master`. Only the `tts-1-hd` half of the citation is still current.)*
> - commit **`6692f8a`** — *"Fixes the prior masculine-onset voice glitch
>   (**switched to tts-1-hd shimmer**)."*
> - commit **`3e21386`** — shipped all production narration
>   (`assignment.mp3`, `fb-*.mp3`, `resolution-1.mp3`) at 24 kHz / mono / 128 kbps.
>
> **`gpt-4o-mini-tts` was tried on this project and abandoned for a quality defect** — a
> masculine-onset glitch on `shimmer`. `tts-1-hd` was the fix that resolved it. The
> section below inverted this: it listed `tts-1-hd` as a *rejected alternative* on cost
> and "legacy generation" grounds, and never recorded that the cheaper model had already
> failed here on quality.
>
> ⛔⛔ **STOP — THIS TABLE IS ITSELF SUPERSEDED. DO NOT PRODUCE FROM IT.**
> It was written on 2026-08-18 *before* the media pipeline was locked and before
> Selena was cast, and it is wrong in three ways that cost money:
>
> 1. **Lip-sync engine.** `InfiniTalk` (KIE) is **dead** — 720p maximum against a
>    contractual 1920×1080 floor, at ~12× the cost. The locked engine is
>    **`fal-ai/latentsync`**, driven by a reusable per-presenter Kling motion base.
> 2. **Audio handling.** LatentSync's returned audio (AAC 16 kHz) is **DISCARDED**
>    and the locked 24 kHz / −24.5 LUFS master is **remuxed** (locked rule 4).
>    Audio is *not* "baked in" by the lip-sync model.
> 3. **Not all three presenters share a model.** **Selena Navarro is on
>    `gpt-4o-mini-tts-2025-12-15` (`sage`) + a locked `instructions` string**, by
>    client-approved exception (spec §7 F‑6). Only Diane and Curtis use `tts-1-hd`.
>
> **Canonical source: `CLAUDE.md` (★ LOCKED) and the per-presenter table at the top
> of this file.** The table below is retained only as the historical record of the
> reasoning that retired `gpt-4o-mini-tts` *as a default*.
>
> ~~**Accepted pipeline — use this for all three presenters:**~~
> **Historical — the 2026-08-18 voice-model reasoning, superseded as above:**
>
> | | |
> |---|---|
> | Provider | **OpenAI** |
> | Model | **`tts-1-hd`** |
> | Diane's voice | `shimmer` (established; not reused for Presenters 2 or 3) |
> | Format | **mp3, 24 kHz, mono, 128 kbps**, speed 1.0 |
> | Loudness | **−24.5 LUFS** (Diane's measured narration level) |
> | Downstream | ~~InfiniTalk (KIE, not HeyGen) lip-sync; audio baked into the mp4~~ ⛔ **SUPERSEDED — the locked route is `fal-ai/latentsync` over a Kling motion base, with the returned audio discarded and the 24 kHz master remuxed.** |
>
> **Consequence for delivery control:** `tts-1-hd` has **no `instructions` parameter**.
> The written delivery instructions recorded below cannot be applied on the accepted
> pipeline. Presenter character must come from **voice selection and script punctuation**.
> This is a real cost of staying on the proven pipeline, and it is accepted deliberately:
> **consistency and proven quality outrank cost and delivery-scripting convenience.**
>
> Everything below is retained as the historical record of the superseded experiment.

_Historical record of the superseded `gpt-4o-mini-tts` experiment follows._

| | |
|---|---|
| Provider | **OpenAI** (already the project's voice provider — Diane is OpenAI TTS) |
| Model | ~~**`gpt-4o-mini-tts`**, pinned snapshot **`gpt-4o-mini-tts-2025-12-15`**~~ — **SUPERSEDED; see correction above** |
| Format | mp3, 24 kHz, mono, 128 kbps |
| Rate | ~$0.015 per minute of audio |

**Why this route.** It is the lowest-cost option among the credentials this project
already holds, and it is the only one that also satisfies Agreement §7.1 continuity.
Keeping all three presenters on one provider gives the 267-video catalog a single
licensing chain and a single deprecation surface. The `instructions` parameter lets
each presenter's delivery be written down and reproduced exactly — which is what makes
Spec §2's "one distinct voice, held constant across five tracks" actually enforceable
over a multi-year run.

> ⛔ **The paragraph above is unsound as written.** Cost was treated as the deciding
> factor; it is not. Diane already sits on `tts-1-hd`, so "one provider, one licensing
> chain" was satisfied either way — but **model** continuity was broken, not preserved,
> by moving Presenters 2 and 3 to a model Diane does not use and that failed here.

**Rejected alternatives.** ~~`tts-1-hd` (Diane's current model): 80% more expensive
per minute, legacy generation, and no `instructions` delivery control.~~ **← WRONG.
`tts-1-hd` is the ACCEPTED pipeline, not a rejected alternative. Its higher cost is
accepted; its lack of `instructions` control is a known, accepted constraint.** Google Gemini
TTS: cheap, but preview-tier models are not defensible under §7.1's "reasonably expected
to remain available." Kokoro-82M local (free, Apache-2.0): perfect continuity, but the
quality bar is below a paid enterprise catalog and it would make Presenters 2 and 3
sound categorically unlike Diane.

---

## Presenter 2 — Investigation & Fraud

Tracks 5, 7, 8, 9, 15 · 32 courses · pilot `siu-01` AV1

| | |
|---|---|
| Name | **Curtis Whitfield — APPROVED / LOCKED.** (Proposed here as first name "Curtis" only; Roger has since approved the full name.) |
| Voice | ~~**`ash`** — male, direct, grounded~~ · **SUPERSEDED EXPERIMENT** (`ash` exists only on `gpt-4o-mini-tts`). ✅ **RESOLVED — Curtis is LOCKED on `tts-1-hd`, voice `onyx`, speed 1.0.** Selected from blind casting `Curtis-A`; see the approved table at the top of this file. No replacement candidate is outstanding. |
| Asset | `public/media/presenter-2-curtis-voice-approval.mp3` |
| Approved appearance — reference file | `public/media/presenter-2-curtis-whitfield-master.png` (1672×941 PNG, unaltered) — ⚠️ **below the 1080p floor; not a production-resolution master** |
| Duration | 15.12 s |

**Script excerpt — REDACTED.** The audition text is a verbatim contiguous passage from the
`siu-01` AV1 pilot script (assignment block). It is confidential client content and is not
reproduced in git. The same passage was used for **every candidate for this presenter**,
which is what makes the blind comparison valid. Read it from `docs/source/pilot-scripts.pdf`
or from `docs/confidential/PRESENTER_VOICE_APPROVAL.unredacted.md` — both local-only and
git-ignored. *Production detail preserved: numeric dates are spoken as ordinals for TTS.*

**Delivery instruction (part of the locked presenter definition if approved):**

> Speak as a seasoned special-investigations professional briefing a colleague on a
> live file. Measured, factual, unhurried — about 145 words per minute. Even, grounded
> delivery: no theatricality, no salesmanship, no rising interrogative lift at line
> ends. Let dates, figures and place names land clearly, with a small pause after each.
> Serious, but not grim.

**Fit.** SIU work is procedural restraint — the script's whole first decision is that
the investigator is *not* the jury. A flat, unshowy male read carries that. It also
satisfies Guidelines §02 "professional guidance, not performance."

---

## Presenter 3 — Professional Practice & Business

Tracks 2, 3, 11, 13, 14 · 42 courses · pilot `ew-01` AV1


> ### ⚠️ SUPERSEDED 2026-08-22 — Selena Navarro was RECAST
>
> Everything below about Presenter 3's voice describes the **retired** definition
> (OpenAI `gpt-4o-mini-tts-2025-12-15` / `sage` / the 1133-character `instructions`
> string). **Roger approved a recast on 2026-08-22** to a MiniMax voice-design voice
> served through fal — `fal-ai/minimax/speech-02-hd`, `voice_id`
> `ttv-voice-2026082200132526-qth65Vqj` ("LA-1-mexican-american"). That was a production
> **rule 9 provider *and* model change** as well as a client recasting decision; both were
> approved together.
>
> **Current definition:** `CLAUDE.md` → "★ RECAST 2026-08-22", and
> `public/media/presenter-3-selena-navarro-voice-SELECTED.json`.
> The retired definition is preserved verbatim in
> `…-voice-SELECTED-v1-sage-superseded.json` so the audio that shipped on 2026-08-21
> stays reproducible. The text below is kept as the historical approval record — do not
> act on it.

| | |
|---|---|
| Name | **Selena Navarro — APPROVED / LOCKED.** ⚠️ **Supersedes the working first name "Simone"** used throughout this section and in the demo filenames below. |
| Voice | ✅ **`sage` is LOCKED — but on `gpt-4o-mini-tts-2025-12-15`, not `tts-1-hd`.** The earlier note here (that `sage` was a dead experiment awaiting a `tts-1-hd` replacement) is **wrong and superseded**: `tts-1-hd`'s female roster was exhausted against Selena's brief and offers no `instructions` control, so she is cast on `gpt-4o-mini-tts-2025-12-15` by client-approved exception (spec §7 F‑6). **Her `instructions` string is part of the locked definition — read it byte-exact from `presenter-3-selena-navarro-voice-SELECTED.json`.** No replacement candidate is outstanding. |
| Asset | `public/media/presenter-3-simone-voice-approval.mp3` *(historical filename — rendered under the superseded "Simone" working name; the voice itself is independent of the name)* |
| Approved appearance — reference file | `public/media/presenter-3-selena-navarro-master.png` (1672×941 PNG, unaltered) — the final **tighter seated-desk** version for the **speaking video**; approved office/window environment and appearance preserved exactly. ⚠️ **Below the 1080p floor; not a production-resolution master** |
| Standing version | Designated for **course pages / title cards only** — not the speaking video. Not yet present in `public/media/`; still to be supplied and registered at 1920×1080+ |
| Duration | 17.30 s |

**Script excerpt — REDACTED.** The audition text is a verbatim passage from the `ew-01` AV1
pilot script (WHO YOU ARE block), with one intervening sentence elided (marked "…") to hold
the demo inside the brief. It is confidential client content and is not reproduced in git.
The same passage was used for every candidate in the round, which is what makes the blind
comparison valid. Read it from `docs/source/pilot-scripts.pdf` or from
`docs/confidential/PRESENTER_VOICE_APPROVAL.unredacted.md` — both local-only and git-ignored.

**Delivery instruction (part of the locked presenter definition if approved):**

> Speak as an experienced expert witness setting out her own qualifications to a peer.
> Calm, precise and composed — about 145 words per minute. Low, even energy;
> understated authority rather than warmth or brightness. Clean articulation,
> deliberate pacing, brief pauses at clause boundaries. Never chatty, never dramatic.
> The final line is stated as plain fact, not as a boast.

**Fit.** The expert-witness track is about credibility that survives cross-examination.
`sage`'s understated, low-affect register reads as composure rather than persuasion —
and it sits well below Diane's brighter, warmer `shimmer` in energy.

---

## Distinctness

| Presenter | Voice | Register |
|---|---|---|
| 1 · Diane Marchetti | `shimmer` on **`tts-1-hd`** (established, accepted) | female, bright, warm |
| 2 · Curtis Whitfield | **`onyx` on `tts-1-hd`** — LOCKED (`ash` was the superseded experiment) | male, direct, grounded |
| 3 · Selena Navarro *(was "Simone")* | **`sage` on `gpt-4o-mini-tts-2025-12-15`** + locked `instructions` — LOCKED | female, calm, low-energy |

~~⛔ **This distinctness analysis is void.** It compared voices that do not exist on the
accepted `tts-1-hd` pipeline. It must be redone against the voices actually available
on `tts-1-hd`.~~
✅ **RESOLVED — the redo happened and Roger selected from it.** The final casting was run
as blind auditions against Diane's `shimmer` as the fixed reference, producing **Curtis =
`onyx` (`tts-1-hd`)** and **Selena = `sage` (`gpt-4o-mini-tts-2025-12-15`)**. Nothing here
is outstanding; the table above now shows the locked voices.

Curtis vs. the other two: unambiguous (different sex). Curtis vs. Selena: unambiguous.
**Diane vs. Selena is the one pair Roger should A/B himself** — both are female. They
differ clearly in brightness and energy, but that judgment is his, not a measurement.
If he finds `sage` too close to `shimmer`, `coral` (warmer, rounder) and `alloy`
(neutral, cooler) are the fallbacks; re-rendering a demo costs under a cent.

Both demos were level-matched to **-25.0 LUFS** — Diane's existing narration segments
measure -24.5 LUFS — using linear gain only, so the comparison is of voice and not
volume. Dynamics are untouched.

> **Corrected for the replacement demos:** the target is **−24.5 LUFS**, matching Diane
> exactly rather than sitting 0.5 dB under her. Linear gain only, dynamics untouched.

---

## Licensing & continuity assessment

**Agreement §8.5 / §7.1 — commercial use.** OpenAI's terms assign output ownership to
the API customer, with no per-use royalty and no restriction on resale of derived
works, which covers "Company's paid courses, including resale to enterprise and
institutional customers." OpenAI's preset voices are studio recordings made with
compensated voice actors, not clones of an identifiable person — so there is no
right-of-publicity exposure and no third-party voice licence to maintain. §8.5's
no-infringement representation is supportable.

OpenAI's usage policy requires disclosing that a synthetic voice is AI-generated. The
locked template already carries the approved AI-disclosure line on every application
video, so the catalog is compliant by construction.

**Agreement §7.1 — expected to remain available.** These are named preset voice
identifiers, stable since OpenAI's TTS launch and carried forward across model
generations. ~~Pinning the dated snapshot `gpt-4o-mini-tts-2025-12-15` means the exact
acoustic behaviour is reproducible for as long as that snapshot is served, rather than
drifting under us mid-catalog.~~

> **Corrected.** The accepted pipeline is **`tts-1-hd`**, which is itself a stable
> pinned model identifier — no dated snapshot suffix is required. Reproducibility across
> the 267-video catalog rests on `tts-1-hd` + voice + `speed` being recorded in each
> asset's sidecar `.json`. **Diane, Curtis and Selena all sit on the same model**, which
> is stronger §7.1 continuity than the superseded route offered: it splits the catalog
> across one model, not two.

**Agreement §7.2 — discontinuation risk.** Real but low, and it is the same risk
already accepted for Diane. Mitigations in place: (a) the full generation parameters
for every asset are stored in a sidecar `.json` next to it, so any segment can be
re-rendered identically; (b) the raw narration audio ships as discrete source files
per A §2.3, so the catalog does not depend on the API staying up to remain usable;
(c) if a voice is retired, the written delivery instruction transfers to a replacement
voice, which makes finding a "substantially equivalent replacement" a tractable job.

---

## Cost

| Item | |
|---|---|
| Audio synthesized (incl. one discarded 22.1 s take) | 54.5 s ≈ 0.91 min |
| Text + instruction tokens | ~400 |
| **Estimated total** | **~$0.014** |

Computed from OpenAI's published rates (~$0.015/min audio; $0.60/1M text input tokens),
not read from the billing dashboard — that needs an admin key this project doesn't hold.

> **Superseded — this costing is for the abandoned `gpt-4o-mini-tts` route.** The
> accepted `tts-1-hd` pipeline is billed **per character** (~$30 / 1M characters), not
> per minute, and costs meaningfully more. **That higher cost is accepted:** consistency
> with Diane's proven quality outranks per-minute savings. Cost is not a deciding factor
> for presenter voice selection on this project.

---

## Open items (not resolved by these demos)

1. ~~**Surnames.** Spec §2 requires "a professional first and last name" for each
   presenter. Only first names — Curtis and Simone — were supplied.~~
   **RESOLVED.** Roger approved the full names **Curtis Whitfield** and **Selena
   Navarro** (the latter superseding the "Simone" working first name). Spec §2's
   first-and-last-name requirement is now met for all three presenters.
2. ~~**Reference imagery.** Guidelines p8 holds Presenters 2 and 3 at "Pending client
   approval. No identity, visual direction, biography, or reference imagery may be
   invented." Nothing visual was created here, by design.~~
   **RESOLVED as to approval.** Roger approved the identities *and* the visual
   direction. The approved appearance is registered unaltered at
   `public/media/presenter-2-curtis-whitfield-master.png` and
   `public/media/presenter-3-selena-navarro-master.png`. Guidelines p8's "pending
   client approval" hold is discharged for both presenters.
2a. **STILL OPEN — production-resolution masters.** The two registered files are
   **1672×941**, below the 1920×1080 floor in A §1.4.1 / B §6, so **no
   production-resolution master exists for either presenter.** Compliant 1920×1080+
   masters reproducing the approved appearance exactly must be produced and registered
   before pilot render; the existing files must not be altered or upscaled in place.
   Selena's standing course-page/title-card asset is also unregistered. Tracked as
   **F‑1** in `EXIMIOUS_PRODUCTION_SPEC.md` §7 and §4 C‑12a. **Blocks pilot render.**
2b. **STILL OPEN — voices.** The `ash` and `sage` candidates above remain **unapproved**.
   Roger's approval covered identities and visual direction only. This is the remaining
   open **client approval** in `EXIMIOUS_PRODUCTION_SPEC.md` §6.
3. **Observation, not fixed:** Diane's existing narration assets are inconsistently
   levelled (`intro-vo.mp3` -21.3 LUFS vs `fb-*.mp3` / `resolution-1.mp3` -24.5 LUFS).
   A single loudness target belongs in the production standard before the 267-video run.
   Diane was not modified.

## Source-precedence note

Guidelines (E) p8 says Presenters 2 and 3 may not be "invented." Video Production Spec
(B) §2 — which outranks E — directs that names be *proposed with the pilot* for
approval. These demos are that proposal: approval candidates, carrying no invented
biography, visual direction, or imagery. Flagged rather than silently reconciled.

**Now discharged.** Roger has approved the identities and visuals, so nothing about
Presenters 2 and 3 rests on invention: **Curtis Whitfield** and **Selena Navarro** are
client-approved names with client-approved visual masters. E p8's "pending client
approval" hold no longer applies to them.
