const modules = import.meta.glob("../album/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
});

const COVER_ALIASES = {
  "1989 DELUXE": ["Style", "Taylor Swift - Style"],
  "SPEAK NOW": ["Enchanted", "Taylor Swift - Enchanted"],
  "ANNA OF THE NORTH Lovers": [
    "Lovers",
    "Lovers - Anna of the north",
    "Anna of the north - Lovers",
  ],
};

function titleFromPath(path) {
  const filename = String(path).split("/").pop() ?? "Cover";
  return filename.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim() || "Cover";
}

export const albumCovers = Object.entries(modules)
  .map(([path, url]) => {
    const title = titleFromPath(path);
    return {
      id: path,
      url,
      title,
      aliases: COVER_ALIASES[title] ?? [],
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));
