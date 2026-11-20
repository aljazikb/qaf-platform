import { useApp } from "../AppContext.js";
import { visibleLinks, LogoTile } from "./Header.jsx";
import BrandWaves from "./BrandWaves.jsx";
import { WaveDivider } from "./ui.jsx";

const column = "mx-auto max-w-[1270px] px-[clamp(16px,4vw,32px)]";

/** Full-width teal band: a wave rises out of whatever sits above it, then the palm stands on the sea. */
export default function Footer() {
  const { signedIn } = useApp();
  // Visitors get home plus the way in; signed-in users get the tools.
  const links = signedIn ? visibleLinks(true) : [["home", "الرئيسية"], ["login", "تسجيل الدخول"], ["signup", "إنشاء حساب"]];
  return (
    <footer id="site-footer" className="relative -mt-[clamp(36px,5vw,72px)] text-white print:hidden">
      <WaveDivider from="transparent" to="var(--color-green)" flip />
      <div className="relative bg-green">
        <div className={`${column} relative z-1 grid gap-8 pt-6 pb-8 md:grid-cols-[1.4fr_1fr]`}>
          <div>
            <LogoTile className="h-14" />
            <p className="mt-4 text-xl font-bold">هويتان، وبينهما قاف.</p>
            <p className="mt-1.5 max-w-[46ch] text-sm leading-[1.9]">
              أضف هوية علامتك، واكتشف ما يجمعها بالثقافة السعودية، بأفكار مبتكرة ومستدامة طوال العام.
            </p>
          </div>
          <nav aria-label="روابط التذييل">
            <h2 className="mb-3 text-sm font-bold text-white">المنصة</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
              {links.map(([id, label]) => (
                <li key={id}>
                  <a href={`#/${id}`} className="inline-block py-1.5 text-sm text-white underline-offset-4 hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="relative h-36 sm:h-44">
          <BrandWaves className="absolute inset-0 h-full w-full" />
          <div className={`${column} relative h-full`}>
            <img src="assets/images/qaf-palm.svg" alt="" className="pointer-events-none absolute end-[7%] bottom-[56%] h-24 w-auto sm:h-32" />
            <p className="absolute start-[clamp(16px,4vw,32px)] bottom-2.5 text-xs text-white">
              مشروع قاف (QAf) © 2026 · معسكر الابتكار الإعلامي
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
