import { Link } from "react-router-dom";
import { MessageCircle, Sparkles } from "lucide-react";
import { usePageSeo } from "../lib/seo";
import { ROUTES } from "../lib/publicRoutes";
import { whatsappChatUrl, WHATSAPP_WEBSITE_PREFILL } from "../lib/whatsappOrder";

/**
 * מארזי מתנה — עמוד שיווקי (לא גלריית מוצרים). הגלריה נשארת לתצוגה ויזואלית בלבד.
 */
export function BoxesGifts() {
  usePageSeo({
    title: "Royal Fruit | מארזי מתנה פרימיום",
    description:
      "מארזי מתנה מעוצבים עם פירות ומוצרים נבחרים. תיאום אישי בוואטסאפ, אריזה נקייה ומשלוח לגוש דן והמרכז.",
  });

  const wa = whatsappChatUrl(WHATSAPP_WEBSITE_PREFILL);

  return (
    <div className="page">
      <section className="page-hero boxes-gifts-hero">
        <div className="container narrow">
          <p className="eyebrow">
            <Sparkles className="rf-inline-icon rf-inline-icon--primary" size={18} aria-hidden /> מארזי מתנה
          </p>
          <h1 className="page-title">מארז שמרגיש אישי, נקי ומוכן למסירה</h1>
          <p className="page-lead muted">
            בונים לכם מארז לפי אירוע, תקציב וטעם אישי — פירות בשלות נכונה, השלמות עדינות ואריזה שמכבדת את
            המתנה. לתיאום סופי, מלאי ומחירים אנחנו זמינים בוואטסאפ.
          </p>
          <div className="hero-actions" style={{ marginTop: "1rem" }}>
            <a className="btn btn-primary btn-whatsapp btn-whatsapp-strong" href={wa} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="btn-whatsapp-icon" aria-hidden />
              תיאום מארז בוואטסאפ
            </a>
            <Link className="btn btn-ghost" to={ROUTES.gallery}>
              להשראה ויזואלית — גלריה
            </Link>
            <Link className="btn btn-ghost" to={ROUTES.shop.fruits}>
              לפירות מובחרים במחירון
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow-block">
          <div className="boxes-gifts-points" role="list">
            <div className="boxes-gifts-point" role="listitem">
              <h2>לפי אירוע</h2>
              <p className="muted">חג, ביקור אצל קרובים, הוקרה לעמיתים או מתנה לבית — נבנה שפה ויזואלית אחידה.</p>
            </div>
            <div className="boxes-gifts-point" role="listitem">
              <h2>פרימיום בלי רעש</h2>
              <p className="muted">פחות מילים גדולות, יותר דיוק: מה נכנס, באיזו בשלות, ואיך זה נשמר בדרך.</p>
            </div>
            <div className="boxes-gifts-point" role="listitem">
              <h2>תיאום מהיר</h2>
              <p className="muted">שולחים בקשה קצרה בוואטסאפ ומחזירים הצעה ברורה לפני אישור.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
