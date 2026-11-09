import Link from "next/link";
import { ArrowUp } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { pick } from "@/lib/i18n";
import CatSilhouette from "@/components/cat/CatSilhouette";
import { HeartIcon } from "@/components/ui/Button";
import Year from "./Year";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="relative mt-10 border-t border-beige bg-cream">
      {/* the cat peeking over the footer edge */}
      <div className="pointer-events-none absolute -top-[46px] end-[8%] sm:end-[12%]" aria-hidden="true">
        <CatSilhouette variant="peek" className="footer-peek h-12 w-24 text-charcoal" />
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <div className="space-y-1">
          <p className="font-serif text-xl text-charcoal">{pick(locale, site.name, site.nameAr)}</p>
          <p className="text-sm text-taupe-ink">
            © <Year /> · {dict.footer.rights}
          </p>
        </div>
        <p lang="en" className="flex items-center gap-2 font-script text-xl text-taupe-ink">
          {dict.footer.note}
          <HeartIcon className="h-4 w-4 text-wine" />
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 self-start text-sm text-charcoal hover:text-wine sm:self-auto"
          data-cursor="link"
        >
          {dict.a11y.backToTop}
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </footer>
  );
}
