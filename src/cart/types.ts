export type CartLine = {
  id: string;
  emoji: string;
  name: string;
  /** מחיר כפי שמוצג במחירון או הסבר */
  priceLabel: string;
  /** משקל, מארז או הערת מחיר (למשל לק״ג, 2 יח׳ 40₪) */
  unit?: string;
  /** למשל: "ענבים › שקיות" */
  categoryPath: string;
  /** קפיצת כמות: יחידות רגילות = 1, פריטים לק״ג = 0.5 */
  qtyStep?: number;
  qty: number;
};

export type CartLineInput = Omit<CartLine, "qty">;
