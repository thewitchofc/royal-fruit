/** ולידציה לטפסים, הודעות בעברית, ללא תלות ב-UI */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function normalizeIsraeliPhoneDigits(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("972")) {
    d = `0${d.slice(3)}`;
  }
  return d;
}

/** טלפון ישראלי סביר (נייד 05x / קווי 0x בן 9 או 10 ספרות / ללא 0 מוביל בנייד) */
export function isPlausibleIsraeliPhone(raw: string): boolean {
  const d = normalizeIsraeliPhoneDigits(raw);
  if (d.length === 9 && /^5\d{8}$/.test(d)) return true;
  if (d.length < 9 || d.length > 10) return false;
  if (!d.startsWith("0")) return false;
  if (d.length === 10) return /^0[2-9]\d{8}$/.test(d);
  return /^0[2-9]\d{7}$/.test(d);
}

export function isPlausibleEmail(raw: string): boolean {
  const s = raw.trim();
  if (!s) return false;
  return EMAIL_RE.test(s);
}

export function isPlausibleFullName(raw: string): boolean {
  return raw.trim().length >= 2;
}
