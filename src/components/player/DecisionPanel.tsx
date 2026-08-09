"use client";

import { useEffect, useState } from "react";
import type { DecisionScene, OptionId } from "@/lib/branching/types";

/**
 * DecisionPanel — the A/B/C/D choice. Options are buttons (each routes the
 * learner immediately), laid out 2×2 on desktop and stacked on mobile. Clear
 * hover / focus / selected states; answerable by clicking or pressing A–D.
 * Selection is briefly acknowledged before the player transitions to feedback.
 */
export function DecisionPanel({
  scene,
  onSelect,
}: {
  scene: DecisionScene;
  onSelect: (id: OptionId) => void;
}) {
  const [chosen, setChosen] = useState<OptionId | null>(null);

  const choose = (id: OptionId) => {
    if (chosen) return;
    setChosen(id);
    // brief acknowledgement, then route to feedback
    window.setTimeout(() => onSelect(id), 240);
  };

  // reset if the scene changes (e.g. restart)
  useEffect(() => setChosen(null), [scene.id]);

  // keyboard: A / B / C / D
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(k)) {
        const opt = scene.options.find((o) => o.id === (k as OptionId));
        if (opt) {
          e.preventDefault();
          choose(opt.id);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id, chosen]);

  return (
    <div className="ex-animate-drift">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="font-[family-name:var(--font-display)] text-lg leading-snug text-ink-100 sm:text-xl">
          {scene.prompt}
        </p>
        <span className="hidden shrink-0 font-sans text-[11px] uppercase tracking-[0.18em] text-gold-300 sm:block">
          {scene.decisionLabel ?? scene.kicker}
        </span>
      </div>

      <div
        role="group"
        aria-label="Choose your answer"
        className="grid gap-2.5 sm:grid-cols-2 sm:gap-3"
      >
        {scene.options.map((o) => {
          const isChosen = chosen === o.id;
          const dim = chosen && !isChosen;
          return (
            <button
              key={o.id}
              type="button"
              disabled={!!chosen}
              onClick={() => choose(o.id)}
              className={`group/opt flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 sm:p-4 ${
                isChosen
                  ? "border-gold-500 bg-gold-500/12 ring-2 ring-gold-500/50"
                  : "border-white/12 bg-navy-900/50 hover:border-gold-500/60 hover:bg-navy-800/60"
              } ${dim ? "opacity-45" : ""} ${chosen ? "cursor-default" : "cursor-pointer"}`}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-[family-name:var(--font-display)] text-base font-semibold transition-colors ${
                  isChosen
                    ? "bg-gold-500 text-navy-950"
                    : "bg-white/8 text-gold-300 group-hover/opt:bg-gold-500 group-hover/opt:text-navy-950"
                }`}
              >
                {o.id}
              </span>
              <span className="min-w-0">
                <span className="block font-sans text-[15px] font-medium leading-snug text-ink-100">
                  {o.label}
                </span>
                {o.detail && (
                  <span className="mt-0.5 block font-sans text-[13px] leading-snug text-ink-200">
                    {o.detail}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 hidden font-sans text-[11px] text-ink-400 sm:block">
        Tip — you can also press{" "}
        <span className="font-semibold text-ink-200">A</span>,{" "}
        <span className="font-semibold text-ink-200">B</span>,{" "}
        <span className="font-semibold text-ink-200">C</span>, or{" "}
        <span className="font-semibold text-ink-200">D</span> to choose.
      </p>
    </div>
  );
}
