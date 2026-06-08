/**
 * קבועי SEO / אתר ללא תלות ב-runtime (ניתן לייבא מ-vite.config ומהדפדפן).
 */

/** תמונת שיתוף (Google / WhatsApp / פייסבוק) — מרובעת 1200×1200 עם לוגו */
export const SITE_OG_IMAGE_PATH = "/images/seo/og-image.png" as const;

/** גרסה רחבה לכרטיסי שיתוף (summary_large_image) */
export const SITE_OG_IMAGE_WIDE_PATH = "/images/seo/og-image-wide.png" as const;

/** לוגו המותג ל־JSON-LD (publisher / Organization), לא לתמונת קישור */
export const SITE_BRAND_LOGO_PATH = "/images/brand/brand-logo.png" as const;

/**
 * Placeholder לבילד כש־VITE_SITE_URL חסר, לא דומיין אמיתי; חובה להגדיר URL בפרודקשן.
 * ראו אזהרה בקונסול בעת npm run build.
 */
export const SITE_URL_BUILD_PLACEHOLDER = "https://set-vite-site-url.invalid";

export function normalizeSiteUrlFromEnv(raw: string | undefined): string {
  const t = raw?.trim().replace(/\/$/, "") ?? "";
  return t || SITE_URL_BUILD_PLACEHOLDER;
}
