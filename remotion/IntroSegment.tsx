import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * IntroSegment
 * ============================================================================
 * A bigger, more cinematic treatment of the AI-presenter frame: a pronounced
 * breathing push, a wider handheld drift, a warm light sweep that travels
 * across the frame, a richer teal/gold color grade, a soft key bloom, fine
 * moving film grain and a breathing vignette.
 *
 * NO text/labels are baked in — the player overlays identity + captions
 * responsively (baked corners would be cropped off on a phone). Motion uses
 * whole sine cycles over the clip so it LOOPS SEAMLESSLY (no freeze, no snap).
 * Frame-driven per Remotion rules; no CSS animation.
 */

export const INTRO_FPS = 30;
export const INTRO_DURATION_SECONDS = 30;

const TAU = Math.PI * 2;
const osc = (t: number, cycles: number, phase = 0) =>
  Math.sin(t * TAU * cycles + phase);
const osc01 = (t: number, cycles: number, phase = 0) =>
  osc(t, cycles, phase) * 0.5 + 0.5;

export const IntroSegment = ({ posterSrc }: { posterSrc: string }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames; // 0..1

  // Bigger, more visible camera — a slow breath + wider handheld sway.
  const scale = 1.09 + osc(t, 1) * 0.06; // 1.03 .. 1.15
  const driftX = osc(t, 2) * 14;
  const driftY = osc(t, 3, Math.PI / 2) * 9;

  // Warm key bloom, drifting with the camera.
  const bloom = 0.12 + osc01(t, 1) * 0.07;
  const keyX = 24 + driftX * 0.5;

  // A soft warm light sweep that travels across the frame (one pass per loop).
  const sweepX = 8 + osc01(t, 1, -Math.PI / 2) * 84; // 8% -> 92%

  const vignette = 0.52 + osc01(t, 2) * 0.16;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050f1f", overflow: "hidden" }}>
      <Img
        src={staticFile(posterSrc)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "68% center",
          transform: `translate(${driftX}px, ${driftY}px) scale(${scale})`,
        }}
      />

      {/* richer cinematic grade — teal/navy shadows, warmth through the mids */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(9,26,49,0.42) 0%, rgba(5,15,31,0) 34%, rgba(5,15,31,0) 58%, rgba(4,12,26,0.5) 100%)",
          mixBlendMode: "soft-light",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(74% 64% at 60% 40%, rgba(199,162,84,0.16), rgba(199,162,84,0) 70%)",
          mixBlendMode: "soft-light",
        }}
      />

      {/* traveling warm light sweep */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(38% 120% at ${sweepX}% 32%, rgba(255,240,205,0.12), rgba(255,240,205,0) 60%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* warm key-light bloom */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(48% 42% at ${keyX}% 24%, rgba(232,203,138,${bloom}), rgba(232,203,138,0) 60%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* fine moving film grain */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.05,
          mixBlendMode: "overlay",
        }}
      >
        <filter id="introGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.05"
            numOctaves={2}
            seed={frame % 180}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#introGrain)" />
      </svg>

      {/* breathing cinematic vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(122% 96% at 50% 42%, rgba(0,0,0,0) 50%, rgba(2,8,18,${vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
