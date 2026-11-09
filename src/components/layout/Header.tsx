"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import LanguageSwitcher from "./LanguageSwitcher";
import CatSilhouette from "@/components/cat/CatSilhouette";

type Props = { locale: Locale; nav: Dictionary["nav"]; a11y: Dictionary["a11y"]; langLabel: string; siteName: string };

const SECTIONS = ["home", "about", "projects", "skills", "experience", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

export default function Header({ locale, nav, a11y, langLabel, siteName }: Props) {
  const pathname = usePathname() || `/${locale}`;
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const onProjects = pathname.startsWith(`/${locale}/projects`);
  const [active, setActive] = useState<SectionId>("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy for the one-page home layout
  useEffect(() => {
    if (!isHome) return;
    const els = SECTIONS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id as SectionId);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

  // Close the mobile menu when the route changes (state adjusted during render)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }
  // Escape closes the menu; lock page scroll while it is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const hrefFor = (id: SectionId) => (id === "home" ? `/${locale}` : `/${locale}#${id}`);
  const isActive = (id: SectionId) => (isHome ? active === id : id === "projects" && onProjects);

  return (
    <>
      <a
        href="#main"
        className="fixed start-4 top-4 z-[110] -translate-y-24 rounded-full bg-charcoal px-5 py-3 text-sm text-cream transition-transform focus:translate-y-0"
      >
        {a11y.skipToContent}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled || open ? "bg-cream/85 shadow-[0_1px_0_rgba(30,27,27,.06)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-3 rounded-md"
            aria-label={siteName}
            data-cursor="link"
          >
            <CatSilhouette className="h-9 w-7 text-charcoal transition-transform duration-500 group-hover:-rotate-6" />
            <span className="hidden font-serif text-lg leading-none text-charcoal sm:inline">{siteName}</span>
          </Link>

          <nav aria-label={a11y.mainNav} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {SECTIONS.map((id) => (
                <li key={id}>
                  <Link
                    href={hrefFor(id)}
                    aria-current={isActive(id) ? (isHome ? "location" : "page") : undefined}
                    data-cursor="link"
                    className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                      isActive(id) ? "text-wine" : "text-charcoal/80 hover:text-charcoal"
                    }`}
                  >
                    {nav[id]}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-4 -bottom-0.5 h-px origin-center bg-wine transition-transform duration-500 ${
                        isActive(id) ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} label={langLabel} ariaLabel={a11y.switchLanguage} />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 text-charcoal lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? a11y.closeMenu : a11y.openMenu}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 overflow-y-auto bg-cream px-6 pb-10 pt-24 lg:hidden"
      >
        <nav aria-label={a11y.mainNav}>
          <ul className="space-y-1">
            {SECTIONS.map((id, i) => (
              <li key={id} className="fade-up" style={{ "--d": `${i * 50}ms` } as React.CSSProperties}>
                <Link
                  href={hrefFor(id)}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(id) ? "page" : undefined}
                  className={`flex items-baseline justify-between border-b border-beige/80 py-4 font-serif text-4xl ${
                    isActive(id) ? "text-wine" : "text-charcoal"
                  }`}
                >
                  {nav[id]}
                  <span className="font-sans text-xs text-taupe-ink">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <CatSilhouette className="mt-12 h-14 w-11 text-charcoal" />
      </div>
    </>
  );
}
