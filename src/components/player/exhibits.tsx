"use client";

import { useState } from "react";
import type { EvidenceItem } from "@/lib/branching/types";
import { Illustration } from "@/components/media/illustrations";

/**
 * Exhibit primitives — shared by the stage and the content panel.
 * ============================================================================
 * Video Production Spec §6 / Guidelines §03: evidence tabs must carry a literal
 * **"Exhibits"** label above them, and exhibits must be *discoverable*. Both
 * places that show exhibits use the same label constant and the same tab
 * component, so the two can never drift apart across 267 videos.
 *
 * Guidelines §04 puts exhibits in the content panel on desktop
 * ("VIDEO / PLAYER  |  CONTENT PANEL, EXHIBITS / FEEDBACK") and stacked beneath
 * the video on mobile — which is where `ExhibitPanel` renders. `EvidenceStage`
 * keeps the full-bleed stage treatment for scenes that have no presenter
 * footage to show.
 */

/** The literal label required above the evidence tabs. Template-level, fixed. */
export const EXHIBITS_LABEL = "Exhibits";

/** Short chip label — the exhibit's lead noun (before any em dash). */
export function shortExhibitLabel(item: EvidenceItem) {
  return item.title.split("—")[0].trim();
}

/**
 * The evidence tab row. `tone: "overlay"` sits on footage (translucent, blurred);
 * `tone: "panel"` sits in the content panel. Sky is the locked secondary accent
 * for evidence/exhibit tabs, so the active tab is sky in both tones.
 */
export function ExhibitTabs({
  evidence,
  active,
  onSelect,
  tone = "panel",
  truncate = true,
}: {
  evidence: EvidenceItem[];
  active: number;
  onSelect: (i: number) => void;
  tone?: "overlay" | "panel";
  truncate?: boolean;
}) {
  if (evidence.length < 2) return null;
  return (
    <div role="tablist" aria-label={EXHIBITS_LABEL} className="flex flex-wrap gap-1.5">
      {evidence.map((ev, i) => {
        const on = i === active;
        return (
          <button
            key={ev.id}
            type="button"
            role="tab"
            aria-selected={on}
            aria-label={`Show exhibit: ${ev.title}`}
            onClick={() => onSelect(i)}
            className={`flex h-7 items-center gap-1.5 rounded-full px-2.5 font-sans text-[11px] ring-1 transition-colors ${
              on
                ? "bg-sky-500 text-navy-950 ring-black/20"
                : tone === "overlay"
                  ? "bg-navy-950/70 text-ink-200 ring-white/15 backdrop-blur-md hover:text-ink-100"
                  : "bg-white/6 text-ink-200 ring-white/12 hover:border-sky-500/50 hover:text-ink-100"
            }`}
          >
            <span className="font-semibold">{i + 1}</span>
            <span
              className={`${truncate ? "hidden max-w-[110px] truncate sm:inline" : "inline"}`}
            >
              {shortExhibitLabel(ev)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** "Exhibits" heading, rendered directly above the tab row. */
export function ExhibitsLabel({ tone = "panel" }: { tone?: "overlay" | "panel" }) {
  return (
    <div
      className={`font-sans text-[10px] font-semibold uppercase tracking-[0.24em] ${
        tone === "overlay"
          ? "rounded bg-navy-950/70 px-1.5 py-0.5 text-ink-200 ring-1 ring-white/10 backdrop-blur-md"
          : "text-sky-300"
      }`}
    >
      {EXHIBITS_LABEL}
    </div>
  );
}

/**
 * ExhibitPanel — exhibits inside the content panel, next to (desktop) or under
 * (mobile) the presenter video. This is the path used when the scene has real
 * presenter footage on the stage, which is every production scene: the video
 * shows the presenter and nothing else (locked rule 8), and every exhibit,
 * label and caption is composited by the player at runtime.
 */
export function ExhibitPanel({
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
    <section
      aria-label={EXHIBITS_LABEL}
      className="ex-animate-fade mb-5 rounded-xl border border-sky-500/25 bg-navy-900/50 p-4 sm:p-5"
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <ExhibitsLabel />
        <ExhibitTabs
          evidence={evidence}
          active={active}
          onSelect={setActive}
          tone="panel"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-navy-950/40">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            className="block aspect-video w-full object-cover"
          />
        ) : item.illustration ? (
          <div className="p-3">
            <Illustration name={item.illustration} />
          </div>
        ) : null}
      </div>

      <p className="mt-2 font-sans text-[13px] leading-snug text-ink-100">
        {item.title}
      </p>
      {item.caption && (
        <p className="mt-1 font-sans text-[12px] leading-snug text-ink-300">
          {item.caption}
        </p>
      )}
    </section>
  );
}
