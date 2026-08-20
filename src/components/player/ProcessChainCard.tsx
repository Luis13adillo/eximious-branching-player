"use client";

import type { ProcessChain } from "@/lib/branching/types";

/**
 * ProcessChainCard — an ordered stage chain, e.g. "Adjusting → Investigation → SIU".
 * ============================================================================
 * TEMPLATE component, not lesson code. Stages, the connector glyph and the
 * takeaway are configuration, so the same card carries any escalation path,
 * workflow or ordered sequence across the catalog.
 *
 * The learner's current stage is marked with sky (the locked secondary accent
 * for instructional context) AND with a written "You are here" label, so the
 * state never depends on colour alone. Gold stays reserved for actions and
 * progress; off-white is text only.
 *
 * LAYOUT — container-relative, not viewport-relative.
 * The card sits in the content panel, so what matters is the CARD's width, not
 * the screen's. Measured content width: 365px on desktop, 284px on a phone.
 *
 * A three-stage chain with detail lines needs ~150px per stage. Below the
 * `@md` threshold (448px) it therefore STACKS — one full-width stage per row,
 * connector centred between rows and rotated to point down. Both the phone and
 * the desktop content panel are below that, so both stack: uniform width, no
 * wrap, no stranded arrow, no clipped label. Forcing three columns into 365px
 * overflows "Investigation" past its own border, which is worse than stacking.
 *
 * The horizontal row is kept for containers that genuinely have the room.
 *
 *   narrow  → one full-width stage per row, connector centred BETWEEN rows and
 *             rotated to point down. Nothing wraps, so no stage is ever left
 *             stranded next to a dangling arrow, and every stage gets the same
 *             width instead of the ragged widths a wrapping flex row produces.
 *   wide    → the horizontal row, unchanged: equal-width stages with inline
 *             connectors.
 *
 * Stages are equal-width in BOTH directions (`basis-0 grow`), so the row can
 * never wrap — which is what caused the cramped mobile layout.
 */
export function ProcessChainCard({ chain }: { chain: ProcessChain }) {
  const connector = chain.connector ?? "→";

  return (
    <section
      aria-label={chain.kicker ?? "Process chain"}
      className="ex-animate-fade @container mb-5 rounded-xl border border-sky-500/25 bg-navy-900/50 p-4 sm:p-5"
    >
      <div className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-300">
        {chain.kicker ?? "On screen"}
      </div>

      <div
        className="flex flex-col items-stretch gap-1.5 @md:flex-row @md:items-stretch @md:gap-2"
      >
        {chain.stages.map((stage, i) => (
          <div
            key={stage.label}
            className="contents @md:flex @md:min-w-0 @md:basis-0 @md:grow @md:items-stretch"
          >
            {i > 0 && (
              <span
                aria-hidden
                className="flex shrink-0 items-center justify-center rotate-90 self-center py-0.5 font-[family-name:var(--font-display)] text-base leading-none text-sky-300 @md:mr-2 @md:rotate-0 @md:py-0"
              >
                {connector}
              </span>
            )}
            <div
              className={`min-w-0 grow rounded-lg border px-3 py-2.5 @md:py-2 ${
                stage.current
                  ? "border-sky-500/50 bg-sky-500/10"
                  : "border-white/10 bg-navy-950/40"
              }`}
            >
              <span
                className={`block font-sans text-[13px] font-medium leading-snug ${
                  stage.current ? "text-ink-100" : "text-ink-300"
                }`}
              >
                {stage.label}
              </span>
              {stage.detail && (
                <span className="mt-0.5 block font-sans text-[11.5px] leading-snug text-ink-400">
                  {stage.detail}
                </span>
              )}
              {stage.current && (
                <span className="mt-1.5 inline-block rounded bg-sky-500/15 px-1.5 py-px font-sans text-[9.5px] font-semibold uppercase tracking-[0.14em] text-sky-300 ring-1 ring-sky-500/30">
                  You are here
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {chain.takeaway && (
        <p className="mt-3 border-t border-white/8 pt-3 font-[family-name:var(--font-display)] text-[15px] leading-snug text-ink-100">
          {chain.takeaway}
        </p>
      )}
    </section>
  );
}
