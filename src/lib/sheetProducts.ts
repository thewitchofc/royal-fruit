import type { PriceCategory, PriceRow } from "../data/priceList";
import { getProduceShortDescription } from "../data/priceList";

/**
 * טעינה ופרסור של מוצרים מקובץ CSV שמפורסם מ-Google Sheets.
 * דפים ייעודיים: ב־type או ב־category ערכים כמו «מיצים», «חלווה», «אוכל ביתי» (כינויים ב־*_CATEGORY_ALIASES).
 * עמודות: name, price, category, available, אופציונלי: type (מדור), unit (יחידה/משקל/מארז)
 * שורות מוכנות לגיליון: `data/google-sheets-price-append.csv` — עמודות כמו בגיליון: name,price,category,type,unit,deal,Checkbox.
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

/** תיקון כתיב שגוי נפוץ מהגיליון (קוסברה → כוסברה) */
function normalizeSheetProductName(raw: string): string {
  return raw.trim().replace(/קוסברה/g, "כוסברה");
}

/** מפתח אחיד להשוואת שם מוצר בין סל לגיליון */
export function sheetProductKeyNormalized(name: string): string {
  return normalizeSheetProductName(name)
    .toLocaleLowerCase("he-IL")
    .replace(/\s+/g, " ")
    .replace(/["'״׳]/g, "")
    .trim();
}

/** התאמת שורת סל למוצר בגיליון (לפי שם מוצג) */
export function findSheetProductByName(name: string, products: SheetProduct[]): SheetProduct | undefined {
  const key = sheetProductKeyNormalized(name);
  const matches = products.filter((p) => sheetProductKeyNormalized(p.name) === key);
  if (matches.length === 0) return undefined;
  const availableOnes = matches.filter((p) => p.available);
  return availableOnes.length > 0 ? availableOnes[0]! : matches[0]!;
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
    const name = normalizeSheetProductName((cells[ni] ?? "").trim());
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

async function fetchCsvText(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store", credentials: "omit", mode: "cors" });
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
  return text;
}

export async function loadSheetProducts(csvUrl: string): Promise<SheetProduct[]> {
  const url = resolveSheetCsvFetchUrl(csvUrl);
  const useProxyFallback = url !== PRICE_SHEET_PUBLIC_PATH;

  try {
    const text = await fetchCsvText(url);
    return parseProductsCsv(text);
  } catch (firstErr) {
    if (!useProxyFallback) {
      const msg = firstErr instanceof Error ? firstErr.message : String(firstErr);
      throw new Error(msg);
    }
    try {
      const text = await fetchCsvText(PRICE_SHEET_PUBLIC_PATH);
      return parseProductsCsv(text);
    } catch {
      const msg = firstErr instanceof Error ? firstErr.message : String(firstErr);
      throw new Error(msg);
    }
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
export const JUICE_CATEGORY_ALIASES = ["מיצים", "juices", "juice"] as const;
/** עמודת type או category בגיליון — דף חלווה */
export const HALVA_CATEGORY_ALIASES = ["חלווה", "חלווה וממרחים", "halva", "halvah"] as const;
/** עמודת type או category — דף אוכל ביתי / מטבח טרי */
export const HOMEFOOD_CATEGORY_ALIASES = [
  "אוכל ביתי",
  "אוכל-ביתי",
  "מטבח טרי",
  "מטבח",
  "home food",
  "homefood",
  "homemade",
  "home-food",
] as const;

/** כותרות קטגוריה בגיליון שנספחות לבלוק «מיצים» (מבנה קיים) */
const JUICE_SHEET_CATEGORY_BUCKET = ["מיצים", "רגיל", "ליחידה", "תותים"] as const;

function isJuiceSheetCategoryTitle(title: string): boolean {
  return (JUICE_SHEET_CATEGORY_BUCKET as readonly string[]).includes(title.trim());
}

/** שורה ששייכת לדף המיצים: מיץ בשם, קטגוריית מיצים בגיליון, או סוג «מיצים» */
export function isJuiceProductBySheetMetadata(p: SheetProduct): boolean {
  if (isJuiceProductNameFromSheet(p.name)) return true;
  if (isJuiceSheetCategoryTitle(p.category)) return true;
  const t = p.type?.trim() ?? "";
  if (t && categoryMatchesAliases(t, JUICE_CATEGORY_ALIASES)) return true;
  if (categoryMatchesAliases(p.category, JUICE_CATEGORY_ALIASES)) return true;
  return false;
}

export function isHalvaProductBySheetMetadata(p: SheetProduct): boolean {
  const t = p.type?.trim() ?? "";
  if (t && categoryMatchesAliases(t, HALVA_CATEGORY_ALIASES)) return true;
  return categoryMatchesAliases(p.category, HALVA_CATEGORY_ALIASES);
}

export function isHomeFoodProductBySheetMetadata(p: SheetProduct): boolean {
  const t = p.type?.trim() ?? "";
  if (t && categoryMatchesAliases(t, HOMEFOOD_CATEGORY_ALIASES)) return true;
  return categoryMatchesAliases(p.category, HOMEFOOD_CATEGORY_ALIASES);
}

function isDedicatedCatalogPageProduct(p: SheetProduct): boolean {
  return (
    isJuiceProductBySheetMetadata(p) || isHalvaProductBySheetMetadata(p) || isHomeFoodProductBySheetMetadata(p)
  );
}

export type SheetPageFilter = "fruits" | "vegetables" | "juices" | "halva" | "homeFood" | "all";

function productMatchesSheetPage(p: SheetProduct, page: SheetPageFilter): boolean {
  if (page === "all") return true;
  if (page === "juices") {
    return isJuiceProductBySheetMetadata(p);
  }
  if (page === "halva") {
    return isHalvaProductBySheetMetadata(p);
  }
  if (page === "homeFood") {
    return isHomeFoodProductBySheetMetadata(p);
  }
  if (isDedicatedCatalogPageProduct(p)) {
    return false;
  }
  const typeCell = p.type?.trim() ?? "";
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

/** שורות עם «מיץ» בשם (לא חומץ) — מוצגות בדף המיצים */
function isJuiceProductNameFromSheet(name: string): boolean {
  const n = name.trim();
  return n.includes("מיץ") && !n.includes("חומץ");
}

/** סדר תצוגת מדורים בדף חלווה לפי עמודת category בגיליון */
function halvaSheetCategorySortOrder(title: string): number {
  const t = title.trim().replace(/\s+/g, " ");
  const lower = t.toLowerCase();
  if (t === "חלווה בטעם" || (t.includes("חלווה") && t.includes("בטעם")) || t === "חלווה") return 0;
  if (t === "טחינה וקרמים" || (t.includes("טחינה") && t.includes("קרמ"))) return 1;
  if (t.includes("רטב") || lower.includes("sauce")) return 2;
  return 50;
}

/** סדר שורות בתוך קבוצת «חלווה בטעם» — עקבי עם כרטיסי ההיכרות בעמוד */
function halvaFlavorRowSortOrder(name: string): number {
  const order = ["אגוזי לוז", "פיסטק", "פקאן", "טעם של פעם"];
  const i = order.indexOf(name.trim());
  return i >= 0 ? i : 100;
}

/** סדר שורות בקבוצת «טחינה וקרמים» */
function halvaSpreadRowSortOrder(name: string): number {
  const order = [
    "טחינה אתיופית",
    "טחינה מלאה עם וניל טהור",
    "טחינה עם אגוזי לוז וקקאו",
    "קרם פיסטוק",
    "קרם אגוזי לוז",
  ];
  const i = order.indexOf(name.trim());
  return i >= 0 ? i : 100;
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

  if (opts.page === "juices") {
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

  if (opts.page === "juices") {
    sheetJuiceBucket = groups.get("מיצים") ?? [];
    sheetRegularBucket = [...(groups.get("רגיל") ?? []), ...(groups.get("ליחידה") ?? [])];
    sheetStrawberryBucket = groups.get("תותים") ?? [];
    groups.delete("מיצים");
    groups.delete("רגיל");
    groups.delete("ליחידה");
    groups.delete("תותים");
  }

  let entries = [...groups.entries()].filter(([, rows]) => rows.length > 0);
  if (opts.page === "halva") {
    entries.sort(([titleA], [titleB]) => {
      const da = halvaSheetCategorySortOrder(titleA);
      const db = halvaSheetCategorySortOrder(titleB);
      if (da !== db) return da - db;
      return titleA.localeCompare(titleB, "he");
    });
  } else {
    entries.sort(([a], [b]) => a.localeCompare(b, "he"));
  }

  const sheetRow = (products: SheetProduct[], emoji: string): PriceRow[] =>
    products.map((p) => ({
      emoji,
      name: p.name,
      price: p.price.trim() || undefined,
      unit: p.unit.trim() || undefined,
      description: getProduceShortDescription(p.name),
    }));

  const categories: PriceCategory[] = entries.map(([title, rows], idx) => {
    let orderedRows = rows;
    if (opts.page === "halva") {
      const bucket = halvaSheetCategorySortOrder(title);
      if (bucket === 0) {
        orderedRows = [...rows].sort((a, b) => {
          const da = halvaFlavorRowSortOrder(a.name);
          const db = halvaFlavorRowSortOrder(b.name);
          if (da !== db) return da - db;
          return a.name.localeCompare(b.name, "he");
        });
      } else if (bucket === 1) {
        orderedRows = [...rows].sort((a, b) => {
          const da = halvaSpreadRowSortOrder(a.name);
          const db = halvaSpreadRowSortOrder(b.name);
          if (da !== db) return da - db;
          return a.name.localeCompare(b.name, "he");
        });
      }
    }
    return {
      id: `${opts.idPrefix}-${slugForSheetCategory(title, idx)}`,
      title,
      emoji: opts.defaultEmoji,
      rows: orderedRows.map((p) => ({
        emoji: opts.defaultEmoji,
        name: p.name,
        price: p.price.trim() || undefined,
        unit: p.unit.trim() || undefined,
        description: getProduceShortDescription(p.name),
      })),
    };
  });

  if (
    opts.page === "juices" &&
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
      id: `${opts.idPrefix}-juice-menu`,
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

/** שם תצוגה לאיחוד כפילויות (למשל «סברס» ו«סברס (לק״ג)» → אותו בסיס) */
function baseProductNameForDedupe(name: string): string {
  const normalized = name.trim().replace(/\s+/g, " ");
  return normalized
    .replace(
      /\s*\(\s*(לקילוגרם|לקילו|לק״ג|לק"\s*ג|ליחידה|יחידה|למארז)\s*\)\s*$/iu,
      "",
    )
    .trim();
}

function formatRowPriceDisplay(r: PriceRow): string {
  const p = (r.price ?? "").trim();
  const u = (r.unit ?? "").trim();
  if (!p && !u) return "";
  if (p && u) return `${p} ${u}`.trim();
  return p || u;
}

/** מאחד שורות עם אותו שם בסיס (יחידה מול ק״ג) לשורה אחת עם מחירים מחוברים */
function mergeRowsByBaseProductName(rows: PriceRow[]): PriceRow[] {
  const byBase = new Map<string, PriceRow[]>();
  for (const r of rows) {
    const b = baseProductNameForDedupe(r.name);
    const key = b || `__anon_${byBase.size}`;
    const arr = byBase.get(key) ?? [];
    arr.push(r);
    byBase.set(key, arr);
  }
  const out: PriceRow[] = [];
  for (const group of byBase.values()) {
    if (group.length === 1) {
      out.push(group[0]);
      continue;
    }
    const display = group.reduce((a, c) => (a.name.length <= c.name.length ? a : c));
    const parts = [...new Set(group.map(formatRowPriceDisplay).filter(Boolean))];
    const merged: PriceRow = {
      ...display,
      price: parts.length > 0 ? parts.join(" · ") : display.price,
      unit: parts.length > 1 ? undefined : display.unit,
    };
    out.push(merged);
  }
  return out;
}

/** מסיר שורות זהות לחלוטין (שם + מחיר + יחידה) בתוך כל קטגוריה, ואז מאחד שמות בסיס כמו סברס / סברס (לק״ג) */
function stripExactDuplicatePriceRows(categories: PriceCategory[]): PriceCategory[] {
  const rowKey = (r: PriceRow) =>
    `${r.name.trim().replace(/\s+/g, " ")}|${(r.price ?? "").trim()}|${(r.unit ?? "").trim()}`;

  function dedupeExactThenMerge(rows: PriceRow[]): PriceRow[] {
    const seenLocal = new Set<string>();
    const filtered = rows.filter((r) => {
      const p = (r.price ?? "").trim();
      const u = (r.unit ?? "").trim();
      if (!p && !u) return true;
      const k = rowKey(r);
      if (seenLocal.has(k)) return false;
      seenLocal.add(k);
      return true;
    });
    return mergeRowsByBaseProductName(filtered);
  }

  return categories
    .map((cat) => ({
      ...cat,
      rows: cat.rows?.length ? dedupeExactThenMerge(cat.rows) : undefined,
      subsections: cat.subsections?.map((sub) => ({
        ...sub,
        rows: dedupeExactThenMerge(sub.rows),
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
