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
 * Turns the still AI-presenter frame into premium "living footage": a gentle
 * breathing push-in, a multi-axis handheld drift, a drifting warm key bloom, a
 * cinematic color grade (cool shadows / warm highlights), fine moving film
 * grain and a breathing vignette.
 *
 * IMPORTANT — the motion is SEAMLESSLY LOOPABLE: every animated value uses whole
 * sine cycles over the clip duration, so frame 0 and the final frame match in
 * both value and velocity. That means the player can `loop` it with no
 * snap/zoom seam. No fade in/out (that would break the loop). No text is baked
 * in — the player overlays the identity tag, captions and controls.
 *
 * All motion is frame-driven per Remotion rules; no CSS animation.
 */

export const INTRO_FPS = 30;
export const INTRO_DURATION_SECONDS = 30;

const TAU = Math.PI * 2;
const osc = (t: number, cycles: number, phase = 0) =>
  Math.sin(t * TAU * cycles + phase);
/** 0..1 eased oscillation */
const osc01 = (t: number, cycles: number, phase = 0) =>
  osc(t, cycles, phase) * 0.5 + 0.5;

export const IntroSegment = ({ posterSrc }: { posterSrc: string }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames; // 0..1 across the clip

  // Seamless cyclic camera: a slow breath + gentle handheld sway.
  const scale = 1.08 + osc(t, 1) * 0.045; // 1.035 .. 1.125
  const driftX = osc(t, 2) * 9; // 2 full cycles
  const driftY = osc(t, 3, Math.PI / 2) * 6; // 3 full cycles
  // Warm key bloom drifts with the camera and pulses gently.
  const bloom = 0.1 + osc01(t, 1) * 0.06;
  const keyX = 22 + driftX * 0.45;
  // Breathing vignette.
  const vignette = 0.5 + osc01(t, 2) * 0.14;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050f1f", overflow: "hidden" }}>
      <Img
        src={staticFile(posterSrc)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "70% center",
          transform: `translate(${driftX}px, ${driftY}px) scale(${scale})`,
        }}
      />

      {/* cinematic grade — cool navy in the shadows (top/bottom), gentle warmth
          through the mids */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(11,31,58,0.30) 0%, rgba(5,15,31,0) 38%, rgba(5,15,31,0) 60%, rgba(5,15,31,0.38) 100%)",
          mixBlendMode: "soft-light",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(72% 62% at 62% 40%, rgba(199,162,84,0.12), rgba(199,162,84,0) 70%)",
          mixBlendMode: "soft-light",
        }}
      />

      {/* warm key-light bloom, drifting with the camera */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(46% 40% at ${keyX}% 24%, rgba(232,203,138,${bloom}), rgba(232,203,138,0) 60%)`,
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
          opacity: 0.045,
          mixBlendMode: "overlay",
        }}
      >
        <filter id="introGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.1"
            numOctaves={2}
            seed={frame % 180}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#introGrain)" />
      </svg>

      {/* breathing cinematic vignette for depth */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 95% at 50% 42%, rgba(0,0,0,0) 52%, rgba(3,10,22,${vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
