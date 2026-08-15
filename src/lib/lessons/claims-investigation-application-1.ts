import type { Lesson } from "@/lib/branching/types";

/**
 * Fundamentals of Claims Investigation — Application Video 1 of 3
 * ============================================================================
 * A branching application lesson. The learner works a live water-damage claim
 * file, makes each call, and sees exactly why every answer is right or wrong
 * before the correct reasoning and a graded completion quiz.
 *
 * Structure:
 *   intro → assignment
 *   DECISION 1 (correct = B) → feedback A/B/C/D → rejoin-1 →
 *   DECISION 2 (correct = C) → feedback A/B/C/D → rejoin-2 →
 *   DECISION 3 (correct = B) → feedback A/B/C/D → rejoin-3 →
 *   resolution (3 beats) → graded 5-question quiz (80% to pass)
 *
 * Media: every narration/decision/feedback/resolution scene carries a media
 * slot (poster + captions) plus its speaking-avatar video or voiceover audio.
 * Swapping a scene's asset is a pure data change — set `videoUrl` or `audioUrl`
 * on its `media` and nothing else changes.
 */

const INSTRUCTOR = {
  name: "Diane Marchetti",
  role: "Course Presenter",
};

const PRESENTER_POSTER = "/media/presenter-diane.jpg";

export const claimsInvestigationApplication1: Lesson = {
  id: "claims-investigation-application-1",
  slug: "claims-investigation-application-1",
  courseTitle: "Fundamentals of Claims Investigation",
  title: "Case Application — You Have the File",
  subtitle: "Application Video 1 of 3",
  summary:
    "Work a live water-damage file on video. Three decisions, each with its own feedback branch, then the correct reasoning — flowing into a graded quiz.",
  estimatedMinutes: 8,
  completion: {
    takeaway:
      "Motive triggers investigation. Only evidence supports a conclusion.",
    headlineAllCorrect: "You worked it the way it's done.",
    headlinePartial: "The case resolves — carry the method forward.",
  },
  startSceneId: "intro",
  meta: {
    module: "Application Video 1 of 3",
    author: "Eximious Academy",
  },
  scenes: {
    // ---------------------------------------------------------------- intro
    intro: {
      id: "intro",
      type: "narrative",
      role: "intro",
      label: "You have the file",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Case Application",
      headline: "You Have the File",
      subhead:
        "How this lesson works: work a live claim file and make each call. Choose an answer and you'll see exactly why that choice is right or wrong, followed by the correct reasoning — then a short graded quiz.",
      body: "You've read the lessons. Now let's find out if it stuck. I'm handing you a live file and you're making the calls. Pause when I ask.",
      continueLabel: "See the assignment",
      media: {
        // Real lip-synced avatar: shimmer voice (OpenAI tts-1-hd) → InfiniTalk
        // (KIE, no HeyGen), baked audio. Swap in a longer/HeyGen clip by
        // replacing videoUrl; nothing else changes.
        provider: "file",
        videoUrl: "/media/intro-appvideo-v1.mp4",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "claim-desk",
        durationSec: 8.08,
        loop: false,
        hasAudio: true,
        captions: [
          { start: 0, end: 2.7, text: "You've read the lessons. Now let's find out if it stuck." },
          { start: 2.7, end: 6.2, text: "I'm handing you a live file and you're making the calls." },
          { start: 6.2, end: 8.08, text: "Pause when I ask." },
        ],
      },
      next: "assignment",
    },

    // ----------------------------------------------------------- assignment
    assignment: {
      id: "assignment",
      type: "narrative",
      role: "briefing",
      label: "The assignment",
      layout: "fullscreen",
      kicker: "On screen · The Assignment",
      headline: "The Assignment",
      subhead: "Residential water damage · finished basement",
      body: "A homeowner reports water damage in a finished basement, reported eleven days after the date of loss. The insured says a supply line behind the washing machine burst. The photos show staining running well up the drywall, with mold on the lower two feet. The policy covers sudden and accidental discharge and excludes damage occurring over a period of time.",
      continueLabel: "Decision 1",
      media: {
        // Audio-only: shimmer voiceover over the evidence exhibits (no talking
        // head on a full-screen evidence scene).
        provider: "file",
        audioUrl: "/media/assignment.mp3",
        hasAudio: true,
        placeholderScene: "flooded-interior",
        durationSec: 22.42,
        captions: [
          { start: 0, end: 7, text: "A homeowner reports water damage in a finished basement, reported eleven days after the date of loss." },
          { start: 7, end: 12.5, text: "The insured says a supply line behind the washing machine burst." },
          { start: 12.5, end: 20, text: "The photos show staining running well up the drywall, with mold on the lower two feet." },
          { start: 20, end: 30, text: "The policy covers sudden and accidental discharge and excludes damage occurring over a period of time." },
        ],
      },
      evidence: [
        {
          id: "assignment-photo",
          kind: "photo",
          title: "Basement — staining well up the drywall, mold on the lower two feet",
          caption: "Reported eleven days after the date of loss.",
          imageUrl: "/media/evidence-basement.jpg",
          illustration: "damage-photo",
        },
        {
          id: "assignment-policy",
          kind: "document",
          title: "Policy — coverage & exclusion",
          caption: "Covers sudden and accidental discharge; excludes damage occurring over a period of time.",
          illustration: "coverage-clause",
        },
      ],
      next: "decision-1",
    },

    // ---------------------------------------------------------- DECISION 1
    "decision-1": {
      id: "decision-1",
      type: "decision",
      label: "Decision 1 · Investigation trigger",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Decision 1 of 3",
      decisionLabel: "Decision 1 of 3",
      prompt: "What most clearly signals this needs investigation?",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "claim-desk",
        durationSec: 6,
        captions: [
          { start: 0, end: 6, text: "What most clearly signals this needs investigation?" },
        ],
      },
      options: [
        {
          id: "A",
          label: "The claim was reported eleven days late",
          isCorrect: false,
          feedbackSceneId: "fb-1a",
        },
        {
          id: "B",
          label: "The described cause of loss doesn't match the physical damage",
          isCorrect: true,
          feedbackSceneId: "fb-1b",
        },
        {
          id: "C",
          label: "The insured has a finished basement, which raises the claim value",
          isCorrect: false,
          feedbackSceneId: "fb-1c",
        },
        {
          id: "D",
          label: "Water claims are the most common type of fraud",
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
      consequence: "Not quite",
      label: "D1 · A — late reporting",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "On screen · Not quite",
      headline: "Not quite",
      body: "Late reporting is worth noting, but on its own it's weak. People delay claims for a hundred innocent reasons — they were traveling, they thought it was minor, they tried to dry it themselves. If late reporting alone triggered your investigations, you'd investigate half your files and justify none of them. Look for the conflict in the evidence, not the calendar.",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "claim-desk",
        durationSec: 24,
        captions: [
          { start: 0, end: 5, text: "Late reporting is worth noting, but on its own it's weak." },
          { start: 5, end: 12, text: "People delay claims for a hundred innocent reasons — they were traveling, they thought it was minor, they tried to dry it themselves." },
          { start: 12, end: 19, text: "If late reporting alone triggered your investigations, you'd investigate half your files and justify none of them." },
          { start: 19, end: 24, text: "Look for the conflict in the evidence, not the calendar." },
        ],
      },
      next: "rejoin-1",
    },

    "fb-1b": {
      id: "fb-1b",
      type: "feedback",
      verdict: "correct",
      forDecisionId: "decision-1",
      forOptionId: "B",
      consequence: "Correct",
      label: "D1 · B — cause vs. damage (correct)",
      layout: "avatar",
      presenter: INSTRUCTOR,
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "claim-desk",
        durationSec: 2.8,
        captions: [{ start: 0, end: 2.8, text: "Correct." }],
      },
      next: "rejoin-1",
    },

    "fb-1c": {
      id: "fb-1c",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-1",
      forOptionId: "C",
      consequence: "That's a value question, not a coverage question",
      label: "D1 · C — claim value",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "On screen",
      headline: "That's a value question, not a coverage question",
      body: "Claim size affects your reserve and how much scrutiny the file gets — it is not, by itself, an investigative trigger. Investigating a claim because it's expensive is how carriers end up defending a bad-faith allegation. The dollar amount doesn't tell you anything is wrong.",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "policy-document",
        durationSec: 22,
        captions: [
          { start: 0, end: 8, text: "Claim size affects your reserve and how much scrutiny the file gets — it is not, by itself, an investigative trigger." },
          { start: 8, end: 16, text: "Investigating a claim because it's expensive is how carriers end up defending a bad-faith allegation." },
          { start: 16, end: 22, text: "The dollar amount doesn't tell you anything is wrong." },
        ],
      },
      next: "rejoin-1",
    },

    "fb-1d": {
      id: "fb-1d",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-1",
      forOptionId: "D",
      consequence: "This is the dangerous one",
      label: "D1 · D — fraud statistic",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "On screen",
      headline: "This is the dangerous one",
      body: "Careful. That's a statistic about a category, not a fact about this insured. Starting from “water claims are often fraud” means you've decided the conclusion before you've gathered a single fact — and every step after that is confirmation bias. It's exactly the one-sided investigation that creates bad-faith exposure. Investigate the file in front of you, not the category it belongs to.",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "claim-desk",
        durationSec: 26,
        captions: [
          { start: 0, end: 5, text: "Careful. That's a statistic about a category, not a fact about this insured." },
          { start: 5, end: 13, text: "Starting from “water claims are often fraud” means you've decided the conclusion before you've gathered a single fact — and every step after that is confirmation bias." },
          { start: 13, end: 20, text: "It's exactly the one-sided investigation that creates bad-faith exposure." },
          { start: 20, end: 26, text: "Investigate the file in front of you, not the category it belongs to." },
        ],
      },
      next: "rejoin-1",
    },

    "rejoin-1": {
      id: "rejoin-1",
      type: "narrative",
      role: "continuation",
      label: "The real trigger",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "All paths rejoin · On screen",
      headline: "The described cause doesn't match the physical damage",
      body: "That's the trigger. A sudden burst leaves a different damage signature than long-term seepage — and mold two feet up the drywall suggests time, not an instant. That's a genuine conflict between the reported facts and the observable evidence. Facts, coverage, damages, or timing genuinely in dispute — that's what starts an investigation. Not a hunch, not a statistic.",
      continueLabel: "Decision 2",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "moisture-map",
        durationSec: 28,
        captions: [
          { start: 0, end: 3, text: "That's the trigger." },
          { start: 3, end: 11, text: "A sudden burst leaves a different damage signature than long-term seepage — and mold two feet up the drywall suggests time, not an instant." },
          { start: 11, end: 18, text: "That's a genuine conflict between the reported facts and the observable evidence." },
          { start: 18, end: 28, text: "Facts, coverage, damages, or timing genuinely in dispute — that's what starts an investigation. Not a hunch, not a statistic." },
        ],
      },
      next: "decision-2",
    },

    // ---------------------------------------------------------- DECISION 2
    "decision-2": {
      id: "decision-2",
      type: "decision",
      label: "Decision 2 · Coverage question",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Decision 2 of 3",
      decisionLabel: "Decision 2 of 3",
      prompt: "What's the coverage question you're actually investigating?",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "claim-desk",
        durationSec: 6,
        captions: [
          { start: 0, end: 6, text: "What's the coverage question you're actually investigating?" },
        ],
      },
      options: [
        {
          id: "A",
          label: "Whether the insured is telling the truth",
          isCorrect: false,
          feedbackSceneId: "fb-2a",
        },
        {
          id: "B",
          label: "Whether the damage exceeds the deductible",
          isCorrect: false,
          feedbackSceneId: "fb-2b",
        },
        {
          id: "C",
          label: "Whether the discharge was sudden and accidental, or occurred over a period of time",
          isCorrect: true,
          feedbackSceneId: "fb-2c",
        },
        {
          id: "D",
          label: "Whether the insured maintained the washing machine properly",
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
      consequence: "You're investigating the policy, not the person",
      label: "D2 · A — is he lying",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "On screen",
      headline: "You're investigating the policy, not the person",
      body: "This feels right and it's a trap. “Is he lying” isn't a coverage question — it's a character judgment, and it will drag your investigation toward the insured instead of the loss. Frame it that way and you'll gather material about him rather than evidence about the water.",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "claim-desk",
        durationSec: 22,
        captions: [
          { start: 0, end: 4, text: "This feels right and it's a trap." },
          { start: 4, end: 13, text: "“Is he lying” isn't a coverage question — it's a character judgment, and it will drag your investigation toward the insured instead of the loss." },
          { start: 13, end: 22, text: "Frame it that way and you'll gather material about him rather than evidence about the water." },
        ],
      },
      next: "rejoin-2",
    },

    "fb-2b": {
      id: "fb-2b",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-2",
      forOptionId: "B",
      consequence: "That's an adjusting step, not the investigation",
      label: "D2 · B — deductible",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "On screen",
      headline: "That's an adjusting step, not the investigation",
      body: "The deductible matters for payment. It decides nothing about whether this loss is covered at all. If the exclusion applies, the deductible is irrelevant — there's nothing to apply it to.",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "policy-document",
        durationSec: 18,
        captions: [
          { start: 0, end: 4, text: "The deductible matters for payment." },
          { start: 4, end: 10, text: "It decides nothing about whether this loss is covered at all." },
          { start: 10, end: 18, text: "If the exclusion applies, the deductible is irrelevant — there's nothing to apply it to." },
        ],
      },
      next: "rejoin-2",
    },

    "fb-2c": {
      id: "fb-2c",
      type: "feedback",
      verdict: "correct",
      forDecisionId: "decision-2",
      forOptionId: "C",
      consequence: "Correct",
      label: "D2 · C — sudden vs. over time (correct)",
      layout: "avatar",
      presenter: INSTRUCTOR,
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "claim-desk",
        durationSec: 2.8,
        captions: [{ start: 0, end: 2.8, text: "Correct." }],
      },
      next: "rejoin-2",
    },

    "fb-2d": {
      id: "fb-2d",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-2",
      forOptionId: "D",
      consequence: "Close, but you've jumped ahead",
      label: "D2 · D — maintenance",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "On screen",
      headline: "Close, but you've jumped ahead",
      body: "Maintenance may become relevant, but you've skipped the primary question. Don't start hunting for a secondary theory before you've resolved the one the policy language actually turns on.",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "moisture-map",
        durationSec: 16,
        captions: [
          { start: 0, end: 6, text: "Maintenance may become relevant, but you've skipped the primary question." },
          { start: 6, end: 16, text: "Don't start hunting for a secondary theory before you've resolved the one the policy language actually turns on." },
        ],
      },
      next: "rejoin-2",
    },

    "rejoin-2": {
      id: "rejoin-2",
      type: "narrative",
      role: "continuation",
      label: "The coverage question",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Rejoin · On screen",
      headline: "Sudden and accidental, or over a period of time?",
      body: "You're not investigating “what happened” in the abstract. You're investigating whether this policy responds to this loss. This entire claim turns on one factual question, and framing it first tells you exactly what to photograph, who to call, and which dates to pin down. Frame it second and you'll collect a mountain of material that decides nothing.",
      continueLabel: "Decision 3",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "policy-document",
        durationSec: 26,
        captions: [
          { start: 0, end: 6, text: "You're not investigating “what happened” in the abstract. You're investigating whether this policy responds to this loss." },
          { start: 6, end: 17, text: "This entire claim turns on one factual question, and framing it first tells you exactly what to photograph, who to call, and which dates to pin down." },
          { start: 17, end: 26, text: "Frame it second and you'll collect a mountain of material that decides nothing." },
        ],
      },
      next: "decision-3",
    },

    // ---------------------------------------------------------- DECISION 3
    "decision-3": {
      id: "decision-3",
      type: "decision",
      label: "Decision 3 · Motive",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Decision 3 of 3",
      decisionLabel: "Decision 3 of 3",
      prompt: "You learn the insured had recent financial trouble. What does that give you?",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "claim-desk",
        durationSec: 7,
        captions: [
          { start: 0, end: 7, text: "You learn the insured had recent financial trouble. What does that give you?" },
        ],
      },
      options: [
        {
          id: "A",
          label: "Evidence the loss was gradual",
          isCorrect: false,
          feedbackSceneId: "fb-3a",
        },
        {
          id: "B",
          label: "Motive — a reason to investigate thoroughly, but not proof of anything",
          isCorrect: true,
          feedbackSceneId: "fb-3b",
        },
        {
          id: "C",
          label: "Enough to deny under the exclusion",
          isCorrect: false,
          feedbackSceneId: "fb-3c",
        },
        {
          id: "D",
          label: "Grounds to refer it to law enforcement",
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
      consequence: "Financial facts don't date water damage",
      label: "D3 · A — gradual loss",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "On screen",
      headline: "Financial facts don't date water damage",
      body: "His bank account tells you nothing about when the pipe failed. Only physical and technical evidence can answer that. Connecting the two in your file is exactly the leap a plaintiff's attorney will read aloud.",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "policy-document",
        durationSec: 18,
        captions: [
          { start: 0, end: 6, text: "His bank account tells you nothing about when the pipe failed." },
          { start: 6, end: 11, text: "Only physical and technical evidence can answer that." },
          { start: 11, end: 18, text: "Connecting the two in your file is exactly the leap a plaintiff's attorney will read aloud." },
        ],
      },
      next: "rejoin-3",
    },

    "fb-3b": {
      id: "fb-3b",
      type: "feedback",
      verdict: "correct",
      forDecisionId: "decision-3",
      forOptionId: "B",
      consequence: "Correct",
      label: "D3 · B — motive, not proof (correct)",
      layout: "avatar",
      presenter: INSTRUCTOR,
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "claim-desk",
        durationSec: 2.8,
        captions: [{ start: 0, end: 2.8, text: "Correct." }],
      },
      next: "rejoin-3",
    },

    "fb-3c": {
      id: "fb-3c",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-3",
      forOptionId: "C",
      consequence: "This is how bad-faith claims are born",
      label: "D3 · C — deny under exclusion",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "On screen",
      headline: "This is how bad-faith claims are born",
      body: "Remember who carries the burden. If you're denying under the “over a period of time” exclusion, the carrier has to prove the exclusion applies — with corroborated evidence, not an inference about someone's finances. Motive plus a loss is not preponderance.",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "policy-document",
        durationSec: 22,
        captions: [
          { start: 0, end: 4, text: "Remember who carries the burden." },
          { start: 4, end: 14, text: "If you're denying under the “over a period of time” exclusion, the carrier has to prove the exclusion applies — with corroborated evidence, not an inference about someone's finances." },
          { start: 14, end: 22, text: "Motive plus a loss is not preponderance." },
        ],
      },
      next: "rejoin-3",
    },

    "fb-3d": {
      id: "fb-3d",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-3",
      forOptionId: "D",
      consequence: "Wrong standard, wrong stage",
      label: "D3 · D — criminal referral",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "On screen",
      headline: "Wrong standard, wrong stage",
      body: "You're nowhere near a criminal referral. That requires far more than motive, and reaching for it this early — on a civil claim with no corroborating evidence — is both premature and a liability.",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "claim-desk",
        durationSec: 18,
        captions: [
          { start: 0, end: 5, text: "You're nowhere near a criminal referral." },
          { start: 5, end: 18, text: "That requires far more than motive, and reaching for it this early — on a civil claim with no corroborating evidence — is both premature and a liability." },
        ],
      },
      next: "rejoin-3",
    },

    "rejoin-3": {
      id: "rejoin-3",
      type: "narrative",
      role: "continuation",
      label: "Motive vs. evidence",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Rejoin · On screen",
      headline: "Motive triggers investigation. Only evidence supports a conclusion.",
      body: "Motive is a reason to look harder. It is never, by itself, the answer. Keep it in your analysis section, labeled as what it is.",
      continueLabel: "See the resolution",
      media: {
        provider: "placeholder",
        posterUrl: PRESENTER_POSTER,
        placeholderScene: "moisture-map",
        durationSec: 12,
        captions: [
          { start: 0, end: 4, text: "Motive is a reason to look harder." },
          { start: 4, end: 8, text: "It is never, by itself, the answer." },
          { start: 8, end: 12, text: "Keep it in your analysis section, labeled as what it is." },
        ],
      },
      next: "resolution-1",
    },

    // --------------------------------------------------------- resolution
    "resolution-1": {
      id: "resolution-1",
      type: "narrative",
      role: "resolution",
      label: "The plumber's report",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "The resolution · On screen",
      headline: "The plumber's report — slow pinhole leak, weeks old",
      body: "Now you have it: corroborated, independent, technical evidence that speaks directly to the coverage question. That meets the burden — and your file shows it. A dated activity log from day one. Photographs with scale and context. The preserved supply line with unbroken chain of custody. A lawfully-taken statement. A sourced timeline flagging the conflict. And your opinions in the analysis section, labeled, tied to the evidence.",
      continueLabel: "Continue",
      media: {
        provider: "placeholder",
        posterUrl: "/media/presenter-resolution.jpg",
        placeholderScene: "resolution",
        durationSec: 30,
        captions: [
          { start: 0, end: 7, text: "Now you have it: corroborated, independent, technical evidence that speaks directly to the coverage question." },
          { start: 7, end: 11, text: "That meets the burden — and your file shows it." },
          { start: 11, end: 15, text: "A dated activity log from day one. Photographs with scale and context." },
          { start: 15, end: 21, text: "The preserved supply line with unbroken chain of custody. A lawfully-taken statement." },
          { start: 21, end: 30, text: "A sourced timeline flagging the conflict. And your opinions in the analysis section, labeled, tied to the evidence." },
        ],
      },
      next: "resolution-2",
    },

    "resolution-2": {
      id: "resolution-2",
      type: "narrative",
      role: "resolution",
      label: "The test",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "On screen",
      headline: "Could a stranger reconstruct this file and independently reach your conclusion?",
      body: "That's the test. If yes, you've done the job.",
      continueLabel: "Continue",
      media: {
        provider: "placeholder",
        posterUrl: "/media/presenter-resolution.jpg",
        placeholderScene: "resolution",
        durationSec: 8,
        captions: [
          { start: 0, end: 4, text: "That's the test." },
          { start: 4, end: 8, text: "If yes, you've done the job." },
        ],
      },
      next: "resolution-3",
    },

    "resolution-3": {
      id: "resolution-3",
      type: "narrative",
      role: "resolution",
      label: "Same method",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "On screen",
      headline: "Same method. Different answer.",
      body: "Flip one fact — the plumber finds a clean, catastrophic split consistent with sudden failure — and this identical investigation defensibly pays the claim, promptly and with confidence. That's the whole point. The answer changes. The method doesn't.",
      continueLabel: "Begin the graded quiz",
      media: {
        provider: "placeholder",
        posterUrl: "/media/presenter-resolution.jpg",
        placeholderScene: "resolution",
        durationSec: 20,
        captions: [
          { start: 0, end: 9, text: "Flip one fact — the plumber finds a clean, catastrophic split consistent with sudden failure — and this identical investigation defensibly pays the claim, promptly and with confidence." },
          { start: 9, end: 13, text: "That's the whole point." },
          { start: 13, end: 20, text: "The answer changes. The method doesn't." },
        ],
      },
      next: "quiz",
    },

    // ---------------------------------------------------------------- quiz
    quiz: {
      id: "quiz",
      type: "quiz",
      label: "Completion quiz",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Graded completion quiz",
      headline: "Completion quiz",
      passPct: 80,
      intro:
        "Five questions on the method you just worked. You need 80% to pass.",
      result: {
        passHeadline: "Passed — you've completed the lesson.",
        failHeadline: "Not yet — review and try again.",
        passNote: "Same method, every file: cause and coverage before conclusions.",
        failNote: "Rewatch the branch you missed, then retake — 80% is the bar.",
      },
      media: {
        provider: "placeholder",
        posterUrl: "/media/presenter-resolution.jpg",
        placeholderScene: "resolution",
        durationSec: 6,
        captions: [
          { start: 0, end: 6, text: "Five questions. Eighty percent to pass." },
        ],
      },
      questions: [
        {
          id: "q1",
          prompt: "What most clearly signals that a claim needs investigation?",
          options: [
            { id: "A", label: "It was reported after the date of loss", isCorrect: false },
            { id: "B", label: "A genuine conflict between the reported facts and the observable evidence", isCorrect: true },
            { id: "C", label: "The claim value is high enough to affect the reserve", isCorrect: false },
            { id: "D", label: "It falls into a category with a high fraud rate", isCorrect: false },
          ],
          explanation:
            "A dispute in the facts, coverage, damages, or timing is what starts an investigation — not the calendar, the dollar amount, or a category statistic.",
        },
        {
          id: "q2",
          prompt: "In this claim, what is the coverage question you are actually investigating?",
          options: [
            { id: "A", label: "Whether the insured is telling the truth", isCorrect: false },
            { id: "B", label: "Whether the loss exceeds the deductible", isCorrect: false },
            { id: "C", label: "Whether the discharge was sudden and accidental, or occurred over a period of time", isCorrect: true },
            { id: "D", label: "Whether the washing machine was properly maintained", isCorrect: false },
          ],
          explanation:
            "The whole claim turns on whether this policy responds to this loss: sudden and accidental (covered) versus over a period of time (excluded).",
        },
        {
          id: "q3",
          prompt: "The insured had recent financial trouble. What does that give you?",
          options: [
            { id: "A", label: "Evidence that the loss was gradual", isCorrect: false },
            { id: "B", label: "Motive — a reason to investigate thoroughly, but not proof of anything", isCorrect: true },
            { id: "C", label: "Enough to deny under the exclusion", isCorrect: false },
            { id: "D", label: "Grounds to refer the claim to law enforcement", isCorrect: false },
          ],
          explanation:
            "Motive is a reason to look harder. It is never, by itself, the answer, and it belongs in the analysis section labeled as what it is.",
        },
        {
          id: "q4",
          prompt:
            "To deny under the “over a period of time” exclusion, who must prove the exclusion applies, and with what?",
          options: [
            { id: "A", label: "The insured, by proving the loss was sudden", isCorrect: false },
            { id: "B", label: "The carrier, with corroborated evidence", isCorrect: true },
            { id: "C", label: "No one — a plausible inference is enough", isCorrect: false },
            { id: "D", label: "The plaintiff's attorney, at trial", isCorrect: false },
          ],
          explanation:
            "The carrier carries the burden on the exclusion, and it must be met with corroborated evidence — not an inference about someone's finances.",
        },
        {
          id: "q5",
          prompt: "What is the test for a defensible investigation file?",
          options: [
            { id: "A", label: "It reaches a denial", isCorrect: false },
            { id: "B", label: "It is completed quickly", isCorrect: false },
            { id: "C", label: "A stranger could reconstruct it and independently reach the same conclusion", isCorrect: true },
            { id: "D", label: "It confirms the adjuster's first instinct", isCorrect: false },
          ],
          explanation:
            "If a stranger could reconstruct the file and independently reach your conclusion, you've done the job. The method holds even when the answer changes.",
        },
      ],
    },
  },
};

/**
 * GENERATED MEDIA ASSETS
 * ============================================================================
 * The single place real avatar/voice assets are attached to scenes, so the
 * whole lesson's media wiring is visible at a glance (and easy to hand off).
 * Each entry merges into a scene's `media`, preserving its captions, poster,
 * and placeholder backdrop.
 *
 *   - videoUrl  → lip-synced talking avatar (KIE InfiniTalk, shimmer voice baked in)
 *   - audioUrl  → shimmer voiceover over the scene's still/exhibit (no talking head)
 *
 * Every Diane scene is now a lip-synced talking avatar (intro is wired inline
 * above; everything else is here). The only audio-only scene is the assignment
 * (a full-screen evidence exhibit — voiceover, no talking head), wired inline.
 * To swap in higher-quality assets later (e.g. HeyGen), just change the URL.
 */
const MEDIA_ASSETS: Record<
  string,
  { videoUrl?: string; audioUrl?: string; durationSec: number }
> = {
  "decision-1": { videoUrl: "/media/decision-1.mp4", durationSec: 3.26 },
  "decision-2": { videoUrl: "/media/decision-2.mp4", durationSec: 3.78 },
  "decision-3": { videoUrl: "/media/decision-3.mp4", durationSec: 4.8 },
  "rejoin-1": { videoUrl: "/media/rejoin-1.mp4", durationSec: 22.72 },
  "rejoin-2": { videoUrl: "/media/rejoin-2.mp4", durationSec: 21.95 },
  "rejoin-3": { videoUrl: "/media/rejoin-3.mp4", durationSec: 7.74 },
  "resolution-1": { videoUrl: "/media/resolution-1.mp4", durationSec: 26.69 },
  "resolution-2": { videoUrl: "/media/resolution-2.mp4", durationSec: 2.69 },
  "resolution-3": { videoUrl: "/media/resolution-3.mp4", durationSec: 15.3 },
  "fb-1a": { videoUrl: "/media/fb-1a.mp4", durationSec: 22.53 },
  "fb-1b": { videoUrl: "/media/fb-1b.mp4", durationSec: 2.62 },
  "fb-1c": { videoUrl: "/media/fb-1c.mp4", durationSec: 17.09 },
  "fb-1d": { videoUrl: "/media/fb-1d.mp4", durationSec: 24.19 },
  "fb-2a": { videoUrl: "/media/fb-2a.mp4", durationSec: 17.02 },
  "fb-2b": { videoUrl: "/media/fb-2b.mp4", durationSec: 11.65 },
  "fb-2c": { videoUrl: "/media/fb-2c.mp4", durationSec: 2.62 },
  "fb-2d": { videoUrl: "/media/fb-2d.mp4", durationSec: 11.71 },
  "fb-3a": { videoUrl: "/media/fb-3a.mp4", durationSec: 13.12 },
  "fb-3b": { videoUrl: "/media/fb-3b.mp4", durationSec: 2.62 },
  "fb-3c": { videoUrl: "/media/fb-3c.mp4", durationSec: 15.94 },
  "fb-3d": { videoUrl: "/media/fb-3d.mp4", durationSec: 12.16 },
  quiz: { videoUrl: "/media/quiz.mp4", durationSec: 2.88 },
};

for (const [sceneId, asset] of Object.entries(MEDIA_ASSETS)) {
  const scene = claimsInvestigationApplication1.scenes[sceneId];
  if (!scene) continue;
  scene.media = {
    ...scene.media,
    provider: "file",
    hasAudio: true,
    durationSec: asset.durationSec,
    ...(asset.videoUrl ? { videoUrl: asset.videoUrl, loop: false } : {}),
    ...(asset.audioUrl ? { audioUrl: asset.audioUrl } : {}),
  };
}
