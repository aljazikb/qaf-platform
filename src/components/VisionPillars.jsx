import { useEffect, useRef, useState } from "react";
import { cx } from "./ui.jsx";

// Each vision point owns one of the logo's four quadrants.
const PILLARS = [
  {
    piece: "palm",
    tint: "bg-[#d9eff1]",
    title: "أصالة تنطلق من هويتك",
    body: "نربط شخصية علامتك بعناصر ثقافية سعودية موثّقة، فتأتي حملاتك قريبة من الجمهور دون أن تفقد هويتها.",
  },
  {
    piece: "house",
    tint: "bg-[#fde3db]",
    title: "ضمان الالتزام والسلامة الثقافية",
    body: "وسيط موثوق يحمي العلامة التجارية من الأخطاء التسويقية ويحترم سياق الموروث.",
  },
  {
    piece: "dunes",
    tint: "bg-[#fdebd0]",
    title: "استمرارية الإلهام طوال العام",
    body: "نتجاوز الموسمية المحدودة لنقدم محتوى مستداماً يعزز الارتباط بالجمهور.",
  },
  {
    piece: "sea",
    tint: "bg-[#e0f6f9]",
    title: "منصة ذكية متكاملة",
    body: "تجمع بين تحليل الهوية، التحقق الثقافي، والتقويم التسويقي في مسار واحد.",
  },
];

// Where each layer flies in from when the section first scrolls into view.
const LAYERS = [
  { piece: "palm", fx: "-60%", fy: "-60%", fr: "-25deg", delay: 0 },
  { piece: "dunes", fx: "60%", fy: "-60%", fr: "25deg", delay: 100 },
  { piece: "house", fx: "-60%", fy: "60%", fr: "20deg", delay: 200 },
  { piece: "sea", fx: "60%", fy: "60%", fr: "-20deg", delay: 300 },
  { piece: "dots", fx: "0%", fy: "-80%", fr: "0deg", delay: 800 },
];

const AUTO_MS = 3000;

/** «رؤيتنا في نقاط»: the logo assembles beside the list, and the chosen point lights its quadrant. */
export default function VisionPillars() {
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);
  const [played, setPlayed] = useState(false);
  const rootRef = useRef(null);

  // Play the assembly once when the section scrolls into view; until then the logo rests fully built.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlayed(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Cycle through the points until the visitor picks one.
  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setCurrent((i) => (i + 1) % PILLARS.length), AUTO_MS);
    return () => clearInterval(timer);
  }, [auto]);

  const choose = (i) => {
    setAuto(false);
    setCurrent(i);
  };

  const lit = PILLARS[current].piece;

  return (
    <div ref={rootRef} className="grid items-center gap-[clamp(20px,4vw,48px)] md:grid-cols-[minmax(0,1fr)_minmax(180px,300px)]">
      <div className="grid gap-2.5">
        {PILLARS.map((p, i) => {
          const on = i === current;
          return (
            <button
              key={p.piece}
              type="button"
              aria-expanded={on}
              onClick={() => choose(i)}
              onMouseEnter={() => choose(i)}
              onFocus={() => choose(i)}
              className={cx(
                "grid w-full cursor-pointer grid-cols-[52px_1fr] items-center gap-3.5 rounded-brand-sm border px-4 py-3.5 text-start transition duration-300 ease-out-soft",
                on ? "border-green bg-white shadow-card md:-translate-x-1.5" : "border-line bg-surface hover:border-[#bfe1e4]"
              )}
            >
              <span className={cx("grid size-[52px] place-items-center rounded-brand-xs", p.tint)}>
                <img src={`assets/images/logo-parts/crop/${p.piece}.svg`} alt="" className="h-[34px] w-auto" />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-bold text-navy">{p.title}</span>
                <span
                  className={cx(
                    "block overflow-hidden text-sm leading-[1.85] text-muted transition-all duration-400",
                    on ? "mt-1 max-h-24 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  {p.body}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative order-first mx-auto aspect-[614/740] w-full max-w-[180px] md:order-none md:max-w-[300px]" aria-hidden="true">
        {LAYERS.map((l) => {
          const isLit = l.piece === lit || l.piece === "dots";
          return (
            <img
              key={l.piece}
              src={`assets/images/logo-parts/${l.piece}.svg`}
              alt=""
              className={cx(
                "absolute inset-0 size-full transition duration-500 ease-out-soft",
                isLit ? "scale-[1.06] opacity-100" : "opacity-25 grayscale-[.6]",
                l.piece === "dots" && "scale-100",
                played && "animate-piece-assemble"
              )}
              style={{ "--fx": l.fx, "--fy": l.fy, "--fr": l.fr, animationDelay: `${l.delay}ms` }}
            />
          );
        })}
      </div>
    </div>
  );
}
