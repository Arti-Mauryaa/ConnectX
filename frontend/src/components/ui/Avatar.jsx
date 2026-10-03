import { useState } from "react";

const COLORS = ["#2f7d6b", "#b5651d", "#4a6fa5", "#8a5a83", "#a8483e", "#5d7a3a", "#3d7a8a", "#8c6d1f"];

const hash = (str = "") => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const initialsOf = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

// Shows the profile picture, or coloured initials when there is no usable picture.
const Avatar = ({ name, src, size = 40 }) => {
  const [failed, setFailed] = useState(false);
  const isPlaceholder = !src || src.includes("anonymous-avatar-icon");
  const showImage = !isPlaceholder && !failed;

  return (
    <span
      className="avatar"
      title={name}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: showImage ? "transparent" : COLORS[hash(name) % COLORS.length],
      }}
    >
      {showImage ? <img src={src} alt={name} onError={() => setFailed(true)} /> : initialsOf(name)}
    </span>
  );
};

export default Avatar;
