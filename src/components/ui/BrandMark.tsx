/**
 * BrandMark
 * ============================================================================
 * The official Eximious Academy logo (transparent PNG in /public). Every
 * surface in the app is dark navy, so the header uses the white/reverse lockup
 * (`eximious-academy-logo-reverse.png`) — identical shapes, spacing, and
 * transparency to the original, ink flipped to white so it reads on dark. The
 * full-color logo (`eximious-academy-logo.png`) is kept in /public for any
 * light surface. Rendered at a height derived from `size`, width auto so the
 * aspect ratio is always preserved — never stretched or clipped. No background.
 */

// Native logo dimensions (584 × 175) → aspect ratio for space reservation.
const LOGO_W = 584;
const LOGO_H = 175;
const HEIGHTS = { sm: 26, md: 38, lg: 52 } as const;

export function BrandMark({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const h = HEIGHTS[size];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/eximious-academy-logo-reverse.png"
      alt="Eximious Academy"
      width={Math.round((LOGO_W / LOGO_H) * h)}
      height={h}
      style={{ height: h, width: "auto" }}
      className="block max-w-full select-none object-contain"
    />
  );
}
