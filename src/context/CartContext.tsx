import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartLine, CartLineInput } from "../cart/types";
import { cartTotalDisplayUnits } from "../lib/cartItemCount";
import { formatPriceLabelForDisplay, formatUnitWordsWithLamed } from "../lib/priceDisplay";
import { findSheetProductByName, type SheetProduct } from "../lib/sheetProducts";

type CartContextValue = {
  lines: CartLine[];
  /** ספירה לתצוגה ובאדג': ק״ג לפי שורה = 1 מוצר; יחידות לפי כמות */
  totalItemCount: number;
  addItem: (item: CartLineInput) => void;
  setQty: (id: string, qty: number) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;
  /** מעדכן מחיר/יחידה/קטגוריה לפי גיליון לשורות שנוספו ממחירון דינמי (id מתחיל ב־sheet-) */
  syncLinesFromSheetProducts: (products: SheetProduct[]) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const normalizeQty = (qty: number) => Math.round(qty * 100) / 100;

/** עיגון כמות לפי קפיצה, ל־0.5 ק״ג משתמשים בחצאים שלמים כדי ש־+ ו־- יסתנכרנו */
function withStep(qty: number, step: number): number {
  if (!Number.isFinite(qty) || step <= 0) return normalizeQty(qty);
  if (Math.abs(step - 0.5) < 1e-9) {
    const halves = Math.round(qty * 2);
    const capped = Math.max(0, Math.min(198, halves));
    return normalizeQty(capped * 0.5);
  }
  return normalizeQty(Math.round(qty / step) * step);
}

function isSheetBackedCartLineId(id: string): boolean {
  return id.startsWith("sheet-");
}

function mergeLineWithSheetProduct(line: CartLine, hit: SheetProduct): CartLine {
  const nextPrice = formatPriceLabelForDisplay(hit.price.trim() || line.priceLabel);
  const nextUnit = hit.unit.trim() ? formatUnitWordsWithLamed(hit.unit.trim()) : undefined;
  const nextPath = hit.category.trim() || line.categoryPath;
  const nextUnavailable = hit.available ? undefined : true;
  return {
    ...line,
    priceLabel: nextPrice,
    unit: nextUnit,
    categoryPath: nextPath,
    sheetUnavailable: nextUnavailable,
    sheetMissing: undefined,
  };
}

function linesEqualSheetMerge(a: CartLine, b: CartLine): boolean {
  return (
    a.priceLabel === b.priceLabel &&
    (a.unit ?? "") === (b.unit ?? "") &&
    a.categoryPath === b.categoryPath &&
    (a.sheetUnavailable === true) === (b.sheetUnavailable === true) &&
    (a.sheetMissing === true) === (b.sheetMissing === true)
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addItem = useCallback((item: CartLineInput) => {
    setLines((prev) => {
      const idx = prev.findIndex((x) => x.id === item.id);
      const step = item.qtyStep ?? 1;
      if (idx >= 0) {
        const next = [...prev];
        const nextQty = Math.min(99, normalizeQty(next[idx].qty + step));
        next[idx] = { ...next[idx], qty: withStep(nextQty, step), qtyStep: next[idx].qtyStep ?? step };
        return next;
      }
      return [...prev, { ...item, qty: withStep(step, step) }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) => {
      const line = prev.find((l) => l.id === id);
      if (!line) return prev;
      const step = line.qtyStep ?? 1;
      const q = Math.max(0, Math.min(99, withStep(qty, step)));
      if (q <= 0) return prev.filter((l) => l.id !== id);
      return prev.map((l) => (l.id === id ? { ...l, qty: q } : l));
    });
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const syncLinesFromSheetProducts = useCallback((products: SheetProduct[]) => {
    if (!products.length) return;
    setLines((prev) => {
      let changed = false;
      const next = prev.map((line) => {
        if (!isSheetBackedCartLineId(line.id)) return line;
        const hit = findSheetProductByName(line.name, products);
        if (!hit) {
          const flagged = line.sheetMissing ? line : { ...line, sheetMissing: true };
          if (flagged !== line) changed = true;
          return flagged;
        }
        const merged = mergeLineWithSheetProduct(line, hit);
        if (linesEqualSheetMerge(line, merged)) return line;
        changed = true;
        return merged;
      });
      return changed ? next : prev;
    });
  }, []);

  const totalItemCount = useMemo(() => cartTotalDisplayUnits(lines), [lines]);

  const value = useMemo(
    () => ({ lines, totalItemCount, addItem, setQty, removeLine, clearCart, syncLinesFromSheetProducts }),
    [lines, totalItemCount, addItem, setQty, removeLine, clearCart, syncLinesFromSheetProducts],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
