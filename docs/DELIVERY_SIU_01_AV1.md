# Delivery — EA_siu-01_AV1

**Eximious Academy · Pilot video 2 of 3 · SIU Foundations & the Regulatory Framework**
Presenter: Curtis Whitfield · Released 2026-08-21

---

## Files

| File | Size | SHA-256 |
|---|---|---|
| `EA_siu-01_AV1.zip` | 170.4 MB | `dafc79ad8a88c7ca2415e386ff6b61e336d5855dcbad40e944fab562363349f0` |
| `EA_siu-01_AV1_source.zip` | 211.8 MB | `2350597264a0621f904918f7a00967ff341dd919f28210ce5a2376cf11ae8714` |

**`EA_siu-01_AV1.zip`** is the deliverable: a self-contained HTML5 web package for a
Thinkific **Multimedia** lesson (not SCORM — per Agreement §2, SCORM only on written
request). `index.html` sits at the archive root, every asset is relative, and nothing loads
from a server, a CDN or an API. It runs offline. 25 files, 170.3 MB unzipped.

**`EA_siu-01_AV1_source.zip`** is the source deliverable required by Agreement §2.3.1: the
full player source, this video's config and data (decisions, options, feedback routing,
retry), all narration video and audio as discrete per-segment files, and written
documentation sufficient to modify and re-export it without us. 162 files. It contains no
confidential material.

Naming is per Spec §269 / Agreement B §3 and §2.3.1.

**Neither archive was rebuilt for this release.** Both were already correct and are shipped
as they stood; the work done at release was verification and bookkeeping only.

---

## What is in the video

22 delivered narration segments, 598.24 s (9.97 min) of video, every one exactly
**1920×1080 at 25 fps**.

Three decisions, four options each. Every one of the nine incorrect options routes to its
own individual feedback segment; a wrong answer returns the learner to the same decision
until it is answered correctly. The three correct-answer verdicts (`fb-1b`, `fb-2c`,
`fb-3b`) are rendered by the player rather than as video. All paths rejoin.

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
| All paths rejoin | PASS — 3/3 rejoin segments reached |
| Every delivered segment reachable | PASS — 22/22 |
| Audio clean — no extraneous audio, dead segments, no manual muting | PASS — never more than one audible source |
| Does not autoplay; Start begins picture and sound together | PASS |
| No missing assets, no errors | PASS |

This is the **first** Gate D run on this pilot. It previously carried a human desktop
walkthrough (2026-08-21, Luis, PASS) but no driven acceptance run. Full log:
`REAL_DEVICE_QA_SIU_01.md`, §Gate D functional acceptance.

## Production QA

| Gate | Result |
|---|---|
| Mechanical QA | PASS — 22/22 segments, 11 rows each |
| First and last frame lips closed | PASS — 22/22, confirmed by eye |
| Delivered dimensions and frame rate | PASS 22/22 — 1920×1080 / 25 fps |
| Video covers its own audio on every segment | PASS 22/22 |
| Narration verbatim to the authoritative script | PASS 22/22 — sha256 per segment |
| Desktop walkthrough by a human | PASS — 2026-08-21, Luis |

Curtis's beard carries an ~11.8 pp mouth-specific softness penalty from the lip-sync stage.
It is invisible at player scale and is **accepted**; it is recorded in the production spec
so it is not rediscovered. No action unless it is raised at review.

---

## Corrections made at release

**Stale caption instruction cleared from all 22 sidecars.** Every `*.mp4.json` carried a
note telling a future maintainer that caption cues "must be offset by +0.24 s when they are
regenerated at Gate D". That instruction was wrong and had gone stale: the shipped cues
tile the *delivered asset*, starting at 0 and ending at `video_dur_s`, which is exactly
what the lesson tests assert. Following the note would have pushed the last cue past the
end of the video and failed the suite.

All 22 now carry the corrected note that `ew-01` ships, and the superseded text is retained
verbatim in a `caption_offset_note_superseded` field so the record shows what was cleared
rather than quietly losing it. **No caption data, lesson data, media or player code was
changed** — this was a correction to documentation held inside the provenance records.

---

## Package size

Curtis's 22 delivered masters are **199.4 MB** on their own — over Thinkific's **200 MB**
ceiling once `index.html` is added. The packaged copies are re-encoded to 2.2 Mbps
(measured 1.85–2.15 Mbps across segments), giving a **170.4 MB** zip.

Three invariants re-verified at release, not assumed:

| Invariant | Result |
|---|---|
| `public/media` masters byte-identical (rule 6) | **316/316 files checksummed, 0 changed** |
| Packaged audio identical to the locked 24 kHz / −24.5 LUFS master (rule 4) | **22/22** — `-c:a copy` |
| Packaged video exactly 1920×1080 / 25 fps (rule 5) | **22/22** |

Quality: **49.1–50.3 dB** PSNR against the delivered masters — visually lossless.

---

## Known and accepted

**Evidence scenes carry no exhibit photograph.** siu-01's three evidence moments render as
text cards with their on-screen cue titles and captions. `ew-01` ships the same way. If
these should carry actual exhibit images, that is a content decision we need from you — it
affects nothing else in the package.

**Residual boundary frames on `fb-3c` and `intro`.** Recorded as a known open item, not
fixed in this release and not in scope for it.

## Not yet done

**Real-device testing (iOS Safari, Android Chrome) has not been run on this video.** It is
**deferred, not waived** — the same disposition taken on `ew-01`. An earlier attempt did
not reach round 1: the Mac served the package correctly with byte ranges on
`192.168.12.153:8913`, but the test phone could not reach it over the LAN. That was not
diagnosed. The realistic phone-specific risks are caption legibility at narrow widths and
iOS's handling of the opening audio — both player-side, both fixable at no cost and with no
re-render.

**This package has not been uploaded to Thinkific.** Functional acceptance inside a live
Thinkific lesson is still to be done — true of all three pilots.

---

## What we need from you

1. **Evidence photographs** — text cards as delivered, or supply/approve real exhibit
   images for the three evidence moments.

This does not block review.
