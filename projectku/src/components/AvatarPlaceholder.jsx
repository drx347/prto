import { useState } from "react";

function getInitials(label) {
  const safe = String(label || "")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .trim();
  const parts = safe.split(/\s+/).filter(Boolean);
  if (!parts.length) return "—";
  return parts
    .slice(-2)
    .map((p) => p.slice(0, 1))
    .join("")
    .toUpperCase();
}

export default function AvatarPlaceholder({
  src = "/fotoprofil.png",
  alt = "Profile photo",
} = {}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const initials = getInitials(alt);

  return (
    <div
      className={`avatar${showImage ? " avatarHasImage" : ""}`}
      aria-label={showImage ? alt : "Photo not set"}
    >
      {showImage ? (
        <img
          className="avatarImg"
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <div className="avatarInner" aria-hidden="true" />
          <div className="avatarInitials" aria-hidden="true">
            {initials}
          </div>
        </>
      )}
    </div>
  );
}
