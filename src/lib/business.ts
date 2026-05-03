/** פרטי עסק קבועים לקישורים ולתצוגה (NAP עקבי ל-SEO מקומי) */

export const BUSINESS_NAME = "Royal Fruit";

export const BUSINESS_PHONE = "050-5113009";
export const BUSINESS_PHONE_E164 = "+972505113009";

/** שם ליצירת קשר — מוצג באתר רק ליד מספר הטלפון */
export const BUSINESS_CONTACT_FIRST_NAME = "אורי";
export const BUSINESS_ADDRESS_LINE = "האורגים 7, חולון";

/** תיאור קצר ל-Schema.org (LocalBusiness / GroceryStore), שם המותג בתחילה לזיהוי מותג */
export const BUSINESS_SCHEMA_DESCRIPTION =
  "Royal Fruit, פירות וירקות פרימיום עד הבית מחולון לאזור המרכז וגוש דן, עם בחירה יומית, אריזה נקייה ותיאום מהיר בוואטסאפ";

/** אזור שירות, טקסט אחיד לפוטר, FAQ ותיאום ציפיות */
export const BUSINESS_AREA_SERVED =
  "אזור המרכז וגוש דן, כולל חולון, בת ים, ראשון לציון, תל אביב והסביבה. המשלוחים והאיסוף מתואמים מראש; ליישוב או לאזור ספציפי כדאי לוודא בטלפון לפני ההזמנה.";

/** שורת אמון ליד CTA (ללא «בכל הארץ», בהתאם לאזור המשלוח בלבד) */
export const BUSINESS_TRUST_CUSTOMERS_LINE = "מאות לקוחות מרוצים באזור המרכז וגוש דן";

/** @deprecated השתמשו ב־BUSINESS_AREA_SERVED, שם מזהה לקוד קיים */
export const DELIVERY_ZONES_SUMMARY = BUSINESS_AREA_SERVED;

/** שעות פעילות כפי שנמסרו על ידי העסק */
export const BUSINESS_HOURS_SUMMARY =
  "סגורים בשישי בערב ובשבת בבוקר. מחוץ לחלון הזה, שירות רציף (24/6). לתיאום איסוף, משלוח או שאלה: " +
  BUSINESS_PHONE +
  " (" +
  BUSINESS_CONTACT_FIRST_NAME +
  ").";

/**
 * שעות פתיחה ל־Schema.org (OpeningHoursSpecification).
 * עדכנו opens/closes או הוסיפו אובייקט נוסף (למשל יום שישי קצר) לפי שעות החנות המדויקות.
 */
export const BUSINESS_OPENING_HOURS_SPECIFICATION: Record<string, unknown>[] = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    opens: "08:00",
    closes: "18:00",
  },
];

/** אינסטגרם רשמי של העסק */
export const BUSINESS_INSTAGRAM_URL = "https://www.instagram.com/royal.fruit26/";
/** פייסבוק רשמי של העסק */
export const BUSINESS_FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61583593416199&locale=he_IL";

/** פתיחת חיפוש במפות Google לכתובת הנ״ל */
export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("האורגים 7, חולון Royal Fruit");

/**
 * פרופיל Google Business / רשימה בגוגל, כרגע מצביע לחיפוש במפות.
 * מומלץ להחליף בכתובת הקבועה מלוח הבקרה של Google Business Profile (למשל g.page/...)
 */
export const GOOGLE_BUSINESS_PROFILE_URL = GOOGLE_MAPS_URL;

/** פרופיל Google Business ציבורי (ביקורות ופרטי עסק), ללא /review */
const GOOGLE_BUSINESS_GPAGE_LISTING_DEFAULT = "https://g.page/r/CVeM2UapKGpbEBM";

/**
 * קישור קנוני לפרופיל Google Business עבור sameAs ב־Schema וקישורים באתר.
 * VITE_GOOGLE_BUSINESS_GPAGE ב־.env דורס את ברירת המחדל אם צריך.
 */
const gPageEnv =
  typeof import.meta.env.VITE_GOOGLE_BUSINESS_GPAGE === "string"
    ? import.meta.env.VITE_GOOGLE_BUSINESS_GPAGE.trim()
    : "";
export const GOOGLE_BUSINESS_GPAGE_URL = gPageEnv || GOOGLE_BUSINESS_GPAGE_LISTING_DEFAULT;

const listingForReview = GOOGLE_BUSINESS_GPAGE_URL.replace(/\/$/, "");
/** קישור לדף כתיבת ביקורת (אותו פרופיל כמו GOOGLE_BUSINESS_GPAGE_URL) */
export const GOOGLE_WRITE_REVIEW_URL = listingForReview.endsWith("/review")
  ? listingForReview
  : `${listingForReview}/review`;

/** טקסטים לכפתורי ביקורת (אחידים באתר) */
export const GOOGLE_REVIEW_CTA_HINT = "מרוצים מהשירות? נשמח לביקורת קצרה.";
export const GOOGLE_REVIEW_CTA_LABEL = "דרגו אותנו בגוגל";
/** קישור לפרופיל / סיכום ביקורות ב-Google (כמו בלוח הידע בחיפוש) */
export const GOOGLE_BUSINESS_PAGE_CTA_LABEL = "ביקורות ופרופיל בגוגל";
