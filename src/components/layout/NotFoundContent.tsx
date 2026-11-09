"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dictionaries } from "@/content/dictionaries";
import CatSilhouette from "@/components/cat/CatSilhouette";

/** 404 content in the visitor's current language (read from the URL). */
export default function NotFoundContent() {
  const pathname = usePathname() || "/en";
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  const t = dictionaries[locale].notFound;
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 pt-28 text-center">
      <CatSilhouette className="h-20 w-16 text-charcoal" />
      <p className="mt-8 font-sans text-sm tracking-label text-wine">404</p>
      <h1 className="mt-3 font-serif text-5xl text-charcoal sm:text-6xl">{t.title}</h1>
      <p className="mt-4 text-lg text-taupe-ink">{t.text}</p>
      <Link href={`/${locale}`} className="mt-10 rounded-full bg-wine px-7 py-3.5 text-xs font-semibold uppercase tracking-label text-cream hover:bg-wine-deep" data-cursor="paw">
        {t.home}
      </Link>
    </div>
  );
}
