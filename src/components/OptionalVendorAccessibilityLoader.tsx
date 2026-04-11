import { useEffect } from "react";

const SCRIPT_MARKER = "data-royal-fruit-a11y-vendor";

/**
 * טוען סקריפט נגישות מספק חיצוני (למשל «נגיש בקליק» / nagich.co.il).
 * לא מפעיל כלום בלי VITE_ACCESSIBILITY_VENDOR_SCRIPT_URL ב-.env
 *
 * הערה: אם הספק נותן כמה תגי script (אינליין + חיצוני), יש להדביק את
 * הסקריפט המלא ב־index.html לפי הוראותיהם, או לבקש מהם גרסת טעינה דינמית יחידה.
 */
export function OptionalVendorAccessibilityLoader() {
  const src = (import.meta.env.VITE_ACCESSIBILITY_VENDOR_SCRIPT_URL as string | undefined)?.trim();

  useEffect(() => {
    if (!src) return;
    if (document.querySelector(`script[${SCRIPT_MARKER}]`)) return;

    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.setAttribute(SCRIPT_MARKER, "1");

    const extra = (import.meta.env.VITE_ACCESSIBILITY_VENDOR_SCRIPT_DATASET as string | undefined)?.trim();
    if (extra) {
      try {
        const obj = JSON.parse(extra) as Record<string, string>;
        for (const [k, v] of Object.entries(obj)) {
          if (v != null && v !== "") el.dataset[k] = String(v);
        }
      } catch {
        console.warn(
          "[Royal Fruit] VITE_ACCESSIBILITY_VENDOR_SCRIPT_DATASET חייב להיות JSON תקין, למשל: " +
            '{"sitekey":"..."}',
        );
      }
    }

    document.body.appendChild(el);
  }, [src]);

  return null;
}
