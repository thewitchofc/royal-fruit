/**
 * מחזיר CSV ממחירון Google Sheets בלי חשיפת כתובת מלאה ב-bundle הדפדפן.
 * הגדרו ב-Netlify (או מקומית): GOOGLE_SHEETS_PRODUCTS_CSV_URL
 * גיבוי: VITE_GOOGLE_SHEETS_PRODUCTS_CSV_URL אם כבר מוגדר בלבד בשרת.
 */
export const handler = async () => {
  const url =
    process.env.GOOGLE_SHEETS_PRODUCTS_CSV_URL?.trim() ||
    process.env.VITE_GOOGLE_SHEETS_PRODUCTS_CSV_URL?.trim();
  if (!url) {
    return {
      statusCode: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: "Price sheet URL not configured (GOOGLE_SHEETS_PRODUCTS_CSV_URL).",
    };
  }

  try {
    const res = await fetch(url, { headers: { Accept: "text/csv,*/*" } });
    const text = await res.text();
    if (!res.ok) {
      return {
        statusCode: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: `Upstream error ${res.status}`,
      };
    }
    if (text.trimStart().startsWith("<!") || text.includes("<html")) {
      return {
        statusCode: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: "Expected CSV, received HTML — check publish/export URL.",
      };
    }
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "public, max-age=60, s-maxage=120",
      },
      body: text,
    };
  } catch {
    return {
      statusCode: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: "Failed to fetch sheet.",
    };
  }
};
