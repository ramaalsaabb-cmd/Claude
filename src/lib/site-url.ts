/**
 * Public URL of the deployed site, used for canonical links, Open Graph and the sitemap.
 * Set NEXT_PUBLIC_SITE_URL in your hosting provider (e.g. https://rama-alsaab.vercel.app).
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");
