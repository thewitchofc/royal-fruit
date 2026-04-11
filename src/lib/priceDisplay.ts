/**
 * מוסיף "ל" לפני יחידה / קילו / מארז כשחסר (למשל: מארז → למארז). לא נוגע כשכבר יש למשל "למארז".
 */
export function formatUnitWordsWithLamed(text: string): string {
  const t = text.trim();
  if (!t) return text;
  return t.replace(/(^|\s)(?!ל)(יחידה|קילו|מארז)(?=\s|$)/gu, "$1ל$2");
}

/**
 * מוסיף סימון ₪ כשהמחיר מתחיל במספר (כמו בגיליון), לא משנה טקסטים כמו "לפי המחירון".
 */
export function formatPriceLabelForDisplay(label: string): string {
  const t = label.trim();
  if (!t) return label;

  let out = label;
  if (!/₪|ש["׳']?ח/u.test(t) && !/לפי\s*המחירון/i.test(t) && !/^לפי\s*:/iu.test(t)) {
    const m = t.match(/^(\s*)(\d+(?:[.,]\d+)?)(.*)$/u);
    if (m) {
      const [, lead, num, rest] = m;
      const tail = rest ?? "";
      if (!/₪|ש["׳']?ח/u.test(tail)) {
        out = tail ? `${lead}${num} ₪${tail}` : `${lead}${num} ₪`;
      }
    }
  }

  return formatUnitWordsWithLamed(out);
}
