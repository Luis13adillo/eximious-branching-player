# Eximious Pilot — Production Readiness + Cost Lock

**Date:** 2026-08-18 · **Scope:** 3-video paid pilot + 267-video projection
**Status of this document:** audit only. No media generated, no presenter asset touched, no code changed, nothing committed or pushed.

**Method.** Every number below was measured from this repository, from the controlled source PDFs, or read from a provider's own pricing data today. Where a figure is derived rather than read, it is marked **(est)** and the derivation is shown. Approved decisions were treated as closed and are not reopened.

---

## READINESS STATUS: **NOT READY**

Three things genuinely block paid production. Everything else is either done, or is unpaid build work that can proceed in parallel.

| # | Blocker | Blocks | Fix cost | Fix time |
|---|---|---|---|---|
| **B-1** | **The current lip-sync engine cannot produce 1080p.** `infinitalk/from-audio` accepts `resolution: 480p \| 720p` only — there is no 1080p option. The demo media is 1280×704. Agreement §1.4.1 / Spec §6 require 1920×1080 minimum. | All presenter media | $0 (route change) | ~0 — a 1080p-capable route already exists on our KIE key |
| **B-2** | **No pilot content is authored.** 0 of 3 pilot lessons exist as lesson data. The repo's `claims-investigation-application-1` is the water-damage template proof, not pilot content (Spec C-1). | All three pilots | $0 (labor) | The main build task |
| **B-3** | **Insufficient generation credit.** KIE balance is **1,853 credits = $9.27**. Video 1 alone needs ~$13–22. | Any paid generation | Top-up | Minutes |

Plus one **contractual/commercial finding** that is not a technical blocker but must be decided before batch production begins — see §4.5. It is the most important number in this document.

**Not blockers** (explicitly): presenter identities, appearances, voices, the dark visual direction, colour roles, fonts, AI disclosure, lower-third, reshuffle, identity-acknowledgment cadence. All client-approved and closed. Nothing in this report reopens them.

---

## 1. VISUAL MASTER GATE

### 1.1 Measured dimensions (read from the files, not from the spec)

| Presenter | Registered master | Actual pixels | Aspect | ≥1920×1080? | Exact 16:9? |
|---|---|---|---|---|---|
| **Diane Marchetti** | `public/media/presenter-diane.jpg` | **1920×1088** | 1.7647 | ✅ yes | ❌ no (8 rows tall) |
| **Curtis Whitfield** | `public/media/presenter-2-curtis-whitfield-master.png` | **1672×941** | 1.7768 | ❌ **no** | ❌ no |
| **Selena Navarro** | `public/media/presenter-3-selena-navarro-master.png` | **1672×941** | 1.7768 | ❌ **no** | ❌ no |
| Selena — standing (course pages / title cards) | — | **not present on disk** | — | ❌ | — |

### 1.2 New finding — Diane is also off exact 16:9

The Production Spec flags Curtis and Selena (F-1, F-2) but records nothing about Diane. Diane's master is **1920×1088**, not 1920×1080. It **clears** the "1080p minimum" floor on raw height, so it is not a compliance failure — but it is **not 16:9**, and reaching exact 1920×1080 means removing 8 pixel rows (0.7% of height).

Per the spec's own F-2 logic, cropping an approved master is a deliberate choice that needs to be recorded, not made silently. So the same fit decision applies to all three presenters, not two.

### 1.3 What is actually required — and a scope question worth raising

Read strictly, **A §1.4.1 and B §6 require 1080p *output*.** They govern the delivered video. They do not, on their face, specify the resolution of an input still. A 1672×941 still fed to a model that renders true 1920×1080 produces a contract-compliant deliverable.

The Production Spec (F-1) takes the stricter reading and treats the sub-1080p still as a render blocker. **I recommend keeping the stricter reading** — not because the looser one is wrong, but because compliant masters cost about **$0.10 total** and remove the argument entirely. It is the cheapest possible way to close a contractual question.

### 1.4 Exactly what remains

1. **Produce a 1920×1080+ master for Curtis** that reproduces the approved appearance exactly.
2. **Produce a 1920×1080+ master for Selena** (seated/speaking version), same constraint.
3. **Supply and register Selena's standing asset** at 1920×1080+ (course pages / title cards only — never the speaking video). Not currently on disk in any form.
4. **Record the fit decision** (pad vs. crop) for all three, Diane included.

**Recommended method — upscale, do not regenerate.** The gap is 1672→1920, a **1.148× scale**. That is small enough that a precision (non-generative) upscaler reproduces the approved appearance rather than reinterpreting it. Regenerating from a prompt would risk drifting identity, wardrobe, lighting and environment — the exact things Roger approved.

- **Route:** KIE `topaz/image-upscale` — **10 credits ($0.05) per ≤2K image** *(verified)*. Precision/photo model, not the generative one.
- **Cost:** 2 masters × $0.05 = **$0.10**. With retries and Selena's standing asset, budget **$0.30**.
- **Non-negotiable:** write to **new files**. The existing reference files stay byte-identical on disk as the approval record. Nothing is upscaled, cropped, recoloured or re-encoded in place. Verify by checksum after.

**Fit decision (needs one line of sign-off from Roger, not an approval round).** Upscaling 1672×941 to 1920 wide lands at 1920×1081 — one row over. Options: (a) drop 1 row, (b) pad 1 row. Diane needs the same call at 8 rows. My recommendation: **pad, do not crop** — padding adds nothing visible at these magnitudes and cannot be characterised as altering an approved composition, whereas cropping can.

**PASS/FAIL gate before anything downstream:** new master is exactly 1920×1080; side-by-side against the reference shows no change to identity, wardrobe, environment, framing, lighting or colour; original reference file checksum unchanged.

---

## 2. LOCKED PRESENTER RECIPES

Casting is closed. This section records the reproduction parameters only.

### 2.1 Shared standard — applies to all three

| | |
|---|---|
| **Audio format** | mp3, **24 kHz, mono, 128 kbps** *(verified — all three selected files probe identically)* |
| **Loudness** | **−24.5 LUFS integrated** *(verified by measurement: `assignment.mp3`, `fb-1a.mp3`, `resolution-1.mp3` all read −24.5)* |
| **Mastering** | Calibrated single encode from raw. Linear gain only, dynamics unchanged. |
| **Lower-third** | Fixed template constant `"Course Presenter"` — identical for all presenters |
| **Delivered video** | H.264, exactly **1920×1080**, 25 fps, baked audio |
| **Sidecar** | Every generated asset gets a same-basename `.json` recording model, voice, settings, instructions, seed, checksum |

### 2.2 Presenter 1 — Diane Marchetti · Claims & Coverage (Tracks 1, 4, 6, 10, 12 · 51 courses)

| | |
|---|---|
| Visual master | `public/media/presenter-diane.jpg` — **1920×1088**, original **dark office** (LOCKED) |
| Superseded, do not use | `presenter-diane-brighter-office-approval.png`, `presenter-diane-light-studio-approval.png` |
| Framing | Seated desk, dark office environment, as in the locked master |
| Voice provider / model / voice | **OpenAI · `tts-1-hd` · `shimmer`** |
| Voice settings | `speed: 1.0`, `response_format: mp3`. **`tts-1-hd` has no `instructions` parameter** — character comes from voice choice and script punctuation only |
| Measured rate | **15.53 chars/sec ≈ 155 wpm** *(est — derived from demo caption text ÷ media duration)* |
| Lip-sync method | See §3. Current demo assets used InfiniTalk at 720p and **must not be reused for pilot delivery** |

> **Registration gap (minor, fix before Video 1):** Curtis and Selena each have a `*-SELECTED.json` sidecar carrying full reproduction parameters. **Diane has none.** Her parameters exist only in a code comment (`src/lib/lessons/claims-investigation-application-1.ts:66`) and in the spec prose. For a 267-video catalog spanning years, write `presenter-1-diane-marchetti-voice-SELECTED.json` in the same shape. This is documentation of an already-approved voice, not a re-approval.

> **Known inconsistency (already recorded, unresolved):** `intro-vo.mp3` sits at **−21.3 LUFS** against the −24.5 standard. Diane's other production narration is correct. Do not carry the −21.3 file into pilot delivery; the standard is −24.5.

### 2.3 Presenter 2 — Curtis Whitfield · Investigation & Fraud (Tracks 5, 7, 8, 9, 15 · 32 courses)

| | |
|---|---|
| Visual master | `public/media/presenter-2-curtis-whitfield-master.png` — **1672×941, reference only, NOT production-resolution** |
| Framing | As approved in the reference file — reproduce exactly, do not reinterpret |
| Voice provider / model / voice | **OpenAI · `tts-1-hd` · `onyx`** |
| Voice settings | `speed: 1.0`, `response_format: mp3`. No `instructions` parameter on this model |
| Selected audio | `presenter-2-curtis-whitfield-voice-SELECTED.mp3`, SHA-256 `8e26f505…b1439f`, 15.576 s, −24.49 LUFS |
| Measured rate | **16.24 chars/sec ≈ 166 wpm** *(measured from the selected take)* |
| Pilot | `siu-01` AV1 — Delacroix |

### 2.4 Presenter 3 — Selena Navarro · Professional Practice & Business (Tracks 2, 3, 11, 13, 14 · 42 courses)

| | |
|---|---|
| Visual master (speaking) | `public/media/presenter-3-selena-navarro-master.png` — **1672×941, reference only**. Tighter seated-desk version |
| Visual master (standing) | **Not on disk.** Course pages / title cards only — never the speaking video |
| Voice provider / model / voice | **fal.ai → MiniMax · `speech-02-hd` · voice-design `ttv-voice-2026082200132526-qth65Vqj`** — ⚠️ **RECAST 2026-08-22**, supersedes `OpenAI · gpt-4o-mini-tts-2025-12-15 · sage`. See `CLAUDE.md` "★ RECAST 2026-08-22" |
| Voice settings | `voice_setting: {speed 1, vol 1, pitch 0}`, raw requested at 44.1 kHz / 256 kbps mono. **MiniMax takes no `instructions` parameter.** The retired `instructions` string is preserved in `…-voice-SELECTED-v1-sage-superseded.json` |
| Selected audio | `presenter-3-selena-navarro-voice-SELECTED.mp3` (the LA-1 audition), SHA-256 `7400b977…577ee7`, 10.913 s. Superseded take: `…-v1-sage-superseded.mp3`, SHA-256 `803de3e5…c96bb2`, 21.048 s, −24.49 LUFS |
| Measured rate | **14.32 chars/sec** *(measured across the 25 delivered ew-01 v2 masters, 690.1 s / 9,881 chars)*. Superseded `sage` figure was 13.73 chars/sec ≈ 137 wpm |
| QA baseline | **LA-1: 154.8 Hz body pitch on the audition, ~162 Hz across the delivered masters, 159 wpm, 0 pauses >0.9 s.** Superseded `sage` baseline: F0 median 181.8 Hz · onset 186.0 Hz · onset drop −4.2 Hz · stability CV 0.188 · drift −4.0 Hz |
| Pilot | `ew-01` AV1 — Prieto |

**Model split is client-approved and closed** (Spec §7 F-6): Diane and Curtis on `tts-1-hd`, Selena on `gpt-4o-mini-tts`. Two consequences to carry operationally: the catalog spans two OpenAI TTS models (one extra deprecation surface), and Selena's `instructions` string must be sent on **every** call for all 42 of her courses.

### 2.5 Reusable parameters required for consistency across 267 videos

Per presenter, these must be identical on every call, forever:

1. Model id (pinned — including Selena's dated snapshot)
2. Voice id
3. `speed` (Diane, Curtis)
4. `instructions` string, byte-exact (Selena)
5. `response_format: mp3`
6. Post-encode: 24 kHz / mono / 128 kbps, normalised to −24.5 LUFS by linear gain only
7. The approved 1920×1080 visual master (once produced)
8. The presenter's base performance clip(s) and their seeds (see §3)
9. Lower-third constant `"Course Presenter"`

---

## 3. CHEAPEST PROVEN PRODUCTION PIPELINE

Priority order as instructed: **required quality → reliability → reproducibility → cost.** Existing credentials reused throughout; nothing new is proposed. Available keys: `OPENAI_API_KEY`, `KIE_API_KEY`, `FAL_KEY`, `GOOGLE_AI_STUDIO_KEY`, `WAVESPEED_API_KEY`.

### 3.1 The finding that changes the pipeline

**InfiniTalk cannot deliver 1080p.** Its API accepts `resolution: 480p | 720p` — those are the only two values, and it caps at 15 seconds per generation *(verified from KIE's API schema and pricing data)*. The existing demo media is 1280×704, which is why. The current pipeline is structurally incapable of meeting the contract, and no amount of retrying fixes it.

### 3.2 1080p-capable lip-sync routes compared (all pricing verified today)

| Route | Provider | Max res | $/sec | $/min | Notes |
|---|---|---|---|---|---|
| **`volcengine/video-to-video-lip-sync`** | **KIE (have key)** | **1080p** | **$0.040** | **$2.40** | Video-in. Server-side loop incl. **reverse loop**. No stated duration cap |
| `kling/ai-avatar-pro` | KIE (have key) | 1080p | $0.080 | $4.80 | Still-in. Marketing copy says 15 s/gen; API doc says audio ≤5 min — **conflict, see §7** |
| `kling/ai-avatar-standard` | KIE | 720p | $0.040 | $2.40 | Non-compliant |
| `infinitalk/from-audio` | KIE | **720p** | $0.060 | $3.60 | **Non-compliant** — current route |
| `infinitalk/from-audio` | KIE | 480p | $0.015 | $0.90 | Non-compliant |
| `kling-video/ai-avatar/v2/pro` | fal.ai (have key) | — | $0.115 | $6.90 | 44% dearer than the same family on KIE |
| `sync-lipsync/v3/image-to-video` | fal.ai | — | $0.133 | $8.00 | |
| `veed/fabric-1.0` | fal.ai | **720p** | $0.150 | $9.00 | Non-compliant and dearest |

**KIE credit rate: 1 credit = $0.005 USD** *(verified from KIE's own pricing data).*

### 3.3 Recommended toolchain

| Stage | Tool | Why | Cost |
|---|---|---|---|
| **Script → lesson data** | Hand-authored TypeScript `Lesson` objects in `src/lib/lessons/` | Branching is fully data-driven (`src/lib/branching/types.ts`) — adding decisions/options/feedback needs **zero** code change | $0 |
| **TTS — Diane, Curtis** | OpenAI `tts-1-hd` (`shimmer` / `onyx`), speed 1.0 | Locked. Proven — fixed the masculine-onset defect that `gpt-4o-mini-tts` caused here | **$30/1M chars** |
| **TTS — Selena** | OpenAI `gpt-4o-mini-tts-2025-12-15` (`sage`) + locked `instructions` | Locked, client-approved exception | $0.60/1M text-in + $12/1M audio-out |
| **Audio QA** | `ffmpeg ebur128` + `ffprobe` locally | Free, deterministic, already the measurement method used for the approved takes | $0 |
| **Presenter master** | KIE `topaz/image-upscale` (precision) | 1.148× upscale preserves the approved appearance; generative models would not | $0.05/image |
| **Presenter base loop** | KIE `kling-3-0` Pro, no audio, from the 1920×1080 master | 1080p; **generated ONCE per presenter**, reused across all 267 videos | $0.09/s |
| **Lip-sync** | **KIE `volcengine/video-to-video-lip-sync`**, `mode: lite`, `align_audio: true`, `align_audio_reverse: true` | Only route that is 1080p, has no 15 s cap, and is cheapest. `lite` mode is specified for single-person frontal video — exactly our case | **$0.04/s** |
| **Conform + grade** | Remotion (already a devDependency) or ffmpeg | `remotion/IntroSegment.tsx` **already loops a 10 s Kling clip over 33 s of narration with the brand grade** — the architecture is prototyped in this repo | $0 |
| **Exhibit imagery** | Nano Banana 2 (Google direct) or GPT Image 2 via fal | ~3 photographic exhibits per video; the other on-screen cues are text cards the player renders | ~$0.05/image |
| **Interactive player** | Existing Next.js player in `src/` | Reusable, data-driven, 51/51 tests passing | $0 |
| **Thinkific delivery** | `export-thinkific/` → self-contained HTML5 zip | Already produces `index.html` at archive root, no external calls | $0 |

**Not recommended:** HyperFrames. Its CLI is not installed and it is not part of this repo's proven path. Remotion is already wired up (`npm run remotion`) and already solves the compositing problem here. Adding a second motion framework buys nothing.

### 3.4 Why `align_audio_reverse` matters

The lip-sync model loops the source clip when the audio runs longer. A forward-only loop of a 10-second clip produces a visible jump every 10 seconds. `align_audio_reverse: true` loops **forward-then-backward**, so the seam is continuous. That single parameter is what makes a short one-time base clip viable as the source for an entire 267-video catalog.

### 3.5 Primary vs. fallback

- **Primary:** volcengine v2v at $0.04/s. Half the cost, no duration cap, identity fixed by the base clip.
- **Fallback if v2v fails the quality gate:** `kling/ai-avatar-pro` at $0.08/s. Doubles lip-sync cost and inherits the unresolved 15 s question — but it needs no base clip and re-anchors identity to the approved still on every call.

**Decide this on Video 1, at Gate D, before any batch spend.**

---

## 4. COST MODEL

### 4.1 Verified pricing (read from providers today)

| Item | Rate | Source |
|---|---|---|
| OpenAI `tts-1` | $15.00 / 1M characters | developers.openai.com/api/docs/pricing |
| **OpenAI `tts-1-hd`** | **$30.00 / 1M characters** | same |
| **OpenAI `gpt-4o-mini-tts`** | **$0.60 / 1M text-in tokens · $12.00 / 1M audio-out tokens** | same |
| **KIE credit** | **$0.005 USD** | kie.ai pricing data |
| KIE `volcengine/video-to-video-lip-sync` | 8 cr/s = **$0.040/s** | kie.ai model page |
| KIE `kling/ai-avatar-pro` | 16 cr/s @1080p = **$0.080/s** · 8 cr/s @720p | kie.ai model page |
| KIE `infinitalk/from-audio` | 12 cr/s @720p = $0.060/s · 3 cr/s @480p | kie.ai model page |
| KIE `kling-3-0` | Pro no-audio 18 cr/s = **$0.090/s** · Std 14 cr/s | kie.ai model page |
| KIE `topaz/image-upscale` | 10 cr = **$0.05** per ≤2K image | kie.ai model page |
| KIE `recraft/crisp-upscale` | 0.5 cr = $0.0025 | kie.ai model page |
| fal `kling-video/ai-avatar/v2/pro` | $0.115/s | fal.ai model page |
| **KIE balance (today)** | **1,853 credits = $9.27** | live API call |
| WaveSpeed balance | 1 | live API call |

### 4.2 Derived volumes **(est)** — from the actual pilot scripts

Character counts extracted from `docs/source/pilot-scripts.pdf` with bracketed on-screen cues, headers and the A–D option text removed (options are displayed, not spoken). Seconds = characters ÷ each locked voice's **measured** rate.

| Pilot | Presenter · voice | Spoken chars | Rate (ch/s) | Total narration |
|---|---|---|---|---|
| `claims-01` | Diane · `shimmer` | 7,411 | 15.53 | **477 s (7.95 min)** |
| `siu-01` | Curtis · `onyx` | 9,496 | 16.24 | **585 s (9.75 min)** |
| `ew-01` | Selena · `sage` | 10,314 | 13.73 | **751 s (12.52 min)** |
| **Total** | | **27,221** | | **1,813 s (30.2 min)** |

Segment-type split, measured across all three scripts:

| Segment type | Share of narration |
|---|---|
| Opening + assignment | ~9% |
| Decision questions + rejoin teaching blocks | ~15% |
| **Feedback segments (12 per video)** | **~76%** |

**This is the single most important structural fact in the cost model.** Three-quarters of all narration lives in feedback branches — and a learner hears only a fraction of them. Whether those branches are shot as presenter-on-camera or delivered as a title card with voiceover changes the whole project's cost by roughly 2×.

**On-camera / off-camera split (est):** treating the 9 wrong-answer feedback segments as title-card + voiceover over 1920×1080 exhibit stills, and everything else as presenter-on-camera:

| Pilot | On-camera | Off-camera (VO) | On-camera share |
|---|---|---|---|
| `claims-01` | 284 s | 229 s | 55% |
| `siu-01` | 343 s | 292 s | 54% |
| `ew-01` | 498 s | 342 s | 59% |
| **Total** | **1,124 s** | **862 s** | **~57%** |

> This treatment is **script-supported** — every feedback segment already carries its own `[On screen: …]` title cue — but it is a **presentation decision Roger has not been asked about**. It is not a spec requirement and I am not treating it as decided. It is presented as a costed option in §4.5.

### 4.3 Unit costs

**Voice, per presenter-minute:**

| Presenter | Model | $/min | Basis |
|---|---|---|---|
| Diane | `tts-1-hd` | **$0.028** | 15.53 ch/s × 60 × $30/1M |
| Curtis | `tts-1-hd` | **$0.029** | 16.24 ch/s × 60 × $30/1M |
| Selena | `gpt-4o-mini-tts` | **~$0.015 (est)** | audio-out tokens dominate; + ~$0.004/video for the repeated `instructions` string |

Voice is a rounding error. It is under 1% of media cost and should never drive a pipeline decision.

**Lip-sync, per minute of on-camera presenter:**

| Route | $/min | 1080p? |
|---|---|---|
| **volcengine v2v (recommended)** | **$2.40** | ✅ |
| kling ai-avatar-pro (fallback) | $4.80 | ✅ |
| infinitalk 720p (current) | $3.60 | ❌ |

**Other generation:**

| Item | Cost | Frequency |
|---|---|---|
| Presenter 1080p master (Topaz upscale) | $0.05 each | **once per presenter, ever** |
| Presenter base performance clip (Kling 3.0 Pro, 10 s) | $0.90 each | **once per presenter, ever** (budget 3 candidates = $2.70) |
| Exhibit imagery | ~$0.05 each, ~3 per video | per video |
| Encode / conform / grade (ffmpeg + Remotion) | $0 | per video |
| Player, branching, captions, packaging | $0 | reused |

### 4.4 Pilot cost

**Pilot Video 1 — `claims-01` (Diane):**

| Line | Hybrid (~57% on camera) | Full on-camera |
|---|---|---|
| TTS (7,411 ch × $30/1M) | $0.22 | $0.22 |
| Base performance clip, 3 candidates | $2.70 | $2.70 |
| Lip-sync @ $0.04/s | 284 s → $11.34 | 477 s → $19.09 |
| Exhibit imagery (~3, 2 attempts) | $0.30 | $0.30 |
| **Subtotal** | **$14.56** | **$22.31** |
| **+40% pilot-phase failure allowance** | **≈ $20** | **≈ $31** |

**All three pilots:**

| Line | Hybrid | Full on-camera |
|---|---|---|
| Lip-sync @ $0.04/s | 1,124 s → $44.96 | 1,986 s → $79.44 |
| TTS, all three | $0.70 | $0.70 |
| Base clips, 3 presenters × 3 candidates | $8.10 | $8.10 |
| Presenter masters (Topaz, + retries) | $0.30 | $0.30 |
| Exhibit imagery (~10 assets) | $1.00 | $1.00 |
| **Subtotal** | **$55.06** | **$89.54** |
| **+40% pilot allowance** | **≈ $77** | **≈ $125** |
| *Same, on the fallback route ($0.08/s)* | *≈ $140* | *≈ $237* |

**Per video, after the pipeline stabilises** (pilot average: 662 s narration, 375 s on camera):

| Route | $/video |
|---|---|
| **v2v, hybrid (recommended)** | **$15.45** |
| v2v, full on-camera | $26.93 |
| avatar-pro, hybrid | $30.45 |
| avatar-pro, full on-camera | $53.21 |

### 4.5 267-video projection — **and the commercial finding**

| Route | 267 videos | +25% steady-state revision allowance |
|---|---|---|
| **v2v, hybrid** | **$4,125** | **$5,156** |
| v2v, full on-camera | $7,190 | $8,988 |
| avatar-pro, hybrid | $8,130 | $10,162 |
| avatar-pro, full on-camera | $14,207 | $17,759 |

**The Agreement is $8,000 fixed and inclusive** — labor, software, subscriptions, licensing, stock, avatar and voice licensing, rendering, platform (A §4, §5).

Set against that:

- **v2v + hybrid — $5,156.** The only combination that leaves real margin. Roughly **$2,840 for all labor across 267 videos.**
- **v2v + full on-camera — $8,988. Exceeds the entire contract value on media generation alone**, before a minute of labor.
- **avatar-pro (either) — $10,162 to $17,759. 1.3× to 2.2× the whole contract.**

**Sensitivity — this cuts both ways.** These three pilots are AV1s running 8–12.5 minutes of total narration each. The Agreement targets a **4–7 minute learner experience**, and a learner hears only some feedback branches — so the pilots may not be representative of the catalog average. If average total narration is ~7 minutes rather than ~11, the v2v-hybrid projection falls to roughly **$3,300 with allowance**, and v2v full-on-camera becomes survivable at roughly **$5,700**.

**What this means practically:** the pilot is cheap either way — $77 to $237 is not a decision worth agonising over. **The pilot's real job is to measure the true per-minute cost and the real average video length so the 267-video number stops being an estimate.** Instrument Video 1 accordingly: log actual billed credits per segment and actual rendered seconds.

**Recommendation:** produce Video 1 on **v2v + hybrid**, and also render two or three feedback segments **full on-camera** as an A/B. That costs about $3 extra and converts the single largest financial unknown in the project into a measured number with a client-visible quality comparison attached.

---

## 5. REUSE STRATEGY

### 5.1 Generated ONCE — ever, across all 267 videos

| Asset | Count | One-time cost |
|---|---|---|
| Presenter 1920×1080 visual master | 3 | $0.15 |
| Selena standing asset (course pages / title cards) | 1 | $0.05 |
| Presenter base performance clip(s), 1080p | 3 presenters × 1–3 | $2.70–$8.10 |
| Player, branching engine, decision/feedback/retry/rejoin logic | 1 | $0 |
| Locked template components (lower-third, AI disclosure, Exhibits label, A≠B comparison, four-icon rejoin card, progress rail, captions toggle, identity check) | 1 set | $0 |
| Thinkific export pipeline | 1 | $0 |
| Voice recipe per presenter (model, voice, settings, instructions) | 3 | $0 |
| **Total one-time media** | | **≈ $3 – $8** |

### 5.2 Generated PER VIDEO

| Asset | Per video |
|---|---|
| Narration audio, every segment (main + all 12 feedback branches) | ~9,000 characters ≈ $0.25 |
| Lip-synced 1080p presenter video, on-camera segments only | 375 s ≈ $15.00 |
| Exhibit imagery | ~3 assets ≈ $0.15 |
| Captions, lesson data, packaging | $0 (labor) |

### 5.3 Regeneration rules — what does NOT require touching presenter video

This is the architectural payoff, and it already holds in the current codebase. `src/lib/branching/types.ts` defines the lesson as a scene graph in data; `MediaSource` carries `videoUrl` / `audioUrl` as plain data. **No branching logic lives in any component.**

**Change freely — zero media regeneration:**

- Decision points: add, remove, reorder
- Option text, option count, correct-answer identity
- Feedback routing, retry behaviour, reshuffle-on-retry
- Rejoin targets and scoring
- Quiz content, pass threshold, completion copy
- All overlays: lower-third, AI disclosure, captions, progress rail, identity check
- Colours, fonts, spacing, dark-theme treatment, responsive layout
- Evidence tabs, Exhibits label, A≠B comparison, four-icon rejoin card
- Thinkific packaging and naming

**Requires regenerating one segment's audio + that segment's lip-sync clip:**

- Any change to *spoken* narration in that segment

**Requires regenerating a presenter's base clip (one-time, then re-lip-sync affected segments):**

- A change to the presenter's approved appearance, environment or framing — i.e. a new client approval, not routine work

**Hard rule to carry into the template lock:** never bake text, UI, branding, decisions, options, feedback or captions into generated video. The video carries the presenter speaking, nothing else. Everything a learner reads is rendered by the player. This is what makes 267 videos maintainable and what keeps a UI revision from costing a re-render.

---

## 6. VIDEO 1 PRODUCTION PLAN

### 6.1 Which pilot first: **`claims-01` AV1 — Marcus Delaney (Diane Marchetti)**

| Reason | |
|---|---|
| Only presenter whose master already clears the 1080p floor | 1920×1088 — Curtis and Selena are blocked on the master gate |
| Voice fully proven in production, not just auditioned | Shipped narration at −24.5 LUFS already exists |
| Simplest voice recipe | `tts-1-hd` + `shimmer`, no `instructions` string to get wrong |
| Shortest script | 7,411 chars vs 9,496 / 10,314 — cheapest place to discover pipeline faults |
| Least contentious visual fit decision | 8 rows, vs a full upscale for the others |

Curtis and Selena's master production (§1.4) runs **in parallel** — it is $0.10 and gates nothing on Video 1.

### 6.2 Exact sequence, with PASS/FAIL gates before every paid step

**Gate 0 — Content lock** *(unpaid)*
Author `claims-01` AV1 lesson data verbatim from the Pilot Script: opening/assignment, 3 decisions × 4 options, 12 feedback segments, 3 rejoins with the four-step summary card, resolution, quiz hand-off, and every bracketed on-screen exhibit cue.
**PASS:** every spoken line matches the script word for word; all 12 options route to their own distinct feedback; retry returns to the same decision; all paths rejoin; `npm test` green.
**FAIL → stop.** Do not spend a cent on narration for a script that is still moving.

**Gate A — Narration** *(~$0.22)*
Generate all segments: `tts-1-hd` · `shimmer` · speed 1.0 · mp3. One call per segment. Write a sidecar `.json` per file.
**PASS:** every segment exists; correct model/voice/speed in every sidecar.

**Gate B — Audio QA** *(free, and the most valuable gate in the chain)*
For every file: `ffmpeg ebur128` + `ffprobe` + F0 analysis.
**PASS:** −24.5 ±0.3 LUFS · 24 kHz / mono / 128 kbps · true peak ≤ −3 dBFS · no onset pitch drop (the `6692f8a` masculine-onset defect) · no internal pause >0.9 s · no truncation · no flat/silent frames.
**FAIL → regenerate that segment. Never send failing audio to a paid lip-sync call.** Audio is ~1% of cost; lip-sync is ~97%. Every fault caught here is caught at 1% of its downstream price.

**Gate C — Presenter base clip** *(~$2.70, one-time for Diane, reused forever)*
Conform Diane's master to exactly 1920×1080 (pad, per §1.4). Generate 3 candidate 10 s clips: KIE `kling-3-0`, Pro, no audio, subtle idle motion, seeds recorded.
**PASS:** exactly 1920×1080 after conform · identity, wardrobe, environment, lighting unchanged vs the approved master · motion subtle and loopable · no hands/face artefacts · no drift over 10 s.
**FAIL → regenerate.** Pick one, record its seed, register it as Diane's locked base clip.

**Gate D — Lip-sync pilot slice** *(~$1.20 — the decision gate)*
Run **three representative segments only** (one short, one ~15 s, one ~25 s) through `volcengine/video-to-video-lip-sync`: `mode: lite`, `align_audio: true`, `align_audio_reverse: true`.
**PASS:** output is exactly 1920×1080 · lip-sync accurate across all three lengths · **loop seam invisible on the 25 s segment** · identity matches the approved master · audio intact and in sync · no frame artefacts.
**FAIL → switch to `kling/ai-avatar-pro` at $0.08/s and re-run this gate before proceeding.**
This is where the route is decided, for **$1.20**, before the other ~$12 and before anything is committed for 267 videos.

**Gate E — Full lip-sync run** *(~$11.34)*
All remaining on-camera segments. Optionally 2–3 feedback segments rendered full on-camera as the A/B (§4.5, ~$3).
**PASS:** every segment 1920×1080 · consistent grade and identity across segments · no seam artefacts · durations match their audio within 0.1 s.

**Gate F — Media QA + conform** *(free)*
ffmpeg conform, brand grade, encode: H.264 high, exactly 1920×1080, 25 fps, AAC audio, CRF targeted so the package stays under ~100 MB.
**PASS:** every asset probes exactly 1920×1080 · one audio stream per file · loudness preserved · total package size within budget.
*(Reference: the 720p demo package is 19 MB for 296 s of media. At 1080p and pilot length, expect roughly 85 MB — comfortable, but worth watching.)*

**Gate G — Player integration** *(free)*
Wire media into the lesson data. Ship the outstanding template components: **Exhibits label** above evidence tabs, **configurable A≠B comparison**, **four-icon rejoin summary card**, and reconfigure **`IdentityCheck` from `everyScenes: 6` to exactly once per video** (all four confirmed still missing in the current code).
**PASS:** all four present and data-configurable · `npm test` green · no regression in the reshuffle / sound-model / static-export suites.

**Gate H — Branching QA** *(free)*
**PASS:** all 12 options route to their own distinct feedback · wrong answer returns to the same decision with tried options marked · correct answer required to advance · all paths rejoin · resolution plays · quiz hands off · one identity acknowledgment per video, exactly · AI disclosure appears once at the opening and never returns · captions toggle works · exactly one audio source at all times, no dead segments, no manual muting (A §2.2).

**Gate I — Thinkific QA** *(free)*
Build via `export-thinkific/`, zip with `index.html` at the archive root, name `EA_claims-01_AV1.zip`, upload to a real Thinkific Multimedia lesson.
**PASS:** plays start to finish in Thinkific · no external network calls · all branching intact · **real-device pass on iOS Safari and Android Chrome** (B §4 requires real devices; headless does not satisfy it) · video top / content stacked beneath on narrow screens · options thumb-tappable · legible without pinch-zoom.

**Gate J — Delivery package** *(free)*
Assemble `EA_claims-01_AV1_source.zip`: full player source, per-video config/data, every raw video and audio file as discrete assets, and the written documentation required by A §2.3.1.

### 6.3 Total exposure for Video 1

**≈ $15 to produce, ≈ $20 with a 40% failure allowance.** The route decision for the entire 267-video catalog gets made at Gate D for **$1.20**.

---

## 7. BLOCKERS

Only items that genuinely prevent production. No resolved approval is reopened.

### Hard blockers

**B-1 — InfiniTalk cannot produce 1080p.** `resolution` accepts `480p | 720p` only; 15 s cap per generation. Contract requires 1920×1080 (A §1.4.1, B §6).
→ **Fix:** switch to `volcengine/video-to-video-lip-sync` ($0.04/s, 1080p) with `kling/ai-avatar-pro` ($0.08/s) as fallback. Both on the existing KIE key. **Cost to fix: $0.** Decided at Gate D.

**B-2 — No pilot content is authored.** 0 of 3. `claims-investigation-application-1` is the water-damage template proof and must not be used as pilot content (Spec C-1).
→ **Fix:** author all three from the Pilot Scripts. Unpaid labor, and it is the critical path.

**B-3 — Insufficient generation credit.** KIE balance **1,853 credits = $9.27**; Video 1 needs ~$15–20; all three pilots ~$77–125.
→ **Fix:** top up KIE. Suggest **$150** to cover all three pilots plus failure allowance without a mid-run stall.

### Blocks Curtis and Selena only — not Video 1

**B-4 — No 1920×1080+ master for Curtis or Selena.** Both 1672×941 (Spec §7 F-1, §4 C-12a).
→ **Fix:** Topaz precision upscale to new files, **$0.10**. Runs in parallel with Video 1.

**B-5 — Selena's standing asset does not exist.** Locked designation (course pages / title cards) with no file to attach it to.
→ **Fix:** supply or produce at 1920×1080+. Blocks Selena's course pages, not `ew-01` AV1's speaking video.

### Blocks delivery, not media generation

**B-6 — Four locked-template components still missing** *(verified absent in code today)*: Exhibits label · configurable A≠B comparison · four-icon rejoin summary card · `IdentityCheck` still defaults to `everyScenes: 6` instead of once per video.
→ **Fix:** Gate G. Unpaid. Does not block any media generation.

**B-7 — Delivery packaging not produced:** `EA_[slug]_AV[n].zip` naming, `_source.zip`, and the A §2.3.1 documentation.
→ **Fix:** Gate J.

**B-8 — Real-device mobile QA never run.** B §4 requires iOS Safari + Android Chrome on real hardware before delivery; only headless testing has been done.
→ **Fix:** Gate I.

### Flagged, not reconciled

**F-A — Kling AI Avatar duration conflict (unresolved).** KIE's pricing copy says "up to 15 seconds per generation"; KIE's API schema for the same model says audio "duration cannot exceed 5 minutes". These cannot both be true. Only matters if Gate D forces the fallback route — resolve it then with a single cheap test, do not assume either way.

**F-B — Presenter master aspect ratios (extends Spec F-2 to Diane).** None of the three masters is exact 16:9: Diane 1920×1088 (1.7647), Curtis and Selena 1672×941 (1.7768). The fit decision — pad or crop — should be recorded once for all three. Recommend padding. Needs a line of sign-off, not an approval round.

**F-C — Scope reading on the 1080p floor.** The Agreement requires 1080p *output*; the Production Spec applies it to input stills as well. The stricter reading is the right one to keep, but the distinction should be conscious. At $0.10 to comply, it is not worth arguing.

**F-D — Diane has no voice sidecar.** Curtis and Selena each have full reproduction parameters registered on disk. Diane's exist only in a code comment and spec prose. Write one before Video 1.

**F-E — `intro-vo.mp3` is −21.3 LUFS** against the −24.5 standard. Already recorded; do not carry it into pilot delivery.

**F-F — No separate storyboard document exists.** A §1.2 references "complete approved script + storyboard". The only visual direction supplied is the 64 bracketed `[On screen: …]` cues inside the Pilot Scripts, of which ~8 require produced photographic exhibits and the rest are text cards. Treating the cues as the storyboard is reasonable — flagging it rather than reconciling it silently.

**F-G — Stale dependency in the export.** `export-thinkific/package.json` still lists `@fontsource-variable/fraunces` and `@fontsource-variable/inter`, and its README still describes fonts inlined as data URIs, though the code correctly uses Georgia / Segoe UI system fonts now. Cosmetic; clean up during Gate J.

---

## Summary

| | |
|---|---|
| **Readiness** | **NOT READY** — 3 hard blockers, all cheap and fast to clear |
| **Recommended toolchain** | OpenAI TTS (locked per presenter) → ffmpeg/ebur128 QA → Topaz upscale → Kling 3.0 Pro base clip (once) → **KIE `volcengine/video-to-video-lip-sync` @ $0.04/s, 1080p** → Remotion/ffmpeg conform → existing Next.js player → `export-thinkific` HTML5 zip |
| **Video 1** | `claims-01` AV1 (Delaney / Diane) — **≈ $15, ≈ $20 with allowance** |
| **All 3 pilots** | **≈ $55, ≈ $77 with a 40% allowance** (hybrid, v2v) |
| **Per video, stabilised** | **$15.45** (v2v hybrid) → $53.21 (avatar-pro, full on-camera) |
| **267-video projection** | **$5,156** (v2v hybrid, +25%) → $17,759 (worst case) **against an $8,000 fixed-inclusive contract** |
| **One-time media, all presenters** | **≈ $3–8** |
| **Route decision point** | **Gate D, for $1.20** |
| **Do not proceed until** | pilot content is authored · KIE is topped up · Gate D has chosen the lip-sync route |

_No media generated. No presenter asset modified. No code changed. Nothing committed or pushed._
