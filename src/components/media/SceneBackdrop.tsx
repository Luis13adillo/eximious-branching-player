import type { PlaceholderSceneName } from "@/lib/branching/types";

/**
 * SceneBackdrop
 * ============================================================================
 * Full-bleed, cinematic placeholder "footage". Rather than clip art, each scene
 * is composed like a lit film frame: a graded base, a warm directional key
 * light, a cool fill/rim from the opposite side, soft depth-of-field bokeh, a
 * faint environment silhouette, a strong vignette and restrained film grain.
 * This reads as premium B-roll before real video exists. When a scene has a
 * real `videoUrl`, the player renders <video> and this is never shown.
 */

interface SceneDef {
  base: [string, string, string]; // vertical grade: top / mid / bottom
  key: { color: string; x: number; y: number }; // warm key light
  fill: { color: string; x: number; y: number }; // cool fill/rim
  /** environment silhouette fragment (viewBox 0..100) */
  env?: React.ReactNode;
}

const NAVY_950 = "var(--color-navy-950)";
const NAVY_900 = "var(--color-navy-900)";
const NAVY_800 = "var(--color-navy-800)";
const NAVY_700 = "var(--color-navy-700)";
const NAVY_600 = "var(--color-navy-600)";
const GOLD = "var(--color-gold-500)";
const GOLD_400 = "var(--color-gold-400)";
const STEEL = "#5f7fae";

const SCENES: Record<PlaceholderSceneName, SceneDef> = {
  // Warm studio / desk interview lighting.
  "claim-desk": {
    base: [NAVY_700, NAVY_900, NAVY_950],
    key: { color: GOLD, x: 24, y: 26 },
    fill: { color: STEEL, x: 90, y: 78 },
    env: (
      <g opacity="0.5">
        {/* desk plane */}
        <path d="M0 82 L100 74 L100 100 L0 100 Z" fill={NAVY_950} opacity="0.75" />
        {/* soft window light bloom, upper left */}
        <rect x="8" y="10" width="20" height="34" rx="2" fill={GOLD_400} opacity="0.05" />
      </g>
    ),
  },
  // Cool, damp, reflective basement.
  "flooded-interior": {
    base: [NAVY_600, NAVY_800, NAVY_950],
    key: { color: STEEL, x: 70, y: 22 },
    fill: { color: GOLD, x: 12, y: 30 },
    env: (
      <g>
        {/* water line + reflective floor */}
        <rect x="0" y="70" width="100" height="30" fill={NAVY_950} opacity="0.6" />
        <rect x="0" y="70" width="100" height="0.5" fill={GOLD} opacity="0.35" />
        <path d="M0 78 L100 78 L100 100 L0 100 Z" fill={STEEL} opacity="0.06" />
      </g>
    ),
  },
  // Analytical / evidence — cool with a warm data highlight.
  "moisture-map": {
    base: [NAVY_800, NAVY_900, NAVY_950],
    key: { color: "#b8695c", x: 40, y: 44 },
    fill: { color: STEEL, x: 82, y: 20 },
  },
  // Desk with document under lamp.
  "policy-document": {
    base: [NAVY_700, NAVY_800, NAVY_950],
    key: { color: GOLD, x: 56, y: 30 },
    fill: { color: STEEL, x: 14, y: 74 },
    env: (
      <g opacity="0.5">
        <path d="M0 84 L100 78 L100 100 L0 100 Z" fill={NAVY_950} opacity="0.7" />
      </g>
    ),
  },
  // Night storm exterior.
  "storm-exterior": {
    base: ["#123", NAVY_900, NAVY_950],
    key: { color: STEEL, x: 66, y: 14 },
    fill: { color: GOLD, x: 20, y: 60 },
  },
  // Calm, resolved — soft dawn light.
  resolution: {
    base: [NAVY_600, NAVY_800, NAVY_900],
    key: { color: GOLD_400, x: 50, y: 20 },
    fill: { color: STEEL, x: 88, y: 82 },
  },
};

function Bokeh({ seed, color }: { seed: number; color: string }) {
  const pts = [
    [16, 32, 7],
    [30, 20, 4],
    [80, 30, 8],
    [68, 60, 5],
    [46, 74, 6],
    [90, 66, 4.5],
  ];
  return (
    <g filter="url(#soft)">
      {pts.map(([x, y, r], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r + ((seed + i) % 3)}
          fill={color}
          opacity={0.05 + ((seed + i) % 3) * 0.018}
        />
      ))}
    </g>
  );
}

export function SceneBackdrop({
  scene,
  animate = true,
}: {
  scene: PlaceholderSceneName;
  animate?: boolean;
}) {
  const def = SCENES[scene] ?? SCENES["claim-desk"];
  const seed = scene.length;

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-950">
      <div
        className="absolute inset-0"
        style={{
          animation: animate
            ? "exKenBurns 30s var(--ease-cinematic) alternate infinite"
            : undefined,
        }}
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`base-${scene}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={def.base[0]} />
              <stop offset="0.5" stopColor={def.base[1]} />
              <stop offset="1" stopColor={def.base[2]} />
            </linearGradient>
            <radialGradient
              id={`key-${scene}`}
              cx={`${def.key.x}%`}
              cy={`${def.key.y}%`}
              r="70%"
            >
              <stop offset="0" stopColor={def.key.color} stopOpacity="0.42" />
              <stop offset="35%" stopColor={def.key.color} stopOpacity="0.12" />
              <stop offset="100%" stopColor={def.key.color} stopOpacity="0" />
            </radialGradient>
            <radialGradient
              id={`fill-${scene}`}
              cx={`${def.fill.x}%`}
              cy={`${def.fill.y}%`}
              r="65%"
            >
              <stop offset="0" stopColor={def.fill.color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={def.fill.color} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`vig-${scene}`} cx="50%" cy="44%" r="78%">
              <stop offset="50%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.66" />
            </radialGradient>
            <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.4" />
            </filter>
            <filter id={`grain-${scene}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="2"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.03" />
              </feComponentTransfer>
              <feComposite operator="over" in2="SourceGraphic" />
            </filter>
          </defs>

          <rect x="0" y="0" width="100" height="100" fill={`url(#base-${scene})`} />
          <rect x="0" y="0" width="100" height="100" fill={`url(#fill-${scene})`} />
          <Bokeh seed={seed} color={def.key.color} />
          {def.env}
          <rect x="0" y="0" width="100" height="100" fill={`url(#key-${scene})`} />
          <rect x="0" y="0" width="100" height="100" fill={`url(#vig-${scene})`} />
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            filter={`url(#grain-${scene})`}
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}
