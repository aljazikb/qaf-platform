import { useEffect, useRef, useState } from "react";
import { useApp } from "../AppContext.js";
import { cx } from "./ui.jsx";

export const LINKS = [
  ["home", "الرئيسية"],
  ["ideas", "اكتشاف الأفكار"],
  ["checker", "فحص المحتوى"],
  ["calendar", "التقويم الذكي"],
];

const linkClass = (active) =>
  cx(
    "block rounded-brand-xs px-3.5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-mint-soft",
    active && "bg-green text-white hover:bg-green"
  );

/** The full-colour logo (transparent PNG). */
export function LogoTile({ className }) {
  return <img src="assets/images/qaf-logo.png" alt="" className={cx("block h-12 w-auto", className)} />;
}

export default function Header() {
  const { page, signedIn, account } = useApp();
  const initial = account?.name?.trim()?.[0] || "؟";
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  // Close the mobile menu on navigation, on Escape, and when the viewport grows to desktop.
  useEffect(() => setOpen(false), [page]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 900px)");
    const onMq = (e) => e.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <header id="site-header" className="relative z-50 mx-auto max-w-[1360px] px-[clamp(12px,3vw,32px)] pt-3 print:hidden">
      <div className="rounded-brand-sm border border-line bg-white text-navy shadow-card sm:rounded-brand">
        <div className="flex min-h-[72px] items-center gap-x-6 gap-y-3 px-[clamp(14px,3vw,28px)] py-2.5">
          <a href="#/" className="shrink-0" aria-label="قاف – الصفحة الرئيسية">
            <LogoTile />
          </a>
          <nav className="hidden flex-1 md:block" aria-label="التنقل الرئيسي">
            <ul className="flex justify-center gap-1">
              {LINKS.map(([id, label]) => (
                <li key={id}>
                  <a href={`#/${id}`} aria-current={page === id ? "page" : undefined} className={linkClass(page === id)}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            {signedIn ? (
              <a
                href="#/account"
                aria-current={page === "account" ? "page" : undefined}
                className={cx(
                  "flex items-center gap-2.5 rounded-brand-xs border py-1.5 ps-1.5 pe-3.5 text-sm font-bold transition-colors",
                  page === "account" ? "border-green bg-mint text-green-dark" : "border-line text-navy hover:border-green hover:bg-mint-soft"
                )}
              >
                <span className="grid size-8 place-items-center rounded-brand-xs bg-navy text-sm text-white">{initial}</span>
                <span className="hidden max-w-[10ch] truncate lg:inline">{account?.name}</span>
                <span className="lg:hidden">حسابي</span>
              </a>
            ) : (
              <>
                <a href="#/login" className={linkClass(page === "login")}>تسجيل الدخول</a>
                <a href="#/signup" className="rounded-brand-xs bg-green px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-dark">
                  إنشاء حساب
                </a>
              </>
            )}
          </div>
          <button
            ref={buttonRef}
            type="button"
            className="ms-auto grid size-[42px] cursor-pointer place-items-center rounded-brand-xs border border-line text-navy transition-colors hover:border-green hover:bg-mint md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
        <nav id="mobile-nav" aria-label="القائمة للجوال" hidden={!open} className="border-t border-line px-[clamp(14px,3vw,28px)] pt-2 pb-4 md:hidden">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#/${id}`} aria-current={page === id ? "page" : undefined} className={cx(linkClass(page === id), "py-3")}>
              {label}
            </a>
          ))}
          <div className="mt-2 border-t border-line pt-2">
            {signedIn ? (
              <a href="#/account" aria-current={page === "account" ? "page" : undefined} className={cx(linkClass(page === "account"), "py-3")}>
                حسابي · {account?.name}
              </a>
            ) : (
              <>
                <a href="#/login" className={cx(linkClass(page === "login"), "py-3")}>تسجيل الدخول</a>
                <a href="#/signup" className={cx(linkClass(page === "signup"), "py-3")}>إنشاء حساب</a>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
