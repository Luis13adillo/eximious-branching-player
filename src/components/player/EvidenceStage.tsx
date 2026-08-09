"use client";

import { useEffect, useState } from "react";
import type { EvidenceItem } from "@/lib/branching/types";
import { Illustration } from "@/components/media/illustrations";
import { DocumentIcon } from "@/components/ui/icons";

/**
 * EvidenceStage
 * ============================================================================
 * Presents supporting exhibits inside a fullscreen scene: one primary exhibit
 * shown large in a framed "case exhibit" card, with a thumbnail strip to switch
 * between exhibits. Keyboard accessible (thumbnails are buttons). Resets to the
 * first exhibit when the scene changes.
 */

function ExhibitVisual({ item }: { item: EvidenceItem }) {
  if (item.imageUrl) {
    // Real asset path (swap-in). Illustration path is the default for the demo.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.imageUrl}
        alt={item.title}
        className="h-full w-full object-cover"
      />
    );
  }
  if (item.illustration) return <Illustration name={item.illustration} />;
  return null;
}

const KIND_LABEL: Record<EvidenceItem["kind"], string> = {
  diagram: "Diagram",
  photo: "Photograph",
  document: "Document",
  chart: "Chart",
};

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

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 pb-24 pt-12 sm:gap-4 sm:px-8 sm:pb-24 sm:pt-14">
      {/* primary exhibit */}
      <figure className="ex-animate-fade flex min-h-0 w-full max-w-2xl flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-navy-950/50 shadow-2xl backdrop-blur-[2px]">
        <figcaption className="flex items-center justify-between gap-2 border-b border-white/10 bg-navy-900/60 px-4 py-2">
          <span className="flex items-center gap-2 font-sans text-[13px] font-medium text-ink-100">
            <DocumentIcon className="h-4 w-4 text-gold-400" />
            {item.title}
          </span>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-gold-300">
            {KIND_LABEL[item.kind]}
          </span>
        </figcaption>
        <div className="relative min-h-0 flex-1">
          <ExhibitVisual item={item} />
        </div>
        {item.caption && (
          <p className="border-t border-white/10 bg-navy-950/60 px-4 py-2 text-center font-sans text-xs text-ink-300">
            {item.caption}
          </p>
        )}
      </figure>

      {/* thumbnail strip */}
      {evidence.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {evidence.map((ev, i) => (
            <button
              key={ev.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show exhibit: ${ev.title}`}
              aria-current={i === active}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-sans text-[11px] transition-all ${
                i === active
                  ? "border-gold-500/70 bg-gold-500/10 text-ink-100"
                  : "border-white/10 bg-navy-950/40 text-ink-300 hover:border-white/25 hover:text-ink-100"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                  i === active ? "bg-gold-500 text-navy-950" : "bg-white/10 text-ink-200"
                }`}
              >
                {i + 1}
              </span>
              <span className="max-w-[120px] truncate">{ev.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
