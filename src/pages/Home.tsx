import { Link } from "react-router-dom";
import { Apple, CheckCircle, MessageCircle, Star, Truck, Zap } from "lucide-react";
import { OrderUrgencyLines } from "../components/OrderUrgencyLines";
import {
  BUSINESS_ADDRESS_LINE,
  BUSINESS_NAME,
  BUSINESS_TRUST_CUSTOMERS_LINE,
  GOOGLE_MAPS_URL,
  GOOGLE_REVIEW_CTA_HINT,
  GOOGLE_REVIEW_CTA_LABEL,
  GOOGLE_WRITE_REVIEW_URL,
} from "../lib/business";
import { usePageSeo } from "../lib/seo";
import { whatsappChatUrl, WHATSAPP_WEBSITE_PREFILL } from "../lib/whatsappOrder";

export function Home() {
  usePageSeo({
    title: "Royal Fruit | פירות וירקות טריים עד הבית, משלוחים יומיים",
    description:
      "Royal Fruit, משלוח פירות וירקות טריים עד הבית. מוצרים קלופים, מארזים והמלצות לקוחות. איכות גבוהה, אספקה יומית ומענה מהיר בוואטסאפ. לבית ולעסקים.",
  });

  return (
    <>
      <section className="hero" aria-labelledby="home-hero-heading">
        <div className="hero-glow" aria-hidden />
        <div className="container hero-inner">
          <p className="eyebrow hero-brand-eyebrow">{BUSINESS_NAME}</p>
          <h1 id="home-hero-heading" className="hero-title">
            פירות וירקות טריים עד הבית, איכות גבוהה ואספקה יומית
          </h1>
          <p className="hero-lead home-hero-supporting">
            Royal Fruit, מבחר נבחר מהשטח, קירור נכון ומשלוחים מסודרים, כדי שכל פרי וירק יגיע במרקם ובטעם שהבטחנו.
          </p>
          <div className="home-hero-why-wrap">
            <p className="home-hero-why-label">למה לבחור בוואטסאפ</p>
            <ul className="home-hero-benefits" aria-label="יתרונות הזמנה בוואטסאפ">
              <li>
                <Apple className="rf-inline-icon rf-inline-icon--primary" size={18} aria-hidden />
                <span>פירות טריים יום־יום</span>
              </li>
              <li>
                <Truck className="rf-inline-icon rf-inline-icon--primary" size={18} aria-hidden />
                <span>משלוחים מהירים</span>
              </li>
              <li>
                <CheckCircle className="rf-inline-icon rf-inline-icon--primary" size={18} aria-hidden />
                <span>התאמה אישית לכל אירוע</span>
              </li>
            </ul>
            <div className="home-hero-trust-block">
              <p className="home-hero-trust">
                <span className="home-hero-trust-finger hero-trust-icon-wrap" aria-hidden>
                  <Star className="rf-inline-icon rf-inline-icon--primary" size={18} />
                </span>
                {BUSINESS_TRUST_CUSTOMERS_LINE}
              </p>
              <p className="home-hero-trust-secondary">שירות אמין ומהיר עם ניסיון</p>
            </div>
          </div>
          <div className="hero-actions">
            <div className="hero-cta-cluster">
              <OrderUrgencyLines className="order-urgency-lines order-urgency-lines--hero" />
              <a
                className="btn btn-primary btn-whatsapp btn-whatsapp-strong home-hero-cta"
                href={whatsappChatUrl(WHATSAPP_WEBSITE_PREFILL)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="btn-whatsapp-icon" aria-hidden />
                שלחו הודעה בוואטסאפ עכשיו
              </a>
              <p className="hero-cta-hint">מענה מהיר תוך דקות, בלי התחייבות</p>
            </div>
            <Link className="btn btn-ghost" to="/fruits">
              מחירון פירות
            </Link>
            <Link className="btn btn-ghost" to="/vegetables">
              מחירון ירקות
            </Link>
          </div>
          <p className="hero-urgency-strip" role="status">
            <span className="hero-urgency-item">
              <Truck className="rf-inline-icon rf-inline-icon--secondary" size={16} aria-hidden /> אספקה יומית
            </span>
            <span className="hero-urgency-sep" aria-hidden>
              •
            </span>
            <span className="hero-urgency-item">
              <Zap className="rf-inline-icon rf-inline-icon--secondary" size={16} aria-hidden /> מלאי מתעדכן
            </span>
            <span className="hero-urgency-sep" aria-hidden>
              •
            </span>
            <span className="hero-urgency-item">
              <Star className="rf-inline-icon rf-inline-icon--secondary" size={16} aria-hidden /> זמינות גבוהה
            </span>
          </p>
        </div>
      </section>

      <section
        id="home-delivery-testimonials"
        className="section section--testimonial-snippet"
        aria-labelledby="home-seo-delivery-heading"
      >
        <div className="container">
          <h2 id="home-seo-delivery-heading" className="section-title home-testimonials-section-title">
            משלוח פירות וירקות טריים עד הבית
          </h2>
          <p className="muted wide home-testimonials-intro">
            לקוחות משתפים מהניסיון שלהם,{" "}
            <Link to="/testimonials" className="price-menu-tel">
              עוד המלצות
            </Link>
          </p>
          <div className="home-testimonials-grid">
            <blockquote className="home-inline-testimonial">
              <p>«שירות מעולה ופירות ברמה גבוהה, ממליץ בחום!»</p>
              <footer>דני, ראשון לציון</footer>
            </blockquote>
            <blockquote className="home-inline-testimonial">
              <p>«קונים פה כל שבוע, איכות יציבה ויחס אישי. לא מחליפים.»</p>
              <footer>לקוח קבוע</footer>
            </blockquote>
            <blockquote className="home-inline-testimonial">
              <p>«המארז לחג היה מהמם, כל המשפחה שאלה מאיפה. תודה!»</p>
              <footer>נועה, חולון</footer>
            </blockquote>
          </div>
          <div className="home-google-review-wrap">
            <p className="google-review-cta-hint">{GOOGLE_REVIEW_CTA_HINT}</p>
            <a
              href={GOOGLE_WRITE_REVIEW_URL}
              className="btn btn-ghost home-google-review-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
                <Star className="btn-whatsapp-icon" aria-hidden />
              {GOOGLE_REVIEW_CTA_LABEL}
            </a>
          </div>
        </div>
      </section>

      <section id="home-order-cta" className="section">
        <div className="container narrow home-mid-cta">
          <h2 className="home-mid-cta-title">רוצים להזמין?</h2>
          <p className="muted home-mid-cta-lead">נשמח לעזור לבחור מוצרים, לתאם משלוח או איסוף, כתבו לנו בוואטסאפ.</p>
          <div className="home-mid-cta-cluster">
            <OrderUrgencyLines className="order-urgency-lines order-urgency-lines--mid" />
            <a
              className="btn btn-primary btn-whatsapp btn-whatsapp-strong home-mid-cta-btn"
              href={whatsappChatUrl(WHATSAPP_WEBSITE_PREFILL)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="btn-whatsapp-icon" aria-hidden />
              שלחו הודעה בוואטסאפ עכשיו
            </a>
            <p className="hero-cta-hint home-mid-cta-hint">מענה מהיר תוך דקות, בלי התחייבות</p>
          </div>
        </div>
      </section>

      <section id="home-process" className="section">
        <div className="container">
          <h2 className="section-title">איך זה עובד בפועל</h2>
          <div className="feature-grid">
            <article className="feature-card">
              <h3>שיחת התאמה קצרה</h3>
              <p>
                מגדירים סגנון מטבח, תדירות אספקה וטווח תקציב. תוך דקות אפשר לגבש רשימת בסיס שמתאימה למה שבאמת
                צריכים.
              </p>
            </article>
            <article className="feature-card">
              <h3>בחירה מהמחירון</h3>
              <p>
                בונים סל לפי עונה ובשלות: מה נכנס לשירות עכשיו, מה לקינוחים ומה עדיף להבשיל עוד יום־יומיים במקרר.
              </p>
            </article>
            <article className="feature-card">
              <h3>תיאום בוואטסאפ ואספקה</h3>
              <p>
                שולחים הזמנה, מקבלים אישור על מלאי ומחיר, והמשלוח יוצא כשהכל ארוז כדי לחסוך זמן פתיחה וסידור.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="home-audience" className="section section-tint">
        <div className="container split-cta">
          <div>
            <h2 className="section-title">למי השירות מתאים</h2>
            <p className="muted wide">
              למסעדות שצריכות עקביות יומית, למנהלי אירועים שצריכים נראות נקייה בזמן קצר, ולבתים פרטיים שרוצים לקנות
              פחות פעמים אבל לקבל יותר איכות בכל משלוח.
            </p>
            <p className="muted wide">
              עובדים איתנו כשצריך שקט תפעולי: פחות חוסרים, פחות פחת, ויותר ביטחון שכל מה שיוצא מהמטבח נראה ומרגיש
              ברמה הנכונה.
            </p>
          </div>
          <Link className="btn btn-primary align-self" to="/contact">
            יצירת קשר
          </Link>
        </div>
      </section>

      <section id="home-location" className="section">
        <div className="container narrow home-location-block">
          <h2 className="section-title">איפה אנחנו נפגשים</h2>
          <p className="muted wide home-location-lead">
            החנות והנקודה לאיסוף עצמי נמצאים ב־{BUSINESS_ADDRESS_LINE}. איסוף לפי תיאום מראש, כדי שהסל יחכה ארוז
            ומוכן.
          </p>
          <p className="home-location-cta">
            <a className="btn btn-ghost" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
              פתיחת מיקום ב־Google Maps
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
