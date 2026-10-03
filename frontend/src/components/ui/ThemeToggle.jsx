import { useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return (
    <button className="icon-btn" onClick={toggle} aria-label="Toggle theme" title="Toggle theme">
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default ThemeToggle;
