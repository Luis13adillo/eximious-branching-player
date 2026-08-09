import { describe, expect, it } from "vitest";
import {
  advance,
  decisionOrder,
  initMachine,
  lessonOutline,
  selectOption,
  validateLesson,
} from "./engine";
import type { DecisionScene, OptionId } from "./types";
import { waterDamageClaim } from "@/lib/lessons/water-damage-claim";
import { listLessons } from "@/lib/lessons";

const lesson = waterDamageClaim;

describe("lesson integrity", () => {
  it("the demo lesson is valid", () => {
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

  it("all four feedback branches rejoin the same continuation scene", () => {
    const targets = new Set(
      options.map((id) => {
        const s = selectOption(atDecision(), lesson, "decision-1", id, 0);
        return advance(s, lesson).currentSceneId; // feedback → rejoin
      }),
    );
    expect(targets.size).toBe(1);
    expect([...targets][0]).toBe("continuation");
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
