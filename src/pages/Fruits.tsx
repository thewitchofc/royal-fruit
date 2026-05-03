import { Link } from "react-router-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { SheetPriceListAsMenu } from "../components/SheetPriceListAsMenu";
import { usePageSeo } from "../lib/seo";

export function Fruits() {
  usePageSeo({
    title: "Royal Fruit | מחירון פירות פרימיום ומשלוחים בגוש דן",
    description: "מחירון פירות פרימיום עם מלאי עונתי, בשלות לפי מועד שימוש ומשלוחים מתואמים בחולון, בת ים, ראשון לציון, תל אביב וגוש דן.",
  });

  return (
    <div className="page">
      <section className="page-hero fruits-hero">
        <div className="container narrow">
          <p className="eyebrow">פירות פרימיום</p>
          <h1 className="page-title fruits-page-title">ממתקי טבע שנבחרו כמו אבנים נדירות</h1>
          <p className="page-lead muted">
            מחירון פירות שמתעדכן לפי מלאי יומי, בשלות ועונה. מה שמופיע כאן משקף את הבחירה הטרייה
            והמדויקת ביותר כרגע.
          </p>
        </div>
      </section>

      <section id="fruits-price-list" className="section sheet-products-page-section price-menu-body fruits-section">
        <div className="container fruits-premium-shell">
          <div className="fruits-intro-card" aria-label="סטנדרט הפירות של רויאל פרוט">
            <div>
              <RoyalFruitWordmark className="fruits-intro-wordmark" />
              <h2>פירות שנבחרים לפי טעם, צבע ובשלות, לא רק לפי מראה.</h2>
            </div>
            <div className="fruits-intro-points">
              <span>בשלות לפי מועד הגשה</span>
              <span>מיון ידני</span>
              <span>מלאי עונתי</span>
            </div>
            <Link to="/cart" className="btn btn-primary fruits-intro-cta">
              מעבר לסל
            </Link>
          </div>
          <SheetPriceListAsMenu
            idPrefix="sheet-fruits"
            defaultEmoji="fruit"
            emojiStrip=""
            showEmojis={false}
            page="fruits"
            listMeta={{
              title: "מחירון פירות",
            }}
            singleCategoryTitle="הפירות הזמינים היום"
          />
        </div>
      </section>

      <section id="fruits-faq" className="section fruits-guide-section">
        <div className="container narrow fruits-guide-shell">
          <div className="fruits-guide-head">
            <p className="fruits-guide-kicker">לפני שבוחרים</p>
            <h2>שני כללים קטנים שעושים הבדל גדול בטעם.</h2>
          </div>
          <div className="fruits-guide-grid">
            <article className="fruits-guide-card">
              <h3>איך לבחור בשלות לפי מועד שימוש?</h3>
              <p>
                אם ההגשה היא היום, בוחרים פירות בשלים ומוכנים לצלחת. אם ההגשה מחר או מחרתיים, משלבים
                חלק מהפריטים בדרגת בשלות נמוכה יותר כדי לשמור על מרקם וטעם בשיא בזמן הנכון.
              </p>
            </article>
            <article className="fruits-guide-card">
              <h3>איך שומרים טריות אחרי קבלה?</h3>
              <p>
                מפרידים בין פירות שממשיכים להבשיל, כמו מנגו ואבוקדו, לבין פירות עדינים שעדיף לקרר מיד.
                אחסון לפי קבוצות מפחית פחת ושומר על טעם לאורך זמן.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section produce-seo-section">
        <div className="container narrow produce-seo-card">
          <p className="produce-seo-kicker">משלוח פירות באזור המרכז</p>
          <h2>פירות פרימיום עד הבית בחולון, בת ים, ראשון לציון ותל אביב.</h2>
          <p>
            Royal Fruit מתאימה סל פירות לפי עונה, בשלות ומועד שימוש: סל שבועי לבית, פירות לאירוח,
            פירות חתוכים או בחירה מדויקת לעסק. ההזמנה נסגרת בוואטסאפ, כדי לוודא מלאי,
            בשלות ומועד משלוח לפני האריזה.
          </p>
        </div>
      </section>
    </div>
  );
}
