import { useEffect, useMemo, useState } from "react";

const storageKey = "portfolio_theme";

function getSystemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

export default function ThemeToggle() {
  const initialTheme = useMemo(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") return saved;
    return getSystemTheme();
  }, []);

  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme]);

  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mql) return;

    const handler = () => {
      const saved = localStorage.getItem(storageKey);
      if (saved !== "light" && saved !== "dark") {
        setTheme(getSystemTheme());
      }
    };

    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className="btn btnGhost"
      onClick={() => setTheme(next)}
      aria-label={`Ganti tema ke ${next}`}
      title={`Ganti tema ke ${next}`}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
