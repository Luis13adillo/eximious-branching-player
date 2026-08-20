"use client";

import type { SummaryCard } from "@/lib/branching/types";
import { summaryIcon } from "@/components/ui/icons";

/**
 * RejoinSummaryCard — the locked four-icon rejoin summary.
 * ============================================================================
 * Interactive Video Production Guidelines §03: "Correct answer required before
 * advancement; configurable four-icon rejoin summary restores context."
 *
 * TEMPLATE component, not lesson code. It renders whatever four categories and
 * takeaway a scene's `summaryCard` supplies, so the same card serves all 267
 * videos — a rejoin restating "Facts / Coverage / Damages / Timing" and one
 * restating "1. Issue 2. Burden 3. Standard 4. Evidence" are the same component
 * with different data.
 *
 * Colour roles are the locked ones: sky is the secondary accent for evidence /
 * decision / feedback context (this card is context restoration), gold stays
 * reserved for actions and progress, off-white is text only.
 */
export function RejoinSummaryCard({ card }: { card: SummaryCard }) {
  return (
    <section
      aria-label={card.title ?? "Rejoin summary"}
      className="ex-animate-fade mb-5 rounded-xl border border-sky-500/25 bg-navy-900/50 p-4 sm:p-5"
    >
      <div className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-300">
        {card.kicker ?? "On screen"}
      </div>

      {card.title && (
        <h3 className="mb-3 font-[family-name:var(--font-display)] text-lg leading-snug text-ink-100">
          {card.title}
        </h3>
      )}

      {/* Four across from ~sm up, 2×2 on a phone — never a scrolling row. */}
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2.5">
        {card.items.map((item, i) => {
          const Icon = summaryIcon(item.icon);
          return (
            <li key={`${item.icon}-${item.label}`} className="flex flex-col gap-1.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/12 ring-1 ring-sky-500/30">
                <Icon className="h-[18px] w-[18px] text-sky-300" />
              </span>
              <span className="font-sans text-[13px] font-medium leading-snug text-ink-100">
                {card.numbered && (
                  <span className="mr-1 text-sky-300">{i + 1}.</span>
                )}
                {item.label}
              </span>
              {item.detail && (
                <span className="font-sans text-[11.5px] leading-snug text-ink-300">
                  {item.detail}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {card.takeaway && (
        <p className="mt-4 border-t border-white/8 pt-3 font-[family-name:var(--font-display)] text-[15px] leading-snug text-ink-100">
          {card.takeaway}
        </p>
      )}
    </section>
  );
}
