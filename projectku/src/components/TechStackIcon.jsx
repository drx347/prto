const techStackIconModules = import.meta.glob(
  "../assets/tech-stack/*.{png,svg,webp,avif,jpg,jpeg}",
  { eager: true, query: "?url", import: "default" }
);

function slugify(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function keyFromPath(path) {
  const normalized = String(path).replace(/\\/g, "/");
  const filename = normalized.split("/").pop() ?? "";
  const base = filename.replace(/\.[^.]+$/, "");
  return slugify(base);
}

const iconUrlByKey = Object.fromEntries(
  Object.entries(techStackIconModules).map(([path, url]) => {
    const resolvedUrl = typeof url === "string" ? url : url?.default;
    return [keyFromPath(path), resolvedUrl];
  })
);

const aliasByKey = {
  reactjs: "react",
  react: "reactjs",
  node: "nodejs",
  "node-js": "nodejs",
  "next-js": "nextjs",
  "three-js": "threejs",
  "tailwind-css": "tailwindcss",
  "material-ui": "mui",
  "framer-motion": "framer",
};

function resolveIconUrl({ label, iconKey }) {
  const baseKey = slugify(iconKey || label);
  const compactKey = baseKey.replace(/-/g, "");
  const aliasKey = aliasByKey[baseKey];
  const aliasCompactKey = aliasKey ? String(aliasKey).replace(/-/g, "") : null;

  const candidates = [
    baseKey,
    compactKey,
    aliasKey,
    aliasCompactKey,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const direct = iconUrlByKey[candidate];
    if (direct) return direct;
    const slugCandidate = slugify(candidate);
    const slugMatch = iconUrlByKey[slugCandidate];
    if (slugMatch) return slugMatch;
  }

  return null;
}

export default function TechStackIcon({
  label,
  iconKey,
  className = "",
  imgClassName = "",
  size = 72,
  title,
  children,
  ...props
}) {
  const src = resolveIconUrl({ label, iconKey });

  if (!src) return children ?? null;

  return (
    <img
      className={[className, imgClassName].filter(Boolean).join(" ")}
      src={src}
      alt={label}
      title={title ?? label}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      draggable={false}
      {...props}
    />
  );
}
