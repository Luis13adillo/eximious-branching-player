import type { Lesson } from "@/lib/branching/types";
import { siu01Av1 } from "./siu-01-av1";

/**
 * PREVIEW-ONLY lesson — not for production. Native avatar pilot for Curtis.
 * ============================================================================
 * Same siu-01 branching graph, with every presenter clip URL swapped to the
 * NATIVE avatar pilot at /media/siu-01-av1-native/ — Kling AI Avatar v2 Pro,
 * one clip per segment (still + audio), native movement + lip-sync together,
 * conformed to 1920x1080. Safe to delete.
 */
function swapMedia<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj), (_k, v) =>
    typeof v === "string"
      ? v.replace("/media/siu-01-av1/", "/media/siu-01-av1-native/")
      : v,
  ) as T;
}

const cloned = swapMedia(siu01Av1) as Lesson & { title?: string };

export const siu01Av1Native: Lesson = {
  ...cloned,
  id: "siu-01-av1-native",
  slug: "siu-01-av1-native",
  // Clean title (no "preview" marker) — this cut is featured as the pilot.
};
