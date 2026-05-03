import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { whatsappChatUrl, WHATSAPP_WEBSITE_PREFILL } from "../lib/whatsappOrder";
import { WhatsAppGlyph } from "./WhatsAppGlyph";
import { BreadcrumbJsonLd } from "./BreadcrumbJsonLd";
import { OrganizationJsonLd } from "./OrganizationJsonLd";
import { CookieConsent } from "./CookieConsent";
import { SiteBottomWhatsappBar } from "./SiteBottomWhatsappBar";
import { OptionalVendorAccessibilityLoader } from "./OptionalVendorAccessibilityLoader";
import { RoyalFruitWordmark } from "./RoyalFruitWordmark";
import { Navbar } from "./Navbar";
import { BUSINESS_PHONE, BUSINESS_PHONE_E164 } from "../lib/business";
import { ROUTES } from "../lib/publicRoutes";
import { getGoogleSheetsProductsCsvUrl } from "../lib/sheetProducts";
import { warmSheetProductsCache } from "../hooks/useSheetProducts";
import { useScrollReveal } from "../hooks/useScrollReveal";

/** לוגו: רק PNG — בפריסות מסוימות קובץ `logo.webp` לא מוצג והדפדפן עלול להציג תמונה שבורה אם משתמשים ב־<picture type=webp>. preload ב-index ב־`brand-logo.png`. */
const LOGO_PNG_URL = "/images/brand/brand-logo.png";
const DEV_SIGNATURE_URL = "/images/brand/the-witch-signature.png";
const DEV_CREDIT_URL = "https://thewitch.co.il";

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
        <ShoppingCart size={20} />
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
  useScrollReveal(pathname);

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
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const warmData = () => warmSheetProductsCache(getGoogleSheetsProductsCsvUrl());
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };

    if (typeof win.requestIdleCallback === "function") {
      win.requestIdleCallback(warmData, { timeout: 1500 });
      return;
    }
    const t = window.setTimeout(warmData, 500);
    return () => window.clearTimeout(t);
  }, []);

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
              <img
                src={LOGO_PNG_URL}
                alt={isNarrowViewport ? "" : "Royal Fruit"}
                className="brand-logo"
                width={800}
                height={546}
                decoding="async"
              />
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
      <div className="header-nav-bar rf-premium-header">
        <div className="container header-nav-inner rf-premium-header__inner">
          <NavLink
            to="/"
            className="header-nav-compact-logo"
            end
            aria-label="Royal Fruit, מעבר לדף הבית"
            onClick={() => setOpen(false)}
          >
            <img
              src={LOGO_PNG_URL}
              alt=""
              className="header-nav-compact-logo-img"
              width={48}
              height={48}
              decoding="async"
            />
          </NavLink>
          <Navbar mobileOpen={open} onNavigate={() => setOpen(false)} />
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
            <img
              src={LOGO_PNG_URL}
              alt=""
              className="mobile-main-logo-img"
              width={360}
              height={110}
              decoding="async"
            />
          </NavLink>
        </div>
        <nav className="mobile-quick-nav" aria-label="קישורים מהירים במובייל">
          <NavLink to={ROUTES.shop.fruits} className="mobile-quick-nav-link" onClick={() => setOpen(false)}>
            פירות מובחרים
          </NavLink>
          <NavLink to={ROUTES.shop.juices} className="mobile-quick-nav-link" onClick={() => setOpen(false)}>
            מיצים טבעיים
          </NavLink>
          <NavLink to={ROUTES.ready.sweets} className="mobile-quick-nav-link" onClick={() => setOpen(false)}>
            חלווה וממרחים
          </NavLink>
          <NavLink to={ROUTES.ready.meals} className="mobile-quick-nav-link" onClick={() => setOpen(false)}>
            מטבח טרי
          </NavLink>
          <NavLink to={ROUTES.shop.vegetables} className="mobile-quick-nav-link" onClick={() => setOpen(false)}>
            ירקות טריים
          </NavLink>
          <NavLink to={ROUTES.gallery} className="mobile-quick-nav-link" onClick={() => setOpen(false)}>
            גלריה
          </NavLink>
          <NavLink to={ROUTES.cart} className="mobile-quick-nav-link" onClick={() => setOpen(false)}>
            סל קניות
          </NavLink>
          <NavLink to={ROUTES.contact} className="mobile-quick-nav-link" onClick={() => setOpen(false)}>
            צור קשר
          </NavLink>
        </nav>
        {children}
      </main>
      {pathname === "/" || pathname === "/cart" ? null : <SiteBottomWhatsappBar />}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-main">
            <div className="footer-copy">
              <p className="footer-kicker">Premium Fresh Market</p>
              <RoyalFruitWordmark className="footer-brand-wordmark" />
              <p className="footer-tagline small">תוצרת פרימיום. שירות אישי. משלוח מתואם.</p>
            </div>
            <div className="footer-actions" aria-label="יצירת קשר מהירה">
              <a href={`tel:${BUSINESS_PHONE_E164}`} className="footer-contact-link">
                {BUSINESS_PHONE}
              </a>
              <a
                href={whatsappChatUrl(WHATSAPP_WEBSITE_PREFILL)}
                className="btn btn-primary btn-whatsapp footer-wa-cta"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="שליחת הודעה בוואטסאפ להזמנה, נפתח בלשונית חדשה"
              >
                <MessageCircle className="btn-whatsapp-icon" aria-hidden />
                וואטסאפ
              </a>
              <a
                href={DEV_CREDIT_URL}
                className="footer-credit-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="The Witch, Web and App Development, נפתח בלשונית חדשה"
              >
                <img
                  src={DEV_SIGNATURE_URL}
                  alt="The Witch, Web &amp; App Development"
                  className="footer-credit-logo"
                  width={1024}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                />
                <span className="footer-credit-text">קרדיט פיתוח</span>
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
        href={whatsappChatUrl(WHATSAPP_WEBSITE_PREFILL)}
        className="whatsapp-fab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="פתיחת צ'אט וואטסאפ להזמנה, נפתח בלשונית חדשה"
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
