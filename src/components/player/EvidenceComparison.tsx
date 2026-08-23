"use client";

import type { ComparisonSide, EvidenceComparison } from "@/lib/branching/types";
import { Illustration } from "@/components/media/illustrations";
import { mediaSrc } from "@/lib/media-version";

/**
 * EvidenceComparisonCard — the locked `A ≠ B` evidence comparison.
 * ============================================================================
 * Interactive Video Production Guidelines §03 "States & Components":
 * "A ≠ B comparison — a reusable evidence-comparison pattern with configurable
 * labels and explanatory content", shown as two labelled exhibits side by side
 * under a line stating the conflict.
 *
 * TEMPLATE component, not lesson code. Both sides, both labels, the conflict
 * line and even the relation glyph are configuration, so it serves an
 * account-versus-account conflict (two statements), an account-versus-evidence
 * conflict (statement vs photo) and a document-versus-document conflict with no
 * per-video fork. A side with no image renders as a typographic exhibit card.
 */

function SideVisual({ side }: { side: ComparisonSide }) {
  if (side.imageUrl) {
    return (
      <div className="mb-2 aspect-video w-full overflow-hidden rounded-md border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaSrc(side.imageUrl)}
          alt={`${side.label}: ${side.value}`}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  if (side.illustration) {
    return (
      <div className="mb-2 w-full overflow-hidden rounded-md border border-white/10 bg-navy-950/40 p-2">
        <Illustration name={side.illustration} />
      </div>
    );
  }
  return null;
}

function Side({ side, letter }: { side: ComparisonSide; letter: "A" | "B" }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-white/10 bg-navy-950/40 p-3">
      {/* The source label wraps rather than truncating — an exhibit label that
          reads "TOLD THE FNO…" tells the learner nothing. */}
      <div className="mb-1.5 flex items-start gap-1.5 font-sans text-[10px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-sky-300">
        <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded bg-sky-500/15 text-[9px] ring-1 ring-sky-500/30">
          {letter}
        </span>
        <span className="min-w-0">{side.label}</span>
      </div>
      <SideVisual side={side} />
      <p className="font-[family-name:var(--font-display)] text-[17px] leading-snug text-ink-100">
        {side.value}
      </p>
      {side.detail && (
        <p className="mt-1 font-sans text-[12px] leading-snug text-ink-300">
          {side.detail}
        </p>
      )}
    </div>
  );
}

export function EvidenceComparisonCard({
  comparison,
}: {
  comparison: EvidenceComparison;
}) {
  const operator = comparison.operator ?? "≠";

  return (
    <section
      aria-label={`Evidence comparison: ${comparison.a.label} ${operator} ${comparison.b.label}`}
      className="ex-animate-fade mb-5 rounded-xl border border-sky-500/25 bg-navy-900/50 p-4 sm:p-5"
    >
      <div className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-300">
        {comparison.kicker ?? "Evidence exhibit"} <span aria-hidden>·</span> A{" "}
        {operator} B
      </div>

      {/* The line that states the conflict — the point of the whole pattern. */}
      <p className="mb-3 font-[family-name:var(--font-display)] text-[17px] leading-snug text-ink-100">
        {comparison.conflict}
      </p>

      {/* Side by side from ~sm up; stacked with the glyph between on a phone. */}
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
        <Side side={comparison.a} letter="A" />
        <span
          aria-hidden
          className="mx-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/12 font-[family-name:var(--font-display)] text-base text-sky-300 ring-1 ring-sky-500/30"
        >
          {operator}
        </span>
        <Side side={comparison.b} letter="B" />
      </div>

      {comparison.note && (
        <p className="mt-3 font-sans text-[12.5px] leading-relaxed text-ink-300">
          {comparison.note}
        </p>
      )}
    </section>
  );
}
