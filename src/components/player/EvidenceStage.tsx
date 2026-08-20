"use client";

import { useState } from "react";
import type { EvidenceItem } from "@/lib/branching/types";
import { Illustration } from "@/components/media/illustrations";
import { ExhibitTabs, ExhibitsLabel } from "./exhibits";

/**
 * EvidenceStage
 * ============================================================================
 * Presents a supporting exhibit full-bleed across the stage — photos fill it
 * (object-cover), drawn diagrams sit contained so nothing is cropped. Chrome is
 * kept to a minimum: legibility scrims, the required "Exhibits" label, a single
 * caption line, and a compact corner switcher when a scene has more than one
 * exhibit. Resets to the first exhibit when the scene changes.
 *
 * Used when a scene has no presenter footage on the stage. When it does, the
 * exhibits render in the content panel instead (see `ExhibitPanel`) — both
 * share the same label constant and tab component.
 */

function ExhibitVisual({ item }: { item: EvidenceItem }) {
  if (item.imageUrl) {
    // Real photo — fill the whole stage like the presenter video does.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  if (item.illustration) {
    // Vector exhibits are drawn to fit a frame — contain them (never crop).
    return (
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-xl">
          <Illustration name={item.illustration} />
        </div>
      </div>
    );
  }
  return null;
}

export function EvidenceStage({
  evidence,
  sceneKey,
}: {
  evidence: EvidenceItem[];
  sceneKey: string;
}) {
  // Selection is stored WITH the scene it belongs to, so changing scene resets
  // to the first exhibit by derivation rather than a reset effect.
  const [picked, setPicked] = useState<{ scene: string; index: number } | null>(
    null,
  );
  const active = picked?.scene === sceneKey ? picked.index : 0;
  const setActive = (index: number) => setPicked({ scene: sceneKey, index });

  const item = evidence[active] ?? evidence[0];
  if (!item) return null;

  return (
    <div className="absolute inset-0">
      <ExhibitVisual item={item} />

      {/* legibility scrims — top for the switcher, bottom for the caption */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,15,31,0.72), rgba(5,15,31,0))",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{
          background:
            "linear-gradient(0deg, rgba(5,15,31,0.85), rgba(5,15,31,0))",
        }}
      />

      {/* Required "Exhibits" label directly above the evidence tabs (Spec §6).
          Top-right, clearing the centred "tap for sound" pill. The tab row only
          renders when the scene carries more than one exhibit; the label always
          marks the exhibit region so exhibits stay discoverable. */}
      <div className="absolute right-3 top-3 z-[6] flex flex-col items-end gap-1.5">
        <ExhibitsLabel tone="overlay" />
        <ExhibitTabs
          evidence={evidence}
          active={active}
          onSelect={setActive}
          tone="overlay"
        />
      </div>

      {/* single caption line, above the controls */}
      {item.caption && (
        <p className="pointer-events-none absolute inset-x-0 bottom-14 z-[6] px-5 text-center font-sans text-[12px] leading-snug text-ink-100 sm:bottom-16 sm:text-[13px]">
          {item.caption}
        </p>
      )}
    </div>
  );
}
