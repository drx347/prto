import { useEffect, useMemo, useRef, useState } from "react";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function Reveal({
  children,
  className,
  style,
  delayMs = 0,
  threshold = 0.18,
  rootMargin = "0px 0px -10% 0px",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  const mergedStyle = useMemo(() => {
    return { ...style, ["--d"]: `${delayMs}ms` };
  }, [style, delayMs]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setVisible(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={["reveal", visible ? "isVisible" : "", className ?? ""].join(
        " "
      )}
      style={mergedStyle}
    >
      {children}
    </div>
  );
}
