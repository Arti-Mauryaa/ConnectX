import { useEffect, useRef, useState } from "react";

// Small click-to-open menu. `trigger` receives (open, toggle).
const Dropdown = ({ trigger, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="dropdown" ref={ref}>
      {trigger(open, () => setOpen((o) => !o))}
      {open && (
        <div className="menu" onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
