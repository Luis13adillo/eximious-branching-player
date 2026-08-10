# Eximious Academy — Interactive Branching Video Player

A reusable, data-driven interactive **branching video** player for professional
claims / investigation e-learning. A lesson opens on a polished case
introduction, presents evidence, reaches decision points where the learner
chooses between four answers (A/B/C/D), routes each answer to its own feedback
segment, then rejoins a shared continuation and resolution.

The player is **content-agnostic**: all lesson text and branching logic live in
structured data, not in code. The same player runs one lesson or **267**, with
one decision point or **three** — no code changes required. It deploys to Vercel
and embeds in Thinkific (or any LMS) via an iframe-safe URL.

> **Media note:** Every scene ships with a lip-synced speaking-avatar video and
> a matching voiceover, with full-screen evidence scenes narrated over the
> exhibit. All narration is captioned in sync. Media is attached per scene via
> data, so higher-fidelity assets drop in with **no engine changes** — see
> [Replacing the media](#replacing-the-media-heygen--elevenlabs--mux).

---

## Table of contents

1. [Quick start (local development)](#quick-start-local-development)
2. [How the player works](#how-the-player-works)
3. [Authoring a lesson](#authoring-a-lesson)
4. [Scaling to 267 lessons × 3 decisions](#scaling-to-267-lessons--3-decisions)
5. [Replacing the media (HeyGen / ElevenLabs / Mux)](#replacing-the-media-heygen--elevenlabs--mux)
6. [Analytics — the `onAnswerSelected` seam](#analytics--the-onanswerselected-seam)
7. [Brand & theming](#brand--theming)
8. [Deploying to Vercel](#deploying-to-vercel)
9. [Embedding in Thinkific (iframe)](#embedding-in-thinkific-iframe)
10. [Project structure](#project-structure)
11. [Maintaining the system](#maintaining-the-system)

---

## Quick start (local development)

Requires **Node 20+** (built and tested on Node 24).

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

Key URLs:

| URL | What it is |
|---|---|
| `/` | Academy landing page |
| `/lesson/water-damage-claim` | Full-page lesson player |
| `/embed/water-damage-claim` | Iframe-optimized player (for Thinkific) |

Other scripts:

```bash
npm run build         # production build (also type-checks every route)
npm run start         # serve the production build
npm run lint          # eslint
npm run test          # engine unit tests (vitest)
npm run remotion      # open Remotion Studio to preview video segments
npm run render:intro  # render the intro segment → public/media/intro.mp4
```

---

## How the player works

A lesson is a **directed graph of scenes**. The player walks the graph:

- **narrative** scenes play, then advance to `next`;
- **decision** scenes wait for the learner to choose A/B/C/D, then route to that
  option's **feedback** scene;
- **feedback** scenes play, then advance to a common `next` — the **rejoin**
  point every branch shares.

```
intro → evidence → briefing → DECISION ─┬─ A → feedback ─┐
                                        ├─ B → feedback ─┤
                                        ├─ C → feedback ─┤ (all rejoin)
                                        └─ D → feedback ─┘
                     → continuation → resolution → end
```

The graph is walked by a **pure state machine** (`src/lib/branching/engine.ts`)
with no React or DOM dependencies, so the branching logic is testable in
isolation and independent of the UI. A thin React hook
(`useLessonMachine`) binds it to the player.

The visual layer is split cleanly:

- **The stage** (`MediaStage`) is the cinematic 16:9 video rectangle — real
  `<video>` when an asset exists, otherwise a placeholder backdrop + AI-presenter
  or evidence exhibits, plus captions and full video controls.
- **The panel** below the stage holds the scene title/body, the decision
  options, branch feedback, or the completion summary.

---

## Authoring a lesson

A lesson is one typed object (see the fully-commented example in
[`src/lib/lessons/water-damage-claim.ts`](src/lib/lessons/water-damage-claim.ts)).
Shape (`src/lib/branching/types.ts`):

```ts
export const myLesson: Lesson = {
  id: "my-lesson",
  slug: "my-lesson",              // becomes /lesson/my-lesson
  courseTitle: "Property Claims Investigation",
  title: "The Ambiguous Water Loss",
  startSceneId: "intro",
  scenes: {
    intro: {
      type: "narrative",
      role: "intro",
      layout: "avatar",           // presenter layout | "fullscreen" for exhibits
      presenter: { name: "Diane Marchetti", role: "Senior Claims Instructor" },
      headline: "…",
      media: { provider: "placeholder", placeholderScene: "claim-desk",
               durationSec: 30, captions: [{ start: 0, end: 4, text: "…" }] },
      next: "evidence",
    },
    // …evidence / briefing scenes…
    "decision-1": {
      type: "decision",
      layout: "avatar",
      presenter: { name: "Diane Marchetti", role: "Senior Claims Instructor" },
      prompt: "What is your next step?",
      media: { provider: "placeholder", placeholderScene: "claim-desk", durationSec: 10 },
      options: [
        { id: "A", label: "…", isCorrect: false, feedbackSceneId: "fb-A" },
        { id: "B", label: "…", isCorrect: false, feedbackSceneId: "fb-B" },
        { id: "C", label: "…", isCorrect: true,  feedbackSceneId: "fb-C" },
        { id: "D", label: "…", isCorrect: false, feedbackSceneId: "fb-D" },
      ],
    },
    "fb-A": { type: "feedback", verdict: "incorrect", forDecisionId: "decision-1",
              forOptionId: "A", headline: "…", body: "…",
              media: { /* … */ }, next: "continuation" },
    // …fb-B, fb-C, fb-D all set next: "continuation"…
    continuation: { type: "narrative", role: "continuation", next: "resolution", /* … */ },
    resolution:   { type: "narrative", role: "resolution",   next: null,        /* … */ },
  },
};
```

Then register it (one line) in
[`src/lib/lessons/index.ts`](src/lib/lessons/index.ts):

```ts
const registry: Record<string, Lesson> = {
  [waterDamageClaim.slug]: waterDamageClaim,
  [myLesson.slug]: myLesson,   // ← add this
};
```

That's it — the route `/lesson/my-lesson`, the embed route, the catalog entry,
and the progress rail all appear automatically.

### Validate a lesson

`validateLesson(lesson)` in `engine.ts` returns a list of problems (empty = OK):
every referenced scene exists, each decision has exactly four options with
exactly one correct answer, and all branches of a decision rejoin at the same
scene. Run it in a test or a build step to catch authoring mistakes early.

---

## Scaling to 267 lessons × 3 decisions

- **More lessons:** one config object + one registry line each. At production
  scale you would likely load these from a CMS or JSON files keyed by slug; the
  player only depends on the `Lesson` shape, not on where the data comes from.
- **Three decisions per lesson:** add three `decision` scenes along the graph
  (each with its own four feedback scenes rejoining a shared continuation). The
  player, engine, progress rail, and completion summary already handle any
  number of decisions — nothing is hard-coded to "one".
- The featured lesson ships **three** decisions (four feedback branches each);
  the data model, `decisionOrder()`, event `decisionIndex`, and the completion
  review are all written for any number of decisions.

---

## Replacing the media (HeyGen / ElevenLabs / Mux)

Media is described by data on each scene (`MediaSource` in `types.ts`). The
player renders a real `<video>` when a URL is present and the placeholder stage
otherwise — **the branching engine never changes.**

```ts
// Before (placeholder):
media: { provider: "placeholder", placeholderScene: "claim-desk", durationSec: 30,
         captions: [ /* narration */ ] }

// After a HeyGen avatar render + ElevenLabs VO baked in, or a Mux upload:
media: { provider: "heygen", videoUrl: "https://…/lesson7-intro.mp4",
         posterUrl: "https://…/poster.jpg", captionsUrl: "https://…/intro.vtt",
         durationSec: 30 }
```

- `videoUrl` present → a real `<video>` element plays; controls, scrubbing,
  captions (`captionsUrl` as a `<track>`), and auto/rejoin transitions all keep
  working.
- The avatar-presenter layout and the fullscreen-evidence layout are both
  supported today; a HeyGen presenter clip simply fills the same avatar frame.
- Swap evidence illustrations for real photos by setting `imageUrl` on an
  `EvidenceItem` instead of `illustration`.

### Rendered video segments (Remotion)

The intro segment ships as a **real rendered `.mp4`** (`public/media/intro.mp4`) so
the video path is proven end-to-end, not just simulated. It's produced with
[Remotion](https://remotion.dev) from the composition in [`remotion/`](remotion/):

- `remotion/IntroSegment.tsx` — turns the AI-presenter still into "living
  footage" (frame-driven push-in, handheld drift, film grain, breathing
  vignette). No text is baked in — the player still overlays the identity tag,
  captions and controls, so a rendered clip is a drop-in for the still.
- `remotion/Root.tsx` — composition list (dimensions, fps, duration).

```bash
npm run remotion       # preview/tweak in Remotion Studio
npm run render:intro   # re-render → public/media/intro.mp4
```

Remotion is a **dev/build-time** tool only — it is not in the browser bundle;
the app just plays the resulting file. To make another scene a rendered clip,
add a `<Composition>` in `remotion/Root.tsx`, a render script in `package.json`,
and point that scene's `media.videoUrl` at the output. When final HeyGen /
ElevenLabs footage arrives, drop its URL into `videoUrl` and you can delete the
Remotion pipeline entirely — the player doesn't depend on it.

---

## Analytics — the `onAnswerSelected` seam

The player emits a small, stable set of events (`src/lib/branching/events.ts`)
so analytics / an LMS / xAPI can be added later **without rebuilding the
player**:

```ts
<LessonPlayer
  lesson={lesson}
  handlers={{
    onAnswerSelected: (e) => track("answer", e), // { lessonId, sceneId, optionId, isCorrect, decisionIndex, timestampMs }
    onSceneEnter:     (e) => track("scene", e),
    onLessonComplete: (e) => track("complete", e), // { correctCount, decisionCount, results }
  }}
/>
```

The player wires a console-logging handler in
[`src/components/player/PlayerClient.tsx`](src/components/player/PlayerClient.tsx)
so you can watch the events fire in the browser console — replace it with a real
sink.

---

## Brand & theming

All brand values are design tokens at the top of
[`src/app/globals.css`](src/app/globals.css) (Tailwind v4 CSS-first theming):

- Navy scale (brand `#0B1F3A` = `--color-navy-800`)
- Gold scale (brand `#C7A254` = `--color-gold-500`)
- Fonts: Fraunces (display serif) + Inter (sans), self-hosted by `next/font`.

Change a token and it propagates through every component. **No official Eximious
logo is bundled** — the wordmark in `src/components/ui/BrandMark.tsx` is a
typographic monogram; drop a real logo into `/public` and swap the monogram for
an `<img>` when the asset is provided.

---

## Deploying to Vercel

1. Push this repo to GitHub (see below).
2. In Vercel, **New Project → import the repo**. Framework preset: **Next.js**.
   No environment variables are required.
3. Deploy. Production URL is your player's public URL.

Optional env var:

- `NEXT_PUBLIC_FRAME_ANCESTORS` — override the iframe embedding policy (see
  next section). Defaults to allowing all embedders for the POC.

### GitHub

```bash
git add -A
git commit -m "Eximious interactive branching video player"
gh repo create eximious-branching-player --private --source=. --push
# or add a remote manually and: git push -u origin main
```

---

## Embedding in Thinkific (iframe)

The app **does not** send `X-Frame-Options`; instead it sets a CSP
`frame-ancestors` directive (`next.config.ts`). By default it allows any
embedder so the POC works everywhere.

In Thinkific, add a **Multimedia / iframe** lesson and point it at:

```
https://<your-vercel-domain>/embed/water-damage-claim
```

For production, lock embedding to your Thinkific domains by setting the env var
before deploy:

```
NEXT_PUBLIC_FRAME_ANCESTORS=frame-ancestors 'self' https://*.thinkific.com https://*.thinkificsites.com;
```

The `/embed/[slug]` route trims outer chrome and fills the iframe; the player is
responsive, so size the Thinkific iframe to a 16:9-ish box and it adapts.

---

## Project structure

```
src/
  app/
    layout.tsx                 root layout, fonts, metadata
    globals.css                brand tokens + design system
    page.tsx                   academy landing page
    lesson/[slug]/page.tsx     full-page player  (+ loading.tsx, error.tsx)
    embed/[slug]/page.tsx      iframe-optimized player
    not-found.tsx
  lib/
    branching/
      types.ts                 the data model (Lesson / Scene / MediaSource …)
      engine.ts                pure state machine + validateLesson + outline
      events.ts                onAnswerSelected + event interface
      useLessonMachine.ts      React binding over the engine
    lessons/
      index.ts                 lesson registry (scales to 267)
      water-damage-claim.ts    a second lesson (fully commented)
  components/
    player/                    LessonPlayer, MediaStage, useMediaClock,
                               DecisionPanel, EvidenceStage, AvatarPresenter,
                               VideoControls, CaptionOverlay, ProgressRail,
                               interaction.tsx, PlayerClient
    media/                     SceneBackdrop (cinematic placeholders),
                               illustrations (vector evidence exhibits)
    ui/                        BrandMark, icons
next.config.ts                 iframe headers (frame-ancestors)
remotion/                      Remotion compositions (rendered video segments)
  Root.tsx                     composition list
  IntroSegment.tsx             the intro "living-still" footage
public/media/                  generated media (presenter stills, evidence photo, intro.mp4)
```

---

## Maintaining the system

- **Add/'edit content:** touch only `src/lib/lessons/**`. You never need to open
  the player components to change a lesson.
- **Change look & feel:** tokens in `globals.css`; component styles are Tailwind
  utility classes.
- **Add a media provider:** it already renders any `videoUrl`. If you need a
  provider-specific player (e.g. Mux's SDK), swap the `<video>` inside
  `MediaStage` — the engine and everything else are untouched.
- **Add analytics:** implement the handlers in `PlayerClient.tsx`.
- **Accessibility:** captions carry all narration; the player is keyboard
  operable (Space/K play-pause, ←/→ seek, M mute, C captions, F fullscreen,
  A–D answer), focus states are visible, and `prefers-reduced-motion` is
  respected.

Everything Eximious owns — player, source, lesson configs, media descriptors —
lives in this repo. There is no dependency on the original developer or any
private service.
