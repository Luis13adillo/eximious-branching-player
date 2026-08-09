import type { PlaceholderSceneName } from "@/lib/branching/types";

/**
 * SceneBackdrop
 * ============================================================================
 * Full-bleed, atmospheric placeholder "footage". These are intentionally
 * cinematic rather than literal — deep navy gradients, a warm gold key light,
 * depth-of-field bokeh, film grain and a vignette — so a scene reads as
 * premium B-roll before real video exists. Each named scene shifts the light,
 * tint and silhouettes so the lesson never looks repetitive.
 *
 * When a real `videoUrl` is supplied, the player renders <video> instead and
 * these are never shown.
 */

interface SceneDef {
  /** background gradient stops (top → bottom) */
  bg: [string, string];
  /** key-light color + position (0-100) */
  glow: string;
  glowPos: [number, number];
  /** silhouettes drawn in front, as an SVG fragment */
  silhouette: React.ReactNode;
  tint?: string;
}

const NAVY_900 = "var(--color-navy-900)";
const NAVY_950 = "var(--color-navy-950)";
const NAVY_800 = "var(--color-navy-800)";
const NAVY_700 = "var(--color-navy-700)";
const GOLD = "var(--color-gold-500)";

function bokeh(seed: number) {
  // deterministic scatter of soft focus lights
  const pts = [
    [18, 30, 26],
    [72, 22, 40],
    [86, 64, 30],
    [40, 78, 34],
    [62, 48, 20],
  ];
  return (
    <g opacity="0.5">
      {pts.map(([x, y, r], i) => (
        <circle
          key={i}
          cx={`${x}%`}
          cy={`${y}%`}
          r={r + ((seed + i) % 3) * 6}
          fill={GOLD}
          opacity={0.05 + ((seed + i) % 3) * 0.02}
        />
      ))}
    </g>
  );
}

const SCENES: Record<PlaceholderSceneName, SceneDef> = {
  "claim-desk": {
    bg: [NAVY_800, NAVY_950],
    glow: GOLD,
    glowPos: [26, 32],
    silhouette: (
      <g>
        {/* desk plane */}
        <path d="M0 78 L100 68 L100 100 L0 100 Z" fill={NAVY_950} opacity="0.7" transform="scale(1)" />
      </g>
    ),
  },
  "flooded-interior": {
    bg: [NAVY_700, NAVY_950],
    glow: GOLD,
    glowPos: [70, 26],
    tint: "rgba(11,31,58,0.35)",
    silhouette: null,
  },
  "moisture-map": {
    bg: [NAVY_900, NAVY_950],
    glow: "#c9776a",
    glowPos: [40, 46],
    silhouette: null,
  },
  "policy-document": {
    bg: [NAVY_800, NAVY_950],
    glow: GOLD,
    glowPos: [58, 30],
    silhouette: null,
  },
  "storm-exterior": {
    bg: ["#0e2340", NAVY_950],
    glow: "#7994bd",
    glowPos: [64, 18],
    silhouette: null,
  },
  resolution: {
    bg: [NAVY_700, NAVY_900],
    glow: GOLD,
    glowPos: [50, 24],
    silhouette: null,
  },
};

export function SceneBackdrop({
  scene,
  animate = true,
}: {
  scene: PlaceholderSceneName;
  animate?: boolean;
}) {
  const def = SCENES[scene] ?? SCENES["claim-desk"];
  const seed = scene.length;
  const [gx, gy] = def.glowPos;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ animation: animate ? "exKenBurns 26s var(--ease-cinematic) alternate infinite" : undefined }}
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`bg-${scene}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={def.bg[0]} />
              <stop offset="1" stopColor={def.bg[1]} />
            </linearGradient>
            <radialGradient id={`glow-${scene}`} cx={`${gx}%`} cy={`${gy}%`} r="60%">
              <stop offset="0" stopColor={def.glow} stopOpacity="0.5" />
              <stop offset="45%" stopColor={def.glow} stopOpacity="0.12" />
              <stop offset="100%" stopColor={def.glow} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`vig-${scene}`} cx="50%" cy="46%" r="75%">
              <stop offset="55%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.62" />
            </radialGradient>
            <filter id={`grain-${scene}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.06" />
              </feComponentTransfer>
              <feComposite operator="over" in2="SourceGraphic" />
            </filter>
          </defs>

          <rect x="0" y="0" width="100" height="100" fill={`url(#bg-${scene})`} />
          {bokeh(seed)}
          {/* atmospheric depth bands */}
          <path d="M0 62 L100 54 L100 100 L0 100 Z" fill={NAVY_950} opacity="0.45" />
          <path d="M0 74 L100 70 L100 100 L0 100 Z" fill={NAVY_950} opacity="0.55" />
          {def.silhouette}
          <rect x="0" y="0" width="100" height="100" fill={`url(#glow-${scene})`} />
          {def.tint ? <rect x="0" y="0" width="100" height="100" fill={def.tint} /> : null}
          <rect x="0" y="0" width="100" height="100" fill={`url(#vig-${scene})`} />
          <rect x="0" y="0" width="100" height="100" filter={`url(#grain-${scene})`} opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
