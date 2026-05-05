import {
  productMatchesSheetPage,
  sheetProductKeyNormalized,
  type SheetProduct,
} from "./sheetProducts";

export type FruitPackageTier = Exclude<SheetProduct["packageTier"], "">;

/** מחיר למיון (זול → יקר), כשאין מספר — בסוף הרשימה */
export function parsePriceForSort(price: string): number {
  const d = price.replace(/,/g, ".").replace(/[^\d.]/g, "");
  const n = parseFloat(d);
  return Number.isFinite(n) ? n : 1e9;
}

function sortByPriceAsc(a: SheetProduct, b: SheetProduct): number {
  const da = parsePriceForSort(a.price);
  const db = parsePriceForSort(b.price);
  if (da !== db) return da - db;
  return a.name.localeCompare(b.name, "he");
}

export function dedupeFruitPackageProducts(products: SheetProduct[]): SheetProduct[] {
  const seen = new Set<string>();
  const out: SheetProduct[] = [];
  for (const p of products) {
    const k = sheetProductKeyNormalized(p.name);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out;
}

function isFruitCatalogRow(p: SheetProduct): boolean {
  return productMatchesSheetPage(p, "fruits");
}

function isExcludedFromFruitTrays(p: SheetProduct): boolean {
  const n = p.name.trim().replace(/\s+/g, " ");
  // הסרה מוחלטת ממגשי פירות (כל וריאציה של “קוקוס לשתייה/לשתיה”)
  if (/^קוקוס\s+לשת(י|יי)ה\b/.test(n)) return true;
  if (n.includes("קוקוס") && n.includes("לשת") && n.includes("קש")) return true;
  if (n === "פקאן בוואקום") return true;
  return false;
}

/** האם בגיליון מופיעה לפחות פעם אחת עמודת רמת מארז (לא ריקה) */
export function sheetHasAnyFruitPackageTier(products: SheetProduct[]): boolean {
  return products.some((p) => isFruitCatalogRow(p) && p.packageTier !== "");
}

/**
 * כשאין בגיליון עמודת packageTier (או כולה ריקה), לא ניתן לסנן מארזים — משחזרים התנהגות שימושית:
 * מחלקים את פירות הקטלוג לשלישים לפי מחיר (זול→בסיס, אמצע→פרימיום, יקר→גולד).
 * אם כבר יש לפחות שורה אחת עם packageTier, משאירים את הנתונים מהגיליון בלבד.
 */
export function resolveProductsForFruitPackages(products: SheetProduct[]): SheetProduct[] {
  if (sheetHasAnyFruitPackageTier(products)) {
    // גם כשיש tier בגיליון, מסננים פריטים שלא נכנסים ל״מגשי פירות״
    return products.filter((p) => !isExcludedFromFruitTrays(p));
  }

  const fruitRows = dedupeFruitPackageProducts(
    products.filter((p) => isFruitCatalogRow(p) && !isExcludedFromFruitTrays(p)),
  );
  const sorted = [...fruitRows].sort(sortByPriceAsc);
  const n = sorted.length;
  if (n === 0) return products;

  const iBasic = Math.max(1, Math.ceil(n / 3));
  const iPrem = Math.max(iBasic, Math.ceil((2 * n) / 3));

  const keyToTier = new Map<string, SheetProduct["packageTier"]>();
  sorted.forEach((p, i) => {
    const k = sheetProductKeyNormalized(p.name);
    if (keyToTier.has(k)) return;
    const tier: SheetProduct["packageTier"] =
      i < iBasic ? "basic" : i < iPrem ? "premium" : "gold";
    keyToTier.set(k, tier);
  });

  return products.map((p) => {
    if (!isFruitCatalogRow(p)) return p;
    if (isExcludedFromFruitTrays(p)) return p;
    if (p.packageTier) return p;
    const t = keyToTier.get(sheetProductKeyNormalized(p.name));
    return t ? { ...p, packageTier: t } : p;
  });
}

/** שורת פירות לכרטיסי מארז: דף פירות, packageTier מלא, זמין */
export function isFruitRowEligibleForPackageUi(p: SheetProduct): boolean {
  if (!p.available) return false;
  if (!productMatchesSheetPage(p, "fruits")) return false;
  if (isExcludedFromFruitTrays(p)) return false;
  return Boolean(p.packageTier);
}

/** מפת שם מנורמל → רמת מארז (כולל פריטים שלא זמינים — לצורך החלפה) */
export function buildFruitPackageTierByKey(products: SheetProduct[]): Map<string, FruitPackageTier> {
  const m = new Map<string, FruitPackageTier>();
  for (const p of products) {
    if (!productMatchesSheetPage(p, "fruits")) continue;
    if (!p.packageTier) continue;
    const k = sheetProductKeyNormalized(p.name);
    if (!m.has(k)) m.set(k, p.packageTier);
  }
  return m;
}

export function poolBasicSorted(products: SheetProduct[]): SheetProduct[] {
  return dedupeFruitPackageProducts(
    products.filter((p) => isFruitRowEligibleForPackageUi(p) && p.packageTier === "basic"),
  ).sort(sortByPriceAsc);
}

export function poolPremiumSorted(products: SheetProduct[]): SheetProduct[] {
  return dedupeFruitPackageProducts(
    products.filter(
      (p) => isFruitRowEligibleForPackageUi(p) && (p.packageTier === "basic" || p.packageTier === "premium"),
    ),
  ).sort(sortByPriceAsc);
}

export function poolGoldSorted(products: SheetProduct[]): SheetProduct[] {
  return dedupeFruitPackageProducts(products.filter((p) => isFruitRowEligibleForPackageUi(p))).sort(
    sortByPriceAsc,
  );
}

function poolPremiumTierOnlySorted(products: SheetProduct[]): SheetProduct[] {
  return dedupeFruitPackageProducts(
    products.filter((p) => isFruitRowEligibleForPackageUi(p) && p.packageTier === "premium"),
  ).sort(sortByPriceAsc);
}

function poolBasicTierOnlySorted(products: SheetProduct[]): SheetProduct[] {
  return dedupeFruitPackageProducts(
    products.filter((p) => isFruitRowEligibleForPackageUi(p) && p.packageTier === "basic"),
  ).sort(sortByPriceAsc);
}

function pickFirstUnused(pool: SheetProduct[], used: Set<string>): string | null {
  for (const p of pool) {
    const k = sheetProductKeyNormalized(p.name);
    if (!used.has(k)) return p.name.trim();
  }
  return null;
}

/** החלפת פריטים שירדו מהמלאי בפריטים אחרים מאותה רמת מלאי (בסיסי) */
export function repairBasicSelection(
  selectedDisplayOrder: string[],
  pool: SheetProduct[],
  max: number,
): string[] {
  const availableKeys = new Set(pool.map((p) => sheetProductKeyNormalized(p.name)));
  const result: string[] = [];
  const used = new Set<string>();

  for (const name of selectedDisplayOrder) {
    if (result.length >= max) break;
    const k = sheetProductKeyNormalized(name);
    if (availableKeys.has(k) && !used.has(k)) {
      const hit = pool.find((p) => sheetProductKeyNormalized(p.name) === k);
      if (hit) {
        result.push(hit.name.trim());
        used.add(k);
      }
      continue;
    }
    const sub = pickFirstUnused(pool, used);
    if (sub) {
      result.push(sub);
      used.add(sheetProductKeyNormalized(sub));
    }
  }
  return result;
}

/** החלפה לפי קבוצת basic / premium */
export function repairPremiumSelection(
  selectedDisplayOrder: string[],
  combinedPool: SheetProduct[],
  max: number,
  tierByKey: Map<string, FruitPackageTier>,
): string[] {
  const basicSorted = poolBasicTierOnlySorted(combinedPool);
  const premiumSorted = poolPremiumTierOnlySorted(combinedPool);
  const availableKeys = new Set(combinedPool.map((p) => sheetProductKeyNormalized(p.name)));
  const result: string[] = [];
  const used = new Set<string>();

  for (const name of selectedDisplayOrder) {
    if (result.length >= max) break;
    const k = sheetProductKeyNormalized(name);
    if (availableKeys.has(k) && !used.has(k)) {
      const hit = combinedPool.find((p) => sheetProductKeyNormalized(p.name) === k);
      if (hit) {
        result.push(hit.name.trim());
        used.add(k);
      }
      continue;
    }
    const tier: FruitPackageTier = tierByKey.get(k) ?? "basic";
    const primary = tier === "premium" ? premiumSorted : basicSorted;
    const secondary = tier === "premium" ? basicSorted : premiumSorted;
    let sub = pickFirstUnused(primary, used);
    if (!sub) sub = pickFirstUnused(secondary, used);
    if (sub) {
      result.push(sub);
      used.add(sheetProductKeyNormalized(sub));
    }
  }
  return result;
}

/** השלמה מכל הפירות הזמינים לפי סדר מחיר */
export function repairGoldSelection(selectedDisplayOrder: string[], pool: SheetProduct[], max: number): string[] {
  return repairBasicSelection(selectedDisplayOrder, pool, max);
}

/** מילוי עד המקסימום לפני הוספה לסל — לפי סדר המחיר בבריכה */
export function fillSelectionToMax(selected: string[], max: number, poolSorted: SheetProduct[]): string[] {
  const used = new Set(selected.map((n) => sheetProductKeyNormalized(n)));
  const out = [...selected];
  for (const p of poolSorted) {
    if (out.length >= max) break;
    const k = sheetProductKeyNormalized(p.name);
    if (!used.has(k)) {
      out.push(p.name.trim());
      used.add(k);
    }
  }
  return out;
}

export function isPremiumTierProduct(p: SheetProduct): boolean {
  const n = p.name.trim().replace(/\s+/g, " ");
  // תג “מיוחד” מוצג רק לפריטים ספציפיים (גם אם ה-tier הוא premium)
  return n === "גולדן ברי" || n === "אוכמניות פרו סויקה" || n === "פטל שחור";
}
