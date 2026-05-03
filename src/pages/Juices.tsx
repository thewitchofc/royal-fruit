import { Link } from "react-router-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { SheetPriceListAsMenu } from "../components/SheetPriceListAsMenu";
import { usePageSeo } from "../lib/seo";

export function Juices() {
  usePageSeo({
    title: "Royal Fruit | מחירון מיצים טבעיים ומשלוחים בגוש דן",
    description:
      "מחירון מיצים טבעיים, מיץ טרי ומיץ בקבוקים לפי מלאי, עם משלוחים מתואמים בחולון, בת ים, ראשון לציון, תל אביב וגוש דן.",
  });

  return (
    <div className="page">
      <section className="page-hero juices-hero">
        <div className="container narrow">
          <p className="eyebrow">מיצים טבעיים</p>
          <h1 className="page-title juices-page-title">מיצים ושתייה קרה שנבנים על טריות, לא על תוספים</h1>
          <p className="page-lead muted">
            מחירון נפרד מפירות הגולגולת: מיץ טרי, בקבוקים טבעיים ומה שמשתלב לפי המלאי היומי.
          </p>
        </div>
      </section>

      <section id="juices-price-list" className="section sheet-products-page-section price-menu-body juices-section">
        <div className="container juices-premium-shell">
          <div className="juices-intro-card" aria-label="מיצים ב־Royal Fruit">
            <div>
              <RoyalFruitWordmark className="juices-intro-wordmark" />
              <h2>מיץ טבעי, מיץ בקבוק ושילובים לפי מה שיש היום בשדה.</h2>
            </div>
            <div className="juices-intro-points">
              <span>ללא ערבוב עם דף הפירות</span>
              <span>מלאי יומי</span>
              <span>הזמנה בוואטסאפ</span>
            </div>
            <Link to="/cart" className="btn btn-primary juices-intro-cta">
              מעבר לסל
            </Link>
          </div>
          <SheetPriceListAsMenu
            idPrefix="sheet-juices"
            defaultEmoji="🧃"
            emojiStrip=""
            showEmojis={false}
            page="juices"
            listMeta={{
              title: "מחירון מיצים",
            }}
            singleCategoryTitle="מיצים ושתייה טבעית זמינים היום"
          />
        </div>
      </section>
    </div>
  );
}
