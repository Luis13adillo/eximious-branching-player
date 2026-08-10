"use client";

import { useEffect, useState } from "react";
import type { EvidenceItem } from "@/lib/branching/types";
import { Illustration } from "@/components/media/illustrations";

/**
 * EvidenceStage
 * ============================================================================
 * Presents a supporting exhibit full-bleed across the stage — photos fill it
 * (object-cover), drawn diagrams sit contained so nothing is cropped. Chrome is
 * kept to a minimum: legibility scrims, a single caption line, and a compact
 * corner switcher when a scene has more than one exhibit. Resets to the first
 * exhibit when the scene changes.
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

/** Short chip label — the exhibit's lead noun (before any em dash). */
function shortLabel(item: EvidenceItem) {
  return item.title.split("—")[0].trim();
}

export function EvidenceStage({
  evidence,
  sceneKey,
}: {
  evidence: EvidenceItem[];
  sceneKey: string;
}) {
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [sceneKey]);

  const item = evidence[active] ?? evidence[0];
  if (!item) return null;
  const multi = evidence.length > 1;

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

      {/* compact exhibit switcher — top-right, clears the centered "tap for
          sound" pill. Numbered pill on mobile; adds a short label from ~sm up. */}
      {multi && (
        <div className="absolute right-3 top-3 z-[6] flex gap-1.5">
          {evidence.map((ev, i) => (
            <button
              key={ev.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show exhibit: ${ev.title}`}
              aria-current={i === active}
              className={`flex h-7 items-center gap-1.5 rounded-full px-2.5 font-sans text-[11px] ring-1 backdrop-blur-md transition-colors ${
                i === active
                  ? "bg-gold-500 text-navy-950 ring-black/20"
                  : "bg-navy-950/70 text-ink-200 ring-white/15 hover:text-ink-100"
              }`}
            >
              <span className="font-semibold">{i + 1}</span>
              <span className="hidden max-w-[110px] truncate sm:inline">
                {shortLabel(ev)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* single caption line, above the controls */}
      {item.caption && (
        <p className="pointer-events-none absolute inset-x-0 bottom-14 z-[6] px-5 text-center font-sans text-[12px] leading-snug text-ink-100 sm:bottom-16 sm:text-[13px]">
          {item.caption}
        </p>
      )}
    </div>
  );
}
