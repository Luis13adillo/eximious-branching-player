"use client";

/**
 * useMediaClock
 * ============================================================================
 * One playback model for two cases:
 *   1. No final asset yet → a simulated clock advances currentTime to duration
 *      so the placeholder stage plays, scrubs, and captions in sync.
 *   2. A real <video>/<audio> element (a delivered .mp4, or hosted video) →
 *      the same API
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
  /**
   * The learner has intentionally started the lesson. False only before the
   * first play when the start gate is on (`requireStart`), which is the
   * template default. Drives the stage's Start control.
   */
  started: boolean;
  /** Real media is buffering / not yet ready to play (drives a loading state). */
  waiting: boolean;
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

/**
 * Hard guarantee that only ONE media source is ever audible: before the active
 * scene's element plays, pause every other <video>/<audio> in the document
 * (e.g. a previous scene's element mid-teardown, or a stray). Combined with the
 * pause-on-leave cleanup — which also stops elements already detached from the
 * DOM — this makes overlapping audio impossible across scene changes, retries,
 * and replays. Preload elements are already paused, so this is a no-op for them.
 */
function pauseOtherMedia(keep: HTMLMediaElement | null | undefined) {
  if (typeof document === "undefined") return;
  for (const m of Array.from(
    document.querySelectorAll<HTMLMediaElement>("video, audio"),
  )) {
    if (m !== keep && !m.paused) {
      try {
        m.pause();
      } catch {
        /* ignore */
      }
    }
  }
}

export function useMediaClock(
  durationSec: number,
  opts: {
    /** restart when this changes (scene id) */
    sceneKey: string;
    autoplay?: boolean;
    /**
     * THE START GATE — locked template default (`true`).
     * Nothing plays on initial load. The lesson waits on its opening frame
     * until the learner starts it, and that first play carries sound with it,
     * so video and audio begin together on one deliberate gesture. Once
     * started, `autoplay` governs scene-to-scene playback exactly as before, so
     * later segments continue without a second tap.
     * Pass `false` only for a deployment that genuinely must play unattended.
     */
    requireStart?: boolean;
    mediaRef?: React.RefObject<HTMLMediaElement | null>;
    hasRealMedia?: boolean;
    onEnded?: () => void;
  },
): MediaClock {
  const {
    sceneKey,
    autoplay = true,
    requireStart = true,
    mediaRef,
    hasRealMedia,
    onEnded,
  } = opts;

  const [currentTime, setCurrentTime] = useState(0);
  // THE START GATE.
  // Nothing plays until the learner asks for it: the lesson opens on its poster
  // frame behind a Start control, and the tap that starts it is the same
  // gesture that unlocks sound, so picture and audio begin together. From then
  // on `started` stays true for the rest of the run and scene-to-scene playback
  // is automatic again, so the learner is never asked to press play twice.
  const [started, setStarted] = useState(!requireStart);
  // Written only where the gate opens (`play()`), so effects can read it
  // without taking a dependency on it and restarting the scene.
  const startedRef = useRef(started);
  // Once started, every scene the lesson marks autoplay-able plays on entry.
  // Sound is on by then (the start gesture unlocked it), so a segment never
  // opens as a silent moving frame.
  const [playing, setPlaying] = useState(autoplay && !requireStart);
  const [ended, setEnded] = useState(false);
  // Start muted: browsers only allow unattended autoplay of muted video, and
  // the placeholder clips are silent anyway. The mute control still works for
  // real narrated footage dropped in later.
  const [muted, setMutedState] = useState(true);
  const [volume, setVolumeState] = useState(1);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [waiting, setWaiting] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const endedFiredRef = useRef(false);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  // Track the learner's current mute preference so a scene change can preserve
  // it (read via ref so the scene-change effect doesn't re-run on unmute).
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  // Whether sound has been unlocked yet. Scenes always autoplay muted; the
  // learner's first interaction anywhere (see the first-gesture effect below)
  // flips this to true and turns sound on for the rest of the lesson.
  const [unlocked, setUnlocked] = useState(false);
  const unlockedRef = useRef(false);
  unlockedRef.current = unlocked;
  // Read the current scene's autoplay preference from the first-gesture handler
  // without making that listener re-bind whenever it changes.
  const autoplayRef = useRef(autoplay);
  autoplayRef.current = autoplay;

  const duration = durationSec;

  // Reset everything when the scene changes.
  useEffect(() => {
    setCurrentTime(0);
    setEnded(false);
    endedFiredRef.current = false;
    // Autoplay every scene the lesson marks autoplay-able (a decision retry
    // re-entry is the one exception — the learner chooses again without the
    // question replaying), but ONLY after the learner has started the lesson.
    // Before that the gate holds every scene paused. `startedRef` is read, not
    // depended on, so opening the gate does not re-run this effect and restart
    // the scene — `play()` is what starts it.
    const doAutoplay = autoplay && startedRef.current;
    setPlaying(doAutoplay);
    const el = mediaRef?.current;
    if (el) {
      try {
        el.currentTime = 0;
        el.muted = mutedRef.current; // carry the mute preference across scenes
        if (doAutoplay) {
          pauseOtherMedia(el); // never two sources at once
          void el.play().catch(() => setPlaying(false));
        } else {
          el.pause();
        }
      } catch {
        /* ignore */
      }
    }
  }, [sceneKey, autoplay, mediaRef]);

  // Stop this scene's media when leaving it. A media element removed from the
  // DOM does NOT pause itself (HTML spec), so without this a video/audio track
  // keeps playing underneath the next scene. Capturing `el` in the closure means
  // we pause the exact element that belonged to this scene, even when the next
  // scene swaps <video>↔<audio>. This is the audio-cleanup guarantee.
  useEffect(() => {
    const el = mediaRef?.current;
    return () => {
      if (el) {
        try {
          el.pause();
          el.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
    };
  }, [sceneKey, mediaRef]);

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
    setWaiting(false);
    const onTime = () => {
      setCurrentTime(el.currentTime);
      setWaiting(false);
    };
    const onPlay = () => setPlaying(true);
    const onPlaying = () => setWaiting(false);
    const onCanPlay = () => setWaiting(false);
    const onWaiting = () => setWaiting(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      setEnded(true);
      setPlaying(false);
      setWaiting(false);
      if (!endedFiredRef.current) {
        endedFiredRef.current = true;
        onEndedRef.current?.();
      }
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("waiting", onWaiting);
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

  // Turn sound on at the learner's FIRST interaction anywhere on the page —
  // clicking "Continue", picking an answer, tapping the video, pressing a key,
  // anything. Once unlocked, every following scene plays with sound because the
  // persistent <video> keeps its user-activation. Uses {once:true} so it costs
  // nothing after the first interaction.
  //
  // It never STARTS playback while the start gate is closed: unmuting a paused
  // element is silent, so a learner who taps something else first (an exhibit
  // tab, Continue) does not accidentally trigger the lesson. Only Start does
  // that. Once started, this effect has already been spent — `play()` unlocks
  // sound itself — so the guarded branch matters only for a blocked autoplay.
  useEffect(() => {
    if (unlocked) return;
    const onFirstGesture = () => {
      unlockedRef.current = true;
      setUnlocked(true);
      mutedRef.current = false;
      setMutedState(false);
      const el = mediaRef?.current;
      if (el) {
        el.muted = false;
        // If autoplay was somehow blocked and the scene is sitting paused,
        // start it now that we have a real user gesture — but only once the
        // learner has opened the start gate.
        if (el.paused && autoplayRef.current && startedRef.current) {
          pauseOtherMedia(el);
          void el.play().catch(() => {});
        }
      }
    };
    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, [unlocked, mediaRef]);

  const play = useCallback(() => {
    setEnded(false);
    endedFiredRef.current = false;
    // The first play is the learner starting the lesson: it opens the start
    // gate for the rest of the run, so later segments continue on their own.
    if (!startedRef.current) {
      startedRef.current = true;
      setStarted(true);
    }
    // It is also the gesture that unlocks sound: turn audio on and remember it,
    // so every following scene plays with sound (no "tap for sound" step).
    // Setting `muted` BEFORE `el.play()` inside the gesture is what makes
    // picture and audio start together on iOS. Later plays respect the current
    // mute button state.
    if (!unlockedRef.current) {
      unlockedRef.current = true;
      setUnlocked(true);
      mutedRef.current = false;
      setMutedState(false);
    }
    setPlaying(true);
    const el = mediaRef?.current;
    if (el) el.muted = mutedRef.current;
    pauseOtherMedia(el); // never two sources at once (covers manual Replay too)
    el?.play().catch(() => setPlaying(false));
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
    started,
    waiting,
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
