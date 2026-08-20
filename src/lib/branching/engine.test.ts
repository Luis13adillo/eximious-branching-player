import { describe, expect, it } from "vitest";
import {
  advance,
  decisionOrder,
  initMachine,
  lessonOutline,
  progressIndexForScene,
  progressSteps,
  selectOption,
  validateLesson,
} from "./engine";
import type { DecisionScene, OptionId } from "./types";
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
// PILOT — claims-01 AV1 (Marcus Delaney)
// Full 3-decision / 12-branch traversal, authored verbatim to the pilot script.
// ===========================================================================

const app = claimsInvestigationApplication1;

/**
 * The script's own graph. `rejoin` is where the correct answer lands; `then` is
 * every further narrative beat before the next decision (Decision 1's rejoin is
 * split across two on-screen states, exactly as the script writes it).
 */
const DECISIONS = [
  {
    id: "decision-1",
    correct: "D",
    rejoin: "rejoin-1a",
    then: ["rejoin-1b"],
    next: "decision-2",
  },
  {
    id: "decision-2",
    correct: "B",
    rejoin: "rejoin-2",
    then: [],
    next: "decision-3",
  },
  {
    id: "decision-3",
    correct: "B",
    rejoin: "rejoin-3",
    then: [],
    next: "resolution-1",
  },
] as const;

/** intro → assignment-1 → assignment-2 → decision-1. */
function atFirstDecision() {
  let s = initMachine(app, 0);
  s = advance(s, app); // assignment-1
  s = advance(s, app); // assignment-2
  s = advance(s, app); // decision-1
  return s;
}

/** Answer every prior decision correctly to arrive at `target`. */
function reachDecision(target: string) {
  let s = atFirstDecision();
  for (const d of DECISIONS) {
    if (d.id === target) return s;
    s = selectOption(s, app, d.id, d.correct as OptionId, 0); // → correct feedback
    s = advance(s, app); // → rejoin
    for (let i = 0; i < d.then.length; i++) s = advance(s, app); // further beats
    s = advance(s, app); // → next decision
  }
  return s;
}

describe("pilot claims-01 AV1 — structure", () => {
  it("is a valid lesson graph", () => {
    expect(validateLesson(app)).toEqual([]);
  });

  it("carries the pilot's identity, not the water-damage template's", () => {
    expect(app.meta?.caseId).toBe("4471-88203");
    expect(app.subtitle).toContain("The File Lands on Your Desk");
    // The demo case id and its content must not survive anywhere in the data.
    const blob = JSON.stringify(app).toLowerCase();
    for (const demo of [
      "2043-rw",
      "basement",
      "supply line",
      "washing machine",
      "plumber",
      "moisture",
      "water damage",
    ]) {
      expect(blob).not.toContain(demo);
    }
    expect(blob).toContain("delaney");
  });

  it("has exactly three decisions in script order", () => {
    expect(decisionOrder(app)).toEqual([
      "decision-1",
      "decision-2",
      "decision-3",
    ]);
  });

  it("the spine follows the script's own segment splits", () => {
    expect(lessonOutline(app).map((s) => s.id)).toEqual([
      "intro",
      "assignment-1",
      "assignment-2",
      "decision-1",
      "rejoin-1a",
      "rejoin-1b",
      "decision-2",
      "rejoin-2",
      "decision-3",
      "rejoin-3",
      "resolution-1",
      "resolution-2",
      "resolution-3",
    ]);
  });

  it("ends by handing off, with no in-video quiz", () => {
    const last = app.scenes["resolution-3"];
    expect(last.type).toBe("narrative");
    if (last.type === "narrative") expect(last.next).toBeNull();
    expect(last.continueLabel).toBe("Continue to the next lessons");
    expect(
      Object.values(app.scenes).filter((sc) => sc.type === "quiz"),
    ).toHaveLength(0);
  });

  it.each(DECISIONS)(
    "$id has 4 options A/B/C/D with one correct ($correct)",
    ({ id, correct }) => {
      const d = app.scenes[id] as DecisionScene;
      expect(d.type).toBe("decision");
      expect(d.options).toHaveLength(4);
      expect(d.options.map((o) => o.id)).toEqual(["A", "B", "C", "D"]);
      const right = d.options.filter((o) => o.isCorrect);
      expect(right).toHaveLength(1);
      expect(right[0].id).toBe(correct);
    },
  );

  it("has twelve feedback segments — one per option, no sharing", () => {
    const feedback = Object.values(app.scenes).filter(
      (sc) => sc.type === "feedback",
    );
    expect(feedback).toHaveLength(12);
    const routed = DECISIONS.flatMap((d) =>
      (app.scenes[d.id] as DecisionScene).options.map((o) => o.feedbackSceneId),
    );
    expect(new Set(routed).size).toBe(12);
  });
});

describe("pilot claims-01 AV1 — all 12 branches", () => {
  const opts: OptionId[] = ["A", "B", "C", "D"];

  for (const d of DECISIONS) {
    describe(d.id, () => {
      it.each(opts)(
        "option %s routes to its own feedback; wrong retries, correct advances",
        (id) => {
          const decision = app.scenes[d.id] as DecisionScene;
          const option = decision.options.find((o) => o.id === id)!;

          let s = selectOption(reachDecision(d.id), app, d.id, id, 0);
          expect(s.currentSceneId).toBe(option.feedbackSceneId);
          expect(s.currentSceneId).toBe(`fb-${d.id.slice(-1)}${id.toLowerCase()}`);

          const fb = app.scenes[s.currentSceneId];
          expect(fb.type).toBe("feedback");
          if (fb.type === "feedback") {
            expect(fb.verdict).toBe(id === d.correct ? "correct" : "incorrect");
            expect(fb.forDecisionId).toBe(d.id);
            expect(fb.forOptionId).toBe(id);
          }

          s = advance(s, app);
          if (id === d.correct) {
            expect(s.currentSceneId).toBe(d.rejoin);
            for (const beat of d.then) {
              s = advance(s, app);
              expect(s.currentSceneId).toBe(beat);
            }
            s = advance(s, app);
            expect(s.currentSceneId).toBe(d.next);
          } else {
            expect(s.currentSceneId).toBe(d.id);
            expect(s.status).toBe("awaiting-decision");
            expect(s.attempts[d.id]).toContain(id);
          }
        },
      );

      it("every option carries its own on-screen cue text", () => {
        const decision = app.scenes[d.id] as DecisionScene;
        const wrong = decision.options
          .filter((o) => !o.isCorrect)
          .map((o) => {
            const fb = app.scenes[o.feedbackSceneId];
            return fb.type === "feedback" ? (fb.consequence ?? "") : "";
          });
        expect(wrong.every((c) => c.length > 0)).toBe(true);
        expect(new Set(wrong).size).toBe(3);

        const right = decision.options.find((o) => o.isCorrect)!;
        const rfb = app.scenes[right.feedbackSceneId];
        // The script writes the correct beat as [On screen: Correct] only.
        if (rfb.type === "feedback") expect(rfb.consequence).toBe("Correct");
      });
    });
  }

  it("retries until correct — three wrong answers all return to the decision", () => {
    let s = reachDecision("decision-1"); // correct = D
    for (const wrong of ["A", "B", "C"] as OptionId[]) {
      s = advance(selectOption(s, app, "decision-1", wrong, 0), app);
      expect(s.currentSceneId).toBe("decision-1");
      expect(s.status).toBe("awaiting-decision");
    }
    expect(s.attempts["decision-1"]).toEqual(["A", "B", "C"]);
    s = advance(selectOption(s, app, "decision-1", "D", 0), app);
    expect(s.currentSceneId).toBe("rejoin-1a");
  });

  it("the all-correct path runs start → resolution → hand-off with no dead ends", () => {
    let s = atFirstDecision();
    for (const d of DECISIONS) {
      expect(s.status).toBe("awaiting-decision");
      s = selectOption(s, app, d.id, d.correct as OptionId, 0);
      s = advance(s, app);
      for (let i = 0; i < d.then.length; i++) s = advance(s, app);
      s = advance(s, app);
    }
    expect(s.currentSceneId).toBe("resolution-1");
    s = advance(s, app); // resolution-2
    s = advance(s, app); // resolution-3
    expect(s.currentSceneId).toBe("resolution-3");
    expect(s.status).toBe("complete");
    // terminal — advancing again cannot crash or leave the scene
    expect(advance(s, app).currentSceneId).toBe("resolution-3");
  });
});

describe("pilot claims-01 AV1 — locked template components", () => {
  it("both four-icon rejoin cards carry exactly four items and a takeaway", () => {
    for (const id of ["rejoin-1a", "rejoin-2"]) {
      const card = app.scenes[id].summaryCard;
      expect(card, `${id} summaryCard`).toBeDefined();
      expect(card!.items).toHaveLength(4);
      expect(card!.takeaway && card!.takeaway.length > 0).toBe(true);
      for (const item of card!.items) expect(item.label.length).toBeGreaterThan(0);
    }
  });

  it("the A ≠ B comparison renders the script's timeline conflict", () => {
    const cmp = app.scenes["resolution-1"].comparison;
    expect(cmp).toBeDefined();
    expect(cmp!.conflict).toContain("Timeline of last use");
    expect(cmp!.a.value).toContain("8:15");
    expect(cmp!.b.value).toContain("9:30");
    expect(cmp!.operator ?? "≠").toBe("≠");
  });

  it("the burned-pickup exhibit is attached where the script cues it", () => {
    const ev = app.scenes["assignment-2"].evidence;
    expect(ev).toHaveLength(1);
    expect(ev![0].imageUrl).toBe("/media/evidence-burned-pickup.jpg");
    expect(ev![0].title).toContain("burned pickup on gravel road");
  });

  it("every presenter scene reads the locked presenter identity", () => {
    for (const sc of Object.values(app.scenes)) {
      if (!sc.presenter) continue;
      expect(sc.presenter.name).toBe("Diane Marchetti");
      expect(sc.presenter.role).toBe("Course Presenter");
    }
  });
});

describe("progress milestones — template behaviour", () => {
  it("a lesson with no milestone map gets one step per spine scene", () => {
    expect(waterDamageClaim.progress).toBeUndefined();
    const steps = progressSteps(waterDamageClaim);
    expect(steps.map((s) => s.id)).toEqual(
      lessonOutline(waterDamageClaim).map((o) => o.id),
    );
    expect(steps.every((s) => s.sceneIds.length === 1)).toBe(true);
  });

  it("rejects a milestone map that does not cover the spine exactly once", () => {
    const spine = lessonOutline(app).map((id) => id.id);
    const dropOne = {
      ...app,
      progress: app.progress!.map((m) => ({
        ...m,
        scenes: m.scenes.filter((sc) => sc !== "assignment-2"),
      })).filter((m) => m.scenes.length > 0),
    };
    expect(validateLesson(dropOne).join(" ")).toContain("assignment-2");

    const claimTwice = {
      ...app,
      progress: [
        ...app.progress!,
        { id: "dup", label: "Duplicate", scenes: ["intro"] },
      ],
    };
    expect(validateLesson(claimTwice).join(" ")).toContain("claimed by both");

    const ghost = {
      ...app,
      progress: [
        ...app.progress!,
        { id: "ghost", label: "Ghost", scenes: ["not-a-scene"] },
      ],
    };
    expect(validateLesson(ghost).join(" ")).toContain("not on the lesson spine");
    expect(spine.length).toBe(13); // the graph stays at 13; only the rail groups
  });
});

describe("pilot claims-01 AV1 — the approved 12-step rail", () => {
  it("shows exactly 12 learner-facing steps over a 13-scene spine", () => {
    expect(lessonOutline(app)).toHaveLength(13);
    expect(progressSteps(app)).toHaveLength(12);
  });

  it("the milestones are the approved twelve, in script order", () => {
    expect(progressSteps(app).map((s) => s.label)).toEqual([
      "You have the file",
      "The assignment",
      "Decision 1 · Investigation trigger",
      "The documented trigger",
      "Know your box",
      "Decision 2 · Burden of proof",
      "Issue · Burden · Standard · Evidence",
      "Decision 3 · Motive",
      "Motive vs. evidence",
      "Where the file stands",
      "Keep investigating",
      "Same method. Different answer.",
    ]);
  });

  it("groups only the assignment — no scene is removed or merged away", () => {
    const steps = progressSteps(app);
    const grouped = steps.filter((s) => s.sceneIds.length > 1);
    expect(grouped).toHaveLength(1);
    expect(grouped[0].sceneIds).toEqual(["assignment-1", "assignment-2"]);
    // every spine scene still appears exactly once across the rail
    expect(steps.flatMap((s) => s.sceneIds).sort()).toEqual(
      lessonOutline(app).map((o) => o.id).sort(),
    );
    // and all 25 scenes still exist and still play
    expect(Object.keys(app.scenes)).toHaveLength(25);
  });

  it("the three decisions read as decision steps", () => {
    expect(
      progressSteps(app).filter((s) => s.kind === "decision").map((s) => s.id),
    ).toEqual(["decision-1", "decision-2", "decision-3"]);
  });

  it("both assignment scenes sit on the same step, so the rail cannot jump", () => {
    expect(progressIndexForScene(app, "assignment-1")).toBe(1);
    expect(progressIndexForScene(app, "assignment-2")).toBe(1);
  });

  it("feedback branches map back to their decision's step", () => {
    for (const [fb, decisionStep] of [
      ["fb-1a", 2],
      ["fb-1d", 2],
      ["fb-2c", 5],
      ["fb-3b", 7],
    ] as const) {
      expect(progressIndexForScene(app, fb)).toBe(decisionStep);
    }
  });

  it("the rail advances monotonically along the correct path", () => {
    let s = atFirstDecision();
    const seen = [progressIndexForScene(app, "intro")];
    for (const d of DECISIONS) {
      seen.push(progressIndexForScene(app, s.currentSceneId));
      s = selectOption(s, app, d.id, d.correct as OptionId, 0);
      s = advance(s, app);
      for (let i = 0; i < d.then.length; i++) {
        seen.push(progressIndexForScene(app, s.currentSceneId));
        s = advance(s, app);
      }
      seen.push(progressIndexForScene(app, s.currentSceneId));
      s = advance(s, app);
    }
    for (let i = 1; i < seen.length; i++) {
      expect(seen[i]).toBeGreaterThanOrEqual(seen[i - 1]);
    }
    expect(seen.at(-1)).toBeLessThan(12);
  });
});

describe("pilot claims-01 AV1 — storyboard visuals", () => {
  it("resolution-1 carries the three-column HAVE / NEED / UNAVAILABLE inventory", () => {
    const inv = app.scenes["resolution-1"].inventory;
    expect(inv).toBeDefined();
    expect(inv!.entries).toHaveLength(5);

    const byLabel = Object.fromEntries(inv!.entries.map((e) => [e.label, e]));
    expect(byLabel["Both keys"].status).toBe("need");
    expect(byLabel["Forced entry"].status).toBe("have");
    expect(byLabel["Accelerant"].status).toBe("need");
    expect(byLabel["Timeline of last use"].status).toBe("have");
    expect(byLabel["Timeline of last use"].conflicted).toBe(true);
    expect(byLabel["Financial detail"].status).toBe("have");

    // The script grades nothing UNAVAILABLE at day fourteen — the column is
    // empty on purpose, not missing.
    expect(inv!.entries.filter((e) => e.status === "unavailable")).toHaveLength(0);
    expect(inv!.entries.every((e) => (e.note ?? "").length > 0)).toBe(true);
  });

  it("rejoin-1b carries the Adjusting → Investigation → SIU chain", () => {
    const chain = app.scenes["rejoin-1b"].chain;
    expect(chain).toBeDefined();
    expect(chain!.stages.map((st) => st.label)).toEqual([
      "Adjusting",
      "Investigation",
      "SIU",
    ]);
    // the learner is the investigator — exactly one stage is current
    const current = chain!.stages.filter((st) => st.current);
    expect(current).toHaveLength(1);
    expect(current[0].label).toBe("Investigation");
    expect(chain!.connector ?? "→").toBe("→");
    expect(chain!.takeaway).toBe("Know which box you're in.");
  });

  it("every storyboard visual is scene data, not a hard-coded lesson branch", () => {
    // The template components are only reachable through these optional scene
    // fields — no component may special-case a lesson id.
    const withExtras = Object.values(app.scenes).filter(
      (sc) => sc.inventory || sc.chain || sc.comparison || sc.summaryCard,
    );
    expect(withExtras.map((sc) => sc.id).sort()).toEqual([
      "rejoin-1a",
      "rejoin-1b",
      "rejoin-2",
      "resolution-1",
    ]);
  });
});
