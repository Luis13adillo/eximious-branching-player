# EW-01 AV1 — Real-device QA log

Interactive Video Production Guidelines §04 requires that real-device testing
record **device, browser, viewport, defects and final disposition**. This is that
record for `EA_ew-01_AV1` (Selena Navarro, Prieto expert-witness case). It follows
the same form as `REAL_DEVICE_QA_CLAIMS_01.md` and `REAL_DEVICE_QA_SIU_01.md`, so
the three pilots can be compared directly.

Package under test: the assembled Thinkific HTML5 package `EA_ew-01_AV1/`
(**168.8 MB**, zip **176.3 MB**, 30 files, `index.html` at the archive root) — the
deliverable itself, not the development app. Built 2026-08-21:

```bash
cd export-thinkific
EXPORT_LESSON_SLUG=ew-01-av1 npm run build
EXPORT_PACKAGE_NAME=EA_ew-01_AV1 EXPORT_MAX_VIDEO_MBPS=1.9 node assemble.mjs
cd ../EA_ew-01_AV1 && zip -r -X ../EA_ew-01_AV1.zip . -x '*.DS_Store' -x '__MACOSX*'
```

**Serving requirement** (inherited, and it has already cost this project a day):
the LAN server must answer **HTTP byte-range requests**. A server that replies
`200 OK` with the whole file instead of `206 Partial Content` hangs the feedback
videos, because a decision scene preloads all four of its feedback clips and the
player then has five videos in flight at once. Observed on siu-01 with
`python3 -m http.server`. Use the range-capable server:

```bash
node scripts/serve-package.mjs ./EA_ew-01_AV1 8914
# then open http://<LAN-IP>:8914 on the device
```

---

## Final disposition

| | |
|---|---|
| Status | **RELEASED FOR DELIVERY 2026-08-21 by Luis.** Both deliverables built and named per spec; functional acceptance 18/18 against the package; desktop walkthrough done and signed off by Luis. Real-device round 1 is **deferred, not waived** — see §Deferred at release. |
| Package | **BUILT 2026-08-21** — `EA_ew-01_AV1`, 168.8 MB, zip 176.3 MB, under Thinkific's 200 MB ceiling |
| Source deliverable | **BUILT 2026-08-21** — `EA_ew-01_AV1_source.zip`, 266.8 MB, 176 files. Agreement §2.3.1: player source, per-video config/data, discrete media, written docs. Asserted to carry no confidential material |
| Package smoke test | **PASS** — index 200, clip byte-range 206, poster 200, path traversal 404, ew-01 lesson baked into the bundle |
| **Gate D functional acceptance (A §2.2)** | **PASS — 18/18**, driven through a real browser against the assembled package. See §Gate D functional acceptance |
| Desktop walkthrough by a human | **PASS — 2026-08-21, Luis**, against the assembled package served locally. Watched through; accepted. |
| First-frame mouth state | **ACCEPTED by Luis at release** — "this is the best it is going to look." Recorded, not silently dropped; Roger may still raise it at the §4.1 pilot review |
| Real devices (iOS Safari + Android Chrome) | **DEFERRED at release — not run.** See §Deferred at release |
| Segments delivered | **25/25** — `public/media/ew-01-av1/`, 707.80 s (11.80 min) of video |
| Mechanical QA | **PASS — 25/25 segments, 12 rows each, all true** |
| Gate A (audio) | **PASS — 25/25**, corrected scoring 25/25 on all nine rows. See `public/media/ew-01-av1/_gate-a-summary.json` |
| Gate B (ASR script fidelity) | **COMPLETE — 25/25 segments carry an adjudication record.** The only pilot of the three that has this. claims-01 and siu-01 carry none. |
| Gate C — framing vs approved base | **PASS — 25/25**, identical composition, crop, colour and background; no zoom, drift, warping or invented detail outside the mouth |
| Gate C — articulation | **PASS — 8/8 calls**, mouth moves with varied shapes through speech; nothing frozen |
| Gate C — **first frame lips closed** | **FAIL — 2/25.** See §First-frame mouth state |
| Gate C — **last frame lips closed** | **FAIL — 9/25.** See §First-frame mouth state |
| A/V sync | **PASS.** A systematic ~40 ms audio-late defect was found and fixed; peak cross-correlation lag moved +40 ms → 0 ms over 17,639 frames |
| Lip-sync spend | **$3.5621** across 8 LatentSync calls |
| Unit tests | **205 passed / 1 skipped** on `ew-01-av1.test.ts` |

---

## Gate C visual QA — recorded 2026-08-21

Judged **by eye** against frame 0 of the approved driving base: at 2× on the contact
sheets from `scripts/lipsync-visual-qa.mjs`, and again at 3.5× on the mouth line for
every frame that read closed or marginal. **No pixel metric was used.** Known-mistakes
#18 is binding here, and Curtis's motion-base gate already proved why: a luma-share
metric calibrated on known-open and known-closed frames separated them by 0.0000.

Per-segment verdicts are now stored in each `*.mp4.json` sidecar under `visual_qa`,
stamped with the sha256 and cut offset they were judged against.

| Check | Result |
|---|---|
| Framing identical to approved base | 25/25 |
| Articulation — mouth moving, shapes varied | 8/8 calls |
| First frame lips closed | **2/25** — only `fb-1d`, `fb-3a` |
| Last frame lips closed | **9/25** — `decision-3`, `fb-1c`, `fb-2c`, `fb-2d`, `fb-3c`, `rejoin-1a`, `rejoin-2b`, `rejoin-3`, `resolution-3` |

### First-frame mouth state — OPEN, Roger's call

23 of 25 segments open on **parted lips with teeth visible** while the audio is
digitally silent, and 16 of 25 end the same way.

Why it matters at all: the first frame is what the learner sees held behind the
Start control, and again whenever a decision overlay is up. It is cosmetic, and it
is only ever visible on a **held** frame — in motion nothing reads wrong.

**Cause not established.** Cut offset, silence length, block alignment, driving base
and regeneration were each tested and each refuted. Two further facts belong on the
record:

- Selena's mouth also tracks her audio measurably less closely than the other two
  presenters (peak cross-correlation 0.177, against Curtis 0.315 and Diane 0.222).
  The A/V sync fix did not move it — 0.177 → 0.178 — so it is not a timing offset.
- siu-01's log records **22/22 first and last frames closed** under the same
  pipeline. That figure is as recorded; it was **not** re-verified in this pass,
  because the Curtis and Diane pilots are explicitly out of scope for this work.
  If Roger raises the ew-01 finding, re-judging siu-01's 22 by the same method is
  the first thing to do — it decides whether this is Selena-specific or a
  standard applied loosely the first time.

Any remedy belongs in the **player**, not in re-rendered media: pipeline rule 8
exists precisely so a presentation fix does not cost a re-render across 267 videos.
A poster frame or a held opening frame is a player change and costs $0.00.

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

### Acceptance checks (Agreement §2.2)

Rows marked **desktop PASS** were verified automatically against the package
(`scripts/acceptance-package.mjs`) — they still need confirming on a real handset,
because a headless desktop browser is not a phone.

| Check | Result |
|---|---|
| Plays start → finish | **desktop PASS** |
| All 12 options route to their own individual feedback | **desktop PASS** — 9 incorrect play their own distinct segment; the 3 correct verdicts are player-native by design |
| Retry returns to the same decision | **desktop PASS** — 9/9 |
| All paths rejoin | **desktop PASS** — all 5 rejoin segments reached |
| Every delivered segment reachable | **desktop PASS** — 25/25 |
| Audio clean — no extraneous audio, dead segments, or manual muting | **desktop PASS** — never more than one audible media element |
| Start gate: video does not autoplay on load; Start begins picture and sound together | **desktop PASS** |
| Captions legible at phone width | _needs a phone_ |
| First frame behind Start shows closed mouth | **Known FAIL on 23/25 — see above** |
| Evidence scenes render correctly with no exhibit image | _needs a look_ |

### Defects raised

| # | Defect | Severity | Disposition |
|---|---|---|---|
| | | | |

---

## Gate D functional acceptance — 18/18 PASS, 2026-08-21

Driven through a real Chromium browser against the **assembled package** served over the
range-capable server — not the dev app, and not the lesson data in isolation. Playback is
run at 16× so the routing is what is under test, not the wall clock.

```bash
node scripts/serve-package.mjs ./EA_ew-01_AV1 8914 &
npx tsx --tsconfig tsconfig.json scripts/dump-lesson-graph.ts /tmp/graph.json ew-01-av1
npm install --no-save playwright && npx playwright install chromium
node scripts/acceptance-package.mjs http://127.0.0.1:8914 /tmp/graph.json
```

The walk clicks **all 12 options** — every wrong answer at every decision, then the right
one — and checks each against the routing the lesson data declares.

| Check | Result |
|---|---|
| Does not autoplay at load | PASS |
| Start control present behind the opening frame | PASS |
| Start begins picture and sound together | PASS |
| All three decisions reached | PASS |
| 9 incorrect options each play their own feedback segment | PASS — 9/9 |
| Each incorrect option's feedback is distinct | PASS — 9 distinct |
| Each routes to the feedback its data names | PASS — 9/9 matched |
| Correct verdicts are player-native, no video | PASS — 3/3 by design (`fb-1b/2b/3b` carry no media) |
| Retry returns to the SAME decision | PASS — 9/9 |
| All paths rejoin, lesson plays start → finish | PASS |
| Every rejoin segment reached | PASS — 5/5 |
| Every delivered segment reachable through the UI | PASS — 25/25 |
| Never more than one audible media element | PASS — max 1 |
| No 4xx/5xx responses | PASS |
| No console or page errors | PASS |

**Two measurement traps recorded so they are not hit again.** Both produced convincing
false failures before they were caught:

1. **`document.querySelector("video")` returns a PRELOAD, not the stage.** While a decision
   is on screen `MediaPreloader` mounts four hidden muted `<video>` elements for the
   feedback clips, and they sit earlier in the DOM. Select the visible one — not inside
   `[aria-hidden]`, non-zero width — or every stage segment looks like it never played.
2. **A decision scene plays its own short segment while the options are already on screen**
   (`decision-1` is 2.24 s). Clicking the instant the panel appears cuts it off and the
   segment reads as unreachable. Let it finish, which is what a learner does anyway.

Also: `ERR_ABORTED` on a media URL is **not** a defect — a `<video>` that switches source,
or a preload the player cancels, aborts its in-flight range request by design. The check
that matters is that nothing returns 4xx/5xx.

---

## Deferred at release

Released 2026-08-21 on Luis's decision, with real-device round 1 **not yet run**. This is a
deliberate, recorded deferral, not an oversight and not a claim that it passed.

| Item | State at release |
|---|---|
| iOS Safari, real handset | Not run |
| Android Chrome, real handset | Not run |
| Captions legible at phone width | Not checked on a phone |
| Functional acceptance **inside a Thinkific lesson** | Not run — the package has never been uploaded, by any pilot |
| R1-5 iOS opening audio (carried from claims-01) | Still open, still one data point |

**What this exposure actually is.** The package is static and self-contained, the routing
is verified 18/18 in a real browser engine, and audio is the byte-identical locked master.
The realistic phone-only risks are (a) iOS autoplay refusing the opening audio, which the
locked Start gate is expected to have already fixed, and (b) caption legibility at phone
width. Neither can corrupt the deliverable; both would be a player-side fix at $0.00 with
no re-render, because pipeline rule 8 keeps text and UI out of the video.

**Close it at the earliest of:** the pilot review, or the first time this package is opened
on a phone. Record iOS version, device, Low Power Mode and silent-switch position in
§Round 1 above. Two clean handsets close R1-5 for all three pilots at once.

---

## Carried over from the other two pilots — check on this one too

**R1-5 · iOS Safari opening audio — OPEN on claims-01, untested on siu-01 and here.**
On claims-01 the opening audio did not play on an older iPhone / Safari while Android
Chrome was fine. It was deliberately not acted on: one older handset is not enough to
change production audio logic, and iOS gates autoplay on a user gesture in ways that
vary with iOS version, Low Power Mode, the silent switch and per-site Safari settings.

Since the start gate was locked, the learner's first interaction is the **Start** press
itself — a deliberate gesture — which may already resolve it.

**When testing on iOS, record:** iOS version, device, Low Power Mode state,
ringer/silent switch position, and whether audio starts after the Start press.

---

## Package size — solved inside the package, masters untouched

ew-01 carries **247.2 MB** of delivered mp4, against siu-01's 190.2 MB and
claims-01's 188.1 MB. A straight copy would have produced a package over the
**200 MB Thinkific ceiling**.

It is not a bitrate problem — ew-01 sits at 2.6–2.9 Mbps against siu-01's 2.5 Mbps,
both from `libx264 -preset slow -crf 18`. ew-01 is simply longer: 707.8 s across 25
segments against 586.9 s across 22.

`assemble.mjs` already handles this: `EXPORT_MAX_VIDEO_MBPS` re-encodes only the
copies that go **into the package**. Curtis needed 2.2 Mbps; ew-01 is longer, so it
needed **1.9 Mbps**, giving a 168.8 MB package — level with siu-01's 170.3 MB.

Three invariants verified after the build, not assumed:

| Invariant | Result |
|---|---|
| `public/media` masters byte-identical (rule 6) | **25/25** |
| Packaged audio identical to the locked 24 kHz / −24.5 LUFS master (rule 4) | **25/25** — `-c:a copy` |
| Packaged video exactly 1920×1080 / 25 fps (rule 5) | **25/25** |

Quality: **47.1–49.1 dB** PSNR against the delivered masters, and checked by eye at 3×
zoom on the mouth and jaw — lip detail, teeth, skin texture, hair strands and the
necklace chain are indistinguishable from the master, far beyond player scale.

**No delivered asset was rewritten, so the Gate C verdicts above still describe the
files on disk.**

### Defect found and fixed in the serving tool

The serve command both other QA logs tell you to run — `node scripts/serve-package.mjs
./EA_<name> <port>` — returned **404 for every file in the package**. `join()` normalises
`./EA_x` to `EA_x`, so the containment guard `file.startsWith(ROOT)` never matched.
`ROOT` is now resolved to an absolute path. Verified after the fix: index 200, clip
byte-range **206**, poster 200, `../package.json` still **404**. This affects all three
pilots' real-device testing.

---

## Known, accepted, not defects

- **Evidence scenes carry no exhibit image.** ew-01's two evidence scenes are
  authored around photographs the script cues on screen; `EXHIBITS_DELIVERED` is
  `false`, so they render as text-only cards. This is exactly how siu-01's three
  evidence scenes ship, and siu-01 passed its desktop walkthrough that way. Whether
  ew-01 needs real photographs when siu-01 does not is Roger's call, not a defect.
- **Segments open and close on 0.240 s of digital silence.** Deliberate: clips are
  cut at the midpoint of the silence between segments. A quarter-second of stillness
  at each transition is intended behaviour, not dead air.
- **Caption cue timing is proportional, not force-aligned.** Cue text is verbatim and
  tiles each segment exactly, but boundaries are allocated by character count rather
  than measured against the speech. Drift on long segments is a known limitation —
  worth recording if it reads badly on a phone.
- **Selena's voice is the locked `gpt-4o-mini-tts` / `sage` configuration.** A
  candidate Colombian-American voice was auditioned and preferred in the room, but
  adopting it changes both the voice and the provider and needs Roger's written
  approval under production rule 9. Not swapped in. Nothing in the repository
  references it.

---

## Two things this pilot exposed that are not ew-01 problems

Recorded here because they were found during this pass and are not otherwise written
down anywhere. **Neither was acted on** — both sit in the Diane and Curtis pilots,
which are out of scope for this work.

1. **`claims-01` sidecars no longer carry `split.video_dur_s`.** All 22 were rewritten
   in the working tree by a thinner writer that dropped `video_dur_s`, `video_start_s`,
   `frames` and `align_err_ms` and moved other figures under a new `measured` key. The
   result is **22 failing tests** in `claims-01-av1.test.ts` on the current working
   tree. siu-01 is unaffected (0/22 missing). This predates the ew-01 work and is
   visible in `git status` as 22 modified files.
2. **`siu-01`'s 22 sidecars still carry the stale caption-offset note**, telling a
   future run to offset caption cues by +0.24 s. Both shipped lessons and both test
   files require cues to start at 0 and end at `durationSec`, so following that note
   would fail the tests. Corrected on all 25 ew-01 sidecars and in
   `scripts/lipsync-deliver.mjs`; claims-01 never had it.
