# Stage 9 — Split, remux, conform

**Cost $0.00. Every rule here exists because it was got wrong once.**

```bash
node scripts/lipsync-deliver.mjs --lesson <lesson-id> --call <n>
```

## The order of operations

1. **Cut each segment at the MIDPOINT of the surrounding silence** — 0.240 s before the
   narration starts and 0.240 s after it ends. **Never at the audio onset.**
2. **Move the video cut ONE FURTHER FRAME (40 ms) EARLIER.**
3. **Trim to whole frames, ROUNDING UP** one frame, so video covers audio.
4. **Discard LatentSync's returned audio and remux the locked 24 kHz master.**
5. **Split by RE-ENCODING at the cut.**
6. **Conform every output to exactly 1920×1080 / 25 fps.**
7. Write the per-asset sidecar.

## Why 0.240 s, and why not the onset

**LatentSync articulates BEFORE the sound.** Measured on Curtis's call 4: the mouth is
already open at return frame 913 while the first audible sample is at frame 919.3 — about
**6 frames / 250 ms of anticipation**. Cutting at the audio onset lands inside that window,
so whether a delivered first frame shows closed lips or open teeth depends on the segment's
first phoneme. **A coin toss, not a rule.**

**0.240 s is the only usable value:** 10 mp3 frames (24 ms each at 24 kHz) **and** 6 video
frames (40 ms each at 25 fps). Anything else leaves a fractional frame on one side.

## Why the extra frame — the mp3 decoder priming delay

**The delivered MP4 compensates the video track's encoder delay in its edit list but NOT the
audio track's.** The master's samples land at **0.286 s** rather than the nominal 0.240 s, so
picture ran **40 ms ahead of sound on every segment**.

Verified two ways: by locating the master PCM at 0.286 s, and by cross-correlating mouth
motion against the audio envelope over **17,638 frames** — peak lag moved **+40 ms → 0 ms**,
residual ~6 ms. **40 ms is exactly where a viewer starts to notice, and a viewer did.**

`DECODER_DELAY_FIX_FRAMES = 1` in `scripts/lipsync-deliver.mjs`.

## The delivered audio

`10 silent mp3 frames + the locked master + 10 more`, concatenated with `-c copy`.
**The master's frames are never re-encoded.** Assert **containment at byte 3840** rather than
whole-payload equality — that is a *stronger* proof of pipeline rule 4, not a weaker one.

**Measure integrated LUFS over the narration window only.** The 0.48 s of added digital
silence moved siu-01's `resolution-3` from −24.5 to −24.8 without touching a sample.

## Four rules that each cost something to learn

- **Trim rounds UP.** Trimming down to a frame boundary left audio extending ~73 ms past the
  last video frame.
- **Split by RE-ENCODING at the cut.** A stream copy snaps to the nearest keyframe and
  desyncs the remuxed audio.
- **Build batch audio in PCM / 24 kHz mono WAV, never by concatenating mp3.** An mp3 join
  carries encoder delay and padding at every seam and drifts the split offsets.
- **The 0.64 s lead-in is discarded here.** The first segment of every batch is cut from
  `LEAD_IN_S`, not from 0.

## Captions do NOT get an offset

**Cue timing is NOT shifted by +0.240 s. That instruction was wrong** and it shipped inside
all 22 siu-01 sidecars before being cleared at release.

Cues tile the **delivered asset**: the first starts at 0 and the last ends at `video_dur_s`,
which is exactly what the lesson test suites assert. The lead silence is *inside* the first
cue. Offsetting pushes the last cue past the end of the video and fails the suite.

If you find the superseded text in an old sidecar, it lives in a
`caption_offset_note_superseded` field. Leave it there; it is the record of what was cleared.

## The sidecar

Per asset, `public/media/<lesson-id>/<segment>.mp4.json`. Required fields and the "measure,
do not derive" rule: `../reference/provenance-and-sidecars.md`.

**Nothing committed may contain `batch_audio_url`, `hosted_at` or `image_url`.**

## Stop conditions

- Video duration is less than audio duration on any segment.
- The remuxed audio is not byte-contained in the locked master.
- Any output is not exactly 1920×1080 / 25 fps.
