import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * IntroSegment
 * ============================================================================
 * Turns the still AI-presenter frame into "living footage": a slow push-in, a
 * gentle handheld drift, moving film grain, a breathing vignette and a warm key
 * light that sways. No text or lower-third is baked in — the player keeps
 * overlaying the identity tag, captions and controls, so this renders as a
 * drop-in replacement for the still (same framing) via the `videoUrl` path.
 *
 * All motion is frame-driven (useCurrentFrame + interpolate) per Remotion rules;
 * no CSS animations.
 */

export const INTRO_FPS = 30;
export const INTRO_DURATION_SECONDS = 30;

export const IntroSegment = ({ posterSrc }: { posterSrc: string }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // slow cinematic push-in across the whole clip
  const scale = interpolate(frame, [0, durationInFrames], [1.06, 1.14], {
    extrapolateRight: "clamp",
  });
  // gentle handheld sway (different periods so it never looks like a loop)
  const driftX = Math.sin(frame / 90) * 8;
  const driftY = Math.cos(frame / 130) * 6;
  // vignette that breathes
  const vignette = 0.55 + Math.sin(frame / 120) * 0.08;
  // warm key light that drifts with the camera
  const keyX = 20 + driftX * 0.35;

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

      {/* moving film grain (seed changes per frame) */}
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
            baseFrequency="0.9"
            numOctaves={2}
            seed={frame % 200}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#introGrain)" />
      </svg>

      {/* warm key light drifting with the camera */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(58% 50% at ${keyX}% 26%, rgba(199,162,84,0.12), rgba(199,162,84,0) 62%)`,
        }}
      />

      {/* breathing cinematic vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(118% 92% at 50% 42%, rgba(0,0,0,0) 55%, rgba(5,15,31,${vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
