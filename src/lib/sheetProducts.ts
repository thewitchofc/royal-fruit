import type { PriceCategory, PriceRow } from "../data/priceList";
import { getProduceShortDescription } from "../data/priceList";

/**
 * טעינה ופרסור של מוצרים מקובץ CSV שמפורסם מ-Google Sheets.
 * עמודות: name, price, category, available, אופציונלי: type (מדור), unit (יחידה/משקל/מארז)
 * כותרת Checkbox בגיליון ממופה ל-available (תיבות סימון ב-Google Sheets → TRUE/FALSE ב-CSV)
 * type = פירות/ירקות (או fruit/veg), איזה דף מציג; category = כותרת קבוצה במחירון (קלופים…).
 * בלי type: סינון לפי category כמו קודם (ערכים פירות/fruit או ירקות/veg).
 */

export type SheetProduct = {
  name: string;
  price: string;
  category: string;
  /** פירות / ירקות, לאיזה דף השורה שייכת כשיש עמודה נפרדת */
  type: string;
  /** משקל/מארז/יחידה או מדרגות מחיר, מוצג ליד המחיר */
  unit: string;
  available: boolean;
};

/** פירוק שורה לפי CSV סטנדרטי (מרכאות כפולות ופסיקים בתוך שדה) */
export function parseCsvRow(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

/** פיצול לשורות תוך כיבוד שדות במרכאות ורווחי שורה בתוך תא */
export function splitCsvTextToRows(text: string): string[] {
  const rows: string[] = [];
  let cur = "";
  let inQuotes = false;
  const t = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inQuotes) {
      if (c === '"') {
        if (t[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === "\n") {
      rows.push(cur);
      cur = "";
    } else if (c === "\r") {
      /* skip; \n follows or lone \r */
    } else {
      cur += c;
    }
  }
  rows.push(cur);
  return rows.filter((r) => r.trim() !== "");
}

/** כותרות בעברית או באנגלית, ממופות לשמות הפנימיים */
function canonicalHeaderKey(raw: string): string {
  const t = raw.trim();
  const lower = t.toLowerCase();
  const he: Record<string, string> = {
    שם: "name",
    "שם מוצר": "name",
    מחיר: "price",
    קטגוריה: "category",
    זמין: "available",
    זמינות: "available",
    מדור: "type",
    סוג: "type",
    יחידה: "unit",
    יחידות: "unit",
    משקל: "unit",
    מארז: "unit",
  };
  if (lower === "unit" || lower === "package" || lower === "pack" || lower === "weight") return "unit";
  if (he[t] != null) return he[t]!;
  if (lower === "checkbox") return "available";
  return lower;
}

function headerIndexMap(headerRow: string): Map<string, number> {
  const cells = parseCsvRow(headerRow);
  const m = new Map<string, number>();
  cells.forEach((raw, i) => {
    const key = canonicalHeaderKey(raw);
    m.set(key, i);
  });
  return m;
}

function parseAvailable(cell: string | undefined): boolean {
  if (cell == null) return false;
  const v = cell.trim().toUpperCase();
  return v === "TRUE" || v === "1" || v === "YES" || v === "כן";
}

export function parseProductsCsv(text: string): SheetProduct[] {
  const rows = splitCsvTextToRows(text);
  if (rows.length < 2) return [];

  const map = headerIndexMap(rows[0]!);
  const ni = map.get("name");
  const pi = map.get("price");
  const ci = map.get("category");
  const ai = map.get("available");
  const ti = map.get("type");
  const ui = map.get("unit");

  if (ni == null || pi == null || ci == null || ai == null) {
    const found = [...new Set([...map.keys()])].sort().join(", ");
    throw new Error(
      `חסרות עמודות ב-CSV (נדרש: name, price, category, available). אופציונלי: type, unit. נמצאו: ${found || "ללא"}`,
    );
  }

  const products: SheetProduct[] = [];
  for (let r = 1; r < rows.length; r++) {
    const cells = parseCsvRow(rows[r]!);
    const name = (cells[ni] ?? "").trim();
    if (!name) continue;
    products.push({
      name,
      price: (cells[pi] ?? "").trim(),
      category: (cells[ci] ?? "").trim(),
      type: ti != null ? (cells[ti] ?? "").trim() : "",
      unit: ui != null ? (cells[ui] ?? "").trim() : "",
      available: parseAvailable(cells[ai]),
    });
  }
  return products;
}

/**
 * דפדפן חוסם לרוב CORS ישיר ל-docs.google.com.
 * הבקשה נשלחת לאותו מקור תחת /google-sheet-csv/..., פרוקסי ב-Vite (dev/preview) וב-Netlify.
 * VITE_GOOGLE_SHEETS_DIRECT=1, לדלג על הפרוקסי (נדיר).
 */
/** נתיב ציבורי בודד בדפדפן, הגיליון נמשך בשרת (Netlify) או במידלוור Vite */
export const PRICE_SHEET_PUBLIC_PATH = "/price-sheet.csv";

export function resolveSheetCsvFetchUrl(configured: string): string {
  if (!configured) return configured;
  if (configured.startsWith("/")) {
    return configured;
  }
  if (import.meta.env.VITE_GOOGLE_SHEETS_DIRECT === "1") {
    return configured;
  }
  try {
    const u = new URL(configured);
    if (u.hostname === "docs.google.com") {
      return `/google-sheet-csv${u.pathname}${u.search}`;
    }
  } catch {
    /* יחסי או URL לא תקין */
  }
  return configured;
}

export async function loadSheetProducts(csvUrl: string): Promise<SheetProduct[]> {
  const url = resolveSheetCsvFetchUrl(csvUrl);
  const res = await fetch(url, { cache: "default", credentials: "omit", mode: "cors" });
  if (!res.ok) {
    throw new Error(
      `טעינת הגיליון נכשלה (קוד ${res.status}). אם זה מסביבה מקומית, הריצו npm run dev / npm run preview עם פרוקסי ב-Vite. בפריסה, ודאו קובץ _redirects ב-Netlify או פרוקסי מקביל.`,
    );
  }
  const text = await res.text();
  if (text.trimStart().startsWith("<!") || text.includes("<html")) {
    throw new Error(
      "התקבלה תשובת HTML במקום CSV, כנראה כתובת לא מפורסמת, פרוקסי לא מוגדר, או SPA החזירה דף בית. בדקו קישור פרסום CSV ופריסת שרת.",
    );
  }
  try {
    return parseProductsCsv(text);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(msg);
  }
}

export function normalizeCategoryKey(s: string): string {
  return s.trim().toLowerCase();
}

/** התאמת קטגוריה מול הגיליון, כמה כינויים לפירות/ירקות */
export function categoryMatchesAliases(productCategory: string, aliases: readonly string[]): boolean {
  const key = normalizeCategoryKey(productCategory);
  return aliases.some((a) => normalizeCategoryKey(a) === key);
}

export const FRUIT_CATEGORY_ALIASES = ["פירות", "fruit", "fruits", "פרי"] as const;
export const VEG_CATEGORY_ALIASES = ["ירקות", "vegetable", "vegetables", "veg", "ירק"] as const;

export type SheetPageFilter = "fruits" | "vegetables" | "all";

function productMatchesSheetPage(p: SheetProduct, page: SheetPageFilter): boolean {
  if (page === "all") return true;
  const typeCell = p.type?.trim();
  if (typeCell) {
    return page === "fruits"
      ? categoryMatchesAliases(typeCell, FRUIT_CATEGORY_ALIASES)
      : categoryMatchesAliases(typeCell, VEG_CATEGORY_ALIASES);
  }
  return page === "fruits"
    ? categoryMatchesAliases(p.category, FRUIT_CATEGORY_ALIASES)
    : categoryMatchesAliases(p.category, VEG_CATEGORY_ALIASES);
}

function slugForSheetCategory(title: string, idx: number): string {
  const base = title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0590-\u05FF-]/g, "")
    .slice(0, 36);
  return base || `c${idx}`;
}

/** שורות עם «מיץ» בשם (לא חומץ), עמודת «מיצים» נפרסת בדף הפירות */
function isJuiceProductNameFromSheet(name: string): boolean {
  const n = name.trim();
  return n.includes("מיץ") && !n.includes("חומץ");
}

/** קיבוץ מוצרים מהגיליון למבנה כמו מחירון האתר, כותרת קבוצה = עמודת category */
export function groupSheetProductsToPriceCategories(
  products: SheetProduct[],
  opts: {
    idPrefix: string;
    defaultEmoji: string;
    page: SheetPageFilter;
  },
): PriceCategory[] {
  let list = products.filter((p) => p.available).filter((p) => productMatchesSheetPage(p, opts.page));
  const groups = new Map<string, SheetProduct[]>();
  for (const p of list) {
    const title = p.category.trim() || "כללי";
    const arr = groups.get(title) ?? [];
    arr.push(p);
    groups.set(title, arr);
  }

  if (opts.page === "fruits") {
    const pulledJuices: SheetProduct[] = [];
    for (const [title, rows] of [...groups.entries()]) {
      if (title === "מיצים" || title === "רגיל" || title === "ליחידה" || title === "תותים") continue;
      const stay: SheetProduct[] = [];
      for (const p of rows) {
        if (isJuiceProductNameFromSheet(p.name)) pulledJuices.push(p);
        else stay.push(p);
      }
      if (stay.length === 0) groups.delete(title);
      else groups.set(title, stay);
    }
    if (pulledJuices.length > 0) {
      const existing = groups.get("מיצים") ?? [];
      groups.set("מיצים", [...existing, ...pulledJuices]);
    }
  }

  let sheetJuiceBucket: SheetProduct[] = [];
  let sheetRegularBucket: SheetProduct[] = [];
  let sheetStrawberryBucket: SheetProduct[] = [];

  if (opts.page === "fruits") {
    sheetJuiceBucket = groups.get("מיצים") ?? [];
    sheetRegularBucket = [...(groups.get("רגיל") ?? []), ...(groups.get("ליחידה") ?? [])];
    sheetStrawberryBucket = groups.get("תותים") ?? [];
    groups.delete("מיצים");
    groups.delete("רגיל");
    groups.delete("ליחידה");
    groups.delete("תותים");
  }

  let entries = [...groups.entries()].filter(([, rows]) => rows.length > 0);
  entries.sort(([a], [b]) => a.localeCompare(b, "he"));

  const sheetRow = (products: SheetProduct[], emoji: string): PriceRow[] =>
    products.map((p) => ({
      emoji,
      name: p.name,
      price: p.price.trim() || undefined,
      unit: p.unit.trim() || undefined,
      description: getProduceShortDescription(p.name),
    }));

  const categories: PriceCategory[] = entries.map(([title, rows], idx) => ({
    id: `${opts.idPrefix}-${slugForSheetCategory(title, idx)}`,
    title,
    emoji: opts.defaultEmoji,
    rows: rows.map((p) => ({
      emoji: opts.defaultEmoji,
      name: p.name,
      price: p.price.trim() || undefined,
      unit: p.unit.trim() || undefined,
      description: getProduceShortDescription(p.name),
    })),
  }));

  if (
    opts.page === "fruits" &&
    (sheetJuiceBucket.length > 0 || sheetRegularBucket.length > 0 || sheetStrawberryBucket.length > 0)
  ) {
    const subsections = [];
    if (sheetRegularBucket.length > 0) {
      subsections.push({ title: "רגיל", rows: sheetRow(sheetRegularBucket, "🍇") });
    }
    if (sheetStrawberryBucket.length > 0) {
      subsections.push({ title: "תותים", rows: sheetRow(sheetStrawberryBucket, "🍓") });
    }
    const merged: PriceCategory = {
      id: `${opts.idPrefix}-juices`,
      title: "מיצים",
      emoji: "🧃",
      rows: sheetJuiceBucket.length > 0 ? sheetRow(sheetJuiceBucket, "🧃") : undefined,
      subsections: subsections.length > 0 ? subsections : undefined,
    };
    const mi = categories.findIndex((c) => c.title === "מיוחדים");
    if (mi >= 0) categories.splice(mi, 0, merged);
    else categories.push(merged);
  }

  return stripExactDuplicatePriceRows(categories);
}

/** מסיר שורות זהות לחלוטין (שם + מחיר + יחידה) אחרי מיזוג קטגוריות, מונע כפילות מהעתקה בגיליון */
function stripExactDuplicatePriceRows(categories: PriceCategory[]): PriceCategory[] {
  const seen = new Set<string>();
  const key = (r: PriceRow) =>
    `${r.name.trim().replace(/\s+/g, " ")}|${(r.price ?? "").trim()}|${(r.unit ?? "").trim()}`;

  function filterRows(rows: PriceRow[]): PriceRow[] {
    return rows.filter((r) => {
      const p = (r.price ?? "").trim();
      const u = (r.unit ?? "").trim();
      if (!p && !u) return true;
      const k = key(r);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  return categories
    .map((cat) => ({
      ...cat,
      rows: cat.rows?.length ? filterRows(cat.rows) : undefined,
      subsections: cat.subsections?.map((sub) => ({
        ...sub,
        rows: filterRows(sub.rows),
      })),
    }))
    .map((cat) => ({
      ...cat,
      subsections: cat.subsections?.filter((sub) => sub.rows.length > 0),
    }))
    .filter((cat) => (cat.rows?.length ?? 0) > 0 || (cat.subsections?.length ?? 0) > 0);
}

/**
 * כתובת לטעינת CSV במחירון.
 * מומלץ: VITE_PRICE_SHEET_VIA_PROXY=1 + GOOGLE_SHEETS_PRODUCTS_CSV_URL בשרת/.env (בלי חשיפת URL ב-bundle).
 * מצב ישן: רק VITE_GOOGLE_SHEETS_PRODUCTS_CSV_URL, נשאר לתאימות.
 */
export function getGoogleSheetsProductsCsvUrl(): string | undefined {
  const viaProxy = import.meta.env.VITE_PRICE_SHEET_VIA_PROXY === "1";
  if (viaProxy) {
    return PRICE_SHEET_PUBLIC_PATH;
  }
  const legacy = import.meta.env.VITE_GOOGLE_SHEETS_PRODUCTS_CSV_URL?.trim();
  return legacy ? resolveSheetCsvFetchUrl(legacy) : undefined;
}
