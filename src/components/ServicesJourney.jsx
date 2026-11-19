import { useEffect, useRef, useState } from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

const ICONS = {
  ideas: (
    <path d="M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M3 12h2m14 0h2M5.6 18.4 7 17m10-10 1.4-1.4M12 8l1.2 2.8L16 12l-2.8 1.2L12 16l-1.2-2.8L8 12l2.8-1.2Z" />
  ),
  checker: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.3 7.5 9.5 4.4-1.2 7.5-5.1 7.5-9.5V6Z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4m8-4v4M8 14h2m4 0h2m-8 3h2" />
    </>
  ),
};

/** Reveal once when the element first scrolls into view. */
function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setInView(true);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

/** Three-step journey: diamonds linked by a gold path that draws itself, cards rising in sequence. */
export default function ServicesJourney({ steps }) {
  const [ref, inView] = useInView();

  return (
    <div ref={ref} data-inview={inView} className="group/svc relative">
      <div className="mb-12 text-center">
        <h2 id="services-title" className="text-[clamp(20px,2.6vw,26px)] text-white">تعرّف على خدماتنا</h2>
        <span
          aria-hidden="true"
          className="mx-auto mt-2 block h-[3px] w-14 origin-center scale-x-0 rounded-full bg-gold transition-transform delay-200 duration-700 ease-out-soft group-data-[inview=true]/svc:scale-x-100 motion-reduce:scale-x-100"
        />
        <p className="mt-3 text-sm text-[#c9d3dc]">ثلاث خطوات ذكية تأخذك من الهوية إلى الإلهام الثقافي المستدام</p>
      </div>

      <div className="relative mx-auto max-w-[980px]">
        {/* Desktop path: spans from the first diamond's centre to the last, drawn right-to-left */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-[16.6%] top-0 hidden h-0.5 md:block">
          <span className="absolute inset-0 origin-right scale-x-0 bg-[repeating-linear-gradient(to_left,var(--color-gold)_0_10px,transparent_10px_18px)] opacity-60 transition-transform delay-300 duration-[1400ms] ease-out-soft group-data-[inview=true]/svc:scale-x-100 motion-reduce:scale-x-100" />
          <span className="absolute top-1/2 size-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-gold opacity-0 shadow-[0_0_14px_4px_rgba(229,165,53,.55)] group-data-[inview=true]/svc:animate-travel motion-reduce:hidden" />
        </div>

        <ol className="grid gap-12 md:grid-cols-3 md:gap-6">
        {steps.map(([title, body, page], i) => (
          <li
            key={title}
            style={{ "--d": `${450 + i * 220}ms` }}
            className="relative translate-y-8 opacity-0 transition-[opacity,translate] delay-(--d) duration-700 ease-out-soft group-data-[inview=true]/svc:translate-y-0 group-data-[inview=true]/svc:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100
              after:absolute after:-bottom-10 after:left-1/2 after:h-8 after:w-0.5 after:-translate-x-1/2 after:bg-[repeating-linear-gradient(to_bottom,var(--color-gold)_0_6px,transparent_6px_11px)] after:opacity-50 last:after:hidden md:after:hidden"
          >
            <a
              href={`#/${page}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-brand-sm border border-white/14 bg-white/[.06] px-5 pt-12 pb-5 text-center backdrop-blur-sm transition duration-300 ease-out-soft hover:-translate-y-1.5 hover:border-gold/70 hover:bg-white/10 hover:shadow-[0_18px_40px_-12px_rgba(229,165,53,.35)]"
            >
              {/* Sheen sweeping across on hover */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/10 to-transparent transition-[left] duration-700 ease-out-soft group-hover:left-[150%]" />
              {/* Big outlined step number */}
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-4 -left-1 text-[88px] leading-none font-black text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.08)] transition-[-webkit-text-stroke-color] duration-300 group-hover:[-webkit-text-stroke-color:rgba(229,165,53,.25)]">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="mb-2 text-[17px] text-white">{title}</h3>
              <p className="flex-1 text-sm leading-[1.85] text-[#d6dee6]">{body}</p>
              <span className="mt-4 inline-flex items-center justify-center gap-1.5 text-[13px] font-bold text-gold">
                جرّبها
                <span aria-hidden="true" className="transition-transform duration-300 ease-out-soft group-hover:-translate-x-1.5">←</span>
              </span>
            </a>

            {/* Diamond badge sitting on the path */}
            <div aria-hidden="true" className="absolute top-0 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center">
              <span style={{ animationDelay: `${i * 0.9}s` }} className="absolute inset-1 rotate-45 rounded-[12px] bg-gold/40 motion-safe:animate-ping-soft" />
              <span className="absolute inset-1 rotate-45 rounded-[12px] bg-gold shadow-[0_6px_20px_-4px_rgba(229,165,53,.7)] ring-4 ring-navy transition-transform duration-500 ease-out-soft [li:hover_&]:rotate-[135deg]" />
              <svg viewBox="0 0 24 24" className="relative size-6 fill-none stroke-navy stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]">
                {ICONS[page]}
              </svg>
              <span className="absolute -top-1.5 -right-2 grid size-5 place-items-center rounded-full bg-white text-[11px] font-black text-navy ring-2 ring-navy">{i + 1}</span>
            </div>
          </li>
        ))}
        </ol>
      </div>
    </div>
  );
}
