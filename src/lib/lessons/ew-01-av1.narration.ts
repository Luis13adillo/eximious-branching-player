/**
 * ew-01 · Application Video 1 — narration + caption data (DERIVED)
 * ============================================================================
 * GENERATED FILE — do not hand-edit the narration strings.
 *
 * `text` is the VERBATIM narration from the authoritative EW-01 pilot script
 * (docs/source/pilot-scripts.pdf, pp. 10-16). Every string was sliced out of
 * the extracted script text and checked back against the rendered source
 * pages; nothing was retyped, reworded, reordered or summarised, and every
 * string is a byte-contiguous run of the source. Bracketed `[On screen: …]`
 * cues are excluded because the script's cover page defines them as "visual
 * direction, not spoken narration", and the A-D option text is excluded
 * because options are displayed, never spoken.
 *
 * The trailing `-> IF THEY CHOOSE X:` branch headers are excluded on the same
 * grounds (CORRECTED 2026-08-20, after Gate A). They are the script's header
 * for the NEXT branch — structural direction, not narration — but unlike a
 * bracketed cue they run byte-contiguous with the tail of the preceding
 * feedback beat, so the original slice carried nine of them into `text` and
 * the contiguity check passed. Two were audibly read aloud by the TTS. The
 * strip removed 180 characters across nine feedback segments and nothing else;
 * the narration lock moved 10061 -> 9881 chars.
 *
 * SEGMENT SPLITS FOLLOW THE SCRIPT'S OWN CUES, with no exceptions. Two beats
 * are very short by consequence: `assignment-4` ("Let's work it.", ~1.0 s)
 * follows the Prieto-quote cue, and `decision-1` ("What do you say?", ~1.2 s)
 * follows the DECISION 1 header. They are NOT merged — merging them would join
 * text the script separates, and a segment boundary is free.
 *
 * ★ DELIVERED (2026-08-21) — `durationSec` IS MEASURED.
 * No audio or video exists for ew-01 yet. Durations are character count ÷
 * 13.73 chars/sec, Selena's MEASURED rate from her locked voice record
 * (public/media/presenter-3-selena-navarro-voice-SELECTED.json). Caption cues
 * are allocated across that estimate in proportion to character count.
 * `MEDIA_DELIVERED` stays false until the locked pipeline has produced the
 * segments; at that point this file is REGENERATED against the measured
 * durations in each `<id>.mp4.json` sidecar and the flag flips. Do not
 * hand-patch a duration — regenerate.
 */

/** Flips to true when the delivered 1920x1080 segments exist on disk. */
export const MEDIA_DELIVERED = true;

export interface NarrationSegment {
  /** Verbatim script line. Byte-exact against the authoritative EW-01 script. */
  text: string;
  /**
   * ESTIMATED at Gate 0 (chars ÷ 13.73). Replaced by the MEASURED delivered
   * mp4 length — `<id>.mp4.json` -> split.video_dur_s — when media lands.
   */
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

/**
 * SHA-256 of every narration string joined with "\n", in scene order.
 * The fingerprint of the transcription. If a single character of what Selena
 * will say ever changes, this changes with it and the test fails — which is
 * what stops a "small wording fix" from silently desyncing the delivered audio
 * from the authoritative script.
 */
export const NARRATION_SHA256 =
  "54f55fcee0fc63ddfb8587922337bf630b275169c4a1b44ecee30652c68d48dc";

/** Total spoken characters across all 25 segments. */
export const NARRATION_CHARS = 9881;

/** Media directory for this application video's delivered assets. */
export const EW_01_AV1_MEDIA = "/media/ew-01-av1";

export const NARRATION = {
  "intro": {
    text:
      "You’ve read the first three lessons. Now let’s find out if it stuck. You’re the expert, the call is live, and you’re making the calls. Pause when I ask.",
    durationSec: 12.36,
    videoUrl: "/media/ew-01-av1/intro.mp4",
    captions: [
      { start: 0, end: 2.99, text: "You’ve read the first three lessons." },
      { start: 2.99, end: 5.6, text: "Now let’s find out if it stuck." },
      { start: 5.6, end: 10.82, text: "You’re the expert, the call is live, and you’re making the calls." },
      { start: 10.82, end: 12.36, text: "Pause when I ask." },
    ],
  },
  "assignment-1": {
    text:
      "Twenty-two years reconstructing vehicle collisions. Formerly a state police crash reconstruction unit; now independent. You’ve been qualified as an expert eleven times. You teach a two-day course on momentum analysis. You have never designed a piece of roadside safety hardware in your life.",
    durationSec: 20.2,
    videoUrl: "/media/ew-01-av1/assignment-1.mp4",
    captions: [
      { start: 0, end: 3.61, text: "Twenty-two years reconstructing vehicle collisions." },
      { start: 3.61, end: 8.29, text: "Formerly a state police crash reconstruction unit; now independent." },
      { start: 8.29, end: 11.71, text: "You’ve been qualified as an expert eleven times." },
      { start: 11.71, end: 15.12, text: "You teach a two-day course on momentum analysis." },
      { start: 15.12, end: 20.2, text: "You have never designed a piece of roadside safety hardware in your life." },
    ],
  },
  "assignment-2": {
    text:
      "Renata Prieto, of Halloway & Prieto — a plaintiff’s firm. The matter: Doss v. Ferrin Haulage and Cavender County. Marguerite Doss, 29, front-seat passenger in a pickup that left Route 41 at approximately 2:10 a.m., struck a guardrail end terminal, and rolled. She died at the scene. Her estate is suing the driver’s employer and the county.",
    durationSec: 27.4,
    videoUrl: "/media/ew-01-av1/assignment-2.mp4",
    captions: [
      { start: 0, end: 4.63, text: "Renata Prieto, of Halloway & Prieto — a plaintiff’s firm." },
      { start: 4.63, end: 9.11, text: "The matter: Doss v. Ferrin Haulage and Cavender County." },
      { start: 9.11, end: 10.88, text: "Marguerite Doss, 29," },
      { start: 10.88, end: 17.21, text: "front-seat passenger in a pickup that left Route 41 at approximately 2:10 a.m.," },
      { start: 17.21, end: 20.84, text: "struck a guardrail end terminal, and rolled." },
      { start: 20.84, end: 22.77, text: "She died at the scene." },
      { start: 22.77, end: 27.4, text: "Her estate is suing the driver’s employer and the county." },
    ],
  },
  "assignment-3": {
    text:
      "Eleven minutes into the call, Prieto says this:",
    durationSec: 4.16,
    videoUrl: "/media/ew-01-av1/assignment-3.mp4",
    captions: [
      { start: 0, end: 4.16, text: "Eleven minutes into the call, Prieto says this:" },
    ],
  },
  "assignment-4": {
    text:
      "Let’s work it.",
    durationSec: 2.96,
    videoUrl: "/media/ew-01-av1/assignment-4.mp4",
    captions: [
      { start: 0, end: 2.96, text: "Let’s work it." },
    ],
  },
  "decision-1": {
    text:
      "What do you say?",
    durationSec: 2.24,
    videoUrl: "/media/ew-01-av1/decision-1.mp4",
    captions: [
      { start: 0, end: 2.24, text: "What do you say?" },
    ],
  },
  "fb-1a": {
    text:
      "Listen to what you agreed to. You haven’t seen the D-ring, the webbing, the latch plate, the seat back, or a single photograph — and you’ve already decided what you’ll probably be able to say. That’s the exact inversion that makes an expert worthless. The problem isn’t that “inconclusive” might be wrong; it might well turn out to be right. The problem is that you’d be reasoning backward from a needed answer, and reasoning backward leaves fingerprints all over a file that opposing counsel gets to read.",
    durationSec: 33.8,
    videoUrl: "/media/ew-01-av1/fb-1a.mp4",
    captions: [
      { start: 0, end: 2.08, text: "Listen to what you agreed to." },
      { start: 2.08, end: 7.01, text: "You haven’t seen the D-ring, the webbing, the latch plate, the seat back," },
      { start: 7.01, end: 12.91, text: "or a single photograph — and you’ve already decided what you’ll probably be able to say." },
      { start: 12.91, end: 16.87, text: "That’s the exact inversion that makes an expert worthless." },
      { start: 16.87, end: 22.84, text: "The problem isn’t that “inconclusive” might be wrong; it might well turn out to be right." },
      { start: 22.84, end: 27.51, text: "The problem is that you’d be reasoning backward from a needed answer," },
      { start: 27.51, end: 33.8, text: "and reasoning backward leaves fingerprints all over a file that opposing counsel gets to read." },
    ],
  },
  "fb-1c": {
    text:
      "Two problems, and the second one is worse. First, the practical: designation can change later, and much of what you write as a consultant can follow you into a testifying role — assume every note you make may be read aloud under oath. Second, the real one: the consulting hat protects candid work, not dishonest work. If your honest analysis says the decedent wasn’t belted, you say that to counsel behind the scenes so she can settle or re-strategize. That’s the whole value of a consulting expert. Telling her what she wants to hear privately is the same failure in a quieter room.",
    durationSec: 41.36,
    videoUrl: "/media/ew-01-av1/fb-1c.mp4",
    captions: [
      { start: 0, end: 3.09, text: "Two problems, and the second one is worse." },
      { start: 3.09, end: 6.8, text: "First, the practical: designation can change later," },
      { start: 6.8, end: 12.5, text: "and much of what you write as a consultant can follow you into a testifying role" },
      { start: 12.5, end: 16.7, text: "— assume every note you make may be read aloud under oath." },
      { start: 16.7, end: 22.54, text: "Second, the real one: the consulting hat protects candid work, not dishonest work." },
      { start: 22.54, end: 26.59, text: "If your honest analysis says the decedent wasn’t belted," },
      { start: 26.59, end: 32.08, text: "you say that to counsel behind the scenes so she can settle or re-strategize." },
      { start: 32.08, end: 35.45, text: "That’s the whole value of a consulting expert." },
      { start: 35.45, end: 41.36, text: "Telling her what she wants to hear privately is the same failure in a quieter room." },
    ],
  },
  "fb-1d": {
    text:
      "Slow down. What Prieto said is clumsy and it’s a warning sign, but it isn’t misconduct — plenty of good lawyers say something like it, and plenty of them respond well when an expert draws the line. You don’t need a disciplinary process; you need one calm sentence about how you work. If she still wants a hired opinion after you’ve said it, you decline, and you decline cleanly. Reserve your escalation for something that actually earns it.",
    durationSec: 32.64,
    videoUrl: "/media/ew-01-av1/fb-1d.mp4",
    captions: [
      { start: 0, end: 0.93, text: "Slow down." },
      { start: 0.93, end: 6.53, text: "What Prieto said is clumsy and it’s a warning sign, but it isn’t misconduct" },
      { start: 6.53, end: 10.11, text: "— plenty of good lawyers say something like it," },
      { start: 10.11, end: 14.78, text: "and plenty of them respond well when an expert draws the line." },
      { start: 14.78, end: 21.09, text: "You don’t need a disciplinary process; you need one calm sentence about how you work." },
      { start: 21.09, end: 28.05, text: "If she still wants a hired opinion after you’ve said it, you decline, and you decline cleanly." },
      { start: 28.05, end: 32.64, text: "Reserve your escalation for something that actually earns it." },
    ],
  },
  "rejoin-1a": {
    text:
      "Say it plainly and say it early, because that sentence does more work than any part of your CV. It tells her, in one breath, that you’re the kind of witness a jury will believe — and a lawyer who’s actually thinking about trial will hear that as an asset. Here’s the thing new experts take longest to accept: you are not on the lawyer’s team. It feels like you are. She hired you, she’ll pay you, she’ll prepare you and sit beside you. But the instant a judge or jury senses you’d have said whatever you were paid to say, your opinion evaporates — and it takes her case down with it. Your duty runs to the tribunal, under one label or another in every serious system. Your opinion belongs to the court.",
    durationSec: 50.72,
    videoUrl: "/media/ew-01-av1/rejoin-1a.mp4",
    captions: [
      { start: 0, end: 6.87, text: "Say it plainly and say it early, because that sentence does more work than any part of your CV." },
      { start: 6.87, end: 12.7, text: "It tells her, in one breath, that you’re the kind of witness a jury will believe" },
      { start: 12.7, end: 18.38, text: "— and a lawyer who’s actually thinking about trial will hear that as an asset." },
      { start: 18.38, end: 24.62, text: "Here’s the thing new experts take longest to accept: you are not on the lawyer’s team." },
      { start: 24.62, end: 26.38, text: "It feels like you are." },
      { start: 26.38, end: 31.43, text: "She hired you, she’ll pay you, she’ll prepare you and sit beside you." },
      { start: 31.43, end: 37.6, text: "But the instant a judge or jury senses you’d have said whatever you were paid to say," },
      { start: 37.6, end: 42.09, text: "your opinion evaporates — and it takes her case down with it." },
      { start: 42.09, end: 48.12, text: "Your duty runs to the tribunal, under one label or another in every serious system." },
      { start: 48.12, end: 50.72, text: "Your opinion belongs to the court." },
    ],
  },
  "rejoin-1b": {
    text:
      "And note what the strong version buys Prieto: the truth early, while she can still do something with it. That’s not you being difficult. That’s the service. One more framing to carry through this whole course. Be a teacher, not a champion. Champions get discredited. Teachers get retained.",
    durationSec: 24.08,
    videoUrl: "/media/ew-01-av1/rejoin-1b.mp4",
    captions: [
      { start: 0, end: 3.78, text: "And note what the strong version buys Prieto:" },
      { start: 3.78, end: 8.58, text: "the truth early, while she can still do something with it." },
      { start: 8.58, end: 11.25, text: "That’s not you being difficult." },
      { start: 11.25, end: 12.98, text: "That’s the service." },
      { start: 12.98, end: 17.31, text: "One more framing to carry through this whole course." },
      { start: 17.31, end: 19.83, text: "Be a teacher, not a champion." },
      { start: 19.83, end: 22.11, text: "Champions get discredited." },
      { start: 22.11, end: 24.08, text: "Teachers get retained." },
    ],
  },
  "decision-2": {
    text:
      "Prieto keeps going: “We also need an opinion that the guardrail end terminal was defectively designed — that’s the county’s exposure.” What’s your answer?",
    durationSec: 11.88,
    videoUrl: "/media/ew-01-av1/decision-2.mp4",
    captions: [
      { start: 0, end: 1.6, text: "Prieto keeps going:" },
      { start: 1.6, end: 7.73, text: "“We also need an opinion that the guardrail end terminal was defectively designed" },
      { start: 7.73, end: 10.28, text: "— that’s the county’s exposure.”" },
      { start: 10.28, end: 11.88, text: "What’s your answer?" },
    ],
  },
  "fb-2a": {
    text:
      "Picture a respected colleague — someone who actually designs and crash-tests roadside hardware for a living — hearing that you offered a design-defect opinion on an end terminal. Nod, or wince? Adjacent isn’t the same. A bridge engineer isn’t automatically qualified on a specific fatigue-cracking mechanism just because both involve steel, and a reconstructionist isn’t qualified on terminal design just because both involve vehicles hitting things. Opposing counsel will walk you through your own CV — never designed one, never tested one, never published on it — and the jury will watch you get exposed. The problem won’t be your intelligence. It’ll be the reach.",
    durationSec: 45.84,
    videoUrl: "/media/ew-01-av1/fb-2a.mp4",
    captions: [
      { start: 0, end: 2.12, text: "Picture a respected colleague" },
      { start: 2.12, end: 7.41, text: "— someone who actually designs and crash-tests roadside hardware for a living" },
      { start: 7.41, end: 12.24, text: "— hearing that you offered a design-defect opinion on an end terminal." },
      { start: 12.24, end: 13.36, text: "Nod, or wince?" },
      { start: 13.36, end: 15.15, text: "Adjacent isn’t the same." },
      { start: 15.15, end: 19.38, text: "A bridge engineer isn’t automatically qualified on a specific" },
      { start: 19.38, end: 23.48, text: "fatigue-cracking mechanism just because both involve steel," },
      { start: 23.48, end: 27.05, text: "and a reconstructionist isn’t qualified on terminal" },
      { start: 27.05, end: 31.02, text: "design just because both involve vehicles hitting things." },
      { start: 31.02, end: 35.98, text: "Opposing counsel will walk you through your own CV — never designed one," },
      { start: 35.98, end: 41.61, text: "never tested one, never published on it — and the jury will watch you get exposed." },
      { start: 41.61, end: 44.38, text: "The problem won’t be your intelligence." },
      { start: 44.38, end: 45.84, text: "It’ll be the reach." },
    ],
  },
  "fb-2c": {
    text:
      "Reading into the current literature is legitimate and expected — when you already do the work and need to confirm the field hasn’t moved past you. It does not convert a weekend into twenty years of hands-on design and testing. And here’s the practical trap: whatever you read this weekend, an opposing expert has been living for a career, and the cross-examination will find the edge of your reading in about four questions. If you’d be embarrassed to have a leading colleague hear you claim the expertise, you’re reaching.",
    durationSec: 33.08,
    videoUrl: "/media/ew-01-av1/fb-2c.mp4",
    captions: [
      { start: 0, end: 3.98, text: "Reading into the current literature is legitimate and expected" },
      { start: 3.98, end: 9.25, text: "— when you already do the work and need to confirm the field hasn’t moved past you." },
      { start: 9.25, end: 14.27, text: "It does not convert a weekend into twenty years of hands-on design and testing." },
      { start: 14.27, end: 18.26, text: "And here’s the practical trap: whatever you read this weekend," },
      { start: 18.26, end: 21.38, text: "an opposing expert has been living for a career," },
      { start: 21.38, end: 26.77, text: "and the cross-examination will find the edge of your reading in about four questions." },
      { start: 26.77, end: 31.92, text: "If you’d be embarrassed to have a leading colleague hear you claim the expertise," },
      { start: 31.92, end: 33.08, text: "you’re reaching." },
    ],
  },
  "fb-2d": {
    text:
      "“Did not perform as intended” is a statement about what the device was designed to do and whether it did it. You can’t offer that without an expertise in terminal design and performance criteria — you’ve just made the same claim while surrendering the ability to defend it. Hedged phrasing is actually worse under a qualifications challenge, because it reads as an expert who knew he was out of bounds and tried to sneak across. Claim what you own. Disclaim the rest out loud.",
    durationSec: 31.56,
    videoUrl: "/media/ew-01-av1/fb-2d.mp4",
    captions: [
      { start: 0, end: 3.71, text: "“Did not perform as intended” is a statement about what" },
      { start: 3.71, end: 7.23, text: "the device was designed to do and whether it did it." },
      { start: 7.23, end: 12.87, text: "You can’t offer that without an expertise in terminal design and performance criteria" },
      { start: 12.87, end: 18.05, text: "— you’ve just made the same claim while surrendering the ability to defend it." },
      { start: 18.05, end: 22.53, text: "Hedged phrasing is actually worse under a qualifications challenge," },
      { start: 22.53, end: 28.23, text: "because it reads as an expert who knew he was out of bounds and tried to sneak across." },
      { start: 28.23, end: 29.64, text: "Claim what you own." },
      { start: 29.64, end: 31.56, text: "Disclaim the rest out loud." },
    ],
  },
  "rejoin-2a": {
    text:
      "Read that again and notice what it does. It concedes a boundary, and the concession makes everything inside the boundary stronger — because the judge and the jury have just watched you refuse to overreach. That’s not modesty. It’s the single best defense of your core opinion. And understand how this gets tested in practice, because it isn’t only a private worry. Opposing counsel can challenge you before trial by motion, or probe you live through voir dire on your qualifications, with the judge sitting as gatekeeper. The expert who, asked whether he can also address the terminal design, says “well, I’ve picked up a fair amount over the years” has just widened the target and invited an examination that can end with a judge limiting or excluding him.",
    durationSec: 51.56,
    videoUrl: "/media/ew-01-av1/rejoin-2a.mp4",
    captions: [
      { start: 0, end: 2.84, text: "Read that again and notice what it does." },
      { start: 2.84, end: 8.84, text: "It concedes a boundary, and the concession makes everything inside the boundary stronger" },
      { start: 8.84, end: 13.98, text: "— because the judge and the jury have just watched you refuse to overreach." },
      { start: 13.98, end: 15.43, text: "That’s not modesty." },
      { start: 15.43, end: 18.92, text: "It’s the single best defense of your core opinion." },
      { start: 18.92, end: 24.86, text: "And understand how this gets tested in practice, because it isn’t only a private worry." },
      { start: 24.86, end: 28.88, text: "Opposing counsel can challenge you before trial by motion," },
      { start: 28.88, end: 32.97, text: "or probe you live through voir dire on your qualifications," },
      { start: 32.97, end: 35.6, text: "with the judge sitting as gatekeeper." },
      { start: 35.6, end: 41.21, text: "The expert who, asked whether he can also address the terminal design, says “well," },
      { start: 41.21, end: 46.42, text: "I’ve picked up a fair amount over the years” has just widened the target and" },
      { start: 46.42, end: 51.56, text: "invited an examination that can end with a judge limiting or excluding him." },
    ],
  },
  "rejoin-2b": {
    text:
      "Then keep the CV scrupulously clean, because it’s treated as sworn. A lapsed certification listed as current, a minor role inflated into a leadership one — impeachment on your CV is doubly powerful. It removes your opinion and tells the jury you’re the kind of person who exaggerates, which poisons everything else you say.",
    durationSec: 25.96,
    videoUrl: "/media/ew-01-av1/rejoin-2b.mp4",
    captions: [
      { start: 0, end: 5.44, text: "Then keep the CV scrupulously clean, because it’s treated as sworn." },
      { start: 5.44, end: 12.28, text: "A lapsed certification listed as current, a minor role inflated into a leadership one" },
      { start: 12.28, end: 15.93, text: "— impeachment on your CV is doubly powerful." },
      { start: 15.93, end: 22.77, text: "It removes your opinion and tells the jury you’re the kind of person who exaggerates," },
      { start: 22.77, end: 25.96, text: "which poisons everything else you say." },
    ],
  },
  "decision-3": {
    text:
      "Prieto mentions she found you through your website. So will opposing counsel. Here’s what it says.",
    durationSec: 7.76,
    videoUrl: "/media/ew-01-av1/decision-3.mp4",
    captions: [
      { start: 0, end: 3.99, text: "Prieto mentions she found you through your website." },
      { start: 3.99, end: 6.06, text: "So will opposing counsel." },
      { start: 6.06, end: 7.76, text: "Here’s what it says." },
    ],
  },
  "fb-3a": {
    text:
      "Every word can be accurate and the page can still destroy you. “The reconstructionist plaintiff’s firms trust” is documentary proof, published by you, that you serve one side of the bar — read aloud at deposition, it’s the whole bias case in a single line. “Never excluded” invites a question you’ll dread: is your job to survive challenges, or to tell the truth? And a nine-field specialty list is an open invitation to exactly the out-of-lane engagements that got you in trouble two minutes ago. Your marketing is discoverable and impeachable. Write it as if under oath.",
    durationSec: 42.56,
    videoUrl: "/media/ew-01-av1/fb-3a.mp4",
    captions: [
      { start: 0, end: 4.67, text: "Every word can be accurate and the page can still destroy you." },
      { start: 4.67, end: 11.12, text: "“The reconstructionist plaintiff’s firms trust” is documentary proof, published by you," },
      { start: 11.12, end: 15.79, text: "that you serve one side of the bar — read aloud at deposition," },
      { start: 15.79, end: 19.02, text: "it’s the whole bias case in a single line." },
      { start: 19.02, end: 22.75, text: "“Never excluded” invites a question you’ll dread:" },
      { start: 22.75, end: 26.99, text: "is your job to survive challenges, or to tell the truth?" },
      { start: 26.99, end: 32.08, text: "And a nine-field specialty list is an open invitation to exactly the" },
      { start: 32.08, end: 36.89, text: "out-of-lane engagements that got you in trouble two minutes ago." },
      { start: 36.89, end: 40.48, text: "Your marketing is discoverable and impeachable." },
      { start: 40.48, end: 42.56, text: "Write it as if under oath." },
    ],
  },
  "fb-3c": {
    text:
      "Lawyers doing diligence search your name before they call — that’s how Prieto found you. Disappearing makes you harder to retain and does nothing about the archived copies, the directory profiles, and the conference abstracts still out there. And there’s a timing problem you may not have considered: taking your site down after being retained looks like concealment, and it’s the sort of thing that gets asked about. The answer isn’t invisibility. It’s a page that’s still true when it’s read back to you in four years.",
    durationSec: 33.76,
    videoUrl: "/media/ew-01-av1/fb-3c.mp4",
    captions: [
      { start: 0, end: 5.72, text: "Lawyers doing diligence search your name before they call — that’s how Prieto found you." },
      { start: 5.72, end: 11.13, text: "Disappearing makes you harder to retain and does nothing about the archived copies," },
      { start: 11.13, end: 15.65, text: "the directory profiles, and the conference abstracts still out there." },
      { start: 15.65, end: 19.43, text: "And there’s a timing problem you may not have considered:" },
      { start: 19.43, end: 23.76, text: "taking your site down after being retained looks like concealment," },
      { start: 23.76, end: 27.03, text: "and it’s the sort of thing that gets asked about." },
      { start: 27.03, end: 29.11, text: "The answer isn’t invisibility." },
      { start: 29.11, end: 33.76, text: "It’s a page that’s still true when it’s read back to you in four years." },
    ],
  },
  "fb-3d": {
    text:
      "A client testimonial praising you is, by its nature, someone saying you helped them get a result — which is precisely the impression you cannot afford to create. Adding defense-side ones doubles the exhibits rather than neutralizing them. Neutrality doesn’t come from collecting endorsements from both sides; it comes from making no outcome claims at all and saying plainly that you’re retained by both.",
    durationSec: 29.52,
    videoUrl: "/media/ew-01-av1/fb-3d.mp4",
    captions: [
      { start: 0, end: 3.9, text: "A client testimonial praising you is, by its nature," },
      { start: 3.9, end: 7.17, text: "someone saying you helped them get a result" },
      { start: 7.17, end: 11.92, text: "— which is precisely the impression you cannot afford to create." },
      { start: 11.92, end: 17.53, text: "Adding defense-side ones doubles the exhibits rather than neutralizing them." },
      { start: 17.53, end: 22.64, text: "Neutrality doesn’t come from collecting endorsements from both sides;" },
      { start: 22.64, end: 29.52, text: "it comes from making no outcome claims at all and saying plainly that you’re retained by both." },
    ],
  },
  "rejoin-3": {
    text:
      "Nothing on that page can be used against you, because it claims only what’s true and it claims nothing about outcomes. That’s the standard. And remember what marketing is actually for in this business. It isn’t volume. The dominant channel is referral — from other lawyers, from experts who are conflicted out or too busy, from counsel you did honest work for. Everything else exists so that a serious lawyer doing diligence can quickly confirm three things: you have genuine expertise in a defined area, you’re comfortable in the litigation process, and you’re measured enough not to blow up on the stand. One well-matched engagement from a firm that trusts you beats a hundred inquiries from matters outside your lane.",
    durationSec: 51,
    videoUrl: "/media/ew-01-av1/rejoin-3.mp4",
    captions: [
      { start: 0, end: 3.27, text: "Nothing on that page can be used against you," },
      { start: 3.27, end: 8.38, text: "because it claims only what’s true and it claims nothing about outcomes." },
      { start: 8.38, end: 9.94, text: "That’s the standard." },
      { start: 9.94, end: 14.3, text: "And remember what marketing is actually for in this business." },
      { start: 14.3, end: 15.59, text: "It isn’t volume." },
      { start: 15.59, end: 19.47, text: "The dominant channel is referral — from other lawyers," },
      { start: 19.47, end: 25.53, text: "from experts who are conflicted out or too busy, from counsel you did honest work for." },
      { start: 25.53, end: 28.94, text: "Everything else exists so that a serious lawyer" },
      { start: 28.94, end: 32.48, text: "doing diligence can quickly confirm three things:" },
      { start: 32.48, end: 35.75, text: "you have genuine expertise in a defined area," },
      { start: 35.75, end: 39.02, text: "you’re comfortable in the litigation process," },
      { start: 39.02, end: 42.97, text: "and you’re measured enough not to blow up on the stand." },
      { start: 42.97, end: 46.91, text: "One well-matched engagement from a firm that trusts you" },
      { start: 46.91, end: 51, text: "beats a hundred inquiries from matters outside your lane." },
    ],
  },
  "resolution-1": {
    text:
      "Here’s how the first two weeks go. You take the vehicle dynamics and the occupant question, in writing, with the boundary stated on the page. You decline the terminal design opinion and give Prieto the names of two people who actually do that work — which costs you nothing and buys you a referral relationship with both of them. Then you examine the restraint evidence the way you’d examine it for anybody.",
    durationSec: 27.08,
    videoUrl: "/media/ew-01-av1/resolution-1.mp4",
    captions: [
      { start: 0, end: 2.37, text: "Here’s how the first two weeks go." },
      { start: 2.37, end: 6.16, text: "You take the vehicle dynamics and the occupant question," },
      { start: 6.16, end: 9.5, text: "in writing, with the boundary stated on the page." },
      { start: 9.5, end: 13.22, text: "You decline the terminal design opinion and give Prieto" },
      { start: 13.22, end: 16.56, text: "the names of two people who actually do that work" },
      { start: 16.56, end: 21.95, text: "— which costs you nothing and buys you a referral relationship with both of them." },
      { start: 21.95, end: 27.08, text: "Then you examine the restraint evidence the way you’d examine it for anybody." },
    ],
  },
  "resolution-2": {
    text:
      "There’s a loaded webbing mark at the D-ring and corresponding hardware damage at the latch plate. The physical evidence indicates Marguerite Doss was restrained. That’s helpful to Prieto’s case — and the reason it’s worth anything is that you never promised it. If the evidence had run the other way, she’d have gotten that call in week two instead of finding out at your deposition. Which is the deal.",
    durationSec: 28.4,
    videoUrl: "/media/ew-01-av1/resolution-2.mp4",
    captions: [
      { start: 0, end: 3.39, text: "There’s a loaded webbing mark at the D-ring and" },
      { start: 3.39, end: 6.91, text: "corresponding hardware damage at the latch plate." },
      { start: 6.91, end: 11.39, text: "The physical evidence indicates Marguerite Doss was restrained." },
      { start: 11.39, end: 13.69, text: "That’s helpful to Prieto’s case" },
      { start: 13.69, end: 18.44, text: "— and the reason it’s worth anything is that you never promised it." },
      { start: 18.44, end: 21.22, text: "If the evidence had run the other way," },
      { start: 21.22, end: 26.98, text: "she’d have gotten that call in week two instead of finding out at your deposition." },
      { start: 26.98, end: 28.4, text: "Which is the deal." },
    ],
  },
  "resolution-3": {
    text:
      "Flip the hardware. No load mark, no latch plate damage, no restraint use indicated. You call Prieto, you tell her plainly, and you put it in the report. She may not enjoy the call. But her file is now built on something true, she can price the case honestly, and the next time she has a matter squarely in your lane, you’re the first number she dials — because you’re the expert who told her the bad news in week two. Same analysis. Same discipline. The answer changes on its own.",
    durationSec: 35.92,
    videoUrl: "/media/ew-01-av1/resolution-3.mp4",
    captions: [
      { start: 0, end: 1.5, text: "Flip the hardware." },
      { start: 1.5, end: 6.28, text: "No load mark, no latch plate damage, no restraint use indicated." },
      { start: 6.28, end: 11.35, text: "You call Prieto, you tell her plainly, and you put it in the report." },
      { start: 11.35, end: 13.5, text: "She may not enjoy the call." },
      { start: 13.5, end: 19.21, text: "But her file is now built on something true, she can price the case honestly," },
      { start: 19.21, end: 23.49, text: "and the next time she has a matter squarely in your lane," },
      { start: 23.49, end: 26.07, text: "you’re the first number she dials" },
      { start: 26.07, end: 30.99, text: "— because you’re the expert who told her the bad news in week two." },
      { start: 30.99, end: 32.21, text: "Same analysis." },
      { start: 32.21, end: 33.56, text: "Same discipline." },
      { start: 33.56, end: 35.92, text: "The answer changes on its own." },
    ],
  },
} as const satisfies Record<string, NarrationSegment>;

export type NarrationId = keyof typeof NARRATION;

/** Script order — the order the segments appear in the pilot script. */
export const NARRATION_ORDER = Object.keys(NARRATION) as NarrationId[];
