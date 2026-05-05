const modules = import.meta.glob("../music/*.{mp3,ogg,wav,m4a}", {
  eager: true,
  import: "default",
});

const MUSIC_CACHE_VERSION = typeof __APP_BUILD_ID__ === "string" ? __APP_BUILD_ID__ : "dev";

function titleFromPath(path) {
  const filename = String(path).split("/").pop() ?? "Track";
  return filename.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim() || "Track";
}

function withVersion(url, version) {
  const src = String(url ?? "");
  if (!src || !version) return src;
  const joiner = src.includes("?") ? "&" : "?";
  return `${src}${joiner}v=${encodeURIComponent(version)}`;
}

export const musicTracks = Object.entries(modules)
  .map(([path, url]) => ({
    id: path,
    url: withVersion(url, MUSIC_CACHE_VERSION),
    title: titleFromPath(path),
  }))
  .sort((a, b) => a.title.localeCompare(b.title));
