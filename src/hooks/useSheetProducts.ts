import { useEffect, useState } from "react";
import { loadSheetProducts, type SheetProduct } from "../lib/sheetProducts";

export type SheetProductsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; products: SheetProduct[] }
  | { status: "error"; message: string };

export function useSheetProducts(csvUrl: string | undefined): SheetProductsState {
  const [state, setState] = useState<SheetProductsState>({ status: "idle" });

  useEffect(() => {
    if (!csvUrl?.trim()) {
      setState({ status: "idle" });
      return;
    }
    let cancelled = false;
    setState({ status: "loading" });
    loadSheetProducts(csvUrl.trim())
      .then((products) => {
        if (!cancelled) setState({ status: "ok", products });
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : "שגיאה בטעינת הנתונים";
          setState({ status: "error", message });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [csvUrl]);

  return state;
}
