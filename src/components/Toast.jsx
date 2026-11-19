import { useEffect, useState } from "react";
import { cx } from "./ui.jsx";

export default function Toast({ message, id }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!id) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(timer);
  }, [id]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cx(
        "pointer-events-none fixed bottom-[84px] left-5 z-[100] max-w-[calc(100%-40px)] rounded-[11px] bg-navy px-[18px] py-3 text-[13px] text-white transition duration-200 print:hidden",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      )}
    >
      {message}
    </div>
  );
}
