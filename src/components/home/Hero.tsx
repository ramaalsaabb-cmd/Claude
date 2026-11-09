import { ArrowRight, ArrowLeft } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import BlackCat from "@/components/cat/BlackCat";
import ButtonLink, { PawIcon, HeartIcon } from "@/components/ui/Button";
import { site } from "@/content/site";
import { pick } from "@/lib/i18n";

type Props = { locale: Locale; dict: Dictionary; projectCount: number; awardCount: number };

const TAGS = [
  { label: "VR / MR", cls: "start-[2%] top-[14%]", d: "0s" },
  { label: "Unreal Engine", cls: "end-[0%] top-[30%]", d: "1.2s" },
  { label: "ESP32", cls: "start-[-4%] top-[52%]", d: "2.1s" },
  { label: "Autodesk Maya", cls: "end-[4%] top-[70%]", d: "0.6s" },
];

export default function Hero({ locale, dict, projectCount, awardCount }: Props) {
  const h = dict.hero;
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const isAr = locale === "ar";

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 sm:pt-32 lg:min-h-[100svh] lg:pt-28">
      {/* soft background shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 end-[-10%] h-[620px] w-[620px] rounded-full bg-sand/70 blur-3xl" />
        <div className="absolute bottom-[-20%] start-[-10%] h-[420px] w-[420px] rounded-full bg-beige/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12">
        {/* Text column */}
        <div className="relative z-10 lg:col-span-7">
          {site.availability && (
            <p className="fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-wine/25 bg-paper/80 px-3.5 py-1.5 text-xs font-medium text-charcoal" style={{ "--d": "50ms" } as React.CSSProperties}>
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wine/50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-wine" />
              </span>
              {pick(locale, site.availability, site.availabilityAr)}
            </p>
          )}
          <p className="fade-up tracking-label mb-6 text-xs font-semibold uppercase text-wine" style={{ "--d": "100ms" } as React.CSSProperties}>
            {h.hello}
          </p>

          <h1
            id="hero-title"
            className={`relative font-serif text-charcoal ${
              isAr ? "text-[clamp(4rem,13vw,8.5rem)] leading-[1.15]" : "text-[clamp(4.6rem,12.5vw,10.5rem)] leading-[0.86] tracking-[-0.02em]"
            }`}
          >
            <span className="split-line">
              <span style={{ "--d": "200ms" } as React.CSSProperties}>{h.first}</span>
            </span>
            <span className="split-line">
              <span style={{ "--d": "380ms" } as React.CSSProperties}>{h.last}</span>
            </span>
            {/* hand-drawn red line with a heart loop */}
            <svg
              aria-hidden="true"
              viewBox="0 0 520 90"
              className={`pointer-events-none absolute -bottom-6 h-auto w-[78%] max-w-[560px] ${isAr ? "start-[10%] -scale-x-100" : "start-[18%]"}`}
              fill="none"
            >
              <path
                className="draw-line"
                style={{ "--len": 900, "--d": "900ms" } as React.CSSProperties}
                d="M4 62 C 90 80, 190 78, 300 58 C 360 47, 392 40, 410 30 C 428 20, 424 4, 410 8 C 398 12, 404 30, 418 38 C 432 46, 446 30, 440 20 C 436 12, 426 18, 430 30 C 440 56, 480 70, 516 64"
                stroke="#882A2A"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </h1>

          <p className="fade-up mt-10 font-sans text-2xl font-light text-charcoal sm:text-3xl" style={{ "--d": "600ms" } as React.CSSProperties}>
            {h.role}
          </p>
          <p className="fade-up mt-5 max-w-xl text-base leading-relaxed text-taupe-ink sm:text-lg" style={{ "--d": "720ms" } as React.CSSProperties}>
            {h.tagline}
          </p>

          <div className="fade-up mt-9 flex flex-wrap items-center gap-4" style={{ "--d": "840ms" } as React.CSSProperties}>
            <ButtonLink href={`/${locale}#projects`}>
              {h.viewWork}
              <PawIcon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            </ButtonLink>
            <ButtonLink href={`/${locale}#about`} variant="ghost" cursor="link">
              <span className="link-underline pb-0.5">{h.aboutMe}</span>
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
            </ButtonLink>
          </div>

          <dl className="fade-up mt-12 flex flex-wrap gap-x-10 gap-y-6" style={{ "--d": "960ms" } as React.CSSProperties}>
            <div>
              <dt className="sr-only">{h.statProjects}</dt>
              <dd className="font-serif text-4xl text-charcoal">{projectCount}</dd>
              <dd className="mt-1 text-sm text-taupe-ink" aria-hidden="true">{h.statProjects}</dd>
            </div>
            {awardCount > 0 && (
              <div className="border-s border-beige ps-10">
                <dt className="sr-only">{awardCount === 1 ? h.statAward : h.statAwards}</dt>
                <dd className="font-serif text-4xl text-charcoal">{awardCount}</dd>
                <dd className="mt-1 text-sm text-taupe-ink" aria-hidden="true">{awardCount === 1 ? h.statAward : h.statAwards}</dd>
              </div>
            )}
            <div className="border-s border-beige ps-10">
              <dt className="sr-only">{h.statCuriosity}</dt>
              <dd className="font-serif text-4xl text-charcoal" aria-label="infinite">∞</dd>
              <dd className="mt-1 text-sm text-taupe-ink" aria-hidden="true">{h.statCuriosity}</dd>
            </div>
          </dl>
        </div>

        {/* Illustrated composition */}
        <div className="relative mx-auto w-full max-w-[460px] lg:col-span-5 lg:max-w-none">
          <div className="fade-up relative mx-auto aspect-[4/5] w-[86%] max-w-[440px]" style={{ "--d": "300ms" } as React.CSSProperties}>
            {/* arch window */}
            <div aria-hidden="true" className="absolute inset-0 rounded-t-[999px] border border-beige bg-gradient-to-b from-paper to-sand/80 shadow-[inset_0_-40px_80px_-40px_rgba(138,120,115,.35)]" />
            <div aria-hidden="true" className="absolute inset-[14px] rounded-t-[999px] border border-beige/70" />
            {/* sun / moon */}
            <div aria-hidden="true" className="absolute start-[58%] top-[16%] h-16 w-16 rounded-full bg-wine/85 shadow-[0_0_0_10px_rgba(136,42,42,.08)]" />
            {/* horizon */}
            <div aria-hidden="true" className="absolute inset-x-[14px] top-[62%] h-px bg-beige" />

            {/* books stack */}
            <div aria-hidden="true" className="absolute inset-x-[16%] bottom-[5%]">
              <div className="mx-auto h-5 w-[78%] rounded-[3px] bg-charcoal text-center font-sans text-[9px] uppercase leading-5 tracking-[0.3em] text-cream">Unity</div>
              <div className="mx-auto mt-0.5 h-5 w-[90%] rounded-[3px] bg-wine text-center font-sans text-[9px] uppercase leading-5 tracking-[0.3em] text-white">Unreal</div>
              <div className="mx-auto mt-0.5 h-5 w-[84%] rounded-[3px] bg-taupe-ink text-center font-sans text-[9px] uppercase leading-5 tracking-[0.3em] text-white">ESP32</div>
            </div>

            {/* the cat */}
            <div className="absolute inset-x-[18%] bottom-[calc(5%+64px)]">
              <BlackCat label={dict.a11y.petCat} messages={dict.cat.messages} />
            </div>
          </div>

          {/* floating discipline tags */}
          {TAGS.map((t) => (
            <span
              key={t.label}
              aria-hidden="true"
              lang="en"
              className={`floaty absolute hidden items-center gap-2 rounded-full border border-beige bg-paper/90 px-3.5 py-1.5 font-sans text-[11px] font-medium text-charcoal shadow-[0_10px_24px_-16px_rgba(30,27,27,.45)] backdrop-blur sm:inline-flex ${t.cls}`}
              style={{ "--d": t.d } as React.CSSProperties}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-wine" />
              {t.label}
            </span>
          ))}

          {/* handwritten note */}
          <p
            aria-hidden="true"
            lang="en"
            className="absolute -top-6 end-0 hidden rotate-[-6deg] whitespace-pre-line text-end font-script text-2xl leading-tight text-taupe-ink sm:block"
          >
            {h.note}
            <HeartIcon className="ms-1 inline h-4 w-4 text-wine" />
          </p>
        </div>
      </div>

      {/* scroll indicator */}
      <a
        href="#about"
        className="relative mx-auto mt-14 hidden w-fit flex-col items-center gap-3 pb-10 text-taupe-ink lg:mt-6 lg:flex"
        data-cursor="link"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border border-taupe/60 pt-2" aria-hidden="true">
          <span className="h-2 w-0.5 rounded-full bg-wine [animation:scrollDot_1.8s_ease-in-out_infinite]" />
        </span>
        <span className="tracking-label text-[10px] uppercase">{h.scroll}</span>
      </a>
    </section>
  );
}
