import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { isLocale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionaries";
import { getProjects, publicFileExists } from "@/lib/projects/load";
import { site } from "@/content/site";
import { skillGroups } from "@/content/skills";
import { timeline } from "@/content/experience";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import SkillsSection from "@/components/home/SkillsSection";
import ExperienceTimeline from "@/components/home/ExperienceTimeline";
import ContactSection from "@/components/home/ContactSection";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ButtonLink from "@/components/ui/Button";
import { toCardData } from "@/components/projects/types";

const HOME_PROJECT_LIMIT = 6;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const projects = getProjects();
  // Featured first, then by displayOrder
  const ordered = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured) || a.displayOrder - b.displayOrder);
  const cards = ordered.map(toCardData);
  const awardCount = timeline.filter((e) => e.type === "award").length;
  const cvAvailable = publicFileExists(site.cvPath);
  const photoAvailable = publicFileExists(site.photo);
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const projectTitles = Object.fromEntries(projects.map((p) => [p.slug, { title: p.title, titleAr: p.titleAr }]));

  return (
    <>
      <Hero locale={locale} dict={dict} projectCount={projects.length} awardCount={awardCount} />
      <About locale={locale} dict={dict} cvAvailable={cvAvailable} photoAvailable={photoAvailable} />

      <section id="projects" aria-labelledby="projects-title" className="relative bg-paper/60 py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            locale={locale}
            number={2}
            id="projects-title"
            title={dict.projects.title}
            echo={locale === "en" ? "المشاريع المختارة" : "Selected Projects"}
          />
          <div className="reveal mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <p className="max-w-xl text-lg leading-relaxed text-taupe-ink">{dict.projects.intro}</p>
            {projects.length > HOME_PROJECT_LIMIT && (
              <ButtonLink href={`/${locale}/projects`} variant="ghost" cursor="link">
                <span className="link-underline text-wine">{dict.projects.viewAll}</span>
                <Arrow className="h-4 w-4 text-wine" aria-hidden="true" />
              </ButtonLink>
            )}
          </div>
          <div className="mt-10">
            <ProjectGrid locale={locale} dict={dict} projects={cards} limit={HOME_PROJECT_LIMIT} />
          </div>
          <div className="mt-12 flex justify-center">
            <ButtonLink href={`/${locale}/projects`} variant="outline" cursor="link">
              {dict.projects.viewAll}
              <Arrow className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="skills" aria-labelledby="skills-title" className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <SectionHeading locale={locale} number={3} id="skills-title" title={dict.skills.title} echo={locale === "en" ? "المهارات" : "Skills"} cat />
          <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-taupe-ink">{dict.skills.intro}</p>
          <SkillsSection
            locale={locale}
            dict={dict}
            groups={skillGroups}
            projects={projects.map((p) => ({ slug: p.slug, title: p.title, titleAr: p.titleAr, technologies: p.technologies }))}
          />
        </div>
      </section>

      <section id="experience" aria-labelledby="experience-title" className="bg-paper/60 py-24 sm:py-32">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            locale={locale}
            number={4}
            id="experience-title"
            title={dict.experience.title}
            echo={locale === "en" ? "الخبرات" : "Experience"}
          />
          <p className="reveal mt-6 text-lg text-taupe-ink">{dict.experience.subtitle}</p>
          <ExperienceTimeline locale={locale} dict={dict} entries={timeline} projectTitles={projectTitles} />
        </div>
      </section>

      <ContactSection locale={locale} dict={dict} number={5} cvAvailable={cvAvailable} />
    </>
  );
}
