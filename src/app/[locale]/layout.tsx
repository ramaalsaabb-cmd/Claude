import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Instrument_Serif, Manrope, Caveat, Noto_Naskh_Arabic, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { locales, isLocale, dirOf, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/cursor/CustomCursor";
import RevealObserver from "@/components/ui/RevealObserver";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--nf-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--nf-sans", display: "swap" });
const script = Caveat({ subsets: ["latin"], variable: "--nf-script", display: "swap" });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--nf-naskh", display: "swap", preload: false });
const plex = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500", "600"], variable: "--nf-plex", display: "swap", preload: false });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#F4EEE9",
  colorScheme: "light",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: `%s — ${locale === "ar" ? site.nameAr : site.name}` },
    description: dict.meta.description,
    applicationName: site.name,
    authors: [{ name: site.name }],
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_SA"],
      url: `/${locale}`,
    },
    twitter: { card: "summary_large_image", title: dict.meta.title, description: dict.meta.description },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={`${serif.variable} ${sans.variable} ${script.variable} ${naskh.variable} ${plex.variable}`}
    >
      <body className="min-h-screen antialiased">
        <noscript>
          <style>{`.reveal,.fade-up{opacity:1!important;transform:none!important}.split-line>span{transform:none!important}`}</style>
        </noscript>
        <Header
          locale={locale}
          nav={dict.nav}
          a11y={dict.a11y}
          langLabel={dict.langLabel}
          siteName={locale === "ar" ? site.nameAr : site.name}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
        <CustomCursor labels={{ viewProject: dict.projects.viewProject, play: locale === "ar" ? "تشغيل" : "Play" }} />
        <RevealObserver />
      </body>
    </html>
  );
}
