import { extendTailwindMerge } from "tailwind-merge";
import BrandWaves from "./BrandWaves.jsx";

// Later classes win over earlier ones, so callers can override component defaults.
const twMerge = extendTailwindMerge({ extend: { theme: { shadow: ["card", "hover"], radius: ["brand", "brand-sm", "brand-xs"] } } });
export const cx = (...classes) => twMerge(classes.filter(Boolean).join(" "));

const buttonVariants = {
  primary: "bg-green text-white hover:bg-green-dark hover:shadow-[0_6px_16px_rgba(26,130,142,.3)]",
  ghost: "border-line bg-white text-navy hover:border-green hover:text-green-dark",
  gold: "bg-gold text-navy hover:bg-[#f0b44a] hover:shadow-[0_6px_16px_rgba(229,165,53,.35)]",
  soft: "bg-mint text-progress-fg hover:bg-[#cfe8ea]",
  done: "bg-success text-success-fg",
};

export function Button({ variant = "primary", size, className, ...props }) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-brand-xs border border-transparent px-[18px] py-2.5 text-[13px] font-bold transition duration-200 ease-out-soft active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50",
        size === "lg" && "min-h-[46px] px-[22px] text-sm",
        buttonVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export function Eyebrow({ as: Tag = "div", className, children }) {
  return <Tag className={cx("text-[13px] font-bold text-terracotta", className)}>{children}</Tag>;
}

export function Panel({ as: Tag = "section", className, children, ...props }) {
  return (
    <Tag
      className={cx("mb-6 rounded-brand-sm border border-[#e5e5e5] sm:rounded-brand bg-white p-[clamp(18px,3vw,28px)] shadow-card", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function PanelHead({ id, title, lead, eyebrow, action, className }) {
  return (
    <div className={cx("mb-5 flex flex-wrap items-center justify-between gap-3", className)}>
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 id={id} className="text-[clamp(20px,2.6vw,26px)]">{title}</h2>
        {lead && <p className="mt-1.5 text-sm text-muted">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

/** The two diamonds above the ق in the logo. */
export function BrandDiamonds({ className }) {
  return (
    <svg className={cx("pointer-events-none", className)} viewBox="0 0 118 60" aria-hidden="true">
      {[30, 88].map((x) => (
        <rect key={x} x={x - 20} y={10} width={40} height={40} rx={5} transform={`rotate(45 ${x} 30)`} fill="var(--color-dune)" />
      ))}
    </svg>
  );
}

/** Intro block in the brand shape: cream-to-mint wash, logo diamonds in the corner, sea waves along the bottom. */
export function Hero({ className, children, diamonds = true, ...props }) {
  return (
    <section
      className={cx(
        "relative mb-7 overflow-hidden rounded-brand-sm border border-[#dedbd2] bg-[linear-gradient(115deg,#fbf1e1_0%,#faf8f3_65%,#e6f4f5_100%)] p-[clamp(24px,4vw,44px)] pb-[clamp(72px,8vw,96px)] sm:rounded-brand",
        className
      )}
      {...props}
    >
      {diamonds && <BrandDiamonds className="absolute end-[5%] top-[8%] hidden sm:block w-[clamp(64px,9vw,110px)] opacity-60" />}
      <BrandWaves color="var(--color-sky)" className="absolute inset-x-0 bottom-0 h-[clamp(48px,6vw,72px)] w-full opacity-45" />
      {children}
    </section>
  );
}

export function HeroTitle({ id, children, accent, className }) {
  return (
    <h1 id={id} className={cx("my-2.5 text-[clamp(30px,5vw,56px)] leading-[1.25] text-navy", className)}>
      {children} {accent && <em className="text-terracotta not-italic">{accent}</em>}
    </h1>
  );
}

export const tagTones = {
  mint: "bg-progress text-progress-fg",
  sand: "bg-pending text-pending-fg",
  green: "bg-success text-success-fg",
};

export function Tag({ tone = "mint", className, children }) {
  return <span className={cx("inline-block rounded-brand-xs px-2.5 py-1 text-xs font-bold", tagTones[tone], className)}>{children}</span>;
}

export function Note({ className, children }) {
  return (
    <div className={cx("mt-4 rounded-brand-sm border border-[#f1e6d0] bg-[#faf5eb] px-4 py-3 text-xs leading-[1.9] text-[#80643e]", className)}>
      {children}
    </div>
  );
}

export function Spinner() {
  return <span className="size-[18px] animate-spin rounded-full border-2 border-[#a9d6da] border-t-green" aria-hidden="true" />;
}

export const fieldLabel = "flex flex-col gap-1.5 text-[13px] font-bold text-navy";
export const fieldInput =
  "w-full min-h-11 rounded-brand-xs border border-line bg-white px-3 py-2.5 text-sm font-normal text-ink transition focus:border-green focus:ring-3 focus:ring-green/20 focus:outline-none";

/** The saved brand summary shown on the home, ideas and checker pages. */
export function BrandBar({ brand, action, status = "الهوية المحفوظة", className }) {
  return (
    <div className={cx("mb-5 flex flex-wrap items-center gap-4 rounded-brand-sm border border-[#d6ecee] bg-[#f3fafa] p-4", className)}>
      <div className="grid size-[52px] shrink-0 place-items-center rounded-brand-xs bg-mint text-[25px] text-green-dark" aria-hidden="true">◈</div>
      <div className="min-w-[210px] flex-1">
        <strong className="block text-navy">{brand.name}</strong>
        <p className="text-[13px] text-muted">{brand.description}</p>
        <div className="mt-2.5 flex flex-col gap-x-6 gap-y-1 text-xs text-muted sm:flex-row sm:flex-wrap">
          <span><b className="text-navy">شخصية العلامة:</b> {brand.personality}</span>
          <span><b className="text-navy">أسلوبها البصري:</b> {brand.style}</span>
        </div>
      </div>
      <span className="rounded-brand-xs border border-[#c2e3e6] bg-white px-3 py-1.5 text-[11px] font-extrabold whitespace-nowrap text-green-dark">{status}</span>
      {action}
    </div>
  );
}

/** Strips Panel's card look so its content can sit directly on a full-width band. */
export const bare = "mb-0 rounded-none border-0 bg-transparent p-0 shadow-none sm:rounded-none";

/** A full-width page band; content stays in the page column. */
export function Band({ className, inner, edge, children, ...props }) {
  return (
    <section className={cx("relative", className)} {...props}>
      <div className={cx("relative z-1 mx-auto max-w-[1270px] px-[clamp(16px,4vw,32px)] py-[clamp(48px,7vw,88px)]", inner)}>{children}</div>
      {edge /* full-width decoration pinned to the band's edges (waves, seams) */}
    </section>
  );
}

/** Wave-shaped seam between two bands: the band above's colour on top, the next band's colour rising as a wave. */
export function WaveDivider({ from, to, flip = false, className }) {
  return (
    <div aria-hidden="true" className={cx("relative -my-px", className)} style={{ background: from }}>
      <svg
        className={cx("block h-[clamp(36px,5vw,72px)] w-full", flip && "-scale-x-100")}
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <path d="M0 46 C 240 6, 470 78, 720 42 S 1180 4, 1440 38 V80 H0 Z" fill={to} />
      </svg>
    </div>
  );
}
