import { z } from "zod";

/**
 * Project content schema.
 * Every file in src/content/projects/*.json (except files starting with "_")
 * is validated against this at build time. A clear error is thrown if a
 * project entry is malformed, so mistakes never reach the live site.
 */

import { projectCategories } from "./categories";
export { projectCategories, type ProjectCategory } from "./categories";

/** A path inside /public, e.g. "/projects/thabat/photos/glove.jpg" */
const publicPath = z
  .string()
  .regex(/^\/[^\s].*$/, "Media paths must start with '/' and point inside /public (no spaces).");

const text = z.string();
const paragraphs = z.union([z.string(), z.array(z.string())]);

export const imageSchema = z.object({
  src: publicPath,
  alt: text,
  altAr: text.optional(),
  caption: text.optional(),
  captionAr: text.optional(),
  /** Original filename supplied by the owner — for traceability only, never rendered. */
  source: z.string().optional(),
});

export const videoSchema = z
  .object({
    /** Self-hosted MP4 (H.264) — the main browser-compatible file. */
    src: publicPath.optional(),
    /** Optional WebM alternative. */
    webm: publicPath.optional(),
    /** YouTube video id (e.g. "bi50n9u4-Bo") for embedded videos. */
    youtubeId: z.string().regex(/^[\w-]{11}$/).optional(),
    poster: publicPath.optional(),
    title: text,
    titleAr: text.optional(),
    caption: text.optional(),
    captionAr: text.optional(),
    /** Width / height, e.g. 16/9 = 1.777. Read from media-manifest.json when omitted. */
    aspectRatio: z.number().positive().optional(),
    source: z.string().optional(),
  })
  .refine((v) => v.src || v.youtubeId, { message: "A video needs either `src` or `youtubeId`." });

export const sectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Section ids use lowercase letters, numbers and dashes."),
  title: text,
  titleAr: text.optional(),
  body: paragraphs.optional(),
  bodyAr: paragraphs.optional(),
  list: z.array(text).optional(),
  listAr: z.array(text).optional(),
  images: z.array(imageSchema).optional(),
  videos: z.array(videoSchema).optional(),
  /** "wide" shows media full width; "split" places text beside media. */
  layout: z.enum(["split", "wide"]).optional(),
});

export const achievementSchema = z.object({
  title: text,
  titleAr: text.optional(),
  event: text.optional(),
  eventAr: text.optional(),
  date: text.optional(),
});

export const themeSchema = z.object({
  /** Accent used for this project's details (defaults to the portfolio's dark red). */
  accent: z.string().optional(),
  /** Background for the generated cover when no cover image exists yet. */
  coverBackground: z.string().optional(),
  coverInk: z.string().optional(),
  /** Decorative motif for the generated cover. */
  motif: z.enum(["dunes", "rings", "poster", "stripes", "grid", "wireframe", "signal", "default"]).optional(),
});

export const projectSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slugs use lowercase letters, numbers and dashes."),
  title: text,
  titleAr: text.optional(),
  /** Short label shown under the title, e.g. "Mixed Reality / Robotics". */
  category: text,
  categoryAr: text.optional(),
  /** Filter groups — a project can belong to several. */
  categories: z.array(z.enum(projectCategories)).min(1),
  year: z.union([z.string(), z.number()]).optional(),
  description: text,
  descriptionAr: text.optional(),
  overview: paragraphs.optional(),
  overviewAr: paragraphs.optional(),
  role: paragraphs.optional(),
  roleAr: paragraphs.optional(),
  /** Main tools, e.g. ["Unreal Engine"] — shown as "Built with". */
  engine: z.array(text).optional(),
  technologies: z.array(text).default([]),
  coverImage: publicPath.optional(),
  /** Alt text for coverImage (falls back to the title). */
  coverAlt: text.optional(),
  coverAltAr: text.optional(),
  /** true = always use the designed graphic cover (theme motif), even when photos exist. */
  graphicCover: z.boolean().default(false),
  heroImage: publicPath.optional(),
  heroVideo: videoSchema.optional(),
  gallery: z.array(imageSchema).default([]),
  videos: z.array(videoSchema).default([]),
  sections: z.array(sectionSchema).default([]),
  model3D: z
    .object({
      src: publicPath.regex(/\.(glb|gltf)$/i, "3D models must be .glb or .gltf"),
      poster: publicPath.optional(),
      alt: text,
      altAr: text.optional(),
    })
    .optional(),
  achievements: z.array(achievementSchema).default([]),
  githubUrl: z.url().optional(),
  demoUrl: z.url().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  displayOrder: z.number().default(100),
  /** Shows a gentle "case study is being expanded" note. */
  inProgress: z.boolean().default(false),
  theme: themeSchema.optional(),
  /** Slugs of related projects. If omitted, related projects are chosen by shared categories. */
  related: z.array(z.string()).optional(),
  /** Private notes for the owner (what's still missing, etc). Never rendered. */
  editorNotes: z.array(z.string()).optional(),
});

export type ProjectInput = z.input<typeof projectSchema>;
export type Project = z.output<typeof projectSchema>;
export type ProjectImage = z.output<typeof imageSchema>;
export type ProjectVideo = z.output<typeof videoSchema>;
export type ProjectSection = z.output<typeof sectionSchema>;
