import { useEffect, useMemo, useRef, useState } from "react";

const navItems = [
  { href: "#home", label: "Home", id: "home" },
  { href: "#about", label: "About", id: "about" },
  { href: "#portfolio", label: "Portfolio", id: "portfolio" },
  { href: "#contact", label: "Contact", id: "contact" },
];

function getHashId() {
  const hash = window.location.hash.replace("#", "");
  if (!hash) return "home";
  if (hash === "top") return "home";
  return hash;
}

export default function Navbar({ endSlot = null }) {
  const sectionIds = useMemo(() => navItems.map((n) => n.id), []);
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(hidden);

  useEffect(() => {
    hiddenRef.current = hidden;
  }, [hidden]);

  useEffect(() => {
    const setScrollbarWidth = () => {
      const raw = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      // Opera GX / Chromium overlay scrollbars often report 0px; keep a safe gutter.
      const sbw = raw === 0 ? 17 : raw;
      document.documentElement.style.setProperty("--sbw", `${sbw}px`);
    };

    setScrollbarWidth();
    const rafId = window.requestAnimationFrame(setScrollbarWidth);

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => setScrollbarWidth());
      ro.observe(document.documentElement);
      ro.observe(document.body);
    }

    window.addEventListener("resize", setScrollbarWidth);
    window.addEventListener("orientationchange", setScrollbarWidth);
    return () => {
      window.cancelAnimationFrame(rafId);
      ro?.disconnect?.();
      window.removeEventListener("resize", setScrollbarWidth);
      window.removeEventListener("orientationchange", setScrollbarWidth);
    };
  }, []);

  useEffect(() => {
    setActive(getHashId());

    const onHash = () => {
      setActive(getHashId());
      setHidden(false);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    let rafId = 0;
    const defaultScrollEl = () => document.scrollingElement ?? document.documentElement;
    const scrollElRef = { current: defaultScrollEl() };

    const readScrollY = () => {
      const el = scrollElRef.current;
      if (!el || el === document.documentElement || el === document.body) {
        const scrollingEl = document.scrollingElement;
        return (
          window.scrollY ||
          scrollingEl?.scrollTop ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0
        );
      }
      return el.scrollTop ?? 0;
    };

    let lastY = Math.max(0, readScrollY());
    let lastToggleAt = 0;
    const minDelta = 4;
    const hideAfterY = 120;
    const settleMs = 180;

    const onScroll = (ev) => {
      if (rafId) return;

      const target = ev?.target;
      if (target instanceof Element) {
        if (target === document.documentElement || target === document.body) {
          scrollElRef.current = defaultScrollEl();
        } else if (target.scrollHeight > target.clientHeight) {
          scrollElRef.current = target;
        }
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const y = Math.max(0, readScrollY());
        if (!Number.isFinite(y)) return;
        const dy = y - lastY;
        const now = performance.now();

        if (y < 24) {
          if (hiddenRef.current) setHidden(false);
          lastY = y;
          return;
        }

        if (Math.abs(dy) < minDelta) {
          lastY = y;
          return;
        }

        const scrollingDown = dy > 0;
        const canToggle = now - lastToggleAt >= settleMs;

        if (scrollingDown) {
          if (y > hideAfterY && !hiddenRef.current && canToggle) {
            setHidden(true);
            lastToggleAt = now;
          }
        } else {
          if (hiddenRef.current && canToggle) {
            setHidden(false);
            lastToggleAt = now;
          }
        }

        lastY = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    const entryById = new Map();
    const pickActive = () => {
      const values = Array.from(entryById.values()).filter((e) => e.isIntersecting);
      if (!values.length) return;
      const targetY = window.innerHeight * 0.33;
      const best = values
        .map((e) => ({ id: e.target.id, dist: Math.abs(e.boundingClientRect.top - targetY) }))
        .sort((a, b) => a.dist - b.dist)[0];
      if (best?.id) setActive(best.id);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => entryById.set(e.target.id, e));
        pickActive();
      },
      { rootMargin: "-33% 0px -55% 0px", threshold: [0, 0.1, 0.2, 0.35] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <header className={["navV2", hidden ? "navV2--hidden" : ""].join(" ")}>
      <div className="container navV2Inner">
        <nav className="navV2Links" aria-label="Navigasi">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                className={["navV2Link", isActive ? "isActive" : ""].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        {endSlot ? <div className="navV2End">{endSlot}</div> : null}
      </div>
    </header>
  );
}
