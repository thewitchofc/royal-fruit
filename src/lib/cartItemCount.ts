import type { CartLine } from "../cart/types";

/**
 * ספירת פריטים לתצוגה (באדג' / סיכום / וואטסאפ).
 * מכירה לפי ק״ג: כל שורה בסל = מוצר אחד בלי קשר לכמות (גם 4.5 ק״ג).
 * יחידות רגילות: נספר לפי הכמות (3 מארזים = 3).
 */
export function cartLineDisplayUnits(line: CartLine): number {
  const step = line.qtyStep ?? 1;
  if (step < 1) {
    return line.qty > 0 ? 1 : 0;
  }
  return line.qty;
}

export function cartTotalDisplayUnits(lines: CartLine[]): number {
  return lines.reduce((s, line) => s + cartLineDisplayUnits(line), 0);
}
