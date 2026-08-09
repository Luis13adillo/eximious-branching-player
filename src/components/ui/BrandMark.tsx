/**
 * BrandMark
 * ============================================================================
 * A typographic wordmark for Eximious Academy. This is deliberately NOT a
 * fabricated logo — it's a monogram built from the brand serif plus the
 * wordmark, which is honest to use when no official logo asset is supplied.
 * Drop a real logo into /public and swap this component's monogram for an
 * <img> when the asset arrives.
 */

export function BrandMark({
  size = "md",
  showWordmark = true,
}: {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}) {
  const dims = {
    sm: { box: 28, mono: 13, title: "text-sm", sub: "text-[9px]" },
    md: { box: 36, mono: 16, title: "text-base", sub: "text-[10px]" },
    lg: { box: 48, mono: 22, title: "text-xl", sub: "text-[11px]" },
  }[size];

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative flex shrink-0 items-center justify-center rounded-[7px]"
        style={{
          width: dims.box,
          height: dims.box,
          background:
            "linear-gradient(150deg, var(--color-gold-400), var(--color-gold-600))",
          boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
        }}
        aria-hidden="true"
      >
        <span
          className="font-[family-name:var(--font-display)] font-semibold leading-none text-navy-950"
          style={{ fontSize: dims.mono }}
        >
          E
        </span>
        <span
          className="absolute inset-[3px] rounded-[5px] border"
          style={{ borderColor: "rgba(5,15,31,0.35)" }}
        />
      </div>
      {showWordmark && (
        <div className="leading-tight">
          <div
            className={`font-[family-name:var(--font-display)] font-medium tracking-tight text-ink-100 ${dims.title}`}
          >
            Eximious{" "}
            <span className="text-gold-400">Academy</span>
          </div>
          <div
            className={`font-medium uppercase tracking-[0.22em] text-ink-400 ${dims.sub}`}
          >
            Professional Claims Education
          </div>
        </div>
      )}
    </div>
  );
}
