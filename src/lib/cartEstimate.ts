import type { CartLine } from "../cart/types";

export type BundleDeal = {
  bundleQty: number;
  bundlePrice: number;
};

/**
 * מנסה לחלץ מחיר ליחידה אחת (₪) מטקסט המחירון.
 */
export function estimateUnitFromPriceLabel(label: string): number | null {
  const s = label.replace(/\u200f|\u200e/g, "").trim();
  if (!s) return null;
  if (/^[\u2014—\-–]+$/.test(s)) return null;
  if (/^לפי המחירון$/i.test(s) || s === "לפי המחירון") return null;

  const amounts: number[] = [];
  const withShekel = /(\d+(?:\.\d+)?)\s*₪/g;
  let m: RegExpExecArray | null;
  while ((m = withShekel.exec(s)) !== null) {
    const n = parseFloat(m[1]);
    if (!Number.isNaN(n) && n >= 0) amounts.push(n);
  }
  if (amounts.length > 0) return amounts[0];

  const shekelWord = /(\d+(?:\.\d+)?)\s*ש["׳]ח/g;
  while ((m = shekelWord.exec(s)) !== null) {
    const n = parseFloat(m[1]);
    if (!Number.isNaN(n) && n >= 0) amounts.push(n);
  }
  if (amounts.length > 0) return amounts[0];

  if (/\d/.test(s) && /לק|ק["׳]ג|יחידה|מארז|גרם|500/i.test(s)) {
    const loose = s.match(/(\d+(?:\.\d+)?)/);
    if (loose) {
      const n = parseFloat(loose[1]);
      return Number.isNaN(n) ? null : n;
    }
  }

  return null;
}

/** מנרמל מפרידים בין «ב» למחיר — בגיליון לעיתים מקף עברי (־) ולא מקף רגיל */
function normalizeDealSeparators(text: string): string {
  return text.replace(/[\u05BE\u2010-\u2015\u2212−]/g, "-");
}

/** מפרק מבצע כמו «2 ב-30», «2 ב־30» (מקף עברי) או «2 ב-25₪» */
export function parseBundleDeal(deal: string | undefined): BundleDeal | null {
  if (!deal?.trim()) return null;
  const s = normalizeDealSeparators(deal.replace(/\u200f|\u200e/g, "")).trim();
  const m = s.match(/(\d+(?:[.,]\d+)?)\s*ב[\s\-–—]*(\d+(?:[.,]\d+)?)/u);
  if (!m) return null;
  const bundleQty = parseFloat(m[1]!.replace(",", "."));
  const bundlePrice = parseFloat(m[2]!.replace(",", "."));
  if (Number.isNaN(bundleQty) || Number.isNaN(bundlePrice)) return null;
  if (bundleQty <= 0 || bundlePrice < 0) return null;
  return { bundleQty, bundlePrice };
}

function unitPriceForLine(line: CartLine): number | null {
  const priceBits = [line.priceLabel, line.unit?.trim()].filter(Boolean).join(" ");
  return estimateUnitFromPriceLabel(priceBits || line.priceLabel);
}

export type LineEstimateBreakdown = {
  total: number | null;
  unitPrice: number | null;
  bundleCount: number;
  remainderQty: number;
  deal: BundleDeal | null;
};

/** חישוב שורה בודדת — כולל מבצעי «N ב-P» */
export function estimateLineBreakdown(line: CartLine): LineEstimateBreakdown {
  const unitPrice = unitPriceForLine(line);
  const deal = parseBundleDeal(line.deal);
  if (unitPrice === null) {
    return { total: null, unitPrice: null, bundleCount: 0, remainderQty: line.qty, deal };
  }
  if (!deal) {
    return {
      total: unitPrice * line.qty,
      unitPrice,
      bundleCount: 0,
      remainderQty: line.qty,
      deal: null,
    };
  }

  const step = line.qtyStep ?? 1;
  if (step !== 1) {
    return {
      total: unitPrice * line.qty,
      unitPrice,
      bundleCount: 0,
      remainderQty: line.qty,
      deal,
    };
  }

  const bundleCount = Math.floor(line.qty / deal.bundleQty);
  const remainderQty = line.qty - bundleCount * deal.bundleQty;
  const total = bundleCount * deal.bundlePrice + remainderQty * unitPrice;
  return { total, unitPrice, bundleCount, remainderQty, deal };
}

export function estimateLineTotal(line: CartLine): number | null {
  const { total } = estimateLineBreakdown(line);
  return total;
}

export function estimateCartTotal(lines: CartLine[]): {
  /** מעוגל לשקלים שלמים */
  knownTotal: number;
  knownLineCount: number;
  unknownLineCount: number;
  hasAnyKnown: boolean;
  /** כמה שורות נכללו במבצע */
  dealLineCount: number;
} {
  let sum = 0;
  let knownLineCount = 0;
  let unknownLineCount = 0;
  let dealLineCount = 0;

  for (const line of lines) {
    const breakdown = estimateLineBreakdown(line);
    if (breakdown.total === null) {
      unknownLineCount += 1;
      continue;
    }
    sum += breakdown.total;
    knownLineCount += 1;
    if (breakdown.bundleCount > 0) dealLineCount += 1;
  }

  return {
    knownTotal: Math.round(sum),
    knownLineCount,
    unknownLineCount,
    hasAnyKnown: knownLineCount > 0,
    dealLineCount,
  };
}
