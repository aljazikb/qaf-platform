import { useEffect, useRef, useState } from "react";
import { cx } from "./ui.jsx";

const SERVICES = [
  {
    page: "ideas",
    piece: "palm",
    tint: "bg-[#d9eff1]",
    title: "اكتشاف الإلهام الثقافي",
    body: "تحليل هوية علامتك وربطها بالعناصر الثقافية المناسبة لتوليد أفكار إعلانية فريدة.",
  },
  {
    page: "checker",
    piece: "house",
    tint: "bg-[#fde3db]",
    title: "مراجعة التصاميم والتحقق",
    body: "فحص التصاميم الإعلانية للتأكد من سلامة توظيف العناصر الثقافية واحترام سياقها.",
  },
  {
    page: "calendar",
    piece: "dunes",
    tint: "bg-[#fdebd0]",
    title: "التقويم التسويقي الذكي",
    body: "اقتراح فرص موسمية ومستدامة على مدار العام لدعم استمرارية الحضور الإبداعي.",
  },
];

// Where each card rests relative to the front card: in front, fanned to one side, or the other.
const POSITIONS = {
  front: "z-30 translate-x-0 rotate-0 scale-100",
  left: "z-10 -translate-x-[26%] -rotate-[8deg] scale-[.86] brightness-75 sm:-translate-x-[62%] sm:-rotate-12 sm:scale-[.88]",
  right: "z-20 translate-x-[26%] rotate-[8deg] scale-[.86] brightness-75 sm:translate-x-[62%] sm:rotate-12 sm:scale-[.88]",
};

const AUTO_MS = 3600;

/** «تعرّف على خدماتنا» as a fanned hand of cards: tap a side card to deal it to the front. */
export default function ServicesFan() {
  const [front, setFront] = useState(0);
  const [auto, setAuto] = useState(true);
  const [dealt, setDealt] = useState(false);
  const ref = useRef(null);

  // Deal the cards in once, when the section scrolls into view.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDealt(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setFront((i) => (i + 1) % SERVICES.length), AUTO_MS);
    return () => clearInterval(timer);
  }, [auto]);

  const choose = (i) => {
    setAuto(false);
    setFront(i);
  };

  return (
    <div ref={ref} className="relative">
      <div className="mb-5 grid gap-1.5 text-center">
        <h2 id="services-title" className="text-[clamp(26px,3.6vw,40px)] text-white">تعرّف على خدماتنا</h2>
        <p className="text-[15px] text-[#c9d3dc]">ثلاث خطوات ذكية تأخذك من الهوية إلى الإلهام الثقافي المستدام</p>
      </div>

      {/* The fan grows with the screen height: whatever the header, hint and button leave free.
          --fan-h is the table height; the card picture takes what the text below it doesn't need. */}
      <div
        className="relative mx-auto h-(--fan-h) max-w-[1000px]"
        style={{ "--fan-h": "clamp(300px, calc(100svh - 400px), 480px)", "--img-h": "clamp(76px, calc(var(--fan-h) - 225px), 220px)" }}
        onMouseEnter={() => setAuto(false)}
        onPointerDown={() => setAuto(false)}
      >
        {SERVICES.map((s, i) => {
          const offset = (i - front + SERVICES.length) % SERVICES.length;
          const pos = offset === 0 ? "front" : offset === 1 ? "left" : "right";
          const isFront = pos === "front";
          return (
            <article
              key={s.page}
              className={cx(
                "absolute inset-x-0 top-2 mx-auto w-[min(clamp(320px,calc(var(--fan-h)*.82),390px),80vw)] origin-[50%_120%] overflow-hidden rounded-brand-sm bg-white text-navy shadow-[0_24px_50px_rgba(0,0,0,.4)] transition duration-700 ease-[cubic-bezier(.34,1.4,.64,1)]",
                POSITIONS[pos],
                !isFront && "hover:brightness-95",
                dealt && "animate-deal"
              )}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className={cx("grid h-(--img-h) place-items-center", s.tint)}>
                <img
                  src={`assets/images/logo-parts/crop/${s.piece}.svg`}
                  alt=""
                  className={cx("h-[calc(var(--img-h)*.7)] w-auto transition duration-500 ease-out-soft", isFront && "-rotate-6 scale-[1.08]")}
                />
              </div>
              <div className="grid gap-1.5 px-6 pt-5 pb-6 [@media(max-height:700px)]:gap-1 [@media(max-height:700px)]:pt-3.5 [@media(max-height:700px)]:pb-4">
                <h3 className="text-[clamp(20px,2vw,24px)] [@media(max-height:700px)]:text-lg">{s.title}</h3>
                <p className="text-[15px] leading-[1.8] text-muted [@media(max-height:700px)]:text-sm [@media(max-height:700px)]:leading-[1.7]">{s.body}</p>
                <a
                  href={`#/${s.page}`}
                  tabIndex={isFront ? 0 : -1}
                  className={cx("mt-1 text-[15px] font-bold text-green-dark hover:underline", !isFront && "pointer-events-none")}
                >
                  جرّبها ←
                </a>
              </div>
              {/* A side card is one big button that deals it to the front */}
              {!isFront && (
                <button
                  type="button"
                  onClick={() => choose(i)}
                  aria-label={`اعرض: ${s.title}`}
                  className="absolute inset-0 cursor-pointer"
                />
              )}
            </article>
          );
        })}
      </div>
      <p className="text-center text-[13px] text-[#c9d3dc] [@media(max-height:700px)]:hidden">اضغط على أي ورقة لتجيبها للأمام</p>
    </div>
  );
}
