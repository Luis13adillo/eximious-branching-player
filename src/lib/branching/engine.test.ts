import { describe, expect, it } from "vitest";
import {
  advance,
  decisionOrder,
  initMachine,
  lessonOutline,
  selectOption,
  validateLesson,
} from "./engine";
import type { DecisionScene, OptionId, QuizScene } from "./types";
import { waterDamageClaim } from "@/lib/lessons/water-damage-claim";
import { claimsInvestigationApplication1 } from "@/lib/lessons/claims-investigation-application-1";
import { listLessons } from "@/lib/lessons";

const lesson = waterDamageClaim;

describe("lesson integrity", () => {
  it("the water-damage lesson is valid", () => {
    expect(validateLesson(lesson)).toEqual([]);
  });

  it("every registered lesson is valid", () => {
    // listLessons() only runs if the registry (which validates on load) built.
    expect(listLessons().length).toBeGreaterThan(0);
  });

  it("the decision has exactly four options with one correct answer", () => {
    const decision = lesson.scenes["decision-1"] as DecisionScene;
    expect(decision.type).toBe("decision");
    expect(decision.options).toHaveLength(4);
    expect(decision.options.filter((o) => o.isCorrect)).toHaveLength(1);
    expect(decision.options.map((o) => o.id)).toEqual(["A", "B", "C", "D"]);
  });
});

describe("state machine — narrative spine", () => {
  it("starts at the intro and reaches the decision by advancing", () => {
    let s = initMachine(lesson, 0);
    expect(s.currentSceneId).toBe("intro");
    expect(s.status).toBe("playing");

    s = advance(s, lesson); // loss-evidence
    s = advance(s, lesson); // policy-briefing
    s = advance(s, lesson); // decision-1
    expect(s.currentSceneId).toBe("decision-1");
    expect(s.status).toBe("awaiting-decision");
  });

  it("advance() is a no-op on a decision scene (must choose first)", () => {
    let s = initMachine(lesson, 0);
    s = advance(advance(advance(s, lesson), lesson), lesson); // decision-1
    const same = advance(s, lesson);
    expect(same.currentSceneId).toBe("decision-1");
  });
});

describe("branching — every option routes to distinct feedback and rejoins", () => {
  const options: OptionId[] = ["A", "B", "C", "D"];

  function atDecision() {
    let s = initMachine(lesson, 0);
    s = advance(advance(advance(s, lesson), lesson), lesson);
    return s;
  }

  it.each(options)("option %s routes to its own feedback scene", (id) => {
    const decision = lesson.scenes["decision-1"] as DecisionScene;
    const option = decision.options.find((o) => o.id === id)!;
    const s = selectOption(atDecision(), lesson, "decision-1", id, 0);
    expect(s.currentSceneId).toBe(option.feedbackSceneId);
    expect(s.decisions["decision-1"].optionId).toBe(id);
    expect(s.decisions["decision-1"].isCorrect).toBe(option.isCorrect);
  });

  it("retry-until-correct: wrong feedback returns to the decision, correct advances", () => {
    for (const id of options) {
      const decision = lesson.scenes["decision-1"] as DecisionScene;
      const option = decision.options.find((o) => o.id === id)!;
      const s = selectOption(atDecision(), lesson, "decision-1", id, 0);
      const after = advance(s, lesson).currentSceneId; // leave the feedback
      if (option.isCorrect) {
        expect(after).toBe("continuation"); // correct → rejoin/continuation
      } else {
        expect(after).toBe("decision-1"); // wrong → back to the same decision
      }
    }
  });

  it("records wrong picks as attempts and keeps the decision awaiting a choice", () => {
    let s = selectOption(atDecision(), lesson, "decision-1", "A", 0); // wrong
    s = advance(s, lesson); // back to decision-1
    expect(s.currentSceneId).toBe("decision-1");
    expect(s.status).toBe("awaiting-decision");
    expect(s.attempts["decision-1"]).toContain("A");
  });

  it("only option C is scored correct", () => {
    const correct = options.filter((id) => {
      const s = selectOption(atDecision(), lesson, "decision-1", id, 0);
      return s.decisions["decision-1"].isCorrect;
    });
    expect(correct).toEqual(["C"]);
  });
});

describe("completion", () => {
  it("reaches a complete state after the resolution", () => {
    let s = initMachine(lesson, 0);
    s = advance(advance(advance(s, lesson), lesson), lesson); // decision
    s = selectOption(s, lesson, "decision-1", "C", 0); // fb-C
    s = advance(s, lesson); // continuation
    s = advance(s, lesson); // resolution
    expect(s.currentSceneId).toBe("resolution");
    expect(s.status).toBe("complete");
  });
});

describe("outline / numbering", () => {
  it("has one decision and a six-step spine", () => {
    expect(decisionOrder(lesson)).toEqual(["decision-1"]);
    expect(lessonOutline(lesson)).toHaveLength(6);
  });
});

// ===========================================================================
// APPLICATION LESSON — full 3-decision / 12-branch traversal + quiz
// ===========================================================================
describe("application lesson — structure", () => {
  const app = claimsInvestigationApplication1;

  const DECISIONS = [
    { id: "decision-1", correct: "B", rejoin: "rejoin-1", nextStep: "decision-2" },
    { id: "decision-2", correct: "C", rejoin: "rejoin-2", nextStep: "decision-3" },
    { id: "decision-3", correct: "B", rejoin: "rejoin-3", nextStep: "resolution-1" },
  ] as const;

  it("is a valid lesson graph", () => {
    expect(validateLesson(app)).toEqual([]);
  });

  it("has exactly three decisions in order", () => {
    expect(decisionOrder(app)).toEqual([
      "decision-1",
      "decision-2",
      "decision-3",
    ]);
  });

  it("the spine is intro → assignment → 3×(decision+rejoin) → 3×resolution → quiz", () => {
    const outline = lessonOutline(app);
    expect(outline.map((s) => s.id)).toEqual([
      "intro",
      "assignment",
      "decision-1",
      "rejoin-1",
      "decision-2",
      "rejoin-2",
      "decision-3",
      "rejoin-3",
      "resolution-1",
      "resolution-2",
      "resolution-3",
      "quiz",
    ]);
    expect(outline.at(-1)!.kind).toBe("quiz");
  });

  it.each(DECISIONS)(
    "$id has 4 options, one correct ($correct), A/B/C/D",
    ({ id, correct }) => {
      const d = app.scenes[id] as DecisionScene;
      expect(d.type).toBe("decision");
      expect(d.options).toHaveLength(4);
      expect(d.options.map((o) => o.id)).toEqual(["A", "B", "C", "D"]);
      const correctOpts = d.options.filter((o) => o.isCorrect);
      expect(correctOpts).toHaveLength(1);
      expect(correctOpts[0].id).toBe(correct);
    },
  );
});

describe("application lesson — all 12 branches", () => {
  const app = claimsInvestigationApplication1;
  const opts: OptionId[] = ["A", "B", "C", "D"];

  const DECISIONS = [
    { id: "decision-1", correct: "B", rejoin: "rejoin-1", nextStep: "decision-2" },
    { id: "decision-2", correct: "C", rejoin: "rejoin-2", nextStep: "decision-3" },
    { id: "decision-3", correct: "B", rejoin: "rejoin-3", nextStep: "resolution-1" },
  ] as const;

  // Reach a decision by answering all prior decisions correctly.
  function reachDecision(target: string) {
    let s = initMachine(app, 0);
    s = advance(s, app); // intro → assignment
    s = advance(s, app); // assignment → decision-1
    for (const d of DECISIONS) {
      if (d.id === target) return s;
      s = selectOption(s, app, d.id, d.correct as OptionId, 0); // → feedback
      s = advance(s, app); // feedback → rejoin
      s = advance(s, app); // rejoin → next decision (or resolution-1)
    }
    return s;
  }

  for (const d of DECISIONS) {
    describe(d.id, () => {
      it.each(opts)(
        "option %s → its own feedback; wrong retries the decision, correct advances",
        (id) => {
          const decision = app.scenes[d.id] as DecisionScene;
          const option = decision.options.find((o) => o.id === id)!;

          // routes to this option's distinct feedback scene
          let s = selectOption(reachDecision(d.id), app, d.id, id, 0);
          expect(s.currentSceneId).toBe(option.feedbackSceneId);
          expect(s.currentSceneId).toBe(`fb-${d.id.slice(-1)}${id.toLowerCase()}`);

          // feedback verdict matches whether the option is correct
          const fb = app.scenes[s.currentSceneId];
          expect(fb.type).toBe("feedback");
          if (fb.type === "feedback") {
            expect(fb.verdict).toBe(id === d.correct ? "correct" : "incorrect");
            expect(fb.forDecisionId).toBe(d.id);
            expect(fb.forOptionId).toBe(id);
          }

          // leave the feedback: wrong → back to the same decision to retry;
          // correct → rejoin, then forward to the next step (no dead end)
          s = advance(s, app);
          if (id === d.correct) {
            expect(s.currentSceneId).toBe(d.rejoin);
            s = advance(s, app);
            expect(s.currentSceneId).toBe(d.nextStep);
          } else {
            expect(s.currentSceneId).toBe(d.id);
            expect(s.status).toBe("awaiting-decision");
            expect(s.attempts[d.id]).toContain(id);
          }
        },
      );

      it("wrong branches return to the decision; only the correct one advances", () => {
        for (const id of opts) {
          const s = advance(selectOption(reachDecision(d.id), app, d.id, id, 0), app);
          expect(s.currentSceneId).toBe(id === d.correct ? d.rejoin : d.id);
        }
      });

      it("every feedback branch carries distinct, non-empty on-screen text", () => {
        const decision = app.scenes[d.id] as DecisionScene;
        const consequences = decision.options.map((o) => {
          const fb = app.scenes[o.feedbackSceneId];
          return fb.type === "feedback" ? fb.consequence : undefined;
        });
        expect(consequences.every((c) => !!c && c.length > 0)).toBe(true);
        // the three incorrect labels are all different from one another
        const wrong = decision.options
          .filter((o) => !o.isCorrect)
          .map((o) => {
            const fb = app.scenes[o.feedbackSceneId];
            return fb.type === "feedback" ? fb.consequence : "";
          });
        expect(new Set(wrong).size).toBe(3);
      });
    });
  }

  it("supports multiple wrong attempts before the correct answer advances", () => {
    let s = reachDecision("decision-1"); // at decision-1 (correct = B)
    for (const wrong of ["A", "C", "D"] as OptionId[]) {
      s = advance(selectOption(s, app, "decision-1", wrong, 0), app);
      expect(s.currentSceneId).toBe("decision-1"); // kept here to retry
      expect(s.status).toBe("awaiting-decision");
    }
    expect(s.attempts["decision-1"]).toEqual(["A", "C", "D"]);
    // now the correct answer advances
    s = advance(selectOption(s, app, "decision-1", "B", 0), app);
    expect(s.currentSceneId).toBe("rejoin-1");
  });

  it("the correct path runs start → resolution → quiz with no dead ends", () => {
    let s = initMachine(app, 0);
    s = advance(s, app); // assignment
    s = advance(s, app); // decision-1
    for (const d of DECISIONS) {
      expect(s.status).toBe("awaiting-decision");
      s = selectOption(s, app, d.id, d.correct as OptionId, 0);
      s = advance(s, app); // feedback → rejoin
      s = advance(s, app); // rejoin → next
    }
    // now at resolution-1
    expect(s.currentSceneId).toBe("resolution-1");
    s = advance(s, app); // resolution-2
    s = advance(s, app); // resolution-3
    s = advance(s, app); // quiz
    expect(s.currentSceneId).toBe("quiz");
    expect(s.status).toBe("quiz");
    // quiz is terminal — advancing does nothing (no dead-end crash)
    expect(advance(s, app).currentSceneId).toBe("quiz");
  });
});

describe("application lesson — graded quiz", () => {
  const quiz = claimsInvestigationApplication1.scenes["quiz"] as QuizScene;

  it("is a 5-question quiz at 80% to pass", () => {
    expect(quiz.type).toBe("quiz");
    expect(quiz.passPct).toBe(80);
    expect(quiz.questions).toHaveLength(5);
  });

  it("every question has exactly one correct option", () => {
    for (const q of quiz.questions) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.options.filter((o) => o.isCorrect)).toHaveLength(1);
    }
  });
});
