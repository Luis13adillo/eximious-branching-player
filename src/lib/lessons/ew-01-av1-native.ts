import type { Lesson } from "@/lib/branching/types";
import { ew01Av1 } from "./ew-01-av1";

/**
 * PREVIEW-ONLY lesson — not for production. Native avatar pilot for Selena.
 * ============================================================================
 * Same ew-01 branching graph, with every presenter clip URL swapped to the
 * NATIVE avatar pilot at /media/ew-01-av1-native/ — Kling AI Avatar v2 Pro,
 * one clip per segment (still + audio), movement + lip-sync generated together,
 * conformed to 1920x1080. Audio is the LOCKED Mexican-American Latina voice
 * (fal -> MiniMax speech-02-hd, ttv-voice-2026082200132526-qth65Vqj), reused
 * from the delivered ew-01 narration — no voice was regenerated. Safe to delete.
 */
function swapMedia<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj), (_k, v) =>
    typeof v === "string"
      ? v.replace("/media/ew-01-av1/", "/media/ew-01-av1-native/")
      : v,
  ) as T;
}

const cloned = swapMedia(ew01Av1) as Lesson & { title?: string };

export const ew01Av1Native: Lesson = {
  ...cloned,
  id: "ew-01-av1-native",
  slug: "ew-01-av1-native",
  // Clean title (no "preview" marker) — this cut is featured as the pilot.
};
