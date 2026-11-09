import Image from "next/image";
import { MapPin, GraduationCap, Sparkles, Download } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { pick } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink, { HeartIcon } from "@/components/ui/Button";
import CatSilhouette from "@/components/cat/CatSilhouette";
import ContactLinks from "./ContactLinks";

type Props = { locale: Locale; dict: Dictionary; cvAvailable: boolean; photoAvailable: boolean };

export default function About({ locale, dict, cvAvailable, photoAvailable }: Props) {
  const a = dict.about;
  const bio = pick(locale, site.bio, site.bioAr);
  const interests = pick(locale, site.interests, site.interestsAr);

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          locale={locale}
          number={1}
          id="about-title"
          title={a.title}
          echo={locale === "en" ? "نبذة عني" : "About Me"}
          cat
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Visual card */}
          <div className="reveal lg:col-span-5">
            <div className="relative overflow-hidden rounded-[28px] border border-beige bg-paper p-8 sm:p-10">
              {photoAvailable && site.photo ? (
                <div className="relative mb-8 aspect-[4/5] overflow-hidden rounded-2xl">
                  <Image src={site.photo} alt={pick(locale, site.name, site.nameAr)} fill sizes="(min-width: 1024px) 34vw, 90vw" className="object-cover" />
                </div>
              ) : (
                <div aria-hidden="true" className="relative mb-8 flex aspect-[5/4] items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-sand to-beige/70">
                  <span className={`absolute top-6 select-none text-[9rem] leading-none text-paper/80 ${locale === "ar" ? "font-display-ar" : "font-serif"}`}>
                    {locale === "ar" ? "ر" : "R"}
                  </span>
                  <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" fill="none">
                    <path className="draw-line" style={{ "--len": 900 } as React.CSSProperties} d="M-10 250 C 80 200, 140 290, 220 230 C 280 186, 320 210, 410 160" stroke="#882A2A" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <CatSilhouette className="relative mb-6 h-28 w-24 text-charcoal" />
                </div>
              )}
              <p className="font-serif text-3xl leading-tight text-charcoal sm:text-4xl">{a.lead}</p>
              <p lang="en" aria-hidden="true" className="mt-6 whitespace-pre-line font-script text-2xl leading-tight text-taupe-ink">
                {a.note} <HeartIcon className="inline h-4 w-4 text-wine" />
              </p>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-7">
            <div className="reveal space-y-5 text-lg leading-relaxed text-charcoal/85 sm:text-xl">
              {bio.map((p, i) => (
                <p key={i} className={i === 0 ? "text-charcoal" : ""}>
                  {p}
                </p>
              ))}
            </div>

            <dl className="reveal mt-12 grid gap-px overflow-hidden rounded-2xl border border-beige bg-beige sm:grid-cols-2">
              <div className="bg-cream p-6">
                <dt className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-label text-wine">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {a.basedIn}
                </dt>
                <dd className="text-charcoal">{pick(locale, site.location, site.locationAr)}</dd>
              </div>
              <div className="bg-cream p-6">
                <dt className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-label text-wine">
                  <GraduationCap className="h-4 w-4" aria-hidden="true" />
                  {a.education}
                </dt>
                <dd className="text-charcoal">{pick(locale, site.degree, site.degreeAr)}</dd>
                <dd className="text-sm text-taupe-ink">{pick(locale, site.university, site.universityAr)}</dd>
                <dd className="mt-1 text-sm text-taupe-ink">
                  {a.graduation}: {pick(locale, site.graduation, site.graduationAr)}
                </dd>
              </div>
              <div className="bg-cream p-6 sm:col-span-2">
                <dt className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-label text-wine">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {a.interests}
                </dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {interests.map((i) => (
                      <li key={i} className="rounded-full border border-beige bg-paper px-3.5 py-1.5 text-sm text-charcoal">
                        {i}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="bg-cream p-6 sm:col-span-2">
                <dt className="mb-3 text-xs font-semibold uppercase tracking-label text-wine">{a.background}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2" lang="en">
                    {site.background.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-charcoal/85">
                        <span className="h-1 w-1 rounded-full bg-wine" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <div className="reveal mt-10 flex flex-wrap items-center gap-4">
              {cvAvailable && (
                <ButtonLink href={site.cvPath} download>
                  {a.downloadCv}
                  <Download className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              )}
              <ContactLinks dict={dict} compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
