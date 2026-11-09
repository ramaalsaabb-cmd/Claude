import Link from "next/link";
import { ArrowLeft, ArrowRight, Trophy, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n";
import { pick, sectionNumber } from "@/lib/i18n";
import { type Dictionary, fmt } from "@/content/dictionaries";
import type { ResolvedProject, ResolvedVideo, ResolvedImage } from "@/lib/projects/load";
import ProjectCover from "./ProjectCover";
import ProjectGallery, { type GalleryImage } from "./ProjectGallery";
import VideoPlayer from "./VideoPlayer";
import YouTubeEmbed from "./YouTubeEmbed";
import OptionalModelViewer from "./OptionalModelViewer";
import ProjectCard from "./ProjectCard";
import { toCardData } from "./types";
import CatSilhouette from "@/components/cat/CatSilhouette";

type Props = {
  project: ResolvedProject;
  locale: Locale;
  dict: Dictionary;
  position: number;
  total: number;
  previous?: ResolvedProject;
  next?: ResolvedProject;
  related: ResolvedProject[];
  /** slug → 0-based position in the published list (for card numbering) */
  positions: Record<string, number>;
};

const paragraphs = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v : v ? v.split(/\n{2,}/) : []).map((p) => p.trim()).filter(Boolean);

type Block = {
  id: string;
  title: string;
  body: string[];
  list: string[];
  images: GalleryImage[];
  videos: ResolvedVideo[];
  layout: "split" | "wide";
  extra?: React.ReactNode;
};

export default function ProjectDetail({ project: p, locale, dict, position, total, previous, next, related, positions }: Props) {
  const t = dict.project;
  const isAr = locale === "ar";
  const title = pick(locale, p.title, p.titleAr);
  const accent = p.theme?.accent ?? "#882A2A";
  const Back = isAr ? ArrowRight : ArrowLeft;

  const localImage = (img: ResolvedImage): GalleryImage => ({
    src: img.src,
    alt: pick(locale, img.alt, img.altAr),
    caption: img.caption ? pick(locale, img.caption, img.captionAr) : undefined,
    width: img.width,
    height: img.height,
  });

  const galleryLabels = {
    close: dict.a11y.closeViewer,
    next: dict.a11y.nextImage,
    previous: dict.a11y.previousImage,
    zoomIn: dict.a11y.zoomIn,
    zoomOut: dict.a11y.zoomOut,
    imageOf: dict.a11y.imageOf,
  };

  // ---- Build the ordered list of sections (only those with real content) ----
  const blocks: Block[] = p.sections.map((s) => ({
    id: s.id,
    title: pick(locale, s.title, s.titleAr),
    body: paragraphs(isAr && s.bodyAr && paragraphs(s.bodyAr).length ? s.bodyAr : s.body),
    list: isAr && s.listAr?.length ? s.listAr : s.list ?? [],
    images: s.images.map(localImage),
    videos: s.videos,
    layout: s.layout ?? (s.images.length + s.videos.length > 0 && !(s.body || s.list?.length) ? "wide" : "split"),
  }));

  const sectionIds = new Set(p.sections.map((s) => s.id));
  const roleText = paragraphs(isAr && p.roleAr ? p.roleAr : p.role);
  if (roleText.length && !sectionIds.has("role") && !sectionIds.has("contributions")) {
    blocks.push({ id: "role", title: t.role, body: roleText, list: [], images: [], videos: [], layout: "split" });
  }
  if (p.gallery.length) {
    blocks.push({ id: "gallery", title: t.gallery, body: [], list: [], images: p.gallery.map(localImage), videos: [], layout: "wide" });
  }
  if (p.videos.length) {
    blocks.push({ id: "videos", title: t.videos, body: [], list: [], images: [], videos: p.videos, layout: "wide" });
  }
  if (p.achievements.length && !sectionIds.has("achievement")) {
    blocks.push({
      id: "achievements",
      title: t.achievements,
      body: [],
      list: p.achievements.map((a) => [pick(locale, a.title, a.titleAr), a.event && pick(locale, a.event, a.eventAr)].filter(Boolean).join(" — ")),
      images: [],
      videos: [],
      layout: "split",
    });
  }
  if (p.model3D) {
    blocks.push({
      id: "model",
      title: t.model,
      body: [],
      list: [],
      images: [],
      videos: [],
      layout: "wide",
      extra: (
        <OptionalModelViewer src={p.model3D.src} poster={p.model3D.poster} alt={pick(locale, p.model3D.alt, p.model3D.altAr)} hint={t.modelHint} />
      ),
    });
  }

  const overview = paragraphs(isAr && p.overviewAr ? p.overviewAr : p.overview);
  const heroImage = p.heroImage
    ? { src: p.heroImage, alt: title }
    : p.cover
      ? { src: p.cover.src, alt: p.cover.alt }
      : null;
  const heroIsPoster = p.theme?.motif === "poster" || (p.cover?.height ?? 0) > (p.cover?.width ?? 1);

  const renderVideo = (v: ResolvedVideo, key: string) => {
    const vt = pick(locale, v.title, v.titleAr);
    const cap = v.caption ? pick(locale, v.caption, v.captionAr) : undefined;
    return v.youtubeId ? (
      <YouTubeEmbed key={key} id={v.youtubeId} title={vt} caption={cap} poster={v.poster} playLabel={fmt(dict.a11y.playVideo, { title: vt })} watchLabel={t.watchOnYouTube} />
    ) : (
      <VideoPlayer
        key={key}
        src={v.src}
        webm={v.webm}
        poster={v.poster}
        title={vt}
        caption={cap}
        aspectRatio={v.aspectRatio}
        playLabel={fmt(dict.a11y.playVideo, { title: vt })}
        unsupportedLabel={t.videoUnsupported}
      />
    );
  };

  return (
    <article style={{ "--accent": accent } as React.CSSProperties} className="pb-10">
      {/* ---------- Hero ---------- */}
      <header className="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-32 lg:px-12">
        <Link href={`/${locale}/projects`} className="fade-up inline-flex items-center gap-2 text-sm text-taupe-ink hover:text-wine" data-cursor="link">
          <Back className="h-4 w-4" aria-hidden="true" />
          <span className="link-underline">{t.backToProjects}</span>
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="fade-up flex flex-wrap items-center gap-3 text-xs font-medium text-taupe-ink" style={{ "--d": "80ms" } as React.CSSProperties}>
              <span>
                {sectionNumber(position, locale)} / {sectionNumber(total, locale)}
              </span>
              <span className="h-px w-8 bg-beige" aria-hidden="true" />
              <span className="tracking-label uppercase text-[var(--accent)]">{pick(locale, p.category, p.categoryAr)}</span>
            </p>
            <h1 className="mt-5 font-serif text-[clamp(3.2rem,9vw,8rem)] leading-[0.95] text-charcoal">
              <span className="split-line">
                <span style={{ "--d": "150ms" } as React.CSSProperties}>{title}</span>
              </span>
              {!isAr && p.titleAr && p.titleAr !== p.title && (
                <span lang="ar" className="fade-up mt-2 block font-display-ar text-[0.38em] leading-tight text-taupe-ink" style={{ "--d": "400ms" } as React.CSSProperties}>
                  {p.titleAr}
                </span>
              )}
              {isAr && p.titleAr !== p.title && (
                <span lang="en" className="fade-up mt-2 block font-serif-latin text-[0.38em] leading-tight text-taupe-ink" style={{ "--d": "400ms" } as React.CSSProperties}>
                  {p.title}
                </span>
              )}
            </h1>
            <p className="fade-up mt-7 max-w-2xl text-lg leading-relaxed text-charcoal/80 sm:text-xl" style={{ "--d": "450ms" } as React.CSSProperties}>
              {pick(locale, p.description, p.descriptionAr)}
            </p>
          </div>

          <dl className="fade-up grid grid-cols-2 gap-6 border-t border-beige pt-6 text-sm lg:col-span-4 lg:grid-cols-1 lg:border-s lg:border-t-0 lg:ps-8 lg:pt-0" style={{ "--d": "550ms" } as React.CSSProperties}>
            {p.year && (
              <div>
                <dt className="text-xs uppercase tracking-label text-taupe-ink">{t.year}</dt>
                <dd className="mt-1 text-charcoal">{p.year}</dd>
              </div>
            )}
            {p.engine?.length ? (
              <div>
                <dt className="text-xs uppercase tracking-label text-taupe-ink">{t.engine}</dt>
                <dd className="mt-1 text-charcoal" lang="en">{p.engine.join(" · ")}</dd>
              </div>
            ) : null}
            {p.achievements[0] && (
              <div className="col-span-2 lg:col-span-1">
                <dt className="sr-only">{t.achievements}</dt>
                <dd className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-cream">
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                  {pick(locale, p.achievements[0].title, p.achievements[0].titleAr)}
                  {p.achievements[0].event && ` · ${pick(locale, p.achievements[0].event, p.achievements[0].eventAr)}`}
                </dd>
              </div>
            )}
            {p.technologies.length > 0 && (
              <div className="col-span-2 lg:col-span-1">
                <dt className="text-xs uppercase tracking-label text-taupe-ink">{t.technologies}</dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-1.5" lang="en">
                    {p.technologies.map((tech) => (
                      <li key={tech} className="rounded-full border border-beige bg-paper px-2.5 py-1 text-xs text-charcoal/80">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* hero media */}
        <div className="fade-up mt-12" style={{ "--d": "650ms" } as React.CSSProperties}>
          {p.heroVideo ? (
            renderVideo(p.heroVideo, "hero")
          ) : (
            <div className={`group relative overflow-hidden rounded-[28px] border border-beige ${heroIsPoster && heroImage ? "aspect-[4/3] sm:aspect-[16/9]" : "aspect-[16/9]"}`}>
              <ProjectCover
                title={p.title}
                titleAr={p.titleAr}
                cover={heroImage}
                theme={p.theme}
                sizes="(min-width: 1400px) 1320px, 100vw"
                priority
                fit={heroIsPoster ? "contain" : "cover"}
              />
            </div>
          )}
        </div>

        {p.inProgress && (
          <p className="mt-6 flex items-start gap-3 rounded-2xl border border-dashed border-beige px-5 py-4 text-sm text-taupe-ink">
            <CatSilhouette className="mt-0.5 h-5 w-4 shrink-0 text-charcoal" />
            {t.inProgress}
          </p>
        )}
      </header>

      {/* ---------- Body ---------- */}
      <div className="mx-auto mt-20 grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        {/* section index */}
        {blocks.length > 2 && (
          <nav aria-label={dict.a11y.sectionIndex} className="hidden lg:col-span-3 lg:block">
            <ol className="sticky top-28 space-y-2 border-s border-beige ps-5 text-sm">
              {overview.length > 0 && !sectionIds.has("overview") && (
                <li>
                  <a href="#overview" className="text-taupe-ink hover:text-wine" data-cursor="link">
                    {isAr ? "نظرة عامة" : "Overview"}
                  </a>
                </li>
              )}
              {blocks.map((b, i) => (
                <li key={b.id}>
                  <a href={`#${b.id}`} className="group flex gap-3 text-taupe-ink hover:text-wine" data-cursor="link">
                    <span className="tabular-nums text-taupe-ink group-hover:text-wine">{sectionNumber(i + 1, locale)}</span>
                    {b.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className={`space-y-24 ${blocks.length > 2 ? "lg:col-span-9" : "lg:col-span-10 lg:col-start-2"}`}>
          {overview.length > 0 && !sectionIds.has("overview") && (
            <section id="overview" className="reveal scroll-mt-28">
              <div className="space-y-5 font-serif text-2xl leading-snug text-charcoal sm:text-3xl">
                {overview.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {blocks.map((b, i) => {
            const hasMedia = b.images.length > 0 || b.videos.length > 0 || !!b.extra;
            const hasText = b.body.length > 0 || b.list.length > 0;
            const split = b.layout === "split" && hasMedia && hasText;
            return (
              <section key={b.id} id={b.id} aria-labelledby={`${b.id}-title`} className="reveal scroll-mt-28">
                <div className="mb-8 flex items-baseline gap-4">
                  <span className="font-sans text-sm tabular-nums text-[var(--accent)]">{sectionNumber(i + 1, locale)}</span>
                  <span className="h-px w-8 bg-beige" aria-hidden="true" />
                  <h2 id={`${b.id}-title`} className="font-serif text-3xl text-charcoal sm:text-4xl">
                    {b.title}
                  </h2>
                </div>
                <div className={split ? "grid gap-8 md:grid-cols-2 md:items-start" : "space-y-8"}>
                  {hasText && (
                    <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-charcoal/80">
                      {b.body.map((para, j) => (
                        <p key={j}>{para}</p>
                      ))}
                      {b.list.length > 0 && (
                        <ul className="grid gap-x-8 gap-y-2.5 pt-1 sm:grid-cols-2">
                          {b.list.map((li) => (
                            <li key={li} className="flex items-start gap-3 text-base text-charcoal/85">
                              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                              {li}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  {b.images.length > 0 && (
                    <ProjectGallery
                      images={b.images}
                      labels={galleryLabels}
                      rtl={isAr}
                      layout={b.id === "gallery" ? "grid" : b.images.length === 1 ? "single" : "row"}
                    />
                  )}
                  {b.videos.length > 0 && <div className="space-y-10">{b.videos.map((v, j) => renderVideo(v, `${b.id}-${j}`))}</div>}
                  {b.extra}
                </div>
              </section>
            );
          })}

          {(p.githubUrl || p.demoUrl) && (
            <section aria-label={t.links} className="reveal flex flex-wrap gap-4">
              {p.githubUrl && (
                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" data-cursor="paw" className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-6 py-3 text-sm hover:border-wine hover:text-wine">
                  <GitHubIcon className="h-4 w-4" />
                  {t.github}
                </a>
              )}
              {p.demoUrl && (
                <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" data-cursor="paw" className="inline-flex items-center gap-2 rounded-full bg-wine px-6 py-3 text-sm text-cream hover:bg-wine-deep">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {t.demo}
                </a>
              )}
            </section>
          )}
        </div>
      </div>

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <h2 id="related-title" className="reveal mb-10 font-serif text-4xl text-charcoal">
            {t.related}
          </h2>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <li key={r.slug} className="reveal" style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
                <ProjectCard
                  project={toCardData(r)}
                  locale={locale}
                  index={positions[r.slug] ?? 0}
                  size="small"
                  viewLabel={dict.projects.viewProject}
                  openLabel={fmt(dict.a11y.openProject, { title: pick(locale, r.title, r.titleAr) })}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- Prev / Next ---------- */}
      {previous && next && (
        <nav aria-label={`${t.previous} / ${t.next}`} className="mx-auto mt-24 grid max-w-[1400px] gap-px overflow-hidden border-y border-beige bg-beige sm:grid-cols-2">
          {[
            { p: previous, label: t.previous, align: "text-start", Icon: isAr ? ArrowRight : ArrowLeft },
            { p: next, label: t.next, align: "text-end sm:items-end", Icon: isAr ? ArrowLeft : ArrowRight },
          ].map(({ p: q, label, align, Icon }) => (
            <Link
              key={label}
              href={`/${locale}/projects/${q.slug}`}
              data-cursor="project"
              data-cursor-label={dict.projects.viewProject}
              className={`group flex flex-col gap-2 bg-cream px-6 py-10 transition-colors hover:bg-paper sm:px-12 ${align}`}
            >
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-label text-taupe-ink">
                {label === t.previous && <Icon className="h-4 w-4" aria-hidden="true" />}
                {label}
                {label === t.next && <Icon className="h-4 w-4" aria-hidden="true" />}
              </span>
              <span className="font-serif text-3xl text-charcoal transition-colors group-hover:text-wine sm:text-4xl">
                {pick(locale, q.title, q.titleAr)}
              </span>
            </Link>
          ))}
        </nav>
      )}
    </article>
  );
}
