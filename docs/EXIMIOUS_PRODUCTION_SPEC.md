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

**Explicitly superseded / no longer in effect:** brighter‑office Diane as final · panels becoming light · off‑white used as a major panel/background · general lightening of the interface.

**Now also settled (not pending approval):** identity acknowledgment is **CLIENT APPROVED — exactly one per application video**; **fonts are decided** — Georgia (headings) / Segoe UI (body) per Spec §7 (current Fraunces/Inter is an implementation gap, not an open question); **pilot content is decided** — the supplied Pilot Scripts are authoritative (the water‑damage demo is a template proof, never pilot content). **Only remaining client approval: Presenter 2 & 3 identities.** See §6.

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
- **Presenter 2 — (to be named) · Investigation & Fraud** (Tracks 5, 7, 8, 9, 15 = 32 courses).
- **Presenter 3 — (to be named) · Professional Practice & Business** (Tracks 2, 3, 11, 13, 14 = 42 courses).
- Names for 2 & 3 proposed **with the pilot** for Roger's approval; same lower‑third title **"Course Presenter."** Each presenter keeps one distinct voice, constant across their tracks.

**Pilot set (B §5, C).** Three videos, one per presenter, three tracks:
| # | Course · Video | Track | Presenter | Package |
|---|---|---|---|---|
| 1 | `claims-01` — Fundamentals of Claims Investigation · App Video **1 of 3** | Track 1 | Diane Marchetti | `EA_claims-01_AV1.zip` |
| 2 | `siu-01` — SIU Foundations & the Regulatory Framework · App Video **1 of 2** | Track 5 | Presenter 2 | `EA_siu-01_AV1.zip` |
| 3 | `ew-01` — Becoming a Retained Expert · App Video **1 of 2** | Track 11 | Presenter 3 | `EA_ew-01_AV1.zip` |

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
| 12 | **~~Brighter‑office Diane~~ → DARK original Diane LOCKED** (★ LOCKED, supersedes B §7) | **Resolved / SUPERSEDED** | Dark original (`presenter-diane.jpg`) is the approved look. The brighter‑office candidate (`presenter-diane-brighter-office-approval.png`) remains on disk but is **not used** and is superseded. |
| 13 | **"Course Presenter" lower‑third** (A §1.4, B §6) | **IV** (this update) | `MediaStage` now renders a fixed template constant `LOWER_THIRD_TITLE = "Course Presenter"` for every presenter/lesson; the data credential "Senior Claims Instructor" was removed from both lessons. No instructor title / implied credential remains. |
| 14 | **AI‑presenter disclosure line** (A §1.4, B §6; CLIENT APPROVED placement) | **IV** | `AiDisclosure.tsx` renders the exact contract copy (unchanged) **bottom‑left of the video, just above the controls** — small‑type, subtle/secondary, dark scrim for contrast. Shows **once on the opening segment only** (~2–3s, then fades and unmounts); rendered in `LessonPlayer`'s persistent stage wrapper (not keyed to scenes) so it **never reappears** on later segments — verified programmatically across 10 segment changes. Clear of Diane and the lower‑third. |
| 15 | **Existing audio / mute / single‑source must not regress** (A §2.2) | **IV** | Single persistent media element, one source at a time; 16/16 sound checks, watchdog `maxAudible=1`. |
| 16 | **1080p output** (A §1.4.1, B §6) | **NI** (media) | Current demo media is 720p (InfiniTalk, 1280×704). Player is resolution‑agnostic; the **production media pipeline** must render 1920×1080. |
| 17 | **267 videos authored to full scripts** (A §1.1) | **NI** (content) | Template proven with 1–2 placeholder lessons. **0 of 267** production videos authored. Pilots #2/#3 not authored (see C‑1). |
| 18 | **3 presenters exist** (B §2) | **P + RA** | Presenter 1 (Diane) asset exists. **Presenters 2 & 3 unnamed, no assets.** |
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
12. **Name + reference stills for Presenters 2 & 3** (approval‑gated).
13. **Approved brighter‑office Diane** as the production base (sign‑off + optional pixel‑locked redo).
14. **1080p** production render for the 3 pilots (per the video‑to‑video pipeline in the earlier cost analysis; media generation is out of scope for this doc task).

**D. Packaging & QA.**
15. Delivery **naming**: `EA_[slug]_AV[n].zip` + `EA_[slug]_AV[n]_source.zip` + `EA_Batch-[n]`, with the source **documentation** required by A §2.3.1.
16. **Real‑device mobile QA** (iOS Safari + Android Chrome) per B §4.
17. **Functional‑acceptance pass** per A §2.2 on each pilot (12 branches route correctly, retry, rejoin, clean audio) in an actual Thinkific Multimedia lesson.

---

## 5. Recommended implementation order

1. **Client approvals first (they gate the build):** brighter‑office Diane; Presenter 2 & 3 names + stills; fonts (Georgia/Segoe UI vs keep Fraunces/Inter); confirm the identity‑acknowledgment requirement + cadence; confirm lighter‑palette usage; agree reshuffle is part of the locked template. _(See §6.)_
2. **Author the 3 pilot lessons** to the supplied scripts (data only; no engine changes). This also surfaces exactly which exhibit/comparison/summary components each pilot needs.
3. **Build the locked‑template components** in this order (cheapest‑to‑riskiest, all reusable): "Course Presenter" lower‑third → AI‑disclosure line → Exhibits label → four‑icon rejoin card → `A ≠ B` comparison → identity‑check "once per video" → lighter theme + fonts → captions data/QA.
4. **Presenter media**: finalize Diane base + generate Presenter 2 & 3 bases; render the 3 pilots at **1080p** via video‑to‑video lip‑sync (only after approvals; separate task).
5. **Package & name** per B §3 (+ source `_source.zip` + docs per A §2.3.1).
6. **QA**: real‑device mobile, functional acceptance in Thinkific, captions, single‑source audio, all 12 branches per pilot. Then submit the 3 pilots for the §4.1 approval gate.

Regression guardrails already in place to protect during the above: retry/reshuffle unit + browser tests, sound‑model tests, static‑export tests — re‑run before each pilot ships.

---

## 6. Still requires client (Roger) approval

**The ONLY remaining open client approval:**
- **Presenter 2 & 3 names + reference stills** (B §2 asks for proposals with the pilot).

**Now settled — no longer pending (moved out of this list):**
- ~~Brighter‑office Diane still~~ — LOCKED: dark original approved; brighter candidate not used.
- ~~Lighter‑interface palette usage~~ — LOCKED: dark interface; color roles fixed (see ★ LOCKED).
- ~~Identity acknowledgment~~ — **CLIENT APPROVED: exactly one per video** (C‑3). Remaining work is implementation only.
- ~~Fonts~~ — **Georgia / Segoe UI, implemented** (C‑2). Done.
- ~~Pilot content source~~ — **Decided: the supplied Pilot Scripts are authoritative** (C‑1). The water‑damage demo is a template proof, not pilot content.
- ~~Reshuffle‑on‑retry~~ — client‑requested and implemented; recorded here as part of the locked template.

---

_Prepared as a read‑only pre‑pilot gap analysis. No pilots rendered, no production media generated, no deployment, no major implementation changes._
