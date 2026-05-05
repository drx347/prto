import { useEffect, useMemo, useState } from "react";

export function isIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const iOSLike = /iPad|iPhone|iPod/.test(ua) || /iPad|iPhone|iPod/.test(platform);
  const iPadOS13Up =
    platform === "MacIntel" && (navigator.maxTouchPoints ?? 0) > 1 && /Safari/.test(ua);
  return iOSLike || iPadOS13Up;
}

export function isIPad() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const classic = /iPad/.test(ua) || /iPad/.test(platform);
  const iPadOS13Up =
    platform === "MacIntel" && (navigator.maxTouchPoints ?? 0) > 1 && /Safari/.test(ua);
  return classic || iPadOS13Up;
}

export function isAndroid() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent || "");
}

export function getPlatform() {
  if (isIOS()) return "ios";
  if (isAndroid()) return "android";
  return "other";
}

export function isTouchDevice() {
  if (typeof window === "undefined") return false;
  const touch =
    navigator.maxTouchPoints > 0 ||
    "ontouchstart" in window ||
    (window.matchMedia?.("(pointer: coarse)").matches ?? false);
  return Boolean(touch);
}

export function isSmallScreen() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(max-width: 768px)").matches ?? false;
}

export function isTabletScreen() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(max-width: 1024px)").matches ?? false;
}

export function pickUiVariant() {
  if (isSmallScreen() && !isIPad()) return "mobile";
  if (isTabletScreen() && isTouchDevice()) return "tablet";
  return "desktop";
}

export function useUiVariant() {
  const initial = useMemo(() => {
    if (typeof window === "undefined") return "desktop";
    return pickUiVariant();
  }, []);

  const [variant, setVariant] = useState(initial);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setVariant(pickUiVariant());

    update();

    const mqlMobile = window.matchMedia?.("(max-width: 768px)");
    const mqlTablet = window.matchMedia?.("(max-width: 1024px)");

    if (mqlMobile?.addEventListener) mqlMobile.addEventListener("change", update);
    else if (mqlMobile?.addListener) mqlMobile.addListener(update);

    if (mqlTablet?.addEventListener) mqlTablet.addEventListener("change", update);
    else if (mqlTablet?.addListener) mqlTablet.addListener(update);

    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, { passive: true });

    return () => {
      if (mqlMobile?.removeEventListener) mqlMobile.removeEventListener("change", update);
      else if (mqlMobile?.removeListener) mqlMobile.removeListener(update);
      if (mqlTablet?.removeEventListener) mqlTablet.removeEventListener("change", update);
      else if (mqlTablet?.removeListener) mqlTablet.removeListener(update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return variant;
}
