# Delivery — EA_ew-01_AV1

**Eximious Academy · Pilot video 3 of 3 · Expert Witness (Prieto, _Doss v. Ferrin Haulage_)**
Presenter: Selena Navarro · **Revision 2 — re-delivered 2026-08-22 on the recast voice**

---

## ⚠️ REVISION 2 — 2026-08-22. The presenter's voice was RECAST. Every segment was re-rendered.

**You asked for Selena's voice to be changed.** She has moved from OpenAI's
`gpt-4o-mini-tts` / `sage` to a purpose-designed voice — a Mexican-American woman in her
early thirties, Southern California — served through fal by MiniMax.

The new voice is **noticeably lower and slightly quicker** than the one you heard in
revision 1: about 155 Hz against 197 Hz on the opening line, and 14.32 characters per second
against 13.73. The video runs 11.73 minutes instead of 11.80.

**Nothing else about the video changed.** The narration script is byte-for-byte identical —
its fingerprint is unchanged from revision 1. The branching, the decisions, the feedback
routing, the retry behaviour, the captions' wording, the presenter's appearance and the
player are all as you approved them. Only the voice, and the timings that follow from it.

Revision 1 is retained on disk in full (`EA_ew-01_AV1-v1-sage-superseded.zip` and its
source archive) so it can be restored without re-rendering anything.

| | Size | SHA-256 |
|---|---|---|
| `EA_ew-01_AV1.zip` **(current — revision 2)** | 171.7 MB | `a67b346710956d4b518410f6e20bfdb7f6752f22f0ca797b8ec700462489d3cf` |
| `EA_ew-01_AV1_source.zip` **(current — revision 2)** | 262.8 MB | `95914bdaf017996ad59660b2c91af18d866a1a48777aa6b5b13f751555e4fe33` |
| `EA_ew-01_AV1-v1-sage-superseded.zip` | 173.9 MB | `740648ab5510969864cca91e07b35f70f77ad579d9edc8d0a3de3f9ff76eed83` |
| `EA_ew-01_AV1_source-v1-sage-superseded.zip` | 264.5 MB | `a8c26afb1e026258d51d3b52c614fd96617d26a69e34b3f7683511891927cc5b` |

---

## Files

**`EA_ew-01_AV1.zip`** is the deliverable: a self-contained HTML5 web package for a
Thinkific **Multimedia** lesson (not SCORM — per Agreement §2, SCORM only on written
request). `index.html` sits at the archive root, every asset is relative, and nothing loads
from a server, a CDN or an API. It runs offline.

**`EA_ew-01_AV1_source.zip`** is the source deliverable required by Agreement §2.3.1: the
full player source, this video's config and data (decisions, options, feedback routing,
retry), all narration video and audio as discrete per-segment files, and written
documentation sufficient to modify and re-export it without us. It contains no
confidential material.

## What is in the video

25 delivered narration segments, 703.8 s (11.73 min) of video, every one exactly
**1920×1080 at 25 fps**.

Three decisions, four options each. Every one of the nine incorrect options routes to its
own individual feedback segment; a wrong answer returns the learner to the same decision
until it is answered correctly. The three correct-answer verdicts are rendered by the
player rather than as video, matching the approach approved for `claims-01`. All paths
rejoin.

The lesson opens on its first frame behind a labelled **Start** control and does not play
until the learner presses it; picture and sound then begin together.

---

## Functional acceptance — Agreement §2.2

Verified in a real browser engine against this exact package, with all twelve options
clicked. **18 of 18 checks pass.**

| Check | Result |
|---|---|
| Plays start → finish | PASS |
| All 12 options route to their own individual feedback | PASS — 9/9 incorrect matched their declared target, 9 distinct |
| Retry returns to the same decision | PASS — 9/9 |
| All paths rejoin | PASS — 5/5 rejoin segments reached |
| Every delivered segment reachable | PASS — 25/25 |
| Audio clean — no extraneous audio, dead segments, no manual muting | PASS — never more than one audible source |
| Does not autoplay; Start begins picture and sound together | PASS |
| No missing assets, no 4xx/5xx, no errors | PASS |

## Production QA

| Gate | Result |
|---|---|
| Audio — loudness, true peak, format, flatness, truncation, pauses, pitch | **PASS 25/25 on all nine rows** |
| Script fidelity — every segment read back by speech recognition | **PASS 25/25** (1.004% word error rate; every difference adjudicated) |
| Delivered dimensions and frame rate | PASS 25/25 — exactly 1920×1080 / 25 fps |
| Delivered audio is the approved master, in a codec every browser decodes | PASS 25/25 — AAC-LC 128 kbps / 24 kHz / mono, samples bit-identical to the master |
| Framing against the approved presenter reference | PASS 25/25 — no drift, zoom or warping |
| Articulation | PASS — mouth moves naturally throughout |
| Packaged quality against the masters | **45.0–49.1 dB PSNR** across all 25 — visually lossless at the 1.9 Mbps package cap |

Narration is verbatim to the supplied script and is hash-verified against it segment by
segment. Every clip carries a provenance record: model, seed, source checksums, offsets.

**One segment was re-recorded before delivery.** In the first pass the term **"voir dire"**
was mispronounced in `rejoin-2a`. It was caught by the speech-recognition read-back, re-drawn
on the identical voice settings, and confirmed correct before delivery. No other segment was
affected, and the script was not touched.

---

## Known and accepted

**Opening frame mouth position.** On most segments the presenter's lips are slightly parted
on the very first and last frame, during silence — 24 of 25 first frames and 21 of 25 last
frames. It is visible only on a held frame — the frame behind the Start control, or while a
decision is on screen — and never during playback. This is the same condition revision 1
shipped with. **If you would prefer it closed, it is a player-side adjustment and requires no
re-rendering of any video.**

**Evidence scenes carry no photograph.** The two evidence moments render as text cards with
their on-screen cue titles and captions, which is how `siu-01`'s three evidence scenes also
ship. If this video should carry actual exhibit photographs, that is a content decision we
need from you — it does not affect anything else in the package.

**Caption timing is proportional, not force-aligned.** Cue text is verbatim and tiles each
segment exactly, but the boundaries are allocated by character count rather than measured
against the speech. It tracks closely on short cues and can drift slightly on long ones.

## Not yet done

**Real-device testing (iOS Safari, Android Chrome) has not been run on this video.** It is
deferred, not waived. The package is static and self-contained and the routing is verified,
so the realistic phone-specific risks are caption legibility at narrow widths and iOS's
handling of the opening audio — both player-side, both fixable at no cost and with no
re-render.

**This package has not been uploaded to Thinkific.** Functional acceptance inside a live
Thinkific lesson is still to be done. That is true of all three pilots.

---

## One thing we need you to know about the new voice

The new voice is a **designed** voice, not one off a catalogue. It exists as an account-held
identifier at the provider, and the process that created it is not repeatable — the same
written description is not guaranteed to produce the same voice twice.

Selena is the presenter for **42 courses**. If that identifier ever lapses before those are
produced, we may not be able to match this voice again, and earlier videos would not match
later ones. **We are not raising this to reopen the decision** — it is your call and it is
made. We are recording it, and our mitigation is to produce her videos early rather than
late and to keep every original recording. The previous voice did not carry this risk.

## What we need from you

1. **Confirm the new voice is right** — it is materially lower in pitch than revision 1.
2. **Opening-frame mouth position** — accept as delivered, or ask for the player-side fix.
3. **Evidence photographs** — text cards as delivered, or supply/approve real exhibit
   images for the two evidence moments.

None of these blocks review. All are quick to action once decided.
