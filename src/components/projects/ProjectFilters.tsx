"use client";

import { useRef } from "react";

type Props<F extends string> = {
  filters: F[];
  active: F;
  onSelect: (f: F) => void;
  labels: Record<string, string>;
  counts: Record<string, number>;
  ariaLabel: string;
};

/** Toggle-button filter bar (keyboard: Tab, plus ←/→ to move between filters). */
export default function ProjectFilters<F extends string>({ filters, active, onSelect, labels, counts, ariaLabel }: Props<F>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const rtl = document.documentElement.dir === "rtl";
    const forward = (e.key === "ArrowRight") !== rtl;
    const next = (i + (forward ? 1 : -1) + filters.length) % filters.length;
    refs.current[next]?.focus();
  };

  return (
    <div role="group" aria-label={ariaLabel} className="-mx-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
      <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        {filters.map((f, i) => {
          const isActive = f === active;
          return (
            <li key={f}>
              <button
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(f)}
                onKeyDown={(e) => onKey(e, i)}
                data-cursor="link"
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-[background-color,color,border-color] duration-300 ${
                  isActive
                    ? "border-charcoal bg-charcoal text-cream"
                    : "border-beige bg-paper text-charcoal hover:border-wine/50 hover:text-wine"
                }`}
              >
                {labels[f]}
                <span className={`text-[11px] ${isActive ? "text-cream/60" : "text-taupe-ink"}`}>{counts[f]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
