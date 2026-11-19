import { useEffect, useRef, useState } from "react";
import { cx } from "./ui.jsx";

// Each criterion pairs what QAF offers with where general AI tools fall short.
const ROWS = [
  ["فهم السياق", "مطابقة ذكية تربط هوية العلامة بالثقافة السعودية بدقة", "مخرجات عامة تفتقر للفهم العميق للسياق المحلي والثقافي"],
  ["سلامة المحتوى", "قاعدة معرفية متخصصة تضمن سلامة المراجع والأصالة", "احتمالية عالية للوقوع في أخطاء تسويقية غير مقصودة"],
  ["أصالة الأفكار", "حملات إعلانية قريبة من الجمهور المحلي دون إضرار بهوية الشركة", "الاعتماد على رموز مكررة وسطحية (نخيل وصحراء فقط)"],
  ["التخطيط والتوجيه", "تقويم تسويقي مستدام يتجاوز المناسبات الوطنية التقليدية", "غياب التوجيه المتخصص لفرق التسويق داخل السوق السعودي"],
];

function Mark({ yes }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full text-xs font-bold",
        yes ? "bg-green text-white" : "border border-line bg-surface text-[#98a0ac]"
      )}
    >
      {yes ? "✓" : "✕"}
    </span>
  );
}

const cell = "flex items-start gap-2.5 px-4 py-4 text-sm leading-[1.8] md:px-5";
// The QAF column is one raised mint strip on desktop, separate mint cells on phones.
const qaf = "bg-mint border border-[#bfe1e4] md:border-y-0 md:border-x rounded-brand-xs md:rounded-none text-ink";

/** «لماذا تختار قاف؟» as a comparison table: four criteria, the QAF column raised. */
export default function WhyCompare() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const rise = (i) => (seen ? { className: "animate-row-in", style: { animationDelay: `${i * 90}ms` } } : { className: "", style: {} });

  return (
    <div
      ref={ref}
      role="table"
      aria-label="مقارنة بين قاف وأدوات الذكاء الاصطناعي العامة"
      className="grid grid-cols-2 gap-x-2 gap-y-2 md:grid-cols-[minmax(140px,.75fr)_minmax(0,1.2fr)_minmax(0,1fr)] md:gap-0"
    >
      <div role="row" className="contents">
        <span role="columnheader" className="hidden md:block" />
        <span
          role="columnheader"
          className={cx(qaf, "flex items-center gap-2 px-4 pt-5 pb-4 text-base font-bold text-green-dark md:rounded-tl-[22px] md:border-t md:px-5")}
        >
          قاف
          <span className="rounded-brand-xs bg-green px-2.5 py-1 text-[11px] text-white">الأنسب لعلامتك</span>
        </span>
        <span role="columnheader" className="flex items-end px-4 pb-4 text-base font-bold text-muted md:px-5">
          أدوات الذكاء الاصطناعي العامة
        </span>
      </div>

      {ROWS.map(([criterion, us, them], i) => {
        const last = i === ROWS.length - 1;
        const r = rise(i + 1);
        return (
          <div role="row" key={criterion} className="contents">
            <span
              role="rowheader"
              className={cx(
                "col-span-2 pt-3 text-[13px] font-bold text-terracotta md:col-span-1 md:flex md:items-start md:border-t md:border-line md:px-5 md:py-4 md:text-[15px] md:text-navy",
                r.className
              )}
              style={r.style}
            >
              {criterion}
            </span>
            <span
              role="cell"
              className={cx(cell, qaf, "md:border-t-[#bfe1e4] md:border-t", last && "md:rounded-br-[14px] md:border-b", r.className)}
              style={r.style}
            >
              <Mark yes />
              <span>{us}</span>
            </span>
            <span
              role="cell"
              className={cx(cell, "rounded-brand-xs border border-line bg-surface text-muted md:rounded-none md:border-x-0 md:border-b-0 md:bg-transparent", r.className)}
              style={r.style}
            >
              <Mark />
              <span>{them}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
