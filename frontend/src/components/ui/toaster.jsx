import { useEffect, useState } from "react";
import { listeners } from "./toast";

export const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = ({ add, remove }) =>
      setToasts((list) => (add ? [...list, add] : list.filter((t) => t.id !== remove)));
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <b>{t.title}</b>
          {t.description && <span>{t.description}</span>}
        </div>
      ))}
    </div>
  );
};
