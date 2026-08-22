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
 * ★ DELIVERED — `durationSec` IS MEASURED, not estimated.
 *
 * Every `durationSec` is the measured length of the delivered mp4, read from
 * `<id>.mp4.json` -> split.video_dur_s. Caption cue boundaries are allocated
 * across that measured length in proportion to cue character count — that is
 * PROPORTIONAL, not force-aligned, which is a known limitation recorded in the
 * delivery docs.
 *
 * Do not hand-patch a duration or a cue boundary. Re-run:
 *     node scripts/rewire-narration.mjs --lesson ew-01-av1
 * It edits numeric literals only, never text, and re-verifies NARRATION_SHA256
 * afterwards.
 *
 * ★ RE-DELIVERED 2026-08-22 on Selena's RECAST voice (fal -> MiniMax
 * `speech-02-hd`, voice-design `ttv-voice-2026082200132526-qth65Vqj`), approved
 * by Roger. The narration TEXT did not change by a single character — the
 * fingerprint below is the same one the v1 delivery carried. Only the measured
 * durations and the cue boundaries derived from them moved.
 */

/** Flips to true when the delivered 1920x1080 segments exist on disk. */
export const MEDIA_DELIVERED = true;

export interface NarrationSegment {
  /** Verbatim script line. Byte-exact against the authoritative EW-01 script. */
  text: string;
  /**
   * Character count of `text`. Part of the Gate A FIDELITY PREFLIGHT — see `scriptSha256`.
   */
  scriptChars: number;
  /**
   * SHA-256 of `text` alone.
   *
   * RESTORED 2026-08-22. These two fields are what `scripts/tts-narration.mjs` re-checks
   * before it sends a single character to a TTS provider, so a drifted or edited script
   * aborts the run instead of being spoken aloud and paid for. They were present when
   * ew-01's Gate A first ran and were dropped when this module was regenerated against the
   * measured delivered durations — which silently disarmed the preflight for this lesson.
   * Recomputed from the UNCHANGED text: the combined fingerprint still equals
   * NARRATION_SHA256 and the total still equals NARRATION_CHARS, so no narration moved.
   *
   * claims-01's module has the same gap and is deliberately NOT touched here.
   */
  scriptSha256: string;
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
    scriptChars: 152,
    scriptSha256: "32bcd438e9c1de748e13499948b39b7f061dc71367fd928a16138a20a0247922",
    durationSec: 10.64,
    videoUrl: "/media/ew-01-av1/intro.mp4",
    captions: [
      { start: 0, end: 2.57, text: "You’ve read the first three lessons." },
      { start: 2.57, end: 4.78, text: "Now let’s find out if it stuck." },
      { start: 4.78, end: 9.43, text: "You’re the expert, the call is live, and you’re making the calls." },
      { start: 9.43, end: 10.64, text: "Pause when I ask." },
    ],
  },
  "assignment-1": {
    text:
      "Twenty-two years reconstructing vehicle collisions. Formerly a state police crash reconstruction unit; now independent. You’ve been qualified as an expert eleven times. You teach a two-day course on momentum analysis. You have never designed a piece of roadside safety hardware in your life.",
    scriptChars: 291,
    scriptSha256: "f7ec063d49c59083397acb05ffd4198ab4ed3b845fbcd196c22c2d3da2fb593a",
    durationSec: 23.08,
    videoUrl: "/media/ew-01-av1/assignment-1.mp4",
    captions: [
      { start: 0, end: 4.1, text: "Twenty-two years reconstructing vehicle collisions." },
      { start: 4.1, end: 9.49, text: "Formerly a state police crash reconstruction unit; now independent." },
      { start: 9.49, end: 13.35, text: "You’ve been qualified as an expert eleven times." },
      { start: 13.35, end: 17.21, text: "You teach a two-day course on momentum analysis." },
      { start: 17.21, end: 23.08, text: "You have never designed a piece of roadside safety hardware in your life." },
    ],
  },
  "assignment-2": {
    text:
      "Renata Prieto, of Halloway & Prieto — a plaintiff’s firm. The matter: Doss v. Ferrin Haulage and Cavender County. Marguerite Doss, 29, front-seat passenger in a pickup that left Route 41 at approximately 2:10 a.m., struck a guardrail end terminal, and rolled. She died at the scene. Her estate is suing the driver’s employer and the county.",
    scriptChars: 340,
    scriptSha256: "dd992f4e7dad4f14788433833be98d5af2568f5898e5c9010e43733495297e7f",
    durationSec: 28,
    videoUrl: "/media/ew-01-av1/assignment-2.mp4",
    captions: [
      { start: 0, end: 4.78, text: "Renata Prieto, of Halloway & Prieto — a plaintiff’s firm." },
      { start: 4.78, end: 9.39, text: "The matter: Doss v. Ferrin Haulage and Cavender County." },
      { start: 9.39, end: 11.07, text: "Marguerite Doss, 29," },
      { start: 11.07, end: 17.69, text: "front-seat passenger in a pickup that left Route 41 at approximately 2:10 a.m.," },
      { start: 17.69, end: 21.38, text: "struck a guardrail end terminal, and rolled." },
      { start: 21.38, end: 23.22, text: "She died at the scene." },
      { start: 23.22, end: 28, text: "Her estate is suing the driver’s employer and the county." },
    ],
  },
  "assignment-3": {
    text:
      "Eleven minutes into the call, Prieto says this:",
    scriptChars: 47,
    scriptSha256: "4e2ecb6c272f6db6103143247b59fb3f87fddf3ef3daaa23913f11619ad56587",
    durationSec: 4.44,
    videoUrl: "/media/ew-01-av1/assignment-3.mp4",
    captions: [
      { start: 0, end: 4.44, text: "Eleven minutes into the call, Prieto says this:" },
    ],
  },
  "assignment-4": {
    text:
      "Let’s work it.",
    scriptChars: 14,
    scriptSha256: "ceec757515a3ca9e6cf978c07bd811dbd959464d298a82f11887f9a20437288b",
    durationSec: 1.68,
    videoUrl: "/media/ew-01-av1/assignment-4.mp4",
    captions: [
      { start: 0, end: 1.68, text: "Let’s work it." },
    ],
  },
  "decision-1": {
    text:
      "What do you say?",
    scriptChars: 16,
    scriptSha256: "9276ea83937dc25660eed27c55bdb9ed45514320a1c514b7a85a108df4469b6b",
    durationSec: 2,
    videoUrl: "/media/ew-01-av1/decision-1.mp4",
    captions: [
      { start: 0, end: 2, text: "What do you say?" },
    ],
  },
  "fb-1a": {
    text:
      "Listen to what you agreed to. You haven’t seen the D-ring, the webbing, the latch plate, the seat back, or a single photograph — and you’ve already decided what you’ll probably be able to say. That’s the exact inversion that makes an expert worthless. The problem isn’t that “inconclusive” might be wrong; it might well turn out to be right. The problem is that you’d be reasoning backward from a needed answer, and reasoning backward leaves fingerprints all over a file that opposing counsel gets to read.",
    scriptChars: 506,
    scriptSha256: "0433c396ba7375db583f4bf2dda7868d2464db90e3ccfdba2f81cac7d07fa15d",
    durationSec: 35.68,
    videoUrl: "/media/ew-01-av1/fb-1a.mp4",
    captions: [
      { start: 0, end: 2.07, text: "Listen to what you agreed to." },
      { start: 2.07, end: 7.28, text: "You haven’t seen the D-ring, the webbing, the latch plate, the seat back," },
      { start: 7.28, end: 13.56, text: "or a single photograph — and you’ve already decided what you’ll probably be able to say." },
      { start: 13.56, end: 17.7, text: "That’s the exact inversion that makes an expert worthless." },
      { start: 17.7, end: 24.05, text: "The problem isn’t that “inconclusive” might be wrong; it might well turn out to be right." },
      { start: 24.05, end: 28.97, text: "The problem is that you’d be reasoning backward from a needed answer," },
      { start: 28.97, end: 35.68, text: "and reasoning backward leaves fingerprints all over a file that opposing counsel gets to read." },
    ],
  },
  "fb-1c": {
    text:
      "Two problems, and the second one is worse. First, the practical: designation can change later, and much of what you write as a consultant can follow you into a testifying role — assume every note you make may be read aloud under oath. Second, the real one: the consulting hat protects candid work, not dishonest work. If your honest analysis says the decedent wasn’t belted, you say that to counsel behind the scenes so she can settle or re-strategize. That’s the whole value of a consulting expert. Telling her what she wants to hear privately is the same failure in a quieter room.",
    scriptChars: 583,
    scriptSha256: "94a6376ec6c3ef0844927c02afff5a2f53be4359d111759b75180dda8c509520",
    durationSec: 44.24,
    videoUrl: "/media/ew-01-av1/fb-1c.mp4",
    captions: [
      { start: 0, end: 3.23, text: "Two problems, and the second one is worse." },
      { start: 3.23, end: 7.16, text: "First, the practical: designation can change later," },
      { start: 7.16, end: 13.31, text: "and much of what you write as a consultant can follow you into a testifying role" },
      { start: 13.31, end: 17.77, text: "— assume every note you make may be read aloud under oath." },
      { start: 17.77, end: 24.08, text: "Second, the real one: the consulting hat protects candid work, not dishonest work." },
      { start: 24.08, end: 28.39, text: "If your honest analysis says the decedent wasn’t belted," },
      { start: 28.39, end: 34.31, text: "you say that to counsel behind the scenes so she can settle or re-strategize." },
      { start: 34.31, end: 37.85, text: "That’s the whole value of a consulting expert." },
      { start: 37.85, end: 44.24, text: "Telling her what she wants to hear privately is the same failure in a quieter room." },
    ],
  },
  "fb-1d": {
    text:
      "Slow down. What Prieto said is clumsy and it’s a warning sign, but it isn’t misconduct — plenty of good lawyers say something like it, and plenty of them respond well when an expert draws the line. You don’t need a disciplinary process; you need one calm sentence about how you work. If she still wants a hired opinion after you’ve said it, you decline, and you decline cleanly. Reserve your escalation for something that actually earns it.",
    scriptChars: 440,
    scriptSha256: "1a9a7a9d9e3f5d76f8a5d9055a90942ef7ab9984f6ae3e31fe1a5b50cc04950d",
    durationSec: 33.32,
    videoUrl: "/media/ew-01-av1/fb-1d.mp4",
    captions: [
      { start: 0, end: 0.77, text: "Slow down." },
      { start: 0.77, end: 6.53, text: "What Prieto said is clumsy and it’s a warning sign, but it isn’t misconduct" },
      { start: 6.53, end: 10.13, text: "— plenty of good lawyers say something like it," },
      { start: 10.13, end: 14.89, text: "and plenty of them respond well when an expert draws the line." },
      { start: 14.89, end: 21.42, text: "You don’t need a disciplinary process; you need one calm sentence about how you work." },
      { start: 21.42, end: 28.64, text: "If she still wants a hired opinion after you’ve said it, you decline, and you decline cleanly." },
      { start: 28.64, end: 33.32, text: "Reserve your escalation for something that actually earns it." },
    ],
  },
  "rejoin-1a": {
    text:
      "Say it plainly and say it early, because that sentence does more work than any part of your CV. It tells her, in one breath, that you’re the kind of witness a jury will believe — and a lawyer who’s actually thinking about trial will hear that as an asset. Here’s the thing new experts take longest to accept: you are not on the lawyer’s team. It feels like you are. She hired you, she’ll pay you, she’ll prepare you and sit beside you. But the instant a judge or jury senses you’d have said whatever you were paid to say, your opinion evaporates — and it takes her case down with it. Your duty runs to the tribunal, under one label or another in every serious system. Your opinion belongs to the court.",
    scriptChars: 702,
    scriptSha256: "070d1179c4f01c9ee0301b2e2604b850ccb1ced630d9382c22a4694811d4dc4b",
    durationSec: 49.4,
    videoUrl: "/media/ew-01-av1/rejoin-1a.mp4",
    captions: [
      { start: 0, end: 6.77, text: "Say it plainly and say it early, because that sentence does more work than any part of your CV." },
      { start: 6.77, end: 12.47, text: "It tells her, in one breath, that you’re the kind of witness a jury will believe" },
      { start: 12.47, end: 18.03, text: "— and a lawyer who’s actually thinking about trial will hear that as an asset." },
      { start: 18.03, end: 24.17, text: "Here’s the thing new experts take longest to accept: you are not on the lawyer’s team." },
      { start: 24.17, end: 25.73, text: "It feels like you are." },
      { start: 25.73, end: 30.65, text: "She hired you, she’ll pay you, she’ll prepare you and sit beside you." },
      { start: 30.65, end: 36.71, text: "But the instant a judge or jury senses you’d have said whatever you were paid to say," },
      { start: 36.71, end: 41.06, text: "your opinion evaporates — and it takes her case down with it." },
      { start: 41.06, end: 46.98, text: "Your duty runs to the tribunal, under one label or another in every serious system." },
      { start: 46.98, end: 49.4, text: "Your opinion belongs to the court." },
    ],
  },
  "rejoin-1b": {
    text:
      "And note what the strong version buys Prieto: the truth early, while she can still do something with it. That’s not you being difficult. That’s the service. One more framing to carry through this whole course. Be a teacher, not a champion. Champions get discredited. Teachers get retained.",
    scriptChars: 289,
    scriptSha256: "28bff96e25c7df1cf6c39187e8e213494fc7ba52cb1e1dd210762535c63f7e15",
    durationSec: 22.64,
    videoUrl: "/media/ew-01-av1/rejoin-1b.mp4",
    captions: [
      { start: 0, end: 3.61, text: "And note what the strong version buys Prieto:" },
      { start: 3.61, end: 8.27, text: "the truth early, while she can still do something with it." },
      { start: 8.27, end: 10.76, text: "That’s not you being difficult." },
      { start: 10.76, end: 12.28, text: "That’s the service." },
      { start: 12.28, end: 16.46, text: "One more framing to carry through this whole course." },
      { start: 16.46, end: 18.79, text: "Be a teacher, not a champion." },
      { start: 18.79, end: 20.87, text: "Champions get discredited." },
      { start: 20.87, end: 22.64, text: "Teachers get retained." },
    ],
  },
  "decision-2": {
    text:
      "Prieto keeps going: “We also need an opinion that the guardrail end terminal was defectively designed — that’s the county’s exposure.” What’s your answer?",
    scriptChars: 154,
    scriptSha256: "67ad1a461b99aedd70546ce9bec2865285ec73a0ad11d4f81e2f0b81db2c568f",
    durationSec: 10.4,
    videoUrl: "/media/ew-01-av1/decision-2.mp4",
    captions: [
      { start: 0, end: 1.31, text: "Prieto keeps going:" },
      { start: 1.31, end: 6.89, text: "“We also need an opinion that the guardrail end terminal was defectively designed" },
      { start: 6.89, end: 9.09, text: "— that’s the county’s exposure.”" },
      { start: 9.09, end: 10.4, text: "What’s your answer?" },
    ],
  },
  "fb-2a": {
    text:
      "Picture a respected colleague — someone who actually designs and crash-tests roadside hardware for a living — hearing that you offered a design-defect opinion on an end terminal. Nod, or wince? Adjacent isn’t the same. A bridge engineer isn’t automatically qualified on a specific fatigue-cracking mechanism just because both involve steel, and a reconstructionist isn’t qualified on terminal design just because both involve vehicles hitting things. Opposing counsel will walk you through your own CV — never designed one, never tested one, never published on it — and the jury will watch you get exposed. The problem won’t be your intelligence. It’ll be the reach.",
    scriptChars: 666,
    scriptSha256: "0184387f1f0675588c7bc136baaad8aadc57d8de4f4992a0e13daf23f758daf8",
    durationSec: 46.08,
    videoUrl: "/media/ew-01-av1/fb-2a.mp4",
    captions: [
      { start: 0, end: 2.04, text: "Picture a respected colleague" },
      { start: 2.04, end: 7.47, text: "— someone who actually designs and crash-tests roadside hardware for a living" },
      { start: 7.47, end: 12.4, text: "— hearing that you offered a design-defect opinion on an end terminal." },
      { start: 12.4, end: 13.39, text: "Nod, or wince?" },
      { start: 13.39, end: 15.08, text: "Adjacent isn’t the same." },
      { start: 15.08, end: 19.38, text: "A bridge engineer isn’t automatically qualified on a specific" },
      { start: 19.38, end: 23.53, text: "fatigue-cracking mechanism just because both involve steel," },
      { start: 23.53, end: 27.13, text: "and a reconstructionist isn’t qualified on terminal" },
      { start: 27.13, end: 31.14, text: "design just because both involve vehicles hitting things." },
      { start: 31.14, end: 36.22, text: "Opposing counsel will walk you through your own CV — never designed one," },
      { start: 36.22, end: 41.99, text: "never tested one, never published on it — and the jury will watch you get exposed." },
      { start: 41.99, end: 44.74, text: "The problem won’t be your intelligence." },
      { start: 44.74, end: 46.08, text: "It’ll be the reach." },
    ],
  },
  "fb-2c": {
    text:
      "Reading into the current literature is legitimate and expected — when you already do the work and need to confirm the field hasn’t moved past you. It does not convert a weekend into twenty years of hands-on design and testing. And here’s the practical trap: whatever you read this weekend, an opposing expert has been living for a career, and the cross-examination will find the edge of your reading in about four questions. If you’d be embarrassed to have a leading colleague hear you claim the expertise, you’re reaching.",
    scriptChars: 523,
    scriptSha256: "2744ee25ed009787a93da2ea9aeedd6a52e594562e65d5e511789f4cd306b822",
    durationSec: 34.32,
    videoUrl: "/media/ew-01-av1/fb-2c.mp4",
    captions: [
      { start: 0, end: 4.12, text: "Reading into the current literature is legitimate and expected" },
      { start: 4.12, end: 9.64, text: "— when you already do the work and need to confirm the field hasn’t moved past you." },
      { start: 9.64, end: 14.9, text: "It does not convert a weekend into twenty years of hands-on design and testing." },
      { start: 14.9, end: 19.02, text: "And here’s the practical trap: whatever you read this weekend," },
      { start: 19.02, end: 22.21, text: "an opposing expert has been living for a career," },
      { start: 22.21, end: 27.87, text: "and the cross-examination will find the edge of your reading in about four questions." },
      { start: 27.87, end: 33.26, text: "If you’d be embarrassed to have a leading colleague hear you claim the expertise," },
      { start: 33.26, end: 34.32, text: "you’re reaching." },
    ],
  },
  "fb-2d": {
    text:
      "“Did not perform as intended” is a statement about what the device was designed to do and whether it did it. You can’t offer that without an expertise in terminal design and performance criteria — you’ve just made the same claim while surrendering the ability to defend it. Hedged phrasing is actually worse under a qualifications challenge, because it reads as an expert who knew he was out of bounds and tried to sneak across. Claim what you own. Disclaim the rest out loud.",
    scriptChars: 476,
    scriptSha256: "1d62312ba64ecf23dc591a016cfa629e005901cc9afabc841501ddfa2e7bdd56",
    durationSec: 30.36,
    videoUrl: "/media/ew-01-av1/fb-2d.mp4",
    captions: [
      { start: 0, end: 3.56, text: "“Did not perform as intended” is a statement about what" },
      { start: 3.56, end: 6.93, text: "the device was designed to do and whether it did it." },
      { start: 6.93, end: 12.43, text: "You can’t offer that without an expertise in terminal design and performance criteria" },
      { start: 12.43, end: 17.48, text: "— you’ve just made the same claim while surrendering the ability to defend it." },
      { start: 17.48, end: 21.82, text: "Hedged phrasing is actually worse under a qualifications challenge," },
      { start: 21.82, end: 27.38, text: "because it reads as an expert who knew he was out of bounds and tried to sneak across." },
      { start: 27.38, end: 28.61, text: "Claim what you own." },
      { start: 28.61, end: 30.36, text: "Disclaim the rest out loud." },
    ],
  },
  "rejoin-2a": {
    text:
      "Read that again and notice what it does. It concedes a boundary, and the concession makes everything inside the boundary stronger — because the judge and the jury have just watched you refuse to overreach. That’s not modesty. It’s the single best defense of your core opinion. And understand how this gets tested in practice, because it isn’t only a private worry. Opposing counsel can challenge you before trial by motion, or probe you live through voir dire on your qualifications, with the judge sitting as gatekeeper. The expert who, asked whether he can also address the terminal design, says “well, I’ve picked up a fair amount over the years” has just widened the target and invited an examination that can end with a judge limiting or excluding him.",
    scriptChars: 757,
    scriptSha256: "18c1fde7d48c3e2e03a2737534278dcc551ff52c21c26c0d04a77587b20d3037",
    durationSec: 52.4,
    videoUrl: "/media/ew-01-av1/rejoin-2a.mp4",
    captions: [
      { start: 0, end: 2.81, text: "Read that again and notice what it does." },
      { start: 2.81, end: 8.99, text: "It concedes a boundary, and the concession makes everything inside the boundary stronger" },
      { start: 8.99, end: 14.26, text: "— because the judge and the jury have just watched you refuse to overreach." },
      { start: 14.26, end: 15.59, text: "That’s not modesty." },
      { start: 15.59, end: 19.11, text: "It’s the single best defense of your core opinion." },
      { start: 19.11, end: 25.22, text: "And understand how this gets tested in practice, because it isn’t only a private worry." },
      { start: 25.22, end: 29.29, text: "Opposing counsel can challenge you before trial by motion," },
      { start: 29.29, end: 33.43, text: "or probe you live through voir dire on your qualifications," },
      { start: 33.43, end: 36.03, text: "with the judge sitting as gatekeeper." },
      { start: 36.03, end: 41.79, text: "The expert who, asked whether he can also address the terminal design, says “well," },
      { start: 41.79, end: 47.13, text: "I’ve picked up a fair amount over the years” has just widened the target and" },
      { start: 47.13, end: 52.4, text: "invited an examination that can end with a judge limiting or excluding him." },
    ],
  },
  "rejoin-2b": {
    text:
      "Then keep the CV scrupulously clean, because it’s treated as sworn. A lapsed certification listed as current, a minor role inflated into a leadership one — impeachment on your CV is doubly powerful. It removes your opinion and tells the jury you’re the kind of person who exaggerates, which poisons everything else you say.",
    scriptChars: 323,
    scriptSha256: "da08349c44476e4ce99806a4dc2e3933b9598c4fbe6af1c71cab7afe4ddc695e",
    durationSec: 23.72,
    videoUrl: "/media/ew-01-av1/rejoin-2b.mp4",
    captions: [
      { start: 0, end: 4.98, text: "Then keep the CV scrupulously clean, because it’s treated as sworn." },
      { start: 4.98, end: 11.3, text: "A lapsed certification listed as current, a minor role inflated into a leadership one" },
      { start: 11.3, end: 14.57, text: "— impeachment on your CV is doubly powerful." },
      { start: 14.57, end: 20.89, text: "It removes your opinion and tells the jury you’re the kind of person who exaggerates," },
      { start: 20.89, end: 23.72, text: "which poisons everything else you say." },
    ],
  },
  "decision-3": {
    text:
      "Prieto mentions she found you through your website. So will opposing counsel. Here’s what it says.",
    scriptChars: 98,
    scriptSha256: "b0b401c924847b6c4196d329367a6338cf3f6a39d94e60c2d26d045eeea5f909",
    durationSec: 8.6,
    videoUrl: "/media/ew-01-av1/decision-3.mp4",
    captions: [
      { start: 0, end: 4.57, text: "Prieto mentions she found you through your website." },
      { start: 4.57, end: 6.81, text: "So will opposing counsel." },
      { start: 6.81, end: 8.6, text: "Here’s what it says." },
    ],
  },
  "fb-3a": {
    text:
      "Every word can be accurate and the page can still destroy you. “The reconstructionist plaintiff’s firms trust” is documentary proof, published by you, that you serve one side of the bar — read aloud at deposition, it’s the whole bias case in a single line. “Never excluded” invites a question you’ll dread: is your job to survive challenges, or to tell the truth? And a nine-field specialty list is an open invitation to exactly the out-of-lane engagements that got you in trouble two minutes ago. Your marketing is discoverable and impeachable. Write it as if under oath.",
    scriptChars: 572,
    scriptSha256: "8f9d53394d9c03bd5477a56b333ac70ce7d8dd2bf20cef0731bf8da63d9f83ec",
    durationSec: 41.36,
    videoUrl: "/media/ew-01-av1/fb-3a.mp4",
    captions: [
      { start: 0, end: 4.55, text: "Every word can be accurate and the page can still destroy you." },
      { start: 4.55, end: 10.95, text: "“The reconstructionist plaintiff’s firms trust” is documentary proof, published by you," },
      { start: 10.95, end: 15.5, text: "that you serve one side of the bar — read aloud at deposition," },
      { start: 15.5, end: 18.59, text: "it’s the whole bias case in a single line." },
      { start: 18.59, end: 22.19, text: "“Never excluded” invites a question you’ll dread:" },
      { start: 22.19, end: 26.3, text: "is your job to survive challenges, or to tell the truth?" },
      { start: 26.3, end: 31.3, text: "And a nine-field specialty list is an open invitation to exactly the" },
      { start: 31.3, end: 36, text: "out-of-lane engagements that got you in trouble two minutes ago." },
      { start: 36, end: 39.45, text: "Your marketing is discoverable and impeachable." },
      { start: 39.45, end: 41.36, text: "Write it as if under oath." },
    ],
  },
  "fb-3c": {
    text:
      "Lawyers doing diligence search your name before they call — that’s how Prieto found you. Disappearing makes you harder to retain and does nothing about the archived copies, the directory profiles, and the conference abstracts still out there. And there’s a timing problem you may not have considered: taking your site down after being retained looks like concealment, and it’s the sort of thing that gets asked about. The answer isn’t invisibility. It’s a page that’s still true when it’s read back to you in four years.",
    scriptChars: 520,
    scriptSha256: "61c65bdacf372af1017d2b2e4ffaab084a3d6a8db933026c9b2365b715049925",
    durationSec: 33.96,
    videoUrl: "/media/ew-01-av1/fb-3c.mp4",
    captions: [
      { start: 0, end: 5.83, text: "Lawyers doing diligence search your name before they call — that’s how Prieto found you." },
      { start: 5.83, end: 11.32, text: "Disappearing makes you harder to retain and does nothing about the archived copies," },
      { start: 11.32, end: 15.89, text: "the directory profiles, and the conference abstracts still out there." },
      { start: 15.89, end: 19.66, text: "And there’s a timing problem you may not have considered:" },
      { start: 19.66, end: 24.03, text: "taking your site down after being retained looks like concealment," },
      { start: 24.03, end: 27.27, text: "and it’s the sort of thing that gets asked about." },
      { start: 27.27, end: 29.26, text: "The answer isn’t invisibility." },
      { start: 29.26, end: 33.96, text: "It’s a page that’s still true when it’s read back to you in four years." },
    ],
  },
  "fb-3d": {
    text:
      "A client testimonial praising you is, by its nature, someone saying you helped them get a result — which is precisely the impression you cannot afford to create. Adding defense-side ones doubles the exhibits rather than neutralizing them. Neutrality doesn’t come from collecting endorsements from both sides; it comes from making no outcome claims at all and saying plainly that you’re retained by both.",
    scriptChars: 403,
    scriptSha256: "37232889d3df629937afeab3123c7cd4e3135c80a45b27359e915ce7febad09d",
    durationSec: 27.88,
    videoUrl: "/media/ew-01-av1/fb-3d.mp4",
    captions: [
      { start: 0, end: 3.64, text: "A client testimonial praising you is, by its nature," },
      { start: 3.64, end: 6.65, text: "someone saying you helped them get a result" },
      { start: 6.65, end: 11.14, text: "— which is precisely the impression you cannot afford to create." },
      { start: 11.14, end: 16.46, text: "Adding defense-side ones doubles the exhibits rather than neutralizing them." },
      { start: 16.46, end: 21.3, text: "Neutrality doesn’t come from collecting endorsements from both sides;" },
      { start: 21.3, end: 27.88, text: "it comes from making no outcome claims at all and saying plainly that you’re retained by both." },
    ],
  },
  "rejoin-3": {
    text:
      "Nothing on that page can be used against you, because it claims only what’s true and it claims nothing about outcomes. That’s the standard. And remember what marketing is actually for in this business. It isn’t volume. The dominant channel is referral — from other lawyers, from experts who are conflicted out or too busy, from counsel you did honest work for. Everything else exists so that a serious lawyer doing diligence can quickly confirm three things: you have genuine expertise in a defined area, you’re comfortable in the litigation process, and you’re measured enough not to blow up on the stand. One well-matched engagement from a firm that trusts you beats a hundred inquiries from matters outside your lane.",
    scriptChars: 720,
    scriptSha256: "0de1415d9e077469040513c8b7da58a0bd93150afdb714b7b8760d1778b4d2bb",
    durationSec: 48.92,
    videoUrl: "/media/ew-01-av1/rejoin-3.mp4",
    captions: [
      { start: 0, end: 3.11, text: "Nothing on that page can be used against you," },
      { start: 3.11, end: 8.1, text: "because it claims only what’s true and it claims nothing about outcomes." },
      { start: 8.1, end: 9.48, text: "That’s the standard." },
      { start: 9.48, end: 13.7, text: "And remember what marketing is actually for in this business." },
      { start: 13.7, end: 14.81, text: "It isn’t volume." },
      { start: 14.81, end: 18.54, text: "The dominant channel is referral — from other lawyers," },
      { start: 18.54, end: 24.49, text: "from experts who are conflicted out or too busy, from counsel you did honest work for." },
      { start: 24.49, end: 27.75, text: "Everything else exists so that a serious lawyer" },
      { start: 27.75, end: 31.14, text: "doing diligence can quickly confirm three things:" },
      { start: 31.14, end: 34.25, text: "you have genuine expertise in a defined area," },
      { start: 34.25, end: 37.36, text: "you’re comfortable in the litigation process," },
      { start: 37.36, end: 41.17, text: "and you’re measured enough not to blow up on the stand." },
      { start: 41.17, end: 44.98, text: "One well-matched engagement from a firm that trusts you" },
      { start: 44.98, end: 48.92, text: "beats a hundred inquiries from matters outside your lane." },
    ],
  },
  "resolution-1": {
    text:
      "Here’s how the first two weeks go. You take the vehicle dynamics and the occupant question, in writing, with the boundary stated on the page. You decline the terminal design opinion and give Prieto the names of two people who actually do that work — which costs you nothing and buys you a referral relationship with both of them. Then you examine the restraint evidence the way you’d examine it for anybody.",
    scriptChars: 407,
    scriptSha256: "5c0cea10c15bd58fce6db137d402d32a05e759b75b3bb25abf85a54c694a8f37",
    durationSec: 28.52,
    videoUrl: "/media/ew-01-av1/resolution-1.mp4",
    captions: [
      { start: 0, end: 2.42, text: "Here’s how the first two weeks go." },
      { start: 2.42, end: 6.4, text: "You take the vehicle dynamics and the occupant question," },
      { start: 6.4, end: 9.89, text: "in writing, with the boundary stated on the page." },
      { start: 9.89, end: 13.8, text: "You decline the terminal design opinion and give Prieto" },
      { start: 13.8, end: 17.28, text: "the names of two people who actually do that work" },
      { start: 17.28, end: 23.04, text: "— which costs you nothing and buys you a referral relationship with both of them." },
      { start: 23.04, end: 28.52, text: "Then you examine the restraint evidence the way you’d examine it for anybody." },
    ],
  },
  "resolution-2": {
    text:
      "There’s a loaded webbing mark at the D-ring and corresponding hardware damage at the latch plate. The physical evidence indicates Marguerite Doss was restrained. That’s helpful to Prieto’s case — and the reason it’s worth anything is that you never promised it. If the evidence had run the other way, she’d have gotten that call in week two instead of finding out at your deposition. Which is the deal.",
    scriptChars: 402,
    scriptSha256: "47e2e5e609554545df49661f9b7a38ef16164113248cec706c979e1f0a30aa6b",
    durationSec: 27.76,
    videoUrl: "/media/ew-01-av1/resolution-2.mp4",
    captions: [
      { start: 0, end: 3.3, text: "There’s a loaded webbing mark at the D-ring and" },
      { start: 3.3, end: 6.75, text: "corresponding hardware damage at the latch plate." },
      { start: 6.75, end: 11.17, text: "The physical evidence indicates Marguerite Doss was restrained." },
      { start: 11.17, end: 13.35, text: "That’s helpful to Prieto’s case" },
      { start: 13.35, end: 18.06, text: "— and the reason it’s worth anything is that you never promised it." },
      { start: 18.06, end: 20.73, text: "If the evidence had run the other way," },
      { start: 20.73, end: 26.49, text: "she’d have gotten that call in week two instead of finding out at your deposition." },
      { start: 26.49, end: 27.76, text: "Which is the deal." },
    ],
  },
  "resolution-3": {
    text:
      "Flip the hardware. No load mark, no latch plate damage, no restraint use indicated. You call Prieto, you tell her plainly, and you put it in the report. She may not enjoy the call. But her file is now built on something true, she can price the case honestly, and the next time she has a matter squarely in your lane, you’re the first number she dials — because you’re the expert who told her the bad news in week two. Same analysis. Same discipline. The answer changes on its own.",
    scriptChars: 480,
    scriptSha256: "37a72d223a2aa32b1d58ab2424a398e45c780863dee0de9befcdd4a04c08bf73",
    durationSec: 34.44,
    videoUrl: "/media/ew-01-av1/resolution-3.mp4",
    captions: [
      { start: 0, end: 1.32, text: "Flip the hardware." },
      { start: 1.32, end: 6.01, text: "No load mark, no latch plate damage, no restraint use indicated." },
      { start: 6.01, end: 10.99, text: "You call Prieto, you tell her plainly, and you put it in the report." },
      { start: 10.99, end: 12.97, text: "She may not enjoy the call." },
      { start: 12.97, end: 18.61, text: "But her file is now built on something true, she can price the case honestly," },
      { start: 18.61, end: 22.79, text: "and the next time she has a matter squarely in your lane," },
      { start: 22.79, end: 25.21, text: "you’re the first number she dials" },
      { start: 25.21, end: 30.04, text: "— because you’re the expert who told her the bad news in week two." },
      { start: 30.04, end: 31.07, text: "Same analysis." },
      { start: 31.07, end: 32.24, text: "Same discipline." },
      { start: 32.24, end: 34.44, text: "The answer changes on its own." },
    ],
  },
} as const satisfies Record<string, NarrationSegment>;

export type NarrationId = keyof typeof NARRATION;

/** Script order — the order the segments appear in the pilot script. */
export const NARRATION_ORDER = Object.keys(NARRATION) as NarrationId[];
