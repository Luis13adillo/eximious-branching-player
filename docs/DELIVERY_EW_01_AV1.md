# Delivery — EA_ew-01_AV1

**Eximious Academy · Pilot video 3 of 3 · Expert Witness (Prieto, _Doss v. Ferrin Haulage_)**
Presenter: Selena Navarro · Released 2026-08-21

---

## Files

| File | Size | SHA-256 |
|---|---|---|
| `EA_ew-01_AV1.zip` | 176.3 MB | `ac1b66b5975906eda19cb5bf602a86ab45f5e8360cf2bf1d10132e9a13632782` |
| `EA_ew-01_AV1_source.zip` | 266.8 MB | `a8c26afb1e026258d51d3b52c614fd96617d26a69e34b3f7683511891927cc5b` |

> **Package hash corrected 2026-08-21.** This table originally recorded
> `c56bc2e431d73095b17a5f7bdcd84ae433c87d6d9511e77ce4fc5255de23a9d3` for
> `EA_ew-01_AV1.zip`. That hash was written at 15:13 and the archive was rebuilt at 15:15,
> two minutes later, which changed the hash — a zip embeds file timestamps, so rebuilding
> identical content still yields a different digest. **The contents did not change:** every
> file inside the archive on disk was verified byte-identical to the built `EA_ew-01_AV1/`
> directory. The value above is the archive as it actually stands. No media was regenerated
> and nothing about this release was re-run.
>
> **If `c56bc2e4…` was already sent to the client, say so** — the file they hold is
> content-identical, but the record should then note both digests rather than replace one.
> The source-deliverable hash was always correct and is unchanged.

**`EA_ew-01_AV1.zip`** is the deliverable: a self-contained HTML5 web package for a
Thinkific **Multimedia** lesson (not SCORM — per Agreement §2, SCORM only on written
request). `index.html` sits at the archive root, every asset is relative, and nothing loads
from a server, a CDN or an API. It runs offline.

**`EA_ew-01_AV1_source.zip`** is the source deliverable required by Agreement §2.3.1: the
full player source, this video's config and data (decisions, options, feedback routing,
retry), all narration video and audio as discrete per-segment files, and written
documentation sufficient to modify and re-export it without us. It contains no
confidential material.

---

## What is in the video

25 delivered narration segments, 707.8 s (11.8 min) of video, every one exactly
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
| All 12 options route to their own individual feedback | PASS |
| Retry returns to the same decision | PASS — 9/9 |
| All paths rejoin | PASS — 5/5 rejoin segments reached |
| Every delivered segment reachable | PASS — 25/25 |
| Audio clean — no extraneous audio, dead segments, no manual muting | PASS — never more than one audible source |
| Does not autoplay; Start begins picture and sound together | PASS |
| No missing assets, no errors | PASS |

Desktop walkthrough completed and accepted 2026-08-21.

## Production QA

| Gate | Result |
|---|---|
| Audio — loudness, true peak, format, no truncation, pitch | PASS 25/25 |
| Script fidelity — every segment read back by speech recognition | PASS 25/25 |
| Framing against the approved presenter reference | PASS 25/25 — no drift, zoom or warping |
| Articulation | PASS — mouth moves naturally throughout |
| Audio/video sync | PASS — measured across 17,639 frames |

Narration is verbatim to the supplied script and is hash-verified against it segment by
segment. Every clip carries a provenance record: model, seed, source checksums, offsets.

---

## Known and accepted

**Opening frame mouth position.** On most segments the presenter's lips are slightly parted
on the very first and last frame, during silence. It is visible only on a held frame — the
frame behind the Start control, or while a decision is on screen — and never during
playback. Accepted at release. If you would prefer it closed, it is a player-side
adjustment and requires no re-rendering of any video.

**Evidence scenes carry no photograph.** The two evidence moments render as text cards with
their on-screen cue titles and captions, which is how `siu-01`'s three evidence scenes also
ship. If this video should carry actual exhibit photographs, that is a content decision we
need from you — it does not affect anything else in the package.

## Not yet done

**Real-device testing (iOS Safari, Android Chrome) has not been run on this video.** It is
deferred, not waived. The package is static and self-contained and the routing is verified,
so the realistic phone-specific risks are caption legibility at narrow widths and iOS's
handling of the opening audio — both player-side, both fixable at no cost and with no
re-render. We will close this out and report.

**This package has not been uploaded to Thinkific.** Functional acceptance inside a live
Thinkific lesson is still to be done.

---

## What we need from you

1. **Opening-frame mouth position** — accept as delivered, or ask for the player-side fix.
2. **Evidence photographs** — text cards as delivered, or supply/approve real exhibit
   images for the two evidence moments.

Neither blocks review. Both are quick to action once decided.
