/**
 * Deterministic seeded shuffle for decision options.
 * ============================================================================
 * Reshuffling answer order on a retry is a template-level anti-gaming behavior:
 * a learner who got it wrong can't just "pick the 3rd one next time". The
 * shuffle is DETERMINISTIC (seeded) so it is:
 *   - stable across re-renders within a single visit (options don't jump while
 *     the learner is reading), and
 *   - reproducible in tests.
 * It reorders ONLY the display array — every option object keeps its own
 * identity (id, correctness, feedback routing, analytics), so nothing about
 * correctness or state depends on screen position.
 */

// FNV-1a string hash → 32-bit unsigned seed.
function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32 — tiny, fast, seedable PRNG.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic Fisher–Yates shuffle. Same `seed` → same order every time. */
export function seededShuffle<T>(arr: readonly T[], seed: string): T[] {
  const rng = mulberry32(hashSeed(seed));
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function sameOrder<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

/**
 * Display order for a decision's options.
 *   attemptCount === 0 → lesson-defined order (the FIRST visit is never shuffled).
 *   attemptCount  >  0 → a deterministic reshuffle keyed to (sceneId, attemptCount),
 *                        so it stays put during a visit and changes on each retry.
 * Guarantees VISIBLE movement: the returned order is never identical to the
 * order shown on the previous attempt (a plain seeded shuffle can, ~1 in 24 for
 * four options, reproduce the prior order). If it collides we re-seed, then
 * rotate as a last resort. Only the array order changes; the option objects
 * (and their identities) are passed through untouched.
 */
export function orderOptionsForAttempt<T>(
  options: readonly T[],
  sceneId: string,
  attemptCount: number,
): T[] {
  if (attemptCount <= 0) return options.slice();
  const prev = orderOptionsForAttempt(options, sceneId, attemptCount - 1);
  let out = seededShuffle(options, `${sceneId}#${attemptCount}`);
  for (let salt = 1; salt < 8 && sameOrder(out, prev); salt++) {
    out = seededShuffle(options, `${sceneId}#${attemptCount}#${salt}`);
  }
  if (sameOrder(out, prev) && out.length > 1) {
    out = [...out.slice(1), out[0]]; // guaranteed-different rotation
  }
  return out;
}
