import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { initGoogleAnalytics } from "../lib/analytics";

const STORAGE_KEY = "rf-cookie-consent";

type Consent = "essential" | "analytics" | "";

export function CookieConsent() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? "";
  const [consent, setConsentState] = useState<Consent>("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Consent) || "";
    setConsentState(stored);
    setHydrated(true);
    if (stored === "analytics" && measurementId) {
      initGoogleAnalytics(measurementId);
    }
  }, [measurementId]);

  if (!measurementId || !hydrated || consent !== "") {
    return null;
  }

  function acceptAnalytics() {
    localStorage.setItem(STORAGE_KEY, "analytics");
    setConsentState("analytics");
    initGoogleAnalytics(measurementId);
  }

  function essentialOnly() {
    localStorage.setItem(STORAGE_KEY, "essential");
    setConsentState("essential");
  }

  return (
    <div
      className="cookie-consent"
      role="region"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="cookie-consent-inner">
        <p id="cookie-consent-title" className="cookie-consent-title">
          עוגיות וסטטיסטיקה
        </p>
        <p id="cookie-consent-description" className="cookie-consent-text muted small">
          אנו משתמשים בעוגיות ובאחסון מקומי להפעלת Google Analytics (סטטיסטיקת ביקורים אנונימית בכפוף להגדרות)
          ולשמירת בחירת ההסכמה. אפשר לבחור «אישור אנליטיקה» או «רק חיוני». פרטים ב
          <Link to="/privacy" className="cookie-consent-link">
            מדיניות הפרטיות
          </Link>
          .
        </p>
        <div className="cookie-consent-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={essentialOnly}>
            רק חיוני
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={acceptAnalytics}>
            אישור אנליטיקה
          </button>
        </div>
      </div>
    </div>
  );
}
