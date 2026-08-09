import type { Lesson } from "@/lib/branching/types";

/**
 * DEMO LESSON — Residential Water-Damage Claim
 * ============================================================================
 * A single, self-contained lesson graph. It has ONE decision point (as the
 * brief requires) but the exact same shape scales to three per lesson: just
 * add more `decision` scenes between narrative scenes. Nothing in the player
 * knows or cares how many decisions there are.
 *
 * Narrative arc:
 *   intro → loss evidence → policy/readings briefing → DECISION
 *     ├─ A (deny as flood)        → feedback → ┐
 *     ├─ B (pay in full now)      → feedback → ┤
 *     ├─ C (order C&O inspection) → feedback → ┤  ALL rejoin here
 *     └─ D (collect estimates)    → feedback → ┘
 *   → continuation (C&O findings) → resolution → end
 *
 * The narration lives in `captions`, which the placeholder stage renders in
 * sync — so the demo plays as a fully captioned, accessible lesson before any
 * real avatar/voice asset exists. Replace `media.videoUrl` per scene to swap in
 * HeyGen / ElevenLabs / Mux output; no other change is needed.
 */

const INSTRUCTOR = {
  name: "Diane Marchetti",
  role: "Senior Claims Instructor",
};

export const waterDamageClaim: Lesson = {
  id: "water-damage-claim",
  slug: "water-damage-claim",
  courseTitle: "Property Claims Investigation",
  title: "The Ambiguous Water Loss",
  subtitle: "Establishing cause of loss before coverage",
  summary:
    "A finished basement, a storm, and a policy with three clauses in play. Work the evidence and make the determination a professional adjuster would defend.",
  estimatedMinutes: 6,
  completion: {
    takeaway:
      "you reached the correct resolution: establish cause of loss first, then determine coverage.",
    headlineAllCorrect: "Handled to standard.",
    headlinePartial: "Case resolved — here's the takeaway.",
  },
  startSceneId: "intro",
  meta: {
    module: "Module 2 · Coverage Determination",
    lessonNumber: 7,
    author: "Eximious Academy",
    caseId: "2043-RW",
  },
  scenes: {
    intro: {
      id: "intro",
      type: "narrative",
      role: "intro",
      label: "Case briefing",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Case File 2043-RW",
      headline: "The Ambiguous Water Loss",
      subhead:
        "A residential water-damage claim where the right answer depends entirely on the order you work it.",
      media: {
        provider: "placeholder",
        placeholderScene: "claim-desk",
        durationSec: 30,
        captions: [
          { start: 0, end: 4, text: "Welcome to the Eximious Academy claims investigation series." },
          { start: 4, end: 9.5, text: "I'm Diane Marchetti — today we're working a residential water-damage claim." },
          { start: 9.5, end: 16, text: "Case file 2043-RW: a finished basement, a significant loss, and a policy with more than one clause in play." },
          { start: 16, end: 23, text: "Your job isn't to rush to yes or no. It's to reach the right determination, in the right order." },
          { start: 23, end: 29, text: "Review the evidence with me. Then you'll make the call." },
        ],
      },
      next: "loss-evidence",
    },

    "loss-evidence": {
      id: "loss-evidence",
      type: "narrative",
      role: "evidence",
      label: "The loss",
      layout: "fullscreen",
      kicker: "Evidence · Scene inspection",
      headline: "The Loss",
      subhead: "Finished basement · Castellano residence",
      body: "Photographed on first notice of loss. Water line, warped flooring, and two possible points of entry.",
      media: {
        provider: "placeholder",
        placeholderScene: "flooded-interior",
        durationSec: 26,
        captions: [
          { start: 0, end: 5.5, text: "The policyholders returned from a weekend away to standing water across their finished basement." },
          { start: 5.5, end: 12, text: "The water line sits about sixteen inches up the drywall. Laminate flooring is warped; personal property is damaged." },
          { start: 12, end: 17, text: "A heavy storm moved through the area two nights earlier." },
          { start: 17, end: 24, text: "Note the below-grade window well on the north wall — and the sump pit in the corner." },
        ],
      },
      evidence: [
        {
          id: "photo-basement",
          kind: "photo",
          title: "Basement, north wall",
          caption: "Water line ~16 in.; warped laminate; damaged contents.",
          illustration: "damage-photo",
        },
        {
          id: "floor-plan",
          kind: "diagram",
          title: "Floor plan — points of entry",
          caption: "Below-grade window well (north) and sump pit (SE corner).",
          illustration: "floor-plan",
        },
      ],
      next: "policy-briefing",
    },

    "policy-briefing": {
      id: "policy-briefing",
      type: "narrative",
      role: "briefing",
      label: "Policy & readings",
      layout: "fullscreen",
      kicker: "Evidence · The file",
      headline: "What the File Tells You",
      subhead: "HO-3 · water-backup endorsement · no flood coverage",
      body: "Three plausible causes. Each one lands in a different place under this policy.",
      media: {
        provider: "placeholder",
        placeholderScene: "policy-document",
        durationSec: 31,
        captions: [
          { start: 0, end: 3, text: "Here's what the file tells you." },
          { start: 3, end: 9.5, text: "The policy is an HO-3 with a water-backup and sump-overflow endorsement. There is no flood coverage." },
          { start: 9.5, end: 16.5, text: "Surface water and flood are excluded — and so is continuous or repeated seepage over fourteen days." },
          { start: 16.5, end: 23.5, text: "Moisture is high at the window well and at the sump. The staining around the well looks older than this storm." },
          { start: 23.5, end: 30, text: "Three very different causes. Three very different coverage outcomes." },
        ],
      },
      evidence: [
        {
          id: "policy-clause",
          kind: "document",
          title: "Policy — relevant clauses",
          caption: "Water-backup endorsement (covered) vs. surface-water & seepage exclusions.",
          illustration: "policy-clause",
        },
        {
          id: "moisture",
          kind: "chart",
          title: "Moisture readings (%MC)",
          caption: "Elevated at window well and sump; drywall saturated.",
          illustration: "moisture-readings",
        },
        {
          id: "timeline",
          kind: "diagram",
          title: "Loss timeline",
          caption: "Storm → 2 days → discovered on return.",
          illustration: "timeline",
        },
      ],
      next: "decision-1",
    },

    "decision-1": {
      id: "decision-1",
      type: "decision",
      label: "Your determination",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Decision 1 of 1",
      headline: "Make the Call",
      media: {
        provider: "placeholder",
        placeholderScene: "claim-desk",
        durationSec: 10,
        captions: [
          { start: 0, end: 5.5, text: "You have the loss, the policy, and the readings — but not yet a confirmed cause." },
          { start: 5.5, end: 10, text: "What is your next step?" },
        ],
      },
      prompt:
        "You have the loss, the policy, and the readings — but not a confirmed cause of loss. What is your next step?",
      options: [
        {
          id: "A",
          label: "Deny the claim as flood",
          detail: "Apply the surface-water exclusion and close the file.",
          isCorrect: false,
          feedbackSceneId: "fb-A",
        },
        {
          id: "B",
          label: "Approve and pay in full now",
          detail: "Release payment under dwelling coverage immediately.",
          isCorrect: false,
          feedbackSceneId: "fb-B",
        },
        {
          id: "C",
          label: "Order a cause-and-origin inspection first",
          detail: "Confirm the cause of loss before any coverage determination.",
          isCorrect: true,
          feedbackSceneId: "fb-C",
        },
        {
          id: "D",
          label: "Collect three repair estimates and settle low",
          detail: "Have the insured gather bids and take the lowest.",
          isCorrect: false,
          feedbackSceneId: "fb-D",
        },
      ],
    },

    "fb-A": {
      id: "fb-A",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-1",
      forOptionId: "A",
      label: "Feedback — deny as flood",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Not quite",
      headline: "Denying as flood is premature",
      body: "You can't apply an exclusion before you've established the cause. The failed sump in the corner could bring this squarely under the water-backup endorsement — deny it now and you risk a bad-faith and unfair-claims-practices exposure.",
      media: {
        provider: "placeholder",
        placeholderScene: "claim-desk",
        durationSec: 27,
        captions: [
          { start: 0, end: 4, text: "Hold on — denying as flood is premature." },
          { start: 4, end: 11, text: "Surface water is excluded, yes. But the failed sump in the corner could bring this under the water-backup endorsement." },
          { start: 11, end: 19, text: "Denying before you've confirmed the cause exposes the carrier to bad-faith and unfair-claims-practices claims." },
          { start: 19, end: 26, text: "You can't apply an exclusion to a cause you haven't established. Let's confirm the cause first." },
        ],
      },
      next: "continuation",
    },

    "fb-B": {
      id: "fb-B",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-1",
      forOptionId: "B",
      label: "Feedback — pay in full",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Not quite",
      headline: "Paying in full now is just as risky",
      body: "Releasing payment before you establish a covered cause of loss risks indemnifying an excluded surface-water or long-term-seepage loss — and sets a precedent on the file. Establish the cause first.",
      media: {
        provider: "placeholder",
        placeholderScene: "claim-desk",
        durationSec: 27,
        captions: [
          { start: 0, end: 5, text: "Careful — paying the full claim now is as risky as denying it." },
          { start: 5, end: 13, text: "If the cause is surface water or long-term seepage, you've indemnified an excluded loss and set a precedent for this file." },
          { start: 13, end: 20, text: "Establish a covered cause of loss before you release payment." },
          { start: 20, end: 26, text: "Let's confirm the cause first." },
        ],
      },
      next: "continuation",
    },

    "fb-C": {
      id: "fb-C",
      type: "feedback",
      verdict: "correct",
      forDecisionId: "decision-1",
      forOptionId: "C",
      label: "Feedback — order C&O",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Correct",
      headline: "That's the professional standard",
      body: "Three plausible causes — surface water, a sump/backup failure, and older seepage — carry three different coverage outcomes. So you confirm the cause of loss before determining coverage, never the reverse.",
      media: {
        provider: "placeholder",
        placeholderScene: "claim-desk",
        durationSec: 25,
        captions: [
          { start: 0, end: 3, text: "That's the professional standard." },
          { start: 3, end: 10.5, text: "The evidence points three directions at once — surface water, a sump or backup failure, and older seepage." },
          { start: 10.5, end: 18, text: "Each carries a different outcome, so you establish cause of loss before coverage — never the reverse." },
          { start: 18, end: 24, text: "Let's send it for a cause-and-origin inspection." },
        ],
      },
      next: "continuation",
    },

    "fb-D": {
      id: "fb-D",
      type: "feedback",
      verdict: "incorrect",
      forDecisionId: "decision-1",
      forOptionId: "D",
      label: "Feedback — collect estimates",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Not quite",
      headline: "Estimates scope damage — they don't decide coverage",
      body: "Repair estimates size the loss; they don't establish whether it's covered. And the standard isn't 'lowest bid wins' — it's a proper agreed scope. Coverage first, scope second.",
      media: {
        provider: "placeholder",
        placeholderScene: "claim-desk",
        durationSec: 25,
        captions: [
          { start: 0, end: 6, text: "Not yet. Repair estimates scope the damage — they don't tell you whether the loss is covered." },
          { start: 6, end: 13, text: "And 'lowest estimate wins' isn't the standard; a proper agreed scope is." },
          { start: 13, end: 18, text: "Coverage first, scope second." },
          { start: 18, end: 24, text: "Let's confirm the cause." },
        ],
      },
      next: "continuation",
    },

    continuation: {
      id: "continuation",
      type: "narrative",
      role: "continuation",
      label: "C&O findings",
      layout: "fullscreen",
      kicker: "Continuation · Findings",
      headline: "The Cause-and-Origin Findings",
      subhead: "What the inspection actually found",
      body: "With a confirmed cause, the coverage question answers itself.",
      media: {
        provider: "placeholder",
        placeholderScene: "moisture-map",
        durationSec: 29,
        captions: [
          { start: 0, end: 4, text: "The cause-and-origin inspection comes back." },
          { start: 4, end: 11, text: "During the storm the sump pump failed — a mechanical failure, not surface flooding." },
          { start: 11, end: 19, text: "The older staining at the window well is cosmetic and pre-existing; it is not the source of this loss." },
          { start: 19, end: 28, text: "That brings the claim under the water-backup and sump-overflow endorsement — a covered cause, subject to its sublimit." },
        ],
      },
      evidence: [
        {
          id: "moisture-map",
          kind: "diagram",
          title: "Confirmed source",
          caption: "Sump failure = covered under endorsement. Window-well staining = pre-existing, not causal.",
          illustration: "moisture-readings",
        },
      ],
      next: "resolution",
    },

    resolution: {
      id: "resolution",
      type: "narrative",
      role: "resolution",
      label: "Resolution",
      layout: "avatar",
      presenter: INSTRUCTOR,
      kicker: "Resolution",
      headline: "Coverage Confirmed — in the Right Order",
      subhead: "Cause established → coverage determined → scope the damage",
      media: {
        provider: "placeholder",
        placeholderScene: "resolution",
        durationSec: 33,
        captions: [
          { start: 0, end: 3, text: "So here's the resolution." },
          { start: 3, end: 11, text: "Coverage is confirmed under the endorsement. Set your reserve to the sublimit and document the cause-and-origin findings." },
          { start: 11, end: 18, text: "Then move to scope the damage — in that order." },
          { start: 18, end: 25, text: "One decision, taken in the right sequence, protected both the policyholder and the carrier." },
          { start: 25, end: 32, text: "That's the Eximious standard. We'll see you in the next case." },
        ],
      },
      next: null,
    },
  },
};
