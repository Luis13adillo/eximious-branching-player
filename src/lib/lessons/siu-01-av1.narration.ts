/**
 * siu-01 · Application Video 1 — narration + caption data (DERIVED)
 * ============================================================================
 * GENERATED FILE — do not hand-edit the narration strings.
 *
 * `text` is the VERBATIM narration from the authoritative SIU-01 pilot script
 * (docs/source/pilot-scripts.pdf, pp. 5-9). It was sliced out of the PDF text
 * layer by anchor, never retyped, and cross-checked between two independent
 * `pdftotext` extractions (`-raw` and default) which agree character for
 * character.
 *
 * THREE LIGATURE REPAIRS. The script's BOLD face has no glyph mapping for the
 * "fi" ligature, so a text extraction renders it as the digit 0 at exactly
 * three sites. Each was confirmed against the rendered page before repair:
 *
 *   p7  "Outcome 0rst, facts second"  -> "Outcome first, facts second"   (cue)
 *   p7  "Which fact in this 0le"      -> "Which fact in this file"       (decision-2)
 *   p9  "The report was 0ne."         -> "The report was fine."          (cue)
 *
 * Only `decision-2` is narration; the other two are on-screen cue text carried
 * in the lesson data. No other digit in this script sits adjacent to a letter,
 * which is asserted by the extractor.
 *
 * `durationSec` is PROVISIONAL — characters / 16.24, Curtis `onyx`'s measured
 * rate (PRODUCTION_READINESS_COST_LOCK.md 4.2). No narration has been rendered
 * yet, so nothing here is measured. At Gate D these become the MEASURED mp4
 * lengths read from public/media/siu-01-av1/<id>.mp4.json -> split.video_dur_s,
 * exactly as claims-01 does, and the captions are regenerated against them.
 *
 * `captions` are DERIVED, not authored: every cue is a contiguous slice of the
 * verbatim text above, split on sentence boundaries (falling back to clause
 * boundaries inside an over-long sentence, and absorbing any runt shorter than
 * 35 characters into its neighbour). Cue timing is allocated in proportion to
 * character count. No words are added, cut, or reordered. The CUE TEXT is final
 * and reviewable now; only the numbers move at Gate D.
 *
 * Regenerate rather than edit. The unit tests assert that the concatenated cue
 * text reproduces the narration exactly, that the cues tile the duration, and
 * that each string still hashes to the `scriptSha256` recorded here.
 */

export interface NarrationSegment {
  /** Verbatim script line. Hashes to `scriptSha256`. */
  text: string;
  /** Character count of `text`. */
  scriptChars: number;
  /** sha256 of `text` — the tamper check until the audio sidecars exist. */
  scriptSha256: string;
  /**
   * MEASURED length of the delivered mp4, in seconds, read at Gate D from
   * public/media/siu-01-av1/<id>.mp4.json -> split.video_dur_s.
   *
   * The asset opens with 0.240 s of digital silence: segments are cut at the
   * midpoint of the inter-segment silence, not at the audio onset, so the
   * mouth is closed on the first and last frame. Caption cues below are
   * offset to match.
   */
  durationSec: number;
  /**
   * Full, LITERAL asset URL for the segment this scene will carry. Written out
   * in full rather than assembled from a base + id at runtime: a static bundler
   * (the Thinkific export) discovers package assets by finding literal URLs in
   * the built output, so a concatenated path would ship a package with no media
   * in it. Nothing exists at these paths yet — see MEDIA_DELIVERED.
   */
  videoUrl: string;
  /** Derived caption cues covering the whole segment. */
  captions: { start: number; end: number; text: string }[];
}

/** Media directory for this application video's delivered assets. */
export const SIU_01_AV1_MEDIA = "/media/siu-01-av1";

/**
 * TRUE since Gate D (2026-08-21): all 22 segments are on disk and QA-passed.
 * While it is false the lesson binds
 * every scene to the placeholder stage and Curtis's approved production still
 * instead of requesting an mp4 that is not on disk, so the lesson is fully
 * playable and reviewable at Gate 0 with no media spend.
 */
export const MEDIA_DELIVERED = true;

/** sha256 of every narration string joined by "\n", in script order. */
export const NARRATION_SHA256 =
  "1102791e0ee913baaf1c78c3e6cb5de47cbdba17b71f6a6b81d9f42d42502555";

export const NARRATION = {
  "intro": {
    text:
      "You’ve read the first three lessons. Now let’s find out if it stuck. I’m handing you a live file and you’re making the calls. Pause when I ask.",
    scriptChars: 143,
    scriptSha256: "fd9389706bea6b482a5d69fc97bfac77241a16025801cb1d08f34d3af2f1787c",
    durationSec: 8.8,
    videoUrl: "/media/siu-01-av1/intro.mp4",
    captions: [
      { start: 0, end: 2.333, text: "You’ve read the first three lessons." },
      { start: 2.333, end: 8.8, text: "Now let’s find out if it stuck. I’m handing you a live file and you’re making the calls. Pause when I ask." },
    ],
  },
  "assignment-1": {
    text:
      "Claim AU-8830471. Insured: Marcus Delacroix, 34, warehouse supervisor, Toledo, Ohio. He reports his 2019 Ram 1500 stolen overnight from his apartment complex lot — last seen 11 p.m. March 3, discovered gone 6:40 a.m. March 4. Police report filed March 4 at 8:15 a.m., case number on file. The numbers: loan balance $31,400. ACV runs about $26,800. He is upside down roughly $4,600 and two payments behind. Comprehensive coverage was added to the policy January 14 — seven weeks before the loss.",
    scriptChars: 494,
    scriptSha256: "874173fc1130622e5f3fee59bc4c3c6b0e6d252b579d2e0e9421c3a13d448a9e",
    durationSec: 38.8,
    videoUrl: "/media/siu-01-av1/assignment-1.mp4",
    captions: [
      { start: 0, end: 6.825, text: "Claim AU-8830471. Insured: Marcus Delacroix, 34, warehouse supervisor, Toledo, Ohio." },
      { start: 6.825, end: 12.94, text: "He reports his 2019 Ram 1500 stolen overnight from his apartment complex lot —" },
      { start: 12.94, end: 17.722, text: "last seen 11 p.m. March 3, discovered gone 6:40 a.m. March 4." },
      { start: 17.722, end: 22.582, text: "Police report filed March 4 at 8:15 a.m., case number on file." },
      { start: 22.582, end: 27.129, text: "The numbers: loan balance $31,400. ACV runs about $26,800." },
      { start: 27.129, end: 31.597, text: "He is upside down roughly $4,600 and two payments behind." },
      { start: 31.597, end: 38.8, text: "Comprehensive coverage was added to the policy January 14 — seven weeks before the loss." },
    ],
  },
  "assignment-2": {
    text:
      "That’s how it landed on your desk. The referring adjuster, eight months in the job, has already written the ending. March 9, the truck turns up burned to the frame in a drainage cut off a county road eleven miles from the apartment. In his recorded statement Marcus says both keys have been in his kitchen drawer the whole time. Three problems in one file. Let’s work them.",
    scriptChars: 373,
    scriptSha256: "cc592ad4f136d0103a63def432898cfd5a8d8b3de387527a6293fca9d1f07324",
    durationSec: 24.04,
    videoUrl: "/media/siu-01-av1/assignment-2.mp4",
    captions: [
      { start: 0, end: 7.543, text: "That’s how it landed on your desk. The referring adjuster, eight months in the job, has already written the ending." },
      { start: 7.543, end: 14.909, text: "March 9, the truck turns up burned to the frame in a drainage cut off a county road eleven miles from the apartment." },
      { start: 14.909, end: 20.942, text: "In his recorded statement Marcus says both keys have been in his kitchen drawer the whole time." },
      { start: 20.942, end: 24.04, text: "Three problems in one file. Let’s work them." },
    ],
  },
  "decision-1": {
    text:
      "On this referral, what is your actual job?",
    scriptChars: 42,
    scriptSha256: "bf8a4dc31268a6ec9a85d741025c240de9e5e1bea1ffbe283d1e496bc96311dd",
    durationSec: 3.08,
    videoUrl: "/media/siu-01-av1/decision-1.mp4",
    captions: [
      { start: 0, end: 3.08, text: "On this referral, what is your actual job?" },
    ],
  },
  "fb-1a": {
    text:
      "That is not your determination to make, and reaching for it is the single misconception that ends SIU careers. You are a private employee of a private company. You have no badge, no arrest power, no subpoena, and no authority to compel Marcus to say one word to you. Whether he burned that truck is a question for a prosecutor to charge and a court to decide. The moment you frame your job as “catching the liar,” every step after that bends toward the conclusion you already picked — and a plaintiff’s attorney will read your file out loud, in order, to show exactly when you stopped investigating and started building a case.",
    scriptChars: 627,
    scriptSha256: "86d8d315bb1abee8d5dfa273d17ad148b1391197c37bdb95eba6230d4f204b31",
    durationSec: 39.76,
    videoUrl: "/media/siu-01-av1/fb-1a.mp4",
    captions: [
      { start: 0, end: 2.711, text: "That is not your determination to make," },
      { start: 2.711, end: 7.146, text: "and reaching for it is the single misconception that ends SIU careers." },
      { start: 7.146, end: 10.187, text: "You are a private employee of a private company." },
      { start: 10.187, end: 13.228, text: "You have no badge, no arrest power, no subpoena," },
      { start: 13.228, end: 16.839, text: "and no authority to compel Marcus to say one word to you." },
      { start: 16.839, end: 22.667, text: "Whether he burned that truck is a question for a prosecutor to charge and a court to decide." },
      { start: 22.667, end: 30.523, text: "The moment you frame your job as “catching the liar,” every step after that bends toward the conclusion you already picked —" },
      { start: 30.523, end: 34.704, text: "and a plaintiff’s attorney will read your file out loud, in order," },
      { start: 34.704, end: 39.76, text: "to show exactly when you stopped investigating and started building a case." },
    ],
  },
  "fb-1c": {
    text:
      "Being underwater on a loan is a motive indicator. It is not a coverage defense and it is not evidence of anything. Half the trucks on the road are worth less than what’s owed on them. If “he’d have profited” were enough to deny, you’d deny most total losses in the country. And notice the structural problem you just created for yourself: you’re now looking for one kind of fact and not the other. That’s the definition of a one-sided investigation, and it’s how a $26,800 claim becomes a bad-faith verdict with a comma you didn’t plan for.",
    scriptChars: 540,
    scriptSha256: "4b8f1f098684e71558fd350031657e75c5f27c372813776e08f49d7c6cfa4c77",
    durationSec: 34.92,
    videoUrl: "/media/siu-01-av1/fb-1c.mp4",
    captions: [
      { start: 0, end: 3.402, text: "Being underwater on a loan is a motive indicator." },
      { start: 3.402, end: 7.531, text: "It is not a coverage defense and it is not evidence of anything." },
      { start: 7.531, end: 11.919, text: "Half the trucks on the road are worth less than what’s owed on them." },
      { start: 11.919, end: 17.662, text: "If “he’d have profited” were enough to deny, you’d deny most total losses in the country." },
      { start: 17.662, end: 21.791, text: "And notice the structural problem you just created for yourself:" },
      { start: 21.791, end: 25.534, text: "you’re now looking for one kind of fact and not the other." },
      { start: 25.534, end: 28.825, text: "That’s the definition of a one-sided investigation," },
      { start: 28.825, end: 34.92, text: "and it’s how a $26,800 claim becomes a bad-faith verdict with a comma you didn’t plan for." },
    ],
  },
  "fb-1d": {
    text:
      "An SIU referral does not pause the claim clock. The adjuster’s note says “on hold pending SIU,” and that sentence is a compliance problem the day it’s written. Your state’s unfair-claims-practices rules impose handling timeframes that keep running whether or not you have an open file. There may be a lawful basis to extend — documented, articulated, usually with counsel’s input — but “SIU is looking at it” is not that basis by itself. The same Department of Insurance that wants your fraud report enforces those handling rules against you.",
    scriptChars: 542,
    scriptSha256: "77fbe729582b03590bf48a383c4141d403e791106bf61d8076731b450718e573",
    durationSec: 33.12,
    videoUrl: "/media/siu-01-av1/fb-1d.mp4",
    captions: [
      { start: 0, end: 3.118, text: "An SIU referral does not pause the claim clock." },
      { start: 3.118, end: 9.914, text: "The adjuster’s note says “on hold pending SIU,” and that sentence is a compliance problem the day it’s written." },
      { start: 9.914, end: 17.568, text: "Your state’s unfair-claims-practices rules impose handling timeframes that keep running whether or not you have an open file." },
      { start: 17.568, end: 23.385, text: "There may be a lawful basis to extend — documented, articulated, usually with counsel’s input —" },
      { start: 23.385, end: 26.752, text: "but “SIU is looking at it” is not that basis by itself." },
      { start: 26.752, end: 33.12, text: "The same Department of Insurance that wants your fraud report enforces those handling rules against you." },
    ],
  },
  "rejoin-1": {
    text:
      "That’s the sentence to keep in front of you on every file. Prosecutors decide crimes. Courts decide guilt. Fraud bureaus decide whether to open a case. Claims decides whether to pay. You develop and hand off facts — accurately, neutrally, on the record. And it tells you exactly what to do in the next hour. Call the adjuster. Thank her for flagging it, because the marginal referrals are where real fraud hides and you need her to keep sending them. Then reset two things: walk me through what you actually saw, not what you think it means — and the claim goes back on its normal timeline unless legal tells us otherwise. If I find something reportable, I’ll route it. If it clears, I’ll tell you that too, and that’s a good outcome, not a wasted one.",
    scriptChars: 752,
    scriptSha256: "da04066bd9747f4cd01549457a3b9279a694ab81b8610fbf52d6fb2b41035e39",
    durationSec: 47.04,
    videoUrl: "/media/siu-01-av1/rejoin-1.mp4",
    captions: [
      { start: 0, end: 3.874, text: "That’s the sentence to keep in front of you on every file." },
      { start: 3.874, end: 6.818, text: "Prosecutors decide crimes. Courts decide guilt." },
      { start: 6.818, end: 9.575, text: "Fraud bureaus decide whether to open a case." },
      { start: 9.575, end: 15.903, text: "Claims decides whether to pay. You develop and hand off facts — accurately, neutrally, on the record." },
      { start: 15.903, end: 19.224, text: "And it tells you exactly what to do in the next hour." },
      { start: 19.224, end: 22.043, text: "Call the adjuster. Thank her for flagging it," },
      { start: 22.043, end: 28.058, text: "because the marginal referrals are where real fraud hides and you need her to keep sending them." },
      { start: 28.058, end: 33.759, text: "Then reset two things: walk me through what you actually saw, not what you think it means —" },
      { start: 33.759, end: 38.709, text: "and the claim goes back on its normal timeline unless legal tells us otherwise." },
      { start: 38.709, end: 41.591, text: "If I find something reportable, I’ll route it." },
      { start: 41.591, end: 47.04, text: "If it clears, I’ll tell you that too, and that’s a good outcome, not a wasted one." },
    ],
  },
  "decision-2": {
    text:
      "March 9, the cause-and-origin report lands: incendiary, gasoline pour pattern across the front seats, no electrical or mechanical failure. Which fact in this file speaks most directly to the elements a prosecutor would have to prove?",
    scriptChars: 233,
    scriptSha256: "c668a2c524f97ffee6970b48c01ff22210289b89f90771a0d0430ab4ccdbd884",
    durationSec: 15.32,
    videoUrl: "/media/siu-01-av1/decision-2.mp4",
    captions: [
      { start: 0, end: 3.76, text: "March 9, the cause-and-origin report lands: incendiary," },
      { start: 3.76, end: 9.008, text: "gasoline pour pattern across the front seats, no electrical or mechanical failure." },
      { start: 9.008, end: 15.32, text: "Which fact in this file speaks most directly to the elements a prosecutor would have to prove?" },
    ],
  },
  "fb-2a": {
    text:
      "Look at what the statute actually requires: a knowing, material misrepresentation made with intent to obtain a benefit. Financial pressure is none of those. It’s a reason to look harder — a prompt, nothing more. Write “insured was $4,600 upside down” in your file and it belongs there as a documented fact. Write “insured had a financial motive to burn the truck” and you’ve converted a bank balance into an accusation with no bridge in between. That’s the leap that reads terribly in a deposition.",
    scriptChars: 498,
    scriptSha256: "6e0013a2d98edb21c78b36c3fdbaefeba8a56ed7a7d0acf70d63ad30541c6c76",
    durationSec: 32.36,
    videoUrl: "/media/siu-01-av1/fb-2a.mp4",
    captions: [
      { start: 0, end: 3.73, text: "Look at what the statute actually requires: a knowing," },
      { start: 3.73, end: 7.867, text: "material misrepresentation made with intent to obtain a benefit." },
      { start: 7.867, end: 10.194, text: "Financial pressure is none of those." },
      { start: 10.194, end: 13.684, text: "It’s a reason to look harder — a prompt, nothing more." },
      { start: 13.684, end: 19.76, text: "Write “insured was $4,600 upside down” in your file and it belongs there as a documented fact." },
      { start: 19.76, end: 28.679, text: "Write “insured had a financial motive to burn the truck” and you’ve converted a bank balance into an accusation with no bridge in between." },
      { start: 28.679, end: 32.36, text: "That’s the leap that reads terribly in a deposition." },
    ],
  },
  "fb-2b": {
    text:
      "Recent coverage changes are worth documenting and worth explaining. But adding comprehensive coverage is a lawful act that thousands of people do every week — after a friend’s car gets broken into, after a raise, after a lender demands it. Ask yourself which element it proves. It proves none of them. It’s the kind of fact that belongs in a pattern, sitting alongside others, and never carries a file by itself.",
    scriptChars: 412,
    scriptSha256: "a66e5334613c4fd1fc745f99922b2fd7d6fe3df8a36bfa26dfd77fee2259f739",
    durationSec: 26.32,
    videoUrl: "/media/siu-01-av1/fb-2b.mp4",
    captions: [
      { start: 0, end: 4.483, text: "Recent coverage changes are worth documenting and worth explaining." },
      { start: 4.483, end: 10.183, text: "But adding comprehensive coverage is a lawful act that thousands of people do every week —" },
      { start: 10.183, end: 15.25, text: "after a friend’s car gets broken into, after a raise, after a lender demands it." },
      { start: 15.25, end: 17.593, text: "Ask yourself which element it proves." },
      { start: 17.593, end: 23.799, text: "It proves none of them. It’s the kind of fact that belongs in a pattern, sitting alongside others," },
      { start: 23.799, end: 26.32, text: "and never carries a file by itself." },
    ],
  },
  "fb-2d": {
    text:
      "Yes — the origin report establishes that someone set that fire. That’s real, corroborated, technical evidence, and it’s the strongest thing in your file. But arson by a person unknown is a stolen-vehicle claim that ends in a fire, which is a covered loss. The origin report tells you a crime happened. It says nothing about who, and nothing about whether this insured knowingly made a false statement. Don’t let strong evidence of one thing get quietly promoted into evidence of a different thing.",
    scriptChars: 497,
    scriptSha256: "6aca7b3727d20f1595c4287e7b5c572674064f948910d57d8babb4b6e9c32e87",
    durationSec: 31.16,
    videoUrl: "/media/siu-01-av1/fb-2d.mp4",
    captions: [
      { start: 0, end: 4.158, text: "Yes — the origin report establishes that someone set that fire." },
      { start: 4.158, end: 9.694, text: "That’s real, corroborated, technical evidence, and it’s the strongest thing in your file." },
      { start: 9.694, end: 14.42, text: "But arson by a person unknown is a stolen-vehicle claim that ends in a fire," },
      { start: 14.42, end: 18.774, text: "which is a covered loss. The origin report tells you a crime happened." },
      { start: 18.774, end: 24.931, text: "It says nothing about who, and nothing about whether this insured knowingly made a false statement." },
      { start: 24.931, end: 31.16, text: "Don’t let strong evidence of one thing get quietly promoted into evidence of a different thing." },
    ],
  },
  "rejoin-2": {
    text:
      "That’s a statement by the insured that conflicts with independent physical evidence. It’s a specific assertion, it’s material to whether the loss occurred as described, and it was made by him — which is what gets you into the neighborhood of a knowing misrepresentation. Everything else in this file is background. This is the thing your investigation actually has to develop: get the key inventory from the dealer, get the module read if the burn allows it, document whether the truck could have been driven without a key present. Notice what you just did. You worked backward from the elements a prosecutor must prove to the facts your investigation has to develop. That connection is what turns a referral from an insult into an actionable document. Weak: “This is fraud, refer it.” Strong: “This claim contains a material representation that conflicts with the origin report and the vehicle’s condition; here is the evidence; referring to the Fraud Bureau.”",
    scriptChars: 961,
    scriptSha256: "c5efc61fcefde8f2b64b22aa2264d4dcca4e52e80acc9a625aa551c8731bc4d2",
    durationSec: 59.48,
    videoUrl: "/media/siu-01-av1/rejoin-2.mp4",
    captions: [
      { start: 0, end: 5.477, text: "That’s a statement by the insured that conflicts with independent physical evidence." },
      { start: 5.477, end: 10.652, text: "It’s a specific assertion, it’s material to whether the loss occurred as described," },
      { start: 10.652, end: 16.95, text: "and it was made by him — which is what gets you into the neighborhood of a knowing misrepresentation." },
      { start: 16.95, end: 19.631, text: "Everything else in this file is background." },
      { start: 19.631, end: 25.866, text: "This is the thing your investigation actually has to develop: get the key inventory from the dealer," },
      { start: 25.866, end: 28.484, text: "get the module read if the burn allows it," },
      { start: 28.484, end: 32.973, text: "document whether the truck could have been driven without a key present." },
      { start: 32.973, end: 41.391, text: "Notice what you just did. You worked backward from the elements a prosecutor must prove to the facts your investigation has to develop." },
      { start: 41.391, end: 46.628, text: "That connection is what turns a referral from an insult into an actionable document." },
      { start: 46.628, end: 49.122, text: "Weak: “This is fraud, refer it.” Strong:" },
      { start: 49.122, end: 56.167, text: "“This claim contains a material representation that conflicts with the origin report and the vehicle’s condition;" },
      { start: 56.167, end: 59.48, text: "here is the evidence; referring to the Fraud Bureau.”" },
    ],
  },
  "decision-3": {
    text:
      "Your state requires a report when you have reason to believe a claim is fraudulent, within the statutory window. What do you do?",
    scriptChars: 128,
    scriptSha256: "77a79f590f3eeed048c30bde1cec207e47d2d885aa70c0f44478e0aaf5a66bff",
    durationSec: 8.48,
    videoUrl: "/media/siu-01-av1/decision-3.mp4",
    captions: [
      { start: 0, end: 5.432, text: "Your state requires a report when you have reason to believe a claim is fraudulent," },
      { start: 5.432, end: 8.48, text: "within the statutory window. What do you do?" },
    ],
  },
  "fb-3a": {
    text:
      "The trigger is not proof. It’s reason to believe — reasonable suspicion supported by articulable facts. You have an incendiary origin report and an insured statement that conflicts with the physical evidence. That is well past a hunch. Waiting for certainty means the report is late, and a late report is a regulatory violation on your carrier’s record. Worse: the good-faith immunity that protects your report attaches to a timely filing through the proper channel. Wait for certainty and you lose the deadline and the shield. Reporting is not accusing. It’s routing.",
    scriptChars: 568,
    scriptSha256: "84473763cde0d5c1d9b4271b007356f0b26dc39d63f6590018b6aa383b663f49",
    durationSec: 36.12,
    videoUrl: "/media/siu-01-av1/fb-3a.mp4",
    captions: [
      { start: 0, end: 6.759, text: "The trigger is not proof. It’s reason to believe — reasonable suspicion supported by articulable facts." },
      { start: 6.759, end: 13.341, text: "You have an incendiary origin report and an insured statement that conflicts with the physical evidence." },
      { start: 13.341, end: 18.024, text: "That is well past a hunch. Waiting for certainty means the report is late," },
      { start: 18.024, end: 22.391, text: "and a late report is a regulatory violation on your carrier’s record." },
      { start: 22.391, end: 29.479, text: "Worse: the good-faith immunity that protects your report attaches to a timely filing through the proper channel." },
      { start: 29.479, end: 33.276, text: "Wait for certainty and you lose the deadline and the shield." },
      { start: 33.276, end: 36.12, text: "Reporting is not accusing. It’s routing." },
    ],
  },
  "fb-3c": {
    text:
      "Statutory immunity covers a good-faith report made to the proper authority. It does not cover you telling a lienholder and a property manager that your insured is suspected of arson. That’s a statement of criminal suspicion published to third parties with no need to know — the textbook shape of a defamation claim, and you gave it to them in writing. Keep suspicion inside the authorized circle: the bureau, your counsel, your unit, and the people in your company who must know to do their jobs. Nobody else. Ever.",
    scriptChars: 515,
    scriptSha256: "2d8fcbf96b6e537640e42dcf5d6fb600aa90deac1dabbb11f1498cecd7a8c140",
    durationSec: 32.56,
    videoUrl: "/media/siu-01-av1/fb-3c.mp4",
    captions: [
      { start: 0, end: 4.948, text: "Statutory immunity covers a good-faith report made to the proper authority." },
      { start: 4.948, end: 11.603, text: "It does not cover you telling a lienholder and a property manager that your insured is suspected of arson." },
      { start: 11.603, end: 17.252, text: "That’s a statement of criminal suspicion published to third parties with no need to know —" },
      { start: 17.252, end: 22.086, text: "the textbook shape of a defamation claim, and you gave it to them in writing." },
      { start: 22.086, end: 27.171, text: "Keep suspicion inside the authorized circle: the bureau, your counsel, your unit," },
      { start: 27.171, end: 32.56, text: "and the people in your company who must know to do their jobs. Nobody else. Ever." },
    ],
  },
  "fb-3d": {
    text:
      "The fraud bureau and the police are different bodies with different intake, different timelines, and different roles. Your mandatory duty runs to the destination your state’s code names, and immunity is generally tied to reporting to that designated authority. Route it there. The bureau reviews it, decides whether to investigate, and coordinates with prosecutors — that’s their function, not yours. If there’s an active-crime element that needs local law enforcement, that goes through your carrier’s protocol, not a cold call from you.",
    scriptChars: 538,
    scriptSha256: "c088a036193f9aa0f4f32fe04e62a50687364fdf933da356209f996b23ac06fe",
    durationSec: 33.96,
    videoUrl: "/media/siu-01-av1/fb-3d.mp4",
    captions: [
      { start: 0, end: 6.273, text: "The fraud bureau and the police are different bodies with different intake, different timelines," },
      { start: 6.273, end: 11.866, text: "and different roles. Your mandatory duty runs to the destination your state’s code names," },
      { start: 11.866, end: 16.453, text: "and immunity is generally tied to reporting to that designated authority." },
      { start: 16.453, end: 20.852, text: "Route it there. The bureau reviews it, decides whether to investigate," },
      { start: 20.852, end: 25.125, text: "and coordinates with prosecutors — that’s their function, not yours." },
      { start: 25.125, end: 29.399, text: "If there’s an active-crime element that needs local law enforcement," },
      { start: 29.399, end: 33.96, text: "that goes through your carrier’s protocol, not a cold call from you." },
    ],
  },
  "rejoin-3": {
    text:
      "This is the separation that new investigators collapse and regret. You can be legally required to report while having nothing close to grounds to deny. Both things are true on this file today. File the report, on the bureau’s form, through the bureau’s channel, inside the window — facts and sources, no verdict — and retain confirmation of the filing with the date. Then log it: what you filed, when, to whom, and where the confirmation lives.",
    scriptChars: 444,
    scriptSha256: "a752826873bc1bcc522c0ed24d937576a1667b3ae00c22f907cc2b1135c876b4",
    durationSec: 27.88,
    videoUrl: "/media/siu-01-av1/rejoin-3.mp4",
    captions: [
      { start: 0, end: 4.35, text: "This is the separation that new investigators collapse and regret." },
      { start: 4.35, end: 9.58, text: "You can be legally required to report while having nothing close to grounds to deny." },
      { start: 9.58, end: 12.071, text: "Both things are true on this file today." },
      { start: 12.071, end: 17.551, text: "File the report, on the bureau’s form, through the bureau’s channel, inside the window —" },
      { start: 17.551, end: 22.781, text: "facts and sources, no verdict — and retain confirmation of the filing with the date." },
      { start: 22.781, end: 27.88, text: "Then log it: what you filed, when, to whom, and where the confirmation lives." },
    ],
  },
  "resolution-1": {
    text:
      "There it is. A third key, programmed six weeks before the loss, that his statement never mentioned. Now you have an independent, dated, third-party record that speaks directly to a specific representation he made under his own name. Not a feeling. Not a bank balance. A document with a signature on it.",
    scriptChars: 302,
    scriptSha256: "2a7c99094777c4bea04429ec2bcf58a3ec0ac33bd33235280da2f82a57b41377",
    durationSec: 19.2,
    videoUrl: "/media/siu-01-av1/resolution-1.mp4",
    captions: [
      { start: 0, end: 6.422, text: "There it is. A third key, programmed six weeks before the loss, that his statement never mentioned." },
      { start: 6.422, end: 8.608, text: "Now you have an independent, dated," },
      { start: 8.608, end: 14.603, text: "third-party record that speaks directly to a specific representation he made under his own name." },
      { start: 14.603, end: 19.2, text: "Not a feeling. Not a bank balance. A document with a signature on it." },
    ],
  },
  "resolution-2": {
    text:
      "That’s the file. Every action dated the day you took it. Every fact sourced. The exculpatory items in there too — the police report showing a second vehicle burned in the same drainage cut that month, the neighbor who saw nothing. Your opinions in the analysis section, labeled as opinions, tied to evidence.",
    scriptChars: 308,
    scriptSha256: "ff83d5a4d40e281a97193bbc6c0ffc3b11c0948cc4bdac7dd112e49cb13a7a15",
    durationSec: 19.56,
    videoUrl: "/media/siu-01-av1/resolution-2.mp4",
    captions: [
      { start: 0, end: 3.73, text: "That’s the file. Every action dated the day you took it." },
      { start: 3.73, end: 7.22, text: "Every fact sourced. The exculpatory items in there too —" },
      { start: 7.22, end: 12.58, text: "the police report showing a second vehicle burned in the same drainage cut that month," },
      { start: 12.58, end: 19.56, text: "the neighbor who saw nothing. Your opinions in the analysis section, labeled as opinions, tied to evidence." },
    ],
  },
  "resolution-3": {
    text:
      "That’s the test. If yes, you’ve done the job.",
    scriptChars: 45,
    scriptSha256: "93795a483cd7c36cc13d4ad0c165b632bb880b4fef00807b608a88ba4e0fd0a3",
    durationSec: 3.08,
    videoUrl: "/media/siu-01-av1/resolution-3.mp4",
    captions: [
      { start: 0, end: 3.08, text: "That’s the test. If yes, you’ve done the job." },
    ],
  },
  "resolution-4": {
    text:
      "Flip one fact — the dealer record shows two keys, both accounted for, and the module read confirms a relay-attack entry consistent with a professional theft ring the NICB is already tracking. The identical investigation now clears Marcus Delacroix completely, pays the claim, and feeds the bureau something genuinely useful. The answer changed. The method didn’t.",
    scriptChars: 363,
    scriptSha256: "b39e2d98915367719786f5e8b891714497a6333fb99c4656c08f834e225065ce",
    durationSec: 23.2,
    videoUrl: "/media/siu-01-av1/resolution-4.mp4",
    captions: [
      { start: 0, end: 4.594, text: "Flip one fact — the dealer record shows two keys, both accounted for," },
      { start: 4.594, end: 12.231, text: "and the module read confirms a relay-attack entry consistent with a professional theft ring the NICB is already tracking." },
      { start: 12.231, end: 17.469, text: "The identical investigation now clears Marcus Delacroix completely, pays the claim," },
      { start: 17.469, end: 20.498, text: "and feeds the bureau something genuinely useful." },
      { start: 20.498, end: 23.2, text: "The answer changed. The method didn’t." },
    ],
  },
} as const satisfies Record<string, NarrationSegment>;

export type NarrationId = keyof typeof NARRATION;

/** Script order — the order the segments appear in the pilot script. */
export const NARRATION_ORDER = Object.keys(NARRATION) as NarrationId[];
