import type { Lesson } from "@/lib/branching/types";

/**
 * DELIVERABLE pilot lesson — siu-01-av1-native (native cut), STANDALONE.
 * ============================================================================
 * Every media path is a literal, baked from the resolved lesson — no dependency
 * on any other lesson module — so this exports cleanly to a self-contained
 * Thinkific HTML5 package. Regenerate with scripts/bake-deliverable-lessons.ts.
 */
export const siu01Av1Native: Lesson = {
  "id": "siu-01-av1-native",
  "slug": "siu-01-av1-native",
  "courseTitle": "SIU Foundations & the Regulatory Framework",
  "title": "Case Application — You Have the File",
  "subtitle": "Application Video 1 of 2 — The Referral That Arrives With a Verdict Attached",
  "summary": "Work a live arson referral that arrives with the adjuster's conclusion already written on it. Three decisions, each with its own feedback branch and a retry until you get it right, then the correct reasoning and the resolution.",
  "estimatedMinutes": 10,
  "completion": {
    "takeaway": "Reporting is a regulatory act. Denying is a claims act. They are not the same decision.",
    "headlineAllCorrect": "You developed facts and routed them. That's the job.",
    "headlinePartial": "The file resolves — carry the method forward."
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
      "label": "Decision 1 · Your actual job",
      "scenes": [
        "decision-1"
      ]
    },
    {
      "id": "develops-facts",
      "label": "An SIU develops facts",
      "scenes": [
        "rejoin-1"
      ]
    },
    {
      "id": "decision-2",
      "label": "Decision 2 · The elements",
      "scenes": [
        "decision-2"
      ]
    },
    {
      "id": "elements",
      "label": "Statement vs. physical evidence",
      "scenes": [
        "rejoin-2"
      ]
    },
    {
      "id": "decision-3",
      "label": "Decision 3 · The mandatory report",
      "scenes": [
        "decision-3"
      ]
    },
    {
      "id": "reporting",
      "label": "Reporting is not denying",
      "scenes": [
        "rejoin-3"
      ]
    },
    {
      "id": "key-record",
      "label": "The third key",
      "scenes": [
        "resolution-1"
      ]
    },
    {
      "id": "the-file",
      "label": "The file, tabbed",
      "scenes": [
        "resolution-2"
      ]
    },
    {
      "id": "the-test",
      "label": "The test",
      "scenes": [
        "resolution-3"
      ]
    },
    {
      "id": "method",
      "label": "Same method. Different answer.",
      "scenes": [
        "resolution-4"
      ]
    }
  ],
  "meta": {
    "module": "Application Video 1 of 2",
    "lessonNumber": 1,
    "author": "Roger M. Naut",
    "caseId": "AU-8830471"
  },
  "scenes": {
    "intro": {
      "id": "intro",
      "type": "narrative",
      "role": "intro",
      "label": "You have the file",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "Case Application",
      "headline": "You Have the File",
      "subhead": "Covers Lessons 1–3. Work the file and make each call. Choose an answer and you'll see exactly why that choice is right or wrong, then try again until it's right.",
      "body": "You’ve read the first three lessons. Now let’s find out if it stuck. I’m handing you a live file and you’re making the calls. Pause when I ask.",
      "continueLabel": "See the assignment",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/intro.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 8.8,
        "captions": [
          {
            "start": 0,
            "end": 2.333,
            "text": "You’ve read the first three lessons."
          },
          {
            "start": 2.333,
            "end": 8.8,
            "text": "Now let’s find out if it stuck. I’m handing you a live file and you’re making the calls. Pause when I ask."
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
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "The Assignment",
      "subhead": "Claim AU-8830471 · Marcus Delacroix · 2019 Ram 1500",
      "body": "Claim AU-8830471. Insured: Marcus Delacroix, 34, warehouse supervisor, Toledo, Ohio. He reports his 2019 Ram 1500 stolen overnight from his apartment complex lot — last seen 11 p.m. March 3, discovered gone 6:40 a.m. March 4. Police report filed March 4 at 8:15 a.m., case number on file. The numbers: loan balance $31,400. ACV runs about $26,800. He is upside down roughly $4,600 and two payments behind. Comprehensive coverage was added to the policy January 14 — seven weeks before the loss.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/assignment-1.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 38.8,
        "captions": [
          {
            "start": 0,
            "end": 6.825,
            "text": "Claim AU-8830471. Insured: Marcus Delacroix, 34, warehouse supervisor, Toledo, Ohio."
          },
          {
            "start": 6.825,
            "end": 12.94,
            "text": "He reports his 2019 Ram 1500 stolen overnight from his apartment complex lot —"
          },
          {
            "start": 12.94,
            "end": 17.722,
            "text": "last seen 11 p.m. March 3, discovered gone 6:40 a.m. March 4."
          },
          {
            "start": 17.722,
            "end": 22.582,
            "text": "Police report filed March 4 at 8:15 a.m., case number on file."
          },
          {
            "start": 22.582,
            "end": 27.129,
            "text": "The numbers: loan balance $31,400. ACV runs about $26,800."
          },
          {
            "start": 27.129,
            "end": 31.597,
            "text": "He is upside down roughly $4,600 and two payments behind."
          },
          {
            "start": 31.597,
            "end": 38.8,
            "text": "Comprehensive coverage was added to the policy January 14 — seven weeks before the loss."
          }
        ]
      },
      "next": "assignment-2"
    },
    "assignment-2": {
      "id": "assignment-2",
      "type": "narrative",
      "role": "evidence",
      "label": "The referral memo",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "On screen · Exhibit",
      "headline": "Referral memo, adjuster’s note highlighted in red",
      "body": "That’s how it landed on your desk. The referring adjuster, eight months in the job, has already written the ending. March 9, the truck turns up burned to the frame in a drainage cut off a county road eleven miles from the apartment. In his recorded statement Marcus says both keys have been in his kitchen drawer the whole time. Three problems in one file. Let’s work them.",
      "continueLabel": "Make the call",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/assignment-2.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 24.04,
        "captions": [
          {
            "start": 0,
            "end": 7.543,
            "text": "That’s how it landed on your desk. The referring adjuster, eight months in the job, has already written the ending."
          },
          {
            "start": 7.543,
            "end": 14.909,
            "text": "March 9, the truck turns up burned to the frame in a drainage cut off a county road eleven miles from the apartment."
          },
          {
            "start": 14.909,
            "end": 20.942,
            "text": "In his recorded statement Marcus says both keys have been in his kitchen drawer the whole time."
          },
          {
            "start": 20.942,
            "end": 24.04,
            "text": "Three problems in one file. Let’s work them."
          }
        ]
      },
      "evidence": [
        {
          "id": "referral-memo",
          "kind": "document",
          "title": "Referral memo, adjuster’s note highlighted in red",
          "caption": "“Insured torched his own truck for the payoff. Recommend denial. Claim is on hold pending SIU.”"
        }
      ],
      "next": "decision-1"
    },
    "decision-1": {
      "id": "decision-1",
      "type": "decision",
      "label": "Decision 1 · Your actual job",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "Decision 1 of 3",
      "decisionLabel": "Decision 1 of 3",
      "prompt": "On this referral, what is your actual job?",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/decision-1.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 3.08,
        "captions": [
          {
            "start": 0,
            "end": 3.08,
            "text": "On this referral, what is your actual job?"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "label": "Determine whether Marcus Delacroix burned his own truck",
          "isCorrect": false,
          "feedbackSceneId": "fb-1a"
        },
        {
          "id": "B",
          "label": "Develop and document facts, evaluate them against known indicators, and route them to the people with authority to decide",
          "isCorrect": true,
          "feedbackSceneId": "fb-1b"
        },
        {
          "id": "C",
          "label": "Find a defensible basis to deny, because a carrier shouldn’t pay off someone’s underwater loan",
          "isCorrect": false,
          "feedbackSceneId": "fb-1c"
        },
        {
          "id": "D",
          "label": "Confirm to the adjuster that the claim stays on hold until you close the investigation",
          "isCorrect": false,
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
      "label": "D1 · A — decide whether he burned it",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "consequence": "You just made yourself the jury",
      "headline": "You just made yourself the jury",
      "body": "That is not your determination to make, and reaching for it is the single misconception that ends SIU careers. You are a private employee of a private company. You have no badge, no arrest power, no subpoena, and no authority to compel Marcus to say one word to you. Whether he burned that truck is a question for a prosecutor to charge and a court to decide. The moment you frame your job as “catching the liar,” every step after that bends toward the conclusion you already picked — and a plaintiff’s attorney will read your file out loud, in order, to show exactly when you stopped investigating and started building a case.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/fb-1a.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 39.76,
        "captions": [
          {
            "start": 0,
            "end": 2.711,
            "text": "That is not your determination to make,"
          },
          {
            "start": 2.711,
            "end": 7.146,
            "text": "and reaching for it is the single misconception that ends SIU careers."
          },
          {
            "start": 7.146,
            "end": 10.187,
            "text": "You are a private employee of a private company."
          },
          {
            "start": 10.187,
            "end": 13.228,
            "text": "You have no badge, no arrest power, no subpoena,"
          },
          {
            "start": 13.228,
            "end": 16.839,
            "text": "and no authority to compel Marcus to say one word to you."
          },
          {
            "start": 16.839,
            "end": 22.667,
            "text": "Whether he burned that truck is a question for a prosecutor to charge and a court to decide."
          },
          {
            "start": 22.667,
            "end": 30.523,
            "text": "The moment you frame your job as “catching the liar,” every step after that bends toward the conclusion you already picked —"
          },
          {
            "start": 30.523,
            "end": 34.704,
            "text": "and a plaintiff’s attorney will read your file out loud, in order,"
          },
          {
            "start": 34.704,
            "end": 39.76,
            "text": "to show exactly when you stopped investigating and started building a case."
          }
        ]
      },
      "next": "rejoin-1"
    },
    "fb-1b": {
      "id": "fb-1b",
      "type": "feedback",
      "verdict": "correct",
      "forDecisionId": "decision-1",
      "forOptionId": "B",
      "label": "D1 · B — develop and route facts (correct)",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "consequence": "Correct",
      "headline": "Correct",
      "continueLabel": "Continue",
      "media": {
        "provider": "placeholder",
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 0
      },
      "next": "rejoin-1"
    },
    "fb-1c": {
      "id": "fb-1c",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-1",
      "forOptionId": "C",
      "label": "D1 · C — find a basis to deny",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "consequence": "Outcome first, facts second — that’s backwards",
      "headline": "Outcome first, facts second — that’s backwards",
      "body": "Being underwater on a loan is a motive indicator. It is not a coverage defense and it is not evidence of anything. Half the trucks on the road are worth less than what’s owed on them. If “he’d have profited” were enough to deny, you’d deny most total losses in the country. And notice the structural problem you just created for yourself: you’re now looking for one kind of fact and not the other. That’s the definition of a one-sided investigation, and it’s how a $26,800 claim becomes a bad-faith verdict with a comma you didn’t plan for.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/fb-1c.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 34.92,
        "captions": [
          {
            "start": 0,
            "end": 3.402,
            "text": "Being underwater on a loan is a motive indicator."
          },
          {
            "start": 3.402,
            "end": 7.531,
            "text": "It is not a coverage defense and it is not evidence of anything."
          },
          {
            "start": 7.531,
            "end": 11.919,
            "text": "Half the trucks on the road are worth less than what’s owed on them."
          },
          {
            "start": 11.919,
            "end": 17.662,
            "text": "If “he’d have profited” were enough to deny, you’d deny most total losses in the country."
          },
          {
            "start": 17.662,
            "end": 21.791,
            "text": "And notice the structural problem you just created for yourself:"
          },
          {
            "start": 21.791,
            "end": 25.534,
            "text": "you’re now looking for one kind of fact and not the other."
          },
          {
            "start": 25.534,
            "end": 28.825,
            "text": "That’s the definition of a one-sided investigation,"
          },
          {
            "start": 28.825,
            "end": 34.92,
            "text": "and it’s how a $26,800 claim becomes a bad-faith verdict with a comma you didn’t plan for."
          }
        ]
      },
      "next": "rejoin-1"
    },
    "fb-1d": {
      "id": "fb-1d",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-1",
      "forOptionId": "D",
      "label": "D1 · D — claim stays on hold",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "consequence": "Wrong — and this one has a regulator attached",
      "headline": "Wrong — and this one has a regulator attached",
      "body": "An SIU referral does not pause the claim clock. The adjuster’s note says “on hold pending SIU,” and that sentence is a compliance problem the day it’s written. Your state’s unfair-claims-practices rules impose handling timeframes that keep running whether or not you have an open file. There may be a lawful basis to extend — documented, articulated, usually with counsel’s input — but “SIU is looking at it” is not that basis by itself. The same Department of Insurance that wants your fraud report enforces those handling rules against you.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/fb-1d.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 33.12,
        "captions": [
          {
            "start": 0,
            "end": 3.118,
            "text": "An SIU referral does not pause the claim clock."
          },
          {
            "start": 3.118,
            "end": 9.914,
            "text": "The adjuster’s note says “on hold pending SIU,” and that sentence is a compliance problem the day it’s written."
          },
          {
            "start": 9.914,
            "end": 17.568,
            "text": "Your state’s unfair-claims-practices rules impose handling timeframes that keep running whether or not you have an open file."
          },
          {
            "start": 17.568,
            "end": 23.385,
            "text": "There may be a lawful basis to extend — documented, articulated, usually with counsel’s input —"
          },
          {
            "start": 23.385,
            "end": 26.752,
            "text": "but “SIU is looking at it” is not that basis by itself."
          },
          {
            "start": 26.752,
            "end": 33.12,
            "text": "The same Department of Insurance that wants your fraud report enforces those handling rules against you."
          }
        ]
      },
      "next": "rejoin-1"
    },
    "rejoin-1": {
      "id": "rejoin-1",
      "type": "narrative",
      "role": "continuation",
      "label": "An SIU develops facts",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "All paths rejoin · On screen",
      "headline": "“An SIU does not decide whether a claim is fraudulent. An SIU develops facts.”",
      "body": "That’s the sentence to keep in front of you on every file. Prosecutors decide crimes. Courts decide guilt. Fraud bureaus decide whether to open a case. Claims decides whether to pay. You develop and hand off facts — accurately, neutrally, on the record. And it tells you exactly what to do in the next hour. Call the adjuster. Thank her for flagging it, because the marginal referrals are where real fraud hides and you need her to keep sending them. Then reset two things: walk me through what you actually saw, not what you think it means — and the claim goes back on its normal timeline unless legal tells us otherwise. If I find something reportable, I’ll route it. If it clears, I’ll tell you that too, and that’s a good outcome, not a wasted one.",
      "continueLabel": "Make the call",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/rejoin-1.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 47.04,
        "captions": [
          {
            "start": 0,
            "end": 3.874,
            "text": "That’s the sentence to keep in front of you on every file."
          },
          {
            "start": 3.874,
            "end": 6.818,
            "text": "Prosecutors decide crimes. Courts decide guilt."
          },
          {
            "start": 6.818,
            "end": 9.575,
            "text": "Fraud bureaus decide whether to open a case."
          },
          {
            "start": 9.575,
            "end": 15.903,
            "text": "Claims decides whether to pay. You develop and hand off facts — accurately, neutrally, on the record."
          },
          {
            "start": 15.903,
            "end": 19.224,
            "text": "And it tells you exactly what to do in the next hour."
          },
          {
            "start": 19.224,
            "end": 22.043,
            "text": "Call the adjuster. Thank her for flagging it,"
          },
          {
            "start": 22.043,
            "end": 28.058,
            "text": "because the marginal referrals are where real fraud hides and you need her to keep sending them."
          },
          {
            "start": 28.058,
            "end": 33.759,
            "text": "Then reset two things: walk me through what you actually saw, not what you think it means —"
          },
          {
            "start": 33.759,
            "end": 38.709,
            "text": "and the claim goes back on its normal timeline unless legal tells us otherwise."
          },
          {
            "start": 38.709,
            "end": 41.591,
            "text": "If I find something reportable, I’ll route it."
          },
          {
            "start": 41.591,
            "end": 47.04,
            "text": "If it clears, I’ll tell you that too, and that’s a good outcome, not a wasted one."
          }
        ]
      },
      "next": "decision-2"
    },
    "decision-2": {
      "id": "decision-2",
      "type": "decision",
      "label": "Decision 2 · The elements",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "Decision 2 of 3",
      "decisionLabel": "Decision 2 of 3",
      "prompt": "March 9, the cause-and-origin report lands: incendiary, gasoline pour pattern across the front seats, no electrical or mechanical failure. Which fact in this file speaks most directly to the elements a prosecutor would have to prove?",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/decision-2.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 15.32,
        "captions": [
          {
            "start": 0,
            "end": 3.76,
            "text": "March 9, the cause-and-origin report lands: incendiary,"
          },
          {
            "start": 3.76,
            "end": 9.008,
            "text": "gasoline pour pattern across the front seats, no electrical or mechanical failure."
          },
          {
            "start": 9.008,
            "end": 15.32,
            "text": "Which fact in this file speaks most directly to the elements a prosecutor would have to prove?"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "label": "He’s $4,600 upside down and two payments behind",
          "isCorrect": false,
          "feedbackSceneId": "fb-2a"
        },
        {
          "id": "B",
          "label": "Comprehensive was added seven weeks before the loss",
          "isCorrect": false,
          "feedbackSceneId": "fb-2b"
        },
        {
          "id": "C",
          "label": "He stated both keys were in his kitchen drawer, and the vehicle shows no forced entry and was driven eleven miles to where it burned",
          "isCorrect": true,
          "feedbackSceneId": "fb-2c"
        },
        {
          "id": "D",
          "label": "The fire was incendiary, so a crime clearly occurred",
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
      "label": "D2 · A — upside down and behind",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "consequence": "That’s motive, and motive is not an element",
      "headline": "That’s motive, and motive is not an element",
      "body": "Look at what the statute actually requires: a knowing, material misrepresentation made with intent to obtain a benefit. Financial pressure is none of those. It’s a reason to look harder — a prompt, nothing more. Write “insured was $4,600 upside down” in your file and it belongs there as a documented fact. Write “insured had a financial motive to burn the truck” and you’ve converted a bank balance into an accusation with no bridge in between. That’s the leap that reads terribly in a deposition.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/fb-2a.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 32.36,
        "captions": [
          {
            "start": 0,
            "end": 3.73,
            "text": "Look at what the statute actually requires: a knowing,"
          },
          {
            "start": 3.73,
            "end": 7.867,
            "text": "material misrepresentation made with intent to obtain a benefit."
          },
          {
            "start": 7.867,
            "end": 10.194,
            "text": "Financial pressure is none of those."
          },
          {
            "start": 10.194,
            "end": 13.684,
            "text": "It’s a reason to look harder — a prompt, nothing more."
          },
          {
            "start": 13.684,
            "end": 19.76,
            "text": "Write “insured was $4,600 upside down” in your file and it belongs there as a documented fact."
          },
          {
            "start": 19.76,
            "end": 28.679,
            "text": "Write “insured had a financial motive to burn the truck” and you’ve converted a bank balance into an accusation with no bridge in between."
          },
          {
            "start": 28.679,
            "end": 32.36,
            "text": "That’s the leap that reads terribly in a deposition."
          }
        ]
      },
      "next": "rejoin-2"
    },
    "fb-2b": {
      "id": "fb-2b",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-2",
      "forOptionId": "B",
      "label": "D2 · B — coverage added seven weeks before",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "consequence": "Timing is an indicator, not a misrepresentation",
      "headline": "Timing is an indicator, not a misrepresentation",
      "body": "Recent coverage changes are worth documenting and worth explaining. But adding comprehensive coverage is a lawful act that thousands of people do every week — after a friend’s car gets broken into, after a raise, after a lender demands it. Ask yourself which element it proves. It proves none of them. It’s the kind of fact that belongs in a pattern, sitting alongside others, and never carries a file by itself.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/fb-2b.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 26.32,
        "captions": [
          {
            "start": 0,
            "end": 4.483,
            "text": "Recent coverage changes are worth documenting and worth explaining."
          },
          {
            "start": 4.483,
            "end": 10.183,
            "text": "But adding comprehensive coverage is a lawful act that thousands of people do every week —"
          },
          {
            "start": 10.183,
            "end": 15.25,
            "text": "after a friend’s car gets broken into, after a raise, after a lender demands it."
          },
          {
            "start": 15.25,
            "end": 17.593,
            "text": "Ask yourself which element it proves."
          },
          {
            "start": 17.593,
            "end": 23.799,
            "text": "It proves none of them. It’s the kind of fact that belongs in a pattern, sitting alongside others,"
          },
          {
            "start": 23.799,
            "end": 26.32,
            "text": "and never carries a file by itself."
          }
        ]
      },
      "next": "rejoin-2"
    },
    "fb-2c": {
      "id": "fb-2c",
      "type": "feedback",
      "verdict": "correct",
      "forDecisionId": "decision-2",
      "forOptionId": "C",
      "label": "D2 · C — the keys, the entry, the eleven miles (correct)",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "consequence": "Correct",
      "headline": "Correct",
      "continueLabel": "Continue",
      "media": {
        "provider": "placeholder",
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 0
      },
      "next": "rejoin-2"
    },
    "fb-2d": {
      "id": "fb-2d",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-2",
      "forOptionId": "D",
      "label": "D2 · D — incendiary, so a crime occurred",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "consequence": "Half right, and the missing half is the whole case",
      "headline": "Half right, and the missing half is the whole case",
      "body": "Yes — the origin report establishes that someone set that fire. That’s real, corroborated, technical evidence, and it’s the strongest thing in your file. But arson by a person unknown is a stolen-vehicle claim that ends in a fire, which is a covered loss. The origin report tells you a crime happened. It says nothing about who, and nothing about whether this insured knowingly made a false statement. Don’t let strong evidence of one thing get quietly promoted into evidence of a different thing.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/fb-2d.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 31.16,
        "captions": [
          {
            "start": 0,
            "end": 4.158,
            "text": "Yes — the origin report establishes that someone set that fire."
          },
          {
            "start": 4.158,
            "end": 9.694,
            "text": "That’s real, corroborated, technical evidence, and it’s the strongest thing in your file."
          },
          {
            "start": 9.694,
            "end": 14.42,
            "text": "But arson by a person unknown is a stolen-vehicle claim that ends in a fire,"
          },
          {
            "start": 14.42,
            "end": 18.774,
            "text": "which is a covered loss. The origin report tells you a crime happened."
          },
          {
            "start": 18.774,
            "end": 24.931,
            "text": "It says nothing about who, and nothing about whether this insured knowingly made a false statement."
          },
          {
            "start": 24.931,
            "end": 31.16,
            "text": "Don’t let strong evidence of one thing get quietly promoted into evidence of a different thing."
          }
        ]
      },
      "next": "rejoin-2"
    },
    "rejoin-2": {
      "id": "rejoin-2",
      "type": "narrative",
      "role": "continuation",
      "label": "Statement vs. physical evidence",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "All paths rejoin · On screen",
      "headline": "“Both keys in the drawer” + no forced entry + driven eleven miles",
      "body": "That’s a statement by the insured that conflicts with independent physical evidence. It’s a specific assertion, it’s material to whether the loss occurred as described, and it was made by him — which is what gets you into the neighborhood of a knowing misrepresentation. Everything else in this file is background. This is the thing your investigation actually has to develop: get the key inventory from the dealer, get the module read if the burn allows it, document whether the truck could have been driven without a key present. Notice what you just did. You worked backward from the elements a prosecutor must prove to the facts your investigation has to develop. That connection is what turns a referral from an insult into an actionable document. Weak: “This is fraud, refer it.” Strong: “This claim contains a material representation that conflicts with the origin report and the vehicle’s condition; here is the evidence; referring to the Fraud Bureau.”",
      "continueLabel": "Make the call",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/rejoin-2.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 59.48,
        "captions": [
          {
            "start": 0,
            "end": 5.477,
            "text": "That’s a statement by the insured that conflicts with independent physical evidence."
          },
          {
            "start": 5.477,
            "end": 10.652,
            "text": "It’s a specific assertion, it’s material to whether the loss occurred as described,"
          },
          {
            "start": 10.652,
            "end": 16.95,
            "text": "and it was made by him — which is what gets you into the neighborhood of a knowing misrepresentation."
          },
          {
            "start": 16.95,
            "end": 19.631,
            "text": "Everything else in this file is background."
          },
          {
            "start": 19.631,
            "end": 25.866,
            "text": "This is the thing your investigation actually has to develop: get the key inventory from the dealer,"
          },
          {
            "start": 25.866,
            "end": 28.484,
            "text": "get the module read if the burn allows it,"
          },
          {
            "start": 28.484,
            "end": 32.973,
            "text": "document whether the truck could have been driven without a key present."
          },
          {
            "start": 32.973,
            "end": 41.391,
            "text": "Notice what you just did. You worked backward from the elements a prosecutor must prove to the facts your investigation has to develop."
          },
          {
            "start": 41.391,
            "end": 46.628,
            "text": "That connection is what turns a referral from an insult into an actionable document."
          },
          {
            "start": 46.628,
            "end": 49.122,
            "text": "Weak: “This is fraud, refer it.” Strong:"
          },
          {
            "start": 49.122,
            "end": 56.167,
            "text": "“This claim contains a material representation that conflicts with the origin report and the vehicle’s condition;"
          },
          {
            "start": 56.167,
            "end": 59.48,
            "text": "here is the evidence; referring to the Fraud Bureau.”"
          }
        ]
      },
      "comparison": {
        "kicker": "Evidence exhibit",
        "conflict": "A statement by the insured that conflicts with independent physical evidence.",
        "a": {
          "label": "His recorded statement",
          "value": "Both keys have been in his kitchen drawer the whole time"
        },
        "b": {
          "label": "The vehicle",
          "value": "No forced entry, and driven eleven miles to where it burned"
        },
        "note": "It’s a specific assertion, it’s material to whether the loss occurred as described, and it was made by him"
      },
      "next": "decision-3"
    },
    "decision-3": {
      "id": "decision-3",
      "type": "decision",
      "label": "Decision 3 · The mandatory report",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "Decision 3 of 3",
      "decisionLabel": "Decision 3 of 3",
      "prompt": "Your state requires a report when you have reason to believe a claim is fraudulent, within the statutory window. What do you do?",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/decision-3.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 8.48,
        "captions": [
          {
            "start": 0,
            "end": 5.432,
            "text": "Your state requires a report when you have reason to believe a claim is fraudulent,"
          },
          {
            "start": 5.432,
            "end": 8.48,
            "text": "within the statutory window. What do you do?"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "label": "Wait for the fire bureau to confirm arson and for the key inventory to come back — you don’t want to report and be wrong",
          "isCorrect": false,
          "feedbackSceneId": "fb-3a"
        },
        {
          "id": "B",
          "label": "File on the fraud bureau’s form inside the window, stating facts and sources with no conclusion of guilt, and keep the claim on its own lawful track",
          "isCorrect": true,
          "feedbackSceneId": "fb-3b"
        },
        {
          "id": "C",
          "label": "File the report, and copy the adjuster, the lienholder, and the apartment complex manager so everybody knows what they’re dealing with",
          "isCorrect": false,
          "feedbackSceneId": "fb-3c"
        },
        {
          "id": "D",
          "label": "Skip the bureau and call the county prosecutor directly — arson is a felony and this needs to move now",
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
      "label": "D3 · A — wait for confirmation",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "consequence": "You just applied the wrong standard and missed a deadline",
      "headline": "You just applied the wrong standard and missed a deadline",
      "body": "The trigger is not proof. It’s reason to believe — reasonable suspicion supported by articulable facts. You have an incendiary origin report and an insured statement that conflicts with the physical evidence. That is well past a hunch. Waiting for certainty means the report is late, and a late report is a regulatory violation on your carrier’s record. Worse: the good-faith immunity that protects your report attaches to a timely filing through the proper channel. Wait for certainty and you lose the deadline and the shield. Reporting is not accusing. It’s routing.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/fb-3a.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 36.12,
        "captions": [
          {
            "start": 0,
            "end": 6.759,
            "text": "The trigger is not proof. It’s reason to believe — reasonable suspicion supported by articulable facts."
          },
          {
            "start": 6.759,
            "end": 13.341,
            "text": "You have an incendiary origin report and an insured statement that conflicts with the physical evidence."
          },
          {
            "start": 13.341,
            "end": 18.024,
            "text": "That is well past a hunch. Waiting for certainty means the report is late,"
          },
          {
            "start": 18.024,
            "end": 22.391,
            "text": "and a late report is a regulatory violation on your carrier’s record."
          },
          {
            "start": 22.391,
            "end": 29.479,
            "text": "Worse: the good-faith immunity that protects your report attaches to a timely filing through the proper channel."
          },
          {
            "start": 29.479,
            "end": 33.276,
            "text": "Wait for certainty and you lose the deadline and the shield."
          },
          {
            "start": 33.276,
            "end": 36.12,
            "text": "Reporting is not accusing. It’s routing."
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
      "label": "D3 · B — file inside the window, no verdict (correct)",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "consequence": "Correct",
      "headline": "Correct",
      "continueLabel": "Continue",
      "media": {
        "provider": "placeholder",
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
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
      "label": "D3 · C — copy everybody",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "consequence": "The report was fine. The distribution list is a lawsuit",
      "headline": "The report was fine. The distribution list is a lawsuit",
      "body": "Statutory immunity covers a good-faith report made to the proper authority. It does not cover you telling a lienholder and a property manager that your insured is suspected of arson. That’s a statement of criminal suspicion published to third parties with no need to know — the textbook shape of a defamation claim, and you gave it to them in writing. Keep suspicion inside the authorized circle: the bureau, your counsel, your unit, and the people in your company who must know to do their jobs. Nobody else. Ever.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/fb-3c.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 32.56,
        "captions": [
          {
            "start": 0,
            "end": 4.948,
            "text": "Statutory immunity covers a good-faith report made to the proper authority."
          },
          {
            "start": 4.948,
            "end": 11.603,
            "text": "It does not cover you telling a lienholder and a property manager that your insured is suspected of arson."
          },
          {
            "start": 11.603,
            "end": 17.252,
            "text": "That’s a statement of criminal suspicion published to third parties with no need to know —"
          },
          {
            "start": 17.252,
            "end": 22.086,
            "text": "the textbook shape of a defamation claim, and you gave it to them in writing."
          },
          {
            "start": 22.086,
            "end": 27.171,
            "text": "Keep suspicion inside the authorized circle: the bureau, your counsel, your unit,"
          },
          {
            "start": 27.171,
            "end": 32.56,
            "text": "and the people in your company who must know to do their jobs. Nobody else. Ever."
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
      "label": "D3 · D — call the prosecutor",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "consequence": "Right instinct, wrong channel — and the channel is the point",
      "headline": "Right instinct, wrong channel — and the channel is the point",
      "body": "The fraud bureau and the police are different bodies with different intake, different timelines, and different roles. Your mandatory duty runs to the destination your state’s code names, and immunity is generally tied to reporting to that designated authority. Route it there. The bureau reviews it, decides whether to investigate, and coordinates with prosecutors — that’s their function, not yours. If there’s an active-crime element that needs local law enforcement, that goes through your carrier’s protocol, not a cold call from you.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/fb-3d.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 33.96,
        "captions": [
          {
            "start": 0,
            "end": 6.273,
            "text": "The fraud bureau and the police are different bodies with different intake, different timelines,"
          },
          {
            "start": 6.273,
            "end": 11.866,
            "text": "and different roles. Your mandatory duty runs to the destination your state’s code names,"
          },
          {
            "start": 11.866,
            "end": 16.453,
            "text": "and immunity is generally tied to reporting to that designated authority."
          },
          {
            "start": 16.453,
            "end": 20.852,
            "text": "Route it there. The bureau reviews it, decides whether to investigate,"
          },
          {
            "start": 20.852,
            "end": 25.125,
            "text": "and coordinates with prosecutors — that’s their function, not yours."
          },
          {
            "start": 25.125,
            "end": 29.399,
            "text": "If there’s an active-crime element that needs local law enforcement,"
          },
          {
            "start": 29.399,
            "end": 33.96,
            "text": "that goes through your carrier’s protocol, not a cold call from you."
          }
        ]
      },
      "next": "rejoin-3"
    },
    "rejoin-3": {
      "id": "rejoin-3",
      "type": "narrative",
      "role": "continuation",
      "label": "Reporting is not denying",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "All paths rejoin · On screen",
      "headline": "“Reporting is a regulatory act. Denying is a claims act. They are not the same decision.”",
      "body": "This is the separation that new investigators collapse and regret. You can be legally required to report while having nothing close to grounds to deny. Both things are true on this file today. File the report, on the bureau’s form, through the bureau’s channel, inside the window — facts and sources, no verdict — and retain confirmation of the filing with the date. Then log it: what you filed, when, to whom, and where the confirmation lives.",
      "continueLabel": "See the resolution",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/rejoin-3.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 27.88,
        "captions": [
          {
            "start": 0,
            "end": 4.35,
            "text": "This is the separation that new investigators collapse and regret."
          },
          {
            "start": 4.35,
            "end": 9.58,
            "text": "You can be legally required to report while having nothing close to grounds to deny."
          },
          {
            "start": 9.58,
            "end": 12.071,
            "text": "Both things are true on this file today."
          },
          {
            "start": 12.071,
            "end": 17.551,
            "text": "File the report, on the bureau’s form, through the bureau’s channel, inside the window —"
          },
          {
            "start": 17.551,
            "end": 22.781,
            "text": "facts and sources, no verdict — and retain confirmation of the filing with the date."
          },
          {
            "start": 22.781,
            "end": 27.88,
            "text": "Then log it: what you filed, when, to whom, and where the confirmation lives."
          }
        ]
      },
      "next": "resolution-1"
    },
    "resolution-1": {
      "id": "resolution-1",
      "type": "narrative",
      "role": "resolution",
      "label": "The third key",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "The resolution · On screen",
      "headline": "Dealer key-inventory record",
      "body": "There it is. A third key, programmed six weeks before the loss, that his statement never mentioned. Now you have an independent, dated, third-party record that speaks directly to a specific representation he made under his own name. Not a feeling. Not a bank balance. A document with a signature on it.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/resolution-1.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 19.2,
        "captions": [
          {
            "start": 0,
            "end": 6.422,
            "text": "There it is. A third key, programmed six weeks before the loss, that his statement never mentioned."
          },
          {
            "start": 6.422,
            "end": 8.608,
            "text": "Now you have an independent, dated,"
          },
          {
            "start": 8.608,
            "end": 14.603,
            "text": "third-party record that speaks directly to a specific representation he made under his own name."
          },
          {
            "start": 14.603,
            "end": 19.2,
            "text": "Not a feeling. Not a bank balance. A document with a signature on it."
          }
        ]
      },
      "evidence": [
        {
          "id": "key-inventory",
          "kind": "document",
          "title": "Dealer key-inventory record",
          "caption": "Two keys issued 2019, one replacement fob programmed February 11, buyer signature on file."
        }
      ],
      "comparison": {
        "kicker": "Evidence exhibit",
        "conflict": "A third key, programmed six weeks before the loss, that his statement never mentioned.",
        "a": {
          "label": "His recorded statement",
          "value": "Both keys have been in his kitchen drawer the whole time"
        },
        "b": {
          "label": "Dealer key-inventory record",
          "value": "Two keys issued 2019, one replacement fob programmed February 11"
        },
        "note": "Not a feeling. Not a bank balance. A document with a signature on it."
      },
      "next": "resolution-2"
    },
    "resolution-2": {
      "id": "resolution-2",
      "type": "narrative",
      "role": "resolution",
      "label": "The file, tabbed",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "The file, tabbed",
      "body": "That’s the file. Every action dated the day you took it. Every fact sourced. The exculpatory items in there too — the police report showing a second vehicle burned in the same drainage cut that month, the neighbor who saw nothing. Your opinions in the analysis section, labeled as opinions, tied to evidence.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/resolution-2.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 19.56,
        "captions": [
          {
            "start": 0,
            "end": 3.73,
            "text": "That’s the file. Every action dated the day you took it."
          },
          {
            "start": 3.73,
            "end": 7.22,
            "text": "Every fact sourced. The exculpatory items in there too —"
          },
          {
            "start": 7.22,
            "end": 12.58,
            "text": "the police report showing a second vehicle burned in the same drainage cut that month,"
          },
          {
            "start": 12.58,
            "end": 19.56,
            "text": "the neighbor who saw nothing. Your opinions in the analysis section, labeled as opinions, tied to evidence."
          }
        ]
      },
      "evidence": [
        {
          "id": "activity-log",
          "kind": "document",
          "title": "Activity log dated from day one"
        },
        {
          "id": "origin-report",
          "kind": "document",
          "title": "Origin report"
        },
        {
          "id": "police-report",
          "kind": "document",
          "title": "Police report"
        },
        {
          "id": "statement-transcript",
          "kind": "document",
          "title": "Recorded statement transcript"
        },
        {
          "id": "key-inventory-tab",
          "kind": "document",
          "title": "Key inventory"
        },
        {
          "id": "bureau-filing",
          "kind": "document",
          "title": "Fraud bureau filing with confirmation"
        },
        {
          "id": "analysis-section",
          "kind": "document",
          "title": "Analysis section, labeled"
        }
      ],
      "next": "resolution-3"
    },
    "resolution-3": {
      "id": "resolution-3",
      "type": "narrative",
      "role": "resolution",
      "label": "The test",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "Could a stranger reconstruct this file and independently reach your conclusion?",
      "body": "That’s the test. If yes, you’ve done the job.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/resolution-3.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 3.08,
        "captions": [
          {
            "start": 0,
            "end": 3.08,
            "text": "That’s the test. If yes, you’ve done the job."
          }
        ]
      },
      "next": "resolution-4"
    },
    "resolution-4": {
      "id": "resolution-4",
      "type": "narrative",
      "role": "resolution",
      "label": "Same method. Different answer.",
      "layout": "avatar",
      "presenter": {
        "name": "Curtis Whitfield",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "Same method. Different answer.",
      "body": "Flip one fact — the dealer record shows two keys, both accounted for, and the module read confirms a relay-attack entry consistent with a professional theft ring the NICB is already tracking. The identical investigation now clears Marcus Delacroix completely, pays the claim, and feeds the bureau something genuinely useful. The answer changed. The method didn’t.",
      "continueLabel": "Continue to the next lessons",
      "media": {
        "provider": "file",
        "videoUrl": "/media/siu-01-av1-native/resolution-4.mp4",
        "hasAudio": true,
        "loop": false,
        "posterUrl": "/media/presenter-2-curtis-whitfield-production-still-1920x1080.png",
        "durationSec": 23.2,
        "captions": [
          {
            "start": 0,
            "end": 4.594,
            "text": "Flip one fact — the dealer record shows two keys, both accounted for,"
          },
          {
            "start": 4.594,
            "end": 12.231,
            "text": "and the module read confirms a relay-attack entry consistent with a professional theft ring the NICB is already tracking."
          },
          {
            "start": 12.231,
            "end": 17.469,
            "text": "The identical investigation now clears Marcus Delacroix completely, pays the claim,"
          },
          {
            "start": 17.469,
            "end": 20.498,
            "text": "and feeds the bureau something genuinely useful."
          },
          {
            "start": 20.498,
            "end": 23.2,
            "text": "The answer changed. The method didn’t."
          }
        ]
      },
      "next": null
    }
  }
} as Lesson;
