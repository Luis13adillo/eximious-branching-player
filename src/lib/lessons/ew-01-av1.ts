import type { Lesson, MediaSource } from "@/lib/branching/types";
import { NARRATION, MEDIA_DELIVERED, type NarrationId } from "./ew-01-av1.narration";

/**
 * ew-01 · Application Video 1 of 2 — "The First Call, and Everything You Say Yes To"
 * ============================================================================
 * Course:    Becoming a Retained Expert (Track 11 — Expert Witness & Testimony)
 * Presenter: Selena Navarro (Presenter 3) — appearance and voice LOCKED
 * Package:   EA_ew-01_AV1.zip
 * Covers:    Lessons 1–3
 *
 * AUTHORITY — every spoken line, every decision, every option and every piece
 * of on-screen cue text below comes from the authoritative EW-01 pilot script
 * (`docs/source/pilot-scripts.pdf`, pp. 10–16). Nothing is invented, omitted,
 * reordered or reworded. The narration strings live in `ew-01-av1.narration.ts`
 * and were sliced out of the extracted script text rather than retyped.
 *
 * `headline`/`consequence`/`subhead` values are the script's own bracketed
 * `[On screen:]` cues, which its cover page defines as "visual direction, not
 * spoken narration" — so they are rendered by the player, never baked into
 * generated video (locked pipeline rule 8). `label`, `kicker` and
 * `continueLabel` are player chrome, authored here and never spoken, exactly
 * as in claims-01.
 *
 * STRUCTURE (script §"How to read these scripts")
 *   intro → assignment-1 → assignment-2 → assignment-3 → assignment-4
 *   DECISION 1 (correct = B) → fb-1a/b/c/d → rejoin-1a → rejoin-1b
 *   DECISION 2 (correct = B) → fb-2a/b/c/d → rejoin-2a → rejoin-2b
 *   DECISION 3 (correct = B) → fb-3a/b/c/d → rejoin-3
 *   resolution-1 → resolution-2 → resolution-3 → hand-off
 *
 * Twelve feedback segments in total. Wrong answers return the learner to the
 * same decision to try again (engine-level retry-until-correct, options
 * reshuffled); only the correct option advances to the rejoin.
 *
 * THE THREE CORRECT-ANSWER BEATS (`fb-1b`, `fb-2b`, `fb-3b`) CARRY NO MEDIA
 * BY DESIGN. The script writes each one only as `[On screen: Correct]` with no
 * narration, so there is no Selena segment to play — the correct-state verdict
 * is player-native UI. This is the same call made for claims-01 (O-4, decided
 * 2026-08-18), which is why the delivered media set is 25 segments, not 28.
 *
 * NO IN-VIDEO QUIZ. The script ends "[→ Continue to the next lessons]" and the
 * Agreement/Spec hand off to the graded COURSE quiz, which Thinkific owns.
 *
 * ★ DELIVERED (2026-08-21). `MEDIA_DELIVERED` is now TRUE: all 25 segments are
 * on disk, every `durationSec` is the measured video length from its sidecar, and
 * the caption cues tile the delivered assets. Nothing about the scene graph,
 * options, routes or cue text changed when the flag flipped — which is the whole
 * point of authoring it this way.
 *
 * `EXHIBITS_DELIVERED` is still false, so the two evidence scenes render their
 * verbatim cue titles and captions with no image. That is also how siu-01's three
 * evidence scenes ship. Whether this pilot needs real photographs when siu-01 does
 * not is a client decision, not a missing asset.
 */

const PRESENTER = {
  name: "Selena Navarro",
  // Fixed at the template level ("Course Presenter", Agreement §1.4) — this
  // role never renders a credential.
  role: "Course Presenter",
};

/** Selena's locked, QA-passed 1920×1080 production still. */
const PRESENTER_POSTER =
  "/media/presenter-3-selena-navarro-production-still-1920x1080.png";

/**
 * Flips to true when the two photographic exhibits this script cues have been
 * produced at 1920×1080 and registered with sidecars. Until then the exhibits
 * still render with their verbatim cue titles and captions — only the image is
 * withheld, so nothing requests a file that does not exist.
 */
const EXHIBITS_DELIVERED = false;

const EXHIBIT = {
  guardrail: "/media/ew-01-av1/evidence-guardrail-night.jpg",
  dring: "/media/ew-01-av1/evidence-dring-load-mark.jpg",
} as const;

const exhibitImage = (key: keyof typeof EXHIBIT) =>
  EXHIBITS_DELIVERED ? EXHIBIT[key] : undefined;

/**
 * Binds one narration segment to a scene.
 * ----------------------------------------------------------------------------
 * Once delivered, every asset will be a QA-passed 1920×1080 / 25 fps file under
 * `public/media/ew-01-av1/`, produced by the locked pipeline: locked script →
 * OpenAI `gpt-4o-mini-tts` `sage` + Selena's locked `instructions` → 24 kHz
 * mono −24.5 LUFS master → fal-ai/latentsync against Selena's reusable driving
 * base → trim → remux the locked master → split → conform to exactly
 * 1920×1080. Per-file provenance will live in the matching `<id>.mp4.json`.
 *
 * Until then the scene plays as the placeholder stage. Duration and captions
 * come from `NARRATION` either way, so a delivered asset cannot silently
 * desync the scrubber or the captions.
 */
function segment(id: NarrationId): MediaSource {
  const seg = NARRATION[id];
  return {
    provider: MEDIA_DELIVERED ? "file" : "placeholder",
    // Literal URL from the generated manifest — see NarrationSegment.videoUrl.
    videoUrl: MEDIA_DELIVERED ? seg.videoUrl : undefined,
    posterUrl: PRESENTER_POSTER,
    hasAudio: MEDIA_DELIVERED,
    loop: false,
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

export const ew01Av1: Lesson = {
  id: "ew-01-av1",
  slug: "ew-01-av1",
  courseTitle: "Becoming a Retained Expert",
  title: "Case Application — The Phone Rings",
  subtitle:
    "Application Video 1 of 2 — The First Call, and Everything You Say Yes To",
  summary:
    "A plaintiff's firm calls with a fatal rollover and a conclusion already picked out. Three decisions, each with its own feedback branch and a retry until you get it right, then the correct reasoning and the resolution.",
  estimatedMinutes: 9,
  completion: {
    // The script's own closing on-screen line.
    takeaway: "Champions get discredited. Teachers get retained.",
    headlineAllCorrect: "You held the line where it counts.",
    headlinePartial: "The engagement resolves — carry the method forward.",
  },
  startSceneId: "intro",
  /**
   * LEARNER-FACING PROGRESS — the 14-step rail.
   * --------------------------------------------------------------------------
   * The scene graph is 28 scenes and its spine is 16. `assignment-2`,
   * `assignment-3` and `assignment-4` are one thing to the learner — "here is
   * the call" — with the scene photograph and Prieto's demand inside it, so
   * they share a milestone; the script splits them only because it cues a new
   * on-screen state between them and the media pipeline splits at those cues.
   * That is production plumbing, not a teaching beat.
   *
   * Nothing else is grouped. Every other on-screen cue opens a distinct
   * teaching beat, so merging any of them would hide content from the
   * learner's map. `validateLesson` fails the build if these milestones ever
   * stop covering the spine exactly once.
   */
  progress: [
    { id: "open", label: "The phone rings", scenes: ["intro"] },
    { id: "who", label: "Who you are", scenes: ["assignment-1"] },
    {
      id: "call",
      label: "The call",
      scenes: ["assignment-2", "assignment-3", "assignment-4"],
    },
    {
      id: "decision-1",
      label: "Decision 1 · The ask",
      scenes: ["decision-1"],
    },
    { id: "independence", label: "Your independence", scenes: ["rejoin-1a"] },
    { id: "teacher", label: "Teacher, not champion", scenes: ["rejoin-1b"] },
    {
      id: "decision-2",
      label: "Decision 2 · Scope of expertise",
      scenes: ["decision-2"],
    },
    { id: "boundary", label: "The boundary", scenes: ["rejoin-2a"] },
    { id: "qualification", label: "How courts weigh it", scenes: ["rejoin-2b"] },
    {
      id: "decision-3",
      label: "Decision 3 · Your own website",
      scenes: ["decision-3"],
    },
    { id: "marketing", label: "Marketing is subtractive", scenes: ["rejoin-3"] },
    { id: "scope", label: "The engagement, as scoped", scenes: ["resolution-1"] },
    { id: "restraint", label: "The restraint evidence", scenes: ["resolution-2"] },
    {
      id: "method",
      label: "Same method. Different answer.",
      scenes: ["resolution-3"],
    },
  ],
  meta: {
    module: "Application Video 1 of 2",
    lessonNumber: 1,
    author: "Roger M. Naut",
    caseId: "Doss v. Ferrin Haulage",
  },
  scenes: {
    // ================================================================ intro
    intro: {
      id: "intro",
      type: "narrative",
      role: "intro",
      label: "The phone rings",
      layout: "avatar",
      presenter: PRESENTER,
      // [Title: Case Application — The Phone Rings]
      kicker: "Case Application",
      headline: "The Phone Rings",
      subhead:
        "Covers Lessons 1–3. You're the expert, the call is live, and you're making the calls. Choose an answer and you'll see exactly why that choice is right or wrong, then try again until it's right.",
      body: NARRATION["intro"].text,
      continueLabel: "See who you are",
      media: segment("intro"),
      next: "assignment-1",
    },

    // =========================================================== assignment
    "assignment-1": {
      id: "assignment-1",
      type: "narrative",
      role: "briefing",
      label: "Who you are",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: WHO YOU ARE]
      kicker: "On screen",
      headline: "Who You Are",
      subhead:
        "Twenty-two years · qualified eleven times · no roadside hardware design experience",
      body: NARRATION["assignment-1"].text,
      continueLabel: "Take the call",
      media: segment("assignment-1"),
      next: "assignment-2",
    },

    "assignment-2": {
      id: "assignment-2",
      type: "narrative",
      role: "briefing",
      label: "The call",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: THE CALL]
      kicker: "On screen",
      headline: "The Call",
      subhead:
        "Renata Prieto, Halloway & Prieto · Doss v. Ferrin Haulage and Cavender County",
      body: NARRATION["assignment-2"].text,
      continueLabel: "Continue",
      media: segment("assignment-2"),
      next: "assignment-3",
    },

    "assignment-3": {
      id: "assignment-3",
      type: "narrative",
      role: "evidence",
      label: "The scene",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "On screen · Exhibit",
      headline: "The scene",
      body: NARRATION["assignment-3"].text,
      continueLabel: "Hear the ask",
      media: segment("assignment-3"),
      // [On screen: Photo — night scene, a rural two-lane, a guardrail end
      //  terminal peeled and folded back like a ribbon, a pickup on its roof
      //  forty feet beyond, evidence markers on the asphalt]
      evidence: [
        {
          id: "guardrail-night",
          kind: "photo",
          title:
            "Photo — night scene, a rural two-lane, a guardrail end terminal peeled and folded back like a ribbon, a pickup on its roof forty feet beyond, evidence markers on the asphalt",
          caption:
            "Marguerite Doss, 29, front-seat passenger. Route 41, approximately 2:10 a.m.",
          imageUrl: exhibitImage("guardrail"),
        },
      ],
      next: "assignment-4",
    },

    "assignment-4": {
      id: "assignment-4",
      type: "narrative",
      role: "briefing",
      label: "The ask",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: "The reconstructionist we had says Ms. Doss wasn't belted,
      //  and that guts our damages under this state's rule. We need someone
      //  who'll say the restraint evidence is inconclusive."]
      //
      // The cue opens this segment, and the narration that FOLLOWS it —
      // "Let's work it." — is what Selena says over it. Short (~1.0 s) and
      // deliberately left that way: merging it into the decision would join
      // text the script separates with the DECISION 1 header.
      kicker: "On screen",
      headline: "The ask",
      subhead:
        "“The reconstructionist we had says Ms. Doss wasn’t belted, and that guts our damages under this state’s rule. We need someone who’ll say the restraint evidence is inconclusive.”",
      body: NARRATION["assignment-4"].text,
      continueLabel: "Make the call",
      media: segment("assignment-4"),
      next: "decision-1",
    },

    // =========================================================== DECISION 1
    "decision-1": {
      id: "decision-1",
      type: "decision",
      label: "Decision 1 · The ask",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "Decision 1 of 3",
      decisionLabel: "Decision 1 of 3",
      prompt: NARRATION["decision-1"].text,
      media: segment("decision-1"),
      options: [
        {
          id: "A",
          label:
            "Take the engagement — belt evidence genuinely is inconclusive in a lot of rollovers, so you can probably say that honestly anyway",
          isCorrect: false,
          feedbackSceneId: "fb-1a",
        },
        {
          id: "B",
          label:
            "Tell her plainly that you go where the analysis goes, that an opinion that bends breaks on cross-examination, and offer to examine the restraint evidence independently — prepared to decline if what she wants is a mouthpiece",
          isCorrect: true,
          feedbackSceneId: "fb-1b",
        },
        {
          id: "C",
          label:
            "Take it as a consulting expert only, so nothing you say is discoverable, and give her the answer she needs off the record",
          isCorrect: false,
          feedbackSceneId: "fb-1c",
        },
        {
          id: "D",
          label: "End the call and report her to the state bar",
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
      label: "D1 · A — take the engagement",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "You just accepted the conclusion before doing the analysis",
      headline: "You just accepted the conclusion before doing the analysis",
      body: NARRATION["fb-1a"].text,
      media: segment("fb-1a"),
      next: "rejoin-1a",
    },

    // The script gives the correct answer as `[On screen: Correct]` with NO
    // narration, so this beat has no media and is rendered by the player.
    "fb-1b": {
      id: "fb-1b",
      type: "feedback",
      verdict: "correct",
      forDecisionId: "decision-1",
      forOptionId: "B",
      label: "D1 · B — go where the analysis goes (correct)",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Correct",
      headline: "Correct",
      continueLabel: "Continue",
      media: correctBeat(),
      next: "rejoin-1a",
    },

    "fb-1c": {
      id: "fb-1c",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-1",
      forOptionId: "C",
      label: "D1 · C — consulting expert only",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "The consulting hat isn’t a place to store dishonesty",
      headline: "The consulting hat isn’t a place to store dishonesty",
      body: NARRATION["fb-1c"].text,
      media: segment("fb-1c"),
      next: "rejoin-1a",
    },

    "fb-1d": {
      id: "fb-1d",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-1",
      forOptionId: "D",
      label: "D1 · D — report her to the state bar",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Overreaction to a sentence lawyers say all the time",
      headline: "Overreaction to a sentence lawyers say all the time",
      body: NARRATION["fb-1d"].text,
      media: segment("fb-1d"),
      next: "rejoin-1a",
    },

    // ============================================================= REJOIN 1
    "rejoin-1a": {
      id: "rejoin-1a",
      type: "narrative",
      role: "continuation",
      label: "Your independence",
      layout: "avatar",
      presenter: PRESENTER,
      // [All paths rejoin — On screen: Your independence is the entire product.]
      kicker: "All paths rejoin · On screen",
      headline: "Your independence is the entire product.",
      // [On screen: The line, on screen as spoken — "…"]
      subhead:
        "The line, on screen as spoken — “I’ll examine the restraint evidence the same way I’d examine it for any client, and I’ll tell you what I find — including if it’s bad for you. An opinion that bends to fit a case is an opinion that breaks the first time somebody crosses me on it.”",
      body: NARRATION["rejoin-1a"].text,
      continueLabel: "Continue",
      media: segment("rejoin-1a"),
      next: "rejoin-1b",
    },

    "rejoin-1b": {
      id: "rejoin-1b",
      type: "narrative",
      role: "continuation",
      label: "Teacher, not champion",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "On screen",
      headline: "Two experts, two outcomes",
      body: NARRATION["rejoin-1b"].text,
      continueLabel: "Make the call",
      media: segment("rejoin-1b"),
      // [On screen: Two experts, two outcomes — LEFT: … || RIGHT: …]
      // The locked A ≠ B comparison: same matter, opposite conduct, opposite
      // outcome. The default "≠" glyph is exactly the relation the cue draws.
      comparison: {
        kicker: "On screen",
        conflict: "Two experts, two outcomes.",
        a: {
          label: "LEFT",
          value:
            "examines the restraint hardware, finds against the plaintiff, tells counsel in week two.",
          detail: "Counsel re-strategizes. Gets called again.",
        },
        b: {
          label: "RIGHT",
          value:
            "shapes the analysis to fit, buries the contrary data, gets impeached at deposition with the test results he ignored.",
          detail: "Opinion excluded. Phone stops ringing.",
        },
        note: "Be a teacher, not a champion. Champions get discredited. Teachers get retained.",
      },
      next: "decision-2",
    },

    // =========================================================== DECISION 2
    "decision-2": {
      id: "decision-2",
      type: "decision",
      label: "Decision 2 · Scope of expertise",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "Decision 2 of 3",
      decisionLabel: "Decision 2 of 3",
      prompt: NARRATION["decision-2"].text,
      media: segment("decision-2"),
      options: [
        {
          id: "A",
          label:
            "Take it — twenty-two years of crash reconstruction is twenty-two years of impact physics, and a guardrail is just another object in a collision",
          isCorrect: false,
          feedbackSceneId: "fb-2a",
        },
        {
          id: "B",
          label:
            "Limit your opinion to vehicle dynamics, speed, departure angle and impact sequence; say out loud that end-terminal design is outside your expertise; and tell her she needs a roadside-safety-hardware specialist for that piece",
          isCorrect: true,
          feedbackSceneId: "fb-2b",
        },
        {
          id: "C",
          label:
            "Spend the weekend reading the roadside hardware standards and the crash-test literature, then take the whole thing",
          isCorrect: false,
          feedbackSceneId: "fb-2c",
        },
        {
          id: "D",
          label:
            "Offer a softer version — that the terminal “did not perform as intended” — without claiming to be a design expert",
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
      label: "D2 · A — impact physics is impact physics",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Apply the peer wince test",
      headline: "Apply the peer wince test",
      body: NARRATION["fb-2a"].text,
      media: segment("fb-2a"),
      next: "rejoin-2a",
    },

    "fb-2b": {
      id: "fb-2b",
      type: "feedback",
      verdict: "correct",
      forDecisionId: "decision-2",
      forOptionId: "B",
      label: "D2 · B — claim what you own (correct)",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Correct",
      headline: "Correct",
      continueLabel: "Continue",
      media: correctBeat(),
      next: "rejoin-2a",
    },

    "fb-2c": {
      id: "fb-2c",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-2",
      forOptionId: "C",
      label: "D2 · C — read up over the weekend",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Reading closes a thin gap; it doesn’t manufacture a practice",
      headline: "Reading closes a thin gap; it doesn’t manufacture a practice",
      body: NARRATION["fb-2c"].text,
      media: segment("fb-2c"),
      next: "rejoin-2a",
    },

    "fb-2d": {
      id: "fb-2d",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-2",
      forOptionId: "D",
      label: "D2 · D — a softer version",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "That is the design opinion, with the label filed off",
      headline: "That is the design opinion, with the label filed off",
      body: NARRATION["fb-2d"].text,
      media: segment("fb-2d"),
      next: "rejoin-2a",
    },

    // ============================================================= REJOIN 2
    "rejoin-2a": {
      id: "rejoin-2a",
      type: "narrative",
      role: "continuation",
      label: "The boundary",
      layout: "avatar",
      presenter: PRESENTER,
      // [Rejoin — On screen: Qualification is decided per matter, per question
      //  — not once for a career.]
      kicker: "All paths rejoin · On screen",
      headline:
        "Qualification is decided per matter, per question — not once for a career.",
      // [On screen: The sentence that protects you — "…"]
      subhead:
        "The sentence that protects you — “I can speak to the vehicle’s speed, departure angle, impact sequence and rollover dynamics. Whether that end terminal was defectively designed is outside my expertise — you’ll want a roadside safety hardware specialist for that, and I can suggest two.”",
      body: NARRATION["rejoin-2a"].text,
      continueLabel: "Continue",
      media: segment("rejoin-2a"),
      next: "rejoin-2b",
    },

    "rejoin-2b": {
      id: "rejoin-2b",
      type: "narrative",
      role: "continuation",
      label: "How courts weigh it",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: The categories a court weighs — education & training ·
      //  licensure & certification · hands-on experience doing the thing in
      //  dispute · teaching · publications & peer-reviewed work · professional
      //  memberships · prior expert experience. Their weight shifts with the
      //  question.]
      //
      // SEVEN categories, so this is NOT the locked four-icon summary card —
      // its `items` tuple is exactly four by contract. Rendered as the
      // script's own middot run instead. See the Gate 0 report: a reusable
      // criteria-list component is worth building once siu-01 (which cues the
      // same shape) is authored, rather than inventing one for this pilot.
      kicker: "On screen",
      headline: "The categories a court weighs",
      subhead:
        "education & training · licensure & certification · hands-on experience doing the thing in dispute · teaching · publications & peer-reviewed work · professional memberships · prior expert experience. Their weight shifts with the question.",
      body: NARRATION["rejoin-2b"].text,
      continueLabel: "Make the call",
      media: segment("rejoin-2b"),
      next: "decision-3",
    },

    // =========================================================== DECISION 3
    "decision-3": {
      id: "decision-3",
      type: "decision",
      label: "Decision 3 · Your own website",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "Decision 3 of 3",
      decisionLabel: "Decision 3 of 3",
      // [On screen: The current site — "THE RECONSTRUCTIONIST PLAINTIFF'S FIRMS
      //  TRUST." · "200+ cases." · "Never excluded." · Three client testimonials
      //  naming verdicts. · A specialty list running to nine fields including
      //  "premises safety" and "product failure analysis."]
      headline: "The current site",
      subhead:
        "“THE RECONSTRUCTIONIST PLAINTIFF’S FIRMS TRUST.” · “200+ cases.” · “Never excluded.” · Three client testimonials naming verdicts. · A specialty list running to nine fields including “premises safety” and “product failure analysis.”",
      prompt: NARRATION["decision-3"].text,
      media: segment("decision-3"),
      options: [
        {
          id: "A",
          label:
            "Leave it — every number on it is true, and “never excluded” is accurate",
          isCorrect: false,
          feedbackSceneId: "fb-3a",
        },
        {
          id: "B",
          label:
            "Rewrite it: one narrowly defined specialty, credentials accurate to the day, representative engagements described by field and issue only, an explicit statement that you’re retained by plaintiff and defense counsel, and a clear path to run a conflicts check — with the win-rate language, the “never excluded” claim, and the testimonials deleted",
          isCorrect: true,
          feedbackSceneId: "fb-3b",
        },
        {
          id: "C",
          label:
            "Take the site down entirely — you get work by referral anyway, and there’s nothing to impeach if there’s nothing there",
          isCorrect: false,
          feedbackSceneId: "fb-3c",
        },
        {
          id: "D",
          label: "Balance it out by adding testimonials from defense-side clients",
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
      label: "D3 · A — leave it, it's all true",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "True and impeachable are not opposites",
      headline: "True and impeachable are not opposites",
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
      label: "D3 · B — rewrite it (correct)",
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
      label: "D3 · C — take the site down",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "You’d solve one problem by creating two",
      headline: "You’d solve one problem by creating two",
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
      label: "D3 · D — add defense-side testimonials",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Testimonials are the problem, not the imbalance",
      headline: "Testimonials are the problem, not the imbalance",
      body: NARRATION["fb-3d"].text,
      media: segment("fb-3d"),
      next: "rejoin-3",
    },

    // ============================================================= REJOIN 3
    "rejoin-3": {
      id: "rejoin-3",
      type: "narrative",
      role: "continuation",
      label: "Marketing is subtractive",
      layout: "avatar",
      presenter: PRESENTER,
      // [Rejoin — On screen: Marketing for experts is subtractive. Say less,
      //  say it precisely.]
      kicker: "All paths rejoin · On screen",
      headline: "Marketing for experts is subtractive. Say less, say it precisely.",
      // [On screen: The rewritten profile — "…"]
      subhead:
        "The rewritten profile — “Independent vehicle collision reconstruction. Twenty-two years, including [X] years in state police crash reconstruction. Current certifications: [listed, with dates]. Representative engagements: highway departure and rollover dynamics, heavy-truck impact sequencing, low-speed impact analysis. Retained by plaintiff and defense counsel. Conflicts check: [contact].”",
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
      label: "The engagement, as scoped",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: The engagement, as scoped — "Retained to address: (1)
      //  pre-departure speed; (2) departure angle and path; (3) impact sequence
      //  and rollover dynamics; (4) occupant kinematics and restraint use. NOT
      //  retained to address: guardrail end-terminal design or performance."]
      kicker: "The resolution · On screen",
      headline: "The engagement, as scoped",
      body: NARRATION["resolution-1"].text,
      continueLabel: "Continue",
      media: segment("resolution-1"),
      // The script numbers exactly four retained issues, which is the locked
      // four-icon rejoin summary card's contract. The takeaway carries the
      // negative half of the scope, which is the point of the whole video.
      summaryCard: {
        kicker: "On screen",
        title: "Retained to address",
        numbered: true,
        items: [
          { icon: "speed", label: "Pre-departure speed" },
          { icon: "angle", label: "Departure angle and path" },
          { icon: "sequence", label: "Impact sequence and rollover dynamics" },
          { icon: "occupant", label: "Occupant kinematics and restraint use" },
        ],
        takeaway:
          "NOT retained to address: guardrail end-terminal design or performance.",
      },
      next: "resolution-2",
    },

    "resolution-2": {
      id: "resolution-2",
      type: "narrative",
      role: "resolution",
      label: "The restraint evidence",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "On screen · Exhibit",
      headline: "The restraint evidence",
      body: NARRATION["resolution-2"].text,
      continueLabel: "Continue",
      media: segment("resolution-2"),
      // [On screen: Exhibit — macro photograph of a seat belt D-ring, a
      //  distinct load mark burnished into the webbing, scale card in frame]
      evidence: [
        {
          id: "dring-load-mark",
          kind: "photo",
          title:
            "Exhibit — macro photograph of a seat belt D-ring, a distinct load mark burnished into the webbing, scale card in frame",
          caption:
            "Loaded webbing mark at the D-ring, with corresponding hardware damage at the latch plate.",
          imageUrl: exhibitImage("dring"),
        },
      ],
      next: "resolution-3",
    },

    "resolution-3": {
      id: "resolution-3",
      type: "narrative",
      role: "resolution",
      label: "Same method. Different answer.",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: "Champions get discredited. Teachers get retained."]
      // [On screen: Same method. Different answer.]
      kicker: "On screen",
      headline: "Same method. Different answer.",
      subhead: "“Champions get discredited. Teachers get retained.”",
      body: NARRATION["resolution-3"].text,
      // [→ Continue to the next lessons] — the script's hand-off. The graded
      // quiz is the COURSE quiz on Thinkific, not an in-video one.
      continueLabel: "Continue to the next lessons",
      media: segment("resolution-3"),
      next: null,
    },
  },
};

/**
 * NARRATION-COVERAGE INTEGRITY CHECK
 * ============================================================================
 * Runs when the module loads — which is during `next build` — so a narration
 * segment that was authored but never wired to a scene, or a scene wired to a
 * segment that was never authored, fails the build instead of shipping a hole.
 * The 25 narrated segments and the 3 player-native correct beats are accounted
 * for exactly once each, whether or not media has been delivered yet.
 */
{
  const authored = Object.keys(NARRATION);
  const scenes = ew01Av1.scenes;

  const unwired = authored.filter((id) => !scenes[id]);
  if (unwired.length > 0) {
    throw new Error(
      `ew-01 AV1: narration segment(s) with no scene: ${unwired.join(", ")}`,
    );
  }

  const narrated = Object.values(scenes)
    .filter((sc) => sc.media.durationSec > 0)
    .map((sc) => sc.id);
  const unauthored = narrated.filter((id) => !authored.includes(id));
  if (unauthored.length > 0) {
    throw new Error(
      `ew-01 AV1: scene(s) expecting narration that was never authored: ${unauthored.join(", ")}`,
    );
  }
  if (narrated.length !== authored.length) {
    throw new Error(
      `ew-01 AV1: ${narrated.length} scenes carry narration but ${authored.length} segments were authored.`,
    );
  }
}
