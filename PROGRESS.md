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
| Responsive (desktop/tablet/mobile) | 🔧 needs critic | |
| Keyboard accessibility pass | 🔧 needs critic | |
| README + handoff docs | ⏳ todo | |
| GitHub + Vercel setup | ⏳ todo | |

## Validation log

- ✅ **Full path walked in the running app (desktop):** intro → loss evidence → policy briefing → decision → feedback **A** → C&O continuation → resolution → completion. All transitions clean.
- ✅ **Branch A** ("deny as flood") routes to its own "Not quite" feedback with distinct rationale.
- ✅ **Rejoin** verified: branch A feedback → shared C&O continuation (Step 5/6) → resolution.
- ✅ **Completion summary** shows the decision review ("chose A", marked incorrect) + restart.
- ✅ **Layout fix:** headlines moved off the video into the panel — no title/exhibit/caption overlap.
- ✅ **Production build** passes (TypeScript clean, all routes prerender).
- ⏳ Branches B / C / D still to be re-walked after the layout refactor (engine routing already confirmed via A + code).

## Critic verdicts

_(round 1 in progress — visual vs MasterClass, branching vs H5P/Storyline, a11y+responsive, code/deploy)_

## Unresolved issues

- Exhibit illustrations letterbox slightly inside the wide card (4:3 art in a 16:9 stage).
- Presenter placeholder is an honest monogram figure — refinement vs MasterClass TBD by critic.
