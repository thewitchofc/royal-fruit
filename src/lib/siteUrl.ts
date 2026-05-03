import { SITE_BRAND_LOGO_PATH, SITE_OG_IMAGE_PATH } from "./siteConfig";

/** נתיב תמונת Open Graph, לשימוש עם absoluteUrl() בלבד */
export { SITE_BRAND_LOGO_PATH, SITE_OG_IMAGE_PATH };

/**
 * בסיס הדומיין לקנוניקל, OG ומפת אתר.
 * בפרודקשן: הגדירו VITE_SITE_URL (למשל https://www.example.com) לבניית sitemap מדויקת;
 * בגלישה בדפדפן ללא משתנה, נופלים ל־origin הנוכחי (מתאים לדומיין האמיתי אחרי פריסה).
 */
export function getSiteUrl(): string {
  const raw = import.meta.env.VITE_SITE_URL?.trim() ?? "";
  if (raw) return raw.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }
  return "";
}

/** נתיב יחסי (מתחיל ב־/) או URL מלא */
export function absoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return getSiteUrl();
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = getSiteUrl();
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return base ? `${base}${path}` : path;
}

/** כתובת מוחלטת לתמונת OG / שיתוף קישור */
export function absoluteOgImageUrl(): string {
  return absoluteUrl(SITE_OG_IMAGE_PATH);
}

/** כתובת מוחלטת ללוגו המותג (סכימה, לא תמונת קישור) */
export function absoluteBrandLogoUrl(): string {
  return absoluteUrl(SITE_BRAND_LOGO_PATH);
}
