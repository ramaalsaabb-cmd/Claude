"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { type Locale, otherLocale, switchLocalePath } from "@/lib/i18n";

type Props = { locale: Locale; label: string; ariaLabel: string; className?: string };

/** EN / AR switch — keeps the current page and section (hash) when switching. */
export default function LanguageSwitcher({ locale, label, ariaLabel, className = "" }: Props) {
  const pathname = usePathname() || `/${locale}`;
  const router = useRouter();
  const to = otherLocale(locale);
  const href = switchLocalePath(pathname, to);

  return (
    <Link
      href={href}
      hrefLang={to}
      lang={to}
      aria-label={ariaLabel}
      data-cursor="link"
      onClick={(e) => {
        const hash = window.location.hash;
        if (hash) {
          e.preventDefault();
          router.push(href + hash);
        }
      }}
      className={`inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-3.5 py-2 text-xs font-medium text-charcoal transition-colors hover:border-wine hover:text-wine ${className}`}
    >
      <Globe className="h-3.5 w-3.5" aria-hidden="true" />
      <span className={locale === "en" ? "font-display-ar text-sm leading-none" : "font-sans tracking-wider"}>{label}</span>
    </Link>
  );
}
