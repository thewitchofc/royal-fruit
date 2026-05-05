import { useSyncExternalStore } from "react";

/** התאמה ל־matchMedia עם רינדור ראשון נכון בדפדפן (בלי «ברירת מחדל דסקטופ» לפני effect). */
export function useMatchMedia(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(query);
      const listener = () => onStoreChange();
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}
