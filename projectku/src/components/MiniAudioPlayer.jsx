import { forwardRef, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "portfolio:player";

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 7v10l10-5-10-5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 6h4v12H7V6Zm6 0h4v12h-4V6Z" fill="currentColor" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7v10l8-5-8-5Zm10 0h2v10h-2V7Z" fill="currentColor" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 7v10l-8-5 8-5ZM5 7h2v10H5V7Z" fill="currentColor" />
    </svg>
  );
}

function MuteIcon({ muted }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 10v4h4l5 4V6L8 10H4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      {muted ? (
        <path
          d="M16 10l5 5m0-5-5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M16.5 9.5c1.4 1.4 1.4 3.6 0 5m2.6-7.6c2.8 2.8 2.8 7.4 0 10.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function MusicNoteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10 18.2c0 1.7-1.5 3-3.3 3S3.5 19.9 3.5 18.2s1.5-3 3.2-3c.6 0 1.1.1 1.6.3V6.6c0-.6.4-1.1 1-1.3l9-2.4c.8-.2 1.7.4 1.7 1.3v12.7c0 1.7-1.5 3-3.3 3s-3.2-1.3-3.2-3 1.4-3 3.2-3c.6 0 1.1.1 1.6.3V6.3l-7.3 2v9.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function normalizeKey(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/g, "");
}

function coverKeys(cover) {
  return [cover?.title, ...(Array.isArray(cover?.aliases) ? cover.aliases : [])]
    .map((value) => normalizeKey(value))
    .filter(Boolean);
}

const MiniAudioPlayer = forwardRef(function MiniAudioPlayer(
  { tracks = [], hidden = false, variant = "ui", autoPlay = false, onTrackChange },
  ref
) {
  const audioRef = useRef(null);
  const onTrackChangeRef = useRef(onTrackChange);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [covers, setCovers] = useState([]);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const attemptedAutoplayRef = useRef(false);
  const volumeDockRef = useRef(null);
  const volumePanelId = useId();

  const hasTracks = tracks.length > 0;
  const track = hasTracks ? tracks[Math.max(0, Math.min(index, tracks.length - 1))] : null;

  useEffect(() => {
    onTrackChangeRef.current = onTrackChange;
  }, [onTrackChange]);

  useEffect(() => {
    let alive = true;
    import("../content/album")
      .then((mod) => {
        if (!alive) return;
        setCovers(Array.isArray(mod?.albumCovers) ? mod.albumCovers : []);
      })
      .catch(() => {
        if (!alive) return;
        setCovers([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (Number.isFinite(saved?.index)) setIndex(Math.max(0, Math.min(saved.index, tracks.length - 1)));
      if (typeof saved?.muted === "boolean") setMuted(saved.muted);
      if (Number.isFinite(saved?.volume)) setVolume(clamp01(saved.volume));
    } catch {
      // ignore
    }
  }, [tracks.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ index, muted, volume: clamp01(volume) })
      );
    } catch {
      // ignore
    }
  }, [index, muted, volume]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = muted;
    el.volume = clamp01(volume);
  }, [muted, volume]);

  useEffect(() => {
    if (!volumeOpen) return;

    const onPointerDown = (event) => {
      if (volumeDockRef.current?.contains(event.target)) return;
      setVolumeOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") setVolumeOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [volumeOpen]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onLoaded = () => setDuration(el.duration || 0);
    const onTime = () => {
      if (seeking) return;
      setCurrentTime(el.currentTime || 0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      if (!tracks.length) return;
      setIndex((i) => (i + 1) % tracks.length);
    };
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [seeking, tracks.length]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!track) return;

    el.src = track.url;
    setDuration(0);
    setCurrentTime(0);
    el.load();
    if (playing) {
      el.play().catch(() => {
        setPlaying(false);
      });
    }
  }, [track?.url]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!autoPlay) return;
    if (attemptedAutoplayRef.current) return;
    const el = audioRef.current;
    if (!el) return;
    if (!track) return;

    attemptedAutoplayRef.current = true;
    el.play().catch(() => {
      // Autoplay is often blocked; we'll retry on first user gesture.
    });
  }, [autoPlay, track?.url]);

  const title = useMemo(() => track?.title ?? "No music", [track?.title]);
  const compactIsMuted = muted || volume <= 0.01;
  const compactVolumeValue = compactIsMuted ? 0 : clamp01(volume);
  const compactVolumePct = hasTracks ? `${Math.round(compactVolumeValue * 100)}%` : "--";
  const compactTrackMeta = useMemo(() => {
    if (!hasTracks) return "No track loaded";
    if (tracks.length <= 1) return "1 track loaded";
    return `Track ${index + 1} of ${tracks.length}`;
  }, [hasTracks, index, tracks.length]);
  const compactButtonLabel = useMemo(() => {
    if (!hasTracks) return "Audio";
    if (compactIsMuted) return "Off";
    return compactVolumePct;
  }, [compactIsMuted, compactVolumePct, hasTracks]);
  const coverUrl = useMemo(() => {
    if (!covers.length) return null;
    const key = normalizeKey(track?.title);
    if (!key) return covers[0]?.url ?? null;

    const exact = covers.find((c) => coverKeys(c).includes(key));
    if (exact?.url) return exact.url;

    const fuzzy = covers.find((c) => {
      return coverKeys(c).some((ck) => ck.includes(key) || key.includes(ck));
    });
    return fuzzy?.url ?? covers[0]?.url ?? null;
  }, [covers, track?.title]);
  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const volumePct = `${Math.round(clamp01(volume) * 100)}%`;
  const progressPct = `${Math.round(progress * 100)}%`;

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || !track) return;
    if (el.paused) {
      el.play().catch(() => {});
      return;
    }
    el.pause();
  };

  const prev = () => {
    if (!tracks.length) return;
    setIndex((i) => (i - 1 + tracks.length) % tracks.length);
  };

  const next = () => {
    if (!tracks.length) return;
    setIndex((i) => (i + 1) % tracks.length);
  };

  const onSeek = (value) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const t = clamp01(value) * duration;
    el.currentTime = t;
    setCurrentTime(t);
  };

  const playFromGesture = () => {
    const el = audioRef.current;
    if (!el || !track) return false;
    el.muted = muted;
    el.volume = clamp01(volume);
    el.play().catch(() => {});
    return true;
  };

  useEffect(() => {
    if (!autoPlay) return;
    if (playing) return;

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
    toggle: () => togglePlay(),
    next,
    prev,
  }));

  if (variant === "audioOnly") {
    return (
      <div style={{ display: "none" }} aria-hidden="true">
        <audio ref={audioRef} preload="metadata" />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        ref={volumeDockRef}
        className={`miniAudioDock${volumeOpen ? " isOpen" : ""}${compactIsMuted ? " isMuted" : ""}`}
        aria-label="Backsound volume"
      >
        <audio ref={audioRef} preload="metadata" />
        <button
          type="button"
          className="miniAudioDockBtn"
          onClick={() => setVolumeOpen((open) => !open)}
          aria-label={volumeOpen ? "Tutup pengaturan volume" : "Buka pengaturan volume"}
          aria-expanded={volumeOpen}
          aria-controls={volumePanelId}
          title="Atur volume backsound"
          disabled={!hasTracks}
        >
          <span
            className={`miniAudioDockGlyph${playing ? " isPlaying" : ""}${compactIsMuted ? " isMuted" : ""}`}
            aria-hidden="true"
          >
            <MuteIcon muted={compactIsMuted} />
          </span>
          <span className="miniAudioDockCopy">
            <span className="miniAudioDockMeta">{compactButtonLabel}</span>
          </span>
          <span
            className={`miniAudioDockIndicator${playing ? " isActive" : ""}${compactIsMuted ? " isMuted" : ""}`}
            aria-hidden="true"
          />
        </button>
        <div
          id={volumePanelId}
          className={`miniAudioDockPopover${volumeOpen ? " isOpen" : ""}`}
          aria-label="Volume backsound"
          aria-hidden={!volumeOpen}
        >
          <div className="miniAudioDockHeader">
            <div className="miniAudioDockHeaderText">
              <p className="miniAudioDockEyebrow">Audio</p>
              <p className="miniAudioDockTrack" title={title}>
                {title}
              </p>
              <p className="miniAudioDockTrackMeta">{compactTrackMeta}</p>
            </div>
            <span className="miniAudioDockValue">{compactButtonLabel}</span>
          </div>
          <div className="miniAudioDockSliderRow">
            <span className="miniAudioDockSliderIcon" aria-hidden="true">
              <MuteIcon muted={compactIsMuted} />
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={compactIsMuted ? 0 : volume}
              onChange={(e) => {
                const nextVolume = Number(e.target.value);
                setMuted(false);
                setVolume(nextVolume);
              }}
              aria-label="Volume"
              disabled={!hasTracks}
              style={{ "--pct": volumePct }}
            />
          </div>
          <div className="miniAudioDockFooter">
            <button
              type="button"
              className="miniAudioDockMuteChip"
              onClick={(event) => {
                event.stopPropagation();
                setMuted((value) => !value);
              }}
              disabled={!hasTracks}
            >
              {compactIsMuted ? "Unmute" : "Mute"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`miniAudioPlayer${hidden ? " isHidden" : ""}`}
      aria-label="Mini audio player"
    >
      <audio ref={audioRef} preload="metadata" />

      <div className="miniAudioPlayerTop">
        <div className="miniAudioPlayerCover" aria-hidden="true">
          {coverUrl ? (
            <img className="miniAudioPlayerCoverImg" src={coverUrl} alt="" loading="lazy" />
          ) : (
            <span className="miniAudioPlayerCoverFallback" aria-hidden="true">
              <MusicNoteIcon />
            </span>
          )}
        </div>
        <div className="miniAudioPlayerTitleWrap">
          <p className="miniAudioPlayerTitle" title={title}>
            {title}
          </p>
          <p className="miniAudioPlayerMeta muted">
            {hasTracks ? `Track ${index + 1} / ${tracks.length}` : "No tracks"}
          </p>
        </div>
        <div className="miniAudioPlayerSound" aria-label="Sound controls">
          <button
            type="button"
            className="miniAudioPlayerBtn"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute" : "Mute"}
            disabled={!hasTracks}
          >
            <MuteIcon muted={muted} />
          </button>
          <div className="miniAudioPlayerVolPopover" aria-label="Volume">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              disabled={!hasTracks}
              style={{ "--pct": volumePct }}
            />
          </div>
        </div>
      </div>

      <div className="miniAudioPlayerControls">
        <button
          type="button"
          className="miniAudioPlayerBtn"
          onClick={prev}
          aria-label="Previous track"
          disabled={!hasTracks}
        >
          <PrevIcon />
        </button>
        <button
          type="button"
          className="miniAudioPlayerBtn miniAudioPlayerBtnPrimary"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          disabled={!hasTracks}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          type="button"
          className="miniAudioPlayerBtn"
          onClick={next}
          aria-label="Next track"
          disabled={!hasTracks}
        >
          <NextIcon />
        </button>
      </div>

      <div className="miniAudioPlayerProgress" aria-label="Progress">
        <span className="miniAudioPlayerTime">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress}
          onMouseDown={() => setSeeking(true)}
          onTouchStart={() => setSeeking(true)}
          onChange={(e) => onSeek(Number(e.target.value))}
          onMouseUp={() => setSeeking(false)}
          onTouchEnd={() => setSeeking(false)}
          aria-label="Seek"
          disabled={!hasTracks || duration <= 0}
          style={{ "--pct": progressPct }}
        />
        <span className="miniAudioPlayerTime">{formatTime(duration)}</span>
      </div>
    </div>
  );
});

export default MiniAudioPlayer;
