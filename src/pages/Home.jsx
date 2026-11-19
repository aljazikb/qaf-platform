import { useApp } from "../AppContext.js";
import ServicesFan from "../components/ServicesFan.jsx";
import VisionPillars from "../components/VisionPillars.jsx";
import WhyCompare from "../components/WhyCompare.jsx";
import { Band, Button, HeroTitle, PanelHead, WaveDivider, cx } from "../components/ui.jsx";

// Official logos (SVG) live in public/assets/images/partners/.
const PARTNERS = [
  { name: "الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)", logo: "assets/images/partners/sdaia.svg", accent: "from-green to-sky" },
  { name: "مركز المعلومات الوطني", logo: "assets/images/partners/nic.svg", accent: "from-green to-navy" },
  { name: "مكتب إدارة البيانات الوطنية", logo: "assets/images/partners/ndmo.svg", accent: "from-navy to-green" },
  { name: "وزارة الثقافة", logo: "assets/images/partners/moc.svg", accent: "from-terracotta to-gold" },
];

// Logos rest in muted grayscale and bloom into full colour on hover, with a brand-tinted accent line.
function PartnerCard({ name, logo, accent }) {
  return (
    <li className="group relative grid h-[120px] w-[230px] shrink-0 place-items-center overflow-hidden rounded-brand-sm border border-line bg-white px-6 transition duration-300 ease-out-soft hover:-translate-y-1 hover:border-transparent hover:shadow-hover">
      <img
        src={logo}
        alt={name}
        title={name}
        loading="lazy"
        className="max-h-[60px] w-auto max-w-full object-contain opacity-60 grayscale transition duration-500 [@media(hover:none)]:opacity-100 [@media(hover:none)]:grayscale-0 ease-out-soft group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-center scale-x-0 bg-green transition-transform duration-500 ease-out-soft group-hover:scale-x-100" />
    </li>
  );
}

export default function Home() {
  const { navigate } = useApp();

  return (
    <>
      {/* Hero runs up behind the floating header */}
      <Band
        aria-labelledby="hero-title"
        className="-mt-[88px] overflow-hidden bg-[#faf6ee] bg-cover bg-[center_30%]"
        style={{
          // Riyadh skyline; a cream wash over the sky keeps the headline readable while the city shows below
          backgroundImage:
            "radial-gradient(ellipse 60% 70% at 50% 45%, rgba(250,246,238,.92) 0%, rgba(250,246,238,.7) 55%, rgba(250,246,238,0) 100%), url(assets/images/qaf-hero-riyadh-light.jpg)",
        }}
        inner="grid w-full justify-items-center pt-[calc(88px+clamp(40px,6vw,72px))] pb-[clamp(72px,8vw,110px)] text-center"
        edge={<WaveDivider from="transparent" to="#ffffff" className="absolute inset-x-0 bottom-0" />}
      >
        <HeroTitle id="hero-title" accent="قاف" className="mt-0 mb-3.5">هويتان، وبينهما</HeroTitle>
        <p className="max-w-[58ch] text-[17px] leading-[1.9] text-[#3d4757]">
          نساعد الشركات والعلامات التجارية على توظيف التراث الثقافي السعودي في حملاتها الإعلانية والتسويقية بأفكار مبتكرة ومستدامة طوال العام.
        </p>
        <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" onClick={() => navigate("ideas")}>اكتشف أفكارًا لعلامتك</Button>
          <Button size="lg" variant="ghost" onClick={() => navigate("checker")}>افحص تصميمك</Button>
        </div>
      </Band>

      {/* Trust first: partner logos right under the hero */}
      <Band aria-labelledby="partners-title" className="bg-white">
        <PanelHead id="partners-title" title="شركاء النجاح" lead="الجهات والمستفيدون الذين نعمل معهم." className="justify-center text-center" />
        {/* Marquee: two identical copies slide by half the track width for a seamless loop */}
        <div dir="ltr" className="group/marquee -mx-2 overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
          <div className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 || undefined}
                className={cx("flex gap-4 pe-4 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pe-0", copy === 1 && "motion-reduce:hidden")}
              >
                {PARTNERS.map((p) => <PartnerCard key={p.name} {...p} />)}
              </ul>
            ))}
          </div>
        </div>
      </Band>
      <WaveDivider from="#ffffff" to="var(--color-navy)" flip />

      <Band
        aria-labelledby="services-title"
        className="flex min-h-[calc(100svh-clamp(36px,5vw,72px))] flex-col justify-center overflow-hidden bg-navy text-white"
        inner="w-full py-[clamp(16px,4svh,48px)]"
      >
        <ServicesFan />
        <div className="relative mt-5 text-center">
          <Button size="lg" variant="gold" className="w-full sm:w-auto" onClick={() => navigate("ideas")}>ابدأ الآن</Button>
        </div>
      </Band>

      <WaveDivider from="var(--color-navy)" to="#ffffff" />

      <Band aria-labelledby="why-title" className="bg-white">
        <PanelHead id="why-title" title="لماذا تختار قاف؟" lead="نربطك بالثقافة.. بأمان وثقة" />
        <WhyCompare />
      </Band>
      <WaveDivider from="#ffffff" to="#fbf6ec" flip />

      <Band aria-labelledby="pillars-title" className="overflow-hidden bg-[#fbf6ec]">
        <PanelHead id="pillars-title" eyebrow="رؤيتنا" title="أربع ركائز تكتمل بها قاف" lead="كل ركيزة تمثّل ربعًا من شعارنا. اختر واحدة لتعرف أكثر." />
        <VisionPillars />
      </Band>

      <Band
        aria-labelledby="cta-title"
        className="overflow-hidden bg-[#e3f2f3]"
        inner="grid justify-items-center gap-3 pt-[clamp(80px,10vw,120px)] text-center"
        edge={<WaveDivider from="transparent" to="#fbf6ec" flip className="absolute inset-x-0 top-0 rotate-180" />}
      >
        <h2 id="cta-title" className="text-[clamp(28px,4.2vw,46px)] leading-[1.3]">هل ترغب في أن تكون أحد شركائنا؟</h2>
        <p className="max-w-[52ch] text-base text-muted sm:text-lg">انضم إلى منصة قاف وابدأ في إثراء حضورك الثقافي بأمان وثقة.</p>
        <Button size="lg" className="mt-2 min-h-[52px] w-full px-8 text-base sm:w-auto" onClick={() => navigate("ideas")}>كن جزءاً منا</Button>
      </Band>
    </>
  );
}
