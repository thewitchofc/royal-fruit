import { isKgPricingLabel } from "./kgPricing";

/** שורת מחיר לכרטיס מינימלי: «X ₪ / לק״ג» או «X ₪ לפריט» */
export function formatPremiumCardPriceLine(priceLabel: string, unit?: string): string {
  const pl = priceLabel.trim();
  if (!pl || /^לפי\s*המחירון$/iu.test(pl) || /^לפי\s*:/iu.test(pl)) return pl;
  const u = (unit ?? "").trim();
  const combined = `${pl} ${u}`;
  const kg = isKgPricingLabel(combined) || isKgPricingLabel(pl);
  let base = pl.replace(/\s+/g, " ").trim();
  if (kg) {
    if (/\s*\/\s*לק״ג\s*$/u.test(base)) return base;
    return `${base} / לק״ג`;
  }
  if (/\s*לפריט\s*$/u.test(base)) return base;
  if (u) return `${base} · ${u}`;
  return `${base} לפריט`;
}
