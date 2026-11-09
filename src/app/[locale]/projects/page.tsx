import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getDictionary, plural } from "@/content/dictionaries";
import { getProjects } from "@/lib/projects/load";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { toCardData } from "@/components/projects/types";
import CatSilhouette from "@/components/cat/CatSilhouette";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.projects.allTitle,
    description: dict.projects.intro,
    alternates: {
      canonical: `/${locale}/projects`,
      languages: { en: "/en/projects", ar: "/ar/projects" },
    },
    openGraph: { title: dict.projects.allTitle, description: dict.projects.intro, url: `/${locale}/projects` },
  };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const cards = getProjects().map(toCardData);

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-36 sm:px-8 lg:px-12">
      <header className="relative mb-14 max-w-3xl">
        <p className="fade-up tracking-label text-xs font-semibold uppercase text-wine">{plural(dict.projects.count, cards.length, locale)}</p>
        <h1 className="mt-4 font-serif text-6xl leading-none text-charcoal sm:text-8xl">
          <span className="split-line">
            <span style={{ "--d": "100ms" } as React.CSSProperties}>{dict.projects.allTitle}</span>
          </span>
        </h1>
        <p className="fade-up mt-6 text-lg leading-relaxed text-taupe-ink" style={{ "--d": "300ms" } as React.CSSProperties}>
          {dict.projects.intro}
        </p>
        <CatSilhouette className="absolute -top-4 end-[-60px] hidden h-16 w-12 text-charcoal lg:block" />
      </header>
      <ProjectGrid locale={locale} dict={dict} projects={cards} headingLevel="h2" />
    </div>
  );
}
