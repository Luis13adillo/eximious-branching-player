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


---

# REVISION 2 — 2026-08-22 · VOICE RECAST, FULL RE-RENDER

## Final disposition — revision 2

Supersedes every disposition above. **Presenter 3's voice was recast on Roger's approval and
all 25 segments were re-rendered from scratch.** The narration text did not change by a
single character — `NARRATION_SHA256` is the same value revision 1 carried
(`54f55fcee0fc63dd…`). Everything that moved, moved because the voice moved.

| | |
|---|---|
| Status | **RE-DELIVERED 2026-08-22.** Both deliverables rebuilt and named per spec; functional acceptance **18/18** against the assembled package. Real-device round 1 remains **deferred, not waived** |
| Voice | **fal.ai → MiniMax `speech-02-hd`**, voice-design `ttv-voice-2026082200132526-qth65Vqj` ("LA-1-mexican-american"). Supersedes OpenAI `gpt-4o-mini-tts-2025-12-15` / `sage` |
| Package | `EA_ew-01_AV1`, zip **171.7 MB**, `index.html` at the archive root, 0 junk entries |
| Package SHA-256 | `a67b346710956d4b518410f6e20bfdb7f6752f22f0ca797b8ec700462489d3cf` |
| Source deliverable | `EA_ew-01_AV1_source.zip`, **262.8 MB**, 174 files. Agreement §2.3.1 |
| Source SHA-256 | `95914bdaf017996ad59660b2c91af18d866a1a48777aa6b5b13f751555e4fe33` |
| Segments delivered | **25/25** — 703.840 s (11.73 min) of video, 690.095 s of narration |
| **Gate A (corrected)** | **PASS — 25/25 on all nine rows** |
| **Gate B ASR fidelity** | **PASS — 25/25.** 1.004% WER, 18/25 transcribed exactly, every difference adjudicated |
| **Gate C mechanical** | **PASS — 7/7 calls, 25/25 segments** |
| **Gate C visual (by eye)** | **JUDGED 25/25** — see §Visual verdict |
| **Gate D functional acceptance** | **PASS — 18/18** |
| Masters byte-identical (rule 6) | **PASS** — 25/25 delivered mp4 + 25/25 narration mp3 match their sidecars; driving base unchanged; the v1 audition still hashes to `803de3e5…c96bb2` |
| Packaged audio (rule 4) | **PASS 25/25** — AAC-LC 128 kbps / 24 kHz / mono, sample-identical to the delivered master, −24.5 LUFS ±0.4 survives the package encode |
| Packaged video (rule 5) | **PASS 25/25** — exactly 1920×1080 / 25 fps |
| Packaged quality | **45.0–49.1 dB PSNR** at the 1.9 Mbps cap (lowest `assignment-4`, highest `fb-1c`) |
| Real devices | **DEFERRED — not run.** Unchanged from revision 1 |
| Thinkific upload | **NOT YET DONE** — true of all three pilots |
| Spend this revision | **$4.60** — see §Spend |

---

## Spend — revision 2

| Item | Amount |
|---|---|
| TTS, fal → MiniMax (10.638 billable units = 10,638 characters, incl. one redraw) | **≈ $1.06** |
| Gate B ASR read-back (whisper-1), run twice | **$0.138** |
| Control + isolated-window adjudication transcriptions | **≈ $0.02** |
| LatentSync, 7 calls | **$3.5360** |
| ffmpeg · mastering · packaging · Gate D | **$0.00** |
| **Total** | **≈ $4.75** |

**On the TTS figure.** fal bills MiniMax per 1,000 characters and returns the count in the
`x-fal-billable-units` response header. Those counts are recorded per segment in
`_gate-a-summary.json` and total **10.638 units** — that number is authoritative. The dollar
conversion is our own estimate; **read the fal billing record for the settled figure.**
This is strictly better than the retired OpenAI route, where audio-out tokens were billed
and never counted at all.

---

## Gate B — the one real defect, and how it was caught

The ASR read-back flagged nine segments. Eight were transcriber artifacts. **One was real.**

`rejoin-2a` rendered **"voir dire"** — a legal term of art, in an expert-witness course — as
something the transcriber heard as "voie de rue". Cross-checked against the v1 audio, which
transcribes it correctly, so it was this render, not the phrase.

**The isolated window is what settled it.** Whole-segment transcripts smooth in both
directions:

| | full read-back | isolated 1.4 s window |
|---|---|---|
| v1 (known good) | "voir dire" | "Vordir" |
| v2 bad draw | "voie de rue" | **"Vote the way"** |
| v2 accepted draw | "voir dire" | **"voir dire"** |

Three fresh draws of the clause on the identical config all said it correctly, so it was one
bad draw, not the voice. Remedied by the pipeline's own generate-and-verify rule, now scripted
as `scripts/redraw-verify.mjs`. The script redraws on the **same locked config**, checks the
isolated window, and only replaces the master once a draw passes both the phrase check and the
full audio gate.

**A trap this exposed and closed.** The rejected draw was still sitting at `<id>.raw.mp3` in
the scratch directory, so `tts-narration.mjs --remaster` — documented as free and safe —
would have silently restored the bad reading and passed every audio gate doing it. The
redraw script now promotes the accepted draw to be the canonical raw and renames the rejected
one.

### The eight adjudicated artifacts

| Segment | Difference | Why it is not a defect |
|---|---|---|
| `intro` | "if it stuck" → "if it's stuck" | Same smoothing on the v1 audio |
| `assignment-1` | "twenty-two", "eleven" → "22", "11" | Our normaliser explodes numerals into digit words; a correct reading cannot match |
| `assignment-2` | "&" → "and"; "Ferrin Haulage" mangled; "a.m." → "am"; "Her estate" → "Parastate" | v1 mangles the proper noun too; the isolated window reads "Her estate" correctly |
| `decision-2` | "end terminal" → "and terminal" | Near-homophone, adjudicated on v1 in the same phrase |
| `fb-2c` | "twenty" → "20" | Same normaliser artifact |
| `rejoin-2b` | "lapsed" → "lapse" | v1 transcribes identically — the transcriber merges the article |
| `fb-3a` | "plaintiff's firms" → "plaintiffs firm's" | Apostrophe placement, same tokens |
| `resolution-1` | "boundary" → "boundaries" | Full-sentence smoothing; correct on the window and on v1 |

---

## Gate C visual verdict — re-judged in full, by eye

All 25 segments re-judged from scratch: a verdict recorded against v1's frames is worthless
here because every file and every cut moved. The sidecars' carried verdicts were correctly
marked **STALE** by `lipsync-deliver.mjs` at delivery and all 25 were replaced.

Judged on per-call contact sheets re-tiled at ~2.8× (a 180×110 mouth crop scaled to 500×306,
four tiles per row). **known-mistakes #18 is binding: no mouth claim came from a pixel metric.**

| | closed | parted |
|---|---|---|
| First frame | 1 (`fb-3a`) | 24 |
| Last frame | 4 (`fb-2d`, `fb-3a`, `rejoin-2a`, `rejoin-3`) | 21 |

**Framing: PASS.** Judged against the approved driving base's own first frame — identity,
environment, framing, wardrobe and lighting identical; no drift, zoom, crop or warping.

**Articulation: PASS.** Twelve consecutive frames through a speaking stretch show varied,
natural mouth shapes.

**The parted-lips condition is unchanged from revision 1 and is still an open item for
Roger.** It is visible only on a held frame — behind the Start control, or while a decision
overlay is up — never during playback. A player-side fix costs $0.00 and re-renders nothing
(pipeline rule 8).

---

## One assertion was corrected, and the media was not

The re-delivery failed one lesson test: `rejoin-3`'s video is **16 ms shorter than its padded
audio**.

**The media is right and the assertion was wrong.** `audio_dur_s` is the narration *plus* the
0.24 s of digital silence the splitter cuts in on each side. A call's return can end a frame
before that padded length, leaving the tail of the trailing *silence* without a picture —
nothing a learner can see or hear, because the player has already advanced. Every narration
sample has a frame; the pipeline's own mechanical row `frames_cover_narration` passes.

Checked against what has already shipped: **`siu-01` carries the same condition on `fb-1d`
(−48 ms) and `rejoin-2` (−40 ms)** and passed review. `claims-01` and ew-01 v1 have none.

The assertion now tests the guarantee the pipeline actually makes — video covers the
**narration** — and additionally bounds any pad shortfall at two frames, so this cannot
quietly become "the last word has no picture". Buying another LatentSync call to recover a
fraction of a frame of silence would have been $0.37 for nothing.

---

## What else this revision fixed

**The Gate A fidelity preflight was disarmed on this lesson, and nobody knew.**
`ew-01-av1.narration.ts` had lost its per-segment `scriptChars` / `scriptSha256` fields when
the module was regenerated against the measured durations at the v1 delivery. Those two
fields are the only thing `tts-narration.mjs` checks before sending a character to a paid
provider — without them a drifted script would have been spoken aloud and billed. Restored
from the **unchanged** text (the combined fingerprint and total character count both still
match), and a test now keeps them.

**`claims-01-av1.narration.ts` has the same gap and was deliberately left alone** — it is
outside this task. It should be repaired before that lesson is ever re-rendered.

**Two new reusable scripts**, both written for the 267-video catalog rather than this pilot:
`scripts/gate-a-adjudicate.mjs` (the corrected Gate A verdict, which had been applied by hand
until now) and `scripts/redraw-verify.mjs`. Plus `scripts/rewire-narration.mjs`,
`scripts/stamp-visual-qa.mjs` and `scripts/refresh-gate-a-summary.mjs`.

---

## Still open after revision 2

| Item | State |
|---|---|
| Roger confirms the new voice | **Not confirmed.** It is materially lower in pitch than what he approved before |
| iOS Safari / Android Chrome, real handsets | Not run — deferred, not waived |
| Functional acceptance inside a Thinkific lesson | Not run — the package has never been uploaded, by any pilot |
| First-frame mouth position | Open for Roger — player-side, $0.00 |
| Exhibit photographs for the two evidence scenes | Open for Roger — content decision |
| **MiniMax `voice_id` durability across Selena's 42 courses** | **Carried risk, not solved.** Account-scoped, non-deterministic to recreate. Mitigation is to render early and keep the raws |
