import Link from "next/link";
import { GraduationCap, Trophy, Briefcase, Award, Code2, BookOpen, Users, ArrowUpRight } from "lucide-react";
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
  leadership: Users,
};

type GroupId = "education" | "experience" | "awards" | "training" | "leadership";
const GROUP_OF: Record<TimelineType, GroupId> = {
  education: "education",
  internship: "experience",
  coop: "experience",
  role: "experience",
  award: "awards",
  competition: "awards",
  hackathon: "awards",
  bootcamp: "training",
  certification: "training",
  leadership: "leadership",
};
const GROUP_ORDER: GroupId[] = ["education", "experience", "awards", "training", "leadership"];

type Props = {
  locale: Locale;
  dict: Dictionary;
  entries: TimelineEntry[];
  projectTitles: Record<string, { title: string; titleAr?: string }>;
};

/** Grouped timeline. Empty groups are hidden, so new types appear as soon as an entry exists. */
export default function ExperienceTimeline({ locale, dict, entries, projectTitles }: Props) {
  const groups = GROUP_ORDER.map((g) => ({ id: g, items: entries.filter((e) => GROUP_OF[e.type] === g) })).filter((g) => g.items.length);

  return (
    <div className="mt-14 space-y-16">
      {groups.map((g) => {
        const compact = g.id === "training" || g.id === "leadership";
        return (
          <section key={g.id} aria-labelledby={`exp-${g.id}`}>
            <h3 id={`exp-${g.id}`} className="reveal mb-6 flex items-center gap-4 font-serif text-2xl text-charcoal sm:text-3xl">
              {dict.experience.groups[g.id]}
              <span className="h-px flex-1 bg-beige" aria-hidden="true" />
              <span className="font-sans text-xs text-taupe-ink">{String(g.items.length).padStart(2, "0")}</span>
            </h3>

            {compact ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {g.items.map((e, i) => {
                  const Icon = ICONS[e.type];
                  return (
                    <li
                      key={e.id}
                      className="reveal flex gap-4 rounded-[18px] border border-beige bg-paper p-5"
                      style={{ "--reveal-delay": `${i * 50}ms` } as React.CSSProperties}
                    >
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-wine ring-1 ring-beige">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium leading-snug text-charcoal">{pick(locale, e.title, e.titleAr)}</p>
                        {e.organization && <p className="mt-0.5 text-sm text-charcoal/75">{pick(locale, e.organization, e.organizationAr)}</p>}
                        {e.period && <p className="mt-1 text-xs text-taupe-ink">{pick(locale, e.period, e.periodAr)}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ol className="relative space-y-6 before:absolute before:inset-y-2 before:start-[23px] before:w-px before:bg-beige">
                {g.items.map((e, i) => {
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
                        <h4 className="font-serif text-2xl leading-snug text-charcoal sm:text-3xl">{pick(locale, e.title, e.titleAr)}</h4>
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
            )}
          </section>
        );
      })}
    </div>
  );
}
