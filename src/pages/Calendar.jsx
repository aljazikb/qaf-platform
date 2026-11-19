import { useEffect, useRef, useState } from "react";
import { useApp } from "../AppContext.js";
import { KEYS, read, remove, write } from "../lib/storage.js";
import { Band, Button, Eyebrow, Panel, PanelHead, WaveDivider, cx } from "../components/ui.jsx";
import PageHero from "../components/PageHero.jsx";

const USER_NAME = "نورة";
const STATUS = {
  pending: { label: "قيد الانتظار", chip: "⏳ قيد الانتظار", tone: "bg-pending text-pending-fg", dot: "bg-terracotta" },
  progress: { label: "جاري التفعيل", chip: "🔄 جاري التفعيل", tone: "bg-progress text-progress-fg", dot: "bg-green" },
  success: { label: "مكتمل", chip: "✓ مكتمل بنجاح", tone: "bg-success text-success-fg", dot: "bg-[#4f9a72]" },
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const addDays = (n) => {
  const d = startOfToday();
  d.setDate(d.getDate() + n);
  return d;
};
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const daysLeft = (d) => Math.round((d - startOfToday()) / 864e5);

const fmtMonth = new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", { month: "long", year: "numeric" });
const fmtDay = new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", { weekday: "long", day: "numeric", month: "long" });
const DOWS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

// Demo events, placed relative to today so the calendar always has something nearby.
const SEED_EVENTS = [
  { id: 1, title: "موسم ورد الطائف والاستخلاص العطري", date: addDays(16), status: "pending", tag: "مؤكد رسمياً", note: "فرصة مثالية لعلامات التجميل والضيافة لربط المنتجات بالموروث المحلي." },
  { id: 2, title: "موسم الحرف اليدوية والتراث العمراني", date: addDays(28), status: "pending", tag: "فرصة تسويقية", note: "مناسبة مقترحة لقطاع الديكور والأزياء لاستلهام الأنماط المعمارية الأصيلة." },
  { id: 3, title: "موسم الرياض", date: addDays(6), status: "progress", tag: "تفعيل مستمر", note: "" },
  { id: 4, title: "موسم التمور", date: addDays(-9), status: "success", tag: "تفعيل مكتمل", note: "" },
];

const INSPIRATION = [
  { type: "seasonal", tag: "موسمي", title: "موسم ورد الطائف", body: "الأقرب إلى مسار LUMA لأنه يربط المنتج بلغة نباتية ومكانية مباشرة دون مناسبة وطنية عامة.", year: "✓ تفعيل عام 2026" },
  { type: "yearlong", tag: "طوال العام", title: "جلسة القهوة السعودية", body: "يناسب حملات حسية تربط الروائح والطقوس بالضيافة، لكنه أقل ارتباطاً بمجموعة الغطاء مقارنة بورد الطائف.", year: "✓ تفعيل عام 2025" },
  { type: "seasonal", tag: "موسمي · التراث", title: "موسم التمور", body: "يفتح زاوية اللون والملمس والمنتج المحلي، ويناسب تطبيقات محددة أكثر من كونه محور حملة شاملة.", year: "✓ تفعيل عام 2025" },
  { type: "yearlong", tag: "طوال العام · نهاية العام", title: "موسم الرياض", body: "مناسب لتفعيل محتوى معاصر أو pop-up، إذا بقيت قصة ورد الطائف هي الرابط الابتدائي.", year: "✓ تفعيل مستمر" },
];

const SUGGESTIONS = ["متى أبدأ التحضير لموسم الطائف؟", "اقترح فكرة طوال العام"];

// Mock responder – replace with a call to the AI endpoint.
function mockReply(q) {
  if (q.includes("طائف") || q.includes("ورد")) return "أقترح بدء التحضير قبل الموسم بثلاثة أسابيع: أسبوع للفكرة والهوية، وأسبوع للإنتاج، وأسبوع لإطلاق التشويق.";
  if (q.includes("طوال") || q.includes("فكرة")) return "جرّب ربط علامتك بجلسة القهوة السعودية كمحتوى أسبوعي ثابت يبني الارتباط الثقافي خارج المواسم.";
  return "سأحلل هوية علامتك وأقترح الموعد الأنسب. هل تفضّل حملة موسمية أم محتوى مستمر طوال العام؟";
}

const chipBase = "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-brand-xs border border-transparent px-3.5 py-1.5 text-xs font-bold transition";
const filterChip = (on) => cx(chipBase, on ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:bg-mint-soft");
const box = "rounded-brand-sm border border-line bg-white";

/** Counts from 0 up to `to` when it mounts (skipped for reduced motion). */
function CountUp({ to, ms = 900 }) {
  const [n, setN] = useState(() => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? to : 0));
  useEffect(() => {
    if (n === to) return;
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / ms);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);
  return <span className="tabular-nums">{n}</span>;
}

function UpcomingCard({ event }) {
  const [sent, setSent] = useState(false);
  return (
    <div className={cx(box, "flex animate-row-in flex-wrap items-center gap-4 bg-surface p-5 transition duration-300 ease-out-soft hover:-translate-y-1 hover:border-[#bfe1e4] hover:shadow-hover")}>
      <span className="grid size-[72px] shrink-0 place-items-center rounded-brand-sm bg-navy text-white">
        <b className="text-[28px] leading-none"><CountUp to={daysLeft(event.date)} /></b>
        <small className="text-[11px] text-sky">يومًا</small>
      </span>
      <div className="min-w-0 flex-[1_1_200px]">
        <small className="text-xs font-bold text-terracotta">{event.tag}</small>
        <h3 className="my-1 text-base">{event.title}</h3>
        <p className="text-[13px] text-muted">{event.note}</p>
      </div>
      <Button variant={sent ? "done" : "soft"} className="w-full sm:w-auto" disabled={sent} onClick={() => setSent(true)}>
        {sent ? "تم إرسال المقترح" : "إرسال مقترح للحملة"}
      </Button>
    </div>
  );
}

export default function Calendar() {
  const { toast } = useApp();
  const [events, setEvents] = useState(() => [
    ...SEED_EVENTS,
    ...read(KEYS.calendarEvents, []).map((e) => ({ ...e, date: new Date(e.date) })),
  ]);
  const [pending, setPending] = useState(() => read(KEYS.calendarPending, null));
  const [view, setView] = useState(() => {
    const d = startOfToday();
    d.setDate(1);
    return d;
  });
  const [selected, setSelected] = useState(startOfToday);
  const [statuses, setStatuses] = useState(() => new Set(Object.keys(STATUS)));
  const [filter, setFilter] = useState("all");
  const [messages, setMessages] = useState([
    { id: 0, who: "bot", text: `أهلاً ${USER_NAME}! بناءً على هوية علامتك، أقترح بدء التحضير لموسم الطائف قبل 3 أسابيع لضمان التميز.` },
  ]);
  const [input, setInput] = useState("");
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  const visible = events.filter((e) => statuses.has(e.status));
  const upcoming = events.filter((e) => e.note && daysLeft(e.date) > 0).sort((a, b) => a.date - b.date);

  const addPendingToCalendar = () => {
    const event = {
      id: `c-${Date.now()}`,
      title: pending.title,
      date: selected,
      status: "pending",
      tag: "حملة جديدة",
      note: pending.timing || `حملة ${pending.brand} من اكتشاف الأفكار.`,
    };
    const custom = [...read(KEYS.calendarEvents, []), { ...event, date: event.date.toISOString() }];
    write(KEYS.calendarEvents, custom);
    setEvents((list) => [...list, event]);
    remove(KEYS.calendarPending);
    setPending(null);
    toast(`أُضيفت «${event.title}» إلى ${fmtDay.format(selected)}`);
  };

  const ask = (raw) => {
    const text = raw.trim();
    if (!text) return;
    const id = Date.now();
    setMessages((m) => [...m, { id, who: "user", text }, { id: id + 1, who: "bot", typing: true }]);
    timers.current.push(
      setTimeout(() => setMessages((m) => m.map((msg) => (msg.id === id + 1 ? { ...msg, typing: false, text: mockReply(text) } : msg))), 900)
    );
  };

  const toggleStatus = (s) =>
    setStatuses((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });

  const shiftMonth = (n) => setView((v) => new Date(v.getFullYear(), v.getMonth() + n, 1));

  const y = view.getFullYear();
  const m = view.getMonth();
  const lead = new Date(y, m, 1).getDay();
  const total = new Date(y, m + 1, 0).getDate();
  const dayEvents = visible.filter((e) => sameDay(e.date, selected));

  return (
    <>
      <PageHero
        piece="sea"
        eyebrow="التخطيط والتفعيل الثقافي"
        title="التقويم الذكي"
        accent="للحملات المستدامة"
        lead="خطّط لحملاتك الإعلانية برؤية استراتيجية مسبقة، وتتبع مواعيد التفعيل الثقافي لتتجاوز الموسمية المحدودة إلى إلهام مستمر طوال العام."
      >
        {upcoming[0] && (
          <div className="inline-flex items-center gap-4 rounded-brand-sm bg-white/80 py-3 ps-3 pe-5 shadow-card backdrop-blur-sm">
            <span className="grid size-16 place-items-center rounded-brand-xs bg-navy text-white">
              <b className="text-2xl leading-none"><CountUp to={daysLeft(upcoming[0].date)} /></b>
              <small className="text-[10px] text-sky">يومًا</small>
            </span>
            <span>
              <small className="block text-xs font-bold text-terracotta">أقرب فرصة</small>
              <strong className="text-navy">{upcoming[0].title}</strong>
            </span>
          </div>
        )}
      </PageHero>

      <Band aria-labelledby="upcoming-title" className="bg-white" inner="pt-6">

      {pending && (
        <Panel className="border-gold bg-[#fffaf0]" aria-labelledby="pending-title">
          <Eyebrow>حملة بانتظار التخطيط</Eyebrow>
          <h2 id="pending-title" className="mt-1 text-xl">{pending.title}</h2>
          <p className="mt-1 text-sm text-muted">
            {pending.brand} · {pending.ideaTitle}
            {pending.timing && <> · التوقيت المقترح: {pending.timing}</>}
          </p>
          <p className="mt-3 text-[13px] text-muted">اختر اليوم المناسب من التقويم أدناه، ثم أضف الحملة إليه.</p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <Button onClick={addPendingToCalendar}>أضفها إلى {fmtDay.format(selected)}</Button>
            <Button
              variant="ghost"
              onClick={() => {
                remove(KEYS.calendarPending);
                setPending(null);
              }}
            >
              تجاهل
            </Button>
          </div>
        </Panel>
      )}

        <PanelHead id="upcoming-title" eyebrow="لا تفوّت" title="مواعيد ومحطات قادمة" />
        <div className="grid gap-4 sm:grid-cols-2">
          {upcoming.map((e) => (
            <UpcomingCard key={e.id} event={e} />
          ))}
        </div>
      </Band>
      <WaveDivider from="#ffffff" to="#fbf6ec" flip />

      <Band aria-labelledby="cal-title" className="bg-[#fbf6ec]">
        <PanelHead
          id="cal-title"
          title="خريطة الفعاليات والفرص التسويقية"
          action={
            <div className="flex flex-wrap gap-2" role="group" aria-label="تصفية حسب الحالة">
              {Object.entries(STATUS).map(([key, s]) => {
                const on = statuses.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleStatus(key)}
                    className={cx(chipBase, on ? s.tone : "border-line bg-white opacity-50")}
                  >
                    {s.chip}
                  </button>
                );
              })}
            </div>
          }
        />

        <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-5 md:grid-cols-[minmax(0,1.9fr)_minmax(300px,1fr)]">
          <div className={cx(box, "p-[clamp(14px,2.5vw,20px)]")}>
            <div className="mb-3.5 flex items-center justify-between gap-2.5">
              <button type="button" className="grid size-10 cursor-pointer place-items-center rounded-brand-xs border border-line bg-white transition-colors hover:border-green hover:bg-mint" aria-label="الشهر السابق" onClick={() => shiftMonth(-1)}>›</button>
              <strong className="text-[15px] text-navy" id="month-label" aria-live="polite">{fmtMonth.format(view)}</strong>
              <button type="button" className="grid size-10 cursor-pointer place-items-center rounded-brand-xs border border-line bg-white transition-colors hover:border-green hover:bg-mint" aria-label="الشهر التالي" onClick={() => shiftMonth(1)}>‹</button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 rounded-brand-sm border border-line bg-white p-1.5 sm:gap-1 sm:p-2.5" role="group" aria-labelledby="month-label">
              {DOWS.map((d) => (
                <div key={d} className="py-1.5 text-center text-[11px] font-bold text-muted" aria-hidden="true">{d.slice(0, 3)}</div>
              ))}
              {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
              {Array.from({ length: total }, (_, i) => {
                const date = new Date(y, m, i + 1);
                const evs = visible.filter((e) => sameDay(e.date, date));
                const isSelected = sameDay(date, selected);
                return (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${fmtDay.format(date)}${evs.length ? `، ${evs.length} فعالية` : ""}`}
                    onClick={() => setSelected(date)}
                    className={cx(
                      "flex aspect-[1/.9] min-w-0 cursor-pointer flex-col items-center justify-center gap-[3px] rounded-brand-xs border border-transparent text-[13px] font-semibold transition-colors hover:bg-mint-soft",
                      sameDay(date, new Date()) && "border-gold",
                      isSelected && "bg-navy text-white hover:bg-navy"
                    )}
                  >
                    <span>{i + 1}</span>
                    <span className="flex h-1.5 gap-[3px]">
                      {evs.map((e) => (
                        <i key={e.id} className={cx("size-1.5 rounded-full", STATUS[e.status].dot, isSelected && "outline outline-white")} />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3.5 rounded-brand-sm border border-line bg-white px-4 py-3.5 text-[13px]" aria-live="polite">
              <h4 className="mb-1.5 text-sm">{fmtDay.format(selected)}</h4>
              {dayEvents.length ? (
                <ul className="grid gap-2">
                  {dayEvents.map((e) => (
                    <li key={e.id} className="flex flex-wrap items-center gap-2">
                      <span className={cx(chipBase, "cursor-default", STATUS[e.status].tone)}>{STATUS[e.status].label}</span>
                      <span>{e.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">لا توجد فعاليات في هذا اليوم. اسأل المساعد عن أفضل موعد لحملتك.</p>
              )}
            </div>
          </div>

          <aside className={cx(box, "flex min-h-[380px] flex-col gap-3 p-[clamp(14px,2.5vw,20px)]")} aria-labelledby="chat-title">
            <div>
              <small className="text-xs font-bold text-terracotta">مساعد التخطيط الذكي</small>
              <h3 id="chat-title" className="mt-0.5 text-base">ما هو الوقت الأمثل لحملتك؟</h3>
            </div>
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-label="سجل المحادثة"
              className="flex max-h-[340px] min-h-[200px] flex-1 flex-col gap-2.5 overflow-y-auto scroll-smooth rounded-brand-sm border border-line bg-white p-3.5"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cx(
                    "max-w-[88%] animate-msg-in rounded-brand-sm px-3 py-2.5 text-[13px] leading-[1.7]",
                    msg.who === "bot" ? "self-start bg-mint-soft text-[#3c4553]" : "self-end bg-navy text-white"
                  )}
                >
                  {msg.typing ? (
                    <span className="inline-flex items-center gap-1" aria-label="المساعد يكتب">
                      {[0, 150, 300].map((delay) => (
                        <i key={delay} className="size-1.5 animate-blink rounded-full bg-green" style={{ animationDelay: `${delay}ms` }} />
                      ))}
                    </span>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className={filterChip(false)} onClick={() => ask(s)}>{s}</button>
              ))}
            </div>
            <form
              ref={formRef}
              className="flex gap-2"
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
                setInput("");
              }}
            >
              <label className="sr-only" htmlFor="chat-input">اسأل مساعد التقويم</label>
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                maxLength={300}
                placeholder="اسأل مساعد التقويم..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-11 min-w-0 flex-1 rounded-brand-xs border border-line bg-white px-3 py-2 text-sm transition focus:border-green focus:ring-3 focus:ring-green/20 focus:outline-none"
              />
              <Button type="submit">إرسال</Button>
            </form>
          </aside>
        </div>
      </Band>
      <WaveDivider from="#fbf6ec" to="#ffffff" />

      <Band aria-labelledby="insp-title" className="bg-white">
        <PanelHead id="insp-title" title="مكتبة الاستلهام" lead="استعرض قصص النجاح السابقة وكيف تم استثمار المواسم الثقافية بوعي واحترافية." />
        <div className="mb-4.5 flex flex-wrap gap-2" role="group" aria-label="تصفية المكتبة">
          {[["all", "الكل"], ["seasonal", "موسمي"], ["yearlong", "طوال العام"]].map(([key, label]) => (
            <button key={key} type="button" aria-pressed={filter === key} className={filterChip(filter === key)} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INSPIRATION.filter((c) => filter === "all" || c.type === filter).map((card) => (
            <article
              key={card.title}
              className={cx(box, "flex flex-col justify-between gap-4 bg-surface p-5 transition duration-200 ease-out-soft focus-within:-translate-y-[3px] focus-within:border-green hover:-translate-y-[3px] hover:border-green hover:shadow-hover")}
            >
              <div>
                <span className={cx("mb-2.5 inline-block rounded-brand-sm px-2.5 py-1 text-xs font-bold", card.type === "seasonal" ? STATUS.pending.tone : STATUS.progress.tone)}>
                  {card.tag}
                </span>
                <h3 className="mb-2 text-[15px]">{card.title}</h3>
                <p className="text-[13px] leading-[1.8] text-muted">{card.body}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-success-fg">{card.year}</span>
                <button
                  type="button"
                  className="min-h-11 cursor-pointer px-1 py-2 text-xs font-bold text-green-dark underline underline-offset-4 hover:text-navy"
                  onClick={() => {
                    setInput(`كيف أستلهم من ${card.title}؟`);
                    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                    inputRef.current?.focus({ preventScroll: true });
                  }}
                >
                  اسأل المساعد
                </button>
              </div>
            </article>
          ))}
        </div>
      </Band>
    </>
  );
}
