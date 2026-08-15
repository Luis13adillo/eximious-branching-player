import { describe, it, expect } from "vitest";
import { seededShuffle, orderOptionsForAttempt } from "./shuffle";

type Opt = { id: string; isCorrect: boolean };
const OPTS: Opt[] = [
  { id: "A", isCorrect: false },
  { id: "B", isCorrect: true },
  { id: "C", isCorrect: false },
  { id: "D", isCorrect: false },
];
const ids = (a: Opt[]) => a.map((o) => o.id).join("");

describe("seededShuffle", () => {
  it("is deterministic for the same seed", () => {
    expect(ids(seededShuffle(OPTS, "x"))).toBe(ids(seededShuffle(OPTS, "x")));
  });
  it("is a permutation (no loss, no duplication)", () => {
    const out = seededShuffle(OPTS, "seed-1");
    expect(out).toHaveLength(OPTS.length);
    expect([...out.map((o) => o.id)].sort()).toEqual(["A", "B", "C", "D"]);
  });
  it("does not mutate the input", () => {
    const before = ids(OPTS);
    seededShuffle(OPTS, "seed-2");
    expect(ids(OPTS)).toBe(before);
  });
  it("preserves each option's identity object (same references)", () => {
    const out = seededShuffle(OPTS, "seed-3");
    for (const o of OPTS) expect(out).toContain(o); // same object refs, reordered
  });
});

describe("orderOptionsForAttempt", () => {
  it("first visit (0 attempts) keeps the lesson-defined order", () => {
    expect(ids(orderOptionsForAttempt(OPTS, "decision-1", 0))).toBe("ABCD");
  });
  it("stable within a visit: same (sceneId, attemptCount) => same order", () => {
    const a = orderOptionsForAttempt(OPTS, "decision-1", 1);
    const b = orderOptionsForAttempt(OPTS, "decision-1", 1);
    expect(ids(a)).toBe(ids(b));
  });
  it("reshuffles between retries — every consecutive order differs (visible movement)", () => {
    // Include decision-3, whose plain seed for attempt 1 collides with lesson
    // order (ABCD) and must be perturbed to guarantee movement.
    for (const scene of ["decision-1", "decision-2", "decision-3"]) {
      const orders = [0, 1, 2, 3].map((n) => ids(orderOptionsForAttempt(OPTS, scene, n)));
      for (const o of orders) expect([...o].sort().join("")).toBe("ABCD"); // always a full permutation
      for (let i = 1; i < orders.length; i++) {
        expect(orders[i]).not.toBe(orders[i - 1]); // never repeats the previous order
      }
    }
  });
  it("correctness travels with the option, never with the position", () => {
    for (let n = 0; n <= 5; n++) {
      const out = orderOptionsForAttempt(OPTS, "decision-1", n);
      const correct = out.filter((o) => o.isCorrect);
      expect(correct).toHaveLength(1);
      expect(correct[0].id).toBe("B"); // identity intact regardless of shuffle
    }
  });
  it("different decisions shuffle independently", () => {
    const d1 = ids(orderOptionsForAttempt(OPTS, "decision-1", 1));
    const d2 = ids(orderOptionsForAttempt(OPTS, "decision-2", 1));
    // Independent seeds; not asserting inequality (could coincide) — asserting
    // each is a valid permutation keyed to its own scene id.
    expect([...d1].sort().join("")).toBe("ABCD");
    expect([...d2].sort().join("")).toBe("ABCD");
  });
});
