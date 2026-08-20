"use client";

import type {
  EvidenceInventory,
  InventoryEntry,
  InventoryStatus,
} from "@/lib/branching/types";
import { CheckIcon, PendingIcon, UnavailableIcon } from "@/components/ui/icons";

/**
 * EvidenceInventoryCard — the "grade the file honestly" exhibit.
 * ============================================================================
 * Renders a configurable status inventory, defaulting to the script's three
 * columns: HAVE / NEED / UNAVAILABLE.
 *
 * TEMPLATE component, not lesson code. Columns, headings, entries and the
 * empty-column wording are all configuration, so a video grading on different
 * axes reuses it rather than forking it.
 *
 * Status is carried by a GLYPH as well as a colour, and each column has a
 * written heading, so nothing depends on colour alone (Guidelines §03). Colour
 * roles are the locked ones: sky is the secondary accent for evidence, gold
 * stays reserved for actions and progress, off-white is text only.
 */

const DEFAULT_COLUMNS: { status: InventoryStatus; label: string }[] = [
  { status: "have", label: "Have" },
  { status: "need", label: "Need" },
  { status: "unavailable", label: "Unavailable" },
];

const STATUS_STYLE: Record<
  InventoryStatus,
  { Icon: typeof CheckIcon; mark: string; heading: string; card: string }
> = {
  have: {
    Icon: CheckIcon,
    mark: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/35",
    heading: "text-sky-300",
    card: "border-sky-500/25 bg-navy-950/40",
  },
  need: {
    Icon: PendingIcon,
    mark: "bg-white/6 text-ink-200 ring-1 ring-white/20",
    heading: "text-ink-200",
    card: "border-white/12 bg-navy-950/30",
  },
  unavailable: {
    Icon: UnavailableIcon,
    mark: "bg-white/4 text-ink-400 ring-1 ring-white/10",
    heading: "text-ink-400",
    card: "border-white/8 bg-navy-950/20",
  },
};

function Entry({ entry }: { entry: InventoryEntry }) {
  const style = STATUS_STYLE[entry.status];
  const { Icon } = style;
  return (
    <li className={`rounded-lg border p-2.5 ${style.card}`}>
      <div className="flex items-start gap-2">
        <span
          className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded ${style.mark}`}
        >
          <Icon className="h-3 w-3" />
        </span>
        <span className="min-w-0">
          <span className="block font-sans text-[13px] font-medium leading-snug text-ink-100">
            {entry.label}
          </span>
          {entry.conflicted && (
            <span className="mt-0.5 inline-block rounded bg-sky-500/12 px-1.5 py-px font-sans text-[9.5px] font-semibold uppercase tracking-[0.14em] text-sky-300 ring-1 ring-sky-500/30">
              Conflicting
            </span>
          )}
          {entry.note && (
            <span className="mt-1 block font-sans text-[11.5px] leading-snug text-ink-300">
              {entry.note}
            </span>
          )}
        </span>
      </div>
    </li>
  );
}

export function EvidenceInventoryCard({
  inventory,
}: {
  inventory: EvidenceInventory;
}) {
  const columns = inventory.columns ?? DEFAULT_COLUMNS;
  const emptyLabel = inventory.emptyLabel ?? "None recorded";

  return (
    <section
      aria-label={inventory.title ?? "Evidence inventory"}
      className="ex-animate-fade @container mb-5 rounded-xl border border-sky-500/25 bg-navy-900/50 p-4 sm:p-5"
    >
      <div className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-300">
        {inventory.kicker ?? "Evidence exhibit"}
      </div>
      {inventory.title && (
        <h3 className="mb-3 font-[family-name:var(--font-display)] text-[17px] leading-snug text-ink-100">
          {inventory.title}
        </h3>
      )}

      {/* Container-relative, not viewport-relative: this card lives in the
          narrow content panel on desktop AND full-width on a phone, so the
          breakpoint that matters is the CARD's width, not the screen's. Three
          across once there is room; three clearly headed groups when there
          isn't — either way the HAVE / NEED / UNAVAILABLE bucketing is what
          the learner reads. */}
      <div className="grid gap-3 @lg:grid-cols-3 @lg:gap-2.5">
        {columns.map((col) => {
          const entries = inventory.entries.filter(
            (e) => e.status === col.status,
          );
          const style = STATUS_STYLE[col.status];
          return (
            <div key={col.status} className="min-w-0">
              <div
                className={`mb-1.5 flex items-center gap-1.5 border-b border-white/8 pb-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] ${style.heading}`}
              >
                <style.Icon className="h-3 w-3 shrink-0" />
                {col.label}
                <span className="ml-auto font-normal tabular-nums text-ink-400">
                  {entries.length}
                </span>
              </div>
              {entries.length > 0 ? (
                <ul className="flex flex-col gap-1.5">
                  {entries.map((e) => (
                    <Entry key={e.label} entry={e} />
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg border border-dashed border-white/10 px-2.5 py-2 font-sans text-[11.5px] italic leading-snug text-ink-400">
                  {emptyLabel}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
