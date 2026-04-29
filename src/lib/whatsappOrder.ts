import type { CartLine } from "../cart/types";
import { estimateCartTotal } from "./cartEstimate";
import { cartTotalDisplayUnits } from "./cartItemCount";

/** מספר וואטסאפ בפורמט בינלאומי ללא + (אורי) */
export const ORI_WHATSAPP_E164 = "972505113009";

/** הודעת פתיחה מברירת מחדל מקישורים באתר (המרות) */
export const WHATSAPP_WEBSITE_PREFILL = `היי, ראיתי את האתר ואני רוצה להזמין
אפשר לקבל פרטים?`;
const formatQty = (qty: number) => (Number.isInteger(qty) ? String(qty) : qty.toFixed(1));

const LRM = "\u200e";

function formatPhoneForWhatsappMessage(phone: string) {
  const cleaned = phone.trim().replace(/[\s-]/g, "");
  if (cleaned.startsWith("+972")) return `0${cleaned.slice(4)}`;
  if (cleaned.startsWith("972")) return `0${cleaned.slice(3)}`;
  return phone.trim();
}

function formatDeliveryDateForWhatsapp(dateValue: string) {
  const match = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateValue.trim();
  const [, year, month, day] = match;
  return `${LRM}${day}/${month}/${year.slice(2)}${LRM}`;
}

function formatAddressLine(params: {
  city: string;
  street: string;
  houseNumber: string;
  floor: string;
  apartment: string;
}) {
  const main = [params.street.trim(), params.houseNumber.trim()].filter(Boolean).join(" ");
  const secondary = [
    params.city.trim(),
    params.floor.trim() ? `קומה ${params.floor.trim()}` : "",
    params.apartment.trim() ? `דירה ${params.apartment.trim()}` : "",
  ].filter(Boolean);
  return [main, ...secondary].filter(Boolean).join(", ");
}

export function buildOrderMessage(params: {
  lines: CartLine[];
  customerName: string;
  customerPhone: string;
  fulfillmentMethod?: "delivery" | "pickup";
  deliveryCity?: string;
  deliveryStreet?: string;
  deliveryHouseNumber?: string;
  deliveryFloor?: string;
  deliveryApartment?: string;
  deliveryDate?: string;
  deliveryWindow?: string;
  notes: string;
}): string {
  const {
    lines,
    customerName,
    customerPhone,
    fulfillmentMethod = "delivery",
    deliveryCity = "",
    deliveryStreet = "",
    deliveryHouseNumber = "",
    deliveryFloor = "",
    deliveryApartment = "",
    deliveryDate = "",
    deliveryWindow = "",
    notes,
  } = params;
  const parts: string[] = [];
  const fulfillmentLabel = fulfillmentMethod === "pickup" ? "איסוף עצמי" : "משלוח";
  const estimate = estimateCartTotal(lines);

  parts.push("*הזמנה חדשה - Royal Fruit*", "");
  parts.push("*פרטי לקוח*");
  parts.push(`שם: ${customerName.trim() || "לא צוין"}`);
  parts.push(`טלפון: ${formatPhoneForWhatsappMessage(customerPhone) || "לא צוין"}`);
  parts.push(`קבלה: ${fulfillmentLabel}`);
  if (fulfillmentMethod === "delivery") {
    const addressLine = formatAddressLine({
      city: deliveryCity,
      street: deliveryStreet,
      houseNumber: deliveryHouseNumber,
      floor: deliveryFloor,
      apartment: deliveryApartment,
    });
    parts.push(`כתובת: ${addressLine || "לא צוינה"}`);
    parts.push(`תאריך משלוח: ${deliveryDate ? formatDeliveryDateForWhatsapp(deliveryDate) : "לתיאום"}`);
    parts.push(`חלון קבלת משלוח: ${deliveryWindow.trim() || "לתיאום"}`);
  }
  parts.push("", "*פרטי ההזמנה*");

  lines.forEach((line) => {
    parts.push(`• *${line.name}* × ${formatQty(line.qty)}`);
    const priceBits = [line.priceLabel, line.unit?.trim()].filter(Boolean);
    if (priceBits.length > 0) {
      parts.push(`  ${priceBits.join(", ")}`);
    }
  });

  const totalUnits = cartTotalDisplayUnits(lines);
  parts.push("", "*סיכום*");
  parts.push(`כמות פריטים: ${totalUnits}`);
  parts.push(
    `סכום משוערך: ${
      estimate.hasAnyKnown ? `~${estimate.knownTotal.toLocaleString("he-IL")} ₪` : "לתיאום מול אורי"
    }`,
  );
  parts.push("המחיר הסופי תלוי במשקל, מלאי ותיאום מול אורי.");

  if (notes.trim()) {
    parts.push("", "*הערות*", notes.trim());
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
