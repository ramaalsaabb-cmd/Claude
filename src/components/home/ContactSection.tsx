import { Download } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { sectionNumber } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import ContactLinks, { configuredLinks } from "./ContactLinks";
import CatSilhouette from "@/components/cat/CatSilhouette";
import ButtonLink from "@/components/ui/Button";

type Props = { locale: Locale; dict: Dictionary; number: number; cvAvailable: boolean };

export default function ContactSection({ locale, dict, number, cvAvailable }: Props) {
  const c = dict.contact;
  const hasLinks = configuredLinks(dict).length > 0;
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative px-3 pb-6 pt-20 sm:px-6 sm:pt-28">
      <div className="reveal relative mx-auto max-w-[1400px] overflow-hidden rounded-[32px] bg-charcoal px-6 py-20 text-cream sm:px-12 sm:py-28 lg:px-20">
        {/* decorative red line + sitting cat */}
        <svg aria-hidden="true" viewBox="0 0 1200 300" className="pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full opacity-70" fill="none">
          <path className="draw-line" style={{ "--len": 1700, "--d": "300ms" } as React.CSSProperties} d="M-20 240 C 200 180, 340 300, 560 230 C 700 186, 760 120, 840 140 C 900 156, 880 210, 840 200 C 800 190, 820 130, 900 150 C 1000 176, 1080 250, 1220 210" stroke="#882A2A" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <CatSilhouette className="pointer-events-none absolute bottom-8 end-[8%] h-16 w-12 text-cream/20 sm:h-24 sm:w-20" />

        <div className="relative max-w-4xl">
          <p className="mb-6 flex items-center gap-3 text-xs font-medium text-cream/60">
            <span>{sectionNumber(number, locale)}</span>
            <span className="h-px w-10 bg-cream/30" aria-hidden="true" />
            <span className="tracking-label uppercase">{c.title}</span>
          </p>
          <h2 id="contact-title" className="font-serif text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            {c.heading}
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-cream/75">{c.text}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ContactLinks dict={dict} />
            {cvAvailable && (
              <ButtonLink href={site.cvPath} download>
                {c.cv}
                <Download className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            )}
          </div>

          {!hasLinks && !cvAvailable && isDev && (
            <p className="mt-10 max-w-xl rounded-xl border border-dashed border-cream/30 p-4 text-sm text-cream/70">{c.devHint}</p>
          )}

        </div>
      </div>
    </section>
  );
}
