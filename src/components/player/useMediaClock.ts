"use client";

/**
 * useMediaClock
 * ============================================================================
 * One playback model for two cases:
 *   1. No final asset yet → a simulated clock advances currentTime to duration
 *      so the placeholder stage plays, scrubs, and captions in sync.
 *   2. A real <video>/<audio> element (HeyGen, Mux, ElevenLabs) → the same API
 *      binds to the element's real time.
 * The controls and caption logic never need to know which case is live, so
 * dropping in real media later requires no player changes.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export interface MediaClock {
  currentTime: number;
  duration: number;
  playing: boolean;
  ended: boolean;
  muted: boolean;
  volume: number;
  captionsOn: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (t: number) => void;
  replay: () => void;
  setMuted: (m: boolean) => void;
  setVolume: (v: number) => void;
  toggleCaptions: () => void;
}

const nowMs = () =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

export function useMediaClock(
  durationSec: number,
  opts: {
    /** restart when this changes (scene id) */
    sceneKey: string;
    autoplay?: boolean;
    mediaRef?: React.RefObject<HTMLMediaElement | null>;
    hasRealMedia?: boolean;
    onEnded?: () => void;
  },
): MediaClock {
  const { sceneKey, autoplay = true, mediaRef, hasRealMedia, onEnded } = opts;

  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const [ended, setEnded] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [captionsOn, setCaptionsOn] = useState(true);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const endedFiredRef = useRef(false);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  const duration = durationSec;

  // Reset everything when the scene changes.
  useEffect(() => {
    setCurrentTime(0);
    setEnded(false);
    endedFiredRef.current = false;
    setPlaying(autoplay);
    const el = mediaRef?.current;
    if (el) {
      try {
        el.currentTime = 0;
        if (autoplay) void el.play().catch(() => setPlaying(false));
      } catch {
        /* ignore */
      }
    }
  }, [sceneKey, autoplay, mediaRef]);

  // Simulated clock loop (only when there is no real media element).
  useEffect(() => {
    if (hasRealMedia) return;
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }
    lastTsRef.current = nowMs();
    const tick = () => {
      const t = nowMs();
      const dt = (t - lastTsRef.current) / 1000;
      lastTsRef.current = t;
      setCurrentTime((prev) => {
        const nextT = prev + dt;
        if (nextT >= duration) {
          setPlaying(false);
          setEnded(true);
          if (!endedFiredRef.current) {
            endedFiredRef.current = true;
            onEndedRef.current?.();
          }
          return duration;
        }
        return nextT;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, duration, hasRealMedia]);

  // Bind to a real media element when present.
  useEffect(() => {
    const el = mediaRef?.current;
    if (!el || !hasRealMedia) return;
    const onTime = () => setCurrentTime(el.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      setEnded(true);
      setPlaying(false);
      if (!endedFiredRef.current) {
        endedFiredRef.current = true;
        onEndedRef.current?.();
      }
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnd);
    };
  }, [mediaRef, hasRealMedia, sceneKey]);

  // Reflect mute/volume onto a real element.
  useEffect(() => {
    const el = mediaRef?.current;
    if (el) {
      el.muted = muted;
      el.volume = volume;
    }
  }, [muted, volume, mediaRef]);

  const play = useCallback(() => {
    setEnded(false);
    endedFiredRef.current = false;
    setPlaying(true);
    mediaRef?.current?.play().catch(() => setPlaying(false));
  }, [mediaRef]);

  const pause = useCallback(() => {
    setPlaying(false);
    mediaRef?.current?.pause();
  }, [mediaRef]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else play();
  }, [playing, play, pause]);

  const seek = useCallback(
    (t: number) => {
      const clamped = Math.max(0, Math.min(duration, t));
      setCurrentTime(clamped);
      setEnded(clamped >= duration);
      if (clamped < duration) endedFiredRef.current = false;
      const el = mediaRef?.current;
      if (el) el.currentTime = clamped;
    },
    [duration, mediaRef],
  );

  const replay = useCallback(() => {
    seek(0);
    play();
  }, [seek, play]);

  const setMuted = useCallback((m: boolean) => setMutedState(m), []);
  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (v > 0) setMutedState(false);
  }, []);
  const toggleCaptions = useCallback(() => setCaptionsOn((c) => !c), []);

  return {
    currentTime,
    duration,
    playing,
    ended,
    muted,
    volume,
    captionsOn,
    play,
    pause,
    toggle,
    seek,
    replay,
    setMuted,
    setVolume,
    toggleCaptions,
  };
}
