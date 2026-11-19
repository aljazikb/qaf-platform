import { useEffect, useState } from "react";
import { useApp } from "../AppContext.js";
import { LINKS } from "./Header.jsx";
import { cx } from "./ui.jsx";

const SHORT = { home: "الرئيسية", ideas: "الأفكار", checker: "الفحص", calendar: "التقويم" };

/** Floating nav at the bottom of the screen, shown only while neither the header nor the footer is in view. */
export default function BottomNav() {
  const { page } = useApp();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === header) setHeaderVisible(entry.isIntersecting);
        if (entry.target === footer) setFooterVisible(entry.isIntersecting);
      }
    });
    if (header) observer.observe(header);
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const show = !headerVisible && !footerVisible;

  return (
    <nav
      aria-label="تنقل سريع"
      aria-hidden={!show}
      inert={!show}
      className={cx(
        "fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 transition duration-300 ease-out-soft print:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[140%] opacity-0"
      )}
    >
      <ul className="flex gap-1 rounded-brand-sm border border-line bg-white/95 p-1.5 shadow-hover backdrop-blur-sm">
        {LINKS.map(([id, label]) => (
          <li key={id}>
            <a
              href={`#/${id}`}
              aria-current={page === id ? "page" : undefined}
              className={cx(
                "block rounded-brand-xs px-3 py-2 text-[13px] font-semibold whitespace-nowrap text-navy transition-colors hover:bg-mint-soft sm:px-4 sm:text-sm",
                page === id && "bg-green text-white hover:bg-green"
              )}
            >
              <span className="sm:hidden">{SHORT[id]}</span>
              <span className="hidden sm:inline">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
