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
import { PlayIcon } from "@/components/ui/icons";

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
}: {
  scene: Scene;
  clock: MediaClock;
  mediaRef: React.RefObject<HTMLMediaElement | null>;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [focusWithin, setFocusWithin] = useState(false);
  const focusWithinRef = useRef(false);
  focusWithinRef.current = focusWithin;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasVideo = !!scene.media.videoUrl;
  const isAvatar = scene.layout === "avatar" && !!scene.presenter;
  const hasEvidence = !!scene.evidence && scene.evidence.length > 0;
  // A cinematic presenter still (placeholder for the AI-avatar video) fills the
  // stage when a poster is provided on an avatar scene. This is the "paused
  // HeyGen frame" — swapping in real avatar video only means setting videoUrl.
  const presenterStill =
    !hasVideo &&
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
      {/* backdrop / video */}
      {hasVideo ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          className="absolute inset-0 h-full w-full object-cover object-[58%_center] lg:object-[70%_center]"
          src={scene.media.videoUrl}
          poster={scene.media.posterUrl}
          playsInline
          muted
          autoPlay
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
      ) : presenterStill ? (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={scene.media.posterUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[58%_center] lg:object-[70%_center]"
            style={{
              // Always-on, slow ambient push so the stage "breathes" like footage
              // even before real avatar video is dropped in (disabled for
              // prefers-reduced-motion via globals.css).
              animation: "exKenBurns 26s var(--ease-cinematic) alternate infinite",
            }}
          />
          {/* legibility scrims for the identity tag (left) and captions (bottom) */}
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
      )}

      {/* content layer (placeholder only): consequence beat > exhibits > presenter */}
      {!hasVideo && scene.type === "feedback" ? (
        <ConsequenceStage scene={scene} />
      ) : !hasVideo && hasEvidence ? (
        <EvidenceStage evidence={scene.evidence!} sceneKey={scene.id} />
      ) : !hasVideo && isAvatar && !presenterStill ? (
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

      {/* top-left identity stack: kicker + presenter tag (headlines live in the
          panel below, so nothing ever overlaps the presenter or an exhibit) */}
      <div className="pointer-events-none absolute left-4 top-4 z-[5] flex max-w-[80%] flex-col items-start gap-2 sm:left-6 sm:top-5">
        {scene.kicker && (
          <span className="rounded-full bg-navy-950/70 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-300 ring-1 ring-white/10 backdrop-blur-sm sm:text-[11px]">
            {scene.kicker}
          </span>
        )}
        {isAvatar && scene.presenter && (
          <div className="flex items-center gap-2.5 rounded-full bg-navy-950/80 py-1 pl-1 pr-3.5 ring-1 ring-white/10 backdrop-blur-md">
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
      </div>

      {/* top-right: honest AI-presenter placeholder tag (desktop/tablet only).
          Shown for the rendered placeholder video too — it's still not a real
          avatar. Remove this flag once final HeyGen footage is dropped in. */}
      {isAvatar && (
        <div className="pointer-events-none absolute right-4 top-4 z-[5] hidden sm:right-6 sm:top-5 sm:block">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-950/55 px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-widest text-ink-300 ring-1 ring-white/10 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> AI Presenter · Preview
          </span>
        </div>
      )}

      {/* big center play when paused (not ended) */}
      {!clock.playing && !clock.ended && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-950/55 ring-1 ring-white/20 backdrop-blur-sm sm:h-20 sm:w-20">
            <PlayIcon className="ml-1 h-7 w-7 text-ink-100 sm:h-9 sm:w-9" />
          </span>
        </div>
      )}

      {/* captions */}
      <div className="pointer-events-none absolute inset-x-0 bottom-14 sm:bottom-16">
        <CaptionOverlay
          captions={scene.media.captions}
          currentTime={clock.currentTime}
          visible={clock.captionsOn}
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
