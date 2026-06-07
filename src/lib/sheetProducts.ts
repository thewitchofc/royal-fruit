import type { PriceCategory, PriceRow, PriceWeightOption } from "../data/priceList";
import { getProduceShortDescription } from "../data/priceList";

/**
 * טעינה ופרסור של מוצרים מקובץ CSV שמפורסם מ-Google Sheets.
 * עמודות: name, price, category, type, unit, deal, Checkbox (+ אופציונלי packageTier למארזי פירות).
 * כותרת Checkbox ממופה ל-available (ריק / TRUE = מוצג; FALSE / 0 / לא = מוסתר).
 * type = סינון ראשי לדפי האתר (פירות, ירקות, ירק ושורשים, מטבח טרי).
 * category = כותרת קבוצה בתוך כל type (פירות רגילים, קלופים, מיצים…).
 * אין רשימות קשיחות — כל type/category חדשים בגיליון מופיעים אוטומטית.
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
  /**
   * רמת מארז פירות מהגיליון (basic / premium / gold).
   * ריק אם העמודה חסרה או אין שיוך למארז.
   */
  packageTier: "" | "basic" | "premium" | "gold";
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
    "רמת מארז": "packageTier",
    "חבילת פירות": "packageTier",
  };
  if (lower === "unit" || lower === "package" || lower === "pack" || lower === "weight") return "unit";
  if (lower === "packagetier" || lower === "package_tier" || lower === "tier") return "packageTier";
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

/** תא ריק בגיליון נחשב זמין — רק ערכים מפורשים כ-FALSE מסמנים לא זמין */
function parseAvailable(cell: string | undefined): boolean {
  if (cell == null || cell.trim() === "") return true;
  const v = cell.trim().toUpperCase();
  if (v === "FALSE" || v === "0" || v === "NO" || v === "לא") return false;
  return true;
}

/** ערך עמודת packageTier בגיליון → ערך פנימי אחיד */
export function normalizePackageTierFromCell(cell: string | undefined): SheetProduct["packageTier"] {
  if (cell == null) return "";
  const raw = cell.trim().toLowerCase();
  if (!raw) return "";
  if (raw === "basic" || raw === "בסיס" || raw === "בסיסי") return "basic";
  if (raw === "premium" || raw === "פרימיום") return "premium";
  if (raw === "gold" || raw === "גולד") return "gold";
  return "";
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
  const pti = map.get("packageTier");

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
      packageTier: pti != null ? normalizePackageTierFromCell(cells[pti]) : "",
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
  const text = await res.text();
  if (!res.ok) {
    const plain =
      text.length > 0 && !text.trimStart().startsWith("<") && !text.toLowerCase().includes("<html")
        ? text.trim().slice(0, 400)
        : "";
    throw new Error(
      plain
        ? `טעינת הגיליון נכשלה (קוד ${res.status}): ${plain}`
        : `טעינת הגיליון נכשלה (קוד ${res.status}). אם זה מסביבה מקומית — ודאו .env עם GOOGLE_SHEETS_PRODUCTS_CSV_URL ו-VITE_PRICE_SHEET_VIA_PROXY=1. בפריסה — משתני סביבה ב-Netlify/Render ונתיב /price-sheet.csv.`,
    );
  }
  if (text.trimStart().startsWith("<!") || text.toLowerCase().includes("<html")) {
    throw new Error(
      "התקבלה תשובת HTML במקום CSV. פתרונות: (1) בגיליון — קישור לייצוא CSV (Publish to web / export?format=csv&gid=…) ולא כתובת /edit. (2) ב-local — קובץ .env עם VITE_PRICE_SHEET_VIA_PROXY=1 ו-GOOGLE_SHEETS_PRODUCTS_CSV_URL=… (3) בפריסה — אותו משתנה שרת + וודאו שהנתיב /price-sheet.csv לא מוחזר כדף האתר.",
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

/** מפתח השוואה לערכי type/category מהגיליון */
export function normalizeSheetLabelKey(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLocaleLowerCase("he-IL");
}

/** האם שורת הגיליון שייכת ל-type מבוקש (עמודת type בגיליון) */
export function productMatchesSheetType(p: SheetProduct, sheetType: string): boolean {
  const expected = normalizeSheetLabelKey(sheetType);
  if (!expected) return false;
  const actual = normalizeSheetLabelKey(p.type);
  return Boolean(actual) && actual === expected;
}

/** כל ערכי type הייחודיים בגיליון (לפי סדר הופעה) */
export function getDistinctSheetTypes(products: SheetProduct[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of products) {
    const label = p.type.trim();
    if (!label) continue;
    const key = normalizeSheetLabelKey(label);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(label);
  }
  return out;
}

/** שם שורה בגיליון שמייצג רק משקל (250 גרם, 1 קילו…) */
export function isWeightOnlySheetProductName(name: string): boolean {
  const n = name.trim().replace(/\s+/g, " ");
  return /^(\d+(?:[.,]\d+)?)\s*(?:גרם|ג(?:["׳׳']?רם)?|קילו|ק(?:["׳׳']?ג)?|kg)\s*$/iu.test(n);
}

function weightOptionSortKey(weight: string): number {
  const n = weight.trim().replace(/\s+/g, " ");
  const m = /^(\d+(?:[.,]\d+)?)\s*(גרם|ג(?:["׳׳']?רם)?|קילו|ק(?:["׳׳']?ג)?|kg)\s*$/iu.exec(n);
  if (!m) return 1e9;
  const amount = parseFloat(m[1]!.replace(",", "."));
  const unit = m[2]!.toLowerCase();
  const grams = /קילו|ק(?:["׳׳']?ג)?|kg/.test(unit) ? amount * 1000 : amount;
  return Number.isFinite(grams) ? grams : 1e9;
}

/** כשכל השורות בקטגוריה הן משקלים — מוצר אחד עם בחירת משקל (שם המוצר = כותרת הקטגוריה) */
function collapseWeightTierRows(rows: PriceRow[], productTitle: string): PriceRow[] {
  if (rows.length < 2 || !rows.every((r) => isWeightOnlySheetProductName(r.name))) {
    return rows;
  }
  const weightOptions: PriceWeightOption[] = rows
    .map((r) => ({ weight: r.name.trim(), price: (r.price ?? "").trim() }))
    .filter((o) => o.weight && o.price)
    .sort((a, b) => weightOptionSortKey(a.weight) - weightOptionSortKey(b.weight));
  if (weightOptions.length < 2) return rows;
  return [
    {
      emoji: rows[0]!.emoji,
      name: productTitle,
      description: getProduceShortDescription(productTitle),
      weightOptions,
    },
  ];
}

function slugForSheetCategory(title: string, idx: number): string {
  const base = title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0590-\u05FF-]/g, "")
    .slice(0, 36);
  return base || `c${idx}`;
}

/** קיבוץ מוצרים מהגיליון: סינון לפי type, כותרות קבוצה לפי category */
export function groupSheetProductsToPriceCategories(
  products: SheetProduct[],
  opts: {
    idPrefix: string;
    defaultEmoji: string;
    sheetType: string;
  },
): PriceCategory[] {
  const list = products
    .filter((p) => p.available)
    .filter((p) => productMatchesSheetType(p, opts.sheetType));

  const groups = new Map<string, SheetProduct[]>();
  for (const p of list) {
    const title = p.category.trim() || "כללי";
    const arr = groups.get(title) ?? [];
    arr.push(p);
    groups.set(title, arr);
  }

  const entries = [...groups.entries()]
    .filter(([, rows]) => rows.length > 0)
    .sort(([a], [b]) => a.localeCompare(b, "he"));

  const categories: PriceCategory[] = entries.map(([title, rows], idx) => {
    const orderedRows = [...rows].sort((a, b) => a.name.localeCompare(b.name, "he"));
    return {
      id: `${opts.idPrefix}-${slugForSheetCategory(title, idx)}`,
      title,
      emoji: opts.defaultEmoji,
      rows: collapseWeightTierRows(
        orderedRows.map((p) => ({
          emoji: opts.defaultEmoji,
          name: p.name,
          price: p.price.trim() || undefined,
          unit: p.unit.trim() || undefined,
          description: getProduceShortDescription(p.name),
        })),
        title,
      ),
    };
  });

  return stripExactDuplicatePriceRows(mergeOrphanWeightProductsIntoGroupCategory(categories));
}

/** קטגוריה שהכותרת שלה היא שם קבוצה (לא שם מוצר בודד) */
function isGroupingPriceCategory(cat: PriceCategory): boolean {
  const rows = cat.rows ?? [];
  if (!rows.length) return false;
  const title = cat.title.trim();
  return rows.every((r) => !r.weightOptions?.length && r.name.trim() !== title);
}

/** מוצר עם מדרגות משקל שמופיע בקטגוריה נפרדת בשם המוצר */
function isOrphanWeightPriceCategory(cat: PriceCategory): boolean {
  const row = cat.rows?.[0];
  if (!row || cat.rows!.length !== 1) return false;
  return (row.weightOptions?.length ?? 0) > 1 && row.name.trim() === cat.title.trim();
}

/** מדרגות משקל נכנסות לקבוצת מוצרים קיימת (למשל «חמוצים») — כרטיס בגודל אחיד */
function mergeOrphanWeightProductsIntoGroupCategory(categories: PriceCategory[]): PriceCategory[] {
  const orphans = categories.filter(isOrphanWeightPriceCategory);
  if (!orphans.length) return categories;

  const mergeTargets = categories
    .filter(isGroupingPriceCategory)
    .filter((c) => !/מיץ|מיוחד/i.test(c.title))
    .sort((a, b) => (b.rows?.length ?? 0) - (a.rows?.length ?? 0));
  const fallbackTargets = categories
    .filter(isGroupingPriceCategory)
    .sort((a, b) => (b.rows?.length ?? 0) - (a.rows?.length ?? 0));
  const target = mergeTargets[0] ?? fallbackTargets[0];
  if (!target) return categories;

  const orphanRows = orphans.flatMap((c) => c.rows ?? []);
  const orphanKeys = new Set(orphans.map((c) => normalizeSheetLabelKey(c.title)));
  const mergedRows = [...(target.rows ?? []), ...orphanRows].sort((a, b) =>
    a.name.localeCompare(b.name, "he"),
  );

  return categories
    .filter((c) => !orphanKeys.has(normalizeSheetLabelKey(c.title)))
    .map((c) =>
      normalizeSheetLabelKey(c.title) === normalizeSheetLabelKey(target.title)
        ? { ...c, rows: mergedRows }
        : c,
    )
    .sort((a, b) => a.title.localeCompare(b.title, "he"));
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
    if (r.weightOptions?.length) {
      byBase.set(`__weight_opts_${byBase.size}`, [r]);
      continue;
    }
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
 * כברירת מחדל: `/price-sheet.csv` (Netlify / Render / Vite מושכים מ-GOOGLE_SHEETS_PRODUCTS_CSV_URL).
 * בלי המשתנה VITE_PRICE_SHEET_VIA_PROXY בבילד, עדיין משתמשים בנתיב הזה — לא מחזירים undefined.
 * מצב ישן: VITE_GOOGLE_SHEETS_PRODUCTS_CSV_URL (חשוף בבקשות) או VITE_GOOGLE_SHEETS_DIRECT.
 */
export function getGoogleSheetsProductsCsvUrl(): string {
  const viaProxy = import.meta.env.VITE_PRICE_SHEET_VIA_PROXY === "1";
  if (viaProxy) {
    return PRICE_SHEET_PUBLIC_PATH;
  }
  const legacy = import.meta.env.VITE_GOOGLE_SHEETS_PRODUCTS_CSV_URL?.trim();
  if (legacy) {
    return resolveSheetCsvFetchUrl(legacy);
  }
  return PRICE_SHEET_PUBLIC_PATH;
}
