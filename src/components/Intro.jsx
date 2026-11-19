import { useEffect, useState } from "react";
import { cx } from "./ui.jsx";

// Each quadrant flies in from its own corner; the ق dots drop in last.
const PIECES = [
  { name: "palm", from: "-70vw, -60vh", rotate: "-28deg", delay: 0 },
  { name: "dunes", from: "70vw, -60vh", rotate: "24deg", delay: 120 },
  { name: "house", from: "-70vw, 60vh", rotate: "22deg", delay: 240 },
  { name: "sea", from: "70vw, 60vh", rotate: "-26deg", delay: 360 },
];

// Plays on every full load of the home page; in-app navigation never remounts it.
function shouldShow() {
  const page = window.location.hash.replace(/^#\/?/, "").split("/")[0];
  const onHome = page === "" || page === "home";
  return onHome && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Opening animation on the home page: the four logo quadrants assemble into the logo, then the screen fades away. */
export default function Intro() {
  const [show, setShow] = useState(shouldShow);
  const [loaded, setLoaded] = useState(0);
  const ready = loaded >= PIECES.length + 1;

  const close = () => setShow(false);

  // Never block the site: if the images are slow or fail, drop the intro.
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(close, 5000);
    return () => clearTimeout(timer);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const onKey = () => close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  if (!show) return null;

  const onLoad = () => setLoaded((n) => n + 1);

  return (
    <div
      onClick={close}
      onAnimationEnd={(e) => e.target === e.currentTarget && close()}
      className={cx(
        "fixed inset-0 z-[200] grid cursor-pointer place-items-center overflow-hidden bg-cream print:hidden",
        ready && "animate-intro-out"
      )}
    >
      <div className="flex flex-col items-center">
        <div className="relative aspect-[614/740] w-[clamp(140px,22vw,230px)]">
          {PIECES.map((p) => (
            <img
              key={p.name}
              src={`assets/images/logo-parts/${p.name}.png`}
              alt=""
              onLoad={onLoad}
              onError={close}
              className={cx("absolute inset-0 size-full opacity-0", ready && "animate-piece-in")}
              style={{ "--from": p.from, "--rotate": p.rotate, animationDelay: `${p.delay}ms` }}
            />
          ))}
          <img
            src="assets/images/logo-parts/dots.png"
            alt=""
            onLoad={onLoad}
            onError={close}
            className={cx("absolute inset-0 size-full opacity-0", ready && "animate-dots-in")}
          />
        </div>
        <p className={cx("mt-6 text-xl font-bold text-navy opacity-0", ready && "animate-tagline-in")}>
          هويتان، وبينهما <span className="text-terracotta">قاف</span>
        </p>
      </div>
      <button
        type="button"
        onClick={close}
        className="absolute bottom-6 cursor-pointer rounded-brand-xs px-4 py-2 text-xs font-bold text-muted hover:bg-mint-soft"
      >
        تخطَّ
      </button>
    </div>
  );
}
