"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

type Props = {
  src?: string;
  webm?: string;
  poster?: string;
  title: string;
  caption?: string;
  aspectRatio: number;
  playLabel: string;
  unsupportedLabel: string;
};

/**
 * Self-hosted video: nothing downloads until the visitor presses play
 * (preload="none"). After that, native controls give keyboard access,
 * captions tracks, picture-in-picture and full-screen.
 */
export default function VideoPlayer({ src, webm, poster, title, caption, aspectRatio, playLabel, unsupportedLabel }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    requestAnimationFrame(() => {
      ref.current?.play().catch(() => {});
      ref.current?.focus();
    });
  };

  // Portrait videos are capped in height so they don't take over the page.
  const portrait = aspectRatio < 1;

  return (
    <figure className="w-full">
      <div
        className={`relative mx-auto overflow-hidden rounded-[22px] bg-charcoal ${portrait ? "max-h-[80vh]" : ""}`}
        style={{ aspectRatio: String(aspectRatio), maxWidth: portrait ? `calc(80vh * ${aspectRatio})` : undefined }}
      >
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-contain"
          controls={started}
          preload="none"
          playsInline
          poster={poster}
          aria-label={title}
          tabIndex={started ? 0 : -1}
        >
          {webm && <source src={webm} type="video/webm" />}
          {src && <source src={src} type="video/mp4" />}
          {unsupportedLabel}
        </video>
        {!started && (
          <button
            type="button"
            onClick={start}
            data-cursor="play"
            aria-label={playLabel}
            className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent"
          >
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-wine text-cream shadow-[0_20px_40px_-20px_rgba(136,42,42,.9)] transition-transform duration-500 group-hover:scale-110">
              <Play className="ms-1 h-7 w-7 fill-current" aria-hidden="true" />
            </span>
            <span className="absolute bottom-5 start-6 max-w-[80%] text-start font-serif text-xl text-cream sm:text-2xl">{title}</span>
          </button>
        )}
      </div>
      {caption && <figcaption className="mt-3 text-sm text-taupe-ink">{caption}</figcaption>}
    </figure>
  );
}
