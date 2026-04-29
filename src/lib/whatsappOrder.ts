import type { CartLine } from "../cart/types";
import { cartTotalDisplayUnits } from "./cartItemCount";

/** מספר וואטסאפ בפורמט בינלאומי ללא + (אורי) */
export const ORI_WHATSAPP_E164 = "972505113009";

/** הודעת פתיחה מברירת מחדל מקישורים באתר (המרות) */
export const WHATSAPP_WEBSITE_PREFILL = `היי, ראיתי את האתר ואני רוצה להזמין
אפשר לקבל פרטים?`;
const formatQty = (qty: number) => (Number.isInteger(qty) ? String(qty) : qty.toFixed(1));

export function buildOrderMessage(params: {
  lines: CartLine[];
  customerName: string;
  customerPhone: string;
  fulfillmentMethod?: "delivery" | "pickup";
  deliveryAddress?: string;
  deliveryDate?: string;
  deliveryWindow?: string;
  notes: string;
}): string {
  const {
    lines,
    customerName,
    customerPhone,
    fulfillmentMethod = "delivery",
    deliveryAddress = "",
    deliveryDate = "",
    deliveryWindow = "",
    notes,
  } = params;
  const parts: string[] = [];
  const fulfillmentLabel = fulfillmentMethod === "pickup" ? "איסוף עצמי" : "משלוח";

  parts.push("*הזמנה חדשה, Royal Fruit*", "");
  parts.push(`שם: ${customerName.trim() || "לא צוין"}`);
  parts.push(`טלפון: ${customerPhone.trim() || "לא צוין"}`);
  parts.push(`אופן קבלה: ${fulfillmentLabel}`);
  if (fulfillmentMethod === "delivery") {
    parts.push(`כתובת למשלוח: ${deliveryAddress.trim() || "לא צוינה"}`);
    parts.push(`תאריך משלוח: ${deliveryDate.trim() || "לתיאום"}`);
    parts.push(`שעת קבלת משלוח: ${deliveryWindow.trim() || "לתיאום"}`);
  }
  parts.push("", "*פריטים:*", "");

  lines.forEach((line, i) => {
    parts.push(`${i + 1}. *${line.name}* × ${formatQty(line.qty)}`);
    const priceBits = [line.priceLabel, line.unit?.trim()].filter(Boolean);
    parts.push(`   מחירון: ${priceBits.join(", ")}`);
    parts.push(`   קטגוריה: ${line.categoryPath}`);
    parts.push("");
  });

  const totalUnits = cartTotalDisplayUnits(lines);
  parts.push(`סה״כ פריטים (יחידות): ${totalUnits}`);
  parts.push("", "המחיר הסופי, המלאי והתיאום, מול אורי בוואטסאפ.");

  if (notes.trim()) {
    parts.push("", "*הערות מהלקוח:*", notes.trim());
  }

  parts.push("", "נשלח מאתר Royal Fruit");

  return parts.join("\n");
}

export function whatsappOrderUrl(message: string): string {
  return `https://wa.me/${ORI_WHATSAPP_E164}?text=${encodeURIComponent(message)}`;
}

/** קישור לפתיחת צ'אט בוואטסאפ (בלי הודעה מוכנה או עם טקסט פתיחה) */
export function whatsappChatUrl(prefillText?: string): string {
  const base = `https://wa.me/${ORI_WHATSAPP_E164}`;
  if (prefillText?.trim()) {
    return `${base}?text=${encodeURIComponent(prefillText.trim())}`;
  }
  return base;
}
