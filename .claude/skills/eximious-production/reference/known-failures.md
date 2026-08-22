# Known failures and proven fixes

**38 traps already paid for once.** Read this before writing any generation or QA script.
At 267 videos any one of them scales into hundreds of dollars or an acceptance failure.

## Pipeline faults — these clip or corrupt real deliverables

1. **LatentSync floors output to a multiple of 16 frames** — up to **0.6 s of narration is
   silently cut from the end of every segment**. In production that clips the last word of a
   feedback branch: an acceptance failure invisible until a learner hits it. Pad *past* the
   next 16-frame boundary (+~0.20 s margin), then trim after.
2. **Pad at 25 fps, always.** LatentSync normalises to 25 fps regardless of input. A draft
   that padded onto an *exact* 0.64 s block boundary would have dropped a whole block on
   **6 of 8 calls**, because a 24 kHz mp3 cannot land exactly on one.
3. **LatentSync returns AAC 16 kHz.** Discard it and remux the locked 24 kHz master, or
   −24.5 LUFS never reaches delivery.
4. **Trim rounds UP.** Trimming down to a frame boundary left audio extending ~73 ms past the
   last video frame.
5. **Split by re-encoding at the cut.** A stream copy snaps to the nearest keyframe and
   desyncs the remuxed audio.
6. **Build batch audio in PCM / 24 kHz mono WAV, never by concatenating mp3.** An mp3 join
   carries encoder delay and padding at every seam and drifts the split offsets.
7. **Calibrate TTS gain against a probe encode, not the raw input.** A decode→re-encode
   generation costs a uniform ~0.5 dB, so calibrating on the input lands ~0.5 dB low and
   fails a ±0.3 gate.
8. **Kling ignored every camera instruction at `cfg_scale: 0.5`** and applied a continuous
   push-in across 10 s, wasting a $0.50 take. Raise `cfg_scale`, and state the camera
   constraint as an **outcome** ("framing at the last frame is identical to the first"), not
   as a style note.
9. **Kling lifts exposure ~9.5%.** The correction is a per-frame **multiplicative gain** in
   **16-bit** (`format=gbrp16le`) — an 8-bit round trip costs 0.32/255 of identity versus
   0.003/255 at 16-bit. Conditional, not automatic.

## Measurement faults — the media was fine; the metric lied

10. **A fixed box on the face measures head drift, not eyelids.** This produced an entirely
    wrong blink analysis, including the headline rate. Track the face first, then crop the eye
    apertures at the tracked offset.
11. **Do not classify silence by RMS threshold for lip-sync.** A plosive closure (/p/, /t/,
    /b/) is a near-silent frame with *maximal* mouth movement.
12. **Do not correlate mouth motion against audio RMS.** A sustained vowel is loud with a
    nearly still mouth.
13. **Render the mouth box onto a real frame before trusting it.** A variance-map box took in
    cheek, jaw and chin, so head movement counted as mouth motion.
14. **Never score frames the split discards.** The 0.5 s gaps and the 0.64 s lead-in never
    reach a delivered asset.
15. **Measure against a control.** The non-speaking base gives the floor a closed mouth
    produces. Delivered silence should sit near that floor, not at zero.
16. **ASR read-back smooths rare words and drops spoken digits.** Whisper reported
    "defensively" for "defensibly" and 8 digits for a 9-digit claim number — **both audio were
    correct.** Confirm with an isolated-word render before believing a fidelity failure.
17. **The F0-onset row is not calibrated.** A known-good approved asset sits exactly on the
    boundary. Its real purpose is catching an onset near *half* body pitch. State it as
    **≥0.75× body**.
18. **Mouth-region pixel change cannot tell speech from expression.** Test "lips closed" with
    lip aperture and with your eyes at 4×.

## Process faults

19. **Persist per-call metadata to disk at submit time.** A parallel runner discarded returned
    metadata and its log was truncated by a `tail` pipe, so **5 of 8 calls have
    `request_id: null` forever.**
20. **fal input CDN objects cannot be deleted by an ordinary account key** — `DELETE` and
    `PUT` return 403 under every auth scheme. Retention is settable **only at upload time**.
    One video alone left 9 permanent objects (~25 MB); naively across 267 that is ~2,400.
21. **fal does not validate the retention header.** A malformed
    `X-Fal-Object-Lifecycle-Preference` still returns **HTTP 200**, silently ignores the
    header, and yields a permanent undeletable object with no error anywhere.
    `scripts/fal-upload.mjs` **HEADs the object after upload and throws** if the expiry is
    missing or wrong. Always upload through it.
22. **Confidential narration must not leak through sidecars.** All 22 `*.mp4.json` carried a
    `batch_audio_url` pointing at a permanent fal object holding verbatim script narration,
    and `public/media/` is tracked. Removed. **Strip `hosted_at` / `image_url` from the
    motion-base sidecars too.**
23. **Never use litterbox or any anonymous public dump host.** Use authenticated fal storage
    scoped to our own account, with a neutral filename that leaks no identity.
24. **Rename a failed take immediately** (`…-takeN-REJECTED.mp4`) so it can never be picked up
    as the base for 51 courses.

## Added by the three delivered pilots

25. **A batch whose first segment starts at offset 0.000 is delivered on open lips.**
    LatentSync correctly opens the mouth on frame 0 to match the audio it was given. Lead every
    batch with **one full 16-frame block (0.64 s) of silence** and discard it at the split.
    **All four batch-opening segments of the already-approved Diane v4 set carry this defect.**
26. **Derive the block count from `content + 0.24 s`, not from `content`.** The returned video
    must extend past the last narration sample far enough to cut the trailing delivery pad, or
    **the last segment of a call cannot be split at all**. ew-01 call 5 returned 0.224 s of
    slack against a 0.24 s need: **$0.464 wasted.**
27. **The delivered MP4 compensates the video track's encoder delay but not the audio
    track's.** The mp3 master's samples land at 0.286 s rather than the nominal 0.240 s, so
    picture ran **40 ms ahead of sound** on every segment. Move the video cut one frame
    earlier. 40 ms is exactly where a viewer starts to notice — and a viewer did.
28. **`python3 -m http.server` cannot serve the package.** It answers byte-range requests with
    `200 OK` and the whole file, and serves one connection at a time, while a decision scene
    has **five videos in flight**. Every wrong answer spins forever. Use
    `scripts/serve-package.mjs`. **This was already written down in one QA log and was missed
    anyway.**
29. **A QA harness is a deliverable too — verify it before trusting a failure it reports.**
    Three real harness bugs: `serve-package.mjs` 404'd every file because `join()` normalised
    `./EA_x`; a metadata race made `acceptance-package.mjs` report "0/9 incorrect options
    played their own feedback" against a deployed origin while the same run said all 22
    segments were reachable; and the printed evidence string hardcoded one lesson's
    player-native scene ids for all of them.
30. **Measure, do not derive, the fields you write into a delivery record.** A frame-grid
    formula reproduced 20 of claims-01's 22 segments and disagreed on two. One disagreement was
    harmless; the other was a **real one-frame shortfall** where video did not cover audio.
31. **A green local build is not evidence a deploy works.** `export-thinkific/` is a separate
    workspace with its own install step, but the root `tsconfig`'s `"**/*.ts"` type-checked it
    anyway — passing locally only because its `node_modules` happened to exist. **Every
    production deploy failed for ten days** and nobody noticed, because a failed deploy leaves
    the previous build serving.
32. **Generated deliverables inside the repo break the repo's own build.** Each `_source.zip`
    carries a full copy of `src/` and `export-thinkific/`, so `EA_*` had to be excluded from
    the tsconfig.
33. **A luma-share metric cannot tell an open mouth from a closed one.** Calibrated on
    known-open and known-closed Curtis frames it separated them by **0.0000**.
34. **Keep the raw LatentSync return until delivery is signed off.** With it on disk a re-cut
    is $0.00. Diane's were not retained, which is the only reason her opening-frame defect
    costs ≈$2.37 instead of nothing.
35. **Estimate narration duration per presenter, not per project.** Selena runs 14.24 chars/sec
    against the two `tts-1-hd` voices' ~15.85. The batch plan is safe — the planner reads
    measured durations — but the stale rate produced **12 of 25 false `duration` failures** at
    her Gate A and mis-sizes any pre-flight cost estimate.
36. **Read a cost figure's units before quoting it.** `kling/v2-1-pro` is **$0.25 at 5 s**, not
    $0.50. And `gpt-4o-mini-tts` bills audio-out tokens the repo's price model never counted.
37. **The repo quotes file sizes in two different units** — MiB in one QA log, decimal MB in
    the delivery records, for the same files. Against a **200 MB** ceiling that is the
    difference between "10 MB of room" and "none". **Assume decimal, and measure rather than
    quote.**
38. **A zip rebuild changes the hash even when the contents are identical** — zips embed file
    timestamps. If a digest has already been sent, record **both**; do not overwrite one.

---

## Accepted tolerances — recorded so they are NOT re-raised as failures

- **Blink rate marginally under the 13–20/min floor.** Diane 13.25, Curtis 12.67, Selena
  12.97. All three ACCEPTED as documented non-blocking tolerances, deliberately **not**
  recorded as numeric passes. On a driving base the rate is a free build parameter, and the
  defect the target exists to catch is the opposite one (Diane's first base at 47.6/min).
- **Curtis's ~11.8 pp mouth-specific softness** from his beard. Invisible at player scale.
  **Do not act unless Roger rejects it at review.**
- **Two 3-frame direction legs in Selena's driving base** (1.0% of legs, 0.125 s each).
- **ew-01 first frame lips closed 2/25, last frame 9/25** — accepted at release by Luis.
  **Cause not established**: cut offset, silence length, block alignment, driving base and
  regeneration were each tested and each refuted. Not a timing offset.
- **claims-01's open first/last frames** — cut at the audio onset, predates the midpoint rule.
  Known open defect; her raw returns were not retained.
- **claims-01 `decision-3` carries one synthesised cloned frame**, recorded as synthesised.
- **Diane's head movement 0.42 px RMS.** She blinks and breathes but barely moves.
- **Caption cue timing is proportional, not force-aligned** — allocated by character count.
- **siu-01's "22/22 first and last frames closed" was NOT re-verified** in the ew-01 pass. If
  Roger raises the ew-01 finding, re-judging siu-01's 22 by the same method is the first thing
  to do — it decides whether this is Selena-specific or a standard applied loosely.
- **siu-01 residual boundary frames on `fb-3c` and `intro`** — recorded, out of scope.
- **Evidence scenes carry no exhibit photographs** (`EXHIBITS_DELIVERED = false`). A content
  decision for Roger.

## Rejected routes — do not rediscover them

- **Driving LatentSync from the demo's own footage.** It paints a mouth over a moving mouth.
  Rejected, and it cost ~$3.18 of rework on Diane.
- **`loop_mode: pingpong` actually firing.** It plays half of every blink backwards. The
  driving base exists to make it structurally impossible.
