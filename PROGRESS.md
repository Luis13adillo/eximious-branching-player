# Eximious Academy — Interactive Branching Video Player · Build Progress

Live status of the gauntlet build. Updated as work evolves.

**Quality bars**
- Visual polish: **MasterClass** (masterclass.com) — cinematic, premium video-learning UI.
- Branching interaction: **H5P Branching Scenario** + a high-quality **Articulate Storyline** branching example.

**Exit condition:** independent fresh-context critics, having run the real app and tested every A/B/C/D branch + rejoin on desktop and mobile, choose ours over the bar (or cannot distinguish) — a binary pick, no scores.

---

## Component status

| Component | Status | Notes |
|---|---|---|
| Project scaffold (Next 16 / React 19 / TS / Tailwind v4) | ✅ done | deploys to Vercel |
| Brand tokens (navy/gold design system) | ✅ done | `globals.css` |
| Branching engine (pure state machine) | ✅ done | `lib/branching/engine.ts` |
| Data model + lesson schema | ✅ done | `lib/branching/types.ts` |
| `onAnswerSelected()` event interface | ✅ done | `lib/branching/events.ts` |
| React hook binding (`useLessonMachine`) | ✅ done | fires events |
| Demo lesson (water-damage claim) | ✅ done | 1 decision, 4 branches, rejoin |
| Lesson registry (scales to 267) | ✅ done | `lib/lessons/index.ts` |
| Evidence illustrations (SVG exhibits) | ✅ done | floor plan, moisture, timeline, policy, photo |
| Cinematic scene backdrops | ✅ done | placeholder "footage" |
| Media playback clock (placeholder + real video) | ✅ done | swappable |
| Video controls (play/scrub/volume/captions/fullscreen) | ✅ done | auto-hide, keyboard |
| Caption overlay | ✅ done | synced to placeholder clock |
| Avatar presenter layout | ✅ done | HeyGen-swappable; identity tag |
| Evidence / fullscreen scene layout | ✅ done | exhibit viewer + thumbnails |
| Decision panel (A/B/C/D) | ✅ done | 2×2, keyboard A–D |
| Feedback chrome (correct/incorrect) | ✅ done | distinct per branch |
| Progress rail | ✅ done | spine-based, branch-stable |
| Lesson player (orchestrator) | ✅ done | stage + context panel |
| Loading / error states | ✅ done | route loading + error boundary |
| Landing + lesson + embed routes | ✅ done | `/`, `/lesson/[slug]`, `/embed/[slug]` |
| Iframe-safety (Thinkific headers) | ✅ done | CSP frame-ancestors |
| Responsive (desktop/tablet/mobile) | 🔧 round 2 | mobile stage/card fixes applied |
| Keyboard accessibility pass | 🔧 needs critic | |
| README + handoff docs | ✅ done | full handoff README |
| Engine test suite (vitest) | ✅ done | 13 tests, all branches + rejoin |
| Lesson validation enforced at build | ✅ done | bad data fails the build |
| GitHub + Vercel setup | 🔧 local git done | remote/deploy pending user |

## Validation log

- ✅ **Full path walked in the running app (desktop):** intro → loss evidence → policy briefing → decision → feedback **A** → C&O continuation → resolution → completion. All transitions clean.
- ✅ **Branch A** ("deny as flood") routes to its own "Not quite" feedback with distinct rationale.
- ✅ **Rejoin** verified: branch A feedback → shared C&O continuation (Step 5/6) → resolution.
- ✅ **Completion summary** shows the decision review ("chose A", marked incorrect) + restart.
- ✅ **Layout fix:** headlines moved off the video into the panel — no title/exhibit/caption overlap.
- ✅ **Production build** passes (TypeScript clean, all routes prerender).
- ⏳ Branches B / C / D still to be re-walked after the layout refactor (engine routing already confirmed via A + code).

## Critic verdicts

**Round 1**
- **Visual (vs MasterClass): MasterClass won.** Biggest gap: the video stage read
  as a wireframe (flat noise + cartoon avatar). Also flagged: dev "N" badge over
  footer, evidence caption vs thumbnail overlap, mobile stage chip overlap,
  featured thumbnail near-black, mobile card not stacking, mobile CTA wrapping.
- **Code/handoff: "not confidently yet."** Biggest flaw: lesson-1 copy hard-coded
  in the shared completion screen. Correctness: `validateLesson` never called + no
  tests → typo'd scene ref crashes at scale. Plus dead code, stale README.

**Round 1 fixes applied**
- Rewrote the stage: cinematic graded backdrops (key/fill light, bokeh, vignette,
  restrained grain) + soft-lit presenter portrait (no cartoon bust, no box).
- Disabled the Next dev indicator; fixed evidence caption clearance; taller mobile
  stage (4:3) + hid preview chip on mobile → no overlaps; featured card stacks on
  mobile with a proper preview (play glyph + duration); Continue button no longer
  wraps on mobile.
- Added `lesson.completion` data field → no lesson copy in the player. Enforced
  `validateLesson` at registry load (bad data fails the build). Added vitest suite
  (13 tests). Removed dead code. Wrote full handoff README.

**Round 2 — Branching (vs H5P/Storyline): NO, narrowly.** All four A/B/C/D
routes distinct + rejoin correct + keyboard works (verified live) — writing and
correctness signaling *beat* the bar. Biggest gap: media didn't visibly branch
(consequences told, not shown). Bugs: broken keyboard hint ("press – to
choose"), contradictory completion copy for wrong answers.

**Round 2 fixes applied**
- Added a per-branch **consequence beat** on the stage (`ConsequenceStage`): the
  case visibly reacts — gold ✓ / red ✕ verdict wash + a present-tense
  consequence line + a distinct backdrop per branch — before the written
  rationale. Directly closes "told, not shown."
- Discovered + fixed a real layout problem: on laptop viewports the 16:9 stage
  pushed the decision options **below the fold**. New **responsive two-column
  layout** (stage + panel side-by-side on desktop, stacked on mobile) keeps all
  four options visible with no scroll; player now fits the viewport on desktop.
- Fixed the keyboard hint (now "press A, B, C, or D") and the completion copy
  (wrong answers no longer told they "reached the correct resolution").

**Round 3 next:** re-check visual vs MasterClass (post stage upgrade) and run
accessibility + responsive.

## Unresolved issues

- Presenter is a soft-lit abstract portrait (honest placeholder, no real avatar yet).
- Exhibit illustrations still sit in a card narrower than the 16:9 stage.
