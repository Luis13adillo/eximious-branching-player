# Stage 2 — Lesson and branching validation

**Cost $0.00. The gate is the build-time validator, and it fails the build rather than a
learner.**

## The graph is the same for all 267 videos

```
intro → assignment → DECISION 1 ─ wrong → its own feedback → back to DECISION 1 (options reshuffled)
                                └ correct → rejoin → DECISION 2 → … → DECISION 3
                                                                        └ correct → rejoin
                                                                                      ↓
                                                       resolution beats → hand-off to the graded COURSE quiz
```

- **3 decisions × 4 options (A–D) · 12 individual feedback branches** — specific, never
  generic.
- **Retry-until-correct**: a wrong answer plays its own feedback and returns to the **same**
  decision, with tried options marked and **options reshuffled**. Option identity and
  feedback routing survive the shuffle via `data-option-id`.
- Only the correct option advances. **All paths rejoin.**
- **The three correct-answer verdicts are player-native, not video.** No spoken "Correct."
  beat ships on any pilot.
- **The video hands off to the graded COURSE quiz on Thinkific. No in-video quiz ships.**
  The demo's five-question quiz used invented questions and is not content.
- **Evidence scenes are audio-only** — voiceover over the exhibit, no talking head. They
  currently render as text cards (`EXHIBITS_DELIVERED = false`) pending Roger's call on real
  exhibit photographs.

**Rejoin count is content, not structure.** claims-01 has 4 rejoin segments, siu-01 3,
ew-01 5. The graph shape is fixed; the number of rejoin beats is not.

## Authoring

Content lives in **data**, never in components. `src/lib/branching/types.ts` defines the
lesson as a scene graph; no branching logic lives in any component.

Adding a lesson is **one config file plus one line in `src/lib/lessons/index.ts`** — no
player, route or component changes. That is the property the whole catalog depends on;
if a lesson needs a component change, stop and ask, because it means the template is being
bent for one video.

## The validator is the gate

`validateLesson` runs as the registry module is evaluated, which happens during `next build`.
A malformed lesson — missing scene reference, a decision without exactly one correct answer,
branches that do not rejoin — **fails the build in production** rather than crashing a
learner at runtime.

```bash
npm run build      # the validator runs here
npm test           # the lesson's own suite
```

Each lesson also carries `src/lib/lessons/<lesson-id>.test.ts`, which asserts that the
concatenated cue text reproduces the narration exactly, that the cues tile the duration, and
that each narration string still hashes to its recorded `scriptSha256`.

## Slug discipline

The lesson's **registry slug** and its **media key** are separate strings and they are not
required to match. claims-01's slug is `claims-investigation-application-1` while its media,
narration and tests are keyed `claims-01-av1`. **Make them match on every new lesson.**
Where they cannot, record it — passing the wrong one to `dump-lesson-graph.ts` at Gate D
fails outright.

## Stop conditions

- The validator reports any problem.
- The storyboard needs a scene type the template does not have.
- A component change would be needed to render this lesson.

## Note for the spec

**Reshuffle-on-retry is implemented and client-requested but is named in neither the
Agreement nor the Spec.** Agreement §1.6 locks interaction design across all 267 after pilot
approval, so it should be written into the spec before the template lock — otherwise it is
an unapproved deviation. Flag it; do not fix it silently.
