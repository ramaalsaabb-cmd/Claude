import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, pick } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionaries";
import { getProjects, getProject, getAdjacentProjects, getRelatedProjects } from "@/lib/projects/load";
import ProjectDetail from "@/components/projects/ProjectDetail";

/** Every published project gets a pre-rendered page in both languages. */
export function generateStaticParams() {
  const projects = getProjects();
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const p = getProject(slug);
  if (!p) return {};
  const title = pick(locale, p.title, p.titleAr);
  const description = pick(locale, p.description, p.descriptionAr);
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: { en: `/en/projects/${slug}`, ar: `/ar/projects/${slug}` },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/${locale}/projects/${slug}`,
      ...(p.cover ? { images: [{ url: p.cover.src, alt: p.cover.alt }] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = getProject(slug);
  if (!project) notFound();

  const all = getProjects();
  const { previous, next } = getAdjacentProjects(slug);
  return (
    <ProjectDetail
      project={project}
      locale={locale}
      dict={getDictionary(locale)}
      position={all.findIndex((p) => p.slug === slug) + 1}
      total={all.length}
      previous={previous}
      next={next}
      related={getRelatedProjects(project)}
      positions={Object.fromEntries(all.map((p, i) => [p.slug, i]))}
    />
  );
}
