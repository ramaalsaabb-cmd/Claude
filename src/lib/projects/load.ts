import fs from "node:fs";
import path from "node:path";
import { projectSchema, type Project, type ProjectImage, type ProjectVideo, type ProjectSection } from "./schema";
import manifest from "@/content/media-manifest.json";

/**
 * Loads every project entry from src/content/projects/*.json.
 *
 * - Files whose name starts with "_" (like _template.json) are ignored.
 * - Entries are validated with zod; build fails with a readable message on errors.
 * - Media that doesn't exist in /public is dropped, so missing assets never
 *   render as broken images. Add the file and rebuild — it appears automatically.
 */

const PROJECTS_DIR = path.join(process.cwd(), "src", "content", "projects");
const PUBLIC_DIR = path.join(process.cwd(), "public");

type MediaInfo = { width?: number; height?: number; duration?: number };
const mediaManifest = manifest as Record<string, MediaInfo>;

export type ResolvedImage = ProjectImage & { width?: number; height?: number };
export type ResolvedVideo = ProjectVideo & { aspectRatio: number };
export type ResolvedSection = Omit<ProjectSection, "images" | "videos"> & {
  images: ResolvedImage[];
  videos: ResolvedVideo[];
};
export type ResolvedProject = Omit<Project, "gallery" | "videos" | "sections" | "heroVideo" | "model3D"> & {
  gallery: ResolvedImage[];
  videos: ResolvedVideo[];
  sections: ResolvedSection[];
  heroVideo?: ResolvedVideo;
  model3D?: Project["model3D"];
  /** Best available cover image, or null to use the generated cover. */
  cover: ResolvedImage | null;
};

export function publicFileExists(publicPath: string | undefined | null): boolean {
  if (!publicPath || publicPath.startsWith("http")) return false;
  const rel = decodeURI(publicPath.split("?")[0]).replace(/^\/+/, "");
  const full = path.join(PUBLIC_DIR, rel);
  if (!full.startsWith(PUBLIC_DIR)) return false;
  try {
    return fs.statSync(full).isFile();
  } catch {
    return false;
  }
}

function resolveImage(img: ProjectImage): ResolvedImage | null {
  if (!publicFileExists(img.src)) return null;
  const info = mediaManifest[img.src];
  return { ...img, width: info?.width, height: info?.height };
}

function resolveVideo(video: ProjectVideo): ResolvedVideo | null {
  const hasFile = video.src ? publicFileExists(video.src) : false;
  if (!hasFile && !video.youtubeId) return null;
  const info = video.src ? mediaManifest[video.src] : undefined;
  const aspectRatio =
    video.aspectRatio ?? (info?.width && info?.height ? info.width / info.height : 16 / 9);
  return {
    ...video,
    src: hasFile ? video.src : undefined,
    webm: video.webm && publicFileExists(video.webm) ? video.webm : undefined,
    poster: video.poster && publicFileExists(video.poster) ? video.poster : undefined,
    aspectRatio,
  };
}

const notNull = <T,>(v: T | null): v is T => v !== null;

function hasText(v: string | string[] | undefined): boolean {
  if (!v) return false;
  return Array.isArray(v) ? v.some((p) => p.trim().length > 0) : v.trim().length > 0;
}

function resolveProject(p: Project): ResolvedProject {
  const gallery = p.gallery.map(resolveImage).filter(notNull);
  const videos = p.videos.map(resolveVideo).filter(notNull);
  const sections: ResolvedSection[] = p.sections
    .map((s) => ({
      ...s,
      images: (s.images ?? []).map(resolveImage).filter(notNull),
      videos: (s.videos ?? []).map(resolveVideo).filter(notNull),
    }))
    // Hide sections that have nothing verified to show yet.
    .filter((s) => hasText(s.body) || (s.list?.length ?? 0) > 0 || s.images.length > 0 || s.videos.length > 0);

  const heroVideo = p.heroVideo ? resolveVideo(p.heroVideo) ?? undefined : undefined;
  const model3D = p.model3D && publicFileExists(p.model3D.src) ? p.model3D : undefined;

  const explicit = [p.coverImage, p.heroImage]
    .filter((src): src is string => !!src && publicFileExists(src))
    .map<ResolvedImage>((src) => ({
      src,
      alt: p.coverAlt ?? p.title,
      altAr: p.coverAltAr,
      width: mediaManifest[src]?.width,
      height: mediaManifest[src]?.height,
    }));
  const posterFallback = [...videos, ...sections.flatMap((s) => s.videos)]
    .filter((v) => v.poster)
    .map<ResolvedImage>((v) => ({ src: v.poster!, alt: v.title }));

  const cover = p.graphicCover
    ? null
    : explicit[0] ?? gallery[0] ?? sections.flatMap((s) => s.images)[0] ?? posterFallback[0] ?? null;

  return { ...p, gallery, videos, sections, heroVideo, model3D, cover };
}

let cache: ResolvedProject[] | null = null;

function readAll(): ResolvedProject[] {
  if (cache && process.env.NODE_ENV === "production") return cache;

  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .sort();

  const projects: Project[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      throw new Error(`[projects] ${file} is not valid JSON: ${(e as Error).message}`);
    }
    const parsed = projectSchema.safeParse(json);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(`[projects] ${file} has invalid content:\n${issues}`);
    }
    return parsed.data;
  });

  const seen = new Set<string>();
  for (const p of projects) {
    if (seen.has(p.slug)) throw new Error(`[projects] Duplicate slug "${p.slug}".`);
    seen.add(p.slug);
  }

  cache = projects
    .map(resolveProject)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title));
  return cache;
}

/** Published projects, ordered by displayOrder. */
export function getProjects(): ResolvedProject[] {
  return readAll().filter((p) => p.published);
}

export function getProject(slug: string): ResolvedProject | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const list = getProjects();
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1 || list.length < 2) return { previous: undefined, next: undefined };
  return {
    previous: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}

export function getRelatedProjects(project: ResolvedProject, limit = 3): ResolvedProject[] {
  const others = getProjects().filter((p) => p.slug !== project.slug);
  if (project.related?.length) {
    return project.related
      .map((s) => others.find((p) => p.slug === s))
      .filter((p): p is ResolvedProject => !!p)
      .slice(0, limit);
  }
  return others
    .map((p) => ({ p, score: p.categories.filter((c) => project.categories.includes(c)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.p.displayOrder - b.p.displayOrder)
    .slice(0, limit)
    .map((x) => x.p);
}
