import { Link } from "react-router-dom";
import { Apple, CheckCircle, Leaf, MessageCircle, ShoppingBasket, Star, Truck, Zap } from "lucide-react";
import { OrderUrgencyLines } from "../components/OrderUrgencyLines";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import {
  BUSINESS_AREA_SERVED,
  BUSINESS_TRUST_CUSTOMERS_LINE,
} from "../lib/business";
import { usePageSeo } from "../lib/seo";
import { whatsappChatUrl, WHATSAPP_WEBSITE_PREFILL } from "../lib/whatsappOrder";

export function Home() {
  usePageSeo({
    title: "Royal Fruit | משלוח פירות וירקות פרימיום בחולון וגוש דן",
    description:
      "Royal Fruit מספקת פירות וירקות פרימיום עד הבית בחולון, בת ים, ראשון לציון, תל אביב וגוש דן. בחירה יומית, אריזה נקייה ותיאום מהיר בוואטסאפ.",
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
            תוצרת פרימיום שנבחרת בבוקר ומגיעה עד הדלת
          </h1>
          <p className="hero-lead home-hero-supporting">
            אנחנו בוחרים בכל בוקר פירות וירקות עם צבע, ריח וטעם של טריות אמיתית, אורזים נקי ומתאמים
            משלוח מדויק בוואטסאפ.
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
            <div className="hero-secondary-actions" aria-label="מעבר למחירונים">
              <Link className="btn btn-ghost" to="/fruits">
                לראות פירות
              </Link>
              <Link className="btn btn-ghost" to="/vegetables">
                לראות ירקות
              </Link>
            </div>
          </div>
          <OrderUrgencyLines className="order-urgency-lines order-urgency-lines--hero" />
        </div>
      </section>

      <section id="home-market-highlights" className="section home-market-section" aria-labelledby="home-market-heading">
        <div className="container">
          <div className="home-market-head">
            <p className="eyebrow">מה טרי היום</p>
            <h2 id="home-market-heading" className="section-title">
              בחירה יומית, שירות אישי, סל שמרגיש מדויק
            </h2>
            <p className="muted wide">
              במקום לנחש לבד מול מדף, מקבלים הכוונה קצרה: מה בשל עכשיו, מה מתאים לאירוח ומה כדאי להזמין
              בכמות.
            </p>
          </div>
          <div className="home-market-grid">
            <article className="home-market-card home-market-card--fruit">
              <span className="home-market-sticker">נבחר היום</span>
              <span className="home-market-card-icon" aria-hidden>
                <Apple size={28} />
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
                <Leaf size={28} />
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
                <ShoppingBasket size={28} />
              </span>
              <h3>סלים בהתאמה אישית</h3>
              <p>לבית, לעסק או לאירוח, עם איזון בין פריטים יפים, שימושיים וטעימים.</p>
              <a
                href={whatsappChatUrl(WHATSAPP_WEBSITE_PREFILL)}
                className="home-card-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                לבניית סל בוואטסאפ
              </a>
            </article>
          </div>
        </div>
      </section>

      <section id="home-standard" className="section home-standard-section" aria-labelledby="home-standard-heading">
        <div className="container home-standard-shell">
          <div className="home-standard-card">
            <div className="home-standard-copy">
              <p className="eyebrow">Royal Fruit Standard</p>
              <h2 id="home-standard-heading" className="section-title">
                לא עוד משלוח ירקות. בחירה אנושית לפני שהסל יוצא.
              </h2>
              <p className="muted wide">
                ההבדל נמצא בפרטים הקטנים: פרי שלא רך מדי, ירק שלא עייף בקצה, וסל שמותאם לשימוש שלכם ולא
                רק למה שהיה זמין על המדף.
              </p>
            </div>
            <div className="home-standard-points" aria-label="יתרונות השירות">
              <article>
                <span aria-hidden>
                  <CheckCircle size={18} />
                </span>
                <h3>בחירה לפי שימוש</h3>
                <p>לאירוח היום, סלטייה למחר או סל שבועי, הבשלות נבחרת לפי המועד.</p>
              </article>
              <article>
                <span aria-hidden>
                  <Star size={18} />
                </span>
                <h3>מראה וטעם יחד</h3>
                <p>שמים לב לצבע, ריח, מרקם ונראות, כדי שהסל ירגיש פרימיום גם בפתיחה.</p>
              </article>
              <article>
                <span aria-hidden>
                  <Truck size={18} />
                </span>
                <h3>תיאום קצר וברור</h3>
                <p>סוגרים מלאי, תקציב ומשלוח בשיחה פשוטה, בלי טופס ארוך ובלי ניחושים.</p>
              </article>
            </div>
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
              <p>משלוחים קבועים לבת ים, פירות טריים, הענבים במיוחד, ותמיד בטווח שסיכמנו. ממליץ בחום.</p>
              <footer>שי, בת ים</footer>
            </blockquote>
            <blockquote className="home-inline-testimonial">
              <p>מזמינה כל שבת מגש וירקות. כשמשהו חסר כותבים מראש ומציעים חלופה טובה, מרגישה מטופלת.</p>
              <footer>מורן, חולון</footer>
            </blockquote>
            <blockquote className="home-inline-testimonial">
              <p>
                אני צריך שקילה מדויקת לדיאטה. מבקשים בוואטסאפ חצי קילו ומקבלים בדיוק את זה, אמינים.
              </p>
              <footer>דניאל, תל אביב</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section id="home-process" className="section">
        <div className="container">
          <h2 className="section-title">איך הופכים צורך לסל מוכן</h2>
          <div className="feature-grid">
            <article className="feature-card">
              <h3>כותבים מה צריך</h3>
              <p>
                רשימת קניות, אירוח, סלטייה או סל שבועי. מספיק להתחיל בכיוון כללי ונעזור לדייק לפי המלאי.
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

      <section id="home-audience" className="section home-audience-section">
        <div className="container narrow home-audience-card split-cta">
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
            <p className="muted wide home-local-seo-copy">{BUSINESS_AREA_SERVED}</p>
          </div>
          <Link className="home-audience-link align-self" to="/contact">
            יצירת קשר
          </Link>
        </div>
      </section>

      <section id="home-final-cta" className="section home-final-cta-section">
        <div className="container narrow home-final-cta-card">
          <RoyalFruitWordmark className="home-final-cta-wordmark" />
          <h2>רוצים סל מדויק להיום או למחר?</h2>
          <p className="muted">
            שלחו הודעה קצרה בוואטסאפ, ונכוון אתכם לפי המלאי הטרי, הבשלות והתקציב.
          </p>
          <div className="home-final-cta-actions">
            <a
              className="btn btn-primary btn-whatsapp btn-whatsapp-strong"
              href={whatsappChatUrl(WHATSAPP_WEBSITE_PREFILL)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="btn-whatsapp-icon" aria-hidden />
              שליחת הודעה בוואטסאפ
            </a>
            <Link className="btn btn-ghost" to="/fruits">
              צפייה במחירון
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
