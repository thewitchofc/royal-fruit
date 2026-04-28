import { Link } from "react-router-dom";
import { Apple, CheckCircle, MessageCircle, Star, Truck, Zap } from "lucide-react";
import { HomePageFaqSection } from "../components/HomePageFaqSection";
import { OrderUrgencyLines } from "../components/OrderUrgencyLines";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import {
  BUSINESS_ADDRESS_LINE,
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
          <div className="eyebrow hero-brand-eyebrow">
            <RoyalFruitWordmark className="hero-brand-wordmark" />
          </div>
          <h1 id="home-hero-heading" className="hero-title">
            שוק טרי, צבעוני ושמח שמגיע עד הדלת
          </h1>
          <p className="hero-lead home-hero-supporting">
            אנחנו בוחרים בכל בוקר פירות וירקות עם צבע, ריח וטעם של טריות אמיתית, אורזים יפה ומתאמים משלוח
            מהיר בוואטסאפ.
          </p>
          <div className="home-market-badges" aria-label="מה מקבלים אצל Royal Fruit">
            <span>סחורה יומית</span>
            <span>סלים לבית ולעסק</span>
            <span>תיאום מהיר בוואטסאפ</span>
          </div>
          <div className="home-hero-why-wrap">
            <p className="home-hero-why-label">מה קורה אחרי ההודעה?</p>
            <ul className="home-hero-benefits" aria-label="יתרונות הזמנה בוואטסאפ">
              <li>
                <Apple className="rf-inline-icon rf-inline-icon--primary" size={18} aria-hidden />
                <span>מקבלים המלצה לפי מלאי ובשלות</span>
              </li>
              <li>
                <Truck className="rf-inline-icon rf-inline-icon--primary" size={18} aria-hidden />
                <span>בונים סל מדויק לתקציב ולמועד</span>
              </li>
              <li>
                <CheckCircle className="rf-inline-icon rf-inline-icon--primary" size={18} aria-hidden />
                <span>מתאמים משלוח או איסוף בלי סיבוכים</span>
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
                בונים סל טרי בוואטסאפ
              </a>
              <p className="hero-cta-hint">שלחו מה אתם צריכים, אנחנו נעזור לדייק את הסל</p>
            </div>
            <Link className="btn btn-ghost" to="/fruits">
              לראות פירות
            </Link>
            <Link className="btn btn-ghost" to="/vegetables">
              לראות ירקות
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

      <section id="home-market-highlights" className="section home-market-section" aria-labelledby="home-market-heading">
        <div className="container">
          <div className="home-market-head">
            <p className="eyebrow">מה טרי היום</p>
            <h2 id="home-market-heading" className="section-title">
              תחושה של דוכן צבעוני, שירות של ספק אישי
            </h2>
            <p className="muted wide">
              במקום לנחש לבד מול מדף, מקבלים הכוונה קצרה: מה מתוק עכשיו, מה מתאים לאירוח ומה עדיף להזמין בכמות.
            </p>
          </div>
          <div className="home-market-grid">
            <article className="home-market-card home-market-card--fruit">
              <span className="home-market-sticker">נבחר היום</span>
              <span className="home-market-card-icon" aria-hidden>
                🍓
              </span>
              <h3>פירות בשלים בדיוק לזמן שלכם</h3>
              <p>ענבים, פירות עונה, הדרים ומיוחדים שנבחרים לפי טעם, מרקם ונראות.</p>
              <Link to="/fruits" className="home-card-link">
                לפתיחת מחירון פירות
              </Link>
            </article>
            <article className="home-market-card home-market-card--veg">
              <span className="home-market-sticker">טרי במיוחד</span>
              <span className="home-market-card-icon" aria-hidden>
                🥬
              </span>
              <h3>ירקות נקיים, חזקים ומוכנים לעבודה</h3>
              <p>עלים, שורשים, ירקות לסלט ולבישול, עם דגש על טריות שמחזיקה.</p>
              <Link to="/vegetables" className="home-card-link">
                לפתיחת מחירון ירקות
              </Link>
            </article>
            <article className="home-market-card home-market-card--basket">
              <span className="home-market-sticker">מומלץ לאירוח</span>
              <span className="home-market-card-icon" aria-hidden>
                🧺
              </span>
              <h3>סלים בהתאמה אישית</h3>
              <p>לבית, לעסק או לאירוח, עם איזון בין פריטים יפים, שימושיים וטעימים.</p>
              <a
                href={whatsappChatUrl(WHATSAPP_WEBSITE_PREFILL)}
                className="home-card-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                לבניית סל עם אורי
              </a>
            </article>
          </div>
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
          <p className="eyebrow">הזמנה מהירה</p>
          <h2 className="home-mid-cta-title">ספרו לנו מה בא לכם בסל</h2>
          <p className="muted home-mid-cta-lead">נשמח לעזור לבחור מוצרים, לתאם משלוח או איסוף, ולסגור הזמנה בלי טופס ארוך.</p>
          <div className="home-mid-cta-cluster">
            <OrderUrgencyLines className="order-urgency-lines order-urgency-lines--mid" />
            <a
              className="btn btn-primary btn-whatsapp btn-whatsapp-strong home-mid-cta-btn"
              href={whatsappChatUrl(WHATSAPP_WEBSITE_PREFILL)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="btn-whatsapp-icon" aria-hidden />
              שלחו הודעה ונבנה סל
            </a>
            <p className="hero-cta-hint home-mid-cta-hint">אפשר להתחיל גם מרשימה חלקית, אנחנו נשלים יחד</p>
          </div>
        </div>
      </section>

      <section id="home-process" className="section">
        <div className="container">
          <h2 className="section-title">איך הופכים חשק לסל מוכן</h2>
          <div className="feature-grid">
            <article className="feature-card">
              <h3>כותבים מה צריך</h3>
              <p>
                רשימת קניות, אירוח, סלטייה או סל שבועי. מספיק להתחיל בכיוון כללי ואורי כבר יעזור לדייק.
              </p>
            </article>
            <article className="feature-card">
              <h3>מקבלים המלצה לפי טריות</h3>
              <p>
                בוחרים לפי מה שנראה טוב עכשיו: מה מתוק, מה קריספי, ומה מתאים להיום או למחרתיים.
              </p>
            </article>
            <article className="feature-card">
              <h3>סוגרים משלוח או איסוף</h3>
              <p>
                מקבלים אישור מלאי ומחיר, והסל יוצא ארוז יפה כדי להגיע מסודר, צבעוני ומוכן לשימוש.
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

      <HomePageFaqSection />

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
