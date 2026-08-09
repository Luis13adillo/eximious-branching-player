import { Composition } from "remotion";
import {
  IntroSegment,
  INTRO_FPS,
  INTRO_DURATION_SECONDS,
} from "./IntroSegment";

/**
 * Remotion compositions for Eximious Academy lesson media.
 *
 * These render to real .mp4 files in public/media/ which the player then plays
 * through the normal `media.videoUrl` path — no player/engine change. Add more
 * `<Composition>`s here (one per rendered segment) as needed.
 *
 * Render:  npm run render:intro   (see package.json)
 * Preview: npm run remotion       (opens Remotion Studio)
 */
export const RemotionRoot = () => {
  return (
    <Composition
      id="IntroSegment"
      component={IntroSegment}
      durationInFrames={Math.round(INTRO_DURATION_SECONDS * INTRO_FPS)}
      fps={INTRO_FPS}
      width={1920}
      height={1080}
      defaultProps={{ posterSrc: "media/presenter-diane.jpg" }}
    />
  );
};
