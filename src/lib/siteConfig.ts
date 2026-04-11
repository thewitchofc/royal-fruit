/**
 * קבועי SEO / אתר ללא תלות ב-runtime (ניתן לייבא מ-vite.config ומהדפדפן).
 */

/** נתיב תמונת OG ב-public, תמיד עם absoluteUrl() ב-meta ו-JSON-LD */
export const SITE_OG_IMAGE_PATH = "/og-image.png" as const;

/**
 * Placeholder לבילד כש־VITE_SITE_URL חסר, לא דומיין אמיתי; חובה להגדיר URL בפרודקשן.
 * ראו אזהרה בקונסול בעת npm run build.
 */
export const SITE_URL_BUILD_PLACEHOLDER = "https://set-vite-site-url.invalid";

export function normalizeSiteUrlFromEnv(raw: string | undefined): string {
  const t = raw?.trim().replace(/\/$/, "") ?? "";
  return t || SITE_URL_BUILD_PLACEHOLDER;
}
