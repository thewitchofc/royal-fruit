import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { estimateCartTotal } from "../lib/cartEstimate";
import { deliveryMinimumStatus, MIN_DELIVERY_ORDER_NIS } from "../lib/cartPolicies";
import { isPlausibleFullName, isPlausibleIsraeliPhone } from "../lib/formValidation";
import { buildOrderMessage, whatsappOrderUrl } from "../lib/whatsappOrder";
import { usePageSeo } from "../lib/seo";

function formatQty(qty: number) {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(1);
}

export function Cart() {
  usePageSeo({
    title: "Royal Fruit | סל קניות",
    description: "בנו הזמנה ושלחו לוואטסאפ של אורי, כולל סכום משוער ומינימום הזמנה למשלוח.",
  });

  const { lines, totalItemCount, setQty, removeLine, clearCart } = useCart();
  const cartEstimate = useMemo(() => estimateCartTotal(lines), [lines]);
  const deliveryOk = useMemo(() => deliveryMinimumStatus(lines, cartEstimate), [lines, cartEstimate]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [sentHint, setSentHint] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (lines.length === 0) return;
    if (!deliveryOk.ok) {
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
    setFormError(null);
    const msg = buildOrderMessage({
      lines,
      customerName: trimmedName,
      customerPhone: trimmedPhone,
      notes,
    });
    const url = whatsappOrderUrl(msg);
    window.open(url, "_blank", "noopener,noreferrer");
    setSentHint(true);
  }

  return (
    <div className="page">
      <section className="page-hero">
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
              <p className="cart-empty-title">הסל ריק</p>
              <p className="muted">הוסיפו פריטים מדפי הפירות והירקות.</p>
              <div className="cart-empty-links">
                <Link to="/fruits" className="btn btn-primary">
                  פירות פרימיום
                </Link>
                <Link to="/vegetables" className="btn btn-ghost">
                  ירקות פרימיום
                </Link>
              </div>
            </div>
          ) : (
            <div className="cart-order-bubble">
              <ul className="cart-lines">
                {lines.map((line) => {
                  const step = line.qtyStep ?? 1;
                  return (
                  <li key={line.id} className="cart-line">
                    <span className="cart-line-emoji" aria-hidden>
                      {line.emoji}
                    </span>
                    <div className="cart-line-body">
                      <div className="cart-line-title">{line.name}</div>
                      <div className="cart-line-meta muted small">{line.categoryPath}</div>
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
                        aria-label="הפחת כמות"
                        onClick={() => setQty(line.id, line.qty - step)}
                      >
                        −
                      </button>
                      <span className="cart-qty-val">{formatQty(line.qty)}</span>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        aria-label="הוסף כמות"
                        onClick={() => setQty(line.id, line.qty + step)}
                      >
                        +
                      </button>
                    </div>
                    <button type="button" className="cart-remove" onClick={() => removeLine(line.id)}>
                      הסר
                    </button>
                  </li>
                  );
                })}
              </ul>

              <p className="cart-summary muted">
                סה״כ <strong>{totalItemCount}</strong> פריטים בסל
              </p>

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
                    ) : (
                      <p className="cart-estimate-note muted small">
                        לפי המחיר הראשון שמופיע לכל פריט במחירון × כמות. עסקאות מיוחדות (למשל 1+2) והמחיר
                        הסופי, מול אורי בוואטסאפ.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="cart-estimate-note muted small">
                    לא ניתן לחשב סכום משוער מהטקסט במחירון, אורי יעדכן מחיר בוואטסאפ.
                  </p>
                )}
              </div>

              {!deliveryOk.ok && deliveryOk.message ? (
                <p className="cart-min-delivery-warning" role="status">
                  {deliveryOk.message}
                </p>
              ) : null}

              <button type="button" className="cart-clear linkish" onClick={() => clearCart()}>
                רוקן סל
              </button>

              <form className="cart-checkout" onSubmit={onSubmit} noValidate>
                <h2 className="cart-checkout-title">לפני השליחה</h2>
                {formError ? (
                  <p className="cart-form-error" role="alert">
                    {formError}
                  </p>
                ) : null}
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
                    />
                  </span>
                </label>
                <label className="field">
                  <span>הערות להזמנה</span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="למשל: כתובת למשלוח, חלון זמן, רגישות לאריזה…"
                  />
                </label>

                <button
                  type="submit"
                  className="btn btn-primary btn-whatsapp btn-whatsapp-strong"
                  disabled={!deliveryOk.ok}
                >
                  שלח הזמנה לוואטסאפ של אורי
                </button>

                {sentHint ? (
                  <p className="form-feedback" role="status">
                    נפתח חלון וואטסאפ, אם לא נפתח, בדקו חוסם חלונות או נסו שוב.
                  </p>
                ) : null}

                <p className="cart-legal muted small">
                  לחיצה על הכפתור פותחת את אפליקציית וואטסאפ עם טקסט ההזמנה. אורי יאשר מחיר סופי,
                  מלאי ותשלום בשיחה.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
