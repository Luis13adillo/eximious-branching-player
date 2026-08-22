# Stage 11 — Player integration

**Cost $0.00 — and keeping it that way is the whole point of pipeline rule 8.**

## The split that protects the budget

**Generated video carries the presenter speaking and NOTHING else.** The player and Remotion
composite everything else at runtime.

| Player-native — $0 to change | Generated video — costs money to change |
|---|---|
| decisions, options, reshuffle, retry, rejoin targets, scoring | **the presenter speaking** |
| per-option feedback headlines, quiz hand-off, pass threshold | |
| lower-third, AI disclosure, captions, progress rail, identity check | |
| exhibits, `A ≠ B` comparison, four-icon rejoin cards | |
| colours, fonts, spacing, dark theme, responsive layout | |
| Thinkific packaging and naming | |

**Only a change to the spoken words costs money.** This is the whole reason the catalog is
economically viable, and it is why a UI revision does not cost a 267-video re-render.

## Regenerate the captions against the MEASURED durations

At authoring time `durationSec` is provisional (characters ÷ the presenter's chars/sec). Now
it becomes the **measured** mp4 length, read from
`public/media/<lesson-id>/<id>.mp4.json → split.video_dur_s`, and the captions are
regenerated against it.

**No offset is applied.** Cues tile the delivered asset — first starts at 0, last ends at
`video_dur_s`. That is what the test suite asserts.

## The locked template — it is already built; do not rebuild it per lesson

All of this shipped in all three pilots and carries to all 267:

"Exhibits" label above evidence tabs · `A ≠ B` visual comparison · four-icon summary card on
rejoin · **"Course Presenter"** lower-third (a fixed template constant — no instructor title,
no implied credential, and **no presenter names on any product surface**) · AI-disclosure
line · toggleable captions · 12-step case-progress rail · identity acknowledgement **exactly
once per video** · 1920×1080.

## Locked behaviours you must not alter per lesson

**No autoplay at load.** The video opens on its first frame behind a labelled Start control;
the learner's press starts **picture and sound together**. After that, segment transitions
continue automatically. `LessonPlayer` prop `requireStart`, template default `true`.
`false` is reserved for a genuine unattended/kiosk deployment and is **not approved for
course delivery**.

Three knock-on rules move with the start gate and **nothing else**: the AI disclosure appears
when the **video** opens (not the page), then holds ~2–3 s and fades as approved; the caption
band is empty until the lesson starts; and the 120 s presence-check countdown arms at Start
instead of page load.

**"Are you still there?" presence check:** one **120 s** inactivity timer, restarted by any
`pointerdown`/`keydown`/`input` anywhere in the player (capture phase at the player root);
**media playing alone does not restart it**; on expiry it pauses media and blocks progress
until acknowledged; fires **at most once per video**; never arms once the lesson is complete.
120 s was chosen because the longest delivered segment is 38.8 s.

## Visual system — LOCKED

**Dark direction.** Roger's later written direction locked the dark look, superseding the
"lighter interface / lighter Diane backdrop" in Video Production Spec §7. Anything suggesting
a lighter interface, light panels or off-white backgrounds is **superseded**.

| Colour | Role | Never |
|---|---|---|
| **Gold `#C7A254`** | **PRIMARY** — actions, CTA/buttons, progress rail, current-step indicator, scrubber, **and the case-panel frame** | never a panel or background **fill**; the panel use is a **border only** |
| **Sky `#7BAFD4`** | **SECONDARY ACCENT ONLY** — decision states, evidence/exhibit tabs, right/wrong feedback states | **never** a panel or background fill; do not overuse |
| **Off-white `#F4F7FA`** | **TEXT / readability ONLY** | **never** a panel or background colour |

Full palette for accents: navy `#0B1F3A` · deep navy `#07172A` · blue `#1D5FA8` ·
gold `#C7A254` · sky `#7BAFD4` · off-white `#F4F7FA`.

**The gold case-panel frame is a deliberate second gold role.** `border-gold-500/70` on the
interaction `<section>` in `LessonPlayer.tsx`, on every scene type, both routes, desktop and
mobile. A session reading only the roles table may try to "correct" it back to
`border-white/10`. **Don't.** It is recorded as ★ LOCKED in the spec. The video stage keeps
its neutral `border-white/10` edge.

**Correct/incorrect feedback stays green/red**, deliberately not recoloured to sky —
visual distinction and accessibility.

**Fonts: Georgia (headings) / Segoe UI (body).** System fonts, no web-font loading.
Fraunces and Inter were removed from both the app and the export. Settled, not open.

**AI disclosure:** small type, visually secondary, **bottom-left of the video, immediately
above the caption band**, **once at the start of the application video only**, never on later
scenes, fades after ~2–3 s, must not overlap captions or the lower-third.
**Use the exact wording already implemented — do not reconstruct or paraphrase it.**

**Mobile is responsive, not a separate mode.** Narrow screens put video at top full-width
with the content panel stacked beneath; thumb-tappable options; legible without pinch-zoom.

## Verify

```bash
npm test        # the lesson's own suite plus the delivery-integrity tests
npm run build   # the lesson-graph validator runs here
```

## Stop conditions

- A lesson needs a component change (see stage 2).
- A styling change would alter a locked colour role or the start-gate behaviour.
- Any caption cue extends past `video_dur_s`.
