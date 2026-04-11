import type { CartLine } from "../cart/types";

/**
 * מנסה לחלץ מחיר ליחידה אחת (₪) מטקסט המחירון.
 * לוקח בדרך כלל את המחיר הראשון שמופיע (למשל במבצעי 1+2).
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

export function estimateCartTotal(lines: CartLine[]): {
  /** מעוגל לשקלים שלמים */
  knownTotal: number;
  knownLineCount: number;
  unknownLineCount: number;
  hasAnyKnown: boolean;
} {
  let sum = 0;
  let knownLineCount = 0;
  let unknownLineCount = 0;

  for (const line of lines) {
    const priceBits = [line.priceLabel, line.unit?.trim()].filter(Boolean).join(" ");
    const unit = estimateUnitFromPriceLabel(priceBits || line.priceLabel);
    if (unit === null) {
      unknownLineCount += 1;
      continue;
    }
    sum += unit * line.qty;
    knownLineCount += 1;
  }

  return {
    knownTotal: Math.round(sum),
    knownLineCount,
    unknownLineCount,
    hasAnyKnown: knownLineCount > 0,
  };
}
