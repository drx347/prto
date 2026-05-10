import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import WelcomeScreen from "./Pages/WelcomeScreen";
import { getPlatform, useUiVariant } from "./ui/device";
import MiniAudioPlayer from "./components/MiniAudioPlayer";
import { musicTracks } from "./content/music";

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 19V5m0 0-6 6m6-6 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NowPlayingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 7.5v9m4-11v13m4-9v5m4-7v9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function prefersReducedData() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-data: reduce)").matches ?? false;
}

function isLowPowerDevice() {
  if (typeof navigator === "undefined") return false;
  const saveData = navigator.connection?.saveData ?? false;
  const deviceMemory = navigator.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  return saveData || deviceMemory <= 4 || cores <= 4;
}

function shouldUseLiteEffects() {
  if (typeof window === "undefined") return false;
  const small = window.matchMedia?.("(max-width: 768px)").matches ?? false;
  const tabletTouch =
    window.matchMedia?.("(max-width: 1024px) and (pointer: coarse)").matches ?? false;
  return (
    small ||
    tabletTouch ||
    prefersReducedMotion() ||
    prefersReducedData() ||
    isLowPowerDevice()
  );
}

export default function App() {
  const liteFx = useMemo(() => shouldUseLiteEffects(), []);
  const uiVariant = useUiVariant();
  const platform = useMemo(() => getPlatform(), []);
  const isMobileUi = uiVariant === "mobile";
  const isTabletUi = uiVariant === "tablet";
  const [entered, setEntered] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [playerSnapshot, setPlayerSnapshot] = useState(null);
  const [nowPlayingToast, setNowPlayingToast] = useState({
    visible: false,
    title: "",
    detail: "",
  });
  const hideNowPlayingTimerRef = useRef(0);
  const lastAnnouncedTrackIdRef = useRef(null);

  const showNowPlayingToast = (title, detail) => {
    if (hideNowPlayingTimerRef.current) {
      window.clearTimeout(hideNowPlayingTimerRef.current);
    }

    setNowPlayingToast({
      visible: true,
      title,
      detail,
    });

    hideNowPlayingTimerRef.current = window.setTimeout(() => {
      setNowPlayingToast((prev) => ({
        ...prev,
        visible: false,
      }));
      hideNowPlayingTimerRef.current = 0;
    }, 4200);
  };

  useEffect(() => {
    if (isMobileUi) import("./ui/mobile/mobile.css");
    if (isTabletUi) import("./ui/tablet/tablet.css");
  }, [isMobileUi, isTabletUi]);

  useEffect(() => {
    return () => {
      if (hideNowPlayingTimerRef.current) {
        window.clearTimeout(hideNowPlayingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!entered) return;

    const onScroll = () => {
      const y =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setShowScrollTop(y > 260);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [entered]);

  useEffect(() => {
    if (!entered || !playerSnapshot?.track?.id) return;
    if (lastAnnouncedTrackIdRef.current === playerSnapshot.track.id) return;

    lastAnnouncedTrackIdRef.current = playerSnapshot.track.id;
    showNowPlayingToast(
      playerSnapshot.track.title,
      playerSnapshot.total ? `Track ${playerSnapshot.index + 1} of ${playerSnapshot.total}` : "Backsound update"
    );
  }, [entered, playerSnapshot]);

  return (
    <>
      <div className={`siteOverlay${liteFx ? " siteOverlay--lite" : ""}`} aria-hidden="true">
        <div className="siteOverlayLayer siteOverlayLayer--grid" />
        <div className="siteOverlayLayer siteOverlayLayer--dots" />
        <div className="siteOverlayLayer siteOverlayLayer--theme" />
        <div className="siteOverlayLayer siteOverlayLayer--glow" />
        <div className="siteOverlayLayer siteOverlayLayer--flow" />
      </div>

      <div
        id="top"
        className={[
          "app",
          liteFx ? "lowFx" : "",
          uiVariant === "mobile" ? "uiMobile" : uiVariant === "tablet" ? "uiTablet" : "uiDesktop",
          platform === "ios" ? "platformIOS" : platform === "android" ? "platformAndroid" : "",
          !entered ? "welcomeActive" : "",
        ].join(" ")}
      >
        <MiniAudioPlayer
          tracks={musicTracks}
          autoPlay
          onTrackChange={(track, meta) => {
            setPlayerSnapshot({
              track,
              index: meta?.index ?? 0,
              total: meta?.total ?? musicTracks.length,
            });
          }}
        />

        <div
          className={`nowPlayingToast${entered && nowPlayingToast.visible ? " isVisible" : ""}`}
          role="status"
          aria-live="polite"
          aria-hidden={!entered || !nowPlayingToast.visible}
        >
          <div className="nowPlayingToastKicker">
            <span className="nowPlayingToastIcon" aria-hidden="true">
              <NowPlayingIcon />
            </span>
            <span>Now Playing</span>
          </div>
          <p className="nowPlayingToastTitle" title={nowPlayingToast.title}>
            {nowPlayingToast.title}
          </p>
          <p className="nowPlayingToastDetail">{nowPlayingToast.detail}</p>
        </div>

        <WelcomeScreen
          entered={entered}
          onEnter={() => {
            setEntered(true);
            if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" });
          }}
        />

        {entered && (
          <>
            <Navbar />
            <div className="navSpacer" aria-hidden="true" />
            <Home />
            <Footer />
            <button
              type="button"
              className={`scrollTopBtn${showScrollTop ? " isVisible" : ""}`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Kembali ke atas"
              title="Kembali ke atas"
            >
              <ArrowUpIcon />
            </button>
          </>
        )}
      </div>
    </>
  );
}
