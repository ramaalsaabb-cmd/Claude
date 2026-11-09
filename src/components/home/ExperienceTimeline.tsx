import Link from "next/link";
import { GraduationCap, Trophy, Briefcase, Award, Code2, BookOpen, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { pick } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import type { TimelineEntry, TimelineType } from "@/content/experience";

const ICONS: Record<TimelineType, React.ComponentType<{ className?: string }>> = {
  education: GraduationCap,
  award: Trophy,
  competition: Trophy,
  internship: Briefcase,
  coop: Briefcase,
  role: Briefcase,
  hackathon: Code2,
  bootcamp: BookOpen,
  certification: Award,
};

type Props = {
  locale: Locale;
  dict: Dictionary;
  entries: TimelineEntry[];
  projectTitles: Record<string, { title: string; titleAr?: string }>;
};

export default function ExperienceTimeline({ locale, dict, entries, projectTitles }: Props) {
  return (
    <ol className="relative mt-14 space-y-6 before:absolute before:inset-y-2 before:start-[23px] before:w-px before:bg-beige sm:space-y-8">
      {entries.map((e, i) => {
        const Icon = ICONS[e.type];
        const proj = e.project ? projectTitles[e.project] : undefined;
        return (
          <li
            key={e.id}
            className="reveal relative grid gap-4 ps-16 sm:grid-cols-12 sm:gap-8"
            style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
          >
            <span className="absolute start-0 top-1 inline-flex h-12 w-12 items-center justify-center rounded-full border border-beige bg-paper text-wine">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="sm:col-span-4 sm:pt-3">
              <p className="text-xs font-semibold uppercase tracking-label text-wine">{dict.experience.types[e.type]}</p>
              {e.period && <p className="mt-2 text-sm text-taupe-ink">{pick(locale, e.period, e.periodAr)}</p>}
            </div>
            <div className="rounded-[22px] border border-beige bg-paper p-6 sm:col-span-8 sm:p-8">
              <h3 className="font-serif text-2xl leading-snug text-charcoal sm:text-3xl">{pick(locale, e.title, e.titleAr)}</h3>
              {e.organization && <p className="mt-1 text-charcoal/80">{pick(locale, e.organization, e.organizationAr)}</p>}
              {e.description && <p className="mt-4 leading-relaxed text-taupe-ink">{pick(locale, e.description, e.descriptionAr)}</p>}
              {proj && e.project && (
                <Link
                  href={`/${locale}/projects/${e.project}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-wine"
                  data-cursor="link"
                >
                  <span className="link-underline">
                    {dict.experience.relatedProject}: {pick(locale, proj.title, proj.titleAr)}
                  </span>
                  <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
