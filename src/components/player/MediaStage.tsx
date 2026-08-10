"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Scene } from "@/lib/branching/types";
import type { MediaClock } from "./useMediaClock";
import { SceneBackdrop } from "@/components/media/SceneBackdrop";
import { AvatarPresenter } from "./AvatarPresenter";
import { EvidenceStage } from "./EvidenceStage";
import { ConsequenceStage } from "./ConsequenceStage";
import { CaptionOverlay } from "./CaptionOverlay";
import { VideoControls } from "./VideoControls";
import { PlayIcon, VolumeIcon } from "@/components/ui/icons";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * MediaStage — the 16:9 "player rectangle".
 * Renders real <video> when a scene has a videoUrl, otherwise a cinematic
 * placeholder (backdrop + presenter or exhibits). Owns fullscreen, click-to-
 * play, auto-hiding controls, and keyboard shortcuts. Layout-agnostic: the
 * branching engine decides which scene is here.
 */
export function MediaStage({
  scene,
  clock,
  mediaRef,
  autoPlay = true,
}: {
  scene: Scene;
  clock: MediaClock;
  mediaRef: React.RefObject<HTMLMediaElement | null>;
  /** Whether this scene's media should start on its own (false on a retry re-entry). */
  autoPlay?: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [focusWithin, setFocusWithin] = useState(false);
  const focusWithinRef = useRef(false);
  focusWithinRef.current = focusWithin;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ONE persistent media element for the whole lesson. It is ALWAYS a <video>
  // (a <video> plays audio-only tracks too), and the SAME node is reused for
  // every scene — only its `src` changes. Never swapping or recreating the
  // element means the browser's "user unlocked sound" gesture is never lost, so
  // the learner taps "sound on" once and it sticks for the rest of the lesson.
  // (Element recreation on every scene was the cause of the repeated
  // tap-for-sound, especially on mobile Safari.)
  const mediaUrl = scene.media.videoUrl ?? scene.media.audioUrl;
  const showVideo = !!scene.media.videoUrl; // has real visual footage to show
  const isAvatar = scene.layout === "avatar" && !!scene.presenter;
  const hasEvidence = !!scene.evidence && scene.evidence.length > 0;
  // A cinematic presenter still, only when an avatar scene has no real video.
  const presenterStill =
    !showVideo &&
    isAvatar &&
    scene.type !== "feedback" &&
    !!scene.media.posterUrl;

  const nudgeControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      // Keep controls up while keyboard focus is inside the stage.
      if (clock.playing && !clock.ended && !focusWithinRef.current)
        setControlsVisible(false);
    }, 2600);
  }, [clock.playing, clock.ended]);

  useEffect(() => {
    nudgeControls();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [nudgeControls, scene.id]);

  // keep controls up whenever not actively playing
  useEffect(() => {
    if (!clock.playing || clock.ended) setControlsVisible(true);
  }, [clock.playing, clock.ended]);

  const toggleFullscreen = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Ignore when focus is on the range/slider inputs (they handle their own keys)
    const tag = (e.target as HTMLElement).tagName;
    const role = (e.target as HTMLElement).getAttribute?.("role");
    if (tag === "INPUT" || role === "slider") return;
    switch (e.key) {
      case " ":
      case "k":
        e.preventDefault();
        clock.toggle();
        nudgeControls();
        break;
      case "m":
        clock.setMuted(!clock.muted);
        break;
      case "f":
        toggleFullscreen();
        break;
      case "c":
        clock.toggleCaptions();
        break;
      case "ArrowRight":
        e.preventDefault();
        clock.seek(clock.currentTime + 5);
        nudgeControls();
        break;
      case "ArrowLeft":
        e.preventDefault();
        clock.seek(clock.currentTime - 5);
        nudgeControls();
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={stageRef}
      onMouseMove={nudgeControls}
      onKeyDown={onKeyDown}
      onFocusCapture={() => {
        setFocusWithin(true);
        setControlsVisible(true);
      }}
      onBlurCapture={(e) => {
        if (!stageRef.current?.contains(e.relatedTarget as Node))
          setFocusWithin(false);
      }}
      tabIndex={0}
      aria-label={`Video: ${scene.headline ?? scene.label}`}
      // Inset the focus ring so the overflow-hidden wrapper can't clip it.
      // Inline style beats the global :focus-visible rule's outline-offset.
      style={{ outlineOffset: "-3px" }}
      className={`group/stage relative w-full overflow-hidden bg-navy-950 ${
        fullscreen
          ? "h-full"
          : "h-[46vh] min-h-[300px] sm:h-[52vh] lg:h-full lg:min-h-0"
      }`}
    >
      {/* Persistent media element — the SAME <video> node for every scene (only
          its `src` changes), so a sound-unlock gesture is never lost to element
          recreation. It shows real footage when present, and plays the
          audio-only voiceover otherwise (kept invisible behind the scene's
          visual layer below). `key` pins its identity across renders. */}
      {mediaUrl && (
        <video
          key="stage-media"
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          className={
            showVideo
              ? "absolute inset-0 h-full w-full object-cover object-[58%_center] lg:object-[70%_center]"
              : "pointer-events-none absolute inset-0 h-full w-full opacity-0"
          }
          src={mediaUrl}
          poster={showVideo ? scene.media.posterUrl : undefined}
          playsInline
          muted
          autoPlay={autoPlay}
          loop={!!scene.media.loop}
        >
          {scene.media.captionsUrl && (
            <track
              kind="captions"
              src={scene.media.captionsUrl}
              default={clock.captionsOn}
              label="English"
            />
          )}
        </video>
      )}

      {/* visual layer for scenes without real footage (audio-only, e.g. the assignment) */}
      {!showVideo &&
        (presenterStill ? (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scene.media.posterUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[58%_center] lg:object-[70%_center]"
              style={{
                animation: "exKenBurns 26s var(--ease-cinematic) alternate infinite",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(5,15,31,0.78) 0%, rgba(5,15,31,0.35) 34%, rgba(5,15,31,0) 62%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-2/5"
              style={{
                background:
                  "linear-gradient(0deg, rgba(5,15,31,0.72), rgba(5,15,31,0))",
              }}
            />
          </div>
        ) : (
          <SceneBackdrop
            scene={scene.media.placeholderScene ?? "claim-desk"}
            animate={clock.playing}
          />
        ))}

      {/* content layer (no real video): consequence beat > exhibits > presenter */}
      {!showVideo && scene.type === "feedback" ? (
        <ConsequenceStage scene={scene} />
      ) : !showVideo && hasEvidence ? (
        <EvidenceStage evidence={scene.evidence!} sceneKey={scene.id} />
      ) : !showVideo && isAvatar && !presenterStill ? (
        <AvatarPresenter
          presenter={scene.presenter!}
          speaking={clock.playing && !clock.ended}
        />
      ) : null}

      {/* click-to-play surface */}
      <button
        type="button"
        aria-label={clock.playing ? "Pause" : "Play"}
        onClick={() => {
          clock.toggle();
          nudgeControls();
        }}
        className="absolute inset-0 h-full w-full cursor-default"
        tabIndex={-1}
      />

      {/* One tasteful presenter lower-third — DESKTOP ONLY. On phones the video
          frame is kept clean (the case title / kicker live in the panel beside
          it), so nothing crowds the presenter. No kicker chip, no preview stamp. */}
      {isAvatar && scene.presenter && (
        <div className="pointer-events-none absolute left-6 top-5 z-[5] hidden items-center gap-2.5 rounded-full bg-navy-950/70 py-1 pl-1 pr-3.5 ring-1 ring-white/10 backdrop-blur-md sm:flex">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 font-[family-name:var(--font-display)] text-[11px] font-semibold text-navy-950">
            {initials(scene.presenter.name)}
          </span>
          <span className="leading-tight">
            <span className="block font-sans text-[13px] font-medium text-ink-100">
              {scene.presenter.name}
            </span>
            <span className="block font-sans text-[9px] uppercase tracking-[0.16em] text-gold-300">
              {scene.presenter.role}
            </span>
          </span>
        </div>
      )}

      {/* "tap for sound" — the video autoplays muted (browser policy); this lets
          the learner turn on the baked voiceover with a gesture, from the top */}
      {scene.media.hasAudio && clock.muted && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            clock.setMuted(false);
            clock.seek(0);
            clock.play();
          }}
          className="absolute left-1/2 top-4 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-gold-500 px-4 py-2 font-sans text-[13px] font-semibold text-navy-950 shadow-lg ring-1 ring-black/25 transition-colors hover:bg-gold-400 sm:top-5"
        >
          <VolumeIcon className="h-4 w-4" />
          Tap for sound
        </button>
      )}

      {/* buffering spinner — only when real media is genuinely not ready */}
      {clock.waiting && !clock.ended && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-12 w-12 animate-spin rounded-full border-2 border-white/25 border-t-gold-400 sm:h-14 sm:w-14" />
        </div>
      )}

      {/* big center play when paused (not ended, not buffering) */}
      {!clock.playing && !clock.ended && !clock.waiting && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-950/55 ring-1 ring-white/20 backdrop-blur-sm sm:h-20 sm:w-20">
            <PlayIcon className="ml-1 h-7 w-7 text-ink-100 sm:h-9 sm:w-9" />
          </span>
        </div>
      )}

      {/* captions — suppressed on exhibit scenes, where they'd cover the image
          (the exhibit card carries its own caption and the panel has the body) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-14 sm:bottom-16">
        <CaptionOverlay
          captions={scene.media.captions}
          currentTime={clock.currentTime}
          visible={clock.captionsOn && !hasEvidence}
        />
      </div>

      {/* controls */}
      <div
        className={`absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent pb-2 pt-12 transition-opacity duration-300 ${
          controlsVisible || focusWithin
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <VideoControls
          clock={clock}
          fullscreen={fullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
    </div>
  );
}
