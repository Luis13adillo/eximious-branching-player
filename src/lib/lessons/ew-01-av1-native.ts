import type { Lesson } from "@/lib/branching/types";

/**
 * DELIVERABLE pilot lesson — ew-01-av1-native (native cut), STANDALONE.
 * ============================================================================
 * Every media path is a literal, baked from the resolved lesson — no dependency
 * on any other lesson module — so this exports cleanly to a self-contained
 * Thinkific HTML5 package. Regenerate with scripts/bake-deliverable-lessons.ts.
 */
export const ew01Av1Native: Lesson = {
  "id": "ew-01-av1-native",
  "slug": "ew-01-av1-native",
  "courseTitle": "Becoming a Retained Expert",
  "title": "Case Application — The Phone Rings",
  "subtitle": "Application Video 1 of 2 — The First Call, and Everything You Say Yes To",
  "summary": "A plaintiff's firm calls with a fatal rollover and a conclusion already picked out. Three decisions, each with its own feedback branch and a retry until you get it right, then the correct reasoning and the resolution.",
  "estimatedMinutes": 9,
  "completion": {
    "takeaway": "Champions get discredited. Teachers get retained.",
    "headlineAllCorrect": "You held the line where it counts.",
    "headlinePartial": "The engagement resolves — carry the method forward."
  },
  "startSceneId": "intro",
  "progress": [
    {
      "id": "open",
      "label": "The phone rings",
      "scenes": [
        "intro"
      ]
    },
    {
      "id": "who",
      "label": "Who you are",
      "scenes": [
        "assignment-1"
      ]
    },
    {
      "id": "call",
      "label": "The call",
      "scenes": [
        "assignment-2",
        "assignment-3",
        "assignment-4"
      ]
    },
    {
      "id": "decision-1",
      "label": "Decision 1 · The ask",
      "scenes": [
        "decision-1"
      ]
    },
    {
      "id": "independence",
      "label": "Your independence",
      "scenes": [
        "rejoin-1a"
      ]
    },
    {
      "id": "teacher",
      "label": "Teacher, not champion",
      "scenes": [
        "rejoin-1b"
      ]
    },
    {
      "id": "decision-2",
      "label": "Decision 2 · Scope of expertise",
      "scenes": [
        "decision-2"
      ]
    },
    {
      "id": "boundary",
      "label": "The boundary",
      "scenes": [
        "rejoin-2a"
      ]
    },
    {
      "id": "qualification",
      "label": "How courts weigh it",
      "scenes": [
        "rejoin-2b"
      ]
    },
    {
      "id": "decision-3",
      "label": "Decision 3 · Your own website",
      "scenes": [
        "decision-3"
      ]
    },
    {
      "id": "marketing",
      "label": "Marketing is subtractive",
      "scenes": [
        "rejoin-3"
      ]
    },
    {
      "id": "scope",
      "label": "The engagement, as scoped",
      "scenes": [
        "resolution-1"
      ]
    },
    {
      "id": "restraint",
      "label": "The restraint evidence",
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
    "module": "Application Video 1 of 2",
    "lessonNumber": 1,
    "author": "Roger M. Naut",
    "caseId": "Doss v. Ferrin Haulage"
  },
  "scenes": {
    "intro": {
      "id": "intro",
      "type": "narrative",
      "role": "intro",
      "label": "The phone rings",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "Case Application",
      "headline": "The Phone Rings",
      "subhead": "Covers Lessons 1–3. You're the expert, the call is live, and you're making the calls. Choose an answer and you'll see exactly why that choice is right or wrong, then try again until it's right.",
      "body": "You’ve read the first three lessons. Now let’s find out if it stuck. You’re the expert, the call is live, and you’re making the calls. Pause when I ask.",
      "continueLabel": "See who you are",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/intro.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 10.64,
        "captions": [
          {
            "start": 0,
            "end": 2.57,
            "text": "You’ve read the first three lessons."
          },
          {
            "start": 2.57,
            "end": 4.78,
            "text": "Now let’s find out if it stuck."
          },
          {
            "start": 4.78,
            "end": 9.43,
            "text": "You’re the expert, the call is live, and you’re making the calls."
          },
          {
            "start": 9.43,
            "end": 10.64,
            "text": "Pause when I ask."
          }
        ]
      },
      "next": "assignment-1"
    },
    "assignment-1": {
      "id": "assignment-1",
      "type": "narrative",
      "role": "briefing",
      "label": "Who you are",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "Who You Are",
      "subhead": "Twenty-two years · qualified eleven times · no roadside hardware design experience",
      "body": "Twenty-two years reconstructing vehicle collisions. Formerly a state police crash reconstruction unit; now independent. You’ve been qualified as an expert eleven times. You teach a two-day course on momentum analysis. You have never designed a piece of roadside safety hardware in your life.",
      "continueLabel": "Take the call",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/assignment-1.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 23.08,
        "captions": [
          {
            "start": 0,
            "end": 4.1,
            "text": "Twenty-two years reconstructing vehicle collisions."
          },
          {
            "start": 4.1,
            "end": 9.49,
            "text": "Formerly a state police crash reconstruction unit; now independent."
          },
          {
            "start": 9.49,
            "end": 13.35,
            "text": "You’ve been qualified as an expert eleven times."
          },
          {
            "start": 13.35,
            "end": 17.21,
            "text": "You teach a two-day course on momentum analysis."
          },
          {
            "start": 17.21,
            "end": 23.08,
            "text": "You have never designed a piece of roadside safety hardware in your life."
          }
        ]
      },
      "next": "assignment-2"
    },
    "assignment-2": {
      "id": "assignment-2",
      "type": "narrative",
      "role": "briefing",
      "label": "The call",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "The Call",
      "subhead": "Renata Prieto, Halloway & Prieto · Doss v. Ferrin Haulage and Cavender County",
      "body": "Renata Prieto, of Halloway & Prieto — a plaintiff’s firm. The matter: Doss v. Ferrin Haulage and Cavender County. Marguerite Doss, 29, front-seat passenger in a pickup that left Route 41 at approximately 2:10 a.m., struck a guardrail end terminal, and rolled. She died at the scene. Her estate is suing the driver’s employer and the county.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/assignment-2.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 28,
        "captions": [
          {
            "start": 0,
            "end": 4.78,
            "text": "Renata Prieto, of Halloway & Prieto — a plaintiff’s firm."
          },
          {
            "start": 4.78,
            "end": 9.39,
            "text": "The matter: Doss v. Ferrin Haulage and Cavender County."
          },
          {
            "start": 9.39,
            "end": 11.07,
            "text": "Marguerite Doss, 29,"
          },
          {
            "start": 11.07,
            "end": 17.69,
            "text": "front-seat passenger in a pickup that left Route 41 at approximately 2:10 a.m.,"
          },
          {
            "start": 17.69,
            "end": 21.38,
            "text": "struck a guardrail end terminal, and rolled."
          },
          {
            "start": 21.38,
            "end": 23.22,
            "text": "She died at the scene."
          },
          {
            "start": 23.22,
            "end": 28,
            "text": "Her estate is suing the driver’s employer and the county."
          }
        ]
      },
      "next": "assignment-3"
    },
    "assignment-3": {
      "id": "assignment-3",
      "type": "narrative",
      "role": "evidence",
      "label": "The scene",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "On screen · Exhibit",
      "headline": "The scene",
      "body": "Eleven minutes into the call, Prieto says this:",
      "continueLabel": "Hear the ask",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/assignment-3.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 4.44,
        "captions": [
          {
            "start": 0,
            "end": 4.44,
            "text": "Eleven minutes into the call, Prieto says this:"
          }
        ]
      },
      "evidence": [
        {
          "id": "guardrail-night",
          "kind": "photo",
          "title": "Photo — night scene, a rural two-lane, a guardrail end terminal peeled and folded back like a ribbon, a pickup on its roof forty feet beyond, evidence markers on the asphalt",
          "caption": "Marguerite Doss, 29, front-seat passenger. Route 41, approximately 2:10 a.m."
        }
      ],
      "next": "assignment-4"
    },
    "assignment-4": {
      "id": "assignment-4",
      "type": "narrative",
      "role": "briefing",
      "label": "The ask",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "The ask",
      "subhead": "“The reconstructionist we had says Ms. Doss wasn’t belted, and that guts our damages under this state’s rule. We need someone who’ll say the restraint evidence is inconclusive.”",
      "body": "Let’s work it.",
      "continueLabel": "Make the call",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/assignment-4.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 1.68,
        "captions": [
          {
            "start": 0,
            "end": 1.68,
            "text": "Let’s work it."
          }
        ]
      },
      "next": "decision-1"
    },
    "decision-1": {
      "id": "decision-1",
      "type": "decision",
      "label": "Decision 1 · The ask",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "Decision 1 of 3",
      "decisionLabel": "Decision 1 of 3",
      "prompt": "What do you say?",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/decision-1.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 2,
        "captions": [
          {
            "start": 0,
            "end": 2,
            "text": "What do you say?"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "label": "Take the engagement — belt evidence genuinely is inconclusive in a lot of rollovers, so you can probably say that honestly anyway",
          "isCorrect": false,
          "feedbackSceneId": "fb-1a"
        },
        {
          "id": "B",
          "label": "Tell her plainly that you go where the analysis goes, that an opinion that bends breaks on cross-examination, and offer to examine the restraint evidence independently — prepared to decline if what she wants is a mouthpiece",
          "isCorrect": true,
          "feedbackSceneId": "fb-1b"
        },
        {
          "id": "C",
          "label": "Take it as a consulting expert only, so nothing you say is discoverable, and give her the answer she needs off the record",
          "isCorrect": false,
          "feedbackSceneId": "fb-1c"
        },
        {
          "id": "D",
          "label": "End the call and report her to the state bar",
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
      "label": "D1 · A — take the engagement",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "consequence": "You just accepted the conclusion before doing the analysis",
      "headline": "You just accepted the conclusion before doing the analysis",
      "body": "Listen to what you agreed to. You haven’t seen the D-ring, the webbing, the latch plate, the seat back, or a single photograph — and you’ve already decided what you’ll probably be able to say. That’s the exact inversion that makes an expert worthless. The problem isn’t that “inconclusive” might be wrong; it might well turn out to be right. The problem is that you’d be reasoning backward from a needed answer, and reasoning backward leaves fingerprints all over a file that opposing counsel gets to read.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/fb-1a.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 35.68,
        "captions": [
          {
            "start": 0,
            "end": 2.07,
            "text": "Listen to what you agreed to."
          },
          {
            "start": 2.07,
            "end": 7.28,
            "text": "You haven’t seen the D-ring, the webbing, the latch plate, the seat back,"
          },
          {
            "start": 7.28,
            "end": 13.56,
            "text": "or a single photograph — and you’ve already decided what you’ll probably be able to say."
          },
          {
            "start": 13.56,
            "end": 17.7,
            "text": "That’s the exact inversion that makes an expert worthless."
          },
          {
            "start": 17.7,
            "end": 24.05,
            "text": "The problem isn’t that “inconclusive” might be wrong; it might well turn out to be right."
          },
          {
            "start": 24.05,
            "end": 28.97,
            "text": "The problem is that you’d be reasoning backward from a needed answer,"
          },
          {
            "start": 28.97,
            "end": 35.68,
            "text": "and reasoning backward leaves fingerprints all over a file that opposing counsel gets to read."
          }
        ]
      },
      "next": "rejoin-1a"
    },
    "fb-1b": {
      "id": "fb-1b",
      "type": "feedback",
      "verdict": "correct",
      "forDecisionId": "decision-1",
      "forOptionId": "B",
      "label": "D1 · B — go where the analysis goes (correct)",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "consequence": "Correct",
      "headline": "Correct",
      "continueLabel": "Continue",
      "media": {
        "provider": "placeholder",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "durationSec": 0
      },
      "next": "rejoin-1a"
    },
    "fb-1c": {
      "id": "fb-1c",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-1",
      "forOptionId": "C",
      "label": "D1 · C — consulting expert only",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "consequence": "The consulting hat isn’t a place to store dishonesty",
      "headline": "The consulting hat isn’t a place to store dishonesty",
      "body": "Two problems, and the second one is worse. First, the practical: designation can change later, and much of what you write as a consultant can follow you into a testifying role — assume every note you make may be read aloud under oath. Second, the real one: the consulting hat protects candid work, not dishonest work. If your honest analysis says the decedent wasn’t belted, you say that to counsel behind the scenes so she can settle or re-strategize. That’s the whole value of a consulting expert. Telling her what she wants to hear privately is the same failure in a quieter room.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/fb-1c.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 44.24,
        "captions": [
          {
            "start": 0,
            "end": 3.23,
            "text": "Two problems, and the second one is worse."
          },
          {
            "start": 3.23,
            "end": 7.16,
            "text": "First, the practical: designation can change later,"
          },
          {
            "start": 7.16,
            "end": 13.31,
            "text": "and much of what you write as a consultant can follow you into a testifying role"
          },
          {
            "start": 13.31,
            "end": 17.77,
            "text": "— assume every note you make may be read aloud under oath."
          },
          {
            "start": 17.77,
            "end": 24.08,
            "text": "Second, the real one: the consulting hat protects candid work, not dishonest work."
          },
          {
            "start": 24.08,
            "end": 28.39,
            "text": "If your honest analysis says the decedent wasn’t belted,"
          },
          {
            "start": 28.39,
            "end": 34.31,
            "text": "you say that to counsel behind the scenes so she can settle or re-strategize."
          },
          {
            "start": 34.31,
            "end": 37.85,
            "text": "That’s the whole value of a consulting expert."
          },
          {
            "start": 37.85,
            "end": 44.24,
            "text": "Telling her what she wants to hear privately is the same failure in a quieter room."
          }
        ]
      },
      "next": "rejoin-1a"
    },
    "fb-1d": {
      "id": "fb-1d",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-1",
      "forOptionId": "D",
      "label": "D1 · D — report her to the state bar",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "consequence": "Overreaction to a sentence lawyers say all the time",
      "headline": "Overreaction to a sentence lawyers say all the time",
      "body": "Slow down. What Prieto said is clumsy and it’s a warning sign, but it isn’t misconduct — plenty of good lawyers say something like it, and plenty of them respond well when an expert draws the line. You don’t need a disciplinary process; you need one calm sentence about how you work. If she still wants a hired opinion after you’ve said it, you decline, and you decline cleanly. Reserve your escalation for something that actually earns it.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/fb-1d.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 33.32,
        "captions": [
          {
            "start": 0,
            "end": 0.77,
            "text": "Slow down."
          },
          {
            "start": 0.77,
            "end": 6.53,
            "text": "What Prieto said is clumsy and it’s a warning sign, but it isn’t misconduct"
          },
          {
            "start": 6.53,
            "end": 10.13,
            "text": "— plenty of good lawyers say something like it,"
          },
          {
            "start": 10.13,
            "end": 14.89,
            "text": "and plenty of them respond well when an expert draws the line."
          },
          {
            "start": 14.89,
            "end": 21.42,
            "text": "You don’t need a disciplinary process; you need one calm sentence about how you work."
          },
          {
            "start": 21.42,
            "end": 28.64,
            "text": "If she still wants a hired opinion after you’ve said it, you decline, and you decline cleanly."
          },
          {
            "start": 28.64,
            "end": 33.32,
            "text": "Reserve your escalation for something that actually earns it."
          }
        ]
      },
      "next": "rejoin-1a"
    },
    "rejoin-1a": {
      "id": "rejoin-1a",
      "type": "narrative",
      "role": "continuation",
      "label": "Your independence",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "All paths rejoin · On screen",
      "headline": "Your independence is the entire product.",
      "subhead": "The line, on screen as spoken — “I’ll examine the restraint evidence the same way I’d examine it for any client, and I’ll tell you what I find — including if it’s bad for you. An opinion that bends to fit a case is an opinion that breaks the first time somebody crosses me on it.”",
      "body": "Say it plainly and say it early, because that sentence does more work than any part of your CV. It tells her, in one breath, that you’re the kind of witness a jury will believe — and a lawyer who’s actually thinking about trial will hear that as an asset. Here’s the thing new experts take longest to accept: you are not on the lawyer’s team. It feels like you are. She hired you, she’ll pay you, she’ll prepare you and sit beside you. But the instant a judge or jury senses you’d have said whatever you were paid to say, your opinion evaporates — and it takes her case down with it. Your duty runs to the tribunal, under one label or another in every serious system. Your opinion belongs to the court.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/rejoin-1a.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 49.4,
        "captions": [
          {
            "start": 0,
            "end": 6.77,
            "text": "Say it plainly and say it early, because that sentence does more work than any part of your CV."
          },
          {
            "start": 6.77,
            "end": 12.47,
            "text": "It tells her, in one breath, that you’re the kind of witness a jury will believe"
          },
          {
            "start": 12.47,
            "end": 18.03,
            "text": "— and a lawyer who’s actually thinking about trial will hear that as an asset."
          },
          {
            "start": 18.03,
            "end": 24.17,
            "text": "Here’s the thing new experts take longest to accept: you are not on the lawyer’s team."
          },
          {
            "start": 24.17,
            "end": 25.73,
            "text": "It feels like you are."
          },
          {
            "start": 25.73,
            "end": 30.65,
            "text": "She hired you, she’ll pay you, she’ll prepare you and sit beside you."
          },
          {
            "start": 30.65,
            "end": 36.71,
            "text": "But the instant a judge or jury senses you’d have said whatever you were paid to say,"
          },
          {
            "start": 36.71,
            "end": 41.06,
            "text": "your opinion evaporates — and it takes her case down with it."
          },
          {
            "start": 41.06,
            "end": 46.98,
            "text": "Your duty runs to the tribunal, under one label or another in every serious system."
          },
          {
            "start": 46.98,
            "end": 49.4,
            "text": "Your opinion belongs to the court."
          }
        ]
      },
      "next": "rejoin-1b"
    },
    "rejoin-1b": {
      "id": "rejoin-1b",
      "type": "narrative",
      "role": "continuation",
      "label": "Teacher, not champion",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "Two experts, two outcomes",
      "body": "And note what the strong version buys Prieto: the truth early, while she can still do something with it. That’s not you being difficult. That’s the service. One more framing to carry through this whole course. Be a teacher, not a champion. Champions get discredited. Teachers get retained.",
      "continueLabel": "Make the call",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/rejoin-1b.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 22.64,
        "captions": [
          {
            "start": 0,
            "end": 3.61,
            "text": "And note what the strong version buys Prieto:"
          },
          {
            "start": 3.61,
            "end": 8.27,
            "text": "the truth early, while she can still do something with it."
          },
          {
            "start": 8.27,
            "end": 10.76,
            "text": "That’s not you being difficult."
          },
          {
            "start": 10.76,
            "end": 12.28,
            "text": "That’s the service."
          },
          {
            "start": 12.28,
            "end": 16.46,
            "text": "One more framing to carry through this whole course."
          },
          {
            "start": 16.46,
            "end": 18.79,
            "text": "Be a teacher, not a champion."
          },
          {
            "start": 18.79,
            "end": 20.87,
            "text": "Champions get discredited."
          },
          {
            "start": 20.87,
            "end": 22.64,
            "text": "Teachers get retained."
          }
        ]
      },
      "comparison": {
        "kicker": "On screen",
        "conflict": "Two experts, two outcomes.",
        "a": {
          "label": "LEFT",
          "value": "examines the restraint hardware, finds against the plaintiff, tells counsel in week two.",
          "detail": "Counsel re-strategizes. Gets called again."
        },
        "b": {
          "label": "RIGHT",
          "value": "shapes the analysis to fit, buries the contrary data, gets impeached at deposition with the test results he ignored.",
          "detail": "Opinion excluded. Phone stops ringing."
        },
        "note": "Be a teacher, not a champion. Champions get discredited. Teachers get retained."
      },
      "next": "decision-2"
    },
    "decision-2": {
      "id": "decision-2",
      "type": "decision",
      "label": "Decision 2 · Scope of expertise",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "Decision 2 of 3",
      "decisionLabel": "Decision 2 of 3",
      "prompt": "Prieto keeps going: “We also need an opinion that the guardrail end terminal was defectively designed — that’s the county’s exposure.” What’s your answer?",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/decision-2.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 10.4,
        "captions": [
          {
            "start": 0,
            "end": 1.31,
            "text": "Prieto keeps going:"
          },
          {
            "start": 1.31,
            "end": 6.89,
            "text": "“We also need an opinion that the guardrail end terminal was defectively designed"
          },
          {
            "start": 6.89,
            "end": 9.09,
            "text": "— that’s the county’s exposure.”"
          },
          {
            "start": 9.09,
            "end": 10.4,
            "text": "What’s your answer?"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "label": "Take it — twenty-two years of crash reconstruction is twenty-two years of impact physics, and a guardrail is just another object in a collision",
          "isCorrect": false,
          "feedbackSceneId": "fb-2a"
        },
        {
          "id": "B",
          "label": "Limit your opinion to vehicle dynamics, speed, departure angle and impact sequence; say out loud that end-terminal design is outside your expertise; and tell her she needs a roadside-safety-hardware specialist for that piece",
          "isCorrect": true,
          "feedbackSceneId": "fb-2b"
        },
        {
          "id": "C",
          "label": "Spend the weekend reading the roadside hardware standards and the crash-test literature, then take the whole thing",
          "isCorrect": false,
          "feedbackSceneId": "fb-2c"
        },
        {
          "id": "D",
          "label": "Offer a softer version — that the terminal “did not perform as intended” — without claiming to be a design expert",
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
      "label": "D2 · A — impact physics is impact physics",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "consequence": "Apply the peer wince test",
      "headline": "Apply the peer wince test",
      "body": "Picture a respected colleague — someone who actually designs and crash-tests roadside hardware for a living — hearing that you offered a design-defect opinion on an end terminal. Nod, or wince? Adjacent isn’t the same. A bridge engineer isn’t automatically qualified on a specific fatigue-cracking mechanism just because both involve steel, and a reconstructionist isn’t qualified on terminal design just because both involve vehicles hitting things. Opposing counsel will walk you through your own CV — never designed one, never tested one, never published on it — and the jury will watch you get exposed. The problem won’t be your intelligence. It’ll be the reach.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/fb-2a.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 46.08,
        "captions": [
          {
            "start": 0,
            "end": 2.04,
            "text": "Picture a respected colleague"
          },
          {
            "start": 2.04,
            "end": 7.47,
            "text": "— someone who actually designs and crash-tests roadside hardware for a living"
          },
          {
            "start": 7.47,
            "end": 12.4,
            "text": "— hearing that you offered a design-defect opinion on an end terminal."
          },
          {
            "start": 12.4,
            "end": 13.39,
            "text": "Nod, or wince?"
          },
          {
            "start": 13.39,
            "end": 15.08,
            "text": "Adjacent isn’t the same."
          },
          {
            "start": 15.08,
            "end": 19.38,
            "text": "A bridge engineer isn’t automatically qualified on a specific"
          },
          {
            "start": 19.38,
            "end": 23.53,
            "text": "fatigue-cracking mechanism just because both involve steel,"
          },
          {
            "start": 23.53,
            "end": 27.13,
            "text": "and a reconstructionist isn’t qualified on terminal"
          },
          {
            "start": 27.13,
            "end": 31.14,
            "text": "design just because both involve vehicles hitting things."
          },
          {
            "start": 31.14,
            "end": 36.22,
            "text": "Opposing counsel will walk you through your own CV — never designed one,"
          },
          {
            "start": 36.22,
            "end": 41.99,
            "text": "never tested one, never published on it — and the jury will watch you get exposed."
          },
          {
            "start": 41.99,
            "end": 44.74,
            "text": "The problem won’t be your intelligence."
          },
          {
            "start": 44.74,
            "end": 46.08,
            "text": "It’ll be the reach."
          }
        ]
      },
      "next": "rejoin-2a"
    },
    "fb-2b": {
      "id": "fb-2b",
      "type": "feedback",
      "verdict": "correct",
      "forDecisionId": "decision-2",
      "forOptionId": "B",
      "label": "D2 · B — claim what you own (correct)",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "consequence": "Correct",
      "headline": "Correct",
      "continueLabel": "Continue",
      "media": {
        "provider": "placeholder",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "durationSec": 0
      },
      "next": "rejoin-2a"
    },
    "fb-2c": {
      "id": "fb-2c",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-2",
      "forOptionId": "C",
      "label": "D2 · C — read up over the weekend",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "consequence": "Reading closes a thin gap; it doesn’t manufacture a practice",
      "headline": "Reading closes a thin gap; it doesn’t manufacture a practice",
      "body": "Reading into the current literature is legitimate and expected — when you already do the work and need to confirm the field hasn’t moved past you. It does not convert a weekend into twenty years of hands-on design and testing. And here’s the practical trap: whatever you read this weekend, an opposing expert has been living for a career, and the cross-examination will find the edge of your reading in about four questions. If you’d be embarrassed to have a leading colleague hear you claim the expertise, you’re reaching.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/fb-2c.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 34.32,
        "captions": [
          {
            "start": 0,
            "end": 4.12,
            "text": "Reading into the current literature is legitimate and expected"
          },
          {
            "start": 4.12,
            "end": 9.64,
            "text": "— when you already do the work and need to confirm the field hasn’t moved past you."
          },
          {
            "start": 9.64,
            "end": 14.9,
            "text": "It does not convert a weekend into twenty years of hands-on design and testing."
          },
          {
            "start": 14.9,
            "end": 19.02,
            "text": "And here’s the practical trap: whatever you read this weekend,"
          },
          {
            "start": 19.02,
            "end": 22.21,
            "text": "an opposing expert has been living for a career,"
          },
          {
            "start": 22.21,
            "end": 27.87,
            "text": "and the cross-examination will find the edge of your reading in about four questions."
          },
          {
            "start": 27.87,
            "end": 33.26,
            "text": "If you’d be embarrassed to have a leading colleague hear you claim the expertise,"
          },
          {
            "start": 33.26,
            "end": 34.32,
            "text": "you’re reaching."
          }
        ]
      },
      "next": "rejoin-2a"
    },
    "fb-2d": {
      "id": "fb-2d",
      "type": "feedback",
      "verdict": "incorrect",
      "forDecisionId": "decision-2",
      "forOptionId": "D",
      "label": "D2 · D — a softer version",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "consequence": "That is the design opinion, with the label filed off",
      "headline": "That is the design opinion, with the label filed off",
      "body": "“Did not perform as intended” is a statement about what the device was designed to do and whether it did it. You can’t offer that without an expertise in terminal design and performance criteria — you’ve just made the same claim while surrendering the ability to defend it. Hedged phrasing is actually worse under a qualifications challenge, because it reads as an expert who knew he was out of bounds and tried to sneak across. Claim what you own. Disclaim the rest out loud.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/fb-2d.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 30.36,
        "captions": [
          {
            "start": 0,
            "end": 3.56,
            "text": "“Did not perform as intended” is a statement about what"
          },
          {
            "start": 3.56,
            "end": 6.93,
            "text": "the device was designed to do and whether it did it."
          },
          {
            "start": 6.93,
            "end": 12.43,
            "text": "You can’t offer that without an expertise in terminal design and performance criteria"
          },
          {
            "start": 12.43,
            "end": 17.48,
            "text": "— you’ve just made the same claim while surrendering the ability to defend it."
          },
          {
            "start": 17.48,
            "end": 21.82,
            "text": "Hedged phrasing is actually worse under a qualifications challenge,"
          },
          {
            "start": 21.82,
            "end": 27.38,
            "text": "because it reads as an expert who knew he was out of bounds and tried to sneak across."
          },
          {
            "start": 27.38,
            "end": 28.61,
            "text": "Claim what you own."
          },
          {
            "start": 28.61,
            "end": 30.36,
            "text": "Disclaim the rest out loud."
          }
        ]
      },
      "next": "rejoin-2a"
    },
    "rejoin-2a": {
      "id": "rejoin-2a",
      "type": "narrative",
      "role": "continuation",
      "label": "The boundary",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "All paths rejoin · On screen",
      "headline": "Qualification is decided per matter, per question — not once for a career.",
      "subhead": "The sentence that protects you — “I can speak to the vehicle’s speed, departure angle, impact sequence and rollover dynamics. Whether that end terminal was defectively designed is outside my expertise — you’ll want a roadside safety hardware specialist for that, and I can suggest two.”",
      "body": "Read that again and notice what it does. It concedes a boundary, and the concession makes everything inside the boundary stronger — because the judge and the jury have just watched you refuse to overreach. That’s not modesty. It’s the single best defense of your core opinion. And understand how this gets tested in practice, because it isn’t only a private worry. Opposing counsel can challenge you before trial by motion, or probe you live through voir dire on your qualifications, with the judge sitting as gatekeeper. The expert who, asked whether he can also address the terminal design, says “well, I’ve picked up a fair amount over the years” has just widened the target and invited an examination that can end with a judge limiting or excluding him.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/rejoin-2a.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 52.4,
        "captions": [
          {
            "start": 0,
            "end": 2.81,
            "text": "Read that again and notice what it does."
          },
          {
            "start": 2.81,
            "end": 8.99,
            "text": "It concedes a boundary, and the concession makes everything inside the boundary stronger"
          },
          {
            "start": 8.99,
            "end": 14.26,
            "text": "— because the judge and the jury have just watched you refuse to overreach."
          },
          {
            "start": 14.26,
            "end": 15.59,
            "text": "That’s not modesty."
          },
          {
            "start": 15.59,
            "end": 19.11,
            "text": "It’s the single best defense of your core opinion."
          },
          {
            "start": 19.11,
            "end": 25.22,
            "text": "And understand how this gets tested in practice, because it isn’t only a private worry."
          },
          {
            "start": 25.22,
            "end": 29.29,
            "text": "Opposing counsel can challenge you before trial by motion,"
          },
          {
            "start": 29.29,
            "end": 33.43,
            "text": "or probe you live through voir dire on your qualifications,"
          },
          {
            "start": 33.43,
            "end": 36.03,
            "text": "with the judge sitting as gatekeeper."
          },
          {
            "start": 36.03,
            "end": 41.79,
            "text": "The expert who, asked whether he can also address the terminal design, says “well,"
          },
          {
            "start": 41.79,
            "end": 47.13,
            "text": "I’ve picked up a fair amount over the years” has just widened the target and"
          },
          {
            "start": 47.13,
            "end": 52.4,
            "text": "invited an examination that can end with a judge limiting or excluding him."
          }
        ]
      },
      "next": "rejoin-2b"
    },
    "rejoin-2b": {
      "id": "rejoin-2b",
      "type": "narrative",
      "role": "continuation",
      "label": "How courts weigh it",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "The categories a court weighs",
      "subhead": "education & training · licensure & certification · hands-on experience doing the thing in dispute · teaching · publications & peer-reviewed work · professional memberships · prior expert experience. Their weight shifts with the question.",
      "body": "Then keep the CV scrupulously clean, because it’s treated as sworn. A lapsed certification listed as current, a minor role inflated into a leadership one — impeachment on your CV is doubly powerful. It removes your opinion and tells the jury you’re the kind of person who exaggerates, which poisons everything else you say.",
      "continueLabel": "Make the call",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/rejoin-2b.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 23.72,
        "captions": [
          {
            "start": 0,
            "end": 4.98,
            "text": "Then keep the CV scrupulously clean, because it’s treated as sworn."
          },
          {
            "start": 4.98,
            "end": 11.3,
            "text": "A lapsed certification listed as current, a minor role inflated into a leadership one"
          },
          {
            "start": 11.3,
            "end": 14.57,
            "text": "— impeachment on your CV is doubly powerful."
          },
          {
            "start": 14.57,
            "end": 20.89,
            "text": "It removes your opinion and tells the jury you’re the kind of person who exaggerates,"
          },
          {
            "start": 20.89,
            "end": 23.72,
            "text": "which poisons everything else you say."
          }
        ]
      },
      "next": "decision-3"
    },
    "decision-3": {
      "id": "decision-3",
      "type": "decision",
      "label": "Decision 3 · Your own website",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "Decision 3 of 3",
      "decisionLabel": "Decision 3 of 3",
      "headline": "The current site",
      "subhead": "“THE RECONSTRUCTIONIST PLAINTIFF’S FIRMS TRUST.” · “200+ cases.” · “Never excluded.” · Three client testimonials naming verdicts. · A specialty list running to nine fields including “premises safety” and “product failure analysis.”",
      "prompt": "Prieto mentions she found you through your website. So will opposing counsel. Here’s what it says.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/decision-3.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 8.6,
        "captions": [
          {
            "start": 0,
            "end": 4.57,
            "text": "Prieto mentions she found you through your website."
          },
          {
            "start": 4.57,
            "end": 6.81,
            "text": "So will opposing counsel."
          },
          {
            "start": 6.81,
            "end": 8.6,
            "text": "Here’s what it says."
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "label": "Leave it — every number on it is true, and “never excluded” is accurate",
          "isCorrect": false,
          "feedbackSceneId": "fb-3a"
        },
        {
          "id": "B",
          "label": "Rewrite it: one narrowly defined specialty, credentials accurate to the day, representative engagements described by field and issue only, an explicit statement that you’re retained by plaintiff and defense counsel, and a clear path to run a conflicts check — with the win-rate language, the “never excluded” claim, and the testimonials deleted",
          "isCorrect": true,
          "feedbackSceneId": "fb-3b"
        },
        {
          "id": "C",
          "label": "Take the site down entirely — you get work by referral anyway, and there’s nothing to impeach if there’s nothing there",
          "isCorrect": false,
          "feedbackSceneId": "fb-3c"
        },
        {
          "id": "D",
          "label": "Balance it out by adding testimonials from defense-side clients",
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
      "label": "D3 · A — leave it, it's all true",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "consequence": "True and impeachable are not opposites",
      "headline": "True and impeachable are not opposites",
      "body": "Every word can be accurate and the page can still destroy you. “The reconstructionist plaintiff’s firms trust” is documentary proof, published by you, that you serve one side of the bar — read aloud at deposition, it’s the whole bias case in a single line. “Never excluded” invites a question you’ll dread: is your job to survive challenges, or to tell the truth? And a nine-field specialty list is an open invitation to exactly the out-of-lane engagements that got you in trouble two minutes ago. Your marketing is discoverable and impeachable. Write it as if under oath.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/fb-3a.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 41.36,
        "captions": [
          {
            "start": 0,
            "end": 4.55,
            "text": "Every word can be accurate and the page can still destroy you."
          },
          {
            "start": 4.55,
            "end": 10.95,
            "text": "“The reconstructionist plaintiff’s firms trust” is documentary proof, published by you,"
          },
          {
            "start": 10.95,
            "end": 15.5,
            "text": "that you serve one side of the bar — read aloud at deposition,"
          },
          {
            "start": 15.5,
            "end": 18.59,
            "text": "it’s the whole bias case in a single line."
          },
          {
            "start": 18.59,
            "end": 22.19,
            "text": "“Never excluded” invites a question you’ll dread:"
          },
          {
            "start": 22.19,
            "end": 26.3,
            "text": "is your job to survive challenges, or to tell the truth?"
          },
          {
            "start": 26.3,
            "end": 31.3,
            "text": "And a nine-field specialty list is an open invitation to exactly the"
          },
          {
            "start": 31.3,
            "end": 36,
            "text": "out-of-lane engagements that got you in trouble two minutes ago."
          },
          {
            "start": 36,
            "end": 39.45,
            "text": "Your marketing is discoverable and impeachable."
          },
          {
            "start": 39.45,
            "end": 41.36,
            "text": "Write it as if under oath."
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
      "label": "D3 · B — rewrite it (correct)",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "consequence": "Correct",
      "headline": "Correct",
      "continueLabel": "Continue",
      "media": {
        "provider": "placeholder",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
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
      "label": "D3 · C — take the site down",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "consequence": "You’d solve one problem by creating two",
      "headline": "You’d solve one problem by creating two",
      "body": "Lawyers doing diligence search your name before they call — that’s how Prieto found you. Disappearing makes you harder to retain and does nothing about the archived copies, the directory profiles, and the conference abstracts still out there. And there’s a timing problem you may not have considered: taking your site down after being retained looks like concealment, and it’s the sort of thing that gets asked about. The answer isn’t invisibility. It’s a page that’s still true when it’s read back to you in four years.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/fb-3c.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 33.96,
        "captions": [
          {
            "start": 0,
            "end": 5.83,
            "text": "Lawyers doing diligence search your name before they call — that’s how Prieto found you."
          },
          {
            "start": 5.83,
            "end": 11.32,
            "text": "Disappearing makes you harder to retain and does nothing about the archived copies,"
          },
          {
            "start": 11.32,
            "end": 15.89,
            "text": "the directory profiles, and the conference abstracts still out there."
          },
          {
            "start": 15.89,
            "end": 19.66,
            "text": "And there’s a timing problem you may not have considered:"
          },
          {
            "start": 19.66,
            "end": 24.03,
            "text": "taking your site down after being retained looks like concealment,"
          },
          {
            "start": 24.03,
            "end": 27.27,
            "text": "and it’s the sort of thing that gets asked about."
          },
          {
            "start": 27.27,
            "end": 29.26,
            "text": "The answer isn’t invisibility."
          },
          {
            "start": 29.26,
            "end": 33.96,
            "text": "It’s a page that’s still true when it’s read back to you in four years."
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
      "label": "D3 · D — add defense-side testimonials",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "consequence": "Testimonials are the problem, not the imbalance",
      "headline": "Testimonials are the problem, not the imbalance",
      "body": "A client testimonial praising you is, by its nature, someone saying you helped them get a result — which is precisely the impression you cannot afford to create. Adding defense-side ones doubles the exhibits rather than neutralizing them. Neutrality doesn’t come from collecting endorsements from both sides; it comes from making no outcome claims at all and saying plainly that you’re retained by both.",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/fb-3d.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 27.88,
        "captions": [
          {
            "start": 0,
            "end": 3.64,
            "text": "A client testimonial praising you is, by its nature,"
          },
          {
            "start": 3.64,
            "end": 6.65,
            "text": "someone saying you helped them get a result"
          },
          {
            "start": 6.65,
            "end": 11.14,
            "text": "— which is precisely the impression you cannot afford to create."
          },
          {
            "start": 11.14,
            "end": 16.46,
            "text": "Adding defense-side ones doubles the exhibits rather than neutralizing them."
          },
          {
            "start": 16.46,
            "end": 21.3,
            "text": "Neutrality doesn’t come from collecting endorsements from both sides;"
          },
          {
            "start": 21.3,
            "end": 27.88,
            "text": "it comes from making no outcome claims at all and saying plainly that you’re retained by both."
          }
        ]
      },
      "next": "rejoin-3"
    },
    "rejoin-3": {
      "id": "rejoin-3",
      "type": "narrative",
      "role": "continuation",
      "label": "Marketing is subtractive",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "All paths rejoin · On screen",
      "headline": "Marketing for experts is subtractive. Say less, say it precisely.",
      "subhead": "The rewritten profile — “Independent vehicle collision reconstruction. Twenty-two years, including [X] years in state police crash reconstruction. Current certifications: [listed, with dates]. Representative engagements: highway departure and rollover dynamics, heavy-truck impact sequencing, low-speed impact analysis. Retained by plaintiff and defense counsel. Conflicts check: [contact].”",
      "body": "Nothing on that page can be used against you, because it claims only what’s true and it claims nothing about outcomes. That’s the standard. And remember what marketing is actually for in this business. It isn’t volume. The dominant channel is referral — from other lawyers, from experts who are conflicted out or too busy, from counsel you did honest work for. Everything else exists so that a serious lawyer doing diligence can quickly confirm three things: you have genuine expertise in a defined area, you’re comfortable in the litigation process, and you’re measured enough not to blow up on the stand. One well-matched engagement from a firm that trusts you beats a hundred inquiries from matters outside your lane.",
      "continueLabel": "See the resolution",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/rejoin-3.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 48.92,
        "captions": [
          {
            "start": 0,
            "end": 3.11,
            "text": "Nothing on that page can be used against you,"
          },
          {
            "start": 3.11,
            "end": 8.1,
            "text": "because it claims only what’s true and it claims nothing about outcomes."
          },
          {
            "start": 8.1,
            "end": 9.48,
            "text": "That’s the standard."
          },
          {
            "start": 9.48,
            "end": 13.7,
            "text": "And remember what marketing is actually for in this business."
          },
          {
            "start": 13.7,
            "end": 14.81,
            "text": "It isn’t volume."
          },
          {
            "start": 14.81,
            "end": 18.54,
            "text": "The dominant channel is referral — from other lawyers,"
          },
          {
            "start": 18.54,
            "end": 24.49,
            "text": "from experts who are conflicted out or too busy, from counsel you did honest work for."
          },
          {
            "start": 24.49,
            "end": 27.75,
            "text": "Everything else exists so that a serious lawyer"
          },
          {
            "start": 27.75,
            "end": 31.14,
            "text": "doing diligence can quickly confirm three things:"
          },
          {
            "start": 31.14,
            "end": 34.25,
            "text": "you have genuine expertise in a defined area,"
          },
          {
            "start": 34.25,
            "end": 37.36,
            "text": "you’re comfortable in the litigation process,"
          },
          {
            "start": 37.36,
            "end": 41.17,
            "text": "and you’re measured enough not to blow up on the stand."
          },
          {
            "start": 41.17,
            "end": 44.98,
            "text": "One well-matched engagement from a firm that trusts you"
          },
          {
            "start": 44.98,
            "end": 48.92,
            "text": "beats a hundred inquiries from matters outside your lane."
          }
        ]
      },
      "next": "resolution-1"
    },
    "resolution-1": {
      "id": "resolution-1",
      "type": "narrative",
      "role": "resolution",
      "label": "The engagement, as scoped",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "The resolution · On screen",
      "headline": "The engagement, as scoped",
      "body": "Here’s how the first two weeks go. You take the vehicle dynamics and the occupant question, in writing, with the boundary stated on the page. You decline the terminal design opinion and give Prieto the names of two people who actually do that work — which costs you nothing and buys you a referral relationship with both of them. Then you examine the restraint evidence the way you’d examine it for anybody.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/resolution-1.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 28.52,
        "captions": [
          {
            "start": 0,
            "end": 2.42,
            "text": "Here’s how the first two weeks go."
          },
          {
            "start": 2.42,
            "end": 6.4,
            "text": "You take the vehicle dynamics and the occupant question,"
          },
          {
            "start": 6.4,
            "end": 9.89,
            "text": "in writing, with the boundary stated on the page."
          },
          {
            "start": 9.89,
            "end": 13.8,
            "text": "You decline the terminal design opinion and give Prieto"
          },
          {
            "start": 13.8,
            "end": 17.28,
            "text": "the names of two people who actually do that work"
          },
          {
            "start": 17.28,
            "end": 23.04,
            "text": "— which costs you nothing and buys you a referral relationship with both of them."
          },
          {
            "start": 23.04,
            "end": 28.52,
            "text": "Then you examine the restraint evidence the way you’d examine it for anybody."
          }
        ]
      },
      "summaryCard": {
        "kicker": "On screen",
        "title": "Retained to address",
        "numbered": true,
        "items": [
          {
            "icon": "speed",
            "label": "Pre-departure speed"
          },
          {
            "icon": "angle",
            "label": "Departure angle and path"
          },
          {
            "icon": "sequence",
            "label": "Impact sequence and rollover dynamics"
          },
          {
            "icon": "occupant",
            "label": "Occupant kinematics and restraint use"
          }
        ],
        "takeaway": "NOT retained to address: guardrail end-terminal design or performance."
      },
      "next": "resolution-2"
    },
    "resolution-2": {
      "id": "resolution-2",
      "type": "narrative",
      "role": "resolution",
      "label": "The restraint evidence",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "On screen · Exhibit",
      "headline": "The restraint evidence",
      "body": "There’s a loaded webbing mark at the D-ring and corresponding hardware damage at the latch plate. The physical evidence indicates Marguerite Doss was restrained. That’s helpful to Prieto’s case — and the reason it’s worth anything is that you never promised it. If the evidence had run the other way, she’d have gotten that call in week two instead of finding out at your deposition. Which is the deal.",
      "continueLabel": "Continue",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/resolution-2.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 27.76,
        "captions": [
          {
            "start": 0,
            "end": 3.3,
            "text": "There’s a loaded webbing mark at the D-ring and"
          },
          {
            "start": 3.3,
            "end": 6.75,
            "text": "corresponding hardware damage at the latch plate."
          },
          {
            "start": 6.75,
            "end": 11.17,
            "text": "The physical evidence indicates Marguerite Doss was restrained."
          },
          {
            "start": 11.17,
            "end": 13.35,
            "text": "That’s helpful to Prieto’s case"
          },
          {
            "start": 13.35,
            "end": 18.06,
            "text": "— and the reason it’s worth anything is that you never promised it."
          },
          {
            "start": 18.06,
            "end": 20.73,
            "text": "If the evidence had run the other way,"
          },
          {
            "start": 20.73,
            "end": 26.49,
            "text": "she’d have gotten that call in week two instead of finding out at your deposition."
          },
          {
            "start": 26.49,
            "end": 27.76,
            "text": "Which is the deal."
          }
        ]
      },
      "evidence": [
        {
          "id": "dring-load-mark",
          "kind": "photo",
          "title": "Exhibit — macro photograph of a seat belt D-ring, a distinct load mark burnished into the webbing, scale card in frame",
          "caption": "Loaded webbing mark at the D-ring, with corresponding hardware damage at the latch plate."
        }
      ],
      "next": "resolution-3"
    },
    "resolution-3": {
      "id": "resolution-3",
      "type": "narrative",
      "role": "resolution",
      "label": "Same method. Different answer.",
      "layout": "avatar",
      "presenter": {
        "name": "Selena Navarro",
        "role": "Course Presenter"
      },
      "kicker": "On screen",
      "headline": "Same method. Different answer.",
      "subhead": "“Champions get discredited. Teachers get retained.”",
      "body": "Flip the hardware. No load mark, no latch plate damage, no restraint use indicated. You call Prieto, you tell her plainly, and you put it in the report. She may not enjoy the call. But her file is now built on something true, she can price the case honestly, and the next time she has a matter squarely in your lane, you’re the first number she dials — because you’re the expert who told her the bad news in week two. Same analysis. Same discipline. The answer changes on its own.",
      "continueLabel": "Continue to the next lessons",
      "media": {
        "provider": "file",
        "videoUrl": "/media/ew-01-av1-native/resolution-3.mp4",
        "posterUrl": "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
        "hasAudio": true,
        "loop": false,
        "durationSec": 34.44,
        "captions": [
          {
            "start": 0,
            "end": 1.32,
            "text": "Flip the hardware."
          },
          {
            "start": 1.32,
            "end": 6.01,
            "text": "No load mark, no latch plate damage, no restraint use indicated."
          },
          {
            "start": 6.01,
            "end": 10.99,
            "text": "You call Prieto, you tell her plainly, and you put it in the report."
          },
          {
            "start": 10.99,
            "end": 12.97,
            "text": "She may not enjoy the call."
          },
          {
            "start": 12.97,
            "end": 18.61,
            "text": "But her file is now built on something true, she can price the case honestly,"
          },
          {
            "start": 18.61,
            "end": 22.79,
            "text": "and the next time she has a matter squarely in your lane,"
          },
          {
            "start": 22.79,
            "end": 25.21,
            "text": "you’re the first number she dials"
          },
          {
            "start": 25.21,
            "end": 30.04,
            "text": "— because you’re the expert who told her the bad news in week two."
          },
          {
            "start": 30.04,
            "end": 31.07,
            "text": "Same analysis."
          },
          {
            "start": 31.07,
            "end": 32.24,
            "text": "Same discipline."
          },
          {
            "start": 32.24,
            "end": 34.44,
            "text": "The answer changes on its own."
          }
        ]
      },
      "next": null
    }
  }
} as Lesson;
