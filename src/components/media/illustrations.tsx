import type { EvidenceIllustration } from "@/lib/branching/types";

/**
 * Evidence illustrations
 * ============================================================================
 * Vector "exhibits" used inside fullscreen evidence scenes. They stand in for
 * real claim photos/diagrams and are drawn in the brand palette so the file
 * reads as one professional case. Swap any of these for a real image by setting
 * `imageUrl` on the EvidenceItem instead of `illustration`.
 *
 * Colors come from the CSS theme variables (navy/gold), so they stay on-brand
 * automatically.
 */

const NAVY = "var(--color-navy-800)";
const NAVY_LINE = "var(--color-navy-300)";
const GOLD = "var(--color-gold-500)";
const GOLD_SOFT = "var(--color-gold-300)";
const INK = "var(--color-ink-200)";

function Frame({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 300"
      className="h-full w-full"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      {children}
    </svg>
  );
}

function FloorPlan() {
  return (
    <Frame label="Basement floor plan showing the window well on the north wall and the sump pit in the south-east corner">
      <rect x="0" y="0" width="400" height="300" fill="transparent" />
      {/* faint blueprint grid */}
      <g stroke="var(--color-navy-700)" strokeWidth="1">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="300" />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} />
        ))}
      </g>
      {/* outer walls */}
      <rect
        x="46"
        y="40"
        width="308"
        height="220"
        fill="none"
        stroke={NAVY_LINE}
        strokeWidth="3"
      />
      {/* interior partition */}
      <line x1="230" y1="40" x2="230" y2="160" stroke={NAVY_LINE} strokeWidth="2" />
      <line x1="230" y1="160" x2="354" y2="160" stroke={NAVY_LINE} strokeWidth="2" />
      {/* stairs */}
      <g stroke={NAVY_LINE} strokeWidth="1.5" fill="none">
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1={250 + i * 14} y1="46" x2={250 + i * 14} y2="92" />
        ))}
      </g>
      <text x="258" y="112" fill={INK} fontSize="9" fontFamily="var(--font-sans)">
        STAIRS
      </text>
      {/* water spread */}
      <path
        d="M60 150 Q120 120 190 150 T330 165 L330 245 L60 245 Z"
        fill="var(--color-navy-600)"
        opacity="0.85"
      />
      <path
        d="M60 150 Q120 120 190 150 T330 165"
        fill="none"
        stroke={GOLD_SOFT}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.8"
      />
      {/* window well (north wall) */}
      <rect x="120" y="30" width="52" height="14" fill={GOLD} opacity="0.9" />
      <circle cx="146" cy="37" r="15" fill="none" stroke={GOLD} strokeWidth="1.5" />
      <text x="120" y="22" fill={GOLD} fontSize="9" fontFamily="var(--font-sans)">
        WINDOW WELL
      </text>
      {/* sump pit (SE corner) */}
      <circle cx="322" cy="228" r="11" fill={GOLD} opacity="0.9" />
      <circle
        cx="322"
        cy="228"
        r="17"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.5"
        opacity="0.6"
      />
      <text x="286" y="262" fill={GOLD} fontSize="9" fontFamily="var(--font-sans)">
        SUMP PIT
      </text>
      {/* compass */}
      <g transform="translate(360,60)">
        <circle r="12" fill="none" stroke={NAVY_LINE} strokeWidth="1" />
        <path d="M0 -9 L3 3 L0 0 L-3 3 Z" fill={GOLD} />
        <text x="-3" y="-14" fill={INK} fontSize="8">
          N
        </text>
      </g>
    </Frame>
  );
}

function MoistureReadings() {
  const bars = [
    { label: "Window well", v: 0.92 },
    { label: "Drywall N", v: 0.84 },
    { label: "Center floor", v: 0.55 },
    { label: "Sump pit", v: 0.97 },
    { label: "Stairs", v: 0.28 },
  ];
  const baseY = 232;
  const maxH = 150;
  const threshold = 0.6;
  return (
    <Frame label="Bar chart of moisture readings, highest at the sump pit and window well, above the saturation threshold">
      <rect x="0" y="0" width="400" height="300" fill="transparent" />
      {/* axes */}
      <line x1="52" y1="60" x2="52" y2={baseY} stroke={NAVY_LINE} strokeWidth="1.5" />
      <line x1="52" y1={baseY} x2="372" y2={baseY} stroke={NAVY_LINE} strokeWidth="1.5" />
      {/* threshold line */}
      <line
        x1="52"
        y1={baseY - threshold * maxH}
        x2="372"
        y2={baseY - threshold * maxH}
        stroke={GOLD}
        strokeWidth="1.2"
        strokeDasharray="5 4"
        opacity="0.8"
      />
      <text x="300" y={baseY - threshold * maxH - 5} fill={GOLD} fontSize="9">
        Saturation threshold
      </text>
      {bars.map((b, i) => {
        const x = 78 + i * 62;
        const h = b.v * maxH;
        const over = b.v >= threshold;
        return (
          <g key={b.label}>
            <rect
              x={x}
              y={baseY - h}
              width="34"
              height={h}
              rx="2"
              fill={over ? GOLD : "var(--color-navy-500)"}
              opacity={over ? 0.95 : 0.9}
            />
            <text
              x={x + 17}
              y={baseY - h - 6}
              fill={INK}
              fontSize="9"
              textAnchor="middle"
            >
              {Math.round(b.v * 100)}%
            </text>
            <text
              x={x + 17}
              y={baseY + 14}
              fill={INK}
              fontSize="7.5"
              textAnchor="middle"
            >
              {b.label}
            </text>
          </g>
        );
      })}
      <text x="52" y="48" fill={INK} fontSize="10" fontFamily="var(--font-sans)">
        Moisture content (% MC)
      </text>
    </Frame>
  );
}

function Timeline() {
  const nodes = [
    { x: 80, t: "Storm", d: "Tue 22:40" },
    { x: 200, t: "+ 2 days", d: "Away" },
    { x: 320, t: "Discovered", d: "Thu 18:15" },
  ];
  return (
    <Frame label="Loss timeline: storm, two days away, then discovery of the loss">
      <rect x="0" y="0" width="400" height="300" fill="transparent" />
      <line x1="60" y1="150" x2="340" y2="150" stroke={NAVY_LINE} strokeWidth="2" />
      {nodes.map((n, i) => (
        <g key={n.t}>
          <circle
            cx={n.x}
            cy="150"
            r="9"
            fill={i === 0 ? GOLD : "var(--color-navy-500)"}
            stroke={GOLD}
            strokeWidth={i === 0 ? 0 : 1.5}
          />
          <text x={n.x} y="128" fill={INK} fontSize="11" textAnchor="middle">
            {n.t}
          </text>
          <text
            x={n.x}
            y="178"
            fill="var(--color-ink-300)"
            fontSize="9"
            textAnchor="middle"
          >
            {n.d}
          </text>
        </g>
      ))}
    </Frame>
  );
}

function PolicyClause() {
  return (
    <Frame label="Policy excerpt with the water-backup endorsement highlighted as covered and surface-water and seepage exclusions marked">
      <rect x="0" y="0" width="400" height="300" fill="transparent" />
      <rect
        x="60"
        y="34"
        width="280"
        height="232"
        rx="4"
        fill="var(--color-navy-900)"
        stroke="var(--color-navy-600)"
        strokeWidth="1"
      />
      <text x="78" y="60" fill={INK} fontSize="11" fontFamily="var(--font-display)">
        Policy HO-3 · Endorsements & Exclusions
      </text>
      {/* covered clause */}
      <rect x="72" y="76" width="256" height="40" rx="3" fill="var(--color-gold-900)" opacity="0.55" />
      <rect x="72" y="76" width="4" height="40" fill={GOLD} />
      <text x="86" y="92" fill={GOLD_SOFT} fontSize="9">
        ✓ Water Backup & Sump Overflow — Endorsement HW-101
      </text>
      <text x="86" y="106" fill={INK} fontSize="8" opacity="0.85">
        Covered, subject to sublimit.
      </text>
      {/* excluded clauses */}
      {[
        { y: 132, t: "Surface water / flood", s: "Excluded" },
        { y: 172, t: "Continuous seepage ≥ 14 days", s: "Excluded" },
      ].map((c) => (
        <g key={c.t}>
          <rect
            x="72"
            y={c.y}
            width="256"
            height="34"
            rx="3"
            fill="var(--color-navy-800)"
            opacity="0.6"
          />
          <text x="86" y={c.y + 15} fill={INK} fontSize="9" opacity="0.7">
            ✕ {c.t}
          </text>
          <text x="86" y={c.y + 27} fill="var(--color-verdict-incorrect)" fontSize="8">
            {c.s}
          </text>
        </g>
      ))}
      {/* faux lines */}
      <g stroke="var(--color-navy-600)" strokeWidth="1" opacity="0.5">
        <line x1="72" y1="222" x2="328" y2="222" />
        <line x1="72" y1="234" x2="300" y2="234" />
        <line x1="72" y1="246" x2="316" y2="246" />
      </g>
    </Frame>
  );
}

function CoverageClause() {
  return (
    <Frame label="Policy excerpt: covers sudden and accidental discharge; excludes damage occurring over a period of time">
      <rect x="0" y="0" width="400" height="300" fill="transparent" />
      <rect
        x="60"
        y="34"
        width="280"
        height="232"
        rx="4"
        fill="var(--color-navy-900)"
        stroke="var(--color-navy-600)"
        strokeWidth="1"
      />
      <text x="78" y="60" fill={INK} fontSize="11" fontFamily="var(--font-display)">
        Homeowners Policy · Water Damage
      </text>
      {/* covered clause */}
      <rect x="72" y="76" width="256" height="46" rx="3" fill="var(--color-gold-900)" opacity="0.55" />
      <rect x="72" y="76" width="4" height="46" fill={GOLD} />
      <text x="86" y="93" fill={GOLD_SOFT} fontSize="9">
        ✓ Covered
      </text>
      <text x="86" y="109" fill={INK} fontSize="8.5" opacity="0.9">
        Sudden and accidental discharge
      </text>
      {/* excluded clause */}
      <rect x="72" y="136" width="256" height="46" rx="3" fill="var(--color-navy-800)" opacity="0.6" />
      <rect x="72" y="136" width="4" height="46" fill="var(--color-verdict-incorrect)" />
      <text x="86" y="153" fill="var(--color-verdict-incorrect)" fontSize="9">
        ✕ Excluded
      </text>
      <text x="86" y="169" fill={INK} fontSize="8.5" opacity="0.75">
        Damage occurring over a period of time
      </text>
      {/* the conflict note */}
      <text x="78" y="206" fill={INK} fontSize="8.5" opacity="0.7">
        The claim turns on one factual question:
      </text>
      <text x="78" y="220" fill={GOLD_SOFT} fontSize="8.5">
        sudden event, or gradual over time?
      </text>
      {/* faux lines */}
      <g stroke="var(--color-navy-600)" strokeWidth="1" opacity="0.5">
        <line x1="72" y1="238" x2="328" y2="238" />
        <line x1="72" y1="250" x2="300" y2="250" />
      </g>
    </Frame>
  );
}

function DamagePhoto() {
  return (
    <Frame label="Evidence photo illustration of a basement corner with a water line about sixteen inches up the wall, a window well, and warped flooring">
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-navy-700)" />
          <stop offset="1" stopColor="var(--color-navy-800)" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-navy-600)" />
          <stop offset="1" stopColor="var(--color-navy-900)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="300" fill="url(#wall)" />
      {/* back wall / corner */}
      <path d="M0 0 L200 40 L200 300 L0 300 Z" fill="var(--color-navy-800)" opacity="0.5" />
      <line x1="200" y1="40" x2="200" y2="300" stroke="var(--color-navy-600)" strokeWidth="1.5" />
      {/* window well */}
      <rect x="60" y="46" width="90" height="54" fill="var(--color-navy-950)" stroke="var(--color-navy-500)" strokeWidth="2" />
      <line x1="105" y1="46" x2="105" y2="100" stroke="var(--color-navy-500)" strokeWidth="1.5" />
      <line x1="60" y1="73" x2="150" y2="73" stroke="var(--color-navy-500)" strokeWidth="1.5" />
      {/* water line + flood zone */}
      <rect x="0" y="196" width="400" height="104" fill="url(#water)" opacity="0.9" />
      <line x1="0" y1="196" x2="400" y2="196" stroke={GOLD} strokeWidth="2" />
      <rect x="0" y="196" width="400" height="4" fill={GOLD} opacity="0.4" />
      {/* staining above line (older) */}
      <path
        d="M250 120 Q270 150 260 196 L300 196 Q305 150 320 120 Z"
        fill="var(--color-navy-950)"
        opacity="0.4"
      />
      {/* measurement callout */}
      <g>
        <line x1="366" y1="196" x2="366" y2="300" stroke={GOLD_SOFT} strokeWidth="1" />
        <line x1="362" y1="196" x2="370" y2="196" stroke={GOLD_SOFT} strokeWidth="1" />
        <line x1="362" y1="300" x2="370" y2="300" stroke={GOLD_SOFT} strokeWidth="1" />
        <rect x="330" y="238" width="46" height="18" rx="3" fill="var(--color-navy-950)" opacity="0.8" />
        <text x="353" y="251" fill={GOLD_SOFT} fontSize="10" textAnchor="middle">
          ~16&quot;
        </text>
      </g>
      {/* warped floor hint */}
      <path
        d="M0 292 Q60 284 120 292 T240 292 T400 290"
        fill="none"
        stroke="var(--color-navy-500)"
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* evidence tab */}
      <rect x="14" y="264" width="120" height="22" rx="2" fill="var(--color-navy-950)" opacity="0.75" />
      <text x="24" y="279" fill={INK} fontSize="9" fontFamily="var(--font-sans)">
        EXHIBIT A · 2043-RW
      </text>
    </Frame>
  );
}

const MAP: Record<EvidenceIllustration, () => React.ReactElement> = {
  "floor-plan": FloorPlan,
  "moisture-readings": MoistureReadings,
  timeline: Timeline,
  "policy-clause": PolicyClause,
  "coverage-clause": CoverageClause,
  "damage-photo": DamagePhoto,
};

export function Illustration({ name }: { name: EvidenceIllustration }) {
  const Cmp = MAP[name];
  return Cmp ? <Cmp /> : null;
}
