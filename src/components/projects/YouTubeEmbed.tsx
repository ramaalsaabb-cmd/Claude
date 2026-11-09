"use client";

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";

type Props = {
  id: string;
  title: string;
  caption?: string;
  poster?: string;
  playLabel: string;
  watchLabel: string;
};

/**
 * Lightweight YouTube facade: shows a thumbnail and only loads the
 * (privacy-enhanced) YouTube player when the visitor presses play.
 */
export default function YouTubeEmbed({ id, title, caption, poster, playLabel, watchLabel }: Props) {
  const [active, setActive] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <figure className="w-full">
      <div className="relative aspect-video overflow-hidden rounded-[22px] bg-charcoal">
        {active ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            data-cursor="play"
            aria-label={playLabel}
            className="group absolute inset-0 flex items-center justify-center"
          >
            {!thumbFailed && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumb}
                alt=""
                loading="lazy"
                onError={() => setThumbFailed(true)}
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-[1.2s] group-hover:scale-[1.03]"
              />
            )}
            {thumbFailed && poster && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-contain opacity-60" />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
            <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-wine text-cream shadow-[0_20px_40px_-20px_rgba(136,42,42,.9)] transition-transform duration-500 group-hover:scale-110">
              <Play className="ms-1 h-7 w-7 fill-current" aria-hidden="true" />
            </span>
            <span className="absolute bottom-5 start-6 max-w-[80%] text-start font-serif text-xl text-cream sm:text-2xl">{title}</span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-taupe-ink">
        <span>{caption}</span>
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-wine"
          data-cursor="link"
        >
          <span className="link-underline">{watchLabel}</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}
