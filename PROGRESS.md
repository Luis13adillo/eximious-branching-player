# Status

Eximious Academy — Interactive Branching Video Player.

## Shipped

- Reusable, data-driven branching player (content lives in structured data, not code).
- Featured lesson: **Fundamentals of Claims Investigation — Application Video 1 of 3**
  - 3 decision points, 4 options each, 12 individual feedback branches.
  - Retry-until-correct: a wrong answer plays its specific feedback and returns
    to the same decision (tried options marked); only the correct answer advances
    to the rejoin and continues.
  - Full resolution, then a graded 5-question completion quiz (80% to pass).
- Speaking-avatar video on presenter scenes; voiceover over full-screen evidence;
  synced captions throughout. Media is attached per scene via data.
- Responsive on desktop, tablet, and mobile. Keyboard accessible. Iframe-safe for
  Thinkific / LMS embedding.
- Analytics seam (`onAnswerSelected`, `onSceneEnter`, `onLessonComplete`,
  `onQuizCompleted`) with no analytics dependency baked in.
- Engine unit tests plus automated full-flow browser checks (desktop + mobile).

## Notes

- A second lesson (`water-damage-claim`) is included as an additional example.
- See `README.md` for local development, lesson configuration, media replacement,
  deployment, and embedding.
