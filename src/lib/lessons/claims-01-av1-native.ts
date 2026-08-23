import type { Lesson } from "@/lib/branching/types";
import { claimsInvestigationApplication1 } from "./claims-investigation-application-1";

/**
 * PREVIEW-ONLY lesson — not for production. Separate from the demo-movement
 * preview (claims-01-av1-pristine) so both can be compared side by side.
 * ============================================================================
 * Same claims-01 branching graph, with every presenter clip URL swapped to the
 * NATIVE avatar pilot at /media/claims-01-av1-native/ — Kling AI Avatar v2 Pro,
 * one clip per segment (still + audio), native movement + lip-sync together,
 * conformed to 1920x1080. Exhibits, poster and cue text untouched. Safe to delete.
 */
function swapMedia<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj), (_k, v) =>
    typeof v === "string"
      ? v.replace("/media/claims-01-av1/", "/media/claims-01-av1-native/")
      : v,
  ) as T;
}

const cloned = swapMedia(claimsInvestigationApplication1) as Lesson & {
  title?: string;
};

export const claims01Av1Native: Lesson = {
  ...cloned,
  id: "claims-01-av1-native",
  slug: "claims-01-av1-native",
  ...(cloned.title ? { title: `${cloned.title} — Native preview` } : {}),
};
