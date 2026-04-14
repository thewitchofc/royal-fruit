import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { whatsappChatUrl, WHATSAPP_WEBSITE_PREFILL } from "../lib/whatsappOrder";
import { WhatsAppGlyph } from "./WhatsAppGlyph";
import { InstagramGlyph } from "./InstagramGlyph";
import { BreadcrumbJsonLd } from "./BreadcrumbJsonLd";
import { OrganizationJsonLd } from "./OrganizationJsonLd";
import { CookieConsent } from "./CookieConsent";
import { SiteBottomWhatsappBar } from "./SiteBottomWhatsappBar";
import { OptionalVendorAccessibilityLoader } from "./OptionalVendorAccessibilityLoader";
import {
  BUSINESS_ADDRESS_LINE,
  BUSINESS_AREA_SERVED,
  BUSINESS_INSTAGRAM_URL,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  BUSINESS_PHONE_E164,
  GOOGLE_BUSINESS_PROFILE_URL,
  GOOGLE_REVIEW_CTA_HINT,
  GOOGLE_REVIEW_CTA_LABEL,
  GOOGLE_WRITE_REVIEW_URL,
} from "../lib/business";

/** יחד עם `<link rel="preload" href="/images/brand/logo.webp">` ב-index.html, אותו URL ל-LCP */
const LOGO_WEBP_URL = "/images/brand/logo.webp";
const LOGO_PNG_URL = "/images/brand/brand-logo.png";
const DEV_SIGNATURE_URL = "/images/brand/the-witch-signature.png";

const links = [
  { to: "/", label: "דף בית" },
  { to: "/about", label: "אודות העסק" },
  { to: "/articles", label: "מאמרים" },
  { to: "/gallery", label: "גלריה" },
  { to: "/testimonials", label: "המלצות" },
  { to: "/fruits", label: "פירות פרימיום" },
  { to: "/vegetables", label: "ירקות פרימיום" },
  { to: "/faq", label: "שאלות נפוצות" },
  { to: "/contact", label: "יצירת קשר" },
];

function CartGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M3 5h2l1.1 7.2a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 2-1.6l1-5.3H7.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19" r="1.7" fill="currentColor" />
      <circle cx="16.8" cy="19" r="1.7" fill="currentColor" />
    </svg>
  );
}

function HeaderCartLink({ onClick }: { onClick?: () => void }) {
  const { totalItemCount } = useCart();
  const label = totalItemCount > 0 ? `סל קניות, ${totalItemCount} פריטים` : "סל קניות";
  return (
    <NavLink
      to="/cart"
      className={({ isActive }) => `header-cart-link${isActive ? " is-active" : ""}`}
      aria-label={label}
      onClick={onClick}
    >
      <span className="header-cart-icon" aria-hidden>
        🛒
      </span>
      {totalItemCount > 0 ? (
        <span className="header-cart-badge">{totalItemCount > 99 ? "99+" : totalItemCount}</span>
      ) : null}
    </NavLink>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const { totalItemCount } = useCart();

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 960px)");
    const apply = () => setIsNarrowViewport(mq.matches);
    apply();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setHeight = () => {
      document.documentElement.style.setProperty("--site-header-h", `${el.offsetHeight}px`);
    };
    setHeight();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(setHeight);
      ro.observe(el);
      window.addEventListener("resize", setHeight);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", setHeight);
      };
    }
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    setOpen(false);
  }, [pathname]);

  const header = (
    <header ref={headerRef} className="site-header">
      <div className="container header-stack">
        <div className="header-brand-row">
          <HeaderCartLink onClick={() => setOpen(false)} />
          <NavLink
            to="/"
            className="brand"
            end
            onClick={() => setOpen(false)}
            aria-hidden={isNarrowViewport ? true : undefined}
            tabIndex={isNarrowViewport ? -1 : undefined}
          >
            <span className="brand-logo-wrap">
              <picture>
                <source srcSet={LOGO_WEBP_URL} type="image/webp" />
                <img
                  src={LOGO_PNG_URL}
                  alt={isNarrowViewport ? "" : "Royal Fruit"}
                  className="brand-logo"
                  decoding="async"
                />
              </picture>
            </span>
          </NavLink>
          <button
            type="button"
            className="nav-burger"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">תפריט</span>
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
        </div>
      </div>
      <div className="header-nav-bar">
        <div className="container header-nav-inner">
          <NavLink
            to="/"
            className="header-nav-compact-logo"
            end
            aria-label="Royal Fruit, מעבר לדף הבית"
            onClick={() => setOpen(false)}
          >
            <picture>
              <source srcSet={LOGO_WEBP_URL} type="image/webp" />
              <img
                src={LOGO_PNG_URL}
                alt=""
                className="header-nav-compact-logo-img"
                width={48}
                height={48}
                decoding="async"
              />
            </picture>
          </NavLink>
          <nav id="main-nav" className={`main-nav ${open ? "is-open" : ""}`} aria-label="ניווט ראשי">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                end={to === "/"}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        דילוג לתוכן העיקרי
      </a>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd pathname={pathname} />
      {header}
      <main id="main-content" className="main-area" tabIndex={-1}>
        <div className="mobile-main-logo-wrap">
          <NavLink to="/" className="mobile-main-logo-link" end aria-label="Royal Fruit, מעבר לדף הבית">
            <picture>
              <source srcSet={LOGO_WEBP_URL} type="image/webp" />
              <img
                src={LOGO_PNG_URL}
                alt=""
                className="mobile-main-logo-img"
                width={360}
                height={110}
                decoding="async"
              />
            </picture>
          </NavLink>
        </div>
        {children}
      </main>
      <SiteBottomWhatsappBar />
      <footer className="site-footer">
        <div className="container footer-inner">
          <p className="footer-brand">{BUSINESS_NAME}</p>
          <p className="footer-tagline muted small">
            {BUSINESS_NAME}, פירות וירקות טריים, איכות גבוהה, אספקה עד הבית
          </p>
          <div className="footer-grid" aria-label="פרטי קשר ושירות">
            <div className="footer-block">
              <h2 className="footer-block-title">טלפון</h2>
              <p className="footer-block-body">
                <a href={`tel:${BUSINESS_PHONE_E164}`} className="footer-contact-link">
                  {BUSINESS_PHONE}
                </a>
                <span className="footer-contact-suffix"> (אורי)</span>
              </p>
            </div>
            <div className="footer-block">
              <h2 className="footer-block-title">וואטסאפ</h2>
              <a
                href={whatsappChatUrl(WHATSAPP_WEBSITE_PREFILL)}
                className="btn btn-primary btn-whatsapp btn-whatsapp-strong footer-wa-cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppGlyph className="btn-whatsapp-icon" aria-hidden />
                שלחו הודעה בוואטסאפ עכשיו
              </a>
            </div>
            <div className="footer-block">
              <h2 className="footer-block-title">אזור שירות</h2>
              <p className="footer-block-body">{BUSINESS_ADDRESS_LINE}, איסוף עצמי לפי תיאום.</p>
              <p className="footer-block-body footer-block-body--muted">{BUSINESS_AREA_SERVED}</p>
            </div>
            <div className="footer-block footer-block--credit">
              <h2 className="footer-block-title">קרדיט פיתוח</h2>
              <p className="footer-credit-sublabel">עיצוב ופיתוח אתר</p>
              <img
                src={DEV_SIGNATURE_URL}
                alt="The Witch, Web &amp; App Development"
                className="footer-credit-logo"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="footer-google-wrap">
            <a
              href={GOOGLE_BUSINESS_PROFILE_URL}
              className="footer-google-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              מצא אותנו בגוגל
            </a>
            <div className="footer-google-review-block">
              <p className="google-review-cta-hint">{GOOGLE_REVIEW_CTA_HINT}</p>
              <a
                href={GOOGLE_WRITE_REVIEW_URL}
                className="btn btn-ghost footer-google-review-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                {GOOGLE_REVIEW_CTA_LABEL}
              </a>
            </div>
          </div>
          <nav className="footer-legal" aria-label="מסמכים משפטיים">
            <Link to="/privacy">מדיניות פרטיות</Link>
            <span className="footer-legal-sep" aria-hidden>
              {", "}
            </span>
            <Link to="/terms">תנאי שימוש</Link>
            <span className="footer-legal-sep" aria-hidden>
              {", "}
            </span>
            <Link to="/returns">ביטולים והחזרות</Link>
            <span className="footer-legal-sep" aria-hidden>
              {", "}
            </span>
            <Link to="/accessibility">הצהרת נגישות</Link>
          </nav>
        </div>
      </footer>
      <a
        href={BUSINESS_INSTAGRAM_URL}
        className="instagram-fab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="אינסטגרם של Royal Fruit (@royal.fruit26), נפתח בלשונית חדשה"
      >
        <InstagramGlyph className="instagram-fab-icon" />
      </a>
      <a
        href={whatsappChatUrl(WHATSAPP_WEBSITE_PREFILL)}
        className="whatsapp-fab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="פתיחת צ'אט וואטסאפ עם אורי"
      >
        <WhatsAppGlyph className="whatsapp-fab-icon" />
      </a>
      {totalItemCount > 0 ? (
        <Link to="/cart" className="cart-fab" aria-label={`למעבר לסל, ${totalItemCount} פריטים`}>
          <span className="cart-fab-label">סל קניות</span>
          <CartGlyph className="cart-fab-icon" />
          <span className="cart-fab-badge">{totalItemCount > 99 ? "99+" : totalItemCount}</span>
        </Link>
      ) : null}
      <CookieConsent />
      <OptionalVendorAccessibilityLoader />
    </div>
  );
}
