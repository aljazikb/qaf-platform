import { useState } from "react";
import { useApp } from "../AppContext.js";
import PageHero from "../components/PageHero.jsx";
import { KEYS, read } from "../lib/storage.js";
import { Band, BrandBar, Button, Eyebrow, Note, Panel, cx, fieldInput, fieldLabel } from "../components/ui.jsx";
import { SECTORS } from "./Auth.jsx";

const MAX_LOGO_BYTES = 400 * 1024;

// The brand profile QAF builds on; `brand` keys feed the ideas and checker pages.
const TEXT_FIELDS = [
  ["company", "اسم الشركة أو العلامة", "مثال: لوما", true],
  ["audience", "الجمهور المستهدف", "مثال: نساء 25–40 في المدن الكبرى"],
  ["website", "الموقع الإلكتروني", "example.sa"],
  ["description", "النشاط والطابع العام", "مثال: علامة عطور بهوية راقية", true],
  ["personality", "شخصية العلامة", "مثال: راقية، هادئة، معاصرة", true],
  ["style", "الأسلوب البصري", "مثال: بسيط وأنيق، بألوان محايدة", true],
];
const PROFILE_KEYS = ["company", "sector", "audience", "website", "description", "personality", "style", "logo", "guidelines"];

export default function Account() {
  const { account, setAccount, brand, setBrand, signOut, toast, navigate } = useApp();
  const [form, setForm] = useState(() => ({
    company: account?.company || brand.name,
    sector: account?.sector || SECTORS[0],
    audience: account?.audience || "",
    website: account?.website || "",
    description: account?.description || (brand.description === account?.sector ? "" : brand.description),
    personality: account?.personality || (brand.personality?.startsWith("لم ") ? "" : brand.personality),
    style: account?.style || (brand.style?.startsWith("لم ") ? "" : brand.style),
    logo: account?.logo || "",
    guidelines: account?.guidelines || "",
  }));
  const [logoError, setLogoError] = useState("");
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const filled = PROFILE_KEYS.filter((k) => String(form[k] || "").trim()).length;
  const pct = Math.round((filled / PROFILE_KEYS.length) * 100);
  const ideasCount = read(KEYS.savedIdeas, []).length;
  const campaignsCount = read(KEYS.projects, []).length;

  const pickLogo = (file) => {
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) return setLogoError("حجم الشعار أكبر من 400KB. جرّب نسخة أصغر.");
    setLogoError("");
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, logo: reader.result }));
    reader.readAsDataURL(file);
  };

  const save = (e) => {
    e.preventDefault();
    setAccount({ ...account, ...form });
    setBrand({
      name: form.company,
      description: form.description || form.sector,
      personality: form.personality,
      style: form.style,
    });
    toast("تم حفظ معلومات شركتك");
  };

  return (
    <>
      <PageHero
        piece="dunes"
        eyebrow="حسابي"
        title="أهلًا،"
        accent={account?.name}
        lead="معلومات شركتك هنا هي الأساس اللي تبني عليه قاف الأفكار، وتفحص به تصاميمك."
      >
        <div className="flex items-center gap-4">
          <div className="h-2.5 w-[min(260px,60vw)] overflow-hidden rounded-full bg-white shadow-card" aria-hidden="true">
            <i className="block h-full rounded-full bg-green transition-[width] duration-700 ease-out-soft" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-bold text-navy">اكتمال الملف {pct}%</span>
        </div>
      </PageHero>

      <Band className="bg-white" inner="pt-6">
        <div className="grid items-start gap-[clamp(20px,4vw,48px)] md:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)]">
          {/* Account summary */}
          <aside className="grid gap-5">
            <div className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-brand-sm bg-navy text-2xl font-bold text-white">
                {account?.name?.trim()?.[0] || "؟"}
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-lg text-navy">{account?.name}</strong>
                <span className="block truncate text-right text-sm text-muted" dir="ltr">{account?.email}</span>
              </div>
              <Button variant="ghost" className="min-h-9 shrink-0 px-3 text-xs text-terracotta hover:border-terracotta hover:text-terracotta" onClick={signOut}>
                تسجيل الخروج
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                [ideasCount, "فكرة محفوظة", "ideas"],
                [campaignsCount, "حملة", "ideas"],
              ].map(([n, label, page]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => navigate(page)}
                  className="grid cursor-pointer gap-0.5 rounded-brand-sm border border-line bg-surface p-4 text-start transition hover:border-[#bfe1e4] hover:bg-white"
                >
                  <b className="text-[28px] leading-none text-green-dark tabular-nums">{n}</b>
                  <span className="text-xs text-muted">{label}</span>
                </button>
              ))}
            </div>
            <div>
              <Eyebrow className="mb-2">كيف تظهر علامتك في الأدوات</Eyebrow>
              <BrandBar brand={brand} status="الهوية الحالية" className="mb-0" />
            </div>
          </aside>

          {/* Company profile */}
          <Panel as="form" className="mb-0" onSubmit={save} aria-labelledby="company-title">
            <h2 id="company-title" className="text-[clamp(20px,2.4vw,24px)]">معلومات الشركة</h2>
            <p className="mt-1 mb-6 text-sm text-muted">تُستخدم في اكتشاف الأفكار وفحص المحتوى.</p>

            <div className="mb-5 flex flex-wrap items-center gap-4">
              <label className="grid size-24 cursor-pointer place-items-center overflow-hidden rounded-brand-sm border-2 border-dashed border-[#8fc9cf] bg-[#f5fbfb] text-center transition hover:border-green">
                {form.logo ? (
                  <img src={form.logo} alt="شعار الشركة" className="size-full object-contain p-2" />
                ) : (
                  <span className="text-xs font-bold text-green-dark">
                    <span className="block text-2xl" aria-hidden="true">⇧</span>الشعار
                  </span>
                )}
                <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="sr-only" onChange={(e) => pickLogo(e.target.files[0])} />
              </label>
              <div className="text-sm">
                <strong className="block text-navy">شعار الشركة</strong>
                <span className="text-muted">PNG أو SVG بخلفية شفافة، حتى 400KB.</span>
                {form.logo && (
                  <button type="button" className="ms-2 cursor-pointer text-xs font-bold text-terracotta" onClick={() => setForm({ ...form, logo: "" })}>
                    إزالة
                  </button>
                )}
                {logoError && <p role="alert" className="mt-1 text-xs font-bold text-terracotta">{logoError}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {TEXT_FIELDS.slice(0, 1).map(([key, label, ph, req]) => (
                <label key={key} className={fieldLabel}>
                  {label}
                  <input className={fieldInput} required={req} maxLength={80} placeholder={ph} value={form[key]} onChange={set(key)} />
                </label>
              ))}
              <label className={fieldLabel}>
                القطاع
                <select className={fieldInput} value={form.sector} onChange={set("sector")}>
                  {SECTORS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              {TEXT_FIELDS.slice(1).map(([key, label, ph, req]) => (
                <label key={key} className={cx(fieldLabel, key === "description" && "sm:col-span-2")}>
                  {label}
                  <input
                    className={fieldInput}
                    required={req}
                    maxLength={120}
                    placeholder={ph}
                    dir={key === "website" ? "ltr" : undefined}
                    value={form[key]}
                    onChange={set(key)}
                  />
                </label>
              ))}
              <label className="flex cursor-pointer flex-col items-center gap-1 rounded-brand-sm border-2 border-dashed border-[#8fc9cf] bg-[#f5fbfb] p-5 text-center transition-colors hover:border-green hover:bg-[#e0f2f3] sm:col-span-2">
                <span className="text-2xl text-green" aria-hidden="true">⇧</span>
                <strong className="text-sm text-navy">دليل الهوية</strong>
                <small className="text-muted">{form.guidelines || "PDF · PNG · JPG"}</small>
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  className="sr-only"
                  onChange={(e) => setForm({ ...form, guidelines: e.target.files[0]?.name || "" })}
                />
              </label>
            </div>
            <Note>✦ نموذج تجريبي: المعلومات تُحفظ في متصفحك، ويتطلب تحليل دليل الهوية فعليًا ربط المنصة بخدمة ذكاء اصطناعي.</Note>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button type="submit" size="lg">حفظ معلومات الشركة</Button>
              <Button variant="ghost" size="lg" onClick={() => navigate("ideas")}>اكتشف أفكارًا لعلامتك</Button>
            </div>
          </Panel>
        </div>
      </Band>
    </>
  );
}
