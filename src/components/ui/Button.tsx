import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-label transition-[transform,background-color,color,box-shadow] duration-300 active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary:
    "bg-wine text-cream shadow-[0_14px_30px_-14px_rgba(136,42,42,.75)] hover:bg-wine-deep hover:shadow-[0_18px_34px_-14px_rgba(136,42,42,.85)]",
  outline: "border border-charcoal/20 bg-transparent text-charcoal hover:border-wine hover:text-wine",
  ghost: "px-2 text-charcoal hover:text-wine",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  download?: boolean;
  cursor?: string;
  ariaLabel?: string;
};

/** Link styled as a button. Hover shows the paw cursor state. */
export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  external,
  download,
  cursor = "paw",
  ariaLabel,
}: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (external || download || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={cls}
        data-cursor={cursor}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: "" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} data-cursor={cursor} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export function PawIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true" focusable="false">
      <ellipse cx="12" cy="16" rx="5" ry="4.2" />
      <ellipse cx="5.5" cy="10.5" rx="2.2" ry="2.8" />
      <ellipse cx="9.5" cy="6.5" rx="2.2" ry="2.9" />
      <ellipse cx="14.5" cy="6.5" rx="2.2" ry="2.9" />
      <ellipse cx="18.5" cy="10.5" rx="2.2" ry="2.8" />
    </svg>
  );
}

export function HeartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 22" className={`${className} fill-current`} aria-hidden="true" focusable="false">
      <path d="M12 21s-8.5-5.3-10.6-10C-.1 6.6 2.6 2 7 2c2.2 0 3.8 1.2 5 3 1.2-1.8 2.8-3 5-3 4.4 0 7.1 4.6 5.6 9-2.1 4.7-10.6 10-10.6 10Z" />
    </svg>
  );
}

export function GitHubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true" focusable="false">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedInIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true" focusable="false">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
