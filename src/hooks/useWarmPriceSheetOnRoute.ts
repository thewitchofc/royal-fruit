import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PRICE_LIST_PREFETCH_PATHS } from "../lib/publicRoutes";
import { getGoogleSheetsProductsCsvUrl } from "../lib/sheetProducts";
import { warmSheetProductsCache } from "./useSheetProducts";

function pathUsesPriceSheet(pathname: string): boolean {
  return [...PRICE_LIST_PREFETCH_PATHS].some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** מחמם מטמון CSV + preload לפני רינדור המחירון בדפי חנות */
export function useWarmPriceSheetOnRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathUsesPriceSheet(pathname)) return;

    warmSheetProductsCache(getGoogleSheetsProductsCsvUrl());

    const existing = document.querySelector('link[data-preload="price-sheet"]');
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "fetch";
    link.href = "/price-sheet.csv";
    link.setAttribute("data-preload", "price-sheet");
    document.head.appendChild(link);
  }, [pathname]);
}
