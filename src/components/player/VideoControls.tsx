"use client";

import { useRef, useState } from "react";
import type { MediaClock } from "./useMediaClock";
import {
  CaptionsIcon,
  ExitFullscreenIcon,
  FullscreenIcon,
  MuteIcon,
  PauseIcon,
  PlayIcon,
  ReplayIcon,
  VolumeIcon,
} from "@/components/ui/icons";

function fmt(t: number) {
  const s = Math.max(0, Math.floor(t));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function Scrubber({ clock }: { clock: MediaClock }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const pct = clock.duration ? (clock.currentTime / clock.duration) * 100 : 0;

  const seekFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    clock.seek(ratio * clock.duration);
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(clock.duration)}
      aria-valuenow={Math.round(clock.currentTime)}
      aria-valuetext={`${fmt(clock.currentTime)} of ${fmt(clock.duration)}`}
      className="group/scrub relative flex h-5 flex-1 cursor-pointer items-center"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setDragging(true);
        seekFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging && seekFromClientX(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          clock.seek(clock.currentTime + 5);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          clock.seek(clock.currentTime - 5);
        } else if (e.key === "Home") {
          e.preventDefault();
          clock.seek(0);
        } else if (e.key === "End") {
          e.preventDefault();
          clock.seek(clock.duration);
        }
      }}
    >
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20 transition-[height] group-hover/scrub:h-1.5">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gold-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div
        className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400 opacity-0 shadow transition-opacity group-hover/scrub:opacity-100 group-focus-visible/scrub:opacity-100"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}

function CtrlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-md text-ink-100/90 transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}

export function VideoControls({
  clock,
  fullscreen,
  onToggleFullscreen,
  compact = false,
}: {
  clock: MediaClock;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-1">
      {clock.ended ? (
        <CtrlButton label="Replay" onClick={clock.replay}>
          <ReplayIcon className="h-5 w-5" />
        </CtrlButton>
      ) : (
        <CtrlButton
          label={clock.playing ? "Pause" : "Play"}
          onClick={clock.toggle}
        >
          {clock.playing ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </CtrlButton>
      )}

      <span className="hidden w-[86px] shrink-0 text-center font-sans text-xs tabular-nums text-ink-200 sm:block">
        {fmt(clock.currentTime)} / {fmt(clock.duration)}
      </span>

      <Scrubber clock={clock} />

      {!compact && (
        <div className="group/vol flex items-center">
          <CtrlButton
            label={clock.muted || clock.volume === 0 ? "Unmute" : "Mute"}
            onClick={() => clock.setMuted(!clock.muted)}
          >
            {clock.muted || clock.volume === 0 ? (
              <MuteIcon className="h-5 w-5" />
            ) : (
              <VolumeIcon className="h-5 w-5" />
            )}
          </CtrlButton>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            aria-label="Volume"
            value={clock.muted ? 0 : clock.volume}
            onChange={(e) => clock.setVolume(Number(e.target.value))}
            className="ex-volume h-1 w-0 cursor-pointer opacity-0 transition-all duration-200 group-hover/vol:mr-1 group-hover/vol:w-16 group-hover/vol:opacity-100 focus-visible:w-16 focus-visible:opacity-100"
          />
        </div>
      )}

      <button
        type="button"
        aria-pressed={clock.captionsOn}
        aria-label={clock.captionsOn ? "Turn captions off" : "Turn captions on"}
        title="Captions"
        onClick={clock.toggleCaptions}
        className={`flex h-9 items-center justify-center gap-1 rounded-md px-2 text-ink-100/90 transition-colors hover:bg-white/10 hover:text-white ${
          clock.captionsOn ? "bg-white/10 text-white" : ""
        }`}
      >
        <CaptionsIcon className="h-5 w-5" />
        <span
          className={`h-0.5 w-4 rounded-full ${clock.captionsOn ? "bg-gold-500" : "bg-transparent"}`}
        />
      </button>

      <CtrlButton
        label={fullscreen ? "Exit full screen" : "Full screen"}
        onClick={onToggleFullscreen}
      >
        {fullscreen ? (
          <ExitFullscreenIcon className="h-5 w-5" />
        ) : (
          <FullscreenIcon className="h-5 w-5" />
        )}
      </CtrlButton>
    </div>
  );
}
