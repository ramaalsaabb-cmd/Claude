import "./globals.css";
import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import Link from "next/link";
import CatSilhouette from "@/components/cat/CatSilhouette";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--nf-serif" });
const sans = Manrope({ subsets: ["latin"], variable: "--nf-sans" });

export const metadata: Metadata = {
  title: "404 — Page not found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
          <CatSilhouette className="h-20 w-16 text-charcoal" />
          <p className="mt-8 font-sans text-sm tracking-label text-wine">404</p>
          <h1 className="mt-3 font-serif text-5xl text-charcoal sm:text-6xl">This page wandered off.</h1>
          <p className="mt-4 text-lg text-taupe-ink" lang="ar" dir="rtl">
            هذه الصفحة تاهت.
          </p>
          <div className="mt-10 flex gap-3">
            <Link href="/en" className="rounded-full bg-wine px-7 py-3.5 text-xs font-semibold uppercase tracking-label text-cream">
              Home
            </Link>
            <Link href="/ar" lang="ar" className="rounded-full border border-charcoal/20 px-7 py-3.5 text-sm text-charcoal">
              الرئيسية
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
