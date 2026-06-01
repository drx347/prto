import { useCallback, useEffect, useMemo, useRef } from "react";

const AUTO_ENTER_DELAY_MS = 4800;

const PALETTES = [
  {
    id: "midnight",
    label: "Midnight",
    bg: "#0b0c12",
    bg2: "#10121a",
    lav: "199, 166, 255",
    sky: "154, 223, 255",
    mint: "170, 255, 214",
    pink: "255, 183, 213",
  },
  {
    id: "lavender",
    label: "Lavender",
    bg: "#0d0c16",
    bg2: "#141327",
    lav: "212, 173, 255",
    sky: "174, 216, 255",
    mint: "191, 250, 237",
    pink: "255, 188, 233",
  },
  {
    id: "ocean",
    label: "Ocean",
    bg: "#061019",
    bg2: "#0c1f2a",
    lav: "111, 182, 255",
    sky: "96, 225, 255",
    mint: "93, 246, 214",
    pink: "166, 213, 255",
  },
  {
    id: "mint",
    label: "Mint",
    bg: "#071312",
    bg2: "#0b1f1b",
    lav: "143, 238, 201",
    sky: "133, 244, 225",
    mint: "102, 255, 198",
    pink: "195, 255, 226",
  },
  {
    id: "rose",
    label: "Rose",
    bg: "#160910",
    bg2: "#24101b",
    lav: "255, 160, 210",
    sky: "255, 188, 228",
    mint: "255, 221, 232",
    pink: "255, 128, 170",
  },
  {
    id: "sunset",
    label: "Sunset",
    bg: "#180c07",
    bg2: "#2b1610",
    lav: "255, 170, 120",
    sky: "255, 201, 132",
    mint: "255, 225, 168",
    pink: "255, 128, 115",
  },
  {
    id: "ember",
    label: "Ember",
    bg: "#170806",
    bg2: "#260f0b",
    lav: "255, 123, 94",
    sky: "255, 170, 90",
    mint: "255, 214, 140",
    pink: "255, 93, 93",
  },
  {
    id: "aurora",
    label: "Aurora",
    bg: "#07101c",
    bg2: "#11253b",
    lav: "87, 144, 255",
    sky: "74, 238, 255",
    mint: "130, 255, 207",
    pink: "134, 178, 255",
  },
  {
    id: "cobalt",
    label: "Cobalt",
    bg: "#080a18",
    bg2: "#11163a",
    lav: "103, 122, 255",
    sky: "129, 167, 255",
    mint: "120, 222, 255",
    pink: "148, 137, 255",
  },
  {
    id: "neon",
    label: "Neon",
    bg: "#060914",
    bg2: "#111424",
    lav: "169, 109, 255",
    sky: "94, 244, 255",
    mint: "122, 255, 144",
    pink: "255, 88, 149",
  },
  {
    id: "forest",
    label: "Forest",
    bg: "#06110c",
    bg2: "#0c2117",
    lav: "126, 214, 167",
    sky: "108, 236, 190",
    mint: "93, 255, 174",
    pink: "167, 255, 210",
  },
  {
    id: "ice",
    label: "Ice",
    bg: "#08111a",
    bg2: "#102434",
    lav: "168, 218, 255",
    sky: "126, 244, 255",
    mint: "199, 255, 250",
    pink: "196, 223, 255",
  },
  {
    id: "plum",
    label: "Plum",
    bg: "#120917",
    bg2: "#22112c",
    lav: "215, 132, 255",
    sky: "186, 156, 255",
    mint: "232, 194, 255",
    pink: "255, 140, 214",
  },
  {
    id: "gold",
    label: "Gold",
    bg: "#171108",
    bg2: "#2a1d0d",
    lav: "255, 198, 110",
    sky: "255, 224, 138",
    mint: "255, 241, 173",
    pink: "255, 171, 104",
  },
  {
    id: "berry",
    label: "Berry",
    bg: "#16070d",
    bg2: "#2b0d18",
    lav: "255, 116, 182",
    sky: "255, 156, 206",
    mint: "255, 205, 231",
    pink: "255, 84, 132",
  },
  {
    id: "steel",
    label: "Steel",
    bg: "#0b1018",
    bg2: "#182433",
    lav: "146, 169, 210",
    sky: "166, 202, 255",
    mint: "177, 229, 235",
    pink: "183, 169, 224",
  },
  {
    id: "peach",
    label: "Peach",
    bg: "#180d0a",
    bg2: "#2b1710",
    lav: "255, 170, 149",
    sky: "255, 201, 162",
    mint: "255, 228, 197",
    pink: "255, 144, 122",
  },
  {
    id: "storm",
    label: "Storm",
    bg: "#090c14",
    bg2: "#141a29",
    lav: "128, 139, 202",
    sky: "111, 183, 255",
    mint: "147, 216, 223",
    pink: "146, 153, 255",
  },
];

const PALETTE_SURFACES = {
  midnight: {
    panel: "rgba(233, 238, 255, 0.045)",
    panel2: "rgba(199, 166, 255, 0.08)",
    border: "rgba(198, 207, 255, 0.10)",
    border2: "rgba(170, 214, 255, 0.18)",
    accent3: "rgba(200, 208, 255, 0.12)",
    fxFlowA: "199, 166, 255",
    fxFlowB: "154, 223, 255",
    fxFlowC: "170, 255, 214",
    fxSparkA: "215, 226, 255",
    fxSparkB: "178, 201, 255",
  },
  lavender: {
    panel: "rgba(241, 230, 255, 0.05)",
    panel2: "rgba(212, 173, 255, 0.09)",
    border: "rgba(225, 206, 255, 0.11)",
    border2: "rgba(191, 214, 255, 0.19)",
    accent3: "rgba(226, 212, 255, 0.13)",
    fxFlowA: "212, 173, 255",
    fxFlowB: "174, 216, 255",
    fxFlowC: "191, 250, 237",
    fxSparkA: "245, 230, 255",
    fxSparkB: "214, 205, 255",
  },
  ocean: {
    panel: "rgba(183, 233, 255, 0.045)",
    panel2: "rgba(96, 225, 255, 0.09)",
    border: "rgba(127, 211, 255, 0.11)",
    border2: "rgba(93, 246, 214, 0.18)",
    accent3: "rgba(124, 214, 255, 0.12)",
    fxFlowA: "111, 182, 255",
    fxFlowB: "96, 225, 255",
    fxFlowC: "93, 246, 214",
    fxSparkA: "171, 228, 255",
    fxSparkB: "132, 239, 255",
  },
  mint: {
    panel: "rgba(185, 255, 233, 0.045)",
    panel2: "rgba(102, 255, 198, 0.085)",
    border: "rgba(141, 244, 214, 0.11)",
    border2: "rgba(133, 244, 225, 0.18)",
    accent3: "rgba(176, 255, 228, 0.12)",
    fxFlowA: "143, 238, 201",
    fxFlowB: "133, 244, 225",
    fxFlowC: "102, 255, 198",
    fxSparkA: "212, 255, 239",
    fxSparkB: "166, 255, 220",
  },
  rose: {
    panel: "rgba(255, 221, 239, 0.05)",
    panel2: "rgba(255, 160, 210, 0.09)",
    border: "rgba(255, 188, 228, 0.11)",
    border2: "rgba(255, 128, 170, 0.18)",
    accent3: "rgba(255, 215, 233, 0.13)",
    fxFlowA: "255, 160, 210",
    fxFlowB: "255, 188, 228",
    fxFlowC: "255, 221, 232",
    fxSparkA: "255, 228, 238",
    fxSparkB: "255, 184, 214",
  },
  sunset: {
    panel: "rgba(255, 223, 190, 0.05)",
    panel2: "rgba(255, 170, 120, 0.09)",
    border: "rgba(255, 201, 132, 0.11)",
    border2: "rgba(255, 225, 168, 0.18)",
    accent3: "rgba(255, 224, 188, 0.13)",
    fxFlowA: "255, 170, 120",
    fxFlowB: "255, 201, 132",
    fxFlowC: "255, 225, 168",
    fxSparkA: "255, 228, 192",
    fxSparkB: "255, 188, 130",
  },
  ember: {
    panel: "rgba(255, 214, 188, 0.05)",
    panel2: "rgba(255, 123, 94, 0.095)",
    border: "rgba(255, 170, 90, 0.11)",
    border2: "rgba(255, 93, 93, 0.18)",
    accent3: "rgba(255, 212, 184, 0.12)",
    fxFlowA: "255, 123, 94",
    fxFlowB: "255, 170, 90",
    fxFlowC: "255, 214, 140",
    fxSparkA: "255, 225, 188",
    fxSparkB: "255, 139, 106",
  },
  aurora: {
    panel: "rgba(197, 233, 255, 0.045)",
    panel2: "rgba(87, 144, 255, 0.09)",
    border: "rgba(130, 255, 207, 0.11)",
    border2: "rgba(74, 238, 255, 0.18)",
    accent3: "rgba(181, 226, 255, 0.12)",
    fxFlowA: "87, 144, 255",
    fxFlowB: "74, 238, 255",
    fxFlowC: "130, 255, 207",
    fxSparkA: "194, 236, 255",
    fxSparkB: "134, 178, 255",
  },
  cobalt: {
    panel: "rgba(198, 207, 255, 0.045)",
    panel2: "rgba(103, 122, 255, 0.09)",
    border: "rgba(129, 167, 255, 0.11)",
    border2: "rgba(148, 137, 255, 0.18)",
    accent3: "rgba(191, 197, 255, 0.12)",
    fxFlowA: "103, 122, 255",
    fxFlowB: "129, 167, 255",
    fxFlowC: "120, 222, 255",
    fxSparkA: "204, 212, 255",
    fxSparkB: "158, 168, 255",
  },
  neon: {
    panel: "rgba(224, 203, 255, 0.045)",
    panel2: "rgba(169, 109, 255, 0.1)",
    border: "rgba(94, 244, 255, 0.11)",
    border2: "rgba(255, 88, 149, 0.18)",
    accent3: "rgba(221, 204, 255, 0.13)",
    fxFlowA: "169, 109, 255",
    fxFlowB: "94, 244, 255",
    fxFlowC: "255, 88, 149",
    fxSparkA: "221, 255, 255",
    fxSparkB: "196, 147, 255",
  },
  forest: {
    panel: "rgba(205, 255, 226, 0.045)",
    panel2: "rgba(93, 255, 174, 0.085)",
    border: "rgba(126, 214, 167, 0.11)",
    border2: "rgba(108, 236, 190, 0.18)",
    accent3: "rgba(196, 255, 224, 0.12)",
    fxFlowA: "126, 214, 167",
    fxFlowB: "108, 236, 190",
    fxFlowC: "93, 255, 174",
    fxSparkA: "214, 255, 231",
    fxSparkB: "143, 226, 184",
  },
  ice: {
    panel: "rgba(223, 245, 255, 0.045)",
    panel2: "rgba(168, 218, 255, 0.08)",
    border: "rgba(126, 244, 255, 0.11)",
    border2: "rgba(199, 255, 250, 0.18)",
    accent3: "rgba(226, 246, 255, 0.12)",
    fxFlowA: "168, 218, 255",
    fxFlowB: "126, 244, 255",
    fxFlowC: "199, 255, 250",
    fxSparkA: "237, 250, 255",
    fxSparkB: "187, 226, 255",
  },
  plum: {
    panel: "rgba(241, 214, 255, 0.045)",
    panel2: "rgba(215, 132, 255, 0.09)",
    border: "rgba(186, 156, 255, 0.11)",
    border2: "rgba(255, 140, 214, 0.18)",
    accent3: "rgba(239, 215, 255, 0.12)",
    fxFlowA: "215, 132, 255",
    fxFlowB: "186, 156, 255",
    fxFlowC: "232, 194, 255",
    fxSparkA: "244, 223, 255",
    fxSparkB: "224, 162, 255",
  },
  gold: {
    panel: "rgba(255, 236, 196, 0.05)",
    panel2: "rgba(255, 198, 110, 0.09)",
    border: "rgba(255, 224, 138, 0.11)",
    border2: "rgba(255, 171, 104, 0.18)",
    accent3: "rgba(255, 236, 188, 0.13)",
    fxFlowA: "255, 198, 110",
    fxFlowB: "255, 224, 138",
    fxFlowC: "255, 241, 173",
    fxSparkA: "255, 243, 206",
    fxSparkB: "255, 202, 118",
  },
  berry: {
    panel: "rgba(255, 214, 236, 0.05)",
    panel2: "rgba(255, 116, 182, 0.095)",
    border: "rgba(255, 156, 206, 0.11)",
    border2: "rgba(255, 84, 132, 0.18)",
    accent3: "rgba(255, 214, 236, 0.13)",
    fxFlowA: "255, 116, 182",
    fxFlowB: "255, 156, 206",
    fxFlowC: "255, 205, 231",
    fxSparkA: "255, 227, 241",
    fxSparkB: "255, 133, 188",
  },
  steel: {
    panel: "rgba(214, 227, 245, 0.045)",
    panel2: "rgba(146, 169, 210, 0.08)",
    border: "rgba(166, 202, 255, 0.11)",
    border2: "rgba(183, 169, 224, 0.18)",
    accent3: "rgba(216, 225, 241, 0.12)",
    fxFlowA: "146, 169, 210",
    fxFlowB: "166, 202, 255",
    fxFlowC: "177, 229, 235",
    fxSparkA: "227, 235, 245",
    fxSparkB: "183, 197, 223",
  },
  peach: {
    panel: "rgba(255, 225, 210, 0.05)",
    panel2: "rgba(255, 170, 149, 0.09)",
    border: "rgba(255, 201, 162, 0.11)",
    border2: "rgba(255, 144, 122, 0.18)",
    accent3: "rgba(255, 227, 212, 0.13)",
    fxFlowA: "255, 170, 149",
    fxFlowB: "255, 201, 162",
    fxFlowC: "255, 228, 197",
    fxSparkA: "255, 236, 224",
    fxSparkB: "255, 181, 150",
  },
  storm: {
    panel: "rgba(208, 218, 245, 0.045)",
    panel2: "rgba(128, 139, 202, 0.09)",
    border: "rgba(111, 183, 255, 0.11)",
    border2: "rgba(146, 153, 255, 0.18)",
    accent3: "rgba(210, 220, 248, 0.12)",
    fxFlowA: "128, 139, 202",
    fxFlowB: "111, 183, 255",
    fxFlowC: "147, 216, 223",
    fxSparkA: "222, 230, 255",
    fxSparkB: "162, 172, 232",
  },
};

const MONOCHROME_THEME = {
  id: "monochrome",
  bg: "#050505",
  bg2: "#111111",
  lav: "232, 232, 232",
  sky: "255, 255, 255",
  mint: "172, 172, 172",
  pink: "210, 210, 210",
  surface: {
    panel: "rgba(255, 255, 255, 0.055)",
    panel2: "rgba(255, 255, 255, 0.082)",
    border: "rgba(255, 255, 255, 0.13)",
    border2: "rgba(255, 255, 255, 0.24)",
    accent3: "rgba(255, 255, 255, 0.12)",
    fxFlowA: "255, 255, 255",
    fxFlowB: "190, 190, 190",
    fxFlowC: "128, 128, 128",
    fxSparkA: "255, 255, 255",
    fxSparkB: "170, 170, 170",
  },
};

function applyBackgroundVars(palette = MONOCHROME_THEME) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const activePalette = palette.id === MONOCHROME_THEME.id ? palette : MONOCHROME_THEME;
  const surface = activePalette.surface ?? PALETTE_SURFACES[activePalette.id] ?? PALETTE_SURFACES.midnight;
  root.style.setProperty("--bg", activePalette.bg);
  root.style.setProperty("--bg2", activePalette.bg2);
  root.style.setProperty("--p-lav", activePalette.lav);
  root.style.setProperty("--p-sky", activePalette.sky);
  root.style.setProperty("--p-mint", activePalette.mint);
  root.style.setProperty("--p-pink", activePalette.pink);
  root.style.setProperty("--accent", "rgba(255, 255, 255, 0.96)");
  root.style.setProperty("--accent2", "rgba(214, 214, 214, 0.82)");
  root.style.setProperty("--premium-gold", "255, 255, 255");
  root.style.setProperty("--premium-red", "150, 150, 150");
  root.style.setProperty("--panel", surface.panel);
  root.style.setProperty("--panel2", surface.panel2);
  root.style.setProperty("--border", surface.border);
  root.style.setProperty("--border2", surface.border2);
  root.style.setProperty("--accent3", surface.accent3);
  root.style.setProperty("--fx-flow-a", surface.fxFlowA);
  root.style.setProperty("--fx-flow-b", surface.fxFlowB);
  root.style.setProperty("--fx-flow-c", surface.fxFlowC);
  root.style.setProperty("--fx-spark-a", surface.fxSparkA);
  root.style.setProperty("--fx-spark-b", surface.fxSparkB);
  root.dataset.palette = activePalette.id;
}

function WelcomeThemeScene() {
  return (
    <div className="welcomeThemeScene" aria-hidden="true">
      <div className="welcomeThemeGlow welcomeThemeGlowLeft" />
      <div className="welcomeThemeGlow welcomeThemeGlowRight" />
    </div>
  );
}

export default function WelcomeScreen({ entered = false, onEnter }) {
  const defaultPalette = useMemo(() => MONOCHROME_THEME, []);
  const didEnterRef = useRef(false);

  useEffect(() => {
    applyBackgroundVars(defaultPalette);
  }, [defaultPalette]);

  useEffect(() => {
    didEnterRef.current = entered;
  }, [entered]);

  const requestEnter = useCallback(() => {
    if (didEnterRef.current) return;
    didEnterRef.current = true;
    onEnter?.();
  }, [onEnter]);

  useEffect(() => {
    if (entered || typeof window === "undefined") return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const timer = window.setTimeout(
      requestEnter,
      reduceMotion ? 900 : AUTO_ENTER_DELAY_MS
    );

    const handleKeyDown = (event) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
        requestEnter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [entered, requestEnter]);

  return (
    <main
      className={`welcomeScreen${entered ? " isDismissed" : ""}`}
      aria-label="Welcome"
      aria-hidden={entered}
      inert={entered}
      onPointerDown={requestEnter}
    >
      <WelcomeThemeScene />
      <div className="container welcomeInner">
        <div className="welcomeLoader" aria-hidden="true">
          <span className="welcomeLoaderRing" />
          <span className="welcomeLoaderRing welcomeLoaderRingDelay" />
          <span className="welcomeLoaderCore" />
        </div>

        <p className="welcomeKicker">Faisal Riza Portfolio</p>

        <h1 className="welcomeTitle">
          <span className="welcomeTitleTop">Loading</span>
          <span className="welcomeTitleBottom welcomeAccent">Portfolio</span>
        </h1>

        <div
          className="welcomeActions welcomeAuto"
          style={{ "--welcome-auto-delay": `${AUTO_ENTER_DELAY_MS}ms` }}
        >
          <div className="welcomeProgressTrack" aria-hidden="true">
            <span className="welcomeProgressFill" />
          </div>
          <p className="welcomeStatus muted" aria-live="polite">
            Menyiapkan halaman dan musik...
          </p>
        </div>
      </div>
    </main>
  );
}
