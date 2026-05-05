export function GithubIcon({ title, size = 18, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style={style}
    >
      <title>{title}</title>
      <path d="M12 .5C5.73.5.75 5.64.75 12c0 5.1 3.29 9.43 7.86 10.96.58.11.8-.26.8-.57v-2c-3.2.71-3.87-1.4-3.87-1.4-.53-1.37-1.3-1.73-1.3-1.73-1.06-.75.08-.74.08-.74 1.17.08 1.78 1.22 1.78 1.22 1.04 1.82 2.73 1.29 3.4.98.1-.77.41-1.29.74-1.58-2.55-.3-5.23-1.31-5.23-5.82 0-1.29.45-2.35 1.2-3.18-.12-.3-.52-1.52.11-3.17 0 0 .98-.32 3.2 1.22a10.8 10.8 0 0 1 2.92-.4c.99 0 1.99.14 2.92.4 2.22-1.54 3.2-1.22 3.2-1.22.63 1.65.23 2.87.11 3.17.75.83 1.2 1.89 1.2 3.18 0 4.52-2.68 5.52-5.24 5.81.42.37.8 1.1.8 2.22v3.29c0 .32.21.69.81.57A11.28 11.28 0 0 0 23.25 12C23.25 5.64 18.27.5 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon({ title, size = 18, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style={style}
    >
      <title>{title}</title>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

export function MailIcon({ title, size = 18, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style={style}
    >
      <title>{title}</title>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z" />
    </svg>
  );
}
