import type { ResolvedProject } from "@/lib/projects/load";
import type { CoverTheme } from "./ProjectCover";
import type { ProjectCategory } from "@/lib/projects/categories";

/** The small, serialisable slice of a project that cards & the grid need. */
export type ProjectCardData = {
  slug: string;
  title: string;
  titleAr?: string;
  category: string;
  categoryAr?: string;
  categories: ProjectCategory[];
  description: string;
  descriptionAr?: string;
  technologies: string[];
  featured: boolean;
  achievement?: { title: string; titleAr?: string; event?: string; eventAr?: string };
  cover: { src: string; alt: string } | null;
  theme?: CoverTheme;
};

export function toCardData(p: ResolvedProject): ProjectCardData {
  return {
    slug: p.slug,
    title: p.title,
    titleAr: p.titleAr,
    category: p.category,
    categoryAr: p.categoryAr,
    categories: p.categories,
    description: p.description,
    descriptionAr: p.descriptionAr,
    technologies: p.technologies,
    featured: p.featured,
    achievement: p.achievements[0],
    cover: p.cover ? { src: p.cover.src, alt: p.cover.alt } : null,
    theme: p.theme,
  };
}
