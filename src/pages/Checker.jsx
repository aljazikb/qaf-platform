import { useEffect, useRef, useState } from "react";
import { useApp } from "../AppContext.js";
import EditIdentityButton from "../components/IdentityDialog.jsx";
import { Band, BrandBar, Button, Eyebrow, Note, Panel, Spinner, WaveDivider, cx } from "../components/ui.jsx";
import PageHero from "../components/PageHero.jsx";

const TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

const METRICS = [
  ["88%", "التوافق مع الهوية السعودية (تجريبي)"],
  ["76%", "التوافق مع هوية الشركة (تجريبي)"],
  ["82%", "التوافق الإجمالي (تجريبي)"],
];

const CRITERIA = [
  ["ملاءمة الرموز والصور للسياق السعودي", "90%"],
  ["ملاءمة اللغة والرسالة للجمهور المحلي", "86%"],
  ["اتساق الألوان والأسلوب البصري مع هوية الشركة", "79%"],
  ["وضوح الشعار واتساق الخطوط مع دليل الشركة", "73%"],
];

const RECOMMENDATIONS = [
  ["high", "راجع استخدام الشعار والخطوط", "قارن حجم الشعار ومساحة الحماية والخطوط المستخدمة بإرشادات الهوية المعتمدة قبل نشر المحتوى."],
  ["high", "تحقق من دقة المرجع الثقافي", "إذا استخدمت رموزًا أو تعبيرات سعودية، تأكد من مناسبتها للمنطقة والمناسبة والجمهور دون تعميم أو تنميط."],
  ["medium", "حسّن الاتساق البصري", "وحّد تدرجات الألوان وتسلسل العناوين والمسافات، مع الحفاظ على شخصية العلامة التجارية."],
];

const HOW = [
  ["01", "ارفع المحتوى", "اختر التصميم التسويقي الذي تريد مراجعته."],
  ["02", "قارن مع الهويتين", "مراجعة التوافق مع مرجع الهوية السعودية وهوية علامتك التجارية."],
  ["03", "استعرض النتيجة", "تقييم توضيحي ونقاط قوة وملاحظات وتوصيات قابلة للتطبيق."],
];

/** Animated ring that fills to the score once the report appears. */
function ScoreRing({ value, filled }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-[120px]">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e0eeef" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--color-green)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={filled ? c * (1 - value / 100) : c}
          className="transition-[stroke-dashoffset] duration-[1400ms] ease-out-soft print:transition-none"
        />
      </svg>
      <b className="absolute inset-0 grid place-items-center text-[26px] text-[#146770]">{value}%</b>
    </div>
  );
}

/** Hero demo: a beam sweeps over a sample post, then the verdict stamps in. */
function ScanDemo() {
  return (
    <div aria-hidden="true" className="flex items-center gap-4">
      <div className="relative h-[92px] w-[132px] overflow-hidden rounded-brand-sm border border-white bg-white shadow-card">
        <div className="grid h-[58px] place-items-center bg-[#fde3db]">
          <img src="/assets/images/logo-parts/crop/house.png" alt="" className="h-10 w-auto" />
        </div>
        <div className="space-y-1.5 px-3 pt-2">
          <i className="block h-1.5 w-3/4 rounded-full bg-line" />
          <i className="block h-1.5 w-1/2 rounded-full bg-line" />
        </div>
        <span className="absolute inset-x-0 h-1/3 animate-scan bg-[linear-gradient(180deg,transparent,rgba(147,233,245,.6)_45%,var(--color-sky)_50%,rgba(147,233,245,.6)_55%,transparent)]" />
      </div>
      <span className="animate-pop-in rounded-brand-xs bg-green px-3.5 py-2 text-sm font-bold text-white shadow-card [animation-delay:700ms]">✓ متوافق 88%</span>
    </div>
  );
}

const softBox = "rounded-brand-sm bg-surface print:break-inside-avoid";

export default function Checker() {
  const { brand, navigate } = useApp();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | scanning | done
  const [filled, setFilled] = useState(false);
  const [reportDate, setReportDate] = useState("");
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  useEffect(() => {
    if (status !== "scanning") return;
    const timer = setTimeout(() => {
      setReportDate(new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }));
      setStatus("done");
      requestAnimationFrame(() => {
        setFilled(true);
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 1100);
    return () => clearTimeout(timer);
  }, [status]);

  const pick = (f) => {
    if (!f) return;
    if (!TYPES.includes(f.type)) return setError("الرجاء رفع صورة بصيغة PNG أو JPG أو WEBP.");
    if (f.size > MAX_BYTES) return setError("الحد الأقصى لحجم الملف 10MB.");
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("idle");
    setFilled(false);
  };

  const reset = () => {
    if (inputRef.current) inputRef.current.value = "";
    setFile(null);
    setPreview("");
    setStatus("idle");
    setFilled(false);
  };

  return (
    <>
      <PageHero
        piece="house"
        eyebrow="فحص المحتوى"
        title="افحص"
        accent="محتواك."
        lead="ارفع تصميمك وتعرّف على مدى توافقه مع الهوية والثقافة السعودية ومع الهوية البصرية لعلامتك، واطّلع على فرص التحسين قبل النشر."
      >
        <ScanDemo />
      </PageHero>

      <Band className="bg-white print:hidden" inner="pt-6">
      <div className="grid items-start gap-[clamp(20px,4vw,48px)] md:grid-cols-[1.3fr_.8fr]">
        <Panel className="mb-0" aria-labelledby="scan-title">
          <h2 id="scan-title" className="mb-5 text-[21px]">ابدأ فحص المحتوى</h2>
          <BrandBar
            brand={brand}
            action={<EditIdentityButton />}
          />

          <div
            className={cx(
              "flex min-h-[245px] flex-col items-center justify-center gap-2.5 rounded-brand-sm border-2 border-dashed p-6 text-center transition-colors",
              dragging ? "border-green bg-[#e0f2f3]" : "border-[#8fc9cf] bg-[#f5fbfb] hover:border-green",
              !file && "hover:bg-[#eef8f8]"
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pick(e.dataTransfer.files[0]);
            }}
          >
            {file ? (
              <>
                <div className="relative overflow-hidden rounded-brand-xs">
                  <img src={preview} alt="معاينة التصميم" className="block max-h-[230px] max-w-full object-contain" />
                  {status === "scanning" && (
                    <span aria-hidden="true" className="absolute inset-x-0 h-1/3 animate-scan bg-[linear-gradient(180deg,transparent,rgba(147,233,245,.55)_45%,var(--color-sky)_50%,rgba(147,233,245,.55)_55%,transparent)]" />
                  )}
                </div>
                <p className="text-sm text-muted">{file.name}</p>
              </>
            ) : (
              <>
                <div className="text-[40px] text-green" aria-hidden="true">⇧</div>
                <strong className="text-[17px] text-navy">اسحب تصميمك هنا أو اختر ملفًا</strong>
                <p className="text-sm text-muted">ارفع منشورًا أو إعلانًا أو أي تصميم تسويقي ترغب بفحصه</p>
                <small className="text-[#8b978f]">PNG · JPG · WEBP — بحد أقصى 10MB</small>
                <Button variant="soft" className="mt-3" onClick={() => inputRef.current.click()}>اختيار تصميم</Button>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={TYPES.join(",")}
            hidden
            onChange={(e) => pick(e.target.files[0])}
          />
          {error && <p className="mt-3 text-[13px] font-bold text-terracotta" role="alert">{error}</p>}

          <div className="mt-4.5 flex flex-wrap gap-2.5">
            <Button size="lg" disabled={!file || status === "scanning"} onClick={() => setStatus("scanning")}>فحص المحتوى ←</Button>
            {file && <Button size="lg" variant="soft" onClick={reset}>استبدال التصميم</Button>}
          </div>
          {status === "scanning" && (
            <div className="mt-4.5 flex items-center gap-2.5 text-[13px] text-green" role="status">
              <Spinner />
              قاف تفحص تصميمك مقابل الهويتين...
            </div>
          )}
          <Note>
            ✦ هذا نموذج تفاعلي: النتائج توضيحية وليست تحليلًا حقيقيًا بالذكاء الاصطناعي. يمكن ربطه لاحقًا بخدمة تحليل الصور ودليل هوية الشركة ومرجع ثقافي سعودي معتمد.
          </Note>
        </Panel>

        <aside aria-labelledby="how-title" className="md:pt-4">
          <h2 id="how-title" className="mb-5 text-[21px]">كيف يعمل الفحص؟</h2>
          <ol className="relative grid gap-6 before:absolute before:inset-y-5 before:start-[21px] before:w-0.5 before:bg-[#bfe1e4] before:content-['']">
            {HOW.map(([num, title, body], i) => (
              <li key={num} className="relative flex animate-row-in items-start gap-4" style={{ animationDelay: `${i * 120}ms` }}>
                <span className="grid size-11 shrink-0 place-items-center rounded-brand-sm bg-green font-bold text-white shadow-card">{num}</span>
                <div>
                  <strong className="text-sm text-navy">{title}</strong>
                  <p className="mt-1 text-xs leading-[1.9] text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <hr className="my-7 border-line" />
          <Eyebrow>ما الذي نفحصه؟</Eyebrow>
          <p className="mt-2 text-[13px] leading-[1.9] text-muted">
            الرموز والعناصر البصرية، اللغة والسياق الثقافي، الألوان والخطوط، واتساق الشعار والطابع العام للعلامة.
          </p>
        </aside>
      </div>
      </Band>

      {status === "done" && (
        <>
        <WaveDivider from="#ffffff" to="#fbf6ec" flip className="print:hidden" />
        <Band className="bg-[#fbf6ec] print:bg-transparent" inner="print:p-0">
        <Panel ref={resultsRef} className="mt-6 scroll-mt-24 print:border-0 print:p-0 print:shadow-none" aria-labelledby="report-title">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Eyebrow>تقرير توضيحي · نموذج قاف</Eyebrow>
              <h2 id="report-title" className="mt-2 text-[21px]">تقرير فحص المحتوى</h2>
              <p className="text-xs text-[#6d8074]">تاريخ التقرير: {reportDate}</p>
            </div>
            <div className="hidden text-[28px] font-bold text-navy print:block">قاف.</div>
            <img src={preview} alt="التصميم المرفوع" className="max-h-[120px] max-w-[160px] rounded-brand-xs border border-line bg-white object-contain" />
          </div>
          <p className="text-xs text-[#6d8074]">العلامة التجارية: {brand.name} | الملف: {file.name}</p>

          <div className="my-5 rounded-brand-sm border-s-4 border-green bg-[#e9f5f6] p-5 leading-[2] text-[#344f44] print:break-inside-avoid">
            <strong>الملخص التنفيذي</strong>
            <div>
              يوضح هذا النموذج كيفية عرض مدى اتساق المحتوى مع الثقافة السعودية وهوية العلامة التجارية. النتائج أدناه أمثلة افتراضية لا تعتمد على تحليل الصورة المرفوعة؛ وتحتاج النسخة الفعلية إلى ربط بمحرك تحليل ومرجع معتمد لكل هوية.
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-3 print:grid-cols-3">
            {METRICS.map(([value, label]) => (
              <div key={label} className={cx(softBox, "grid justify-items-center gap-2 p-5 text-center")}>
                <ScoreRing value={parseInt(value, 10)} filled={filled} />
                <span className="block text-xs text-[#78877e]">{label}</span>
              </div>
            ))}
          </div>

          <section className="mt-6 print:break-inside-avoid">
            <h3 className="mb-3.5 text-[17px]">تفاصيل معايير الفحص (قيم توضيحية)</h3>
            <div className="grid gap-2.5">
              {CRITERIA.map(([label, value]) => (
                <div key={label} className={cx(softBox, "grid grid-cols-[1fr_80px] items-center gap-3 px-4 py-3")}>
                  <span className="text-[13px]">{label}</span>
                  <strong className="text-left text-[15px] text-[#146770]">{value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 print:break-inside-avoid">
            <h3 className="mb-3.5 text-[17px]">قراءة النتائج</h3>
            <div className="grid gap-3.5 sm:grid-cols-2 print:grid-cols-2">
              <div className={cx(softBox, "p-4.5")}>
                <h4 className="mb-2.5 text-sm">✓ نقاط القوة</h4>
                <p className="text-xs leading-[1.9] text-muted">مثال: أسلوب بصري واضح ورسالة مناسبة للجمهور المستهدف، مع إمكانية توظيف عناصر محلية ذات صلة.</p>
              </div>
              <div className={cx(softBox, "p-4.5")}>
                <h4 className="mb-2.5 text-sm">! ملاحظات تحتاج مراجعة</h4>
                <p className="text-xs leading-[1.9] text-muted">مثال: التأكد من وضوح الشعار، وتطابق الخطوط والألوان مع دليل العلامة التجارية، وتجنّب الرموز الثقافية غير الدقيقة.</p>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="mb-3.5 text-[17px]">توصيات التحسين حسب الأولوية</h3>
            {RECOMMENDATIONS.map(([priority, title, body]) => (
              <div key={title} className={cx(softBox, "mb-2.5 flex gap-3 border border-line p-4")}>
                <span
                  className={cx(
                    "h-fit rounded-brand-xs px-2.5 py-1 text-[11px] whitespace-nowrap",
                    priority === "high" ? "bg-pending text-[#a15d43]" : "bg-success text-[#35614b]"
                  )}
                >
                  {priority === "high" ? "أولوية عالية" : "أولوية متوسطة"}
                </span>
                <div>
                  <strong className="text-sm text-navy">{title}</strong>
                  <p className="mt-1 text-xs leading-[1.9] text-muted">{body}</p>
                </div>
              </div>
            ))}
          </section>

          <Note>تنبيه: النسب والملاحظات والتوصيات في هذا التقرير أمثلة توضيحية ثابتة؛ لا تمثل فحصًا فعليًا للتصميم المرفوع.</Note>

          <div className="mt-4.5 flex flex-wrap gap-2.5 print:hidden">
            <Button
              size="lg"
              onClick={() => {
                const title = document.title;
                document.title = `تقرير قاف - ${file.name}`;
                window.addEventListener("afterprint", () => (document.title = title), { once: true });
                window.print();
              }}
            >
              تصدير التقرير PDF ↓
            </Button>
            <Button
              size="lg"
              variant="soft"
              onClick={() => {
                reset();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              فحص تصميم آخر
            </Button>
          </div>
          <p className="mt-2.5 text-xs text-muted print:hidden">سيُفتح مربع الطباعة؛ اختر «حفظ كملف PDF» للحصول على تقرير عربي كامل.</p>
        </Panel>
        </Band>
        </>
      )}
    </>
  );
}
