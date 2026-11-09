#!/usr/bin/env node
/**
 * Media pipeline — turns original project media into web-ready copies.
 *
 *   npm run media              process everything
 *   npm run media -- --webm    also create WebM versions of videos (slower)
 *   npm run media -- --force   re-process even if outputs are up to date
 *
 * Inputs (originals are NEVER modified):
 *   media-source/incoming/            drop any files here; confirmed ones are routed
 *                                     using media-source/assignments.json
 *   media-source/<project-slug>/      files placed directly in a project folder are
 *                                     processed for that project automatically
 *
 * Outputs:
 *   public/projects/<slug>/videos/*.mp4 (+ -poster.jpg, optional .webm)
 *   public/projects/<slug>/photos|screenshots|posters/*
 *   src/content/media-manifest.json   (width / height / duration per output)
 *   media-source/_unassigned/REVIEW.md (unidentified files + metadata + preview frames)
 *
 * Requires ffmpeg/ffprobe for video, pdftoppm (poppler) for PDF posters and,
 * optionally, ImageMagick (`magick` or `convert`) to resize photos.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "media-source");
const INCOMING = process.env.MEDIA_INCOMING ? path.resolve(process.env.MEDIA_INCOMING) : path.join(SRC, "incoming");
const UNASSIGNED = path.join(SRC, "_unassigned");
const PUBLIC = path.join(ROOT, "public");
const MANIFEST = path.join(ROOT, "src", "content", "media-manifest.json");
const PROJECTS_DIR = path.join(ROOT, "src", "content", "projects");

const args = new Set(process.argv.slice(2));
const FORCE = args.has("--force");
const WEBM = args.has("--webm");
const MAX_IMAGE = 2560;
const MAX_VIDEO = 1920;

const VIDEO = new Set([".mov", ".mp4", ".m4v", ".webm", ".mkv", ".avi"]);
const IMAGE = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".tif", ".tiff"]);
const MODEL = new Set([".glb", ".gltf"]);

const has = (cmd) => spawnSync(cmd, ["-version"], { stdio: "ignore" }).status === 0 || spawnSync(cmd, ["--version"], { stdio: "ignore" }).status === 0;
const TOOLS = {
  ffmpeg: has("ffmpeg"),
  ffprobe: has("ffprobe"),
  pdftoppm: spawnSync("pdftoppm", ["-v"], { stdio: "ignore" }).error === undefined,
  magick: has("magick") ? "magick" : has("convert") ? "convert" : null,
};

const log = (...m) => console.log(...m);
const warn = (...m) => console.warn("⚠️ ", ...m);
const run = (cmd, a) => {
  const r = spawnSync(cmd, a, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`${cmd} failed:\n${(r.stderr || "").split("\n").slice(-8).join("\n")}`);
  return r.stdout;
};
const upToDate = (src, out) => !FORCE && fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;
const ensureDir = (p) => fs.mkdirSync(path.dirname(p), { recursive: true });
const toPublicUrl = (abs) => "/" + path.relative(PUBLIC, abs).split(path.sep).join("/");
const slugify = (s) => s.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

function probe(file) {
  if (!TOOLS.ffprobe) return {};
  try {
    const j = JSON.parse(run("ffprobe", ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", file]));
    const v = (j.streams || []).find((s) => s.codec_type === "video");
    if (!v) return {};
    let w = v.width, h = v.height;
    const rot = Number(v.tags?.rotate ?? v.side_data_list?.find((s) => s.rotation !== undefined)?.rotation ?? 0);
    if (Math.abs(rot) % 180 === 90) [w, h] = [h, w];
    const duration = Number(j.format?.duration ?? v.duration ?? 0) || undefined;
    return {
      width: w,
      height: h,
      duration: duration ? Math.round(duration * 10) / 10 : undefined,
      created: j.format?.tags?.creation_time,
      audio: (j.streams || []).some((s) => s.codec_type === "audio"),
    };
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------- processors

function processVideo(src, outBase, manifest) {
  if (!TOOLS.ffmpeg) return warn(`ffmpeg not found — skipped ${path.basename(src)}`);
  const mp4 = outBase + ".mp4";
  const poster = outBase + "-poster.jpg";
  ensureDir(mp4);
  const info = probe(src);
  const scale = `scale='if(gt(iw,ih),min(${MAX_VIDEO},iw),-2)':'if(gt(iw,ih),-2,min(${MAX_VIDEO},ih))'`;
  if (!upToDate(src, mp4)) {
    log(`  🎬 ${path.basename(src)} → ${toPublicUrl(mp4)}`);
    run("ffmpeg", ["-y", "-v", "error", "-i", src, "-vf", scale, "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      ...(info.audio === false ? ["-an"] : ["-c:a", "aac", "-b:a", "128k"]), mp4]);
  }
  if (!upToDate(src, poster)) {
    const t = info.duration ? Math.min(1.5, info.duration * 0.1) : 0.5;
    run("ffmpeg", ["-y", "-v", "error", "-ss", String(t), "-i", mp4, "-frames:v", "1", "-q:v", "3", poster]);
  }
  if (WEBM) {
    const webm = outBase + ".webm";
    if (!upToDate(src, webm)) {
      log(`  🎞  WebM → ${toPublicUrl(webm)}`);
      run("ffmpeg", ["-y", "-v", "error", "-i", src, "-vf", scale, "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0", "-row-mt", "1",
        ...(info.audio === false ? ["-an"] : ["-c:a", "libopus", "-b:a", "96k"]), webm]);
    }
  }
  const out = probe(mp4);
  manifest[toPublicUrl(mp4)] = { width: out.width, height: out.height, duration: out.duration };
  if (WEBM) manifest[toPublicUrl(outBase + ".webm")] = { width: out.width, height: out.height, duration: out.duration };
  const pInfo = probe(poster);
  manifest[toPublicUrl(poster)] = { width: pInfo.width, height: pInfo.height };
}

function processImage(src, outBase, manifest) {
  const ext = path.extname(src).toLowerCase();
  const outExt = ext === ".png" ? ".png" : ".jpg";
  const out = outBase + outExt;
  ensureDir(out);
  if (!upToDate(src, out)) {
    log(`  🖼  ${path.basename(src)} → ${toPublicUrl(out)}`);
    let done = false;
    if (TOOLS.magick) {
      // auto-orient, fit inside MAX_IMAGE, strip metadata (removes GPS location from the web copy)
      try {
        run(TOOLS.magick, [src, "-auto-orient", "-resize", `${MAX_IMAGE}x${MAX_IMAGE}>`, "-strip", ...(outExt === ".jpg" ? ["-quality", "86"] : []), out]);
        done = true;
      } catch (e) {
        if (![".heic", ".heif"].includes(ext)) throw e;
      }
    }
    if (!done && [".heic", ".heif"].includes(ext) && spawnSync("sips", ["--help"], { stdio: "ignore" }).error === undefined) {
      // macOS built-in converter for iPhone photos
      run("sips", ["-s", "format", "jpeg", "-Z", String(MAX_IMAGE), src, "--out", out]);
      done = true;
    }
    if (done) {
      /* converted */
    } else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      fs.copyFileSync(src, out);
    } else {
      return warn(`Could not convert ${path.basename(src)} — export it as JPG (iPhone: Settings → Camera → Formats → Most Compatible) or install ImageMagick with HEIC support.`);
    }
  }
  const info = probe(out);
  manifest[toPublicUrl(out)] = { width: info.width, height: info.height };
}

function processPdf(src, outBase, manifest) {
  const out = outBase + ".jpg";
  ensureDir(out);
  if (!upToDate(src, out)) {
    log(`  📄 ${path.basename(src)} → ${toPublicUrl(out)} (page 1)`);
    if (!TOOLS.pdftoppm) return warn("pdftoppm (poppler) not found — install it to render PDF posters.");
    const tmp = outBase + "-render";
    run("pdftoppm", ["-jpeg", "-jpegopt", "quality=92", "-r", "200", "-f", "1", "-l", "1", "-singlefile", src, tmp]);
    if (TOOLS.magick) {
      run(TOOLS.magick, [tmp + ".jpg", "-resize", `${MAX_IMAGE}x${MAX_IMAGE}>`, "-quality", "88", out]);
      fs.rmSync(tmp + ".jpg");
    } else fs.renameSync(tmp + ".jpg", out);
  }
  const info = probe(out);
  manifest[toPublicUrl(out)] = { width: info.width, height: info.height };
}

function processFile(src, project, outRel, manifest) {
  const ext = path.extname(src).toLowerCase();
  const kindDir = VIDEO.has(ext) ? "videos" : MODEL.has(ext) ? "models" : ext === ".pdf" ? "posters" : "photos";
  const rel = outRel ?? `${kindDir}/${slugify(path.basename(src, path.extname(src)))}`;
  const outBase = path.join(PUBLIC, "projects", project, rel);
  if (VIDEO.has(ext)) processVideo(src, outBase, manifest);
  else if (IMAGE.has(ext)) processImage(src, outBase, manifest);
  else if (ext === ".pdf") processPdf(src, outBase, manifest);
  else if (MODEL.has(ext)) {
    const out = outBase + ext;
    ensureDir(out);
    if (!upToDate(src, out)) fs.copyFileSync(src, out);
    log(`  🧊 ${path.basename(src)} → ${toPublicUrl(out)}`);
  } else return warn(`Unsupported file type: ${path.basename(src)}`);
  return rel;
}

// ---------------------------------------------------------------- main

const listFiles = (dir) =>
  fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isFile() && !d.name.startsWith(".")).map((d) => path.join(dir, d.name)) : [];

const projectSlugs = fs.existsSync(PROJECTS_DIR)
  ? fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("_")).map((f) => JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, f), "utf8")).slug)
  : [];

const assignments = JSON.parse(fs.readFileSync(path.join(SRC, "assignments.json"), "utf8")).files;
const lookup = new Map(Object.entries(assignments).map(([k, v]) => [k.toLowerCase(), v]));
const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};

log(`Media pipeline — tools: ffmpeg ${TOOLS.ffmpeg ? "✓" : "✗"} · pdftoppm ${TOOLS.pdftoppm ? "✓" : "✗"} · imagemagick ${TOOLS.magick ? "✓" : "✗"}\n`);

const reminders = [];
const unassigned = [];

// 1) incoming → confirmed assignments, everything else → _unassigned
for (const file of listFiles(INCOMING)) {
  const a = lookup.get(path.basename(file).toLowerCase());
  if (!a) {
    unassigned.push(file);
    continue;
  }
  log(`• ${path.basename(file)} → ${a.project}`);
  try {
    processFile(file, a.project, a.output, manifest);
    if (a.verify) reminders.push(`${path.basename(file)}: ${a.verify}`);
  } catch (e) {
    warn(e.message);
  }
}

// 2) media-source/<slug>/ folders (future projects / extra media)
const snippets = [];
for (const slug of projectSlugs) {
  for (const file of listFiles(path.join(SRC, slug))) {
    log(`• ${slug}/${path.basename(file)}`);
    try {
      const rel = processFile(file, slug, undefined, manifest);
      if (!rel) continue;
      const ext = path.extname(file).toLowerCase();
      const base = `/projects/${slug}/${rel}`;
      if (VIDEO.has(ext)) snippets.push({ slug, json: { src: `${base}.mp4`, poster: `${base}-poster.jpg`, title: "TODO title", titleAr: "TODO" } });
      else if (IMAGE.has(ext)) snippets.push({ slug, json: { src: base + (ext === ".png" ? ".png" : ".jpg"), alt: "TODO describe the image", altAr: "TODO" } });
    } catch (e) {
      warn(e.message);
    }
  }
}

// 3) unassigned → move (not modify) into _unassigned + write a review sheet with preview frames
if (unassigned.length) {
  fs.mkdirSync(path.join(UNASSIGNED, "previews"), { recursive: true });
  for (const f of unassigned) {
    const dest = path.join(UNASSIGNED, path.basename(f));
    if (!fs.existsSync(dest)) fs.renameSync(f, dest);
  }
}
const pending = listFiles(UNASSIGNED).filter((f) => !f.endsWith(".md"));
if (pending.length) {
  const rows = [];
  for (const f of pending) {
    const ext = path.extname(f).toLowerCase();
    const info = VIDEO.has(ext) || IMAGE.has(ext) ? probe(f) : {};
    const previews = [];
    if (VIDEO.has(ext) && TOOLS.ffmpeg && info.duration) {
      for (const [i, pct] of [0.1, 0.5, 0.9].entries()) {
        const out = path.join(UNASSIGNED, "previews", `${slugify(path.basename(f))}-${i + 1}.jpg`);
        if (!fs.existsSync(out)) {
          try {
            run("ffmpeg", ["-y", "-v", "error", "-ss", String(info.duration * pct), "-i", f, "-frames:v", "1", "-vf", "scale=640:-2", "-q:v", "4", out]);
          } catch {}
        }
        if (fs.existsSync(out)) previews.push(`previews/${path.basename(out)}`);
      }
    }
    rows.push(
      `### ${path.basename(f)}\n\n- Resolution: ${info.width ? `${info.width}×${info.height}` : "unknown"}\n- Duration: ${info.duration ? `${info.duration}s` : "—"}\n- Recorded: ${info.created ?? "unknown"}\n- Project: _not identified — add it to assignments.json or move it to media-source/<project-slug>/_\n${previews.map((p) => `\n![](${p.replace(/ /g, "%20")})`).join("")}\n`,
    );
  }
  fs.writeFileSync(
    path.join(UNASSIGNED, "REVIEW.md"),
    `# Unassigned media — needs review\n\nThese files could not be matched to a project with confidence, so they are not used on the site.\nLook at the preview frames, then either add the filename to \`media-source/assignments.json\` or move the file into \`media-source/<project-slug>/\` and run \`npm run media\` again.\n\n${rows.join("\n")}`,
  );
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");

log("\nDone.");
if (pending.length) log(`\n📋 ${pending.length} unassigned file(s) — see media-source/_unassigned/REVIEW.md`);
if (reminders.length) log(`\n🔎 Please verify:\n${reminders.map((r) => "  - " + r).join("\n")}`);
if (snippets.length) {
  log("\n🧩 Add these to the project JSON (gallery / videos), then fill in real descriptions:");
  for (const s of snippets) log(`  [${s.slug}] ${JSON.stringify(s.json)}`);
}
log("\nRebuild (npm run build) or restart `npm run dev` to see new media.");
