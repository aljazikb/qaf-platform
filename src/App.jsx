import { useCallback, useEffect, useMemo, useState } from "react";
import { AppContext } from "./AppContext.js";
import { DEFAULT_BRAND, KEYS, read, write } from "./lib/storage.js";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Intro from "./components/Intro.jsx";
import Toast from "./components/Toast.jsx";
import Home from "./pages/Home.jsx";
import Ideas from "./pages/Ideas.jsx";
import Checker from "./pages/Checker.jsx";
import Calendar from "./pages/Calendar.jsx";

export const PAGES = {
  home: { component: Home, title: "قاف | هويتان، وبينهما قاف" },
  ideas: { component: Ideas, title: "قاف | اكتشاف الإلهام الثقافي" },
  checker: { component: Checker, title: "قاف | فحص المحتوى" },
  calendar: { component: Calendar, title: "قاف | التقويم الذكي" },
};

// Routes live in the hash (#/ideas, #/home/identity) so the site works on any static host.
function parseHash() {
  const [page = "", section = ""] = window.location.hash.replace(/^#\/?/, "").split("/");
  return { page: PAGES[page] ? page : "home", section };
}

export default function App() {
  const [route, setRoute] = useState(parseHash);
  const [brand, setBrandState] = useState(() => read(KEYS.brand, DEFAULT_BRAND));
  const [toastState, setToastState] = useState({ message: "", id: 0 });

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.title = PAGES[route.page].title;
  }, [route.page]);

  const navigate = useCallback((page, section = "") => {
    window.location.hash = `#/${page}${section ? `/${section}` : ""}`;
  }, []);

  const toast = useCallback((message) => setToastState((t) => ({ message, id: t.id + 1 })), []);

  const setBrand = useCallback((next) => {
    setBrandState(next);
    write(KEYS.brand, next);
  }, []);

  const ctx = useMemo(
    () => ({ ...route, navigate, toast, brand, setBrand }),
    [route, navigate, toast, brand, setBrand]
  );

  const Page = PAGES[route.page].component;

  return (
    <AppContext.Provider value={ctx}>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="absolute start-3 -top-16 z-[100] rounded-sm bg-navy px-4 py-2.5 text-white transition-[top] focus:top-3"
      >
        تخطَّ إلى المحتوى
      </a>
      <Header />
      <main
        id="main"
        tabIndex={-1}
        className="outline-none print:p-0" /* every page lays out its own full-width bands */
      >
        <Page key={route.page} />
      </main>
      <Footer />
      <BottomNav />
      <Toast message={toastState.message} id={toastState.id} />
      <Intro />
    </AppContext.Provider>
  );
}
