import { Link } from "react-router-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { SheetPriceListAsMenu } from "../components/SheetPriceListAsMenu";
import { usePageSeo } from "../lib/seo";

/** דף מטבח טרי — מחירון מגיליון לפי type «מטבח טרי», מקובץ לפי category */
export function HomeFood() {
  usePageSeo({
    title: "Royal Fruit | מטבח טרי ומיצים טבעיים",
    description:
      "מטבח טרי ומיצים טבעיים: ממולאים לפי משקל, חמוצים בעבודת יד, ומיצים טבעיים לפי מלאי. מילוי סל באתר ומשלוחים באזור המרכז וגוש דן.",
  });

  return (
    <div className="page">
      <section className="page-hero juices-hero">
        <div className="container narrow">
          <p className="eyebrow">מטבח טרי</p>
          <h1 className="page-title juices-page-title">מטבח טרי ומיצים טבעיים</h1>
          <p className="page-lead muted">
            <strong className="kitchen-lead-strong">
              שימו לב: ממולאים הזמנות יומיים מראש (עלי גפן, בצל וכרוב)
            </strong>
            <br />
            ממולאים לפי משקל, חמוצים בעבודת יד, וגם מיצים טבעיים לפי מלאי יומי.
          </p>
        </div>
      </section>

      <section id="home-food-price-list" className="section sheet-products-page-section price-menu-body juices-section">
        <div className="container juices-premium-shell">
          <div
            className="juices-intro-card kitchen-intro-card catalog-intro-card--centered"
            aria-label="מטבח טרי ומיצים טבעיים ב־Royal Fruit"
          >
            <div>
              <RoyalFruitWordmark className="juices-intro-wordmark" />
              <h2>ממלאים סל מדף אחד</h2>
              <p className="kitchen-intro-note">
                הזמנות יומיים מראש רק לממולאים · בישול ביתי בעבודת יד
              </p>
            </div>
            <div className="juices-intro-points">
              <span>מלאי לפי יום</span>
              <span>הוסיפו לסל מהמחירון</span>
              <span>משלוח באזור המרכז וגוש דן</span>
            </div>
            <Link to="/cart" className="btn btn-cart-fill juices-intro-cta">
              מעבר לסל
            </Link>
          </div>

          <SheetPriceListAsMenu
            idPrefix="sheet-ready"
            defaultEmoji="🍲"
            emojiStrip=""
            showEmojis={false}
            sheetType="מטבח טרי"
            listMeta={null}
            categoryHeadingRank={3}
            priceMenuEmbedClassName="price-menu-embed--premium-cards"
            showProductImages
            showImagesDisclaimer
          />
        </div>
      </section>
    </div>
  );
}
