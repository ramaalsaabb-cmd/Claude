"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Code2, Glasses, Box, Cpu, Wrench, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { pick } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import type { SkillGroup } from "@/content/skills";

const ICONS = { code: Code2, glasses: Glasses, box: Box, cpu: Cpu, wrench: Wrench };

export type SkillProjectRef = { slug: string; title: string; titleAr?: string; technologies: string[] };

type Props = { locale: Locale; dict: Dictionary; groups: SkillGroup[]; projects: SkillProjectRef[] };

/**
 * Interactive skills: category cards with selectable skill chips.
 * Selecting a skill reveals the published projects where it's actually used
 * (matched against each project's `technologies`). No percentages.
 */
export default function SkillsSection({ locale, dict, groups, projects }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const usage = useMemo(() => {
    const map = new Map<string, SkillProjectRef[]>();
    for (const g of groups)
      for (const s of g.skills) {
        const keys = (s.matches ?? []).map((m) => m.toLowerCase());
        map.set(
          s.name,
          keys.length ? projects.filter((p) => p.technologies.some((t) => keys.includes(t.toLowerCase()))) : [],
        );
      }
    return map;
  }, [groups, projects]);

  return (
    <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
      {groups.map((g, gi) => {
        const Icon = ICONS[g.icon];
        const span = gi < 2 ? "lg:col-span-3" : "lg:col-span-2";
        const active = g.skills.find((s) => s.name === selected);
        const used = active ? usage.get(active.name) ?? [] : [];
        return (
          <article
            key={g.id}
            className={`reveal group relative flex flex-col overflow-hidden rounded-[24px] border bg-paper p-7 transition-[border-color,box-shadow] duration-500 ${span} ${
              active ? "border-wine/50 shadow-[0_24px_50px_-30px_rgba(136,42,42,.45)]" : "border-beige hover:border-taupe/40"
            }`}
            style={{ "--reveal-delay": `${gi * 70}ms` } as React.CSSProperties}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream text-wine ring-1 ring-beige">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-sans text-xs text-taupe-ink">{String(g.skills.length).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-6 font-serif text-2xl text-charcoal">{dict.skills.groups[g.id]}</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {g.skills.map((s) => {
                const isSel = selected === s.name;
                const count = usage.get(s.name)?.length ?? 0;
                return (
                  <li key={s.name}>
                    <button
                      type="button"
                      aria-pressed={isSel}
                      onClick={() => setSelected(isSel ? null : s.name)}
                      data-cursor="link"
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-300 ${
                        isSel
                          ? "border-wine bg-wine text-cream"
                          : "border-beige bg-cream text-charcoal hover:border-wine/60 hover:text-wine"
                      }`}
                    >
                      {pick(locale, s.name, s.nameAr)}
                      {count > 0 && (
                        <span
                          aria-hidden="true"
                          className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ${
                            isSel ? "bg-cream/20 text-cream" : "bg-sand text-taupe-ink"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div aria-live="polite" className={`grid transition-[grid-template-rows] duration-500 ${active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                {active && (
                  <div className="mt-6 border-t border-beige pt-5">
                    <p className="text-xs font-semibold uppercase tracking-label text-wine">
                      {dict.skills.usedIn} · {pick(locale, active.name, active.nameAr)}
                    </p>
                    {used.length ? (
                      <ul className="mt-3 space-y-1">
                        {used.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={`/${locale}/projects/${p.slug}`}
                              className="group/link inline-flex items-center gap-1.5 font-serif text-xl text-charcoal hover:text-wine"
                              data-cursor="link"
                            >
                              {pick(locale, p.title, p.titleAr)}
                              <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-taupe-ink">{dict.skills.noProjects}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
