import type { Lesson } from "@/lib/branching/types";

/**
 * DELIVERABLE pilot lesson — claims-01-av1-native (native cut), STANDALONE.
 * ============================================================================
 * Every media path is a literal, baked from the resolved lesson — no dependency
 * on any other lesson module — so this exports cleanly to a self-contained
 * Thinkific HTML5 package. Regenerate with scripts/bake-deliverable-lessons.ts.
 */
export const claims01Av1Native: Lesson = {
  "id": "claims-01-av1-native",
  "slug": "claims-01-av1-native",
  "courseTitle": "Fundamentals of Claims Investigation",
  "title": "Case Application — You Have the File",
  "subtitle": "Application Video 1 of 3 — The File Lands on Your Desk",
  "summary": "Work a live vehicle theft-and-fire file on video. Three decisions, each with its own feedback branch and a retry until you get it right, then the correct reasoning and the resolution.",
  "estimatedMinutes": 8,
  "completion": {
    "takeaway": "Motive triggers investigation. Only evidence supports a conclusion.",
    "headlineAllCorrect": "You worked it the way it's done.",
    "headlinePartial": "The case resolves — carry the method forward."
  },
  "startSceneId": "intro",
  "progress": [
    {
      "id": "open",
      "label": "You have the file",
      "scenes": [
        "intro"
      ]
    },
    {
      "id": "assignment",
      "label": "The assignment",
      "scenes": [
        "assignment-1",
        "assignment-2"
      ]
    },
    {
      "id": "decision-1",
      "label": "Decision 1 · Investigation trigger",
      "scenes": [
        "decision-1"
      ]
    },
    {
      "id": "trigger",
      "label": "The documented trigger",
      "scenes": [
        "rejoin-1a"
      ]
    },
    {
      "id": "escalation",
      "label": "Know your box",
      "scenes": [
        "rejoin-1b"
      ]
    },
    {
      "id": "decision-2",
      "label": "Decision 2 · Burden of proof",
      "scenes": [
        "decision-2"
      ]
    },
    {
      "id": "burden",
      "label": "Issue · Burden · Standard · Evidence",
      "scenes": [
        "rejoin-2"
      ]
    },
    {
      "id": "decision-3",
      "label": "Decision 3 · Motive",
      "scenes": [
        "decision-3"
      ]
    },
    {
      "id": "motive",
      "label": "Motive vs. evidence",
      "scenes": [
        "rejoin-3"
      ]
    },
    {
      "id": "inventory",
      "label": "Where the file stands",
      "scenes": [
        "resolution-1"
      ]
    },
    {
      "id": "answer",
      "label": "Keep investigating",
      "scenes": [
        "resolution-2"
      ]
    },
    {
      "id": "method",
      "label": "Same method. Different answer.",
      "scenes": [
        "resolution-3"
      ]
    }
  ],
  "meta": {
    "module": "Application Video 1 of 3",
    "lessonNumber": 1,
    "author": "Roger M. Naut",
    "caseId": "4471-88203"
  },
  "scenes": {
    "intro": {
      "id": "intro",
      "type": "narrative",
      "role": "intro",
      "label": "You have the file",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "Case Application",
      "headline": "You Have the File",
      "subhead": "Covers Lessons 1–3. Work the file and make each call. Choose an answer and you'll see exactly why that choice is right or wrong, then try again until it's right.",
      "body": "You’ve read the first three lessons. Now let’s find out if it stuck. I’m handing you a live file and you’re making the calls. Pause when I ask.",
      "continueLabel": "See the assignment",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/intro.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 8.88,
        "captions": [
          {
            "start": 0,
            "end": 4.25,
            "text": "You’ve read the first three lessons. Now let’s find out if it stuck."
          },
          {
            "start": 4.25,
            "end": 8.88,
            "text": "I’m handing you a live file and you’re making the calls. Pause when I ask."
          }
        ]
      },
      "next": "assignment-1"
    },
    "assignment-1": {
      "id": "assignment-1",
      "type": "narrative",
      "role": "briefing",
      "label": "The assignment",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "The Assignment",
      "subhead": "Claim 4471-88203 · Marcus Delaney · 2019 Ford F-250",
      "body": "Claim 4471-88203. Insured: Marcus Delaney, 41, owns a 2019 Ford F-250. Reports the truck stolen from a grocery store parking lot on the night of March 2. Vehicle recovered March 5, burned to the frame on a gravel access road eleven miles out of town. Actual cash value $38,400. Loan payoff $41,100 — he’s underwater by about twenty-seven hundred. The adjuster ran a routine file for nine days, then flagged it and sent it to you.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/assignment-1.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 32.08,
        "captions": [
          {
            "start": 0,
            "end": 5.3,
            "text": "Claim 4471-88203. Insured: Marcus Delaney, 41, owns a 2019 Ford F-250."
          },
          {
            "start": 5.3,
            "end": 11.5,
            "text": "Reports the truck stolen from a grocery store parking lot on the night of March 2."
          },
          {
            "start": 11.5,
            "end": 18.76,
            "text": "Vehicle recovered March 5, burned to the frame on a gravel access road eleven miles out of town."
          },
          {
            "start": 18.76,
            "end": 20.73,
            "text": "Actual cash value $38,400."
          },
          {
            "start": 20.73,
            "end": 25.87,
            "text": "Loan payoff $41,100 — he’s underwater by about twenty-seven hundred."
          },
          {
            "start": 25.87,
            "end": 32.08,
            "text": "The adjuster ran a routine file for nine days, then flagged it and sent it to you."
          }
        ]
      },
      "next": "assignment-2"
    },
    "assignment-2": {
      "id": "assignment-2",
      "type": "narrative",
      "role": "evidence",
      "label": "The desk file",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "On screen · Exhibit",
      "headline": "What's in the desk file",
      "body": "The desk file has three things in it: the FNOL, a two-page recovery report from the sheriff’s office, and a note from the adjuster that reads “something’s off here.”",
      "continueLabel": "Make the call",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/assignment-2.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 10.32,
        "captions": [
          {
            "start": 0,
            "end": 2.98,
            "text": "The desk file has three things in it: the FNOL,"
          },
          {
            "start": 2.98,
            "end": 6.34,
            "text": "a two-page recovery report from the sheriff’s office,"
          },
          {
            "start": 6.34,
            "end": 10.32,
            "text": "and a note from the adjuster that reads “something’s off here.”"
          }
        ]
      },
      "evidence": [
        {
          "id": "burned-pickup",
          "kind": "photo",
          "title": "Photo — burned pickup on gravel road, tires melted, glass gone, no other vehicles in frame",
          "caption": "Recovered March 5, eleven miles out of town. Cause of the fire is undetermined.",
          "imageUrl": "/media/evidence-burned-pickup.jpg"
        }
      ],
      "next": "decision-1"
    },
    "decision-1": {
      "id": "decision-1",
      "type": "decision",
      "label": "Decision 1 · Investigation trigger",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "Decision 1 of 3",
      "decisionLabel": "Decision 1 of 3",
      "prompt": "What moved this file out of routine adjustment and into investigation?",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/decision-1.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 4.48,
        "captions": [
          {
            "start": 0,
            "end": 4.48,
            "text": "What moved this file out of routine adjustment and into investigation?"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "label": "The adjuster's instinct that something is off",
          "isCorrect": false,
          "feedbackSceneId": "fb-1a"
        },
        {
          "id": "B",
          "label": "The insured owes more on the truck than it's worth",
          "isCorrect": false,
          "feedbackSceneId": "fb-1b"
        },
        {
          "id": "C",
          "label": "The claim exceeds $35,000, which is the referral threshold",
          "isCorrect": false,
          "feedbackSceneId": "fb-1c"
        },
        {
          "id": "D",
          "label": "The reported cause of loss — theft — is a fact genuinely in dispute, and the file has no evidence resolving it either way",
          "isCorrect": true,
          "feedbackSceneId": "fb-1d"
        }
      ]
    },
    "fb-1a": {
      "id": "fb-1a",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-1",
      "forOptionId": "A",
      "label": "D1 · A — the adjuster's instinct",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "consequence": "A hunch is not a trigger",
      "headline": "A hunch is not a trigger",
      "body": "I understand the impulse — experienced adjusters develop a nose. But “something’s off” is not a fact, and it can’t be written into a file. Nine days from now a plaintiff’s lawyer is going to ask what specifically caused this claim to be treated differently from every other theft claim, and “she had a feeling” is the answer that ends careers. Instinct is a legitimate reason to look. It is never the documented basis for anything.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/fb-1a.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 26.88,
        "captions": [
          {
            "start": 0,
            "end": 4.05,
            "text": "I understand the impulse — experienced adjusters develop a nose."
          },
          {
            "start": 4.05,
            "end": 8.67,
            "text": "But “something’s off” is not a fact, and it can’t be written into a file."
          },
          {
            "start": 8.67,
            "end": 13.29,
            "text": "Nine days from now a plaintiff’s lawyer is going to ask what specifically"
          },
          {
            "start": 13.29,
            "end": 17.91,
            "text": "caused this claim to be treated differently from every other theft claim,"
          },
          {
            "start": 17.91,
            "end": 21.45,
            "text": "and “she had a feeling” is the answer that ends careers."
          },
          {
            "start": 21.45,
            "end": 23.98,
            "text": "Instinct is a legitimate reason to look."
          },
          {
            "start": 23.98,
            "end": 26.88,
            "text": "It is never the documented basis for anything."
          }
        ]
      },
      "next": "rejoin-1a"
    },
    "fb-1b": {
      "id": "fb-1b",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-1",
      "forOptionId": "B",
      "label": "D1 · B — negative equity",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "consequence": "That's motive, and you've jumped three lessons ahead",
      "headline": "That's motive, and you've jumped three lessons ahead",
      "body": "Negative equity is worth noting. It is not what turns adjustment into investigation, and if you start there, you’ve decided the answer before you’ve gathered a fact. Plenty of people are underwater on trucks. Almost none of them burn them. Motive is a reason to investigate thoroughly — hold that thought, we come back to it in Decision 3 — but it isn’t the trigger, and building your file on it first is how confirmation bias gets baked in on day one.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/fb-1b.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 28.4,
        "captions": [
          {
            "start": 0,
            "end": 2.04,
            "text": "Negative equity is worth noting."
          },
          {
            "start": 2.04,
            "end": 6.82,
            "text": "It is not what turns adjustment into investigation, and if you start there,"
          },
          {
            "start": 6.82,
            "end": 10.39,
            "text": "you’ve decided the answer before you’ve gathered a fact."
          },
          {
            "start": 10.39,
            "end": 15.04,
            "text": "Plenty of people are underwater on trucks. Almost none of them burn them."
          },
          {
            "start": 15.04,
            "end": 17.97,
            "text": "Motive is a reason to investigate thoroughly —"
          },
          {
            "start": 17.97,
            "end": 23,
            "text": "hold that thought, we come back to it in Decision 3 — but it isn’t the trigger,"
          },
          {
            "start": 23,
            "end": 28.4,
            "text": "and building your file on it first is how confirmation bias gets baked in on day one."
          }
        ]
      },
      "next": "rejoin-1a"
    },
    "fb-1c": {
      "id": "fb-1c",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-1",
      "forOptionId": "C",
      "label": "D1 · C — dollar threshold",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "consequence": "Dollar thresholds route files; they don't define investigations",
      "headline": "Dollar thresholds route files; they don't define investigations",
      "body": "Some carriers do route by exposure, and that’s a workflow rule — it decides who gets the file, not what the file needs. Investigating a claim because it’s expensive is exactly the practice that shows up in bad-faith complaints. If a $6,000 version of this same claim came across your desk, the investigative question would be identical.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/fb-1c.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 21.8,
        "captions": [
          {
            "start": 0,
            "end": 4.22,
            "text": "Some carriers do route by exposure, and that’s a workflow rule —"
          },
          {
            "start": 4.22,
            "end": 7.78,
            "text": "it decides who gets the file, not what the file needs."
          },
          {
            "start": 7.78,
            "end": 11.4,
            "text": "Investigating a claim because it’s expensive is exactly"
          },
          {
            "start": 11.4,
            "end": 14.76,
            "text": "the practice that shows up in bad-faith complaints."
          },
          {
            "start": 14.76,
            "end": 18.78,
            "text": "If a $6,000 version of this same claim came across your desk,"
          },
          {
            "start": 18.78,
            "end": 21.8,
            "text": "the investigative question would be identical."
          }
        ]
      },
      "next": "rejoin-1a"
    },
    "fb-1d": {
      "id": "fb-1d",
      "type": "feedback",
      "verdict": "correct",
      "forDecisionId": "decision-1",
      "forOptionId": "D",
      "label": "D1 · D — cause of loss in dispute (correct)",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "consequence": "Correct",
      "headline": "Correct",
      "continueLabel": "Continue",
      "media": {
        "provider": "placeholder",
        "posterUrl": "/media/presenter-diane.jpg",
        "durationSec": 0
      },
      "next": "rejoin-1a"
    },
    "rejoin-1a": {
      "id": "rejoin-1a",
      "type": "narrative",
      "role": "continuation",
      "label": "The documented trigger",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "All paths rejoin · On screen",
      "headline": "Facts, coverage, damages, or timing genuinely in dispute",
      "body": "That’s the line. Routine adjustment becomes investigation when facts, coverage, damages, or timing are genuinely in dispute — and here the central fact, was this vehicle stolen, is unresolved and unresolvable from what’s in the folder. That’s a documentable trigger. Write it that way in the activity log on day one: “Referred for investigation; cause of loss unestablished, no independent evidence of theft in file.” Now the whole investigation has a stated reason that a stranger can read.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/rejoin-1a.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 30.44,
        "captions": [
          {
            "start": 0,
            "end": 4.34,
            "text": "That’s the line. Routine adjustment becomes investigation when facts,"
          },
          {
            "start": 4.34,
            "end": 7.8,
            "text": "coverage, damages, or timing are genuinely in dispute —"
          },
          {
            "start": 7.8,
            "end": 11.01,
            "text": "and here the central fact, was this vehicle stolen,"
          },
          {
            "start": 11.01,
            "end": 14.59,
            "text": "is unresolved and unresolvable from what’s in the folder."
          },
          {
            "start": 14.59,
            "end": 16.48,
            "text": "That’s a documentable trigger."
          },
          {
            "start": 16.48,
            "end": 21.39,
            "text": "Write it that way in the activity log on day one: “Referred for investigation;"
          },
          {
            "start": 21.39,
            "end": 25.86,
            "text": "cause of loss unestablished, no independent evidence of theft in file.”"
          },
          {
            "start": 25.86,
            "end": 30.44,
            "text": "Now the whole investigation has a stated reason that a stranger can read."
          }
        ]
      },
      "summaryCard": {
        "kicker": "On screen",
        "title": "What turns adjustment into investigation",
        "items": [
          {
            "icon": "facts",
            "label": "Facts"
          },
          {
            "icon": "coverage",
            "label": "Coverage"
          },
          {
            "icon": "damages",
            "label": "Damages"
          },
          {
            "icon": "timing",
            "label": "Timing"
          }
        ],
        "takeaway": "Facts, coverage, damages, or timing genuinely in dispute."
      },
      "next": "rejoin-1b"
    },
    "rejoin-1b": {
      "id": "rejoin-1b",
      "type": "narrative",
      "role": "continuation",
      "label": "Know your box",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "Adjusting → Investigation → SIU. Know which box you're in.",
      "body": "And know your box. You’re the investigator. You develop facts. You are not the adjuster deciding payment, and you are not SIU running a fraud case. Escalate too fast and you’ve made an accusation you can’t support. Escalate too slow and you’ve sat on a file that needed a specialist.",
      "continueLabel": "Make the call",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/rejoin-1b.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 17.68,
        "captions": [
          {
            "start": 0,
            "end": 3.91,
            "text": "And know your box. You’re the investigator. You develop facts."
          },
          {
            "start": 3.91,
            "end": 9.21,
            "text": "You are not the adjuster deciding payment, and you are not SIU running a fraud case."
          },
          {
            "start": 9.21,
            "end": 13.38,
            "text": "Escalate too fast and you’ve made an accusation you can’t support."
          },
          {
            "start": 13.38,
            "end": 17.68,
            "text": "Escalate too slow and you’ve sat on a file that needed a specialist."
          }
        ]
      },
      "chain": {
        "kicker": "On screen",
        "stages": [
          {
            "label": "Adjusting",
            "detail": "Deciding payment"
          },
          {
            "label": "Investigation",
            "detail": "Developing facts",
            "current": true
          },
          {
            "label": "SIU",
            "detail": "Running a fraud case"
          }
        ],
        "takeaway": "Know which box you're in."
      },
      "next": "decision-2"
    },
    "decision-2": {
      "id": "decision-2",
      "type": "decision",
      "label": "Decision 2 · Burden of proof",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "Decision 2 of 3",
      "decisionLabel": "Decision 2 of 3",
      "prompt": "You start heading toward a denial under the intentional-act exclusion. Who has the burden, and what does that change?",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/decision-2.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 7.4,
        "captions": [
          {
            "start": 0,
            "end": 4.47,
            "text": "You start heading toward a denial under the intentional-act exclusion."
          },
          {
            "start": 4.47,
            "end": 7.4,
            "text": "Who has the burden, and what does that change?"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "label": "The insured has the burden to prove the truck was stolen, so you can simply wait for him to fail",
          "isCorrect": false,
          "feedbackSceneId": "fb-2a"
        },
        {
          "id": "B",
          "label": "The carrier has the burden to prove the exclusion applies, so your file has to carry it",
          "isCorrect": true,
          "feedbackSceneId": "fb-2b"
        },
        {
          "id": "C",
          "label": "Nobody has a burden until litigation is filed",
          "isCorrect": false,
          "feedbackSceneId": "fb-2c"
        },
        {
          "id": "D",
          "label": "The burden is on whoever has the better evidence",
          "isCorrect": false,
          "feedbackSceneId": "fb-2d"
        }
      ]
    },
    "fb-2a": {
      "id": "fb-2a",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-2",
      "forOptionId": "A",
      "label": "D2 · A — wait for him to fail",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "consequence": "You had it right — then the issue changed under you",
      "headline": "You had it right — then the issue changed under you",
      "body": "That’s half true and it’s the half that gets people hurt. Yes, the insured generally bears the burden of showing a covered peril caused the loss. But the second your theory becomes “yes, a fire occurred, but an exclusion carves it out,” the weight moves to the carrier. That’s you. Sitting back waiting for him to fail while you’re actually building an exclusion case is how a technically-defensible investigation turns into an indefensible denial. Re-run the burden question every time the live issue changes — not once at intake.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/fb-2a.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 33.04,
        "captions": [
          {
            "start": 0,
            "end": 3.59,
            "text": "That’s half true and it’s the half that gets people hurt."
          },
          {
            "start": 3.59,
            "end": 9.07,
            "text": "Yes, the insured generally bears the burden of showing a covered peril caused the loss."
          },
          {
            "start": 9.07,
            "end": 12.66,
            "text": "But the second your theory becomes “yes, a fire occurred,"
          },
          {
            "start": 12.66,
            "end": 17.51,
            "text": "but an exclusion carves it out,” the weight moves to the carrier. That’s you."
          },
          {
            "start": 17.51,
            "end": 22.54,
            "text": "Sitting back waiting for him to fail while you’re actually building an exclusion"
          },
          {
            "start": 22.54,
            "end": 27.89,
            "text": "case is how a technically-defensible investigation turns into an indefensible denial."
          },
          {
            "start": 27.89,
            "end": 33.04,
            "text": "Re-run the burden question every time the live issue changes — not once at intake."
          }
        ]
      },
      "next": "rejoin-2"
    },
    "fb-2b": {
      "id": "fb-2b",
      "type": "feedback",
      "verdict": "correct",
      "forDecisionId": "decision-2",
      "forOptionId": "B",
      "label": "D2 · B — the carrier carries the exclusion (correct)",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "consequence": "Correct",
      "headline": "Correct",
      "continueLabel": "Continue",
      "media": {
        "provider": "placeholder",
        "posterUrl": "/media/presenter-diane.jpg",
        "durationSec": 0
      },
      "next": "rejoin-2"
    },
    "fb-2c": {
      "id": "fb-2c",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-2",
      "forOptionId": "C",
      "label": "D2 · C — no burden until litigation",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "consequence": "Wrong by a mile, and dangerous",
      "headline": "Wrong by a mile, and dangerous",
      "body": "The burden doesn’t switch on when a lawsuit is filed — it governs what your file has to contain right now, before anyone sues. Investigate as though there’s no burden until litigation and you’ll build a file that collapses the first time it’s read by anyone outside your office. And a denial issued from a file like that is the single most reliable way to generate the lawsuit you were assuming wouldn’t come.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/fb-2c.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 25.76,
        "captions": [
          {
            "start": 0,
            "end": 3.44,
            "text": "The burden doesn’t switch on when a lawsuit is filed —"
          },
          {
            "start": 3.44,
            "end": 7.97,
            "text": "it governs what your file has to contain right now, before anyone sues."
          },
          {
            "start": 7.97,
            "end": 12.62,
            "text": "Investigate as though there’s no burden until litigation and you’ll build"
          },
          {
            "start": 12.62,
            "end": 17.53,
            "text": "a file that collapses the first time it’s read by anyone outside your office."
          },
          {
            "start": 17.53,
            "end": 21.36,
            "text": "And a denial issued from a file like that is the single most"
          },
          {
            "start": 21.36,
            "end": 25.76,
            "text": "reliable way to generate the lawsuit you were assuming wouldn’t come."
          }
        ]
      },
      "next": "rejoin-2"
    },
    "fb-2d": {
      "id": "fb-2d",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-2",
      "forOptionId": "D",
      "label": "D2 · D — whoever has better evidence",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "consequence": "That's not how burdens work",
      "headline": "That's not how burdens work",
      "body": "Burden of proof is a legal allocation, not a scoring system. It doesn’t float toward whoever showed up with more paper. It’s assigned by the issue in dispute, and it determines who loses when the evidence is genuinely in equipoise. If the evidence is a coin flip on an exclusion, the carrier loses. Knowing that ahead of time is exactly why you name the burden before you conclude.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/fb-2d.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 23.8,
        "captions": [
          {
            "start": 0,
            "end": 3.8,
            "text": "Burden of proof is a legal allocation, not a scoring system."
          },
          {
            "start": 3.8,
            "end": 7.47,
            "text": "It doesn’t float toward whoever showed up with more paper."
          },
          {
            "start": 7.47,
            "end": 9.88,
            "text": "It’s assigned by the issue in dispute,"
          },
          {
            "start": 9.88,
            "end": 14.44,
            "text": "and it determines who loses when the evidence is genuinely in equipoise."
          },
          {
            "start": 14.44,
            "end": 18.62,
            "text": "If the evidence is a coin flip on an exclusion, the carrier loses."
          },
          {
            "start": 18.62,
            "end": 23.8,
            "text": "Knowing that ahead of time is exactly why you name the burden before you conclude."
          }
        ]
      },
      "next": "rejoin-2"
    },
    "rejoin-2": {
      "id": "rejoin-2",
      "type": "narrative",
      "role": "continuation",
      "label": "Issue · Burden · Standard · Evidence",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "All paths rejoin · On screen",
      "headline": "Insureds carry coverage. Insurers carry exclusions.",
      "body": "Run the chain out loud on this file. Issue: does the intentional-act exclusion apply? Burden: the carrier — me. Standard: preponderance, unless my state requires clear and convincing for fraud-based denials, and I confirm that rather than assume it. Evidence: both keys accounted for; forced-entry evidence; origin-and-cause findings on the burn; consistency of his account over time; the gap between last-seen and discovery. Now grade honestly — have, need, or unavailable. Right now you have almost nothing. So the correct answer today isn’t deny. It’s keep investigating. That’s not weakness. That’s the file telling you what it is.",
      "continueLabel": "Make the call",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/rejoin-2.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 38.8,
        "captions": [
          {
            "start": 0,
            "end": 2.23,
            "text": "Run the chain out loud on this file."
          },
          {
            "start": 2.23,
            "end": 6.81,
            "text": "Issue: does the intentional-act exclusion apply? Burden: the carrier — me."
          },
          {
            "start": 6.81,
            "end": 12.69,
            "text": "Standard: preponderance, unless my state requires clear and convincing for fraud-based denials,"
          },
          {
            "start": 12.69,
            "end": 15.23,
            "text": "and I confirm that rather than assume it."
          },
          {
            "start": 15.23,
            "end": 21.17,
            "text": "Evidence: both keys accounted for; forced-entry evidence; origin-and-cause findings on the burn;"
          },
          {
            "start": 21.17,
            "end": 26,
            "text": "consistency of his account over time; the gap between last-seen and discovery."
          },
          {
            "start": 26,
            "end": 31.14,
            "text": "Now grade honestly — have, need, or unavailable. Right now you have almost nothing."
          },
          {
            "start": 31.14,
            "end": 35.1,
            "text": "So the correct answer today isn’t deny. It’s keep investigating."
          },
          {
            "start": 35.1,
            "end": 38.8,
            "text": "That’s not weakness. That’s the file telling you what it is."
          }
        ]
      },
      "summaryCard": {
        "kicker": "On screen",
        "title": "The four steps",
        "numbered": true,
        "items": [
          {
            "icon": "issue",
            "label": "Issue"
          },
          {
            "icon": "burden",
            "label": "Burden"
          },
          {
            "icon": "standard",
            "label": "Standard"
          },
          {
            "icon": "evidence",
            "label": "Evidence"
          }
        ],
        "takeaway": "Insureds carry coverage. Insurers carry exclusions."
      },
      "next": "decision-3"
    },
    "decision-3": {
      "id": "decision-3",
      "type": "decision",
      "label": "Decision 3 · Motive",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "Decision 3 of 3",
      "decisionLabel": "Decision 3 of 3",
      "prompt": "You confirm Delaney was two payments behind and had a repo notice on file. What does that give you?",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/decision-3.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 6.28,
        "captions": [
          {
            "start": 0,
            "end": 4.74,
            "text": "You confirm Delaney was two payments behind and had a repo notice on file."
          },
          {
            "start": 4.74,
            "end": 6.28,
            "text": "What does that give you?"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "label": "Corroboration that the fire was intentionally set",
          "isCorrect": false,
          "feedbackSceneId": "fb-3a"
        },
        {
          "id": "B",
          "label": "Motive — a reason to investigate thoroughly, but not proof of anything",
          "isCorrect": true,
          "feedbackSceneId": "fb-3b"
        },
        {
          "id": "C",
          "label": "Enough, combined with the burned vehicle, to meet preponderance",
          "isCorrect": false,
          "feedbackSceneId": "fb-3c"
        },
        {
          "id": "D",
          "label": "A basis to tell him in the recorded statement that you know what he did",
          "isCorrect": false,
          "feedbackSceneId": "fb-3d"
        }
      ]
    },
    "fb-3a": {
      "id": "fb-3a",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-3",
      "forOptionId": "A",
      "label": "D3 · A — corroboration of arson",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "consequence": "A repo notice can't tell you how a fire started",
      "headline": "A repo notice can't tell you how a fire started",
      "body": "Nothing in his loan file speaks to ignition. Only origin-and-cause evidence does. If you write those two facts into the same paragraph as though one supports the other, you’ve built the exact sentence opposing counsel will read to a jury in a slow voice.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/fb-3a.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 16.04,
        "captions": [
          {
            "start": 0,
            "end": 5.16,
            "text": "Nothing in his loan file speaks to ignition. Only origin-and-cause evidence does."
          },
          {
            "start": 5.16,
            "end": 10.63,
            "text": "If you write those two facts into the same paragraph as though one supports the other,"
          },
          {
            "start": 10.63,
            "end": 16.04,
            "text": "you’ve built the exact sentence opposing counsel will read to a jury in a slow voice."
          }
        ]
      },
      "next": "rejoin-3"
    },
    "fb-3b": {
      "id": "fb-3b",
      "type": "feedback",
      "verdict": "correct",
      "forDecisionId": "decision-3",
      "forOptionId": "B",
      "label": "D3 · B — motive, not proof (correct)",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "consequence": "Correct",
      "headline": "Correct",
      "continueLabel": "Continue",
      "media": {
        "provider": "placeholder",
        "posterUrl": "/media/presenter-diane.jpg",
        "durationSec": 0
      },
      "next": "rejoin-3"
    },
    "fb-3c": {
      "id": "fb-3c",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-3",
      "forOptionId": "C",
      "label": "D3 · C — meets preponderance",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "consequence": "Motive plus a loss is not preponderance",
      "headline": "Motive plus a loss is not preponderance",
      "body": "This is the most common wrong answer and the most expensive one. You’re the one carrying the burden here — see Decision 2 — so “more likely than not” has to be built from corroborated facts a neutral reader would accept. Financial pressure and a burned truck describe thousands of honest total losses. Add the keys, the forced entry, the accelerant finding, the timeline conflict, and now you may have a file. One indicator is not a case.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/fb-3c.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 27.44,
        "captions": [
          {
            "start": 0,
            "end": 4.06,
            "text": "This is the most common wrong answer and the most expensive one."
          },
          {
            "start": 4.06,
            "end": 7.74,
            "text": "You’re the one carrying the burden here — see Decision 2 —"
          },
          {
            "start": 7.74,
            "end": 13.82,
            "text": "so “more likely than not” has to be built from corroborated facts a neutral reader would accept."
          },
          {
            "start": 13.82,
            "end": 18.89,
            "text": "Financial pressure and a burned truck describe thousands of honest total losses."
          },
          {
            "start": 18.89,
            "end": 22.38,
            "text": "Add the keys, the forced entry, the accelerant finding,"
          },
          {
            "start": 22.38,
            "end": 27.44,
            "text": "the timeline conflict, and now you may have a file. One indicator is not a case."
          }
        ]
      },
      "next": "rejoin-3"
    },
    "fb-3d": {
      "id": "fb-3d",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-3",
      "forOptionId": "D",
      "label": "D3 · D — tell him you know",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "consequence": "That's coercion, and it ends the investigation",
      "headline": "That's coercion, and it ends the investigation",
      "body": "You don’t know what he did. Saying you do is a misrepresentation, it’s pressure applied to a statement, and it will be the only thing anyone remembers about this claim. It also destroys the statement’s value — a jury discounts everything said after that line. Take statements open-question-first and let the account be his.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/fb-3d.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 20.24,
        "captions": [
          {
            "start": 0,
            "end": 1.71,
            "text": "You don’t know what he did."
          },
          {
            "start": 1.71,
            "end": 6.47,
            "text": "Saying you do is a misrepresentation, it’s pressure applied to a statement,"
          },
          {
            "start": 6.47,
            "end": 10.53,
            "text": "and it will be the only thing anyone remembers about this claim."
          },
          {
            "start": 10.53,
            "end": 16.24,
            "text": "It also destroys the statement’s value — a jury discounts everything said after that line."
          },
          {
            "start": 16.24,
            "end": 20.24,
            "text": "Take statements open-question-first and let the account be his."
          }
        ]
      },
      "next": "rejoin-3"
    },
    "rejoin-3": {
      "id": "rejoin-3",
      "type": "narrative",
      "role": "continuation",
      "label": "Motive vs. evidence",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "All paths rejoin · On screen",
      "headline": "“Motive triggers investigation. Only evidence supports a conclusion.”",
      "body": "Motive is a reason to look harder. It’s never, by itself, the answer. It goes in your analysis section, labeled as an indicator, tied to its source — not blended into the findings as though it were an observation.",
      "continueLabel": "See the resolution",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/rejoin-3.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 13.12,
        "captions": [
          {
            "start": 0,
            "end": 4.29,
            "text": "Motive is a reason to look harder. It’s never, by itself, the answer."
          },
          {
            "start": 4.29,
            "end": 9.2,
            "text": "It goes in your analysis section, labeled as an indicator, tied to its source —"
          },
          {
            "start": 9.2,
            "end": 13.12,
            "text": "not blended into the findings as though it were an observation."
          }
        ]
      },
      "next": "resolution-1"
    },
    "resolution-1": {
      "id": "resolution-1",
      "type": "narrative",
      "role": "resolution",
      "label": "Where the file stands",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "The resolution · On screen",
      "headline": "Evidence inventory — HAVE / NEED / UNAVAILABLE",
      "body": "Here’s where this file actually stands at day fourteen. Both keys: need — he says one is at his mother’s house, unverified. Forced entry: have — sheriff’s recovery report notes no window damage and no punched ignition. Accelerant: need — origin-and-cause inspection scheduled for day nineteen. Timeline of last use: have but conflicting — he told the FNOL rep he left the store at 8:15 and told you 9:30. Financial detail: have, obtained through the proper channel with permissible purpose documented.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/resolution-1.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 31.96,
        "captions": [
          {
            "start": 0,
            "end": 3.55,
            "text": "Here’s where this file actually stands at day fourteen."
          },
          {
            "start": 3.55,
            "end": 7.88,
            "text": "Both keys: need — he says one is at his mother’s house, unverified."
          },
          {
            "start": 7.88,
            "end": 13.95,
            "text": "Forced entry: have — sheriff’s recovery report notes no window damage and no punched ignition."
          },
          {
            "start": 13.95,
            "end": 18.73,
            "text": "Accelerant: need — origin-and-cause inspection scheduled for day nineteen."
          },
          {
            "start": 18.73,
            "end": 21.57,
            "text": "Timeline of last use: have but conflicting —"
          },
          {
            "start": 21.57,
            "end": 25.77,
            "text": "he told the FNOL rep he left the store at 8:15 and told you 9:30."
          },
          {
            "start": 25.77,
            "end": 31.96,
            "text": "Financial detail: have, obtained through the proper channel with permissible purpose documented."
          }
        ]
      },
      "inventory": {
        "kicker": "The resolution · On screen",
        "title": "Evidence inventory at day fourteen",
        "entries": [
          {
            "label": "Both keys",
            "status": "need",
            "note": "He says one is at his mother's house, unverified."
          },
          {
            "label": "Forced entry",
            "status": "have",
            "note": "Sheriff's recovery report notes no window damage and no punched ignition."
          },
          {
            "label": "Accelerant",
            "status": "need",
            "note": "Origin-and-cause inspection scheduled for day nineteen."
          },
          {
            "label": "Timeline of last use",
            "status": "have",
            "conflicted": true,
            "note": "He told the FNOL rep he left the store at 8:15 and told you 9:30."
          },
          {
            "label": "Financial detail",
            "status": "have",
            "note": "Obtained through the proper channel with permissible purpose documented."
          }
        ]
      },
      "comparison": {
        "kicker": "Evidence exhibit",
        "conflict": "Timeline of last use — have, but conflicting.",
        "a": {
          "label": "Told the FNOL rep",
          "value": "Left the store at 8:15"
        },
        "b": {
          "label": "Told you",
          "value": "Left the store at 9:30"
        },
        "note": "Same fact, two accounts. Neither is evidence until one of them is corroborated."
      },
      "next": "resolution-2"
    },
    "resolution-2": {
      "id": "resolution-2",
      "type": "narrative",
      "role": "resolution",
      "label": "Keep investigating",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "Today's honest answer — KEEP INVESTIGATING",
      "body": "That’s the resolution for now, and writing it down as “keep investigating” is a professional act, not a failure. The origin-and-cause report is the piece that speaks directly to the disputed fact. Everything else is context.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/resolution-2.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 13.92,
        "captions": [
          {
            "start": 0,
            "end": 1.89,
            "text": "That’s the resolution for now,"
          },
          {
            "start": 1.89,
            "end": 6.99,
            "text": "and writing it down as “keep investigating” is a professional act, not a failure."
          },
          {
            "start": 6.99,
            "end": 12.22,
            "text": "The origin-and-cause report is the piece that speaks directly to the disputed fact."
          },
          {
            "start": 12.22,
            "end": 13.92,
            "text": "Everything else is context."
          }
        ]
      },
      "next": "resolution-3"
    },
    "resolution-3": {
      "id": "resolution-3",
      "type": "narrative",
      "role": "resolution",
      "label": "Same method. Different answer.",
      "layout": "avatar",
      "presenter": {
        "name": "Diane Marchetti",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "Same method. Different answer.",
      "body": "And flip it. Suppose the O&C engineer finds an electrical fault at the harness, consistent with an accidental fire, and the second key turns up where he said it was. This identical investigation now defensibly pays a claim on an underwater truck for a man two payments behind — promptly, and with a file that explains exactly why. That’s the whole point. The answer changes. The method doesn’t.",
      "continueLabel": "Continue to the next lessons",
      "media": {
        "provider": "file",
        "videoUrl": "/media/claims-01-av1-native/resolution-3.mp4",
        "posterUrl": "/media/presenter-diane.jpg",
        "hasAudio": true,
        "loop": false,
        "durationSec": 24.56,
        "captions": [
          {
            "start": 0,
            "end": 4.99,
            "text": "And flip it. Suppose the O&C engineer finds an electrical fault at the harness,"
          },
          {
            "start": 4.99,
            "end": 10.36,
            "text": "consistent with an accidental fire, and the second key turns up where he said it was."
          },
          {
            "start": 10.36,
            "end": 13.9,
            "text": "This identical investigation now defensibly pays a claim"
          },
          {
            "start": 13.9,
            "end": 17.31,
            "text": "on an underwater truck for a man two payments behind —"
          },
          {
            "start": 17.31,
            "end": 22.11,
            "text": "promptly, and with a file that explains exactly why. That’s the whole point."
          },
          {
            "start": 22.11,
            "end": 24.56,
            "text": "The answer changes. The method doesn’t."
          }
        ]
      },
      "next": null
    }
  }
} as Lesson;
