import { useEffect, useState } from "react";
import { loadSheetProducts, type SheetProduct } from "../lib/sheetProducts";

export type SheetProductsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; products: SheetProduct[] }
  | { status: "error"; message: string };

type SheetProductsCacheEntry = {
  products: SheetProduct[];
  fetchedAt: number;
};

const SHEET_PRODUCTS_CACHE_TTL_MS = 30 * 1000;
const sheetProductsCache = new Map<string, SheetProductsCacheEntry>();
const inflightLoads = new Map<string, Promise<SheetProduct[]>>();

function isFresh(entry: SheetProductsCacheEntry): boolean {
  return Date.now() - entry.fetchedAt < SHEET_PRODUCTS_CACHE_TTL_MS;
}

function loadAndCacheSheetProducts(csvUrl: string): Promise<SheetProduct[]> {
  const ongoing = inflightLoads.get(csvUrl);
  if (ongoing) return ongoing;

  const task = loadSheetProducts(csvUrl)
    .then((products) => {
      sheetProductsCache.set(csvUrl, { products, fetchedAt: Date.now() });
      return products;
    })
    .finally(() => {
      inflightLoads.delete(csvUrl);
    });

  inflightLoads.set(csvUrl, task);
  return task;
}

export function warmSheetProductsCache(csvUrl: string | undefined): void {
  const key = csvUrl?.trim();
  if (!key) return;
  const cached = sheetProductsCache.get(key);
  if (cached && isFresh(cached)) return;
  void loadAndCacheSheetProducts(key);
}

/** מנקה מטמון CSV כדי לטעון מחדש מהגיליון (למשל אחרי עדכון במסמך) */
export function invalidateSheetProductsCache(csvUrl: string | undefined): void {
  const key = csvUrl?.trim();
  if (!key) return;
  sheetProductsCache.delete(key);
  inflightLoads.delete(key);
}

export function useSheetProducts(csvUrl: string | undefined, reloadNonce = 0): SheetProductsState {
  const [state, setState] = useState<SheetProductsState>({ status: "idle" });

  useEffect(() => {
    const key = csvUrl?.trim();
    if (!key) {
      setState({ status: "idle" });
      return;
    }

    if (reloadNonce > 0) {
      sheetProductsCache.delete(key);
      inflightLoads.delete(key);
    }

    const cached = sheetProductsCache.get(key);
    if (cached) {
      setState({ status: "ok", products: cached.products });
      if (isFresh(cached)) {
        return;
      }
    } else {
      setState({ status: "loading" });
    }

    let cancelled = false;
    loadAndCacheSheetProducts(key)
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
  }, [csvUrl, reloadNonce]);

  return state;
}
