/**
 * claims-01 · Application Video 1 — narration + caption data (DERIVED)
 * ============================================================================
 * GENERATED FILE — do not hand-edit the narration strings.
 *
 * `text` is the VERBATIM narration from the authoritative CLAIMS-01 pilot
 * script (docs/source/pilot-scripts.pdf, pp. 1-5). Each string is byte-exact
 * against the `script_sha256` recorded in the delivered audio sidecar
 * (public/media/claims-01-av1/<id>.json) — i.e. it is exactly what Diane says.
 *
 * `durationSec` is the MEASURED length of the delivered mp4, read from
 * <id>.mp4.json -> split.video_dur_s. Not an estimate.
 *
 * `captions` are DERIVED, not authored: every cue is a contiguous slice of the
 * verbatim text above, and cue timing is allocated in proportion to character
 * count across the measured duration. No words are added, cut, or reordered.
 *
 * Regenerate rather than edit. The unit tests assert that the concatenated cue
 * text reproduces the narration exactly and that the cues tile the duration.
 */

export interface NarrationSegment {
  /** Verbatim script line, byte-exact against the audio sidecar hash. */
  text: string;
  /** Measured duration of the delivered 1920x1080 mp4, in seconds. */
  durationSec: number;
  /**
   * Full, LITERAL asset URL. Written out in full rather than assembled from a
   * base + id at runtime: a static bundler (the Thinkific export) discovers
   * package assets by finding literal URLs in the built output, so a
   * concatenated path would ship a package with no media in it.
   */
  videoUrl: string;
  /** Derived caption cues covering the whole segment. */
  captions: { start: number; end: number; text: string }[];
}

/** Media directory for this application video's delivered assets. */
export const CLAIMS_01_AV1_MEDIA = "/media/claims-01-av1";

export const NARRATION = {
  "intro": {
    text:
      "You’ve read the first three lessons. Now let’s find out if it stuck. I’m handing you a live file and you’re making the calls. Pause when I ask.",
    durationSec: 8.88,
    videoUrl: "/media/claims-01-av1/intro.mp4",
    captions: [
      { start: 0.0, end: 4.25, text: "You’ve read the first three lessons. Now let’s find out if it stuck." },
      { start: 4.25, end: 8.88, text: "I’m handing you a live file and you’re making the calls. Pause when I ask." },
    ],
  },
  "assignment-1": {
    text:
      "Claim 4471-88203. Insured: Marcus Delaney, 41, owns a 2019 Ford F-250. Reports the truck stolen from a grocery store parking lot on the night of March 2. Vehicle recovered March 5, burned to the frame on a gravel access road eleven miles out of town. Actual cash value $38,400. Loan payoff $41,100 — he’s underwater by about twenty-seven hundred. The adjuster ran a routine file for nine days, then flagged it and sent it to you.",
    durationSec: 32.08,
    videoUrl: "/media/claims-01-av1/assignment-1.mp4",
    captions: [
      { start: 0.0, end: 5.3, text: "Claim 4471-88203. Insured: Marcus Delaney, 41, owns a 2019 Ford F-250." },
      { start: 5.3, end: 11.5, text: "Reports the truck stolen from a grocery store parking lot on the night of March 2." },
      { start: 11.5, end: 18.76, text: "Vehicle recovered March 5, burned to the frame on a gravel access road eleven miles out of town." },
      { start: 18.76, end: 20.73, text: "Actual cash value $38,400." },
      { start: 20.73, end: 25.87, text: "Loan payoff $41,100 — he’s underwater by about twenty-seven hundred." },
      { start: 25.87, end: 32.08, text: "The adjuster ran a routine file for nine days, then flagged it and sent it to you." },
    ],
  },
  "assignment-2": {
    text:
      "The desk file has three things in it: the FNOL, a two-page recovery report from the sheriff’s office, and a note from the adjuster that reads “something’s off here.”",
    durationSec: 10.32,
    videoUrl: "/media/claims-01-av1/assignment-2.mp4",
    captions: [
      { start: 0.0, end: 2.98, text: "The desk file has three things in it: the FNOL," },
      { start: 2.98, end: 6.34, text: "a two-page recovery report from the sheriff’s office," },
      { start: 6.34, end: 10.32, text: "and a note from the adjuster that reads “something’s off here.”" },
    ],
  },
  "decision-1": {
    text:
      "What moved this file out of routine adjustment and into investigation?",
    durationSec: 4.48,
    videoUrl: "/media/claims-01-av1/decision-1.mp4",
    captions: [
      { start: 0.0, end: 4.48, text: "What moved this file out of routine adjustment and into investigation?" },
    ],
  },
  "fb-1a": {
    text:
      "I understand the impulse — experienced adjusters develop a nose. But “something’s off” is not a fact, and it can’t be written into a file. Nine days from now a plaintiff’s lawyer is going to ask what specifically caused this claim to be treated differently from every other theft claim, and “she had a feeling” is the answer that ends careers. Instinct is a legitimate reason to look. It is never the documented basis for anything.",
    durationSec: 26.88,
    videoUrl: "/media/claims-01-av1/fb-1a.mp4",
    captions: [
      { start: 0.0, end: 4.05, text: "I understand the impulse — experienced adjusters develop a nose." },
      { start: 4.05, end: 8.67, text: "But “something’s off” is not a fact, and it can’t be written into a file." },
      { start: 8.67, end: 13.29, text: "Nine days from now a plaintiff’s lawyer is going to ask what specifically" },
      { start: 13.29, end: 17.91, text: "caused this claim to be treated differently from every other theft claim," },
      { start: 17.91, end: 21.45, text: "and “she had a feeling” is the answer that ends careers." },
      { start: 21.45, end: 23.98, text: "Instinct is a legitimate reason to look." },
      { start: 23.98, end: 26.88, text: "It is never the documented basis for anything." },
    ],
  },
  "fb-1b": {
    text:
      "Negative equity is worth noting. It is not what turns adjustment into investigation, and if you start there, you’ve decided the answer before you’ve gathered a fact. Plenty of people are underwater on trucks. Almost none of them burn them. Motive is a reason to investigate thoroughly — hold that thought, we come back to it in Decision 3 — but it isn’t the trigger, and building your file on it first is how confirmation bias gets baked in on day one.",
    durationSec: 28.4,
    videoUrl: "/media/claims-01-av1/fb-1b.mp4",
    captions: [
      { start: 0.0, end: 2.04, text: "Negative equity is worth noting." },
      { start: 2.04, end: 6.82, text: "It is not what turns adjustment into investigation, and if you start there," },
      { start: 6.82, end: 10.39, text: "you’ve decided the answer before you’ve gathered a fact." },
      { start: 10.39, end: 15.04, text: "Plenty of people are underwater on trucks. Almost none of them burn them." },
      { start: 15.04, end: 17.97, text: "Motive is a reason to investigate thoroughly —" },
      { start: 17.97, end: 23.0, text: "hold that thought, we come back to it in Decision 3 — but it isn’t the trigger," },
      { start: 23.0, end: 28.4, text: "and building your file on it first is how confirmation bias gets baked in on day one." },
    ],
  },
  "fb-1c": {
    text:
      "Some carriers do route by exposure, and that’s a workflow rule — it decides who gets the file, not what the file needs. Investigating a claim because it’s expensive is exactly the practice that shows up in bad-faith complaints. If a $6,000 version of this same claim came across your desk, the investigative question would be identical.",
    durationSec: 21.8,
    videoUrl: "/media/claims-01-av1/fb-1c.mp4",
    captions: [
      { start: 0.0, end: 4.22, text: "Some carriers do route by exposure, and that’s a workflow rule —" },
      { start: 4.22, end: 7.78, text: "it decides who gets the file, not what the file needs." },
      { start: 7.78, end: 11.4, text: "Investigating a claim because it’s expensive is exactly" },
      { start: 11.4, end: 14.76, text: "the practice that shows up in bad-faith complaints." },
      { start: 14.76, end: 18.78, text: "If a $6,000 version of this same claim came across your desk," },
      { start: 18.78, end: 21.8, text: "the investigative question would be identical." },
    ],
  },
  "rejoin-1a": {
    text:
      "That’s the line. Routine adjustment becomes investigation when facts, coverage, damages, or timing are genuinely in dispute — and here the central fact, was this vehicle stolen, is unresolved and unresolvable from what’s in the folder. That’s a documentable trigger. Write it that way in the activity log on day one: “Referred for investigation; cause of loss unestablished, no independent evidence of theft in file.” Now the whole investigation has a stated reason that a stranger can read.",
    durationSec: 30.44,
    videoUrl: "/media/claims-01-av1/rejoin-1a.mp4",
    captions: [
      { start: 0.0, end: 4.34, text: "That’s the line. Routine adjustment becomes investigation when facts," },
      { start: 4.34, end: 7.8, text: "coverage, damages, or timing are genuinely in dispute —" },
      { start: 7.8, end: 11.01, text: "and here the central fact, was this vehicle stolen," },
      { start: 11.01, end: 14.59, text: "is unresolved and unresolvable from what’s in the folder." },
      { start: 14.59, end: 16.48, text: "That’s a documentable trigger." },
      { start: 16.48, end: 21.39, text: "Write it that way in the activity log on day one: “Referred for investigation;" },
      { start: 21.39, end: 25.86, text: "cause of loss unestablished, no independent evidence of theft in file.”" },
      { start: 25.86, end: 30.44, text: "Now the whole investigation has a stated reason that a stranger can read." },
    ],
  },
  "rejoin-1b": {
    text:
      "And know your box. You’re the investigator. You develop facts. You are not the adjuster deciding payment, and you are not SIU running a fraud case. Escalate too fast and you’ve made an accusation you can’t support. Escalate too slow and you’ve sat on a file that needed a specialist.",
    durationSec: 17.68,
    videoUrl: "/media/claims-01-av1/rejoin-1b.mp4",
    captions: [
      { start: 0.0, end: 3.91, text: "And know your box. You’re the investigator. You develop facts." },
      { start: 3.91, end: 9.21, text: "You are not the adjuster deciding payment, and you are not SIU running a fraud case." },
      { start: 9.21, end: 13.38, text: "Escalate too fast and you’ve made an accusation you can’t support." },
      { start: 13.38, end: 17.68, text: "Escalate too slow and you’ve sat on a file that needed a specialist." },
    ],
  },
  "decision-2": {
    text:
      "You start heading toward a denial under the intentional-act exclusion. Who has the burden, and what does that change?",
    durationSec: 7.4,
    videoUrl: "/media/claims-01-av1/decision-2.mp4",
    captions: [
      { start: 0.0, end: 4.47, text: "You start heading toward a denial under the intentional-act exclusion." },
      { start: 4.47, end: 7.4, text: "Who has the burden, and what does that change?" },
    ],
  },
  "fb-2a": {
    text:
      "That’s half true and it’s the half that gets people hurt. Yes, the insured generally bears the burden of showing a covered peril caused the loss. But the second your theory becomes “yes, a fire occurred, but an exclusion carves it out,” the weight moves to the carrier. That’s you. Sitting back waiting for him to fail while you’re actually building an exclusion case is how a technically-defensible investigation turns into an indefensible denial. Re-run the burden question every time the live issue changes — not once at intake.",
    durationSec: 33.04,
    videoUrl: "/media/claims-01-av1/fb-2a.mp4",
    captions: [
      { start: 0.0, end: 3.59, text: "That’s half true and it’s the half that gets people hurt." },
      { start: 3.59, end: 9.07, text: "Yes, the insured generally bears the burden of showing a covered peril caused the loss." },
      { start: 9.07, end: 12.66, text: "But the second your theory becomes “yes, a fire occurred," },
      { start: 12.66, end: 17.51, text: "but an exclusion carves it out,” the weight moves to the carrier. That’s you." },
      { start: 17.51, end: 22.54, text: "Sitting back waiting for him to fail while you’re actually building an exclusion" },
      { start: 22.54, end: 27.89, text: "case is how a technically-defensible investigation turns into an indefensible denial." },
      { start: 27.89, end: 33.04, text: "Re-run the burden question every time the live issue changes — not once at intake." },
    ],
  },
  "fb-2c": {
    text:
      "The burden doesn’t switch on when a lawsuit is filed — it governs what your file has to contain right now, before anyone sues. Investigate as though there’s no burden until litigation and you’ll build a file that collapses the first time it’s read by anyone outside your office. And a denial issued from a file like that is the single most reliable way to generate the lawsuit you were assuming wouldn’t come.",
    durationSec: 25.76,
    videoUrl: "/media/claims-01-av1/fb-2c.mp4",
    captions: [
      { start: 0.0, end: 3.44, text: "The burden doesn’t switch on when a lawsuit is filed —" },
      { start: 3.44, end: 7.97, text: "it governs what your file has to contain right now, before anyone sues." },
      { start: 7.97, end: 12.62, text: "Investigate as though there’s no burden until litigation and you’ll build" },
      { start: 12.62, end: 17.53, text: "a file that collapses the first time it’s read by anyone outside your office." },
      { start: 17.53, end: 21.36, text: "And a denial issued from a file like that is the single most" },
      { start: 21.36, end: 25.76, text: "reliable way to generate the lawsuit you were assuming wouldn’t come." },
    ],
  },
  "fb-2d": {
    text:
      "Burden of proof is a legal allocation, not a scoring system. It doesn’t float toward whoever showed up with more paper. It’s assigned by the issue in dispute, and it determines who loses when the evidence is genuinely in equipoise. If the evidence is a coin flip on an exclusion, the carrier loses. Knowing that ahead of time is exactly why you name the burden before you conclude.",
    durationSec: 23.8,
    videoUrl: "/media/claims-01-av1/fb-2d.mp4",
    captions: [
      { start: 0.0, end: 3.8, text: "Burden of proof is a legal allocation, not a scoring system." },
      { start: 3.8, end: 7.47, text: "It doesn’t float toward whoever showed up with more paper." },
      { start: 7.47, end: 9.88, text: "It’s assigned by the issue in dispute," },
      { start: 9.88, end: 14.44, text: "and it determines who loses when the evidence is genuinely in equipoise." },
      { start: 14.44, end: 18.62, text: "If the evidence is a coin flip on an exclusion, the carrier loses." },
      { start: 18.62, end: 23.8, text: "Knowing that ahead of time is exactly why you name the burden before you conclude." },
    ],
  },
  "rejoin-2": {
    text:
      "Run the chain out loud on this file. Issue: does the intentional-act exclusion apply? Burden: the carrier — me. Standard: preponderance, unless my state requires clear and convincing for fraud-based denials, and I confirm that rather than assume it. Evidence: both keys accounted for; forced-entry evidence; origin-and-cause findings on the burn; consistency of his account over time; the gap between last-seen and discovery. Now grade honestly — have, need, or unavailable. Right now you have almost nothing. So the correct answer today isn’t deny. It’s keep investigating. That’s not weakness. That’s the file telling you what it is.",
    durationSec: 38.8,
    videoUrl: "/media/claims-01-av1/rejoin-2.mp4",
    captions: [
      { start: 0.0, end: 2.23, text: "Run the chain out loud on this file." },
      { start: 2.23, end: 6.81, text: "Issue: does the intentional-act exclusion apply? Burden: the carrier — me." },
      { start: 6.81, end: 12.69, text: "Standard: preponderance, unless my state requires clear and convincing for fraud-based denials," },
      { start: 12.69, end: 15.23, text: "and I confirm that rather than assume it." },
      { start: 15.23, end: 21.17, text: "Evidence: both keys accounted for; forced-entry evidence; origin-and-cause findings on the burn;" },
      { start: 21.17, end: 26.0, text: "consistency of his account over time; the gap between last-seen and discovery." },
      { start: 26.0, end: 31.14, text: "Now grade honestly — have, need, or unavailable. Right now you have almost nothing." },
      { start: 31.14, end: 35.1, text: "So the correct answer today isn’t deny. It’s keep investigating." },
      { start: 35.1, end: 38.8, text: "That’s not weakness. That’s the file telling you what it is." },
    ],
  },
  "decision-3": {
    text:
      "You confirm Delaney was two payments behind and had a repo notice on file. What does that give you?",
    durationSec: 6.28,
    videoUrl: "/media/claims-01-av1/decision-3.mp4",
    captions: [
      { start: 0.0, end: 4.74, text: "You confirm Delaney was two payments behind and had a repo notice on file." },
      { start: 4.74, end: 6.28, text: "What does that give you?" },
    ],
  },
  "fb-3a": {
    text:
      "Nothing in his loan file speaks to ignition. Only origin-and-cause evidence does. If you write those two facts into the same paragraph as though one supports the other, you’ve built the exact sentence opposing counsel will read to a jury in a slow voice.",
    durationSec: 16.04,
    videoUrl: "/media/claims-01-av1/fb-3a.mp4",
    captions: [
      { start: 0.0, end: 5.16, text: "Nothing in his loan file speaks to ignition. Only origin-and-cause evidence does." },
      { start: 5.16, end: 10.63, text: "If you write those two facts into the same paragraph as though one supports the other," },
      { start: 10.63, end: 16.04, text: "you’ve built the exact sentence opposing counsel will read to a jury in a slow voice." },
    ],
  },
  "fb-3c": {
    text:
      "This is the most common wrong answer and the most expensive one. You’re the one carrying the burden here — see Decision 2 — so “more likely than not” has to be built from corroborated facts a neutral reader would accept. Financial pressure and a burned truck describe thousands of honest total losses. Add the keys, the forced entry, the accelerant finding, the timeline conflict, and now you may have a file. One indicator is not a case.",
    durationSec: 27.44,
    videoUrl: "/media/claims-01-av1/fb-3c.mp4",
    captions: [
      { start: 0.0, end: 4.06, text: "This is the most common wrong answer and the most expensive one." },
      { start: 4.06, end: 7.74, text: "You’re the one carrying the burden here — see Decision 2 —" },
      { start: 7.74, end: 13.82, text: "so “more likely than not” has to be built from corroborated facts a neutral reader would accept." },
      { start: 13.82, end: 18.89, text: "Financial pressure and a burned truck describe thousands of honest total losses." },
      { start: 18.89, end: 22.38, text: "Add the keys, the forced entry, the accelerant finding," },
      { start: 22.38, end: 27.44, text: "the timeline conflict, and now you may have a file. One indicator is not a case." },
    ],
  },
  "fb-3d": {
    text:
      "You don’t know what he did. Saying you do is a misrepresentation, it’s pressure applied to a statement, and it will be the only thing anyone remembers about this claim. It also destroys the statement’s value — a jury discounts everything said after that line. Take statements open-question-first and let the account be his.",
    durationSec: 20.24,
    videoUrl: "/media/claims-01-av1/fb-3d.mp4",
    captions: [
      { start: 0.0, end: 1.71, text: "You don’t know what he did." },
      { start: 1.71, end: 6.47, text: "Saying you do is a misrepresentation, it’s pressure applied to a statement," },
      { start: 6.47, end: 10.53, text: "and it will be the only thing anyone remembers about this claim." },
      { start: 10.53, end: 16.24, text: "It also destroys the statement’s value — a jury discounts everything said after that line." },
      { start: 16.24, end: 20.24, text: "Take statements open-question-first and let the account be his." },
    ],
  },
  "rejoin-3": {
    text:
      "Motive is a reason to look harder. It’s never, by itself, the answer. It goes in your analysis section, labeled as an indicator, tied to its source — not blended into the findings as though it were an observation.",
    durationSec: 13.12,
    videoUrl: "/media/claims-01-av1/rejoin-3.mp4",
    captions: [
      { start: 0.0, end: 4.29, text: "Motive is a reason to look harder. It’s never, by itself, the answer." },
      { start: 4.29, end: 9.2, text: "It goes in your analysis section, labeled as an indicator, tied to its source —" },
      { start: 9.2, end: 13.12, text: "not blended into the findings as though it were an observation." },
    ],
  },
  "resolution-1": {
    text:
      "Here’s where this file actually stands at day fourteen. Both keys: need — he says one is at his mother’s house, unverified. Forced entry: have — sheriff’s recovery report notes no window damage and no punched ignition. Accelerant: need — origin-and-cause inspection scheduled for day nineteen. Timeline of last use: have but conflicting — he told the FNOL rep he left the store at 8:15 and told you 9:30. Financial detail: have, obtained through the proper channel with permissible purpose documented.",
    durationSec: 31.96,
    videoUrl: "/media/claims-01-av1/resolution-1.mp4",
    captions: [
      { start: 0.0, end: 3.55, text: "Here’s where this file actually stands at day fourteen." },
      { start: 3.55, end: 7.88, text: "Both keys: need — he says one is at his mother’s house, unverified." },
      { start: 7.88, end: 13.95, text: "Forced entry: have — sheriff’s recovery report notes no window damage and no punched ignition." },
      { start: 13.95, end: 18.73, text: "Accelerant: need — origin-and-cause inspection scheduled for day nineteen." },
      { start: 18.73, end: 21.57, text: "Timeline of last use: have but conflicting —" },
      { start: 21.57, end: 25.77, text: "he told the FNOL rep he left the store at 8:15 and told you 9:30." },
      { start: 25.77, end: 31.96, text: "Financial detail: have, obtained through the proper channel with permissible purpose documented." },
    ],
  },
  "resolution-2": {
    text:
      "That’s the resolution for now, and writing it down as “keep investigating” is a professional act, not a failure. The origin-and-cause report is the piece that speaks directly to the disputed fact. Everything else is context.",
    durationSec: 13.92,
    videoUrl: "/media/claims-01-av1/resolution-2.mp4",
    captions: [
      { start: 0.0, end: 1.89, text: "That’s the resolution for now," },
      { start: 1.89, end: 6.99, text: "and writing it down as “keep investigating” is a professional act, not a failure." },
      { start: 6.99, end: 12.22, text: "The origin-and-cause report is the piece that speaks directly to the disputed fact." },
      { start: 12.22, end: 13.92, text: "Everything else is context." },
    ],
  },
  "resolution-3": {
    text:
      "And flip it. Suppose the O&C engineer finds an electrical fault at the harness, consistent with an accidental fire, and the second key turns up where he said it was. This identical investigation now defensibly pays a claim on an underwater truck for a man two payments behind — promptly, and with a file that explains exactly why. That’s the whole point. The answer changes. The method doesn’t.",
    durationSec: 24.56,
    videoUrl: "/media/claims-01-av1/resolution-3.mp4",
    captions: [
      { start: 0.0, end: 4.99, text: "And flip it. Suppose the O&C engineer finds an electrical fault at the harness," },
      { start: 4.99, end: 10.36, text: "consistent with an accidental fire, and the second key turns up where he said it was." },
      { start: 10.36, end: 13.9, text: "This identical investigation now defensibly pays a claim" },
      { start: 13.9, end: 17.31, text: "on an underwater truck for a man two payments behind —" },
      { start: 17.31, end: 22.11, text: "promptly, and with a file that explains exactly why. That’s the whole point." },
      { start: 22.11, end: 24.56, text: "The answer changes. The method doesn’t." },
    ],
  },
} as const satisfies Record<string, NarrationSegment>;

export type NarrationId = keyof typeof NARRATION;
