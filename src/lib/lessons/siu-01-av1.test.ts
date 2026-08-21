import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { siu01Av1 } from "./siu-01-av1";
import {
  MEDIA_DELIVERED,
  NARRATION,
  NARRATION_ORDER,
  NARRATION_SHA256,
} from "./siu-01-av1.narration";
import { getLesson } from "./index";
import {
  advance,
  initMachine,
  selectOption,
  validateLesson,
} from "@/lib/branching/engine";
import type { DecisionScene, FeedbackScene, OptionId } from "@/lib/branching/types";

/**
 * siu-01 AV1 — content lock and delivered-media check
 * ============================================================================
 * The storyboard-shape and narration-hash blocks were the Gate 0 pass condition:
 * they proved the lesson matched the storyboard's SHAPE and that its narration
 * had not drifted, before a cent was spent. They still run, unchanged, and are
 * what would catch a later edit silently altering the script.
 *
 * The "Gate D media state" block replaced the Gate 0 one on 2026-08-21, when all
 * 22 segments were delivered. It asserts the opposite condition to the one it
 * supersedes: every narrated scene now requests its mp4, every URL resolves on
 * disk, and — the row that matters most — each lesson duration is read back out
 * of the delivery sidecar rather than restated here, so a re-cut that does not
 * update the lesson data fails the suite instead of desyncing the player.
 */

const REPO = path.resolve(__dirname, "../../..");
const PUBLIC = path.join(REPO, "public");

const scenes = siu01Av1.scenes;
const scene = (id: string) => scenes[id];

const decisions = Object.values(scenes).filter(
  (s): s is DecisionScene => s.type === "decision",
);
const feedback = Object.values(scenes).filter(
  (s): s is FeedbackScene => s.type === "feedback",
);

describe("storyboard shape", () => {
  it("registers under its slug", () => {
    expect(getLesson("siu-01-av1")).toBe(siu01Av1);
  });

  it("validates with no problems", () => {
    expect(validateLesson(siu01Av1)).toEqual([]);
  });

  it("has 25 scenes: 22 narrated + 3 player-native correct beats", () => {
    expect(Object.keys(scenes)).toHaveLength(25);
    expect(NARRATION_ORDER).toHaveLength(22);
    expect(feedback.filter((f) => f.verdict === "correct")).toHaveLength(3);
  });

  it("has exactly 3 decision points", () => {
    expect(decisions).toHaveLength(3);
    expect(decisions.map((d) => d.id)).toEqual([
      "decision-1",
      "decision-2",
      "decision-3",
    ]);
  });

  it("every decision has exactly 4 options, A–D, exactly one correct", () => {
    for (const d of decisions) {
      expect(d.options.map((o) => o.id)).toEqual(["A", "B", "C", "D"]);
      expect(d.options.filter((o) => o.isCorrect)).toHaveLength(1);
      for (const o of d.options) expect(o.label.trim().length).toBeGreaterThan(0);
    }
  });

  it("the correct answers are B / C / B, as the script writes them", () => {
    const correct = decisions.map(
      (d) => d.options.find((o) => o.isCorrect)!.id as OptionId,
    );
    expect(correct).toEqual(["B", "C", "B"]);
  });

  it("all 12 options route to their own distinct feedback scene", () => {
    const routes = decisions.flatMap((d) =>
      d.options.map((o) => o.feedbackSceneId),
    );
    expect(routes).toHaveLength(12);
    expect(new Set(routes).size).toBe(12);
    expect(feedback).toHaveLength(12);
    for (const id of routes) expect(scene(id)?.type).toBe("feedback");
  });

  it("every feedback scene carries its own individual content", () => {
    const wrong = feedback.filter((f) => f.verdict === "incorrect");
    expect(wrong).toHaveLength(9);
    // 9 distinct spoken rationales…
    const bodies = wrong.map((f) => f.body!);
    expect(bodies.every((b) => !!b && b.length > 100)).toBe(true);
    expect(new Set(bodies).size).toBe(9);
    // …each under its own distinct on-screen headline.
    const heads = wrong.map((f) => f.headline!);
    expect(new Set(heads).size).toBe(9);
    // The 3 correct beats are the script's silent `[On screen: Correct]`.
    for (const f of feedback.filter((x) => x.verdict === "correct")) {
      expect(f.headline).toBe("Correct");
      expect(f.body).toBeUndefined();
      expect(f.media.durationSec).toBe(0);
    }
  });

  it("each feedback scene points back at the decision and option it belongs to", () => {
    for (const d of decisions) {
      for (const o of d.options) {
        const f = scene(o.feedbackSceneId) as FeedbackScene;
        expect(f.forDecisionId).toBe(d.id);
        expect(f.forOptionId).toBe(o.id);
        expect(f.verdict).toBe(o.isCorrect ? "correct" : "incorrect");
      }
    }
  });
});

describe("branching and rejoins", () => {
  it("all four branches of each decision converge on one rejoin", () => {
    const rejoins = decisions.map((d) => {
      const nexts = new Set(
        d.options.map((o) => (scene(o.feedbackSceneId) as FeedbackScene).next),
      );
      expect(nexts.size).toBe(1);
      return [...nexts][0];
    });
    expect(rejoins).toEqual(["rejoin-1", "rejoin-2", "rejoin-3"]);
  });

  it("a wrong answer plays its own feedback then returns to the same decision", () => {
    for (const d of decisions) {
      for (const o of d.options.filter((x) => !x.isCorrect)) {
        let s = initMachine(siu01Av1, 0);
        // jump straight to the decision under test
        s = { ...s, currentSceneId: d.id, status: "awaiting-decision" };
        s = selectOption(s, siu01Av1, d.id, o.id, 0);
        expect(s.currentSceneId).toBe(o.feedbackSceneId);
        s = advance(s, siu01Av1);
        expect(s.currentSceneId).toBe(d.id);
        expect(s.status).toBe("awaiting-decision");
        expect(s.attempts[d.id]).toContain(o.id);
      }
    }
  });

  it("plays end to end, exhausting every wrong branch on the way", () => {
    let s = initMachine(siu01Av1, 0);
    const guard = 400;
    let steps = 0;
    const seen = new Set<string>([s.currentSceneId]);

    while (s.status !== "complete" && steps++ < guard) {
      if (s.status === "awaiting-decision") {
        const d = scene(s.currentSceneId) as DecisionScene;
        const tried = s.attempts[d.id] ?? [];
        const untriedWrong = d.options.find(
          (o) => !o.isCorrect && !tried.includes(o.id),
        );
        const pick = untriedWrong ?? d.options.find((o) => o.isCorrect)!;
        s = selectOption(s, siu01Av1, d.id, pick.id, 0);
      } else {
        s = advance(s, siu01Av1);
      }
      seen.add(s.currentSceneId);
    }

    expect(s.status).toBe("complete");
    expect(s.currentSceneId).toBe("resolution-4");
    // Every scene in the graph was reached on this walk — no orphans.
    expect(seen.size).toBe(25);
    expect([...seen].sort()).toEqual(Object.keys(scenes).sort());
    // All three decisions ended on the correct option.
    expect(Object.keys(s.decisions)).toHaveLength(3);
    expect(Object.values(s.decisions).every((r) => r.isCorrect)).toBe(true);
  });

  it("only resolution-4 ends the lesson; every other next resolves", () => {
    for (const sc of Object.values(scenes)) {
      if (sc.type === "quiz" || sc.type === "decision") continue;
      if (sc.next === null) {
        expect(sc.id).toBe("resolution-4");
      } else {
        expect(scene(sc.next), `${sc.id} -> ${sc.next}`).toBeDefined();
      }
    }
  });
});

describe("narration is verbatim to the authoritative script", () => {
  it.each(NARRATION_ORDER)("%s still hashes to its recorded script text", (id) => {
    const seg = NARRATION[id];
    expect(seg.text).toHaveLength(seg.scriptChars);
    expect(createHash("sha256").update(seg.text, "utf8").digest("hex")).toBe(
      seg.scriptSha256,
    );
  });

  it("the whole narration hashes to NARRATION_SHA256", () => {
    const joined = NARRATION_ORDER.map((id) => NARRATION[id].text).join("\n");
    expect(createHash("sha256").update(joined, "utf8").digest("hex")).toBe(
      NARRATION_SHA256,
    );
  });

  it("carries no un-repaired 'fi' ligature artifact", () => {
    // The script's bold face extracts "fi" as the digit 0. All three sites were
    // repaired; a digit next to a letter anywhere would mean a missed one.
    for (const id of NARRATION_ORDER) {
      expect(NARRATION[id].text, id).not.toMatch(/[A-Za-z]0|0[A-Za-z]/);
    }
    for (const sc of Object.values(scenes)) {
      for (const s of [sc.headline, sc.subhead, sc.body]) {
        if (s) expect(s, sc.id).not.toMatch(/[A-Za-z]0|0[A-Za-z]/);
      }
    }
  });

  it("every narrated scene shows exactly its segment's text", () => {
    for (const id of NARRATION_ORDER) {
      const sc = scene(id);
      expect(sc, id).toBeDefined();
      const shown = sc.type === "decision" ? sc.prompt : sc.body;
      expect(shown, id).toBe(NARRATION[id].text);
    }
  });
});

describe("captions", () => {
  it.each(NARRATION_ORDER)("%s cues re-slice the narration losslessly", (id) => {
    const seg = NARRATION[id];
    expect(seg.captions.length).toBeGreaterThan(0);
    expect(seg.captions.map((c) => c.text).join(" ")).toBe(seg.text);
  });

  it.each(NARRATION_ORDER)("%s cues tile the whole segment", (id) => {
    const seg = NARRATION[id];
    expect(seg.captions[0].start).toBe(0);
    expect(seg.captions.at(-1)!.end).toBe(seg.durationSec);
    for (let i = 0; i < seg.captions.length; i++) {
      const cue = seg.captions[i];
      expect(cue.end).toBeGreaterThan(cue.start);
      if (i > 0) expect(cue.start).toBe(seg.captions[i - 1].end);
    }
  });

  it("every narrated scene carries its captions", () => {
    for (const id of NARRATION_ORDER) {
      const sc = scene(id);
      expect(sc.media.captions, `${id} captions`).toBeDefined();
      expect(sc.media.captions).toHaveLength(NARRATION[id].captions.length);
    }
  });
});

describe("exhibits are player-native — no generated images", () => {
  it("no exhibit or comparison side references an image file", () => {
    for (const sc of Object.values(scenes)) {
      for (const ev of sc.evidence ?? []) {
        expect(ev.imageUrl, `${sc.id}/${ev.id}`).toBeUndefined();
        expect(ev.illustration, `${sc.id}/${ev.id}`).toBeUndefined();
      }
      for (const side of [sc.comparison?.a, sc.comparison?.b]) {
        if (side) expect(side.imageUrl).toBeUndefined();
      }
    }
  });

  it("carries the three exhibits the script cues, and no others", () => {
    const withExhibits = Object.values(scenes).filter((s) => !!s.evidence);
    expect(withExhibits.map((s) => s.id)).toEqual([
      "assignment-2",
      "resolution-1",
      "resolution-2",
    ]);
    // [On screen: The file, tabbed — …] names seven tabs.
    expect(scene("resolution-2").evidence).toHaveLength(7);
    expect(scene("assignment-2").evidence).toHaveLength(1);
    expect(scene("resolution-1").evidence).toHaveLength(1);
  });

  it("uses the A ≠ B comparison only where the script states a conflict", () => {
    const withComparison = Object.values(scenes).filter((s) => !!s.comparison);
    expect(withComparison.map((s) => s.id)).toEqual(["rejoin-2", "resolution-1"]);
    for (const s of withComparison) {
      expect(s.comparison!.conflict.length).toBeGreaterThan(0);
      expect(s.comparison!.a.value).not.toBe(s.comparison!.b.value);
    }
  });
});

describe("Gate D media state", () => {
  it("every narrated scene requests its delivered mp4", () => {
    expect(MEDIA_DELIVERED).toBe(true);
    for (const id of NARRATION_ORDER) {
      const sc = scene(id);
      expect(sc.media.provider, id).toBe("file");
      expect(sc.media.videoUrl, id).toBe(`/media/siu-01-av1/${id}.mp4`);
      expect(sc.media.hasAudio, id).toBe(true);
    }
  });

  it("every file URL the player would request exists on disk", () => {
    const urls = new Set<string>();
    for (const sc of Object.values(scenes)) {
      for (const u of [sc.media.videoUrl, sc.media.audioUrl, sc.media.posterUrl]) {
        if (u) urls.add(u);
      }
      for (const ev of sc.evidence ?? []) if (ev.imageUrl) urls.add(ev.imageUrl);
      for (const side of [sc.comparison?.a, sc.comparison?.b]) {
        if (side?.imageUrl) urls.add(side.imageUrl);
      }
    }
    // 22 delivered segments plus Curtis's approved production still (the poster).
    expect(urls.size).toBe(NARRATION_ORDER.length + 1);
    const missing = [...urls].filter(
      (u) => !existsSync(path.join(PUBLIC, u.replace(/^\//, ""))),
    );
    expect(missing).toEqual([]);
  });

  /**
   * The lesson's durations must be the MEASURED mp4 lengths, not a re-derivation. Reading
   * them back out of the delivery sidecars is what makes this a guard rather than a
   * restatement: if a segment is ever re-cut and the lesson data is not updated with it,
   * the player would scrub and auto-advance against a length the file no longer has.
   */
  it("durations match the delivered files, and the 0.240 s lead is present", () => {
    for (const id of NARRATION_ORDER) {
      const car = JSON.parse(
        readFileSync(path.join(PUBLIC, "media/siu-01-av1", `${id}.mp4.json`), "utf8"),
      );
      expect(car.split.lead_s, id).toBe(0.24);
      expect(NARRATION[id].durationSec, id).toBe(car.split.video_dur_s);
      // Cues are authored against narration time, so the first one absorbs the lead-in
      // silence and the segment's spoken content cannot begin before it.
      expect(NARRATION[id].captions[0].end, id).toBeGreaterThan(car.split.lead_s);
    }
  });

  it("durations are provisional but present, so the player can run", () => {
    for (const id of NARRATION_ORDER) {
      expect(NARRATION[id].durationSec).toBeGreaterThan(0);
      expect(scene(id).media.durationSec).toBe(NARRATION[id].durationSec);
    }
  });
});
