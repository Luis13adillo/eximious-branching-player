# Delivery — EA_claims-01_AV1

**Eximious Academy · Pilot video 1 of 3 · Fundamentals of Claims Investigation**
Presenter: Diane Marchetti · Released 2026-08-21

---

---

## ⚠️ REVISION 2026-08-21 — Safari / iOS audio fix. This package was REBUILT.

**The released package played the presenter but no sound on Safari and on every browser
on iOS.** Cause: the delivered MP4s carried the narration as **MP3 inside an MP4**, which
is signalled as `mp4a.69`. WebKit does not decode it — the picture ran normally and the
audio stream was dropped in silence. Chromium decodes `mp4a.69`, which is why it passed
review. Measured with Playwright/WebKit on 2026-08-21: `canPlayType('…mp4a.69')` returned
`""`, video advanced to t=6.01 s, audio peak amplitude **0.000**; the identical file with
AAC audio played at peak 0.336.

**Fix:** every delivered segment was re-containered to **AAC-LC 128 kbps / 24 kHz / mono**
(`mp4a.40.2`) with the **video stream copied bit-for-bit**, and `+faststart` added. Nothing
was re-rendered, no avatar or lip-sync asset was regenerated, and **no paid API was called
— $0.00**.

Verified across all 69 delivered segments of the three pilots: video stream MD5 identical,
frame count identical, duration delta 0.000 s, 1920×1080 / 25 fps held, audio onset shift
**0 ms**, loudness within 0.1 LU of −24.5 LUFS. Gate D functional acceptance re-run on the
rebuilt package: **18/18 PASS**.

| | Size | SHA-256 |
|---|---|---|
| `EA_claims-01_AV1.zip` **(current)** | 108.2 MB | `214c986f9b10ddf610f7387018dfd3638f7c859fd733811306978c6770d07fb5` |
| `EA_claims-01_AV1-mp3audio-SUPERSEDED.zip` | 115.2 MB | `7cacea398fabd6f3ba90e706dc3cd8524275268ac1f9e47d64dbc5905551d206` |

The superseded archive is retained on disk. **The hash table below records the superseded
build** — it is left unedited as the release record of what was originally shipped.

---

## Files

| File | Size | SHA-256 |
|---|---|---|
| `EA_claims-01_AV1.zip` | 115.2 MB | `7cacea398fabd6f3ba90e706dc3cd8524275268ac1f9e47d64dbc5905551d206` |
| `EA_claims-01_AV1_source.zip` | 204.8 MB | `61006c5cfe291f3a0de22fa01d9209cd119507272f6da643287788b23255569c` |

**`EA_claims-01_AV1.zip`** is the deliverable: a self-contained HTML5 web package for a
Thinkific **Multimedia** lesson (not SCORM — per Agreement §2, SCORM only on written
request). `index.html` sits at the archive root, every asset is relative, and nothing loads
from a server, a CDN or an API. It runs offline. 26 files, 110.4 MB unzipped.

**`EA_claims-01_AV1_source.zip`** is the source deliverable required by Agreement §2.3.1:
the full player source, this video's config and data (decisions, options, feedback routing,
retry), all narration video and audio as discrete per-segment files, and written
documentation sufficient to modify and re-export it without us. 154 files. It contains no
confidential material — asserted by the packager and independently re-checked at release
(0 PDFs, 0 files from `docs/source/` or `docs/confidential/`, 0 other videos' media or
lesson data, 0 credential files).

Naming is per Spec §269 / Agreement B §3 and §2.3.1: `EA_[course-slug]_AV[n].zip` and
`EA_[course-slug]_AV[n]_source.zip`. This video previously carried the older descriptive
name `eximious-claims-investigation-thinkific-html5.zip`; that artifact is superseded and
has been retired in place, not deleted.

---

## What is in the video

22 delivered narration segments, 463.32 s (7.72 min) of video, every one exactly
**1920×1080 at 25 fps**.

Three decisions, four options each. Every one of the nine incorrect options routes to its
own individual feedback segment; a wrong answer returns the learner to the same decision
until it is answered correctly. The three correct-answer verdicts (`fb-1d`, `fb-2b`,
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
| All paths rejoin | PASS — 4/4 rejoin segments reached |
| Every delivered segment reachable | PASS — 22/22 |
| Audio clean — no extraneous audio, dead segments, no manual muting | PASS — never more than one audible source |
| Does not autoplay; Start begins picture and sound together | PASS |
| No missing assets, no errors | PASS |

Driven through Chromium against the assembled package served over a byte-range-capable
static server — not the development app. Full log: `REAL_DEVICE_QA_CLAIMS_01.md`,
§Gate D functional acceptance (v4 release).

## Production QA

| Gate | Result |
|---|---|
| Audio — loudness, true peak, format, no truncation | PASS 22/22 |
| Blink cadence — the R1-1 defect from round 1 | PASS — 13.3/min, irregular, none reversed |
| Delivered dimensions and frame rate | PASS 22/22 — 1920×1080 / 25 fps |
| Video covers its own audio on every segment | PASS 22/22 |
| Narration verbatim to the authoritative script | PASS 22/22 — sha256 per segment |
| Unit tests | 474 passed, 1 skipped, 0 failed |

Narration is hash-verified against the supplied script segment by segment. Every clip
carries a provenance record: model, seed, source checksums, offsets.

---

## Corrections made at release

**Sidecar delivery records restored (22 segments).** The v4 regeneration replaced each
segment's provenance sidecar with a thinner record that dropped `video_dur_s`, `frames`,
`video_start_s` and `align_err_ms`. Nothing was wrong with the media; the *record* was
incomplete, and it left 22 delivery-integrity tests unable to run. All 22 were re-measured
directly against the delivered v4 files with `ffprobe` and rewritten. The figures are
measurements taken on 2026-08-21, not values copied back from the superseded v3 records —
those described different files at different batch offsets.

**`decision-3` was one frame short.** The delivered asset carried 156 frames (6.240 s) of
picture against 6.241 s of embedded audio, so the video did not cover the audio — a breach
of the locked pipeline rule that trims *up* a frame. The lesson narration and captions
already declared 6.28 s. It was extended to 157 frames (6.280 s) by cloning the delivered
final frame once.

That added frame is **synthesised** — a hold on the last real frame, not footage the
model generated. It falls in the trailing silence after the last narrated word, with the
mouth already closed, and measures 62.4 dB PSNR against the frame it repeats. The audio is
untouched and byte-identical (the locked 24 kHz / −24.5 LUFS master, `-c:a copy`). Cost
$0.00. The alternative — regenerating the segment so the frame is genuine — was costed at
≈$2.37 and not taken. The superseded 156-frame original is archived byte-identical at
`public/media/claims-01-av1-v4-decision3-156f-superseded/`.

---

## Package size

Diane's 22 delivered masters are **196.7 MB** on their own, against Thinkific's **200 MB**
ceiling — the previous package shipped at 197.7 MB, roughly 2 MB of headroom. The packaged
copies are now re-encoded to 1.9 Mbps, giving a **115.2 MB** zip and 84.8 MB of headroom.

Three invariants verified after the build, not assumed:

| Invariant | Result |
|---|---|
| `public/media` masters byte-identical (rule 6) | **316/316 files checksummed, 0 changed** |
| Packaged audio identical to the locked 24 kHz / −24.5 LUFS master (rule 4) | **22/22** — `-c:a copy` |
| Packaged video exactly 1920×1080 / 25 fps (rule 5) | **22/22** |

Quality: **50.7–51.4 dB** PSNR against the delivered masters — visually lossless. Diane's
segments are a static presenter on a dark background, which compresses efficiently, so the
lower bitrate costs nothing visible at player scale.

---

## Known and accepted

**Opening and closing frame mouth position.** Diane's segments are cut at the audio onset
rather than at the midpoint of the surrounding silence, so on most segments her lips are
slightly parted on the first and last frame, during silence. It is visible only on a held
frame — the frame behind the Start control, or while a decision is on screen — and never
during playback. This includes the `intro` frame that sits behind Start.

This is a **known open defect, not a fix that was applied**. Correcting it in the media
means re-cutting and re-rendering at ≈$2.37, which is **not approved**. It is also fixable
player-side at $0.00 with no re-render, because pipeline rule 8 keeps text and UI out of
the video. Selena's `ew-01` carries the same finding and was accepted at release.

**Head movement is minimal — 0.42 px RMS.** Diane's motion base was generated from the
locked prompt, which asks her to hold still. Below `ew-01` and below the approved demo.
Changing it requires a new motion base generated with a movement-positive prompt and a
segment regeneration — a new approval and new spend, not done.

## Not yet done

**Real-device testing (iOS Safari, Android Chrome) has not been run on this version.**
Round 1 was run on 2026-08-19 against the *v2* package and closed; the v4 media and the
renamed package have not been on a handset. It is **deferred, not waived** — same
disposition as `ew-01`. The package is static and self-contained and the routing is
verified 18/18, so the realistic phone-specific risks are caption legibility at narrow
widths and iOS's handling of the opening audio (defect R1-5, still open from round 1) —
both player-side, both fixable at no cost and with no re-render.

**This package has not been uploaded to Thinkific.** Functional acceptance inside a live
Thinkific lesson is still to be done — true of all three pilots.

---

## What we need from you

1. **Opening-frame mouth position** — accept as delivered, or ask for the player-side fix.
2. **The synthesised final frame on `decision-3`** — accept, or authorise the ≈$2.37
   regeneration.

Neither blocks review. Both are quick to action once decided.
