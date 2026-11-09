export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ar" : "en";
}

/** Pick the localized value, falling back to English when Arabic is missing. */
export function pick<T>(locale: Locale, en: T, ar?: T | null): T {
  if (locale === "ar" && ar !== undefined && ar !== null && ar !== "") return ar;
  return en;
}

/** Swap the locale segment of a pathname, keeping the rest of the route. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const parts = pathname.split("/");
  if (parts.length > 1 && isLocale(parts[1])) {
    parts[1] = to;
    return parts.join("/") || `/${to}`;
  }
  return `/${to}${pathname === "/" ? "" : pathname}`;
}

const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
/** Zero-padded section numbers ("01"), in Eastern Arabic digits for Arabic. */
export function sectionNumber(n: number, locale: Locale): string {
  const s = String(n).padStart(2, "0");
  return locale === "ar" ? s.replace(/\d/g, (d) => arabicDigits[Number(d)]) : s;
}
