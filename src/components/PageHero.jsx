import { Band, Eyebrow, HeroTitle, WaveDivider, cx } from "./ui.jsx";

// Each inner page owns one logo quadrant and a flat tint of that quadrant's colour.
const THEMES = {
  palm: "bg-[#e3f2f1]",
  house: "bg-[#fbe9e2]",
  sea: "bg-[#e1f1f3]",
  dunes: "bg-[#fcefd9]",
};

/**
 * Inner-page opener: runs up behind the floating header, a big logo quadrant floats on the far side,
 * and a wave hands over to the first band (`next` is that band's colour).
 */
export default function PageHero({ piece, eyebrow, title, accent, lead, next = "#ffffff", children, className }) {
  return (
    <Band
      aria-labelledby="page-title"
      className={cx("-mt-[88px] overflow-hidden print:hidden", THEMES[piece], className)}
      inner="grid items-center gap-8 pt-[calc(88px+clamp(36px,5vw,64px))] pb-[clamp(72px,8vw,110px)] md:grid-cols-[minmax(0,1.5fr)_minmax(0,.7fr)]"
      edge={<WaveDivider from="transparent" to={next} className="absolute inset-x-0 bottom-0" />}
    >
      <div className="min-w-0">
        <Eyebrow className="animate-row-in">{eyebrow}</Eyebrow>
        <HeroTitle id="page-title" accent={accent} className="animate-row-in [animation-delay:80ms]">{title}</HeroTitle>
        <p className="max-w-[60ch] animate-row-in text-[17px] leading-[1.9] text-[#3d4757] [animation-delay:160ms]">{lead}</p>
        {children && <div className="mt-6 animate-row-in [animation-delay:240ms]">{children}</div>}
      </div>
      <div aria-hidden="true" className="relative hidden justify-self-center md:block">
        <img
          src={`assets/images/logo-parts/crop/${piece}.png`}
          alt=""
          className="relative w-[clamp(150px,16vw,220px)] animate-piece-float drop-shadow-[0_24px_30px_rgba(18,26,47,.15)]"
        />
      </div>
    </Band>
  );
}
