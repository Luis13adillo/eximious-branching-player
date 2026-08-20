import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { claimsInvestigationApplication1 } from "./claims-investigation-application-1";
import { NARRATION } from "./claims-01-av1.narration";

/**
 * claims-01 AV1 — delivery integrity
 * ============================================================================
 * These tests check the lesson DATA against the delivered assets on disk, which
 * is what the branching tests can't see:
 *
 *  - every narration string is byte-exact against the `script_sha256` recorded
 *    when that line was rendered to audio, so the on-screen text and Diane's
 *    voice cannot drift from the authoritative script;
 *  - every scene duration is the MEASURED length of its delivered mp4;
 *  - every media URL the player will request actually exists;
 *  - every delivered asset is exactly 1920×1080 (Agreement §1.4.1);
 *  - captions are a lossless re-slicing of the narration and cover the whole
 *    segment with no gap, overlap or overrun.
 */

const REPO = path.resolve(__dirname, "../../..");
const PUBLIC = path.join(REPO, "public");
const MEDIA = path.join(PUBLIC, "media", "claims-01-av1");

type AudioSidecar = { script_sha256: string; script_chars: number };
type VideoSidecar = {
  split: { video_dur_s: number; audio_dur_s: number };
  delivery: { dims: string; fps: string };
};

const ids = Object.keys(NARRATION) as (keyof typeof NARRATION)[];

const sidecar = <T,>(file: string): T =>
  JSON.parse(readFileSync(path.join(MEDIA, file), "utf8")) as T;

describe("narration is verbatim to the authoritative script", () => {
  it("all 22 delivered segments are present", () => {
    expect(ids).toHaveLength(22);
  });

  it.each(ids)(
    "%s matches the script hash recorded when it was voiced",
    (id) => {
      const meta = sidecar<AudioSidecar>(`${id}.json`);
      const text = NARRATION[id].text;
      const hash = createHash("sha256").update(text, "utf8").digest("hex");
      expect(text).toHaveLength(meta.script_chars);
      expect(hash).toBe(meta.script_sha256);
    },
  );
});

describe("delivered media", () => {
  it.each(ids)("%s duration is the measured video length", (id) => {
    const meta = sidecar<VideoSidecar>(`${id}.mp4.json`);
    expect(NARRATION[id].durationSec).toBe(meta.split.video_dur_s);
    // video must cover the audio — the locked pipeline trims UP a frame
    expect(meta.split.video_dur_s).toBeGreaterThanOrEqual(meta.split.audio_dur_s);
  });

  it.each(ids)("%s is delivered at exactly 1920x1080 / 25 fps", (id) => {
    const meta = sidecar<VideoSidecar>(`${id}.mp4.json`);
    expect(meta.delivery.dims).toBe("1920x1080");
    expect(meta.delivery.fps).toBe("25/1");
  });

  it("every media URL the player requests exists on disk", () => {
    const urls = new Set<string>();
    for (const scene of Object.values(claimsInvestigationApplication1.scenes)) {
      for (const u of [
        scene.media.videoUrl,
        scene.media.audioUrl,
        scene.media.posterUrl,
      ]) {
        if (u) urls.add(u);
      }
      for (const ev of scene.evidence ?? []) if (ev.imageUrl) urls.add(ev.imageUrl);
      for (const side of [scene.comparison?.a, scene.comparison?.b]) {
        if (side?.imageUrl) urls.add(side.imageUrl);
      }
    }
    const missing = [...urls].filter(
      (u) => !existsSync(path.join(PUBLIC, u.replace(/^\//, ""))),
    );
    expect(missing).toEqual([]);
    // 22 segments + the presenter poster + the burned-pickup exhibit
    expect(urls.size).toBe(24);
  });

  it("exactly 22 scenes carry a delivered segment; the 3 correct beats do not", () => {
    const scenes = Object.values(claimsInvestigationApplication1.scenes);
    expect(scenes.filter((s) => !!s.media.videoUrl)).toHaveLength(22);
    for (const id of ["fb-1d", "fb-2b", "fb-3b"]) {
      const s = claimsInvestigationApplication1.scenes[id];
      expect(s.media.videoUrl).toBeUndefined();
      expect(s.media.audioUrl).toBeUndefined();
      expect(s.media.durationSec).toBe(0);
    }
  });
});

describe("captions", () => {
  it.each(ids)("%s cues re-slice the narration losslessly", (id) => {
    const seg = NARRATION[id];
    expect(seg.captions.length).toBeGreaterThan(0);
    expect(seg.captions.map((c) => c.text).join(" ")).toBe(seg.text);
  });

  it.each(ids)("%s cues tile the whole segment with no gap or overrun", (id) => {
    const seg = NARRATION[id];
    expect(seg.captions[0].start).toBe(0);
    expect(seg.captions.at(-1)!.end).toBe(seg.durationSec);
    for (let i = 0; i < seg.captions.length; i++) {
      const cue = seg.captions[i];
      expect(cue.end).toBeGreaterThan(cue.start);
      if (i > 0) expect(cue.start).toBe(seg.captions[i - 1].end);
    }
  });

  it("every scene with a delivered segment carries its captions", () => {
    for (const id of ids) {
      const scene = claimsInvestigationApplication1.scenes[id];
      expect(scene.media.captions, `${id} captions`).toBeDefined();
      expect(scene.media.captions).toHaveLength(NARRATION[id].captions.length);
    }
  });
});
