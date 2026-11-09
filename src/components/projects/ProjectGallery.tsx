"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

const noopSubscribe = () => () => {};

export type GalleryImage = { src: string; alt: string; caption?: string; width?: number; height?: number };

type Labels = { close: string; next: string; previous: string; zoomIn: string; zoomOut: string; imageOf: string };

type Props = {
  images: GalleryImage[];
  labels: Labels;
  /** "grid" = gallery wall, "single" = one large image, "row" = images within a section */
  layout?: "grid" | "single" | "row";
  rtl?: boolean;
};

/**
 * Responsive gallery with a full-screen viewer.
 * Keyboard: ←/→ to navigate, Esc to close, Z to toggle zoom. Touch: swipe.
 */
export default function ProjectGallery({ images, labels, layout = "grid", rtl = false }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion();
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const open = (i: number, el: HTMLButtonElement) => {
    lastTrigger.current = el;
    setZoom(false);
    setIndex(i);
  };
  const close = useCallback(() => {
    setIndex(null);
    setZoom(false);
    requestAnimationFrame(() => lastTrigger.current?.focus());
  }, []);
  const go = useCallback(
    (delta: number) => {
      setZoom(false);
      setDir(delta);
      setIndex((i) => (i === null ? i : (i + delta + images.length) % images.length));
    },
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(rtl ? -1 : 1);
      else if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
      else if (e.key.toLowerCase() === "z") setZoom((z) => !z);
      else if (e.key === "Tab" && dialogRef.current) {
        // simple focus trap
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, close, go, rtl]);

  if (!images.length) return null;

  const gridCls =
    layout === "single"
      ? "grid grid-cols-1"
      : layout === "row"
        ? `grid gap-4 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`
        : "columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4";

  const current = index !== null ? images[index] : null;
  const fmt = (i: number) => labels.imageOf.replace("{i}", String(i + 1)).replace("{n}", String(images.length));

  return (
    <>
      <ul className={gridCls}>
        {images.map((img, i) => {
          const ratio = img.width && img.height ? img.width / img.height : layout === "single" ? 16 / 10 : 4 / 3;
          return (
            <li key={img.src + i} className="break-inside-avoid">
              <figure>
                <button
                  type="button"
                  onClick={(e) => open(i, e.currentTarget)}
                  className="group relative block w-full overflow-hidden rounded-[18px] bg-sand"
                  style={{ aspectRatio: String(ratio) }}
                  data-cursor="link"
                  aria-label={`${img.alt} — ${fmt(i)}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={layout === "single" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                  />
                  <span className="absolute end-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-charcoal opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <ZoomIn className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
                {img.caption && <figcaption className="mt-2 text-sm text-taupe-ink">{img.caption}</figcaption>}
              </figure>
            </li>
          );
        })}
      </ul>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {current && index !== null && (
              <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={current.alt}
                tabIndex={-1}
                className="fixed inset-0 z-[90] flex flex-col bg-charcoal/95 text-cream outline-none backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.3 }}
                onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  if (touchX.current === null || zoom) return;
                  const dx = e.changedTouches[0].clientX - touchX.current;
                  if (Math.abs(dx) > 50) go((dx < 0) !== rtl ? 1 : -1);
                  touchX.current = null;
                }}
              >
                <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
                  <p className="text-sm text-cream/70" aria-live="polite">
                    {fmt(index)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => !z)}
                      aria-label={zoom ? labels.zoomOut : labels.zoomIn}
                      aria-pressed={zoom}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 hover:border-cream/60"
                    >
                      {zoom ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
                    </button>
                    <button
                      type="button"
                      onClick={close}
                      aria-label={labels.close}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 hover:border-cream/60"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div
                  className="relative flex-1 overflow-hidden"
                  onClick={(e) => e.target === e.currentTarget && close()}
                >
                  <AnimatePresence initial={false} custom={dir} mode="popLayout">
                    <motion.div
                      key={current.src}
                      custom={dir}
                      className="absolute inset-4 sm:inset-x-24"
                      initial={reduce ? { opacity: 0 } : { opacity: 0, x: (rtl ? -dir : dir) * 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, x: (rtl ? dir : -dir) * 60 }}
                      transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                      onMouseMove={(e) => {
                        if (!zoom) return;
                        const r = e.currentTarget.getBoundingClientRect();
                        setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
                      }}
                      onClick={(e) => {
                        if (e.target === e.currentTarget) close();
                      }}
                    >
                      <Image
                        src={current.src}
                        alt={current.alt}
                        fill
                        sizes="100vw"
                        quality={90}
                        className="object-contain transition-transform duration-300"
                        style={{ transform: zoom ? "scale(2.2)" : "scale(1)", transformOrigin: origin }}
                        onClick={() => setZoom((z) => !z)}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        aria-label={labels.previous}
                        className="absolute start-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 hover:bg-cream/20 sm:start-6"
                      >
                        <ChevronLeft className="h-6 w-6 rtl:-scale-x-100" />
                      </button>
                      <button
                        type="button"
                        onClick={() => go(1)}
                        aria-label={labels.next}
                        className="absolute end-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 hover:bg-cream/20 sm:end-6"
                      >
                        <ChevronRight className="h-6 w-6 rtl:-scale-x-100" />
                      </button>
                    </>
                  )}
                </div>

                <div className="min-h-16 px-4 pb-6 pt-3 text-center sm:px-8">
                  {current.caption && <p className="mx-auto max-w-2xl text-sm text-cream/80">{current.caption}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
