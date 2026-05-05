export default function Illustration() {
  return (
    <svg
      className="heroArt"
      viewBox="0 0 720 520"
      role="img"
      aria-label="Ilustrasi perangkat dan ikon teknologi"
    >
      <defs>
        <radialGradient id="haloGrad" cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="0.35" stopColor="rgba(103,232,249,0.18)" />
          <stop offset="0.65" stopColor="rgba(192,132,252,0.16)" />
          <stop offset="1" stopColor="rgba(239,68,68,0.08)" />
        </radialGradient>

        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.07)" />
        </linearGradient>

        <linearGradient id="neonGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="0.5" stopColor="var(--accent2)" />
          <stop offset="1" stopColor="var(--accent3)" />
        </linearGradient>

        <filter id="softGlow" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="9" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.55 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feOffset dy="10" in="b" result="o" />
          <feColorMatrix
            in="o"
            type="matrix"
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.55 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <mask id="shineMask">
          <rect x="0" y="0" width="720" height="520" fill="black" />
          <rect
            className="illuShine"
            x="-220"
            y="0"
            width="220"
            height="520"
            fill="white"
            opacity="0.9"
          />
        </mask>
      </defs>

      {/* Halo */}
      <g className="illuBlob" filter="url(#softGlow)">
        <ellipse cx="410" cy="285" rx="250" ry="190" fill="url(#haloGrad)" opacity="0.95" />
        <ellipse
          cx="360"
          cy="235"
          rx="150"
          ry="110"
          fill="rgba(255,255,255,0.06)"
          opacity="0.9"
        />
        <ellipse
          cx="480"
          cy="340"
          rx="190"
          ry="140"
          fill="rgba(0,0,0,0.16)"
          opacity="0.9"
        />
      </g>

      {/* Gears (background) */}
      <g opacity="0.9" filter="url(#cardShadow)">
        <g className="illuGear illuGear--big" transform="translate(522 132)">
          <path
            d="M92 40l-10-3c-2-6-5-12-9-17l6-9-12-12-9 6c-5-4-11-7-17-9L40-14H24l-3 10c-6 2-12 5-17 9l-9-6-12 12 6 9c-4 5-7 11-9 17l-10 3v16l10 3c2 6 5 12 9 17l-6 9 12 12 9-6c5 4 11 7 17 9l3 10h16l3-10c6-2 12-5 17-9l9 6 12-12-6-9c4-5 7-11 9-17l10-3V40z"
            fill="rgba(255,255,255,0.08)"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="2"
          />
          <circle
            cx="32"
            cy="48"
            r="16"
            fill="rgba(0,0,0,0.22)"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="2"
          />
        </g>

        <g className="illuGear illuGear--mid" transform="translate(585 252) scale(0.85)">
          <path
            d="M92 40l-10-3c-2-6-5-12-9-17l6-9-12-12-9 6c-5-4-11-7-17-9L40-14H24l-3 10c-6 2-12 5-17 9l-9-6-12 12 6 9c-4 5-7 11-9 17l-10 3v16l10 3c2 6 5 12 9 17l-6 9 12 12 9-6c5 4 11 7 17 9l3 10h16l3-10c6-2 12-5 17-9l9 6 12-12-6-9c4-5 7-11 9-17l10-3V40z"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
          />
          <circle
            cx="32"
            cy="48"
            r="16"
            fill="rgba(0,0,0,0.22)"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="2"
          />
        </g>
      </g>

      {/* Monitor */}
      <g className="illuMonitor" filter="url(#cardShadow)">
        <rect
          x="248"
          y="150"
          width="330"
          height="220"
          rx="28"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.16)"
        />
        <rect
          x="272"
          y="176"
          width="282"
          height="150"
          rx="18"
          fill="rgba(0,0,0,0.14)"
          stroke="rgba(255,255,255,0.12)"
        />

        {/* Code lines */}
        <g opacity="0.95">
          <rect x="296" y="200" width="90" height="10" rx="5" fill="var(--accent3)" opacity="0.88" />
          <rect x="296" y="220" width="160" height="9" rx="4.5" fill="rgba(255,255,255,0.26)" />
          <rect x="296" y="238" width="210" height="9" rx="4.5" fill="rgba(255,255,255,0.22)" />
          <rect x="296" y="256" width="130" height="9" rx="4.5" fill="var(--accent2)" opacity="0.78" />
          <rect x="296" y="274" width="190" height="9" rx="4.5" fill="rgba(255,255,255,0.22)" />
        </g>

        {/* Stand */}
        <rect
          x="370"
          y="382"
          width="90"
          height="14"
          rx="7"
          fill="rgba(255,255,255,0.10)"
          opacity="0.9"
        />
        <rect
          x="332"
          y="398"
          width="166"
          height="26"
          rx="13"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.12)"
        />
        {/* Screen shine */}
        <g mask="url(#shineMask)">
          <rect
            x="272"
            y="176"
            width="282"
            height="150"
            rx="18"
            fill="rgba(255,255,255,0.07)"
          />
        </g>
      </g>

      {/* Floating cards */}
      <g className="illuCard illuCardLeft" filter="url(#cardShadow)">
        <rect
          x="130"
          y="250"
          width="148"
          height="148"
          rx="22"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.14)"
        />
        <rect
          x="146"
          y="266"
          width="116"
          height="116"
          rx="18"
          fill="rgba(0,0,0,0.14)"
          opacity="0.65"
        />
        <path
          className="illuIcon"
          d="M176 336l-18-18 18-18m54 36 18-18-18-18"
          fill="none"
          stroke="url(#neonGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="164" y="360" width="78" height="8" rx="4" fill="rgba(255,255,255,0.45)" />
        <rect x="164" y="374" width="54" height="8" rx="4" fill="rgba(255,255,255,0.32)" />
      </g>

      <g className="illuCard illuCardRight" filter="url(#cardShadow)">
        <rect
          x="560"
          y="248"
          width="148"
          height="148"
          rx="22"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.14)"
        />
        <rect
          x="576"
          y="264"
          width="116"
          height="116"
          rx="18"
          fill="rgba(0,0,0,0.14)"
          opacity="0.65"
        />
        <path
          d="M636 300a28 28 0 1 0 28 28"
          fill="none"
          stroke="rgba(255,255,255,0.74)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M674 302l-16-16-16 16"
          fill="none"
          stroke="url(#neonGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="592" y="360" width="86" height="8" rx="4" fill="rgba(255,255,255,0.36)" />
      </g>

      {/* Phone + check */}
      <g filter="url(#cardShadow)" opacity="0.95">
        <g transform="translate(492 334) rotate(2)">
          <rect
            x="0"
            y="0"
            width="120"
            height="168"
            rx="26"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.14)"
          />
          <rect x="14" y="18" width="92" height="124" rx="18" fill="url(#glassGrad)" />
          <circle cx="60" cy="150" r="7" fill="rgba(255,255,255,0.16)" />
          <circle cx="60" cy="80" r="28" fill="rgba(0,0,0,0.16)" opacity="0.85" />
          <path
            d="M46 80l10 10 22-24"
            fill="none"
            stroke="url(#neonGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
