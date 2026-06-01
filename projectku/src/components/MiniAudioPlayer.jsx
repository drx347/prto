import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const STORAGE_KEY = "portfolio:player";
const MIN_VOLUME = 0.15;
const MAX_VOLUME = 0.25;
const DEFAULT_VOLUME = 0.2;

function clampMusicVolume(n) {
  if (!Number.isFinite(n)) return DEFAULT_VOLUME;
  return Math.max(MIN_VOLUME, Math.min(MAX_VOLUME, n));
}

const MiniAudioPlayer = forwardRef(function MiniAudioPlayer(
  { tracks = [], autoPlay = false, onTrackChange },
  ref
) {
  const audioRef = useRef(null);
  const onTrackChangeRef = useRef(onTrackChange);
  const attemptedAutoplayRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  const hasTracks = tracks.length > 0;
  const track = hasTracks ? tracks[Math.max(0, Math.min(index, tracks.length - 1))] : null;

  useEffect(() => {
    onTrackChangeRef.current = onTrackChange;
  }, [onTrackChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
      if (Number.isFinite(saved?.index)) {
        setIndex(Math.max(0, Math.min(saved.index, tracks.length - 1)));
      }
      if (Number.isFinite(saved?.volume)) {
        setVolume(clampMusicVolume(saved.volume));
      }
    } catch {
      // Ignore invalid localStorage data.
    }
  }, [tracks.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ index, muted: false, volume: clampMusicVolume(volume) })
      );
    } catch {
      // Ignore storage failures.
    }
  }, [index, volume]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.muted = false;
    el.volume = clampMusicVolume(volume);
  }, [volume]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !track) return;

    el.src = track.url;
    el.load();
    if (playing) {
      el.play().catch(() => setPlaying(false));
    }
  }, [track?.url]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      if (!tracks.length) return;
      setIndex((i) => (i + 1) % tracks.length);
    };

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [tracks.length]);

  const playFromGesture = ({ mutedFallback = false } = {}) => {
    const el = audioRef.current;
    if (!el || !track) return false;

    el.muted = false;
    el.volume = clampMusicVolume(volume);
    const playAttempt = el.play();

    if (playAttempt?.catch) {
      playAttempt.catch(() => {
        if (!mutedFallback) {
          setPlaying(false);
          return;
        }

        el.muted = true;
        el.volume = clampMusicVolume(volume);
        el.play()
          .then(() => {
            window.setTimeout(() => {
              el.muted = false;
              el.volume = clampMusicVolume(volume);
            }, 120);
          })
          .catch(() => setPlaying(false));
      });
    }

    return true;
  };

  useEffect(() => {
    if (!autoPlay) return;
    if (attemptedAutoplayRef.current) return;
    if (!track) return;

    attemptedAutoplayRef.current = true;
    playFromGesture();
  }, [autoPlay, track?.url]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!autoPlay || playing) return;

    const onFirstGesture = () => {
      playFromGesture();
    };

    window.addEventListener("pointerdown", onFirstGesture, { once: true, passive: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, [autoPlay, playing]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!hasTracks || !track) return;

    onTrackChangeRef.current?.(track, {
      index,
      total: tracks.length,
    });
  }, [hasTracks, index, track, tracks.length]);

  useImperativeHandle(ref, () => ({
    playFromGesture,
    pause: () => audioRef.current?.pause(),
  }));

  return (
    <div hidden aria-hidden="true">
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
});

export default MiniAudioPlayer;
