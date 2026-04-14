import { FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PageCategoryNav } from "../components/PageCategoryNav";
import { FacebookGlyph } from "../components/FacebookGlyph";
import { InstagramGlyph } from "../components/InstagramGlyph";
import {
  BUSINESS_ADDRESS_LINE,
  BUSINESS_AREA_SERVED,
  BUSINESS_FACEBOOK_URL,
  BUSINESS_HOURS_SUMMARY,
  BUSINESS_INSTAGRAM_URL,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  BUSINESS_PHONE_E164,
  GOOGLE_MAPS_URL,
} from "../lib/business";
import {
  isPlausibleEmail,
  isPlausibleFullName,
  isPlausibleIsraeliPhone,
} from "../lib/formValidation";
import { usePageSeo } from "../lib/seo";
import { whatsappChatUrl } from "../lib/whatsappOrder";

type ContactFieldKey = "name" | "phone" | "email";

export function Contact() {
  usePageSeo({
    title: "Royal Fruit | יצירת קשר",
    description: "השאירו פרטים או שלחו פנייה מהירה לתיאום אספקה והזמנות.",
  });

  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<ContactFieldKey, string>>>({});
  const [summary, setSummary] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  function clearFieldError(key: ContactFieldKey) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setSummary(null);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const type = String(data.get("type") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Partial<Record<ContactFieldKey, string>> = {};
    if (!isPlausibleFullName(name)) {
      next.name = "נא להזין שם מלא (לפחות שני תווים).";
    }
    if (!isPlausibleIsraeliPhone(phone)) {
      next.phone = "נא להזין מספר טלפון ישראלי תקין (למשל 050-1234567 או 03-1234567).";
    }
    if (!isPlausibleEmail(email)) {
      next.email = "נא להזין כתובת דוא״ל תקינה.";
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
      setSummary("יש לתקן את השדות המסומנים לפני השליחה.");
      if (next.name) nameRef.current?.focus();
      else if (next.phone) phoneRef.current?.focus();
      else emailRef.current?.focus();
      return;
    }

    setErrors({});
    setSummary(null);

    const text = [
      "שלום אורי, פנייה חדשה מאתר Royal Fruit.",
      "",
      `שם מלא: ${name || "לא צוין"}`,
      `טלפון: ${phone || "לא צוין"}`,
      `דוא\"ל: ${email || "לא צוין"}`,
      `סוג פנייה: ${type || "לא צוין"}`,
      "",
      "הודעה:",
      message || "לא צוין",
    ].join("\n");

    window.open(whatsappChatUrl(text), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">יצירת קשר</p>
          <h1 className="page-title">בואו נבנה יחד סל פרימיום שמתאים בול לצרכים שלכם</h1>
          <p className="page-lead muted">
            השאירו פרטים והטופס יפתח וואטסאפ עם פרטי הפנייה לאורי לאישור ותיאום מהירים.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <PageCategoryNav
            items={[
              { href: "#contact-form", label: "טופס" },
              { href: "#contact-details", label: "פרטי קשר" },
              { href: "#contact-hours", label: "שעות ואיסוף" },
              { href: "#contact-delivery", label: "אזורי משלוח" },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <form id="contact-form" className="contact-form" onSubmit={onSubmit} noValidate>
            {summary ? (
              <p className="contact-form-summary-error" role="alert">
                {summary}
              </p>
            ) : null}
            <label className="field">
              <span>שם מלא</span>
              <input
                ref={nameRef}
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="לדוגמה: יעל כהן"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                onChange={() => clearFieldError("name")}
              />
              {errors.name ? (
                <p id="contact-name-error" className="field-inline-error" role="alert">
                  {errors.name}
                </p>
              ) : null}
            </label>
            <label className="field">
              <span>טלפון</span>
              <span className="field-email-ltr" dir="ltr">
                <input
                  ref={phoneRef}
                  id="contact-phone"
                  className="field-email-input"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  placeholder="050-0000000"
                  dir="ltr"
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                  onChange={() => clearFieldError("phone")}
                />
              </span>
              {errors.phone ? (
                <p id="contact-phone-error" className="field-inline-error" role="alert">
                  {errors.phone}
                </p>
              ) : null}
            </label>
            <label className="field">
              <span>דוא״ל</span>
              <span className="field-email-ltr" dir="ltr" lang="en">
                <input
                  ref={emailRef}
                  className="field-email-input"
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  dir="ltr"
                  spellCheck={false}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  onChange={() => clearFieldError("email")}
                />
              </span>
              {errors.email ? (
                <p id="contact-email-error" className="field-inline-error" role="alert">
                  {errors.email}
                </p>
              ) : null}
            </label>
            <label className="field">
              <span>סוג פנייה</span>
              <select name="type" defaultValue="supply">
                <option value="supply">אספקה שוטפת</option>
                <option value="personal">הזמנה אישית</option>
                <option value="event">אירוע חד־פעמי</option>
              </select>
            </label>
            <label className="field full">
              <span>הודעה</span>
              <textarea name="message" rows={5} placeholder="תארו תאריך, היקף וכל דגש מיוחד..." />
            </label>
            <button type="submit" className="btn btn-primary">
              שליחה לוואטסאפ לאורי
            </button>
            {sent ? (
              <p className="form-feedback" role="status">
                הפנייה נפתחה בוואטסאפ. אם לא נפתח חלון, בדקו חוסם חלונות או נסו שוב.
              </p>
            ) : null}
          </form>

          <aside id="contact-details" className="contact-aside">
            <h2>פרטי קשר</h2>
            <p>
              <strong>עסק:</strong> {BUSINESS_NAME}
            </p>
            <p>
              <strong>טלפון:</strong>{" "}
              <a href={`tel:${BUSINESS_PHONE_E164}`}>{BUSINESS_PHONE}</a> (אורי)
            </p>
            <p>
              <strong>כתובת:</strong>{" "}
              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                {BUSINESS_ADDRESS_LINE}
              </a>{" "}
              (פתיחה ב־Google Maps)
            </p>
            <p>
              <strong>אספקה:</strong> משלוחים עד הבית + אפשרות לאיסוף עצמי לפי תיאום
            </p>
            <h3 id="contact-hours" className="contact-aside-sub">
              שעות פעילות ואיסוף
            </h3>
            <p className="muted small">{BUSINESS_HOURS_SUMMARY}</p>
            <h3 id="contact-delivery" className="contact-aside-sub">
              אזורי משלוח
            </h3>
            <p className="muted small">{BUSINESS_AREA_SERVED}</p>
            <p className="muted small">לפרטים והזמנות מהירות אפשר להתקשר ישירות לאורי.</p>
            <div className="contact-social-links" aria-label="רשתות חברתיות">
              <a
                href={BUSINESS_INSTAGRAM_URL}
                className="contact-social-link contact-social-link--instagram"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="אינסטגרם של Royal Fruit, נפתח בלשונית חדשה"
              >
                <InstagramGlyph className="contact-social-icon" />
                אינסטגרם
              </a>
              <a
                href={BUSINESS_FACEBOOK_URL}
                className="contact-social-link contact-social-link--facebook"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="פייסבוק של Royal Fruit, נפתח בלשונית חדשה"
              >
                <FacebookGlyph className="contact-social-icon" />
                פייסבוק
              </a>
            </div>
            <p className="small">
              <Link to="/faq">שאלות נפוצות ותשובות</Link>
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
