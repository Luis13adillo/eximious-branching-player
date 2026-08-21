import type { Lesson, MediaSource } from "@/lib/branching/types";
import { MEDIA_DELIVERED, NARRATION, type NarrationId } from "./siu-01-av1.narration";

/**
 * siu-01 · Application Video 1 of 2 — "The Referral That Arrives With a Verdict Attached"
 * ============================================================================
 * Course:    SIU Foundations & the Regulatory Framework (Track 5)
 * Presenter: Curtis Whitfield (Presenter 2) — appearance and voice LOCKED
 * Package:   EA_siu-01_AV1.zip
 * Covers:    Lessons 1–3
 *
 * AUTHORITY — every spoken line, every decision, every option and every piece
 * of on-screen cue text below comes from the authoritative SIU-01 pilot script
 * (`docs/source/pilot-scripts.pdf`, pp. 5–9). Nothing is invented, omitted,
 * reordered or reworded. The narration strings live in `siu-01-av1.narration.ts`
 * and were sliced out of the PDF by anchor rather than retyped.
 *
 * `headline`/`consequence` values are the script's own bracketed `[On screen:]`
 * cues, which its cover page defines as "visual direction, not spoken
 * narration" — so they are rendered by the player, never baked into video
 * (locked pipeline rule 8).
 *
 * SEGMENT DERIVATION — this is NOT copied from claims-01.
 * ----------------------------------------------------------------------------
 * The rule, read off the delivered claims-01 build: a segment boundary falls at
 * every bracketed on-screen cue, and all narration paragraphs between two cues
 * are ONE segment. (claims-01's `rejoin-1a`/`rejoin-1b` are split because a cue
 * sits between them, not because they are two paragraphs.)
 *
 * Applied to this script that gives 22 narration segments, by a different route
 * than claims-01 reached its 22:
 *
 *   intro                 1   [Title: …]
 *   assignment          + 2   two cues; each carries two paragraphs
 *   decisions           + 3
 *   feedback            + 9   12 options − 3 unspoken "Correct" beats
 *   rejoins             + 3   all three are single-cue here (claims-01 had 4)
 *   resolution          + 4   four cues (claims-01 had 3)
 *                      ────
 *                        22
 *
 * 25 scenes: the 22 above plus the three player-native correct beats.
 *
 * THE THREE CORRECT-ANSWER BEATS (`fb-1b`, `fb-2c`, `fb-3b`) CARRY NO MEDIA BY
 * DESIGN — this script, like claims-01, writes the confirmation only as
 * `[On screen: Correct]` with no narration, so there is nothing for Curtis to
 * say. Correct-state verdict is player-native UI (decision O-4, 2026-08-18).
 *
 * CORRECT ANSWERS ARE B / C / B here (claims-01's were D / B / B).
 *
 * NO GENERATED EXHIBIT IMAGES. Unlike claims-01 — whose script cues a
 * photograph — every on-screen exhibit this script names is a DOCUMENT (a
 * referral memo, a dealer record, a tabbed file). All are rendered by the
 * template's typographic exhibit and `A ≠ B` comparison components at $0.00,
 * approved 2026-08-20. Nothing here fabricates a record: the exhibits carry the
 * script's words, not a facsimile of a real document.
 *
 * NO FOUR-ICON REJOIN SUMMARY CARD. The template component exists and is
 * configurable, but claims-01 uses it only where the script's own cue names
 * four things ("Facts, coverage, damages, or timing"; "1. Issue 2. Burden
 * 3. Standard 4. Evidence"). None of this script's three rejoin cues does, so
 * supplying one would be inventing on-screen content.
 *
 * NO IN-VIDEO QUIZ. The script ends "[→ Continue to the next lessons]" and the
 * Agreement/Spec hand off to the graded COURSE quiz, which Thinkific owns.
 */

const PRESENTER = {
  name: "Curtis Whitfield",
  // The lower-third title is fixed at the template level ("Course Presenter",
  // Agreement §1.4) — this role never renders a credential.
  role: "Course Presenter",
};

/**
 * Curtis's approved, compliant 1920×1080 production still — the poster behind
 * every segment. Referenced, never modified (locked pipeline rule 6).
 */
const PRESENTER_POSTER =
  "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png";

/**
 * Binds one segment to a scene.
 * ----------------------------------------------------------------------------
 * GATE 0 STATE — no narration has been rendered yet, so `MEDIA_DELIVERED` is
 * false and every scene carries the placeholder stage over Curtis's approved
 * still, with the PROVISIONAL duration and the derived cues. The lesson is
 * fully playable and reviewable in that state; `useMediaClock` runs a simulated
 * clock so the scrubber, auto-advance and captions all behave as they will with
 * footage.
 *
 * At Gate D this becomes `{ provider: "file", videoUrl: seg.videoUrl, … }` with
 * the MEASURED duration, and nothing else in this file changes. Swapping media
 * in is a pure data change — that is the whole point of the template.
 */
function segment(id: NarrationId): MediaSource {
  const seg = NARRATION[id];
  return {
    provider: MEDIA_DELIVERED ? "file" : "placeholder",
    ...(MEDIA_DELIVERED ? { videoUrl: seg.videoUrl, hasAudio: true, loop: false } : {}),
    posterUrl: PRESENTER_POSTER,
    durationSec: seg.durationSec,
    captions: seg.captions.map((c) => ({ ...c })),
  };
}

/**
 * The correct-answer beat. The script writes it only as `[On screen: Correct]`
 * with no narration, so there is no segment to play and no media to load — the
 * verdict is player-native UI. Zero duration means the scene is immediately
 * "ended", so the continue control is live the moment it appears.
 */
function correctBeat(): MediaSource {
  return {
    provider: "placeholder",
    posterUrl: PRESENTER_POSTER,
    durationSec: 0,
  };
}

export const siu01Av1: Lesson = {
  id: "siu-01-av1",
  slug: "siu-01-av1",
  courseTitle: "SIU Foundations & the Regulatory Framework",
  title: "Case Application — You Have the File",
  subtitle:
    "Application Video 1 of 2 — The Referral That Arrives With a Verdict Attached",
  summary:
    "Work a live arson referral that arrives with the adjuster's conclusion already written on it. Three decisions, each with its own feedback branch and a retry until you get it right, then the correct reasoning and the resolution.",
  estimatedMinutes: 10,
  completion: {
    // The script's own rejoin-3 on-screen line.
    takeaway:
      "Reporting is a regulatory act. Denying is a claims act. They are not the same decision.",
    headlineAllCorrect: "You developed facts and routed them. That's the job.",
    headlinePartial: "The file resolves — carry the method forward.",
  },
  startSceneId: "intro",
  /**
   * LEARNER-FACING PROGRESS — 12 milestones over a 13-scene spine.
   * --------------------------------------------------------------------------
   * Only one grouping: `assignment-1` and `assignment-2` are split because the
   * script cues the referral memo between them, and the media pipeline splits
   * at cues. That split is production plumbing, not a teaching beat — both are
   * "here is the file" — so they are one milestone. Everything else stands
   * alone, because every other cue in this script opens a distinct beat.
   *
   * No scene is removed or merged — all 25 still play in full. `validateLesson`
   * fails the build if these milestones ever stop covering the spine exactly
   * once, so the rail cannot drift from the graph.
   */
  progress: [
    { id: "open", label: "You have the file", scenes: ["intro"] },
    {
      id: "assignment",
      label: "The assignment",
      scenes: ["assignment-1", "assignment-2"],
    },
    {
      id: "decision-1",
      label: "Decision 1 · Your actual job",
      scenes: ["decision-1"],
    },
    { id: "develops-facts", label: "An SIU develops facts", scenes: ["rejoin-1"] },
    {
      id: "decision-2",
      label: "Decision 2 · The elements",
      scenes: ["decision-2"],
    },
    {
      id: "elements",
      label: "Statement vs. physical evidence",
      scenes: ["rejoin-2"],
    },
    {
      id: "decision-3",
      label: "Decision 3 · The mandatory report",
      scenes: ["decision-3"],
    },
    { id: "reporting", label: "Reporting is not denying", scenes: ["rejoin-3"] },
    { id: "key-record", label: "The third key", scenes: ["resolution-1"] },
    { id: "the-file", label: "The file, tabbed", scenes: ["resolution-2"] },
    { id: "the-test", label: "The test", scenes: ["resolution-3"] },
    {
      id: "method",
      label: "Same method. Different answer.",
      scenes: ["resolution-4"],
    },
  ],
  meta: {
    module: "Application Video 1 of 2",
    lessonNumber: 1,
    author: "Roger M. Naut",
    caseId: "AU-8830471",
  },
  scenes: {
    // ================================================================ intro
    intro: {
      id: "intro",
      type: "narrative",
      role: "intro",
      label: "You have the file",
      layout: "avatar",
      presenter: PRESENTER,
      // [Title: Case Application — You Have the File]
      kicker: "Case Application",
      headline: "You Have the File",
      subhead:
        "Covers Lessons 1–3. Work the file and make each call. Choose an answer and you'll see exactly why that choice is right or wrong, then try again until it's right.",
      body: NARRATION["intro"].text,
      continueLabel: "See the assignment",
      media: segment("intro"),
      next: "assignment-1",
    },

    // =========================================================== assignment
    "assignment-1": {
      id: "assignment-1",
      type: "narrative",
      role: "briefing",
      label: "The assignment",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: THE ASSIGNMENT]
      kicker: "On screen",
      headline: "The Assignment",
      subhead: "Claim AU-8830471 · Marcus Delacroix · 2019 Ram 1500",
      body: NARRATION["assignment-1"].text,
      continueLabel: "Continue",
      media: segment("assignment-1"),
      next: "assignment-2",
    },

    "assignment-2": {
      id: "assignment-2",
      type: "narrative",
      role: "evidence",
      label: "The referral memo",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "On screen · Exhibit",
      headline: "Referral memo, adjuster’s note highlighted in red",
      body: NARRATION["assignment-2"].text,
      continueLabel: "Make the call",
      media: segment("assignment-2"),
      // [On screen: Referral memo, adjuster's note highlighted in red —
      //  "Insured torched his own truck for the payoff. Recommend denial.
      //  Claim is on hold pending SIU."]
      //
      // Rendered as the template's typographic exhibit. It carries the script's
      // quoted note, NOT a facsimile of a memo — nothing here is a fabricated
      // record, and no image was generated (approved 2026-08-20, $0.00).
      evidence: [
        {
          id: "referral-memo",
          kind: "document",
          title: "Referral memo, adjuster’s note highlighted in red",
          caption:
            "“Insured torched his own truck for the payoff. Recommend denial. Claim is on hold pending SIU.”",
        },
      ],
      next: "decision-1",
    },

    // =========================================================== DECISION 1
    "decision-1": {
      id: "decision-1",
      type: "decision",
      label: "Decision 1 · Your actual job",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "Decision 1 of 3",
      decisionLabel: "Decision 1 of 3",
      prompt: NARRATION["decision-1"].text,
      media: segment("decision-1"),
      options: [
        {
          id: "A",
          label: "Determine whether Marcus Delacroix burned his own truck",
          isCorrect: false,
          feedbackSceneId: "fb-1a",
        },
        {
          id: "B",
          label:
            "Develop and document facts, evaluate them against known indicators, and route them to the people with authority to decide",
          isCorrect: true,
          feedbackSceneId: "fb-1b",
        },
        {
          id: "C",
          label:
            "Find a defensible basis to deny, because a carrier shouldn’t pay off someone’s underwater loan",
          isCorrect: false,
          feedbackSceneId: "fb-1c",
        },
        {
          id: "D",
          label:
            "Confirm to the adjuster that the claim stays on hold until you close the investigation",
          isCorrect: false,
          feedbackSceneId: "fb-1d",
        },
      ],
    },

    "fb-1a": {
      id: "fb-1a",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-1",
      forOptionId: "A",
      label: "D1 · A — decide whether he burned it",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "You just made yourself the jury",
      headline: "You just made yourself the jury",
      body: NARRATION["fb-1a"].text,
      media: segment("fb-1a"),
      next: "rejoin-1",
    },

    // The script gives the correct answer as `[On screen: Correct]` with NO
    // narration, so this beat has no media and is rendered by the player.
    "fb-1b": {
      id: "fb-1b",
      type: "feedback",
      verdict: "correct",
      forDecisionId: "decision-1",
      forOptionId: "B",
      label: "D1 · B — develop and route facts (correct)",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Correct",
      headline: "Correct",
      continueLabel: "Continue",
      media: correctBeat(),
      next: "rejoin-1",
    },

    "fb-1c": {
      id: "fb-1c",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-1",
      forOptionId: "C",
      label: "D1 · C — find a basis to deny",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Outcome first, facts second — that’s backwards",
      headline: "Outcome first, facts second — that’s backwards",
      body: NARRATION["fb-1c"].text,
      media: segment("fb-1c"),
      next: "rejoin-1",
    },

    "fb-1d": {
      id: "fb-1d",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-1",
      forOptionId: "D",
      label: "D1 · D — claim stays on hold",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Wrong — and this one has a regulator attached",
      headline: "Wrong — and this one has a regulator attached",
      body: NARRATION["fb-1d"].text,
      media: segment("fb-1d"),
      next: "rejoin-1",
    },

    // ============================================================= REJOIN 1
    "rejoin-1": {
      id: "rejoin-1",
      type: "narrative",
      role: "continuation",
      label: "An SIU develops facts",
      layout: "avatar",
      presenter: PRESENTER,
      // [All paths rejoin — On screen: "An SIU does not decide whether a claim
      //  is fraudulent. An SIU develops facts."]
      kicker: "All paths rejoin · On screen",
      headline:
        "“An SIU does not decide whether a claim is fraudulent. An SIU develops facts.”",
      body: NARRATION["rejoin-1"].text,
      continueLabel: "Make the call",
      media: segment("rejoin-1"),
      next: "decision-2",
    },

    // =========================================================== DECISION 2
    "decision-2": {
      id: "decision-2",
      type: "decision",
      label: "Decision 2 · The elements",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "Decision 2 of 3",
      decisionLabel: "Decision 2 of 3",
      prompt: NARRATION["decision-2"].text,
      media: segment("decision-2"),
      options: [
        {
          id: "A",
          label: "He’s $4,600 upside down and two payments behind",
          isCorrect: false,
          feedbackSceneId: "fb-2a",
        },
        {
          id: "B",
          label: "Comprehensive was added seven weeks before the loss",
          isCorrect: false,
          feedbackSceneId: "fb-2b",
        },
        {
          id: "C",
          label:
            "He stated both keys were in his kitchen drawer, and the vehicle shows no forced entry and was driven eleven miles to where it burned",
          isCorrect: true,
          feedbackSceneId: "fb-2c",
        },
        {
          id: "D",
          label: "The fire was incendiary, so a crime clearly occurred",
          isCorrect: false,
          feedbackSceneId: "fb-2d",
        },
      ],
    },

    "fb-2a": {
      id: "fb-2a",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-2",
      forOptionId: "A",
      label: "D2 · A — upside down and behind",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "That’s motive, and motive is not an element",
      headline: "That’s motive, and motive is not an element",
      body: NARRATION["fb-2a"].text,
      media: segment("fb-2a"),
      next: "rejoin-2",
    },

    "fb-2b": {
      id: "fb-2b",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-2",
      forOptionId: "B",
      label: "D2 · B — coverage added seven weeks before",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Timing is an indicator, not a misrepresentation",
      headline: "Timing is an indicator, not a misrepresentation",
      body: NARRATION["fb-2b"].text,
      media: segment("fb-2b"),
      next: "rejoin-2",
    },

    "fb-2c": {
      id: "fb-2c",
      type: "feedback",
      verdict: "correct",
      forDecisionId: "decision-2",
      forOptionId: "C",
      label: "D2 · C — the keys, the entry, the eleven miles (correct)",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Correct",
      headline: "Correct",
      continueLabel: "Continue",
      media: correctBeat(),
      next: "rejoin-2",
    },

    "fb-2d": {
      id: "fb-2d",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-2",
      forOptionId: "D",
      label: "D2 · D — incendiary, so a crime occurred",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Half right, and the missing half is the whole case",
      headline: "Half right, and the missing half is the whole case",
      body: NARRATION["fb-2d"].text,
      media: segment("fb-2d"),
      next: "rejoin-2",
    },

    // ============================================================= REJOIN 2
    "rejoin-2": {
      id: "rejoin-2",
      type: "narrative",
      role: "continuation",
      label: "Statement vs. physical evidence",
      layout: "avatar",
      presenter: PRESENTER,
      // [Rejoin — On screen: "Both keys in the drawer" + no forced entry +
      //  driven eleven miles]
      kicker: "All paths rejoin · On screen",
      headline:
        "“Both keys in the drawer” + no forced entry + driven eleven miles",
      body: NARRATION["rejoin-2"].text,
      continueLabel: "Make the call",
      media: segment("rejoin-2"),
      // The rejoin cue IS an A ≠ B conflict, and the narration names it as one:
      // "a statement by the insured that conflicts with independent physical
      // evidence". Both sides are the script's own facts — his recorded
      // statement (assignment-2) against the vehicle (decision-2 option C).
      comparison: {
        kicker: "Evidence exhibit",
        conflict:
          "A statement by the insured that conflicts with independent physical evidence.",
        a: {
          label: "His recorded statement",
          value: "Both keys have been in his kitchen drawer the whole time",
        },
        b: {
          label: "The vehicle",
          value:
            "No forced entry, and driven eleven miles to where it burned",
        },
        note: "It’s a specific assertion, it’s material to whether the loss occurred as described, and it was made by him",
      },
      next: "decision-3",
    },

    // =========================================================== DECISION 3
    "decision-3": {
      id: "decision-3",
      type: "decision",
      label: "Decision 3 · The mandatory report",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "Decision 3 of 3",
      decisionLabel: "Decision 3 of 3",
      prompt: NARRATION["decision-3"].text,
      media: segment("decision-3"),
      options: [
        {
          id: "A",
          label:
            "Wait for the fire bureau to confirm arson and for the key inventory to come back — you don’t want to report and be wrong",
          isCorrect: false,
          feedbackSceneId: "fb-3a",
        },
        {
          id: "B",
          label:
            "File on the fraud bureau’s form inside the window, stating facts and sources with no conclusion of guilt, and keep the claim on its own lawful track",
          isCorrect: true,
          feedbackSceneId: "fb-3b",
        },
        {
          id: "C",
          label:
            "File the report, and copy the adjuster, the lienholder, and the apartment complex manager so everybody knows what they’re dealing with",
          isCorrect: false,
          feedbackSceneId: "fb-3c",
        },
        {
          id: "D",
          label:
            "Skip the bureau and call the county prosecutor directly — arson is a felony and this needs to move now",
          isCorrect: false,
          feedbackSceneId: "fb-3d",
        },
      ],
    },

    "fb-3a": {
      id: "fb-3a",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-3",
      forOptionId: "A",
      label: "D3 · A — wait for confirmation",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "You just applied the wrong standard and missed a deadline",
      headline: "You just applied the wrong standard and missed a deadline",
      body: NARRATION["fb-3a"].text,
      media: segment("fb-3a"),
      next: "rejoin-3",
    },

    "fb-3b": {
      id: "fb-3b",
      type: "feedback",
      verdict: "correct",
      forDecisionId: "decision-3",
      forOptionId: "B",
      label: "D3 · B — file inside the window, no verdict (correct)",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Correct",
      headline: "Correct",
      continueLabel: "Continue",
      media: correctBeat(),
      next: "rejoin-3",
    },

    "fb-3c": {
      id: "fb-3c",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-3",
      forOptionId: "C",
      label: "D3 · C — copy everybody",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "The report was fine. The distribution list is a lawsuit",
      headline: "The report was fine. The distribution list is a lawsuit",
      body: NARRATION["fb-3c"].text,
      media: segment("fb-3c"),
      next: "rejoin-3",
    },

    "fb-3d": {
      id: "fb-3d",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-3",
      forOptionId: "D",
      label: "D3 · D — call the prosecutor",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Right instinct, wrong channel — and the channel is the point",
      headline: "Right instinct, wrong channel — and the channel is the point",
      body: NARRATION["fb-3d"].text,
      media: segment("fb-3d"),
      next: "rejoin-3",
    },

    // ============================================================= REJOIN 3
    "rejoin-3": {
      id: "rejoin-3",
      type: "narrative",
      role: "continuation",
      label: "Reporting is not denying",
      layout: "avatar",
      presenter: PRESENTER,
      // [Rejoin — On screen: "Reporting is a regulatory act. Denying is a
      //  claims act. They are not the same decision."]
      kicker: "All paths rejoin · On screen",
      headline:
        "“Reporting is a regulatory act. Denying is a claims act. They are not the same decision.”",
      body: NARRATION["rejoin-3"].text,
      continueLabel: "See the resolution",
      media: segment("rejoin-3"),
      next: "resolution-1",
    },

    // ========================================================== RESOLUTION
    "resolution-1": {
      id: "resolution-1",
      type: "narrative",
      role: "resolution",
      label: "The third key",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: Dealer key-inventory record — two keys issued 2019, one
      //  replacement fob programmed February 11, buyer signature on file]
      kicker: "The resolution · On screen",
      headline: "Dealer key-inventory record",
      body: NARRATION["resolution-1"].text,
      continueLabel: "Continue",
      media: segment("resolution-1"),
      evidence: [
        {
          id: "key-inventory",
          kind: "document",
          title: "Dealer key-inventory record",
          caption:
            "Two keys issued 2019, one replacement fob programmed February 11, buyer signature on file.",
        },
      ],
      // The payoff of the video, and the script states the conflict outright:
      // "A third key … that his statement never mentioned."
      comparison: {
        kicker: "Evidence exhibit",
        conflict:
          "A third key, programmed six weeks before the loss, that his statement never mentioned.",
        a: {
          label: "His recorded statement",
          value: "Both keys have been in his kitchen drawer the whole time",
        },
        b: {
          label: "Dealer key-inventory record",
          value:
            "Two keys issued 2019, one replacement fob programmed February 11",
        },
        note: "Not a feeling. Not a bank balance. A document with a signature on it.",
      },
      next: "resolution-2",
    },

    "resolution-2": {
      id: "resolution-2",
      type: "narrative",
      role: "resolution",
      label: "The file, tabbed",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: The file, tabbed — activity log dated from day one · origin
      //  report · police report · recorded statement transcript · key inventory
      //  · fraud bureau filing with confirmation · analysis section, labeled]
      kicker: "On screen",
      headline: "The file, tabbed",
      body: NARRATION["resolution-2"].text,
      continueLabel: "Continue",
      media: segment("resolution-2"),
      // The seven tabs the cue names, in the cue's order, rendered by the
      // template's exhibit tabs under the locked "Exhibits" label. Only the
      // leading letter is capitalised; no wording is changed or added.
      evidence: [
        {
          id: "activity-log",
          kind: "document",
          title: "Activity log dated from day one",
        },
        { id: "origin-report", kind: "document", title: "Origin report" },
        { id: "police-report", kind: "document", title: "Police report" },
        {
          id: "statement-transcript",
          kind: "document",
          title: "Recorded statement transcript",
        },
        { id: "key-inventory-tab", kind: "document", title: "Key inventory" },
        {
          id: "bureau-filing",
          kind: "document",
          title: "Fraud bureau filing with confirmation",
        },
        {
          id: "analysis-section",
          kind: "document",
          title: "Analysis section, labeled",
        },
      ],
      next: "resolution-3",
    },

    "resolution-3": {
      id: "resolution-3",
      type: "narrative",
      role: "resolution",
      label: "The test",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: Could a stranger reconstruct this file and independently
      //  reach your conclusion?]
      kicker: "On screen",
      headline:
        "Could a stranger reconstruct this file and independently reach your conclusion?",
      body: NARRATION["resolution-3"].text,
      continueLabel: "Continue",
      media: segment("resolution-3"),
      next: "resolution-4",
    },

    "resolution-4": {
      id: "resolution-4",
      type: "narrative",
      role: "resolution",
      label: "Same method. Different answer.",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: Same method. Different answer.]
      kicker: "On screen",
      headline: "Same method. Different answer.",
      body: NARRATION["resolution-4"].text,
      // [→ Continue to the next lessons] — the script's hand-off. The graded
      // quiz is the COURSE quiz on Thinkific, not an in-video one.
      continueLabel: "Continue to the next lessons",
      media: segment("resolution-4"),
      next: null,
    },
  },
};

/**
 * MEDIA-COVERAGE INTEGRITY CHECK
 * ============================================================================
 * Runs when the module loads — which is during `next build` — so a narration
 * segment that was never wired to a scene, or a scene wired to a segment that
 * does not exist, fails the build instead of showing a learner a dead player.
 * The 22 narration segments and the 3 player-native correct beats are accounted
 * for exactly once each, whether or not the media has been delivered yet.
 */
{
  const authored = Object.keys(NARRATION);
  const scenes = siu01Av1.scenes;

  const unwired = authored.filter((id) => !scenes[id]);
  if (unwired.length > 0) {
    throw new Error(
      `siu-01 AV1: narration segment(s) with no scene: ${unwired.join(", ")}`,
    );
  }

  // Scenes that carry narration = every scene except the three correct beats,
  // which are the only ones built by `correctBeat()` (duration 0, no body).
  const narrated = Object.values(scenes)
    .filter((sc) => sc.media.durationSec > 0)
    .map((sc) => sc.id);
  const missing = narrated.filter((id) => !authored.includes(id));
  if (missing.length > 0) {
    throw new Error(
      `siu-01 AV1: scene(s) with no narration segment: ${missing.join(", ")}`,
    );
  }
  if (narrated.length !== authored.length) {
    throw new Error(
      `siu-01 AV1: ${narrated.length} scenes carry narration but ${authored.length} segments were authored.`,
    );
  }

  // Until Gate D delivers the mp4s, no scene may request one.
  if (!MEDIA_DELIVERED) {
    const requesting = Object.values(scenes).filter((sc) => !!sc.media.videoUrl);
    if (requesting.length > 0) {
      throw new Error(
        `siu-01 AV1: MEDIA_DELIVERED is false but ${requesting.length} scene(s) request an mp4.`,
      );
    }
  }
}
