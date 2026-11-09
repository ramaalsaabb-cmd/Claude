"use client";

import { createElement, useEffect, useRef, useState } from "react";

type Props = { src: string; poster?: string; alt: string; hint: string };

/**
 * Interactive GLB/GLTF viewer, rendered ONLY when a real model file exists
 * (the loader drops model3D entries whose file is missing).
 * The <model-viewer> library is downloaded lazily, once the viewer scrolls near.
 */
export default function OptionalModelViewer({ src, poster, alt, hint }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          import("@google/model-viewer").then(() => setReady(true)).catch(() => {});
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure>
      <div ref={ref} className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-beige bg-gradient-to-b from-paper to-sand">
        {ready &&
          createElement("model-viewer", {
            src,
            poster,
            alt,
            "camera-controls": true,
            "touch-action": "pan-y",
            "shadow-intensity": "0.8",
            exposure: "1",
            loading: "lazy",
            style: { width: "100%", height: "100%", background: "transparent" },
          })}
      </div>
      <figcaption className="mt-3 text-sm text-taupe-ink">{hint}</figcaption>
    </figure>
  );
}
