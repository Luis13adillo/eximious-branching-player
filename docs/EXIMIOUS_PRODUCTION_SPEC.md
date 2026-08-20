# Eximious Academy — Consolidated Production Spec & Pre‑Pilot Gap Analysis

**Purpose.** Single source of truth for the paid three‑video pilot and the 267‑video production that follows. Consolidates the executed Agreement, Roger's Video Production Spec, and the three Pilot Scripts, and audits the current codebase against them.

**Status:** Documentation + pre‑pilot gap analysis only. No pilots rendered, no production media generated, no deployment, no major code changes made in producing this document.

_Last updated from the authoritative sources below. Where this document and the sources disagree, the **sources** govern — except the finalized visual direction in the LOCKED section immediately below, which is a later written client decision that supersedes the "lighter look" in Video Production Spec §7._

---

## ★ CLIENT APPROVED / LOCKED — Final Visual Direction

**Locked by Roger (latest written direction). This SUPERSEDES the "lighter look" in Video Production Spec §7 and any earlier statement anywhere in this document that suggested a lighter interface, light panels, off‑white backgrounds, or the brighter‑office Diane candidate.**

**Presenter environment — LOCKED.** Keep Diane's **ORIGINAL DARK OFFICE** environment. Do **not** use the brighter / light‑office candidate. Preserve the rich, premium, dimensional dark‑office appearance.

**Interface — LOCKED.** Keep the **dark interface / chrome / dark panels**. Do **not** convert panels or decision screens to light / off‑white backgrounds. Preserve the established premium dark visual hierarchy.

**Color roles — LOCKED.**
- **Sky blue `#7BAFD4` — secondary accent ONLY.** Uses: decision states, evidence / exhibit tabs, right / wrong feedback states, and comparable secondary interactive states where appropriate. Do **not** overuse; **never** a panel or background fill.
- **Gold `#C7A254` — primary (actions + progress).** Uses: primary actions, CTA / button emphasis, and progress indicators — **including buttons, the current‑step indicator, and the scrubber**.
- **Off‑white `#F4F7FA` — text / readability ONLY.** **Not** a panel or background color.

**Also CLIENT APPROVED / LOCKED (this round):**
- **Lower‑third = "Course Presenter"** (implemented; no instructor title / implied credential).
- **AI disclosure — CLIENT APPROVED / LOCKED** (approved wording, unchanged; no longer pending, not a release blocker). Behavior: **small type**, visually **secondary**, **bottom‑left of the video**, sits **immediately above the caption band** (just above the controls), **appears once at the beginning of the application video only**, **does not reappear** on later segments/scenes, **briefly appears then fades / unmounts** (~2–3s), and must **not overlap the captions or the "Course Presenter" lower‑third** (nor compete with Diane). Use the exact currently approved wording already implemented — do not reconstruct or paraphrase it.
- **12‑step case‑progress rail — approved.**
- **Captions — approved and working** (toggleable).

**Presenter 2 & 3 identities, visual direction AND voices — CLIENT APPROVED / LOCKED.** Roger approved the final identities, the exact approved appearance below, and both presenter voices (selected from blind auditions). **§6 is now closed — no client approvals remain open.** One technical gap persists: the registered image files do **not** yet meet the production-resolution requirement (see below and §7 F‑1).

| | Presenter 2 | Presenter 3 |
|---|---|---|
| **Name (locked)** | **Curtis Whitfield** | **Selena Navarro** |
| Track group | Investigation & Fraud (Tracks 5, 7, 8, 9, 15) | Professional Practice & Business (Tracks 2, 3, 11, 13, 14) |
| Courses | **32** | **42** |
| Pilot | `siu-01` AV1 (Delacroix) | `ew-01` AV1 (Prieto) |
| **Approved appearance — reference file** | `public/media/presenter-2-curtis-whitfield-master.png` | `public/media/presenter-3-selena-navarro-master.png` |
| Reference file resolution | 1672×941 — **BELOW the 1080p floor** | 1672×941 — **BELOW the 1080p floor** |
| Production-resolution master | ❌ **NOT YET REGISTERED** | ❌ **NOT YET REGISTERED** |
| Lower‑third | "Course Presenter" (same fixed template constant as Diane) | "Course Presenter" (same fixed template constant as Diane) |

**What is locked:** the **identity** (name, track group, allocation) and the **visual direction** (the approved appearance, environment, framing and styling shown in the reference files above).

**What is NOT locked / still open:**
- ⚠️ **The registered files above are approved-appearance REFERENCES, not final production-resolution masters.** Both are 1672×941, below the **1920×1080 minimum** required by A §1.4.1 / B §6. **Compliant 1920×1080-or-greater copies must be produced and registered before pilot render.** Until then the **media-resolution requirement for Presenters 2 and 3 is UNRESOLVED** (§7 F‑1, §4 C‑12a).
- ✅ **Voices are now CLIENT APPROVED / LOCKED** (selected from blind auditions):
  - **Curtis Whitfield — OpenAI `tts-1-hd`, voice `onyx`, speed 1.0.** Selected audio `public/media/presenter-2-curtis-whitfield-voice-SELECTED.mp3` (SHA-256 `8e26f505…b1439f`, 15.58 s, −24.49 LUFS).
  - **Selena Navarro — OpenAI `gpt-4o-mini-tts-2025-12-15`, voice `sage`, with a locked `instructions` string.** Selected audio `public/media/presenter-3-selena-navarro-voice-SELECTED.mp3` (SHA-256 `803de3e5…c96bb2`, 21.05 s, −24.49 LUFS).
  - Both preserved byte-for-byte from their auditions; neither was regenerated or re-encoded. Full reproduction parameters live in the matching `*-SELECTED.json` sidecars. **Selena's `instructions` string is part of her locked presenter definition** — the voice is not reproducible without it. See §7 F‑6 for the model split.

**Constraint on producing the compliant masters.** The approved **appearance** must be reproduced exactly — same identity, environment, framing, wardrobe, lighting and color. The existing reference files must **not** be regenerated, edited, cropped, recolored, enhanced, upscaled in place, or otherwise altered; they stay on disk unchanged as the approval record against which any 1920×1080+ master is checked.

- **Selena Navarro supersedes the earlier "Simone" working identity** — operationally and for all forward production. Simone is not a current identity under any circumstance; the Simone demo assets are retained solely as historical approval record (`docs/PRESENTER_VOICE_APPROVAL.md`).
- **Selena — seated version = speaking video.** Her approved speaking-video visual is the final **tighter seated-desk** version (the reference file registered above), with the approved office/window environment and appearance preserved exactly.
- **Selena — standing version = course pages / title cards.** Her previously approved **standing** version is designated for **course pages and title cards only**, never the speaking video. *(Registration gap: no standing asset is currently present in `public/media/`. The designation is locked; the file still needs to be supplied and registered.)*
- **Surnames requirement satisfied.** Spec §2's "professional first and last name" per presenter is now met for all three presenters.

### ★ LOCKED — Playback start behavior: NO autoplay at initial load

**Locked 2026‑08‑19. Applies to every one of the 267 application videos, not just
the pilots. This SUPERSEDES the earlier player behavior in which the opening
segment began playing (muted) as soon as the lesson loaded.**

**The rule.** An application video **must not begin playing automatically when
the lesson loads.** It opens on its first frame with a clear, labelled
Play/Start control. The learner's press is what starts it, and that single press
starts **picture and sound together** — there is no separate "tap for sound"
step and no period of silent moving video.

**After the start.** Once the learner has deliberately started the video, later
**segment transitions continue automatically**, exactly as before. The
deliberate start is asked for **once per application video**, never again inside
it. Places where the approved interaction flow already pauses — a decision, a
retry re‑entry, the presence check — are unchanged and still pause.

**Why it is locked.** Autoplay‑at‑load is muted by every current browser, so the
first thing a learner met was Diane speaking with no sound until they happened
to touch something. It also starts contractual content before the learner has
engaged with it. Requiring the start makes the opening deterministic on desktop
Chrome, mobile Chrome and iOS Safari alike, and removes the class of
"no audio on iPhone" reports entirely, since audio now always begins inside a
real user gesture.

**Implementation (template level, not per lesson).** `LessonPlayer`'s
`requireStart` prop, default **`true`**, carried into `useMediaClock`. Because it
is a template default, every future video inherits it with no per‑lesson
configuration. `false` is reserved for a deployment that must genuinely play
unattended (e.g. a kiosk loop) and is **not** approved for course delivery.

**What an unstarted stage shows.** The opening frame, the "Course Presenter"
lower‑third, the video controls, and the Start control. Nothing else: the AI
disclosure and the caption band belong to the video, and the video has not
opened yet. This is also what keeps the locked bottom‑left disclosure position
and the caption band clear of the Start control, which owns the centre of the
frame — on a phone the stage is barely 300 px tall and all three would
otherwise collide.

**Knock‑on rules that move with it, and nothing else:**
- **AI disclosure** — now appears when the **video** opens rather than when the
  page loads, and then holds ~2–3 s and fades exactly as approved. Wording,
  placement (bottom‑left, above the caption band), size, secondary styling,
  one‑appearance‑only and fade behavior are all **unchanged**. This is the
  faithful reading of "appears once at the beginning of the application video":
  timed from page load it could hold and fade while the lesson still sat
  unstarted, satisfying the requirement on paper only.
- **Captions** — the band is empty until the lesson starts, because nothing is
  being said yet. The toggle, styling, cue timing and behavior during playback
  are **unchanged**.
- **Identity acknowledgment (presence check)** — its 120 s countdown now arms at
  the start of the video instead of at page load. The interval, the triggers and
  the locked **exactly one per application video** budget are **unchanged**.
  Without this, a learner reading the case header for two minutes would spend
  the single acknowledgment before a frame had played, and the check would never
  fire during the lesson it exists to police.

**Unchanged by this rule:** captions during playback, video controls, branching, the 12‑step
progress rail, the "Course Presenter" lower‑third, exhibits, the evidence
inventory, the A ≠ B comparison, the process chain, retry reshuffle, the
completion hand‑off, and all generated media. **No media is re‑rendered by this
change** — it is player behavior only, which is exactly what locked pipeline
rule 8 (nothing baked into the footage) exists to make possible.

---

**Explicitly superseded / no longer in effect:** brighter‑office Diane as final · panels becoming light · off‑white used as a major panel/background · general lightening of the interface · **"Simone" as the Presenter 3 identity** · **autoplay at initial load (the video now waits for the learner's Start — see the locked rule above)**.

**Now also settled (not pending approval):** identity acknowledgment is **CLIENT APPROVED — exactly one per application video**; **fonts are decided** — Georgia (headings) / Segoe UI (body) per Spec §7 (current Fraunces/Inter is an implementation gap, not an open question); **pilot content is decided** — the supplied Pilot Scripts are authoritative (the water‑damage demo is a template proof, never pilot content); **Presenter 2 & 3 identities, visual direction and voices are CLIENT APPROVED / LOCKED** (Curtis Whitfield · `onyx` · Selena Navarro · `sage` — see the table above). **NO client approvals remain open.** See §6.

---

### ★ LOCKED — Production media pipeline (verified by two paid QA gates, 2026-08-18)

**Summary of record: `CLAUDE.md` (★ LOCKED). Step-by-step procedure: the Production
Playbook.** This section exists so that no reader of this spec can reach the media
pipeline through an obsolete route; where it and `CLAUDE.md` differ, **`CLAUDE.md`
governs**.

```
locked script → OpenAI TTS (per-presenter locked voice config)
  → ffmpeg master to 24 kHz / mono / 128 kbps @ −24.5 LUFS  → audio QA gate
  → [ONCE per presenter] KIE kling/v2-1-pro, 1920×1080, no audio → motion base
  → batch narration into calls of ≥40 s, pad past the 16-frame boundary AT 25 FPS
  → fal-ai/latentsync (loop_mode pingpong, seed recorded)
  → DISCARD LatentSync's returned audio; REMUX the locked 24 kHz master
  → split + conform to exactly 1920×1080 / 25 fps → player → Thinkific HTML5 zip
```

| | Locked value |
|---|---|
| Lip-sync engine | **`fal-ai/latentsync`** — no substitution without written approval |
| Motion base | **KIE `kling/v2-1-pro`**, generated **once per presenter**, reused across all 267 |
| Delivery | **exactly 1920×1080, 25 fps** |
| Returned lip-sync audio | **DISCARDED** (it returns AAC 16 kHz) |
| Delivered audio | the locked **24 kHz mono 128 kbps −24.5 LUFS** master, **remuxed** |
| Diane Marchetti | OpenAI `tts-1-hd` · `shimmer` · speed 1.0 |
| Curtis Whitfield | OpenAI `tts-1-hd` · `onyx` · speed 1.0 |
| Selena Navarro | OpenAI **`gpt-4o-mini-tts-2025-12-15`** (pinned) · `sage` · **+ the locked `instructions` string**, read byte-exact from `presenter-3-selena-navarro-voice-SELECTED.json` (§7 F‑6) |

⛔ **Not the pipeline, and not to be revived: `InfiniTalk` (KIE), HeyGen, or baking the
lip-sync model's returned audio into the delivery.** InfiniTalk caps at 720p against the
contractual 1920×1080 floor and costs ~12× more per second. Where this document mentions
InfiniTalk (audit row 16) it is describing the **superseded 2026-08 demo media**, never a
production route. Evidence: `docs/PRODUCTION_READINESS_COST_LOCK.md`,
`docs/LIPSYNC_QA_GATE_LATENTSYNC.md`, `docs/MOTION_BASE_PIPELINE_TEST.md`.

---

## 0. Authoritative sources (read for this analysis)

| # | Document | Local path (git‑ignored) | Notes |
|---|---|---|---|
| A | **Independent Contractor Agreement — Video Production (FULLY EXECUTED, Aug 11 2026)** — contractual authority | `docs/source/executed-agreement.pdf` | Signed by Roger M. Naut (Founder) & Luis Miguel Badillo. |
| B | **Eximious Academy — Video Production Spec** — production authority (supplements A: naming §2.4, presenter‑to‑track §1.3) | `docs/source/video-production-spec.pdf` | |
| C | **Eximious Academy — Pilot Scripts (3 Videos)** — pilot content authority | `docs/source/pilot-scripts.pdf` | Delaney / Delacroix / Prieto. |
| D | **Eximious Academy — Corporate Brand Guidelines** — corporate visual authority | `docs/source/eximious-corporate-brand-guidelines.pdf` | 19 pp. Logo, corporate palette, typography, institutional identity/imagery. |
| E | **Eximious Academy — Interactive Video Production Guidelines** — video‑production visual/system authority (inherits D) | `docs/source/eximious-video-production-guidelines.pdf` | 16 pp. Presenter treatment, player/interface, color roles, decisions, evidence/exhibits, feedback, progress, lower‑third, AI disclosure, captions, identity acknowledgment, responsive, media standards, 267‑catalog consistency. |
| — | This consolidated spec | `docs/EXIMIOUS_PRODUCTION_SPEC.md` | Consolidated implementation requirements + later client‑approved decisions. |
| — | Current repository | `~/Desktop/eximious-branching-player` | Audited. |

> All five source PDFs (A–E) are stored **local‑only and git‑ignored** (`docs/source/*.pdf`) — they contain the signed agreement (signatures/PII) and confidential brand/scripts. Never commit or push them. (Filename note: the supplied brand files were named `EximiousBrandGuidelines.pdf` = the **corporate** doc and `EximiousAcademyBrandguidelines.pdf` = the **video‑production** doc — i.e. swapped vs their names; registered here by **content**.)

**Source precedence** (if sources conflict, FLAG the conflict — do not silently reconcile):
1. **Executed Agreement (A)** — contractual authority.
2. **Video Production Spec (B)** — production authority.
3. **Pilot Scripts (C)** — pilot content authority.
4. **Corporate Brand Guidelines (D)** — corporate visual authority (logo, palette, typography, identity).
5. **Interactive Video Production Guidelines (E)** — video‑production visual/system authority; inherits D; governs presenters, player UI, interaction states, media treatment, responsive behavior, and consistency across all 267 videos.
6. **This consolidated spec** — consolidated implementation requirements + later client‑approved decisions.

**Brand‑authority reconciliation (this round):**
- **Palette — consistent, no conflict.** Corporate palette (navy `#0B1F3A`, deep navy `#07172A`, blue `#1D5FA8`, gold `#C7A254`, sky `#7BAFD4`, off‑white `#F4F7FA`) matches the locked player color roles.
- **Typography — RESOLVED.** Corporate (D) and Spec (B) both specify **Georgia (headings) / Segoe UI (body)**; the player now implements it (Fraunces/Inter removed from the app and the export). See §3 C‑2.
- **Video Production Guidelines (E) — fully consistent** with the locked decisions (dark player; gold = action/progress/current‑step/scrubber; sky = decisions/evidence/feedback; "COURSE PRESENTER"; 3×4 + individual feedback + reshuffle‑on‑retry + gated advance; 1 identity acknowledgment; toggleable captions; four‑icon rejoin; A≠B evidence comparison; 267 / 1080p / self‑contained HTML5).
- **One superseded item (not a conflict):** the registered Video Production Guidelines PDF (E) still marks the **AI disclosure "PENDING CLIENT APPROVAL"** (p8) and lists "Approved disclosure" as a release input (p16). Roger has since **APPROVED** it and the exact wording is already implemented, so this consolidated spec records the AI disclosure as **CLIENT APPROVED / LOCKED** and **no longer a release blocker**. The PDF is a fixed source and cannot be edited; the correction lives here.

These sources override prior chat history.

---

## 1. Authoritative facts (from A + B + C)

**Catalog & scope.** 267 interactive branching **application videos**, across 125 courses / 15 tracks (2–3 videos per course). Each video: narrated case study by an **AI presenter**, learner experience **~4–7 minutes**, following Company's complete approved script + storyboard. Structure is identical across all 267 (Agreement §1.2–1.3, §1.6 template lock).

**Per‑video structure (A §1.2, C).** 3 decision points × 4 options (A–D); **individual feedback for every incorrect option** (specific, not generic); **retry** returns the learner to the same decision until correct; confirmation feedback on the correct option; all paths **rejoin**; closing **resolution**; then hand‑off to the **graded course quiz**. "Three decision points per video, twelve feedback segments in total" (C).

**Presenters (B §2).** Three AI presenters, each covering 5 of the 15 tracks so a learner hears one consistent voice per track:
- **Presenter 1 — Diane Marchetti · Claims & Coverage** (Tracks 1, 4, 6, 10, 12 = 51 courses). Established; stays.
- **Presenter 2 — Curtis Whitfield · Investigation & Fraud** (Tracks 5, 7, 8, 9, 15 = 32 courses). **CLIENT APPROVED / LOCKED** — see ★ LOCKED.
- **Presenter 3 — Selena Navarro · Professional Practice & Business** (Tracks 2, 3, 11, 13, 14 = 42 courses). **CLIENT APPROVED / LOCKED** — see ★ LOCKED. Supersedes the earlier "Simone" working identity.
- Names for 2 & 3 were proposed **with the pilot** and are now **approved by Roger**; same lower‑third title **"Course Presenter."** Each presenter keeps one distinct voice, constant across their tracks.

**Pilot set (B §5, C).** Three videos, one per presenter, three tracks:
| # | Course · Video | Track | Presenter | Package |
|---|---|---|---|---|
| 1 | `claims-01` — Fundamentals of Claims Investigation · App Video **1 of 3** | Track 1 | Diane Marchetti | `EA_claims-01_AV1.zip` |
| 2 | `siu-01` — SIU Foundations & the Regulatory Framework · App Video **1 of 2** | Track 5 | Curtis Whitfield (Presenter 2) | `EA_siu-01_AV1.zip` |
| 3 | `ew-01` — Becoming a Retained Expert · App Video **1 of 2** | Track 11 | Selena Navarro (Presenter 3) | `EA_ew-01_AV1.zip` |

Pilot **content** (from C): #1 Marcus **Delaney** — burned Ford F‑250 theft/arson (claim 4471‑88203); #2 Marcus **Delacroix** — Ram 1500 arson referral; #3 Renata **Prieto** — expert‑witness engagement, _Doss v. Ferrin Haulage_.

**On‑screen identification (A §1.4, B §6).** Every video: (a) lower‑third reading **"Course Presenter"**; (b) small‑type AI line at the opening that fades: _"Your presenter is AI‑generated. All course content is authored by Roger M. Naut, drawn from 35 years in insurance claims investigation and adjusting."_ Both built into the locked template.

**Output & brand.** **1080p (1920×1080) minimum** (A §1.4.1, B §6). Brand navy `#0B1F3A`, gold `#C7A254`, logo (A §1.5). **Visual look — LOCKED to the DARK direction** (see the ★ LOCKED section above; supersedes Spec §7's "lighter look"): keep Diane's **original dark office** and the **dark interface / dark panels**. Sky `#7BAFD4` is a **secondary accent only** (decision states, evidence/exhibit tabs, right/wrong feedback, comparable secondary states); gold `#C7A254` stays **primary** (actions / CTA / progress indicators); off‑white `#F4F7FA` is **text only, never a background**. Full palette available for accents: navy `#0B1F3A` · navy‑deep `#07172A` · blue `#1D5FA8` · gold `#C7A254` · sky `#7BAFD4` · off‑white `#F4F7FA` (sky/blue tokens now in the theme; sky applied to decision states + evidence tabs). Fonts = **Georgia (headings) / Segoe UI (body)** — implemented (§3 C‑2). The Spec §7 "one still of Diane on a lighter backdrop" gate is now **resolved in favor of the dark original**; the brighter‑office candidate is **not used**.

**Template components carried across all 267 (B §6).** Exhibits label above evidence tabs · visual comparison "≠" (two images side‑by‑side under a line stating the conflict) · four‑icon summary card on rejoin (categories + takeaway) · "Course Presenter" lower‑third · AI‑disclosure line · toggleable captions · 1080p.

**Mobile (B §4).** Responsive, not a separate mode. Narrow screen reflows: **video at top full‑width, content panel (narration, options, feedback, case progress) stacks beneath**; thumb‑tappable options; legible without pinch‑zoom. Built into the locked template. **Pilots must be tested on a real phone (Safari iOS + Chrome Android) before delivery.**

**Delivery format (A §2, B §3).** Each video = self‑contained **HTML5 web package (.zip)** that uploads to and runs in a **Thinkific Multimedia lesson**; branching/feedback/retry intact; **not SCORM** unless requested in writing. Functional acceptance (A §2.2): plays start→finish, all 12 options route to their correct individual feedback, retry returns to same decision, all paths rejoin, audio plays cleanly with **no extraneous audio, dead segments, or manual muting**. **Source files** required per video (A §2.3, §2.3.1): full player source; per‑video config/data (decisions, options, feedback routing, retry); all raw video/audio as discrete files (main narration + every feedback branch); plus brief written docs so a competent dev can modify and re‑export without the contractor.

**Naming (B §3).** Delivered: `EA_[course-slug]_AV[n].zip` (slugs lowercase + two‑digit, e.g. `claims-01`, `siu-01`, `ew-01`, `spec-14`; `AV[n]` = the video number within the course). Source: `EA_[course-slug]_AV[n]_source.zip`. Internal media names kept from the demo build (`intro`, `decision-1..3`, `fb-1a..fb-3d`, `rejoin-1..3`, `resolution-1…`, `quiz`, image assets). Batches: one folder `EA_Batch-[n]`.

**Timeline & money (A §4, §5).** Total **$8,000 fixed inclusive** (labor, software, subscriptions, licensing, stock, avatar & voice licensing, rendering, platform). Milestones: (a) **$2,000 deposit** on execution — covers the **3 pilots + template build**; (b/c/d) **$2,000 each** on acceptance of production batches 1/2/3. Pilot: **3 videos within 10 calendar days of the deposit**; Company reviews within 5 business days; **pilot approval gates production**. Production: 3 batches of ~88, all 267 accepted **within 8 weeks of template approval**. 2 revision rounds per batch. **Template lock** after pilot approval (A §1.6): no change to presenters/voices/branding/structure/interaction without written approval.

**IP / licensing (A §7, §8).** Work made for hire; all videos + source = Company's exclusive property, transferring per accepted batch. Contractor **represents all avatars, voices, stock, music, and fonts are licensed for Company's commercial use** and that the work infringes no third‑party right (A §8.5), and that presenter avatars/voices are expected to remain available (A §7).

---

## 2. Requirement audit (classified)

Legend: **IV** = Implemented + Verified · **IQ** = Implemented / Needs QA · **P** = Partial · **NI** = Not Implemented · **RA** = Requires Approval.

| # | Requirement (source) | Status | Evidence / gap |
|---|---|---|---|
| 1 | **3 decisions × 4 options, individual per‑option feedback** (A §1.2, C) | **IV** | Engine + demo; all 12 branches route to distinct feedback (verified in prior browser tests). |
| 2 | **Retry‑until‑correct** (A §1.2) | **IV** | Engine `advance()`; wrong → same decision, correct required to leave. Verified. |
| 3 | **Reshuffle answer order after incorrect retries, preserving option identity/feedback** (goal) | **IV** (see conflict C‑5) | `src/lib/branching/shuffle.ts` + `DecisionPanel`; `data-option-id` keeps identity; 102/102 browser checks + 9 unit tests. **Not named in A/B/C** — see §3. |
| 4 | **Exactly 1 identity acknowledgment per application video** (CLIENT APPROVED) | **P** (approved; impl gap) | `IdentityCheck.tsx` exists; default `everyScenes: 6` still fires multiple times/video. **Now client‑approved** — reconfigure to fire **exactly once per video** (single checkpoint). Not pending approval. |
| 5 | **Responsive mobile: video top, content below** (B §4) | **IQ** | `LessonPlayer` reflows (desktop side‑by‑side → mobile stacked, stage on top). Headless mobile tested. **Real‑device QA on iOS Safari + Android Chrome not yet done** (B §4 requires it before delivery). |
| 6 | **Thinkific self‑contained HTML5 ZIP** (A §2.1) | **IV** (functionality); **NI** (naming/source pkg) | `export-thinkific/` produces a self‑contained zip, `index.html` at root, no external calls (104/104 verified). But delivery **naming** (`EA_claims-01_AV1.zip`) and the **`_source.zip`** package + docs (A §2.3.1) are not yet produced. |
| 7 | **Exhibits label above evidence tabs** (B §6) | **P** | `EvidenceStage` renders exhibit switcher chips, but no literal **"Exhibits"** heading/label above the tabs. Small addition. |
| 8 | **Configurable side‑by‑side comparison with "≠"** (B §6, C) | **NI** | Only a static "conflict note" inside one SVG illustration. No reusable, data‑configurable two‑image `A ≠ B` component. Pilot scripts require it (evidence‑vs‑account conflicts; pilot 3 LEFT‖RIGHT outcomes). |
| 9 | **Configurable rejoin summary cards (four‑icon)** (B §6, C) | **NI** | No summary‑card component. Scripts call for it (e.g. pilot 1 rejoin: "1. Issue 2. Burden 3. Standard 4. Evidence"). |
| 10 | **Toggleable captions** (B §6) | **IQ** | `VideoControls` has a captions toggle (`captionsOn`, 'c' key). Mechanism present; **per‑video caption content + QA** needed for production. |
| 11 | **DARK interface LOCKED; locked color roles applied** (★ LOCKED, supersedes B §7) | **IV** (this round) | Dark interface locked (no light‑panel redesign). `#7BAFD4` (+ `#1D5FA8`, `#D8E1EA`) added to the theme; **sky now the secondary accent** on **decision states** (option select/hover/badge + decision label) and **evidence/exhibit tabs**; **gold** stays primary (CTAs, progress rail, scrubber); off‑white text‑only. Correct/incorrect feedback kept **green/red** for visual distinction + accessibility (per E p11), not recolored to sky. "Lighten the interface" requirement remains **SUPERSEDED**. |
| 12 | **~~Brighter‑office Diane~~ → DARK original Diane LOCKED** (★ LOCKED, supersedes B §7) | **Resolved / SUPERSEDED** | **The ORIGINAL DARK-OFFICE Diane (`presenter-diane.jpg`) is the locked production base.** Both lighter explorations — `presenter-diane-brighter-office-approval.png` and `presenter-diane-light-studio-approval.png` — remain on disk **only as superseded historical exploration**; neither is the production base and neither may be used in production. |
| 13 | **"Course Presenter" lower‑third** (A §1.4, B §6) | **IV** (this update) | `MediaStage` now renders a fixed template constant `LOWER_THIRD_TITLE = "Course Presenter"` for every presenter/lesson; the data credential "Senior Claims Instructor" was removed from both lessons. No instructor title / implied credential remains. |
| 14 | **AI‑presenter disclosure line** (A §1.4, B §6; CLIENT APPROVED placement) | **IV** | `AiDisclosure.tsx` renders the exact contract copy (unchanged) **bottom‑left of the video, just above the controls** — small‑type, subtle/secondary, dark scrim for contrast. Shows **once on the opening segment only** (~2–3s, then fades and unmounts); rendered in `LessonPlayer`'s persistent stage wrapper (not keyed to scenes) so it **never reappears** on later segments — verified programmatically across 10 segment changes. Clear of Diane and the lower‑third. |
| 15 | **Existing audio / mute / single‑source must not regress** (A §2.2) | **IV** | Single persistent media element, one source at a time; 16/16 sound checks, watchdog `maxAudible=1`. |
| 16 | **1080p output** (A §1.4.1, B §6) | **MET for pilot 1** (Diane); open for pilots 2–3 (presenter stills) | ✅ **`EA_claims-01_AV1` ships 22/22 segments at exactly 1920×1080 / 25 fps** via the locked pipeline (see ★ LOCKED — Production media pipeline, and `docs/REAL_DEVICE_QA_CLAIMS_01.md`). ~~Current demo media is 720p (InfiniTalk, 1280×704)~~ — that describes the **superseded water‑damage demo asset only**, which is a template proof and must not be reused for delivery. Player is resolution‑agnostic. **Still open for pilots 2–3:** the Curtis and Selena approved-appearance reference files are 1672×941 — **no 1920×1080+ master exists for either presenter** (row 18, §7 F‑1). |
| 17 | **267 videos authored to full scripts** (A §1.1) | **NI** (content) | Template proven with 1–2 placeholder lessons. **0 of 267** production videos authored. Pilots #2/#3 not authored (see C‑1). |
| 18 | **3 presenters exist** (B §2) | **P + RA** (identity/visual approved; voice + resolution open) | **Identities and visual direction CLIENT APPROVED / LOCKED** — Diane Marchetti · **Curtis Whitfield** · **Selena Navarro** (see ★ LOCKED). Approved-appearance reference files on disk: `presenter-diane.jpg`, `presenter-2-curtis-whitfield-master.png`, `presenter-3-selena-navarro-master.png`. **Voices now APPROVED / LOCKED** — Curtis `onyx` (`tts-1-hd`), Selena `sage` (`gpt-4o-mini-tts-2025-12-15` + locked `instructions`); selected audio registered and byte-preserved. **RA cleared.** Remaining gap is media, not approval: **the Curtis and Selena reference images are 1672×941, below the 1080p floor — NO production-resolution master is registered for either** (see row 16 and §7 F‑1). Also unregistered: Selena's standing course-page / title-card asset. |
| 19 | **Source‑file deliverable + documentation** (A §2.3, §2.3.1) | **P** | Player source + per‑lesson data + discrete media exist in‑repo; a per‑video `_source.zip` with the required written docs is not assembled/named. |

---

## 3. Conflicts between Agreement / Spec / Scripts / Code

- **C‑1 — Pilot content — SETTLED (implementation gap, not an approval question).** The **supplied Pilot Scripts (C) are authoritative** for all three pilots. The repo's current `claims-investigation-application-1` (water‑damage / finished‑basement, case 2043‑RW) is a **template proof only — it is NOT pilot content and must not be used as such.** All three pilots must be authored **from the scripts**: `claims-01` → **Marcus Delaney** (burned Ford F‑250 theft/arson, claim 4471‑88203); `siu-01` → **Marcus Delacroix** (Ram 1500 arson referral); `ew-01` → **Prieto** retained‑expert case (_Doss v. Ferrin Haulage_). Pilots #2 and #3 don't exist in the repo yet. This is a build task, no client approval outstanding.
- **C‑2 — Fonts — RESOLVED (implemented).** Fonts are the authoritative **Georgia (headings) / Segoe UI (body)** (Corporate Brand Guidelines D + Spec §7). The player now uses them: `globals.css` `@theme` sets `--font-display: Georgia…` and `--font-sans: "Segoe UI"…` (system fonts, no web-font loading); the Fraunces/Inter `next/font` wiring was removed from `layout.tsx` and from the Thinkific export (`export-thinkific/src/main.tsx` + `styles.css`). Verified: computed heading font‑family = Georgia, body = Segoe UI. No longer a gap.
- **C‑3 — Identity acknowledgment — SETTLED (CLIENT APPROVED; implementation gap).** **Approved: exactly ONE acknowledgment per application video.** (It is a learner presence check, distinct from the Agreement's on‑screen AI identification.) No longer pending approval. **Implementation gap:** the component (`IdentityCheck.tsx`) currently fires on an interval (`everyScenes: 6`, multiple times/video) and must be reconfigured to fire **exactly once per video** (single checkpoint).
- **C‑4 — Lower‑third text — RESOLVED.** A §1.4 / B §6 require **"Course Presenter."** Implemented this update: the template renders a fixed "Course Presenter" title and the "Senior Claims Instructor" credential was removed from lesson data.
- **C‑5 — Reshuffle vs template‑lock (LOW).** Reshuffle‑on‑retry is a real approved decision (goal) and is implemented, but it is **not named** in A/B/C. Since A §1.6 locks "interaction design" across all 267 after pilot approval, reshuffle should be **written into the spec** so it's part of the approved locked template rather than an unapproved deviation.
- **C‑6 — Lighter interface — RESOLVED (reversed).** B §7's "lighter interface / lighter Diane backdrop" was **superseded** by Roger's later written direction (see ★ LOCKED): the **dark** interface and **dark‑office** Diane are the approved, locked look. The only remaining styling work is applying the locked color roles (sky `#7BAFD4` as a **secondary accent**, not a background), not lightening anything.

No conflicts found between the Agreement and the Spec themselves; the Spec is consistent with and supplementary to the Agreement.

---

## 4. Exact gaps before pilot production

**A. Content (author to the supplied scripts).**
1. Author **`claims-01` AV1** (Delaney) as lesson data — replaces the water‑damage placeholder for pilot #1.
2. Author **`siu-01` AV1** (Delacroix) as lesson data.
3. Author **`ew-01` AV1** (Prieto) as lesson data.
   Each: intro/assignment, 3 decisions × 4 options, 12 per‑option feedback segments, 3 rejoins (with the four‑step summary card), resolution, quiz hand‑off — verbatim to script, incl. the bracketed on‑screen exhibit cues.

**B. Locked‑template components (build once, carry to all 267).**
4. ~~"Course Presenter" lower‑third text~~ — **DONE** (this update).
5. ~~AI‑disclosure line (opening, fades, dark/navy)~~ — **DONE** (this update).
6. **"Exhibits"** label above evidence tabs.
7. **Configurable `A ≠ B` evidence‑comparison** component (two images + conflict line).
8. **Configurable four‑icon rejoin summary card** (categories + takeaway).
9. **Identity acknowledgment → exactly once per video** (config change). **Client‑approved**; implementation only — reconfigure `IdentityCheck` from the 6‑scene interval to a single once‑per‑video checkpoint.
10. ~~Apply the LOCKED color roles (sky secondary accent)~~ — **DONE** (this round): `#7BAFD4`/`#1D5FA8`/`#D8E1EA` added; sky applied to decision states + evidence/exhibit tabs; gold kept primary (CTA/progress/scrubber); off‑white text‑only; correct/incorrect kept green/red for accessibility. No light‑panel redesign.
10a. ~~Fonts → Georgia / Segoe UI~~ — **DONE** (this round): implemented in `globals.css` `@theme`; Fraunces/Inter removed from `layout.tsx` and the export.
11. **Captions**: ensure per‑video caption data + verify the toggle end‑to‑end.

**C. Presenters & media.**
12. **Names + visual direction for Presenters 2 & 3** — **APPROVED.** Roger approved **Curtis Whitfield** (Presenter 2) and **Selena Navarro** (Presenter 3) together with their exact approved appearance, registered as reference files at `public/media/presenter-2-curtis-whitfield-master.png` and `public/media/presenter-3-selena-navarro-master.png`. See ★ LOCKED.
12a. **OPEN — production-resolution presenter masters.** Both reference files are **1672×941**, below the 1920×1080 floor (A §1.4.1 / B §6). **Compliant 1920×1080+ masters must be produced and registered for Curtis and Selena** before pilot render, reproducing the approved appearance exactly. The approved reference files must not be altered or upscaled in place — they are the approval record to check the new masters against. **Blocker for the pilot render** (§7 F‑1).
12b. **OPEN — Selena's standing asset.** The standing version is the locked designation for **course pages / title cards**; the file is not yet present in `public/media/` and needs to be supplied and registered (also at 1920×1080+).
12c. ~~OPEN — Presenter 2 & 3 voices.~~ **CLOSED / DONE.** Both approved and locked from blind auditions: **Curtis = `onyx`** (`tts-1-hd`, speed 1.0); **Selena = `sage`** (`gpt-4o-mini-tts-2025-12-15` + locked `instructions` string). Selected audio registered and byte-preserved in `public/media/`. Model split recorded at §7 F‑6.
13. **Diane's production base — SETTLED, no action.** The locked production base is the **ORIGINAL DARK-OFFICE Diane** (`presenter-diane.jpg`) per ★ LOCKED. The brighter-office and light-studio versions are **superseded historical exploration only** and must not be used as the production base. *(This item previously read "Approved brighter-office Diane as the production base" — that was stale and contradicted ★ LOCKED; corrected here. Diane's image files were not modified.)*
14. **1080p** production render for the 3 pilots (per the video‑to‑video pipeline in the earlier cost analysis; media generation is out of scope for this doc task).

**D. Packaging & QA.**
15. Delivery **naming**: `EA_[slug]_AV[n].zip` + `EA_[slug]_AV[n]_source.zip` + `EA_Batch-[n]`, with the source **documentation** required by A §2.3.1.
16. **Real‑device mobile QA** (iOS Safari + Android Chrome) per B §4.
17. **Functional‑acceptance pass** per A §2.2 on each pilot (12 branches route correctly, retry, rejoin, clean audio) in an actual Thinkific Multimedia lesson.

---

## 5. Recommended implementation order

1. **Client approvals first (they gate the build).** **Closed:** Diane's look (dark original, locked); **Presenter 2 & 3 names + visual direction (Curtis Whitfield · Selena Navarro — approved)**; fonts (Georgia/Segoe UI); identity‑acknowledgment cadence (once per video); palette/color roles; reshuffle as part of the locked template. **Presenter 2 & 3 voice approval — now CLOSED** (`onyx` / `sage`; see ★ LOCKED). No client approval gates the build. _(See §6.)_ The remaining pre-render blocker is technical, not contractual: no 1920×1080+ presenter master exists (§7 F‑1).
2. **Author the 3 pilot lessons** to the supplied scripts (data only; no engine changes). This also surfaces exactly which exhibit/comparison/summary components each pilot needs.
3. **Build the locked‑template components** in this order (cheapest‑to‑riskiest, all reusable): "Course Presenter" lower‑third → AI‑disclosure line → Exhibits label → four‑icon rejoin card → `A ≠ B` comparison → identity‑check "once per video" → lighter theme + fonts → captions data/QA.
4. **Presenter media**: finalize Diane base + generate Presenter 2 & 3 bases; render the 3 pilots at **1080p** via video‑to‑video lip‑sync (only after approvals; separate task).
5. **Package & name** per B §3 (+ source `_source.zip` + docs per A §2.3.1).
6. **QA**: real‑device mobile, functional acceptance in Thinkific, captions, single‑source audio, all 12 branches per pilot. Then submit the 3 pilots for the §4.1 approval gate.

Regression guardrails already in place to protect during the above: retry/reshuffle unit + browser tests, sound‑model tests, static‑export tests — re‑run before each pilot ships.

---

## 6. Still requires client (Roger) approval

**NO CLIENT APPROVALS REMAIN OPEN.**

~~OPEN — Presenter 2 & 3 voices.~~ **CLOSED.** Roger selected both from blind auditions: **Curtis Whitfield = `onyx` on `tts-1-hd`**; **Selena Navarro = `sage` on `gpt-4o-mini-tts-2025-12-15`** with a locked `instructions` string. Both selections are registered, byte-preserved, and documented in ★ LOCKED and `docs/PRESENTER_VOICE_APPROVAL.md`.

> **Not an approval item, but a hard production blocker** — tracked at §4 C‑12a and §7 F‑1: no **1920×1080+** master exists for Curtis or Selena. Their approved reference files are 1672×941, below the A §1.4.1 / B §6 floor. This needs compliant masters produced, not a client decision — unless Roger elects to accept the lower resolution, which would be a new approval.

**Now settled — no longer pending (moved out of this list):**
- ~~Presenter 2 & 3 names + visual direction~~ — **CLIENT APPROVED / LOCKED: Curtis Whitfield (Presenter 2, Investigation & Fraud, 32 courses) and Selena Navarro (Presenter 3, Professional Practice & Business, 42 courses)**, with the approved appearance registered as reference files in `public/media/`. Selena supersedes the earlier "Simone" working identity operationally and for all forward production. **Their voices and their production-resolution masters are NOT covered by this approval** — see above.
- ~~Brighter‑office Diane still~~ — LOCKED: dark original approved; brighter candidate not used.
- ~~Lighter‑interface palette usage~~ — LOCKED: dark interface; color roles fixed (see ★ LOCKED).
- ~~Identity acknowledgment~~ — **CLIENT APPROVED: exactly one per video** (C‑3). Remaining work is implementation only.
- ~~Fonts~~ — **Georgia / Segoe UI, implemented** (C‑2). Done.
- ~~Pilot content source~~ — **Decided: the supplied Pilot Scripts are authoritative** (C‑1). The water‑damage demo is a template proof, not pilot content.
- ~~Reshuffle‑on‑retry~~ — client‑requested and implemented; recorded here as part of the locked template.

---

## 7. Presenter master registration — open flags

Recorded when the approved Curtis Whitfield and Selena Navarro masters were registered. **Flagged, not reconciled** (per the source‑precedence rule).

**F‑1 — UNRESOLVED: no production-resolution master exists for Curtis or Selena.** Both registered files are **1672×941**. Agreement **A §1.4.1** and Spec **B §6** require **1080p (1920×1080) minimum**. These files are therefore **approved-appearance references, not final production-resolution masters**, and this spec does not treat them as production masters anywhere.

**Status: OPEN — blocks pilot render.** Resolution path, in order of preference:
1. **Produce compliant 1920×1080+ masters** that reproduce the approved appearance exactly (identity, environment, framing, wardrobe, lighting, color), and register them alongside — not over — the reference files. This is the expected path.
2. Failing that, Roger explicitly accepts the sub-1080p stills as the production source. **That is a new client approval**, not something this document can assume.

**Not acceptable:** upscaling, cropping, re-encoding or otherwise altering the approved reference files in place. They are the approval record against which any new master is verified. Related: audit row 16 (current demo media is 720p) and §4 C‑12a. Selena's standing course-page / title-card asset is likewise unregistered and must also meet 1920×1080+.

**F‑2 — Aspect ratio is marginally off 16:9.** 1672×941 = **1.7768**, against 16:9 = 1.7778. The difference is sub‑pixel at 1080p height and is unlikely to matter, but it is recorded so any pipeline fit (pad vs. crop) is a deliberate choice rather than a silent one. **Cropping to exact 16:9 would alter an approved master** and must not be done without Roger's written approval.

**F‑3 — "Okafor" surname was never in the repository.** The superseded Presenter 3 working identity is recorded in this project as the **first name "Simone" only** (`docs/PRESENTER_VOICE_APPROVAL.md` explicitly flagged the missing surname as an open item). No occurrence of "Okafor" exists in the working tree. Noted so the supersession record is accurate.

**F‑6 — Selena runs on a DIFFERENT TTS MODEL from Diane and Curtis (client-approved exception).** Diane (`shimmer`) and Curtis (`onyx`) use **`tts-1-hd`**. Selena uses **`gpt-4o-mini-tts-2025-12-15`** (`sage`).

**Why the split was unavoidable.** `tts-1-hd` serves nine voices; its female-presenting set is `shimmer`, `nova`, `sage`, `coral` (+ neutral `alloy`). `shimmer` is Diane's and locked; the rest were rejected against Selena's casting brief as too mature, too formal, or British-inflected (`fable`). The roster was exhausted. `tts-1-hd` also has **no `instructions` parameter**, so delivery could not be directed — which is precisely what the brief required. `gpt-4o-mini-tts` restores that control, and `sage` — rejected on `tts-1-hd` — was selected on it once delivery could be shaped.

**Risk accepted, with mitigations.** (a) The masculine-onset defect of commit `6692f8a` was **explicitly QA-tested on every Selena candidate and did not reproduce** — pitch analysis showed onset F0 at or above body F0 on all takes; that fault was `shimmer`-specific, not model-wide. (b) The model is **pinned to the dated snapshot** `gpt-4o-mini-tts-2025-12-15`, so acoustic behaviour will not drift mid-catalog. (c) Full reproduction parameters, **including the exact `instructions` string**, are stored in her `*-SELECTED.json` sidecar. (d) Per A §7.2, raw narration ships as discrete source files, so the catalog does not depend on the API remaining up.

**Consequence for A §7.1 continuity.** The catalog now spans two OpenAI TTS models rather than one. Same provider, same licensing chain, one extra deprecation surface. This is a deliberate client-approved trade: presenter fit over single-model uniformity.

**F‑4 — ~~Voice approval status is unchanged by this round.~~ SUPERSEDED — both voices are now approved (see F‑6 and ★ LOCKED).** Historical note follows. Roger's approval covered the **identities and visuals**. The `ash` (Presenter 2) and `sage` (Presenter 3) voice candidates in `docs/PRESENTER_VOICE_APPROVAL.md` are **not** recorded here as approved, because no such approval was stated. The Presenter 3 demo was rendered under the "Simone" working name; the voice itself is independent of the name change.

**F‑5 — RESOLVED: stale Diane production-base line corrected.** §4 C item 13 previously read "**Approved brighter‑office Diane** as the production base," contradicting the ★ LOCKED decision. Corrected: the locked production base is the **ORIGINAL DARK-OFFICE Diane** (`presenter-diane.jpg`); the brighter-office and light-studio versions are retained as **superseded historical exploration only**. Audit row 12 was updated to name both lighter files explicitly. **Documentation only — no Diane image file was modified** (all three verified byte-identical by checksum).

---

_Prepared as a read‑only pre‑pilot gap analysis. No pilots rendered, no production media generated, no deployment, no major implementation changes. §7 and the Presenter 2 & 3 identity lock were added when Roger's approved presenter masters were registered — documentation and media registration only._
