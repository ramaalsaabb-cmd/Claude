import Link from "next/link";
import { ArrowUpRight, Trophy } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { pick } from "@/lib/i18n";
import ProjectCover from "./ProjectCover";
import type { ProjectCardData } from "./types";

type Props = {
  project: ProjectCardData;
  locale: Locale;
  viewLabel: string;
  openLabel: string;
  size?: "large" | "medium" | "small";
  index: number;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
};

export default function ProjectCard({ project: p, locale, viewLabel, openLabel, size = "medium", index, priority, headingLevel = "h3" }: Props) {
  const Heading = headingLevel;
  const title = pick(locale, p.title, p.titleAr);
  // ~11:8 matches the designed covers, so their titles are never cropped
  const aspect = "aspect-[11/8]";
  const sizes =
    size === "large" ? "(min-width: 1024px) 58vw, 100vw" : size === "small" ? "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 42vw, 100vw";

  return (
    <article className="group relative h-full">
      <Link
        href={`/${locale}/projects/${p.slug}`}
        data-cursor="project"
        data-cursor-label={viewLabel}
        aria-label={openLabel}
        className="flex h-full flex-col overflow-hidden rounded-[24px] border border-beige bg-paper transition-[box-shadow,border-color,transform] duration-500 hover:-translate-y-1 hover:border-wine/30 hover:shadow-[0_30px_60px_-35px_rgba(30,27,27,.45)]"
      >
        <div className={`relative ${aspect} overflow-hidden`}>
          <ProjectCover title={p.title} titleAr={p.titleAr} cover={p.cover ? { src: p.cover.src, alt: pick(locale, p.cover.alt, p.cover.altAr) } : null} theme={p.theme} sizes={sizes} priority={priority} showTitle={false} />
          <span className="absolute bottom-4 end-4 rounded-full bg-paper/90 px-3 py-1 font-sans text-[11px] text-charcoal backdrop-blur">
            {String(index + 1).padStart(2, "0")}
          </span>
          {p.achievement && (
            <span className="absolute end-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-wine px-3 py-1 font-sans text-[11px] font-medium text-cream shadow-[0_8px_20px_-10px_rgba(136,42,42,.8)]">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
              {pick(locale, p.achievement.title, p.achievement.titleAr).split("—")[0].trim()}
              {p.achievement.event && ` · ${pick(locale, p.achievement.event, p.achievement.eventAr)}`}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Heading className={`font-serif leading-tight text-charcoal ${size === "large" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}>
                {title}
                {locale === "en" && p.titleAr && p.titleAr !== p.title && (
                  <span lang="ar" className="ms-3 font-display-ar text-lg text-taupe-ink">
                    {p.titleAr}
                  </span>
                )}
              </Heading>
              <p className="mt-1.5 text-sm text-taupe-ink">{pick(locale, p.category, p.categoryAr)}</p>
            </div>
            <span
              aria-hidden="true"
              className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wine text-cream transition-transform duration-500 group-hover:rotate-45 rtl:group-hover:-rotate-45"
            >
              <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
            </span>
          </div>
          <p className="text-[15px] leading-relaxed text-charcoal/75">{pick(locale, p.description, p.descriptionAr)}</p>
          {p.technologies.length > 0 && (
            <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" lang="en">
              {p.technologies.slice(0, size === "small" ? 3 : 4).map((t) => (
                <li key={t} className="rounded-full border border-beige px-2.5 py-1 text-[11px] text-taupe-ink">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  );
}
