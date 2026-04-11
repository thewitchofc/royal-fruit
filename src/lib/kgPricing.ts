/**
 * האם לפי טקסט מחיר/יחידה מדובר במכירה לפי ק״ג, לקפיצות של 0.5 במחירון ובסל.
 */
export function isKgPricingLabel(label: string): boolean {
  const s = label.trim();
  if (!s) return false;
  return (
    /לק["״']?\s*ג/u.test(s) ||
    /לקילוגרם|לקילו/u.test(s) ||
    /(?:^|[\s,.])(?:ל\s*)?ק["״']?\s*ג(?:$|[\s,.])/u.test(s) ||
    /(?:^|[\s,.])קילו(?:$|[\s,.])/u.test(s) ||
    /(?:^|[\s,.])קילוגרם(?:$|[\s,.])/u.test(s)
  );
}
