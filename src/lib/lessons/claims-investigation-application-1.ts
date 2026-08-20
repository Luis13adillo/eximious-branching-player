import type { Lesson, MediaSource } from "@/lib/branching/types";
import { NARRATION, type NarrationId } from "./claims-01-av1.narration";

/**
 * claims-01 · Application Video 1 of 3 — "The File Lands on Your Desk"
 * ============================================================================
 * Course:    Fundamentals of Claims Investigation (Track 1)
 * Presenter: Diane Marchetti (Presenter 1) — appearance and voice LOCKED
 * Package:   EA_claims-01_AV1.zip
 * Covers:    Lessons 1–3
 *
 * AUTHORITY — every spoken line, every decision, every option and every piece
 * of on-screen cue text below comes from the authoritative CLAIMS-01 pilot
 * script (`docs/source/pilot-scripts.pdf`, pp. 1–5). Nothing is invented,
 * omitted, reordered or reworded. The narration strings live in
 * `claims-01-av1.narration.ts` and are byte-exact against the `script_sha256`
 * recorded in each delivered audio sidecar, so what the data says and what
 * Diane says cannot drift.
 *
 * `headline`/`consequence` values are the script's own bracketed `[On screen:]`
 * cues, which its cover page defines as "visual direction, not spoken
 * narration" — so they are rendered by the player, never baked into video
 * (locked pipeline rule 8).
 *
 * STRUCTURE (script §"How to read these scripts")
 *   intro → assignment-1 → assignment-2
 *   DECISION 1 (correct = D) → fb-1a/b/c/d → rejoin-1a → rejoin-1b
 *   DECISION 2 (correct = B) → fb-2a/b/c/d → rejoin-2
 *   DECISION 3 (correct = B) → fb-3a/b/c/d → rejoin-3
 *   resolution-1 → resolution-2 → resolution-3 → hand-off
 *
 * Twelve feedback segments in total. Wrong answers return the learner to the
 * same decision to try again (engine-level retry-until-correct, options
 * reshuffled); only the correct option advances to the rejoin.
 *
 * THE THREE CORRECT-ANSWER BEATS (`fb-1d`, `fb-2b`, `fb-3b`) CARRY NO MEDIA
 * BY DESIGN. The script writes the confirmation only as `[On screen: Correct]`
 * with no narration, so there is no Diane segment to play — the correct-state
 * verdict is player-native UI. See `docs/VIDEO_1_GENERATION_CONFIGS.md` (O-4,
 * decided 2026-08-18); this is why the delivered media set is 22 segments and
 * not 25.
 *
 * NO IN-VIDEO QUIZ. The script ends "[→ Continue to the next lessons]" and the
 * Agreement/Spec hand off to the graded COURSE quiz, which Thinkific owns. The
 * water-damage template proof carried a five-question in-player quiz whose
 * questions were written for the demo; those are not pilot content and are not
 * reproduced here.
 */

const PRESENTER = {
  name: "Diane Marchetti",
  // The lower-third title is fixed at the template level ("Course Presenter",
  // Agreement §1.4) — this role never renders a credential.
  role: "Course Presenter",
};

/** Locked production still — also the poster behind every segment. */
const PRESENTER_POSTER = "/media/presenter-diane.jpg";

/** Delivered exhibit for the script's burned-pickup photo cue. */
const BURNED_PICKUP = "/media/evidence-burned-pickup.jpg";

/**
 * Binds one delivered segment to a scene.
 * ----------------------------------------------------------------------------
 * Every asset is a QA-passed 1920×1080 / 25 fps file under
 * `public/media/claims-01-av1/`, produced by the locked pipeline: locked script
 * → OpenAI `tts-1-hd` `shimmer` → 24 kHz mono −24.5 LUFS master → fal-ai/
 * latentsync against Diane's reusable motion base → trim → remux the locked
 * master → split → conform to exactly 1920×1080. Per-file provenance lives in
 * the matching `<id>.mp4.json` sidecar.
 *
 * Duration and captions come from `NARRATION`, which reads the MEASURED length
 * out of that sidecar — a re-delivered asset therefore cannot silently desync
 * the scrubber or the captions. Swapping an asset is a pure data change.
 */
function segment(id: NarrationId): MediaSource {
  const seg = NARRATION[id];
  return {
    provider: "file",
    // Literal URL from the generated manifest — see NarrationSegment.videoUrl.
    videoUrl: seg.videoUrl,
    posterUrl: PRESENTER_POSTER,
    hasAudio: true,
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

export const claimsInvestigationApplication1: Lesson = {
  id: "claims-investigation-application-1",
  slug: "claims-investigation-application-1",
  courseTitle: "Fundamentals of Claims Investigation",
  title: "Case Application — You Have the File",
  subtitle: "Application Video 1 of 3 — The File Lands on Your Desk",
  summary:
    "Work a live vehicle theft-and-fire file on video. Three decisions, each with its own feedback branch and a retry until you get it right, then the correct reasoning and the resolution.",
  estimatedMinutes: 8,
  completion: {
    // The script's own rejoin-3 on-screen line.
    takeaway:
      "Motive triggers investigation. Only evidence supports a conclusion.",
    headlineAllCorrect: "You worked it the way it's done.",
    headlinePartial: "The case resolves — carry the method forward.",
  },
  startSceneId: "intro",
  /**
   * LEARNER-FACING PROGRESS — the approved 12-step rail.
   * --------------------------------------------------------------------------
   * The scene graph is 25 scenes and its spine is 13, because the script cues a
   * new on-screen state in the MIDDLE of the assignment (the burned-pickup
   * photo) and the media pipeline splits segments at those cues. That split is
   * production plumbing, not a teaching beat: `assignment-1` and `assignment-2`
   * are one thing to the learner — "here is the file" — with an exhibit inside
   * it. They are therefore one milestone.
   *
   * Nothing else is grouped. Every other on-screen cue in the script opens a
   * distinct teaching beat (`rejoin-1b` introduces the escalation boxes, which
   * is new instruction rather than a restatement of `rejoin-1a`), so merging any
   * of them would hide content from the learner's map.
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
      label: "Decision 1 · Investigation trigger",
      scenes: ["decision-1"],
    },
    { id: "trigger", label: "The documented trigger", scenes: ["rejoin-1a"] },
    { id: "escalation", label: "Know your box", scenes: ["rejoin-1b"] },
    {
      id: "decision-2",
      label: "Decision 2 · Burden of proof",
      scenes: ["decision-2"],
    },
    {
      id: "burden",
      label: "Issue · Burden · Standard · Evidence",
      scenes: ["rejoin-2"],
    },
    { id: "decision-3", label: "Decision 3 · Motive", scenes: ["decision-3"] },
    { id: "motive", label: "Motive vs. evidence", scenes: ["rejoin-3"] },
    {
      id: "inventory",
      label: "Where the file stands",
      scenes: ["resolution-1"],
    },
    { id: "answer", label: "Keep investigating", scenes: ["resolution-2"] },
    {
      id: "method",
      label: "Same method. Different answer.",
      scenes: ["resolution-3"],
    },
  ],
  meta: {
    module: "Application Video 1 of 3",
    lessonNumber: 1,
    author: "Roger M. Naut",
    caseId: "4471-88203",
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
      subhead: "Claim 4471-88203 · Marcus Delaney · 2019 Ford F-250",
      body: NARRATION["assignment-1"].text,
      continueLabel: "Continue",
      media: segment("assignment-1"),
      next: "assignment-2",
    },

    "assignment-2": {
      id: "assignment-2",
      type: "narrative",
      role: "evidence",
      label: "The desk file",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "On screen · Exhibit",
      headline: "What's in the desk file",
      body: NARRATION["assignment-2"].text,
      continueLabel: "Make the call",
      media: segment("assignment-2"),
      // [On screen: Photo — burned pickup on gravel road, tires melted, glass
      //  gone, no other vehicles in frame]
      evidence: [
        {
          id: "burned-pickup",
          kind: "photo",
          title:
            "Photo — burned pickup on gravel road, tires melted, glass gone, no other vehicles in frame",
          caption:
            "Recovered March 5, eleven miles out of town. Cause of the fire is undetermined.",
          imageUrl: BURNED_PICKUP,
        },
      ],
      next: "decision-1",
    },

    // =========================================================== DECISION 1
    "decision-1": {
      id: "decision-1",
      type: "decision",
      label: "Decision 1 · Investigation trigger",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "Decision 1 of 3",
      decisionLabel: "Decision 1 of 3",
      prompt: NARRATION["decision-1"].text,
      media: segment("decision-1"),
      options: [
        {
          id: "A",
          label: "The adjuster's instinct that something is off",
          isCorrect: false,
          feedbackSceneId: "fb-1a",
        },
        {
          id: "B",
          label: "The insured owes more on the truck than it's worth",
          isCorrect: false,
          feedbackSceneId: "fb-1b",
        },
        {
          id: "C",
          label: "The claim exceeds $35,000, which is the referral threshold",
          isCorrect: false,
          feedbackSceneId: "fb-1c",
        },
        {
          id: "D",
          label:
            "The reported cause of loss — theft — is a fact genuinely in dispute, and the file has no evidence resolving it either way",
          isCorrect: true,
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
      label: "D1 · A — the adjuster's instinct",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "A hunch is not a trigger",
      headline: "A hunch is not a trigger",
      body: NARRATION["fb-1a"].text,
      media: segment("fb-1a"),
      next: "rejoin-1a",
    },

    "fb-1b": {
      id: "fb-1b",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-1",
      forOptionId: "B",
      label: "D1 · B — negative equity",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "That's motive, and you've jumped three lessons ahead",
      headline: "That's motive, and you've jumped three lessons ahead",
      body: NARRATION["fb-1b"].text,
      media: segment("fb-1b"),
      next: "rejoin-1a",
    },

    "fb-1c": {
      id: "fb-1c",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-1",
      forOptionId: "C",
      label: "D1 · C — dollar threshold",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Dollar thresholds route files; they don't define investigations",
      headline: "Dollar thresholds route files; they don't define investigations",
      body: NARRATION["fb-1c"].text,
      media: segment("fb-1c"),
      next: "rejoin-1a",
    },

    // The script gives the correct answer as `[On screen: Correct]` with NO
    // narration, so this beat has no media and is rendered by the player.
    "fb-1d": {
      id: "fb-1d",
      type: "feedback",
      verdict: "correct",
      forDecisionId: "decision-1",
      forOptionId: "D",
      label: "D1 · D — cause of loss in dispute (correct)",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Correct",
      headline: "Correct",
      continueLabel: "Continue",
      media: correctBeat(),
      next: "rejoin-1a",
    },

    // ============================================================= REJOIN 1
    "rejoin-1a": {
      id: "rejoin-1a",
      type: "narrative",
      role: "continuation",
      label: "The documented trigger",
      layout: "avatar",
      presenter: PRESENTER,
      // [All paths rejoin — On screen: Facts, coverage, damages, or timing
      //  genuinely in dispute]
      kicker: "All paths rejoin · On screen",
      headline: "Facts, coverage, damages, or timing genuinely in dispute",
      body: NARRATION["rejoin-1a"].text,
      continueLabel: "Continue",
      media: segment("rejoin-1a"),
      summaryCard: {
        kicker: "On screen",
        title: "What turns adjustment into investigation",
        items: [
          { icon: "facts", label: "Facts" },
          { icon: "coverage", label: "Coverage" },
          { icon: "damages", label: "Damages" },
          { icon: "timing", label: "Timing" },
        ],
        takeaway: "Facts, coverage, damages, or timing genuinely in dispute.",
      },
      next: "rejoin-1b",
    },

    "rejoin-1b": {
      id: "rejoin-1b",
      type: "narrative",
      role: "continuation",
      label: "Know your box",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: Adjusting → Investigation → SIU. Know which box you're in.]
      kicker: "On screen",
      headline: "Adjusting → Investigation → SIU. Know which box you're in.",
      body: NARRATION["rejoin-1b"].text,
      continueLabel: "Make the call",
      media: segment("rejoin-1b"),
      // Stage details are the script's own words: "You're the investigator. You
      // develop facts. You are not the adjuster deciding payment, and you are
      // not SIU running a fraud case."
      chain: {
        kicker: "On screen",
        stages: [
          { label: "Adjusting", detail: "Deciding payment" },
          { label: "Investigation", detail: "Developing facts", current: true },
          { label: "SIU", detail: "Running a fraud case" },
        ],
        takeaway: "Know which box you're in.",
      },
      next: "decision-2",
    },

    // =========================================================== DECISION 2
    "decision-2": {
      id: "decision-2",
      type: "decision",
      label: "Decision 2 · Burden of proof",
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
            "The insured has the burden to prove the truck was stolen, so you can simply wait for him to fail",
          isCorrect: false,
          feedbackSceneId: "fb-2a",
        },
        {
          id: "B",
          label:
            "The carrier has the burden to prove the exclusion applies, so your file has to carry it",
          isCorrect: true,
          feedbackSceneId: "fb-2b",
        },
        {
          id: "C",
          label: "Nobody has a burden until litigation is filed",
          isCorrect: false,
          feedbackSceneId: "fb-2c",
        },
        {
          id: "D",
          label: "The burden is on whoever has the better evidence",
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
      label: "D2 · A — wait for him to fail",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "You had it right — then the issue changed under you",
      headline: "You had it right — then the issue changed under you",
      body: NARRATION["fb-2a"].text,
      media: segment("fb-2a"),
      next: "rejoin-2",
    },

    "fb-2b": {
      id: "fb-2b",
      type: "feedback",
      verdict: "correct",
      forDecisionId: "decision-2",
      forOptionId: "B",
      label: "D2 · B — the carrier carries the exclusion (correct)",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Correct",
      headline: "Correct",
      continueLabel: "Continue",
      media: correctBeat(),
      next: "rejoin-2",
    },

    "fb-2c": {
      id: "fb-2c",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-2",
      forOptionId: "C",
      label: "D2 · C — no burden until litigation",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Wrong by a mile, and dangerous",
      headline: "Wrong by a mile, and dangerous",
      body: NARRATION["fb-2c"].text,
      media: segment("fb-2c"),
      next: "rejoin-2",
    },

    "fb-2d": {
      id: "fb-2d",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-2",
      forOptionId: "D",
      label: "D2 · D — whoever has better evidence",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "That's not how burdens work",
      headline: "That's not how burdens work",
      body: NARRATION["fb-2d"].text,
      media: segment("fb-2d"),
      next: "rejoin-2",
    },

    // ============================================================= REJOIN 2
    "rejoin-2": {
      id: "rejoin-2",
      type: "narrative",
      role: "continuation",
      label: "Issue · Burden · Standard · Evidence",
      layout: "avatar",
      presenter: PRESENTER,
      // [Rejoin — On screen: Insureds carry coverage. Insurers carry exclusions.]
      kicker: "All paths rejoin · On screen",
      headline: "Insureds carry coverage. Insurers carry exclusions.",
      body: NARRATION["rejoin-2"].text,
      continueLabel: "Make the call",
      media: segment("rejoin-2"),
      // [On screen: The four steps — 1. Issue 2. Burden 3. Standard 4. Evidence]
      summaryCard: {
        kicker: "On screen",
        title: "The four steps",
        numbered: true,
        items: [
          { icon: "issue", label: "Issue" },
          { icon: "burden", label: "Burden" },
          { icon: "standard", label: "Standard" },
          { icon: "evidence", label: "Evidence" },
        ],
        takeaway: "Insureds carry coverage. Insurers carry exclusions.",
      },
      next: "decision-3",
    },

    // =========================================================== DECISION 3
    "decision-3": {
      id: "decision-3",
      type: "decision",
      label: "Decision 3 · Motive",
      layout: "avatar",
      presenter: PRESENTER,
      kicker: "Decision 3 of 3",
      decisionLabel: "Decision 3 of 3",
      prompt: NARRATION["decision-3"].text,
      media: segment("decision-3"),
      options: [
        {
          id: "A",
          label: "Corroboration that the fire was intentionally set",
          isCorrect: false,
          feedbackSceneId: "fb-3a",
        },
        {
          id: "B",
          label:
            "Motive — a reason to investigate thoroughly, but not proof of anything",
          isCorrect: true,
          feedbackSceneId: "fb-3b",
        },
        {
          id: "C",
          label:
            "Enough, combined with the burned vehicle, to meet preponderance",
          isCorrect: false,
          feedbackSceneId: "fb-3c",
        },
        {
          id: "D",
          label:
            "A basis to tell him in the recorded statement that you know what he did",
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
      label: "D3 · A — corroboration of arson",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "A repo notice can't tell you how a fire started",
      headline: "A repo notice can't tell you how a fire started",
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
      label: "D3 · B — motive, not proof (correct)",
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
      label: "D3 · C — meets preponderance",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "Motive plus a loss is not preponderance",
      headline: "Motive plus a loss is not preponderance",
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
      label: "D3 · D — tell him you know",
      layout: "avatar",
      presenter: PRESENTER,
      consequence: "That's coercion, and it ends the investigation",
      headline: "That's coercion, and it ends the investigation",
      body: NARRATION["fb-3d"].text,
      media: segment("fb-3d"),
      next: "rejoin-3",
    },

    // ============================================================= REJOIN 3
    "rejoin-3": {
      id: "rejoin-3",
      type: "narrative",
      role: "continuation",
      label: "Motive vs. evidence",
      layout: "avatar",
      presenter: PRESENTER,
      // [Rejoin — On screen: "Motive triggers investigation. Only evidence
      //  supports a conclusion."]
      kicker: "All paths rejoin · On screen",
      headline:
        "“Motive triggers investigation. Only evidence supports a conclusion.”",
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
      label: "Where the file stands",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: Exhibit — evidence inventory, three columns:
      //  HAVE / NEED / UNAVAILABLE]
      kicker: "The resolution · On screen",
      headline: "Evidence inventory — HAVE / NEED / UNAVAILABLE",
      body: NARRATION["resolution-1"].text,
      continueLabel: "Continue",
      media: segment("resolution-1"),
      // The five items Diane grades in this segment, in the order she grades
      // them. UNAVAILABLE is empty on day fourteen — nothing in this file is
      // unobtainable yet, which is itself the finding, so the column still
      // renders rather than being hidden.
      inventory: {
        kicker: "The resolution · On screen",
        title: "Evidence inventory at day fourteen",
        entries: [
          {
            label: "Both keys",
            status: "need",
            note: "He says one is at his mother's house, unverified.",
          },
          {
            label: "Forced entry",
            status: "have",
            note: "Sheriff's recovery report notes no window damage and no punched ignition.",
          },
          {
            label: "Accelerant",
            status: "need",
            note: "Origin-and-cause inspection scheduled for day nineteen.",
          },
          {
            label: "Timeline of last use",
            status: "have",
            conflicted: true,
            note: "He told the FNOL rep he left the store at 8:15 and told you 9:30.",
          },
          {
            label: "Financial detail",
            status: "have",
            note: "Obtained through the proper channel with permissible purpose documented.",
          },
        ],
      },
      // The one inventory row that is "have but conflicting" — the script's own
      // A ≠ B evidence conflict, drilled into.
      comparison: {
        kicker: "Evidence exhibit",
        conflict: "Timeline of last use — have, but conflicting.",
        a: {
          label: "Told the FNOL rep",
          value: "Left the store at 8:15",
        },
        b: {
          label: "Told you",
          value: "Left the store at 9:30",
        },
        note: "Same fact, two accounts. Neither is evidence until one of them is corroborated.",
      },
      next: "resolution-2",
    },

    "resolution-2": {
      id: "resolution-2",
      type: "narrative",
      role: "resolution",
      label: "Keep investigating",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: Today's honest answer — KEEP INVESTIGATING]
      kicker: "On screen",
      headline: "Today's honest answer — KEEP INVESTIGATING",
      body: NARRATION["resolution-2"].text,
      continueLabel: "Continue",
      media: segment("resolution-2"),
      next: "resolution-3",
    },

    "resolution-3": {
      id: "resolution-3",
      type: "narrative",
      role: "resolution",
      label: "Same method. Different answer.",
      layout: "avatar",
      presenter: PRESENTER,
      // [On screen: Same method. Different answer.]
      kicker: "On screen",
      headline: "Same method. Different answer.",
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
 * MEDIA-COVERAGE INTEGRITY CHECK
 * ============================================================================
 * Runs when the module loads — which is during `next build` — so a segment that
 * exists on disk but was never wired to a scene, or a scene wired to a segment
 * that was never delivered, fails the build instead of showing a learner a dead
 * player. The 22 delivered segments and the 3 player-native correct beats are
 * accounted for exactly once each.
 */
{
  const delivered = Object.keys(NARRATION);
  const scenes = claimsInvestigationApplication1.scenes;

  const unwired = delivered.filter((id) => !scenes[id]);
  if (unwired.length > 0) {
    throw new Error(
      `claims-01 AV1: delivered segment(s) with no scene: ${unwired.join(", ")}`,
    );
  }

  const wired = Object.values(scenes)
    .filter((sc) => !!sc.media.videoUrl)
    .map((sc) => sc.id);
  const undelivered = wired.filter((id) => !delivered.includes(id));
  if (undelivered.length > 0) {
    throw new Error(
      `claims-01 AV1: scene(s) wired to an undelivered segment: ${undelivered.join(", ")}`,
    );
  }
  if (wired.length !== delivered.length) {
    throw new Error(
      `claims-01 AV1: ${wired.length} scenes carry video but ${delivered.length} segments were delivered.`,
    );
  }
}
