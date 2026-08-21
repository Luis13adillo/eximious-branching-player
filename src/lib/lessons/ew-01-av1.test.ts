import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  advance,
  initMachine,
  lessonOutline,
  selectOption,
  validateLesson,
} from "@/lib/branching/engine";
import type { DecisionScene, FeedbackScene } from "@/lib/branching/types";
import { ew01Av1 } from "./ew-01-av1";
import {
  MEDIA_DELIVERED,
  NARRATION,
  NARRATION_CHARS,
  NARRATION_SHA256,
} from "./ew-01-av1.narration";
import { getLesson } from "./index";

/**
 * ew-01 AV1 — GATE 0 storyboard integrity
 * ============================================================================
 * Gate 0 locks the STORYBOOK, not the media: the segment map, the three
 * decisions and their twelve individual feedback paths, the rejoins, the
 * resolution, the on-screen cues and the caption mapping. No audio, video or
 * exhibit image exists yet, so the media-dependent rows below arm themselves
 * automatically once `MEDIA_DELIVERED` flips — they are written now so Gate C
 * inherits them rather than inventing them.
 */

const REPO = path.resolve(__dirname, "../../..");
const IDS = Object.keys(NARRATION) as (keyof typeof NARRATION)[];
const scenes = ew01Av1.scenes;
const decisions = ["decision-1", "decision-2", "decision-3"] as const;

const decision = (id: string) => scenes[id] as DecisionScene;
const feedback = (id: string) => scenes[id] as FeedbackScene;

describe("storyboard shape", () => {
  it("registers under its slug", () => {
    expect(getLesson("ew-01-av1")).toBe(ew01Av1);
  });

  it("validates with no problems", () => {
    expect(validateLesson(ew01Av1)).toEqual([]);
  });

  it("has 28 scenes: 25 narrated + 3 player-native correct beats", () => {
    expect(Object.keys(scenes)).toHaveLength(28);
    expect(IDS).toHaveLength(25);
    const beats = ["fb-1b", "fb-2b", "fb-3b"];
    expect(Object.keys(scenes).filter((id) => !IDS.includes(id as never)).sort())
      .toEqual(beats.sort());
  });

  it("has exactly 3 decision points", () => {
    const found = Object.values(scenes).filter((s) => s.type === "decision");
    expect(found.map((s) => s.id)).toEqual([...decisions]);
  });

  it("every decision has exactly 4 options, A–D, exactly one correct", () => {
    for (const id of decisions) {
      const d = decision(id);
      expect(d.options.map((o) => o.id), id).toEqual(["A", "B", "C", "D"]);
      expect(d.options.filter((o) => o.isCorrect), id).toHaveLength(1);
    }
  });

  it("the correct answer is B on all three, as the script writes them", () => {
    for (const id of decisions) {
      expect(decision(id).options.find((o) => o.isCorrect)!.id, id).toBe("B");
    }
  });

  it("all 12 options route to their own distinct feedback scene", () => {
    const targets = decisions.flatMap((id) =>
      decision(id).options.map((o) => o.feedbackSceneId),
    );
    expect(targets).toHaveLength(12);
    expect(new Set(targets).size).toBe(12);
    for (const t of targets) expect(scenes[t]?.type, t).toBe("feedback");
  });

  it("every incorrect option gets its own individual spoken feedback", () => {
    const wrong = decisions.flatMap((id) =>
      decision(id).options.filter((o) => !o.isCorrect),
    );
    expect(wrong).toHaveLength(9);
    const bodies = wrong.map((o) => scenes[o.feedbackSceneId].body);
    expect(bodies.every((b) => typeof b === "string" && b.length > 0)).toBe(true);
    // Individual, not generic — no two branches share a word of rationale.
    expect(new Set(bodies).size).toBe(9);
  });

  it("the 3 correct beats are player-native: no narration, no media", () => {
    for (const id of ["fb-1b", "fb-2b", "fb-3b"]) {
      const s = scenes[id];
      expect(s.body, id).toBeUndefined();
      expect(s.media.videoUrl, id).toBeUndefined();
      expect(s.media.audioUrl, id).toBeUndefined();
      expect(s.media.durationSec, id).toBe(0);
      expect(s.headline, id).toBe("Correct");
    }
  });

  it("each feedback scene points back at the decision and option it owns", () => {
    for (const id of decisions) {
      for (const o of decision(id).options) {
        const fb = feedback(o.feedbackSceneId);
        expect(fb.forDecisionId, fb.id).toBe(id);
        expect(fb.forOptionId, fb.id).toBe(o.id);
        expect(fb.verdict, fb.id).toBe(o.isCorrect ? "correct" : "incorrect");
      }
    }
  });
});

describe("branching, retry and rejoins", () => {
  it("all four branches of each decision converge on one rejoin", () => {
    const rejoins = { "decision-1": "rejoin-1a", "decision-2": "rejoin-2a", "decision-3": "rejoin-3" };
    for (const id of decisions) {
      const nexts = decision(id).options.map(
        (o) => feedback(o.feedbackSceneId).next,
      );
      expect(new Set(nexts).size, id).toBe(1);
      expect(nexts[0], id).toBe(rejoins[id]);
    }
  });

  /** Drive the real machine from the start to the given decision. */
  const runTo = (target: string) => {
    let state = initMachine(ew01Av1, 0);
    let guard = 0;
    while (state.currentSceneId !== target && guard++ < 200) {
      const here = scenes[state.currentSceneId];
      state =
        here.type === "decision"
          ? selectOption(
              state,
              ew01Av1,
              here.id,
              here.options.find((o) => o.isCorrect)!.id,
              0,
            )
          : advance(state, ew01Av1);
    }
    expect(state.currentSceneId).toBe(target);
    return state;
  };

  it("a wrong answer plays its own feedback, then returns to the same decision", () => {
    for (const id of decisions) {
      for (const o of decision(id).options.filter((x) => !x.isCorrect)) {
        const at = runTo(id);
        const afterChoice = selectOption(at, ew01Av1, id, o.id, 0);
        expect(afterChoice.currentSceneId, `${id}/${o.id}`).toBe(
          o.feedbackSceneId,
        );
        const afterFeedback = advance(afterChoice, ew01Av1);
        expect(afterFeedback.currentSceneId, `${id}/${o.id}`).toBe(id);
        expect(afterFeedback.attempts[id], `${id}/${o.id}`).toContain(o.id);
      }
    }
  });

  it("only the correct answer moves the lesson forward", () => {
    const rejoins = {
      "decision-1": "rejoin-1a",
      "decision-2": "rejoin-2a",
      "decision-3": "rejoin-3",
    };
    for (const id of decisions) {
      const right = decision(id).options.find((o) => o.isCorrect)!;
      const afterChoice = selectOption(runTo(id), ew01Av1, id, right.id, 0);
      expect(afterChoice.currentSceneId, id).toBe(right.feedbackSceneId);
      expect(advance(afterChoice, ew01Av1).currentSceneId, id).toBe(rejoins[id]);
    }
  });

  it("plays end to end, exhausting every wrong branch on the way", () => {
    let state = initMachine(ew01Av1, 0);
    const seen = new Set<string>();
    let guard = 0;
    while (state.status !== "complete" && guard++ < 400) {
      seen.add(state.currentSceneId);
      const here = scenes[state.currentSceneId];
      if (here.type === "decision") {
        const untried = here.options.find(
          (o) => !o.isCorrect && !(state.attempts[here.id] ?? []).includes(o.id),
        );
        const pick = untried ?? here.options.find((o) => o.isCorrect)!;
        state = selectOption(state, ew01Av1, here.id, pick.id, 0);
      } else {
        state = advance(state, ew01Av1);
      }
    }
    // The terminal scene is marked complete as it is ENTERED, so the loop
    // exits holding it — count it before asserting.
    seen.add(state.currentSceneId);
    expect(state.status).toBe("complete");
    expect(state.currentSceneId).toBe("resolution-3");
    // All 28 scenes were entered: the 16-scene spine plus all 12 branches.
    expect(seen.size).toBe(28);
    expect(
      Object.keys(scenes).filter((id) => !seen.has(id)),
      "scenes a learner can never reach",
    ).toEqual([]);
  });

  it("the spine runs intro → resolution-3 and only resolution-3 ends it", () => {
    const spine = lessonOutline(ew01Av1).map((s) => s.id);
    expect(spine[0]).toBe("intro");
    expect(spine.at(-1)).toBe("resolution-3");
    expect(spine).toHaveLength(16);
    for (const s of Object.values(scenes)) {
      if (s.type === "narrative") {
        if (s.id === "resolution-3") expect(s.next).toBeNull();
        else expect(scenes[s.next!], s.id).toBeDefined();
      }
    }
  });

  it("the progress rail covers the spine exactly once", () => {
    const claimed = ew01Av1.progress!.flatMap((m) => m.scenes);
    expect(claimed.sort()).toEqual(lessonOutline(ew01Av1).map((s) => s.id).sort());
  });
});

describe("narration is verbatim to the authoritative EW-01 script", () => {
  it("carries all 25 narrated segments in script order", () => {
    expect(IDS).toEqual([
      "intro", "assignment-1", "assignment-2", "assignment-3", "assignment-4",
      "decision-1",
      "fb-1a", "fb-1c", "fb-1d", "rejoin-1a", "rejoin-1b",
      "decision-2", "fb-2a", "fb-2c", "fb-2d", "rejoin-2a", "rejoin-2b",
      "decision-3", "fb-3a", "fb-3c", "fb-3d", "rejoin-3",
      "resolution-1", "resolution-2", "resolution-3",
    ]);
  });

  it("hashes to the recorded transcription fingerprint", () => {
    const joined = IDS.map((id) => NARRATION[id].text).join("\n");
    expect(createHash("sha256").update(joined, "utf8").digest("hex")).toBe(
      NARRATION_SHA256,
    );
    expect(IDS.reduce((n, id) => n + NARRATION[id].text.length, 0)).toBe(
      NARRATION_CHARS,
    );
  });

  it("carries no un-repaired 'fi' ligature artifact from the PDF", () => {
    // pdftotext renders this font's `fi` ligature as "0" — "filed" came out
    // "0led". Any residue would be silently mispronounced by TTS.
    for (const id of IDS) {
      expect(NARRATION[id].text, id).not.toMatch(/[A-Za-z]0[A-Za-z]/);
    }
  });

  it("carries no bracketed on-screen cue as spoken narration", () => {
    // The script's cover page: bracketed cues are visual direction, never
    // spoken. They belong in headline/subhead/evidence, not in `text`.
    for (const id of IDS) expect(NARRATION[id].text, id).not.toMatch(/[[\]]/);
  });

  it("carries no structural script marker as spoken narration", () => {
    // REGRESSION GUARD (added 2026-08-20 after Gate A). The bracket check above
    // only catches cues the script wraps in `[...]`. The branch headers do not
    // wrap: "\u2192 IF THEY CHOOSE C:" runs byte-contiguous with the tail of the
    // feedback beat before it, so nine of them passed both the bracket test and
    // the contiguity test and reached the TTS. Two were spoken aloud on the
    // delivered audio. Every structural form the script uses is checked here,
    // not just the bracketed one.
    const STRUCTURAL: [string, RegExp][] = [
      ["branch header", /\u2192\s*IF THEY CHOOSE/i],
      ["any arrow-led direction", /\u2192/],
      ["decision header", /\bDECISION [123]\b/],
      ["branch marker", /\bBranches?\s*$/],
      ["on-screen cue", /On screen:/i],
      ["title card", /\bTitle:/],
      ["option letter", /^[A-D]\.\s/m],
      ["speaker/section heading", /^[A-Z][A-Z ’'-]{6,}$/m],
    ];
    for (const id of IDS) {
      for (const [what, re] of STRUCTURAL) {
        expect(NARRATION[id].text, `${id}: ${what}`).not.toMatch(re);
      }
    }
  });

  it("never speaks the A–D option text", () => {
    const spoken = IDS.map((id) => NARRATION[id].text).join(" ");
    for (const id of decisions) {
      for (const o of decision(id).options) {
        expect(spoken, `${id}/${o.id}`).not.toContain(o.label);
      }
    }
  });

  it("every narrated scene shows exactly its own segment's text", () => {
    for (const id of IDS) {
      const s = scenes[id];
      const text = s.type === "decision" ? s.prompt : s.body;
      expect(text, id).toBe(NARRATION[id].text);
    }
  });
});

describe("captions", () => {
  it.each(IDS)("%s cues re-slice the narration losslessly", (id) => {
    const seg = NARRATION[id];
    expect(seg.captions.length).toBeGreaterThan(0);
    expect(seg.captions.map((c) => c.text).join(" ")).toBe(seg.text);
  });

  it.each(IDS)("%s cues tile the whole segment with no gap or overrun", (id) => {
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
    for (const id of IDS) {
      expect(scenes[id].media.captions, `${id} captions`).toHaveLength(
        NARRATION[id].captions.length,
      );
    }
  });
});

describe("on-screen cues and locked template components", () => {
  it("carries the two photographic exhibits the script cues, and no others", () => {
    const withEvidence = Object.values(scenes).filter((s) => s.evidence?.length);
    expect(withEvidence.map((s) => s.id)).toEqual([
      "assignment-3",
      "resolution-2",
    ]);
    for (const s of withEvidence) {
      expect(s.evidence![0].kind, s.id).toBe("photo");
      // Cue text is carried verbatim as the exhibit title.
      expect(s.evidence![0].title.length, s.id).toBeGreaterThan(40);
    }
  });

  it("uses the A ≠ B comparison exactly where the script contrasts two experts", () => {
    const withComparison = Object.values(scenes).filter((s) => s.comparison);
    expect(withComparison.map((s) => s.id)).toEqual(["rejoin-1b"]);
    const c = withComparison[0].comparison!;
    expect(c.a.label).toBe("LEFT");
    expect(c.b.label).toBe("RIGHT");
    expect(c.conflict).toBe("Two experts, two outcomes.");
  });

  it("uses the four-icon summary card only for the four scoped issues", () => {
    const withCard = Object.values(scenes).filter((s) => s.summaryCard);
    expect(withCard.map((s) => s.id)).toEqual(["resolution-1"]);
    const card = withCard[0].summaryCard!;
    expect(card.items).toHaveLength(4);
    expect(card.numbered).toBe(true);
    expect(card.takeaway).toContain("NOT retained to address");
  });

  it("every decision states which of the three it is", () => {
    decisions.forEach((id, i) => {
      expect(decision(id).decisionLabel).toBe(`Decision ${i + 1} of 3`);
    });
  });
});

describe("media binding", () => {
  it("Gate 0: no scene requests a file that does not exist", () => {
    const urls = new Set<string>();
    for (const s of Object.values(scenes)) {
      for (const u of [s.media.videoUrl, s.media.audioUrl, s.media.posterUrl]) {
        if (u) urls.add(u);
      }
      for (const ev of s.evidence ?? []) if (ev.imageUrl) urls.add(ev.imageUrl);
      for (const side of [s.comparison?.a, s.comparison?.b]) {
        if (side?.imageUrl) urls.add(side.imageUrl);
      }
    }
    const missing = [...urls].filter(
      (u) => !existsSync(path.join(REPO, "public", u.replace(/^\//, ""))),
    );
    expect(missing).toEqual([]);
  });

  it("every scene posters against Selena's locked production still", () => {
    for (const s of Object.values(scenes)) {
      expect(s.media.posterUrl, s.id).toBe(
        "/media/presenter-3-selena-navarro-production-still-1920x1080.png",
      );
    }
  });

  it.runIf(MEDIA_DELIVERED).each(IDS)(
    "%s is wired to its delivered segment",
    (id) => {
      expect(scenes[id].media.provider).toBe("file");
      expect(scenes[id].media.videoUrl).toBe(`/media/ew-01-av1/${id}.mp4`);
    },
  );

  it.runIf(!MEDIA_DELIVERED)(
    "Gate 0: narrated scenes hold the placeholder stage until media lands",
    () => {
      for (const id of IDS) {
        expect(scenes[id].media.provider, id).toBe("placeholder");
        expect(scenes[id].media.videoUrl, id).toBeUndefined();
        // The estimate still has to be a usable number for the scrubber.
        expect(scenes[id].media.durationSec, id).toBeGreaterThan(0);
      }
    },
  );
});

/**
 * Gate C — the delivered assets, checked against their own provenance sidecars.
 *
 * claims-01 has carried the duration row since it shipped; ew-01 did not, and that is
 * exactly how fb-3c drifted 40 ms from its sidecar without anything noticing. The row is
 * cheap and it is the only thing standing between a re-delivery and a caption track that
 * silently runs past the end of the video.
 */
describe("delivered media", () => {
  const MEDIA = path.join(REPO, "public/media/ew-01-av1");
  const sidecar = (id: string) =>
    JSON.parse(readFileSync(path.join(MEDIA, `${id}.mp4.json`), "utf8"));

  it.runIf(MEDIA_DELIVERED).each(IDS)(
    "%s duration is the measured video length",
    (id) => {
      const meta = sidecar(id);
      expect(NARRATION[id].durationSec).toBe(meta.split.video_dur_s);
      // video must cover the audio — the locked pipeline trims UP a frame
      expect(meta.split.video_dur_s).toBeGreaterThanOrEqual(meta.split.audio_dur_s);
    },
  );

  it.runIf(MEDIA_DELIVERED).each(IDS)(
    "%s is delivered at exactly 1920x1080 / 25 fps",
    (id) => {
      const meta = sidecar(id);
      expect(meta.delivery.dims).toBe("1920x1080");
      expect(meta.delivery.fps).toBe("25/1");
    },
  );

  it.runIf(MEDIA_DELIVERED).each(IDS)(
    "%s passed every mechanical QA row",
    (id) => {
      const failed = Object.entries(sidecar(id).qa).filter(([, v]) => v !== true);
      expect(failed).toEqual([]);
    },
  );

  /**
   * A visual verdict is about SPECIFIC FRAMES of a specific file. A re-delivery can move
   * the cut, which makes the first and last frames different frames — so the record travels
   * with the sha256 and cut offset it was judged against, and this row refuses a verdict
   * that no longer belongs to the file on disk.
   */
  it.runIf(MEDIA_DELIVERED).each(IDS)(
    "%s carries a Gate C visual verdict judged against the file now on disk",
    (id) => {
      const meta = sidecar(id);
      expect(meta.visual_qa, "visual_qa missing — re-run scripts/lipsync-visual-qa.mjs and judge by eye").toBeDefined();
      expect(meta.visual_qa.stale).toBeUndefined();
      expect(meta.visual_qa.judged_asset_sha256).toBe(meta.sha256);
      expect(meta.visual_qa.judged_cut_video_start_s).toBe(meta.split.video_start_s);
      // Recorded, not asserted: the first-frame mouth state is an OPEN item for Roger.
      expect(["closed", "parted"]).toContain(meta.visual_qa.first_frame_mouth);
      expect(["closed", "parted"]).toContain(meta.visual_qa.last_frame_mouth);
    },
  );
});
