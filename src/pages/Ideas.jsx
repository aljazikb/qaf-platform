import { useRef, useState } from "react";
import { useApp } from "../AppContext.js";
import EditIdentityButton from "../components/IdentityDialog.jsx";
import { CONCEPTS, REGIONS, pickIdeas, relevance } from "../data/concepts.js";
import { KEYS, read, write } from "../lib/storage.js";
import BrandWaves from "../components/BrandWaves.jsx";
import { Band, BrandBar, Button, Eyebrow, Panel, PanelHead, WaveDivider, cx, fieldInput, fieldLabel } from "../components/ui.jsx";
import PageHero from "../components/PageHero.jsx";

// Card headers take the tints of the logo's four quadrants: palm, dunes, mud house, sea.
const VISUALS = ["bg-[#d9eff1]", "bg-[#fdebd0]", "bg-[#fde3db]", "bg-[#e0f6f9]"];

const PROMPTS = [
  ["أكثر فخامة", "خلّها أفخم"],
  ["للسوشيال ميديا", "مناسبة للسوشيال ميديا"],
  ["تجربة تفاعلية", "تجربة تفاعلية للعملاء"],
  ["طوال العام", "مناسبة لحملة طوال العام"],
];

/** Hero formula: your brand + a cultural region = an original idea. */
function Formula({ brand, region }) {
  const token = "animate-pop-in rounded-brand-xs px-3.5 py-2 text-sm font-bold shadow-card";
  const op = "animate-pop-in text-xl font-black text-gold";
  return (
    <div className="flex flex-wrap items-center gap-2.5" aria-label={`${brand} + ${region} = فكرة أصيلة`}>
      <span className={cx(token, "bg-white text-navy")} style={{ animationDelay: "350ms" }}>{brand}</span>
      <span className={op} style={{ animationDelay: "500ms" }} aria-hidden="true">+</span>
      <span key={region} className={cx(token, "bg-[#fdebd0] text-[#7a4a12]")} style={{ animationDelay: "650ms" }}>{region}</span>
      <span className={op} style={{ animationDelay: "800ms" }} aria-hidden="true">=</span>
      <span className={cx(token, "bg-green text-white")} style={{ animationDelay: "950ms" }}>فكرة أصيلة ✦</span>
    </div>
  );
}

const scrollTo = (ref) => requestAnimationFrame(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

function IdeaCard({ concept, index, brand, isSaved, onOpen, onToggleSave }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-brand-sm border border-line bg-white transition duration-200 hover:-translate-y-[3px] hover:border-green hover:shadow-[0_12px_26px_rgba(23,27,48,.07)]">
      <div className={cx("relative flex h-[113px] items-start justify-between overflow-hidden p-4", VISUALS[index % 4])}>
        <BrandWaves color="rgba(255,255,255,.75)" className="absolute inset-x-0 bottom-0 h-10 w-full" />
        <span className="relative text-4xl" aria-hidden="true">{concept.icon}</span>
        <span className="relative rounded-brand-xs border border-white/75 bg-white/85 px-2.5 py-1 text-[11px] font-bold">
          {concept.type === "seasonal" ? "موسمي" : "طوال العام"}
        </span>
      </div>
      <div className="flex-1 p-4">
        <Eyebrow>{concept.tag}</Eyebrow>
        <h3 className="my-1 text-[19px]">{concept.title}</h3>
        <p className="text-[13px] leading-[1.9] text-muted">{concept.summary}</p>
        <div className="my-3 rounded-brand-xs border-s-3 border-green bg-[#ecf7f7] p-3 text-xs leading-[1.8] text-navy">
          <b className="block text-green-dark">لماذا تناسب علامتك؟</b>
          {relevance(concept, brand)}
        </div>
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-brand-xs bg-surface px-2 py-1">{concept.tag}</span>
          <span className="rounded-brand-xs bg-surface px-2 py-1">مقترح أولي</span>
        </div>
      </div>
      <div className="flex gap-2 border-t border-line px-4 py-3">
        <Button variant="soft" className="flex-1" onClick={onOpen}>استكشف الفكرة</Button>
        <Button variant="ghost" aria-pressed={isSaved} onClick={onToggleSave}>{isSaved ? "♥ محفوظة" : "♡ حفظ"}</Button>
      </div>
    </article>
  );
}

export default function Ideas() {
  const { brand, toast, navigate } = useApp();
  const [region, setRegion] = useState("all");
  const [round, setRound] = useState(2);
  const [ideas, setIdeas] = useState(() => pickIdeas("all", 0));
  const [active, setActive] = useState(null);
  const [refine, setRefine] = useState("");
  const [saved, setSavedState] = useState(() => read(KEYS.savedIdeas, []));
  const [projects, setProjectsState] = useState(() => read(KEYS.projects, []));
  const [draftProject, setDraftProject] = useState({ title: "", notes: "" });

  const ideasRef = useRef(null);
  const detailRef = useRef(null);
  const projectsRef = useRef(null);
  const dialogRef = useRef(null);
  const refineRef = useRef(null);

  const setSaved = (next) => {
    setSavedState(next);
    if (!write(KEYS.savedIdeas, next)) toast("تعذّر الحفظ في هذا المتصفح");
  };
  const setProjects = (next) => {
    setProjectsState(next);
    if (!write(KEYS.projects, next)) toast("تعذّر الحفظ في هذا المتصفح");
  };

  const generate = () => {
    setIdeas(pickIdeas(region, round));
    setRound((r) => r + 2);
  };

  const open = (concept) => {
    setActive(concept);
    setRefine(saved.find((s) => s.id === concept.id)?.refine || "");
    scrollTo(detailRef);
  };

  const toggleSave = (concept) => {
    if (saved.some((s) => s.id === concept.id)) {
      setSaved(saved.filter((s) => s.id !== concept.id));
      toast("أزيلت من الأفكار المحفوظة");
    } else {
      setSaved([...saved, { ...concept, brand: brand.name, refine: active?.id === concept.id ? refine : "" }]);
      toast("تم حفظ الفكرة");
    }
  };

  const sendToCalendar = (pending) => {
    write(KEYS.calendarPending, { ...pending, brand: brand.name, requestedAt: new Date().toISOString() });
    navigate("calendar");
  };

  const savedIds = new Set(saved.map((s) => s.id));
  const regionLabel = REGIONS.find(([id]) => id === region)[1];

  return (
    <>
      <PageHero
        piece="palm"
        eyebrow="اكتشاف الإلهام الثقافي"
        title="اكتشف ما يجمع"
        accent="علامتك بثقافتنا"
        lead="أفكار تسويقية تنطلق من هوية علامتك، وتستلهم الثقافة السعودية من المنطقة اللي تختارها."
      >
        <Formula brand={brand.name} region={regionLabel} />
      </PageHero>

      <Band aria-labelledby="intro-title" className="bg-white" inner="pt-6">
        <PanelHead id="intro-title" eyebrow="الخطوة الأولى" title="اختر منطقة الإلهام" lead="قاف تقترح أفكارًا من المنطقة المختارة أولًا، ثم من بقية المملكة." />
        <BrandBar brand={brand} action={<EditIdentityButton />} />
        <div role="radiogroup" aria-label="المنطقة الثقافية" className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {REGIONS.map(([id, label], i) => {
            const on = region === id;
            const count = CONCEPTS.filter((c) => id === "all" || c.region === id).length;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setRegion(id)}
                style={{ animationDelay: `${i * 70}ms` }}
                className={cx(
                  "grid animate-row-in cursor-pointer gap-1 rounded-brand-sm border p-4 text-start transition duration-300 ease-out-soft",
                  on ? "-translate-y-1 border-green bg-mint shadow-card" : "border-line bg-surface hover:border-[#bfe1e4] hover:bg-white"
                )}
              >
                <span className={cx("text-[15px] font-bold", on ? "text-green-dark" : "text-navy")}>{label}</span>
                <span className="text-xs text-muted">{count} {count > 2 ? "عناصر ثقافية" : "عنصر ثقافي"}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="gold"
            size="lg"
            onClick={() => {
              generate();
              scrollTo(ideasRef);
            }}
          >
            ✦ اكتشف ما يجمع علامتك بثقافتنا
          </Button>
          <span className="text-[13px] text-muted">أفكار تجمع بين هوية علامتك والثقافة السعودية</span>
        </div>
      </Band>
      <WaveDivider from="#ffffff" to="#fbf6ec" flip />

      <Band ref={ideasRef} aria-labelledby="ideas-title" className="scroll-mt-24 bg-[#fbf6ec]">
        <PanelHead
          id="ideas-title"
          eyebrow="مساحة الإلهام"
          title="أفكار مقترحة لك"
          lead={
            region === "all"
              ? `6 أفكار لعلامة ${brand.name} · اختر واحدة لتكمل عليها`
              : `أفكار من ${regionLabel}، مع اقتراحات إضافية من بقية المملكة · اختر واحدة لتكمل عليها`
          }
          action={
            <Button
              variant="soft"
              onClick={() => {
                generate();
                toast("تم تحديث الأفكار المقترحة");
              }}
            >
              ↻ أفكار جديدة
            </Button>
          }
        />
        {/* Re-keyed on every round so a fresh set is dealt in */}
        <div key={round} className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {ideas.map((concept, i) => (
            <div key={concept.id} className="animate-deal" style={{ animationDelay: `${i * 80}ms` }}>
              <IdeaCard
                concept={concept}
                index={i}
                brand={brand}
                isSaved={savedIds.has(concept.id)}
                onOpen={() => open(concept)}
                onToggleSave={() => toggleSave(concept)}
              />
            </div>
          ))}
        </div>
      </Band>
      <WaveDivider from="#fbf6ec" to="#ffffff" />

      <Band className="bg-white" inner="pt-8">

      {active && (
        <Panel ref={detailRef} className="scroll-mt-24" aria-labelledby="detail-title">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Eyebrow>{active.tag}</Eyebrow>
              <h2 id="detail-title" className="text-[27px]">{active.title}</h2>
              <p className="text-[13px] text-muted">تصور إبداعي قابل للتطوير · {brand.name}</p>
            </div>
            <Button variant="ghost" onClick={() => setActive(null)}>إغلاق التفاصيل ×</Button>
          </div>

          <div className="my-4.5 grid gap-3 sm:grid-cols-2">
            {[
              ["الفكرة والقصة", active.story, "sm:col-span-2 bg-[#eef7f8]"],
              ["لماذا تناسب علامتك؟", relevance(active, brand)],
              ["التصور البصري", active.visual],
              ["تطبيقات تسويقية مقترحة", active.formats],
              ["رسالة تسويقية مقترحة", active.message, "sm:col-span-2 bg-[#fbf7ee]"],
            ].map(([label, value, extra]) => (
              <div key={label} className={cx("rounded-brand-sm border border-line bg-surface p-4", extra)}>
                <h3 className="mb-2 text-sm text-green-dark">{label}</h3>
                <p className="text-[13px] leading-[1.9] whitespace-pre-line">{value}</p>
              </div>
            ))}
          </div>

          <div className="mb-6 rounded-brand-sm border border-line bg-[#f7fafb] p-[clamp(18px,3vw,25px)]">
            <h3 className="text-lg">طوّر الفكرة مع قاف</h3>
            <p className="text-[13px] text-muted">
              اكتب كيف تحب تطوير الفكرة بما يناسب شخصية علامتك. تُحفظ توجيهاتك لتطويرها عند ربط الذكاء الاصطناعي.
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {PROMPTS.map(([label, prompt]) => (
                <button
                  key={label}
                  type="button"
                  className="cursor-pointer rounded-brand-xs border border-line bg-white px-3.5 py-2 text-xs font-bold text-green-dark transition-colors hover:bg-mint"
                  onClick={() => {
                    setRefine((r) => (r ? `${r}\n${prompt}` : prompt));
                    refineRef.current?.focus();
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <textarea
              ref={refineRef}
              aria-label="توجيه تطوير الفكرة"
              className={cx(fieldInput, "my-2.5 min-h-20 resize-y")}
              placeholder="مثال: أبغى الفكرة موجهة للجيل الجديد مع الحفاظ على الهوية..."
              value={refine}
              onChange={(e) => setRefine(e.target.value)}
            />
            <Button
              variant="soft"
              onClick={() => {
                const text = refine.trim();
                if (savedIds.has(active.id)) setSaved(saved.map((s) => (s.id === active.id ? { ...s, refine: text } : s)));
                toast("تم حفظ التوجيه محليًا. تطبيقه بالذكاء الاصطناعي يتطلب ربط الخدمة");
              }}
            >
              حفظ توجيه التطوير
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="gold"
              onClick={() => {
                setDraftProject({ title: `حملة ${active.title}`, notes: refine });
                dialogRef.current.showModal();
              }}
            >
              حوّل الفكرة إلى حملة
            </Button>
            <Button
              variant="soft"
              onClick={() => sendToCalendar({ ideaId: active.id, ideaTitle: active.title, title: `حملة ${active.title}`, timing: active.timing })}
            >
              خطّط لها في التقويم
            </Button>
            <Button
              variant="ghost"
              onClick={() => (savedIds.has(active.id) ? toast("الفكرة محفوظة بالفعل") : toggleSave(active))}
            >
              ♡ حفظ للعودة لاحقًا
            </Button>
          </div>
        </Panel>
      )}

      <Panel ref={projectsRef} className="scroll-mt-24" aria-labelledby="projects-title">
        <PanelHead
          id="projects-title"
          title="حملاتي وأفكاري المحفوظة"
          lead="الفكرة المحفوظة ليست حملة نشطة. يمكنك تحويلها لاحقًا إلى حملة ثم تخطيطها في التقويم."
        />
        <div className="grid gap-2.5">
          {projects.map((p) => (
            <div key={p.projectId} className="flex flex-wrap items-center justify-between gap-3 rounded-brand-sm border border-line px-4 py-3">
              <div>
                <strong className="text-sm">📁 {p.title}</strong>
                <p className="text-[13px] text-muted">
                  حملة قيد الإعداد · {p.brand}
                  {p.calendarAdded && " · أُرسلت للتقويم"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="soft"
                  onClick={() => {
                    setProjects(projects.map((x) => (x.projectId === p.projectId ? { ...x, calendarAdded: true } : x)));
                    sendToCalendar({ projectId: p.projectId, ideaTitle: p.ideaTitle, title: p.title, timing: p.idea.timing });
                  }}
                >
                  إرسال للتقويم
                </Button>
                <Button variant="ghost" onClick={() => open(p.idea)}>عرض الفكرة</Button>
              </div>
            </div>
          ))}

          {saved.length > 0 && <p className="mt-3 text-[13px] font-bold text-muted">أفكار محفوظة للعودة لاحقًا</p>}
          {saved.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-brand-sm border border-line px-4 py-3">
              <div>
                <strong className="text-sm">♡ {s.title}</strong>
                <p className="text-[13px] text-muted">فكرة محفوظة · لم تتحول إلى حملة بعد</p>
              </div>
              <Button variant="ghost" onClick={() => open(CONCEPTS.find((c) => c.id === s.id) || s)}>استكمال الفكرة</Button>
            </div>
          ))}

          {!projects.length && !saved.length && (
            <p className="p-2.5 text-[13px] text-muted">لا توجد حملات أو أفكار محفوظة حتى الآن. اكتشف أفكارًا وابدأ رحلتك.</p>
          )}
        </div>
      </Panel>
      </Band>

      <dialog
        ref={dialogRef}
        aria-labelledby="dialog-title"
        className="m-auto w-[calc(100%-32px)] max-w-[520px] rounded-brand-sm border border-line p-6 shadow-[0_20px_80px_rgba(23,27,48,.25)]"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const title = draftProject.title.trim();
            if (!title) return;
            setProjects([
              ...projects,
              {
                projectId: `qaf-${Date.now()}`,
                title,
                notes: draftProject.notes.trim(),
                ideaId: active.id,
                ideaTitle: active.title,
                idea: active,
                brand: brand.name,
                status: "active",
                createdAt: new Date().toISOString(),
                calendarAdded: false,
              },
            ]);
            dialogRef.current.close();
            toast("تم حفظ الحملة. يمكنك الآن تخطيطها في التقويم");
            scrollTo(projectsRef);
          }}
        >
          <Eyebrow>من فكرة إلى حملة</Eyebrow>
          <h2 id="dialog-title" className="mb-1.5 text-xl">اعتماد الفكرة</h2>
          <p className="text-[13px] text-muted">بعد الحفظ يمكنك إرسالها للتقويم لإنشاء خطة مواعيد بموافقتك.</p>
          <label className={cx(fieldLabel, "my-3")}>
            اسم الحملة
            <input
              className={fieldInput}
              maxLength={80}
              required
              value={draftProject.title}
              onChange={(e) => setDraftProject({ ...draftProject, title: e.target.value })}
            />
          </label>
          <label className={cx(fieldLabel, "my-3")}>
            ملاحظات للفريق (اختياري)
            <textarea
              className={cx(fieldInput, "min-h-[72px]")}
              maxLength={400}
              value={draftProject.notes}
              onChange={(e) => setDraftProject({ ...draftProject, notes: e.target.value })}
            />
          </label>
          <div className="flex flex-wrap gap-2.5">
            <Button type="submit" variant="gold">حفظ الحملة</Button>
            <Button variant="ghost" onClick={() => dialogRef.current.close()}>إلغاء</Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
