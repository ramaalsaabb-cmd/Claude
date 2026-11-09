import type { Locale } from "@/lib/i18n";
import { sectionNumber } from "@/lib/i18n";
import CatSilhouette from "@/components/cat/CatSilhouette";

type Props = {
  locale: Locale;
  number: number;
  /** Title in the current language */
  title: string;
  /** Same title in the other language — shown as a quiet bilingual echo */
  echo?: string;
  id?: string;
  cat?: boolean;
  className?: string;
};

/** Editorial section heading: "02  About Me / نبذة عني ————  🐈‍⬛" */
export default function SectionHeading({ locale, number, title, echo, id, cat = false, className = "" }: Props) {
  return (
    <div className={`reveal ${className}`}>
      <p className="mb-3 font-sans text-xs font-medium text-taupe-ink">{sectionNumber(number, locale)}</p>
      <div className="flex items-end gap-4">
        <h2 id={id} className="font-serif text-4xl leading-[1.05] text-charcoal sm:text-5xl lg:text-6xl">
          {title}
          {echo && (
            <span
              aria-hidden="true"
              lang={locale === "en" ? "ar" : "en"}
              className={`ms-3 align-middle text-xl text-taupe-ink sm:text-2xl lg:text-3xl ${locale === "en" ? "font-display-ar" : "font-serif-latin"}`}
            >
              <span className="me-3 text-beige">/</span>
              {echo}
            </span>
          )}
        </h2>
        <span className="mb-3 hidden h-px flex-1 bg-beige sm:block" aria-hidden="true">
          <span className="grow-line block h-px w-full bg-wine/40" />
        </span>
        {cat && <CatSilhouette className="mb-1 hidden h-10 w-8 shrink-0 text-charcoal sm:block" />}
      </div>
    </div>
  );
}
