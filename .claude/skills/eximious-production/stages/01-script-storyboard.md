# Stage 1 — Script and storyboard validation

**Cost $0.00. No gate, but a mistake here propagates through every paid step below.**

## What you are validating

The approved storyboard for **this** course's application video, against the controlled
sources. The skill produces whatever approved lesson it is given — no pilot content is
baked in anywhere.

## Steps

1. **Identify the course, its track, and therefore its presenter.**
   Tracks 1/4/6/10/12 → Diane · 5/7/8/9/15 → Curtis · 2/3/11/13/14 → Selena.
   Read that presenter's profile in `../presenters/` before anything else.

2. **Transcribe narration VERBATIM from the authoritative script.** Never retype it, never
   paraphrase it, never "improve" it. Slice it out of the source by anchor and cross-check
   two independent extractions against each other character for character. Record a
   `scriptSha256` per segment so drift is detectable later.

3. **Bracketed `[On screen: …]` cues are VISUAL DIRECTION, not narration.** They are never
   spoken. This is the rule that keeps the three correct-answer verdicts player-native:
   the scripts write the confirmation only as `[On screen: Correct]`. The water-damage demo
   spoke it — **the demo does not override the script**, and this is why claims-01 ships 22
   segments and not 25.

4. **Watch for extraction artifacts in the text layer.** A bold face with no ligature glyph
   mapping renders "fi" as the digit `0`. siu-01 had exactly three sites
   ("0rst" → "first", "0le" → "file", "0ne" → "fine"). Confirm every repair against the
   rendered page, and assert that no other digit sits adjacent to a letter.

5. **Segment splits follow the script's own `[On screen: …]` cues**, not your judgement.

6. **Cross-check the character count per segment against the script.**

7. **Estimate duration at THAT PRESENTER'S measured chars/sec** — Diane **15.81**,
   Curtis **15.89**, Selena **14.24**. A single global rate is ~12% wrong on Selena. It does
   **not** corrupt the batch plan — `plan-lipsync-batches.mjs` reads **measured** durations
   from the Gate A sidecars, never an estimate — but it mis-sizes your pre-flight cost
   estimate and it produces **false `duration` failures at Gate A** (12/25 on Selena). The
   estimator in `scripts/tts-narration.mjs` is still stale for Curtis and Selena.

8. **Confirm the confidential handling.** Script text belongs in
   `src/lib/lessons/<lesson>.narration.ts` and in narration audio. It must never reach a
   sidecar field that gets committed, a public URL, or a log.

## Stop conditions

- The script conflicts with the spec or the Agreement → **flag it and stop.** Do not
  reconcile it silently.
- Segment naming departs from Video Production Spec §3 → **flag it.** `assignment-1/-2` and
  `rejoin-1a/-1b` already do, and that is still unreconciled across the pilots.
- Any narration text cannot be traced to the authoritative script.

## Output

`src/lib/lessons/<lesson-id>.narration.ts` — a generated file, with per-segment `text`,
character count, `scriptSha256`, provisional `durationSec`, and derived captions. **Do not
hand-edit the narration strings; regenerate.**

Captions are **derived, not authored**: each cue is a contiguous slice of the verbatim text,
split on sentence boundaries (falling back to clause boundaries inside an over-long sentence,
absorbing any runt under 35 characters into its neighbour), allocated in proportion to
character count. No words added, cut or reordered. Cue text is final and reviewable now;
**only the numbers move**, at stage 11, when they are regenerated against the measured
delivered durations.

**Known limitation, accepted:** cue timing is proportional, not force-aligned. Drift on long
segments is expected. Worth recording if it reads badly on a phone.
