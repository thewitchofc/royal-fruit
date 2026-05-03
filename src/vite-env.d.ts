/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** בסיס הדומיין ללא סלאש, למשל https://www.example.com */
  readonly VITE_SITE_URL?: string;
  /** מזהה GA4 (למשל G-XXXXXXXX), אופציונלי; מפעיל באנר הסכמה כשמוגדר */
  readonly VITE_GA_MEASUREMENT_ID?: string;
  /** קישור מלא ל-CSV (מצב ישן; נשמר ב-bundle, עדיף VITE_PRICE_SHEET_VIA_PROXY) */
  readonly VITE_GOOGLE_SHEETS_PRODUCTS_CSV_URL?: string;
  /** "1" = fetch ישיר ל-Google בלי פרוקסי /google-sheet-csv (נדיר) */
  readonly VITE_GOOGLE_SHEETS_DIRECT?: string;
  /** "1" = טעינת מחירון מ־/price-sheet.csv בלבד (URL הגיליון רק בשרת או במידלוור dev) */
  readonly VITE_PRICE_SHEET_VIA_PROXY?: string;
  /** קישור שיתוף Google Business / g.page / מפות — ל־sameAs ולקישור משני לפרופיל */
  readonly VITE_GOOGLE_BUSINESS_GPAGE?: string;
  /**
   * קישור מלא לטופס ביקורת מלוח הבקרה של Google Business («קבלו עוד ביקורות»).
   * אם מוגדר, דורס Place ID.
   */
  readonly VITE_GOOGLE_WRITE_REVIEW_URL?: string;
  /** מזהה Place ממפות Google (ChIJ...) לבניית קישור writereview אוטומטית */
  readonly VITE_GOOGLE_BUSINESS_PLACE_ID?: string;
  /** מפתח Google Maps לדפדפן, להפעלת השלמת כתובות בסל (להגביל לדומיין ב-Google Cloud) */
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  /** URL סקריפט נגישות חיצוני (למשל לאחר רישום ל«נגיש בקליק»), רק כשיש ערך */
  readonly VITE_ACCESSIBILITY_VENDOR_SCRIPT_URL?: string;
  /** אופציונלי, JSON של data-* על תג ה־script, למשל {"sitekey":"abc"} */
  readonly VITE_ACCESSIBILITY_VENDOR_SCRIPT_DATASET?: string;
}
