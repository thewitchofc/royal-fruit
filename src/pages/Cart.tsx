import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Apple, Cherry, Circle, MessageCircle, Star, Truck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import type { CartLineInput } from "../cart/types";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { useCart } from "../context/CartContext";
import { estimateCartTotal } from "../lib/cartEstimate";
import { deliveryMinimumStatus, MIN_DELIVERY_ORDER_NIS } from "../lib/cartPolicies";
import { isPlausibleFullName, isPlausibleIsraeliPhone } from "../lib/formValidation";
import { buildOrderMessage, whatsappOrderUrl } from "../lib/whatsappOrder";
import { usePageSeo } from "../lib/seo";

type GoogleAutocompletePlace = {
  formatted_address?: string;
  name?: string;
};

type GoogleAutocompleteListener = {
  remove: () => void;
};

type GooglePlacesAutocomplete = {
  addListener: (eventName: "place_changed", handler: () => void) => GoogleAutocompleteListener;
  getPlace: () => GoogleAutocompletePlace;
};

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options: {
              componentRestrictions?: { country: string | string[] };
              fields?: string[];
              types?: string[];
            },
          ) => GooglePlacesAutocomplete;
        };
      };
    };
  }
}

let googlePlacesScriptPromise: Promise<void> | null = null;

function loadGooglePlacesScript(apiKey: string) {
  if (window.google?.maps?.places) return Promise.resolve();
  if (googlePlacesScriptPromise) return googlePlacesScriptPromise;

  googlePlacesScriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById("google-places-api") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google Places failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "google-places-api";
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey,
    )}&libraries=places&language=he&region=IL`;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Google Places failed to load")), { once: true });
    document.head.appendChild(script);
  });

  return googlePlacesScriptPromise;
}

function formatQty(qty: number) {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(1);
}

function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isWeekendDateInput(value: string) {
  if (!value) return false;
  const date = new Date(`${value}T00:00:00`);
  const day = date.getDay();
  return day === 5 || day === 6;
}

function getNextDeliveryDateInputValue() {
  const date = new Date();
  while (isWeekendDateInput(formatDateInputValue(date))) {
    date.setDate(date.getDate() + 1);
  }
  return formatDateInputValue(date);
}

function CartItemIcon({ symbol }: { symbol: string }) {
  if (symbol === "⭐") return <Star size={18} className="price-menu-icon price-menu-icon--primary" aria-hidden />;
  if (symbol === "🚚") return <Truck size={18} className="price-menu-icon price-menu-icon--primary" aria-hidden />;
  if (symbol === "⚡" || symbol === "🧃") return <Zap size={18} className="price-menu-icon price-menu-icon--primary" aria-hidden />;
  if (symbol === "🍓" || symbol === "🍒") return <Cherry size={18} className="price-menu-icon price-menu-icon--primary" aria-hidden />;
  if (symbol === "🍇" || symbol === "🍎" || symbol === "fruit") {
    return <Apple size={18} className="price-menu-icon price-menu-icon--primary" aria-hidden />;
  }
  if (symbol === "veg") return <Circle size={14} className="price-menu-icon price-menu-icon--muted" aria-hidden />;
  return <Circle size={14} className="price-menu-icon price-menu-icon--muted" aria-hidden />;
}

type CartUpsellSuggestion = CartLineInput & {
  reason: string;
  triggers: string[];
};

type FulfillmentMethod = "delivery" | "pickup";

const CART_UPSELL_SUGGESTIONS: CartUpsellSuggestion[] = [
  {
    id: "cart-upsell-lemons",
    emoji: "fruit",
    name: "לימונים להשלמה",
    priceLabel: "לתיאום מול אורי",
    unit: "מומלץ לסלטים, דגים ואירוח",
    categoryPath: "מוצרים משלימים",
    reason: "מתאים במיוחד אם יש בסל ירקות לסלט, עלים או דגים.",
    triggers: ["עגב", "מלפפון", "חסה", "עלים", "פטרוזיל", "כוסברה", "בצל", "אבוקדו", "דג", "סלט", "ירק"],
  },
  {
    id: "cart-upsell-mint",
    emoji: "veg",
    name: "נענע טרייה",
    priceLabel: "לתיאום מול אורי",
    unit: "לתה, לימונדה ופלטות אירוח",
    categoryPath: "מוצרים משלימים",
    reason: "משלימה לימונים, פירות קיץ, שתייה קרה ופלטות אירוח.",
    triggers: ["לימון", "אבטיח", "מלון", "ענבים", "תות", "פירות", "אירוח", "מגש"],
  },
  {
    id: "cart-upsell-cherry-tomatoes",
    emoji: "veg",
    name: "עגבניות שרי",
    priceLabel: "לתיאום מול אורי",
    unit: "תוספת קלה לסלט או אירוח",
    categoryPath: "מוצרים משלימים",
    reason: "אם כבר יש ירקות, זו השלמה קלה לסלט או לשולחן.",
    triggers: ["מלפפון", "חסה", "פלפל", "בצל", "פטרוזיל", "כוסברה", "אבוקדו", "ירק", "סלט"],
  },
  {
    id: "cart-upsell-medjool",
    emoji: "fruit",
    name: "תמר מג׳הול",
    priceLabel: "לתיאום מול אורי",
    unit: "משדרג סל מתוק או מגש",
    categoryPath: "מוצרים משלימים",
    reason: "מתאים ליד פירות עונה, מגשים ומתוקים טבעיים.",
    triggers: ["ענבים", "תות", "מנגו", "אננס", "מלון", "אבטיח", "פירות", "מגש"],
  },
  {
    id: "cart-upsell-avocado",
    emoji: "fruit",
    name: "אבוקדו",
    priceLabel: "לתיאום מול אורי",
    unit: "לבשלות לפי היום או מחר",
    categoryPath: "מוצרים משלימים",
    reason: "אם יש ירקות לסלט, אבוקדו יכול לסגור את המנה.",
    triggers: ["עגב", "מלפפון", "חסה", "לימון", "בצל", "סלט", "ירק"],
  },
  {
    id: "cart-upsell-herbs",
    emoji: "veg",
    name: "עשבי תיבול",
    priceLabel: "לתיאום מול אורי",
    unit: "פטרוזיליה, כוסברה או שמיר לפי מלאי",
    categoryPath: "מוצרים משלימים",
    reason: "השלמה טבעית לירקות, סלטים ובישול ביתי.",
    triggers: ["עגב", "מלפפון", "חסה", "תפוח אדמה", "בצל", "גזר", "ירק", "סלט"],
  },
];

function normalizeCartText(value: string) {
  return value.toLocaleLowerCase("he-IL").replace(/[״׳'"]/g, "");
}

function cartLineSearchText(line: { name: string; categoryPath: string; unit?: string }) {
  return normalizeCartText(`${line.name} ${line.categoryPath} ${line.unit ?? ""}`);
}

function getCartUpsellSuggestions(lines: { name: string; categoryPath: string; unit?: string }[]) {
  const cartText = lines.map(cartLineSearchText).join(" ");
  const selectedText = new Set(lines.map((line) => normalizeCartText(line.name)));

  const scored = CART_UPSELL_SUGGESTIONS.map((item, index) => {
    const itemName = normalizeCartText(item.name);
    if (selectedText.has(itemName) || cartText.includes(itemName)) return null;
    const score = item.triggers.reduce((sum, trigger) => {
      return cartText.includes(normalizeCartText(trigger)) ? sum + 1 : sum;
    }, 0);
    return { item, score, index };
  }).filter((entry): entry is { item: CartUpsellSuggestion; score: number; index: number } => Boolean(entry));

  const matched = scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const fallback = scored.filter((entry) => entry.score === 0);

  return [...matched, ...fallback].slice(0, 2).map((entry) => entry.item);
}

export function Cart() {
  usePageSeo({
    title: "Royal Fruit | סל קניות",
    description: "בנו הזמנה ושלחו לוואטסאפ של אורי, כולל סכום משוער ומינימום הזמנה למשלוח.",
    noIndex: true,
  });

  const { lines, totalItemCount, addItem, setQty, removeLine, clearCart } = useCart();
  const cartEstimate = useMemo(() => estimateCartTotal(lines), [lines]);
  const deliveryOk = useMemo(() => deliveryMinimumStatus(lines, cartEstimate), [lines, cartEstimate]);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>("delivery");
  const canSubmitOrder = fulfillmentMethod === "pickup" || deliveryOk.ok;
  const upsellSuggestions = useMemo(() => {
    return getCartUpsellSuggestions(lines);
  }, [lines]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(() => getNextDeliveryDateInputValue());
  const [deliveryWindow, setDeliveryWindow] = useState("09:00-13:00");
  const [notes, setNotes] = useState("");
  const [sentHint, setSentHint] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const deliveryDateRef = useRef<HTMLInputElement>(null);
  const deliveryAddressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
    const input = deliveryAddressRef.current;
    if (!apiKey || !input || fulfillmentMethod !== "delivery") return;

    let listener: GoogleAutocompleteListener | null = null;
    let cancelled = false;

    loadGooglePlacesScript(apiKey)
      .then(() => {
        if (cancelled || !window.google?.maps?.places || !deliveryAddressRef.current) return;
        const autocomplete = new window.google.maps.places.Autocomplete(deliveryAddressRef.current, {
          componentRestrictions: { country: "il" },
          fields: ["formatted_address", "name"],
          types: ["address"],
        });

        listener = autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const nextAddress = place.formatted_address || place.name || deliveryAddressRef.current?.value || "";
          setDeliveryAddress(nextAddress);
          setFormError(null);
        });
      })
      .catch(() => {
        // Address autocomplete is progressive enhancement; the field remains usable without it.
      });

    return () => {
      cancelled = true;
      listener?.remove();
    };
  }, [fulfillmentMethod]);

  function openDeliveryDatePicker() {
    const input = deliveryDateRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.focus();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (lines.length === 0) return;
    if (fulfillmentMethod === "delivery" && !deliveryOk.ok) {
      setFormError(deliveryOk.message);
      return;
    }
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!isPlausibleFullName(trimmedName)) {
      setFormError("נא להזין שם מלא (לפחות שני תווים).");
      return;
    }
    if (!isPlausibleIsraeliPhone(trimmedPhone)) {
      setFormError("נא להזין מספר טלפון ישראלי תקין (למשל 050-1234567).");
      return;
    }
    const trimmedAddress = deliveryAddress.trim();
    if (fulfillmentMethod === "delivery" && trimmedAddress.length < 6) {
      setFormError("נא להזין כתובת מלאה למשלוח, כולל רחוב, מספר ועיר.");
      return;
    }
    if (fulfillmentMethod === "delivery" && !deliveryDate) {
      setFormError("נא לבחור תאריך משלוח.");
      return;
    }
    if (fulfillmentMethod === "delivery" && isWeekendDateInput(deliveryDate)) {
      setFormError("כרגע אין אפשרות לבחור משלוח בשישי או שבת.");
      return;
    }
    setFormError(null);
    const msg = buildOrderMessage({
      lines,
      customerName: trimmedName,
      customerPhone: trimmedPhone,
      fulfillmentMethod,
      deliveryAddress: trimmedAddress,
      deliveryDate,
      deliveryWindow,
      notes,
    });
    const url = whatsappOrderUrl(msg);
    window.open(url, "_blank", "noopener,noreferrer");
    setSentHint(true);
  }

  return (
    <div className="page">
      <section className="page-hero cart-hero">
        <div className="container narrow">
          <p className="eyebrow">סל קניות</p>
          <h1 className="page-title">בונים הזמנה, ושולחים לוואטסאפ</h1>
          <p className="page-lead muted">
            התשלום והמשלוח מתואמים ישירות עם אורי בוואטסאפ אחרי השליחה. זה לא חיוב באתר. מינימום
            הזמנה למשלוח: <strong>{MIN_DELIVERY_ORDER_NIS} ₪</strong> (לפי סכום משוער מהמחירון).
          </p>
        </div>
      </section>

      <section className="section cart-section">
        <div className="container narrow-block">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <RoyalFruitWordmark className="cart-empty-wordmark" />
              <p className="cart-empty-title">הסל ריק</p>
              <p className="muted">הוסיפו פריטים מדפי הפירות והירקות.</p>
              <div className="cart-empty-links">
                <Link to="/fruits" className="btn btn-primary">
                  פירות פרימיום
                </Link>
                <Link to="/vegetables" className="btn btn-primary">
                  ירקות פרימיום
                </Link>
              </div>
            </div>
          ) : (
            <div className="cart-order-bubble">
              <div className="cart-order-head">
                <div>
                  <h2>הסל שלכם</h2>
                  <p className="muted">בדקו כמויות, בחרו משלוח או איסוף ושלחו לאורי.</p>
                </div>
                <div className="cart-order-head-stats" aria-label="סיכום סל">
                  <span>
                    <strong>{totalItemCount}</strong>
                    פריטים
                  </span>
                  <span>
                    <strong>{cartEstimate.hasAnyKnown ? `~${cartEstimate.knownTotal.toLocaleString("he-IL")} ₪` : "לתיאום"}</strong>
                    סכום משוער
                  </span>
                </div>
              </div>
              <ul className="cart-lines">
                {lines.map((line) => {
                  const step = line.qtyStep ?? 1;
                  return (
                  <li key={line.id} className="cart-line">
                    <span className="cart-line-emoji" aria-hidden>
                      <CartItemIcon symbol={line.emoji} />
                    </span>
                    <div className="cart-line-body">
                      <div className="cart-line-title">{line.name}</div>
                      <div className="cart-line-price small">
                        <span className="cart-line-price-main">{line.priceLabel}</span>
                        {line.unit?.trim() ? (
                          <span className="cart-line-unit muted">{line.unit.trim()}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="cart-line-qty">
                      <button
                        type="button"
                        className="cart-qty-btn"
                        aria-label={`הפחת כמות עבור ${line.name}`}
                        onClick={() => setQty(line.id, line.qty - step)}
                      >
                        −
                      </button>
                      <span className="cart-qty-val">{formatQty(line.qty)}</span>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        aria-label={`הוסף כמות עבור ${line.name}`}
                        onClick={() => setQty(line.id, line.qty + step)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-remove"
                      aria-label={`הסר את ${line.name} מהסל`}
                      onClick={() => removeLine(line.id)}
                    >
                      הסר
                    </button>
                  </li>
                  );
                })}
              </ul>

              <div className="cart-estimate" aria-live="polite">
                {cartEstimate.hasAnyKnown ? (
                  <>
                    <p className="cart-estimate-main">
                      סה״כ משוער:{" "}
                      <strong className="cart-estimate-sum">~{cartEstimate.knownTotal.toLocaleString("he-IL")} ₪</strong>
                    </p>
                    {cartEstimate.unknownLineCount > 0 ? (
                      <p className="cart-estimate-note muted small">
                        בנוסף <strong>{cartEstimate.unknownLineCount}</strong> סוגי פריטים ללא מחיר ברור
                        במחירון, המחיר הסופי ייסגר מול אורי.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="cart-estimate-note muted small">
                    לא ניתן לחשב סכום משוער מהטקסט במחירון, אורי יעדכן מחיר בוואטסאפ.
                  </p>
                )}
              </div>

              {fulfillmentMethod === "delivery" && !deliveryOk.ok && deliveryOk.message ? (
                <p className="cart-min-delivery-warning" role="status">
                  {deliveryOk.message}
                </p>
              ) : null}

              {upsellSuggestions.length > 0 ? (
                <section className="cart-upsell" aria-labelledby="cart-upsell-heading">
                  <div className="cart-upsell-head">
                    <p className="cart-upsell-kicker">אולי שכחתם</p>
                    <h2 id="cart-upsell-heading">השלמות קטנות לסל</h2>
                  </div>
                  <div className="cart-upsell-grid">
                    {upsellSuggestions.map((item) => (
                      <article key={item.id} className="cart-upsell-card">
                        <div>
                          <h3>{item.name}</h3>
                        </div>
                        <button type="button" onClick={() => addItem(item)}>
                          הוסף
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              <button type="button" className="cart-clear linkish" onClick={() => clearCart()}>
                רוקן סל
              </button>

              <form className="cart-checkout" onSubmit={onSubmit} noValidate>
                <h2 className="cart-checkout-title">לפני השליחה</h2>
                {formError ? (
                  <p id="cart-form-error" className="cart-form-error" role="alert">
                    {formError}
                  </p>
                ) : null}
                <fieldset className="cart-fulfillment" aria-label="בחירת אופן קבלת ההזמנה">
                  <legend>איך תרצו לקבל את ההזמנה?</legend>
                  <label className="cart-fulfillment-option">
                    <input
                      type="radio"
                      name="fulfillmentMethod"
                      value="delivery"
                      checked={fulfillmentMethod === "delivery"}
                      onChange={() => {
                        setFulfillmentMethod("delivery");
                        setFormError(null);
                      }}
                    />
                    <span>
                      <strong>משלוח</strong>
                      <small>בכפוף למינימום הזמנה</small>
                    </span>
                  </label>
                  <label className="cart-fulfillment-option">
                    <input
                      type="radio"
                      name="fulfillmentMethod"
                      value="pickup"
                      checked={fulfillmentMethod === "pickup"}
                      onChange={() => {
                        setFulfillmentMethod("pickup");
                        setFormError(null);
                      }}
                    />
                    <span>
                      <strong>איסוף עצמי</strong>
                      <small>בתיאום זמן איסוף</small>
                    </span>
                  </label>
                </fieldset>
                <label className="field">
                  <span>
                    שם מלא <span className="field-required">(חובה)</span>
                  </span>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFormError(null);
                    }}
                    autoComplete="name"
                    required
                    minLength={2}
                    placeholder="השם שלכם"
                    aria-invalid={
                      formError?.includes("שם מלא") ? true : undefined
                    }
                    aria-describedby={formError?.includes("שם מלא") ? "cart-form-error" : undefined}
                  />
                </label>
                <label className="field">
                  <span>
                    טלפון <span className="field-required">(חובה)</span>
                  </span>
                  <span className="field-email-ltr" dir="ltr">
                    <input
                      className="field-email-input"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setFormError(null);
                      }}
                      autoComplete="tel"
                      inputMode="tel"
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="050-0000000"
                      aria-invalid={
                        formError?.includes("טלפון") ? true : undefined
                      }
                      aria-describedby={formError?.includes("טלפון") ? "cart-form-error" : undefined}
                    />
                  </span>
                </label>
                {fulfillmentMethod === "delivery" ? (
                  <>
                    <label className="field">
                      <span>
                        כתובת מלאה למשלוח <span className="field-required">(חובה)</span>
                      </span>
                      <input
                        ref={deliveryAddressRef}
                        value={deliveryAddress}
                        onChange={(e) => {
                          setDeliveryAddress(e.target.value);
                          setFormError(null);
                        }}
                        autoComplete="street-address"
                        required
                        minLength={6}
                        placeholder="רחוב, מספר, דירה ועיר"
                        aria-invalid={formError?.includes("כתובת") ? true : undefined}
                        aria-describedby={formError?.includes("כתובת") ? "cart-form-error" : undefined}
                      />
                    </label>
                    <label className="field cart-date-field" onClick={openDeliveryDatePicker}>
                      <span>
                        תאריך משלוח <span className="field-required">(חובה)</span>
                      </span>
                      <input
                        ref={deliveryDateRef}
                        type="date"
                        value={deliveryDate}
                        min={getNextDeliveryDateInputValue()}
                        onChange={(e) => {
                          setDeliveryDate(e.target.value);
                          setFormError(
                            isWeekendDateInput(e.target.value) ? "כרגע אין אפשרות לבחור משלוח בשישי או שבת." : null,
                          );
                        }}
                        required
                        aria-invalid={formError?.includes("תאריך") || formError?.includes("שישי") ? true : undefined}
                        aria-describedby={
                          formError?.includes("תאריך") || formError?.includes("שישי") ? "cart-form-error" : undefined
                        }
                      />
                    </label>
                    <label className="field">
                      <span>שעת קבלת משלוח</span>
                      <select value={deliveryWindow} onChange={(e) => setDeliveryWindow(e.target.value)}>
                        <option value="09:00-13:00">09:00-13:00</option>
                        <option value="13:00-17:00">13:00-17:00</option>
                        <option value="17:00-21:00">17:00-21:00</option>
                        <option value="בהקדם האפשרי, עד כ-4 שעות">בהקדם האפשרי, עד כ־4 שעות</option>
                        <option value="לתיאום מול אורי">לתיאום מול אורי</option>
                      </select>
                      <small className="cart-delivery-window-note">
                        משלוחים בתיאום 24/6, בכפוף למלאי וזמינות.
                      </small>
                    </label>
                  </>
                ) : null}
                <label className="field">
                  <span>הערות להזמנה</span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder={
                      fulfillmentMethod === "pickup"
                        ? "למשל: מתי נוח לכם לאסוף, הערות לאריזה…"
                        : "למשל: כתובת למשלוח, חלון זמן, רגישות לאריזה…"
                    }
                  />
                </label>

                <button
                  type="submit"
                  className="btn btn-primary btn-whatsapp btn-whatsapp-strong"
                  disabled={!canSubmitOrder}
                >
                  <MessageCircle className="btn-whatsapp-icon" aria-hidden />
                  שלח הזמנה לוואטסאפ של אורי
                </button>

                {sentHint ? (
                  <p className="form-feedback" role="status">
                    נפתח חלון וואטסאפ, אם לא נפתח, בדקו חוסם חלונות או נסו שוב.
                  </p>
                ) : null}

                <p className="cart-legal muted small">
                  הכפתור פותח וואטסאפ עם פרטי ההזמנה. מחיר סופי ומלאי יאושרו מול אורי.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
