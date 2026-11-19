import { useState } from "react";
import { useApp } from "../AppContext.js";
import BrandWaves from "../components/BrandWaves.jsx";
import { Band, Button, Eyebrow, cx, fieldInput, fieldLabel } from "../components/ui.jsx";

export const SECTORS = ["عطور وتجميل", "أزياء وإكسسوارات", "أغذية ومشروبات", "ضيافة وسياحة", "تجزئة", "تقنية", "فعاليات وترفيه", "أخرى"];

const NEXT_LABEL = { ideas: "اكتشاف الأفكار", checker: "فحص المحتوى", calendar: "التقويم الذكي", account: "حسابك" };

function Field({ label, ...props }) {
  return (
    <label className={fieldLabel}>
      {label}
      <input className={cx(fieldInput, "min-h-12")} {...props} />
    </label>
  );
}

/**
 * Sign in / create account. Shown at #/login and #/signup, and in place of any tool page
 * when nobody is signed in (`next` is then the page to continue to).
 */
export default function Auth({ next }) {
  const { page, navigate, account, setAccount, setBrand, signIn, toast } = useApp();
  const [mode, setMode] = useState(page === "signup" ? "signup" : "login");
  const [form, setForm] = useState({ name: "", email: account?.email || "", password: "", company: "", sector: SECTORS[0] });
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const switchTo = (m) => {
    setError("");
    if (next) setMode(m);
    else navigate(m);
  };

  const login = (e) => {
    e.preventDefault();
    if (!account || account.email.toLowerCase() !== form.email.trim().toLowerCase()) {
      setError("ما لقينا حساب بهذا البريد على هذا الجهاز. تأكد من البريد أو أنشئ حسابًا جديدًا.");
      return;
    }
    signIn();
    toast(`أهلًا ${account.name}`);
    if (!next) navigate("ideas");
  };

  const signup = (e) => {
    e.preventDefault();
    const created = {
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      sector: form.sector,
      createdAt: new Date().toISOString(),
    };
    setAccount(created);
    setBrand({ name: created.company, description: created.sector, personality: "لم تُحدَّد بعد", style: "لم يُحدَّد بعد" });
    signIn();
    toast("تم إنشاء حسابك. أكمل معلومات شركتك");
    navigate("account");
  };

  const isSignup = mode === "signup";

  return (
    <Band className="-mt-[88px] bg-[#fbf6ec]" inner="grid min-h-svh place-items-center pt-[calc(88px+32px)] pb-[clamp(72px,9vw,112px)]">
      <div className="grid w-full max-w-[1040px] overflow-hidden rounded-brand-sm border border-line bg-white shadow-card sm:rounded-brand md:grid-cols-[.9fr_1.1fr]">
        {/* Brand side */}
        <div className="relative hidden min-h-[560px] flex-col justify-between overflow-hidden border-s border-line bg-white p-10 text-navy md:flex">
          <img src="assets/images/qaf-logo.png" alt="" className="w-32 animate-piece-float" />
          <div className="relative z-1 mb-24">
            <p className="text-[clamp(28px,3vw,38px)] leading-[1.3] font-bold">
              هويتان، وبينهما <span className="text-terracotta">قاف</span>.
            </p>
            <p className="mt-3 max-w-[34ch] leading-[1.9] text-muted">
              أضف هوية علامتك مرة وحدة، واكتشف ما يجمعها بالثقافة السعودية في كل حملة.
            </p>
          </div>
          <BrandWaves className="absolute inset-x-0 bottom-0 h-32 w-full" />
        </div>

        {/* Form side */}
        <div className="grid content-center p-[clamp(24px,4vw,48px)]">
          {next && (
            <p className="mb-5 rounded-brand-xs bg-mint px-4 py-3 text-[13px] font-bold text-progress-fg">
              سجّل دخولك للوصول إلى {NEXT_LABEL[next] || "هذه الصفحة"}.
            </p>
          )}
          <Eyebrow>{isSignup ? "ابدأ مع قاف" : "مرحبًا بعودتك"}</Eyebrow>
          <h1 className="mt-1 mb-6 text-[clamp(26px,3vw,34px)] text-navy">{isSignup ? "إنشاء حساب" : "تسجيل الدخول"}</h1>

          <form className="grid gap-4" onSubmit={isSignup ? signup : login}>
            {isSignup && <Field label="الاسم" required maxLength={60} autoComplete="name" value={form.name} onChange={set("name")} />}
            <Field label="البريد الإلكتروني" type="email" dir="ltr" className={cx(fieldInput, "min-h-12 text-right")} required autoComplete="email" value={form.email} onChange={set("email")} />
            <Field
              label="كلمة المرور"
              type="password"
              dir="ltr"
              className={cx(fieldInput, "min-h-12 text-right")}
              required
              minLength={8}
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={form.password}
              onChange={set("password")}
            />
            {isSignup && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="اسم الشركة أو العلامة" required maxLength={80} autoComplete="organization" value={form.company} onChange={set("company")} />
                <label className={fieldLabel}>
                  القطاع
                  <select className={cx(fieldInput, "min-h-12")} value={form.sector} onChange={set("sector")}>
                    {SECTORS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {error && (
              <p role="alert" className="text-[13px] font-bold text-terracotta">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="mt-1 min-h-[50px] text-[15px]">
              {isSignup ? "إنشاء الحساب" : "تسجيل الدخول"}
            </Button>
          </form>

          <p className="mt-5 border-t border-line pt-5 text-center text-sm text-muted">
            {isSignup ? "عندك حساب؟ " : "ما عندك حساب؟ "}
            <Button variant="ghost" className="min-h-0 border-0 bg-transparent p-0 text-sm text-green-dark underline-offset-4 hover:underline" onClick={() => switchTo(isSignup ? "login" : "signup")}>
              {isSignup ? "تسجيل الدخول" : "أنشئ حسابًا"}
            </Button>
          </p>
        </div>
      </div>
    </Band>
  );
}
