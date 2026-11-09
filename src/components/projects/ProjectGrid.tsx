"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Locale } from "@/lib/i18n";
import { pick } from "@/lib/i18n";
import { type Dictionary, fmt, plural } from "@/content/dictionaries";
import { projectCategories, type ProjectCategory } from "@/lib/projects/categories";
import ProjectCard from "./ProjectCard";
import ProjectFilters from "./ProjectFilters";
import type { ProjectCardData } from "./types";

type Filter = "all" | ProjectCategory;
type Props = { locale: Locale; dict: Dictionary; projects: ProjectCardData[]; limit?: number; headingLevel?: "h2" | "h3" };

/**
 * Editorial rows that alternate pairs and trios: [7/5] [4/4/4] [5/7] [4/4/4] …
 * A lonely last card is avoided by turning the previous trio into two pairs.
 */
function layoutRows(items: ProjectCardData[]) {
  const sizes: number[] = [];
  let left = items.length;
  for (let r = 0; left > 0; r++) {
    const want = r % 2 === 0 ? 2 : 3;
    const take = Math.min(want, left);
    sizes.push(take);
    left -= take;
  }
  const n = sizes.length;
  if (n > 1 && sizes[n - 1] === 1 && sizes[n - 2] === 3) {
    sizes[n - 2] = 2;
    sizes[n - 1] = 2;
  } else if (n > 1 && sizes[n - 1] === 1 && sizes[n - 2] === 2) {
    sizes[n - 2] = 3;
    sizes.pop();
  }

  type Cell = { item: ProjectCardData; span: string; size: "large" | "medium" | "small" };
  const out: Cell[] = [];
  let i = 0;
  let pairCount = 0;
  sizes.forEach((size, r) => {
    const row = items.slice(i, i + size);
    i += size;
    if (size === 3) {
      row.forEach((item) => out.push({ item, span: "lg:col-span-4", size: "small" }));
    } else if (size === 2) {
      // pairs placed where a trio would normally be get an even split
      const even = r % 2 === 1;
      const flip = pairCount % 2 === 1;
      pairCount++;
      if (even) row.forEach((item) => out.push({ item, span: "lg:col-span-6", size: "medium" }));
      else {
        out.push({ item: row[0], span: flip ? "lg:col-span-5" : "lg:col-span-7", size: flip ? "medium" : "large" });
        out.push({ item: row[1], span: flip ? "lg:col-span-7" : "lg:col-span-5", size: flip ? "large" : "medium" });
      }
    } else {
      out.push({ item: row[0], span: "lg:col-span-8 lg:col-start-3", size: "large" });
    }
  });
  return out;
}

export default function ProjectGrid({ locale, dict, projects, limit, headingLevel = "h3" }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const reduce = useReducedMotion();

  // Restore filter from ?filter= without a reload
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const f = new URLSearchParams(window.location.search).get("filter");
      if (f && (projectCategories as readonly string[]).includes(f)) setFilter(f as Filter);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const select = (f: Filter) => {
    setFilter(f);
    const url = new URL(window.location.href);
    if (f === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", f);
    window.history.replaceState(window.history.state, "", url);
  };

  const available = useMemo(
    () => projectCategories.filter((c) => projects.some((p) => p.categories.includes(c))),
    [projects],
  );
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: projects.length };
    for (const c of projectCategories) m[c] = projects.filter((p) => p.categories.includes(c)).length;
    return m;
  }, [projects]);

  const visible = useMemo(() => {
    const list = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));
    return limit ? list.slice(0, limit) : list;
  }, [filter, projects, limit]);

  const laid = layoutRows(visible);

  return (
    <div>
      <ProjectFilters
        filters={["all", ...available]}
        active={filter}
        onSelect={select}
        labels={dict.projects.filters}
        counts={counts}
        ariaLabel={dict.a11y.projectFilters}
      />
      <p className="sr-only" aria-live="polite">
        {plural(dict.projects.count, visible.length, locale)}
      </p>

      <motion.ul layout={!reduce} className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-7">
        <AnimatePresence mode="popLayout" initial={false}>
          {laid.map(({ item, span, size }, idx) => (
            <motion.li
              key={item.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={span}
            >
              <ProjectCard
                project={item}
                locale={locale}
                index={projects.indexOf(item)}
                size={size}
                priority={idx < 2}
                headingLevel={headingLevel}
                viewLabel={dict.projects.viewProject}
                openLabel={fmt(dict.a11y.openProject, { title: pick(locale, item.title, item.titleAr) })}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {visible.length === 0 && <p className="mt-10 text-taupe-ink">{dict.projects.empty}</p>}
    </div>
  );
}
