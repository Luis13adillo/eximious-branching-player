# SIU-01 AV1 — Real-device QA log

Interactive Video Production Guidelines §04 requires that real-device testing
record **device, browser, viewport, defects and final disposition**. This is that
record for `EA_siu-01_AV1`. It follows the same form as
`REAL_DEVICE_QA_CLAIMS_01.md`, so the two pilots can be compared directly.

Package under test: the assembled Thinkific HTML5 package
(`EA_siu-01_AV1/`, 170.3 MB), served over the LAN as a plain static site — the
deliverable itself, not the development app.

**Serving requirement:** the LAN server must answer **HTTP byte-range requests**.
This is not optional and it is not a detail. A server that replies `200 OK` with
the whole file instead of `206 Partial Content` will hang the feedback videos,
because a decision scene preloads all four of its feedback clips and the player
then has five videos in flight at once. This was observed on 2026-08-21 with
`python3 -m http.server`: every wrong answer spun forever and never played. The
same package on a range-capable server played correctly on the first try. Use
`scripts/serve-package.mjs`, which returns 206 and streams ranges.

```bash
node scripts/serve-package.mjs ./EA_siu-01_AV1 8913
# then open http://<LAN-IP>:8913 on the device
```

---

## Final disposition

> **SUPERSEDED — read §RELEASE at the end of this file for the current disposition.**
> This pilot was RELEASED FOR DELIVERY on 2026-08-21 with Gate D functional acceptance at
> 18/18. The section below is the pre-release record and is kept for history.

| | |
|---|---|
| Status | **OPEN — Thinkific upload and real-device round 1 not yet run** _(superseded — see §RELEASE)_ |
| Desktop walkthrough | **PASS** (2026-08-21, Luis, macOS, local range-capable server). Plays start to finish; all three decisions reached; wrong answers play their own feedback automatically and correctly and return to the same decision; **repeating the same wrong answer on the same question plays the media every time**; captions readable and matching the speech. |
| Serving-layer defect found and closed | On the first attempt every wrong answer spun forever and never played. Cause was the preview server, not the package: `python3 -m http.server` answers byte-range requests with `200 OK` and the whole file, and serves one connection at a time — and a decision scene has five videos in flight (four preloads + playback). Re-served with `scripts/serve-package.mjs` (206 + ranges) and it played correctly on the first try. **No change was made to the package or the player.** The byte-range requirement was already recorded in `REAL_DEVICE_QA_CLAIMS_01.md` ("LAN static server, HTTP byte-range enabled") and was missed. |
| LAN access | Not achieved. The Mac served correctly on `192.168.12.153:8913` with ranges, but the test phone could not reach it. Not diagnosed — superseded by testing through Thinkific, which is the required acceptance environment anyway. |
| Mechanical QA | **PASS** — 22/22 segments, 11 rows each, all true |
| First/last frame lips closed | **PASS** — 22/22 confirmed by eye |
| Thinkific upload | **NOT YET DONE** |

---

## Round 1 — real devices

_To be completed. Record one row per device._

| | |
|---|---|
| Date | |
| Tester | |
| Devices | |
| Serving | LAN static server (`scripts/serve-package.mjs`), HTTP byte-range enabled |
| Scope | Full lesson walkthrough, portrait |

### Acceptance checks (A §2.2)

| Check | Result |
|---|---|
| Plays start → finish | |
| All 12 options route to their own individual feedback | |
| Retry returns to the same decision | |
| All paths rejoin | |
| Audio clean — no extraneous audio, dead segments, or manual muting | |
| Start gate: video does not autoplay on load; Start begins picture and sound together | |
| Captions legible at phone width | |
| First frame behind Start shows closed mouth | |

### Defects raised

| # | Defect | Severity | Disposition |
|---|---|---|---|
| | | | |

---

## Carried over from claims-01 — check on this pilot too

**R1-5 · iOS Safari opening audio — OPEN on claims-01, untested here.**
On claims-01 the opening audio did not play on an older iPhone / Safari, while
Android Chrome was fine. It was deliberately not acted on: one older handset is
not enough to change production audio logic, and iOS gates autoplay on a user
gesture in ways that vary with iOS version, Low Power Mode, the silent switch and
per-site Safari settings.

The player's design is that the learner's first interaction anywhere unlocks sound
for the rest of the lesson — and since the start gate was locked, that first
interaction is the **Start** press itself, which is a deliberate gesture. That may
already resolve it. This pilot is the chance to find out.

**When testing on iOS, record:** iOS version, device, Low Power Mode state,
ringer/silent switch position, and whether audio starts after the Start press.

Two devices in the same state, both showing sound after Start, closes R1-5 for
both pilots. One failure keeps it open and gives us the second data point the
claims-01 log asked for.

---

## Known, accepted, not defects

- **Curtis's beard softens the mouth region** ~22% against his untouched base.
  Measured, expected, and accepted at the lip-sync QA gate — it is facial hair,
  not a lip-sync failure, and it is invisible at player scale. Do not raise it
  unless Roger rejects it at review.
- **Segments open and close on 0.240 s of digital silence.** Deliberate: the clips
  are cut at the midpoint of the silence between segments so the presenter's mouth
  is closed on the first and last frame. A quarter-second of stillness at each
  transition is the intended behaviour, not dead air.
- **Caption cue timing is proportional, not force-aligned.** Cue text is verbatim
  and tiles each segment exactly, but boundaries are allocated by character count
  rather than measured against the speech. Drift on long segments is a known
  limitation — worth recording if it reads badly on a phone.

---

# RELEASE — 2026-08-21

## Final disposition — release

Supersedes the "OPEN" status recorded above. The package and source deliverable were
**not rebuilt** for this release — both were already correct and ship as they stood. What
happened at release was verification and bookkeeping.

| | |
|---|---|
| Status | **RELEASED FOR DELIVERY 2026-08-21 by Luis.** Both deliverables named per spec; functional acceptance 18/18 against the assembled package. Real-device round 1 is **deferred, not waived** — see §Deferred at release |
| Package | `EA_siu-01_AV1`, 170.3 MB, zip **170.4 MB**, 25 files, `index.html` at the archive root. Not rebuilt |
| Package SHA-256 | `dafc79ad8a88c7ca2415e386ff6b61e336d5855dcbad40e944fab562363349f0` |
| Source deliverable | `EA_siu-01_AV1_source.zip`, **211.8 MB**, 162 files. Agreement §2.3.1. Not rebuilt |
| Source SHA-256 | `2350597264a0621f904918f7a00967ff341dd919f28210ce5a2376cf11ae8714` |
| **Gate D functional acceptance (A §2.2)** | **PASS — 18/18**, driven through a real browser against the assembled package. **First Gate D run on this pilot** |
| Desktop walkthrough by a human | **PASS** — 2026-08-21, Luis (recorded above) |
| Stale caption instruction in sidecars | **CLEARED — 22/22.** See §Sidecar caption note |
| Segments delivered | **22/22** — `public/media/siu-01-av1/`, 598.24 s (9.97 min) |
| Masters byte-identical (rule 6) | **PASS — 316/316 files checksummed, 0 changed** |
| Packaged audio identical to locked master (rule 4) | **PASS — 22/22** |
| Packaged video 1920×1080 / 25 fps (rule 5) | **PASS — 22/22** |
| Packaged quality | 49.1–50.3 dB PSNR against the masters at the 2.2 Mbps cap — visually lossless |
| Real devices | **DEFERRED at release — not run.** See §Deferred at release |
| Thinkific upload | **NOT YET DONE** — true of all three pilots |
| Spend this release | **$0.00** |

---

## Sidecar caption note — stale instruction cleared, 22/22

Every one of the 22 `*.mp4.json` sidecars carried this in its `split` block:

> "Caption cues are authored against narration time. This asset begins with 0.24s of
> silence, so cues must be offset by +0.24s when they are regenerated at Gate D."

**That instruction was stale and actively wrong.** The shipped cues tile the *delivered
asset*: the first starts at 0 and the last ends at `video_dur_s`, which is exactly what
`siu-01-av1.test.ts` asserts. The 0.24 s of lead silence is *inside* the asset and
therefore inside the first cue. Following the note would have pushed the last cue past the
end of the video and failed the suite.

All 22 now carry the corrected note that `ew-01` ships, with `video_dur_s` filled in per
segment. The superseded text is retained verbatim in a new `caption_offset_note_superseded`
field, so the record shows what was cleared rather than quietly losing it.

**Nothing else changed.** No caption data, no lesson data, no media, no player code — this
was a correction to documentation held inside the provenance records. Verified after the
change: the active note is correct in 22/22, and the test suite is green.

---

## Gate D functional acceptance — 18/18 PASS, 2026-08-21

The first driven acceptance run on this pilot. Everything before this was a human desktop
walkthrough, which passed but was not machine-checked against the lesson's declared
routing.

Driven through a real Chromium browser against the **assembled package** served over the
range-capable server — not the dev app, and not the lesson data in isolation.

```bash
node scripts/serve-package.mjs ./EA_siu-01_AV1 8915 &
npx tsx --tsconfig tsconfig.json scripts/dump-lesson-graph.ts /tmp/graph.json siu-01-av1
node scripts/acceptance-package.mjs http://127.0.0.1:8915 /tmp/graph.json
```

The walk clicks **all 12 options** — every wrong answer at every decision, then the right
one — and checks each against the routing the lesson data declares.

| Check | Result |
|---|---|
| Does not autoplay at load | PASS — `paused=true t=0.00` |
| Start control present behind the opening frame | PASS |
| Start begins picture and sound together | PASS — `playing=true src=intro.mp4` |
| All three decisions reached | PASS |
| 9 incorrect options each play their own feedback segment | PASS — 9/9 |
| Each incorrect option's feedback is distinct | PASS — 9 distinct across 9 |
| Each routes to the feedback its data names | PASS — 9/9 matched |
| Correct verdicts are player-native, no video | PASS — 3/3 by design (`fb-1b`/`fb-2c`/`fb-3b` carry no media) |
| Retry returns to the SAME decision | PASS — 9/9 |
| All paths rejoin, lesson plays start → finish | PASS |
| Every rejoin segment reached | PASS — 3 rejoin segments played |
| Every delivered segment reachable through the UI | PASS — 22/22 |
| Never more than one audible media element | PASS — max 1 |
| No failed network requests | PASS |
| No 4xx/5xx responses | PASS |
| No console or page errors | PASS |

This independently confirms, by machine, the behaviour the human walkthrough reported:
wrong answers play their own feedback and return to the same decision, and repeating the
same wrong answer plays the media every time.

---

## Deferred at release

Released 2026-08-21 on Luis's decision with real-device round 1 **not yet run**. This is a
deliberate, recorded deferral — **not waived**, and not a claim that it passed. It matches
the disposition taken on `ew-01`.

The earlier attempt did not reach round 1: the Mac served the package correctly with byte
ranges on `192.168.12.153:8913`, but the test phone could not reach it over the LAN. That
was not diagnosed.

| Item | State at release |
|---|---|
| iOS Safari, real handset | Not run |
| Android Chrome, real handset | Not run |
| Captions legible at phone width | Not checked on a phone |
| Functional acceptance **inside a Thinkific lesson** | Not run — the package has never been uploaded, by any pilot |
| R1-5 iOS opening audio (carried from claims-01) | Still open, still one data point |

**What this exposure actually is.** The package is static and self-contained, the routing is
verified 18/18 in a real browser engine, and the audio is the byte-identical locked master.
The realistic phone-only risks are iOS autoplay refusing the opening audio — which the
locked Start gate is expected to have already fixed — and caption legibility at phone width.
Neither can corrupt the deliverable; both would be player-side fixes at $0.00 with no
re-render, because pipeline rule 8 keeps text and UI out of the video.

**Close it at the earliest of:** the pilot review, or the first time this package is opened
on a phone. Two clean handsets close R1-5 for all three pilots at once.

---

## Known open, not fixed in this release

**Residual boundary frames on `fb-3c` and `intro`.** Recorded, deliberately not acted on,
and explicitly out of scope for this release. No spend was authorised against it.
