import {
  AbsoluteFill,
  Audio,
  Loop,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * IntroSegment
 * ============================================================================
 * Composites the Kling talking-presenter clip into the full-length intro. The
 * ~10s clip is looped to fill the 30s narration, and the Eximious cinematic
 * grade (cool navy shadows / warm highlights), a warm key bloom, fine film
 * grain and a breathing vignette are layered over it so the brand look stays
 * consistent. The player still overlays identity/captions responsively.
 *
 * Swap `videoSrc` for a HeyGen (lip-synced) clip later and nothing else changes.
 * Frame-driven per Remotion rules; no CSS animation.
 */

export const INTRO_FPS = 30;
/** matches the baked voiceover length (public/media/intro-vo.mp3 ≈ 32.3s) */
export const INTRO_DURATION_SECONDS = 33;
/** usable length of the source clip in seconds (kept just under its true 10.04s) */
const CLIP_SECONDS = 10;

const TAU = Math.PI * 2;
const osc01 = (t: number, cycles: number, phase = 0) =>
  Math.sin(t * TAU * cycles + phase) * 0.5 + 0.5;

export const IntroSegment = ({ videoSrc }: { videoSrc: string }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames; // 0..1 across the whole intro
  const clipFrames = Math.round(CLIP_SECONDS * fps);

  const bloom = 0.1 + osc01(t, 1) * 0.06;
  const vignette = 0.5 + osc01(t, 2) * 0.14;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050f1f", overflow: "hidden" }}>
      {/* baked narration voiceover (synthetic TTS placeholder) */}
      <Audio src={staticFile("media/intro-vo.mp3")} />

      {/* talking-presenter footage, looped to fill the intro */}
      <Loop durationInFrames={clipFrames}>
        <OffthreadVideo
          src={staticFile(videoSrc)}
          muted
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "68% center",
          }}
        />
      </Loop>

      {/* cinematic grade — cool navy shadows top/bottom, warmth through the mids */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(9,26,49,0.34) 0%, rgba(5,15,31,0) 36%, rgba(5,15,31,0) 60%, rgba(4,12,26,0.42) 100%)",
          mixBlendMode: "soft-light",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(74% 64% at 60% 40%, rgba(199,162,84,0.13), rgba(199,162,84,0) 70%)",
          mixBlendMode: "soft-light",
        }}
      />

      {/* warm key-light bloom */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(48% 42% at 24% 24%, rgba(232,203,138,${bloom}), rgba(232,203,138,0) 60%)`,
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
          background: `radial-gradient(122% 96% at 50% 42%, rgba(0,0,0,0) 52%, rgba(2,8,18,${vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
