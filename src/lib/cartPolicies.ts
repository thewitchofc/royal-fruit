import type { CartLine } from "../cart/types";

/** מינימום הזמנה למשלוח (₪) */
export const MIN_DELIVERY_ORDER_NIS = 99;

export type CartEstimate = {
  knownTotal: number;
  knownLineCount: number;
  unknownLineCount: number;
  hasAnyKnown: boolean;
};

/**
 * בודק אם הסל עומד במינימום למשלוח לפי סכום משוער מהמחירון.
 * אם אין מחיר ידוע לאף פריט, אי אפשר לאמת ולכן לא מאשרים שליחה לוואטסאפ מהאתר.
 */
export function deliveryMinimumStatus(
  lines: CartLine[],
  estimate: CartEstimate,
): { ok: true } | { ok: false; message: string } {
  if (lines.length === 0) {
    return { ok: false, message: "" };
  }
  if (!estimate.hasAnyKnown) {
    return {
      ok: false,
      message: `מינימום הזמנה למשלוח ${MIN_DELIVERY_ORDER_NIS} ₪. לא ניתן לחשב סכום מהפריטים בסל, הוסיפו פריטים עם מחיר מהמחירון או התקשרו לטלפון בעמוד יצירת הקשר.`,
    };
  }
  if (estimate.knownTotal < MIN_DELIVERY_ORDER_NIS) {
    return {
      ok: false,
      message: `מינימום הזמנה למשלוח ${MIN_DELIVERY_ORDER_NIS} ₪. הסכום המשוער כרגע ~${estimate.knownTotal.toLocaleString("he-IL")} ₪, הוסיפו פריטים לסל.`,
    };
  }
  return { ok: true };
}
