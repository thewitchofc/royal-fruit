import { Link } from "react-router-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { SheetPriceListAsMenu } from "../components/SheetPriceListAsMenu";
import { usePageSeo } from "../lib/seo";

/** דף בסיס: מוצרים מגיליון עם type או category «חלווה» (ראו HALVA_CATEGORY_ALIASES ב־sheetProducts) */
export function Halva() {
  usePageSeo({
    title: "Royal Fruit | חלווה וממרחים — חלווה בטעם",
    description:
      "חלווה וממרחים: חלווה בטעם (35 ₪) — אגוזי לוז, פיסטק, פקאן, טעם של פעם. ממרחי טחינה וקרם (30 ₪) — טחינה אתיופית, טחינה מלאה עם וניל טהור, טחינה עם אגוזי לוז וקקאו, קרם פיסטוק, קרם אגוזי לוז. הזמנה בוואטסאפ.",
  });

  return (
    <div className="page">
      <section className="page-hero juices-hero">
        <div className="container narrow">
          <p className="eyebrow">חלווה וממרחים</p>
          <h1 className="page-title juices-page-title">חלווה בטעם</h1>
          <p className="page-lead muted">
            חלווה בטעם ב־35&nbsp;₪, ממרחי טחינה וקרם ב־30&nbsp;₪. למטה מחירון אחיד לפי הגיליון: כל קטגוריה וכל מוצר באותה תצוגת כרטיס עם תמונה, מחיר והוספה לסל.
          </p>
        </div>
      </section>

      <section id="halva-price-list" className="section sheet-products-page-section price-menu-body juices-section">
        <div className="container juices-premium-shell halva-premium-shell">
          <header className="halva-catalog-header" aria-label="Royal Fruit — חלווה וממרחים">
            <RoyalFruitWordmark className="halva-catalog-wordmark" />
            <p className="halva-catalog-prices muted">
              חלווה בטעם <strong>35&nbsp;₪</strong>
              <span className="halva-catalog-prices-sep" aria-hidden>
                {" "}
                ·{" "}
              </span>
              טחינה וקרמים <strong>30&nbsp;₪</strong>
            </p>
            <div className="juices-intro-points halva-catalog-pills">
              <span>מלאי יומי</span>
              <span>הזמנה בוואטסאפ</span>
              <span>משלוח באזור המרכז וגוש דן</span>
            </div>
            <Link to="/cart" className="btn btn-primary halva-catalog-cta">
              מעבר לסל
            </Link>
          </header>

          <SheetPriceListAsMenu
            idPrefix="sheet-halva"
            defaultEmoji="⭐"
            emojiStrip=""
            showEmojis={false}
            page="halva"
            listMeta={{ title: "חלווה וממרחים — מחירון" }}
            priceMenuEmbedClassName="price-menu-embed--halva-sweets"
            priceMenuSearchLabel="חיפוש במחירון"
            priceMenuSearchPlaceholder="למשל: אגוזי לוז, פיסטק, טחינה, קרם…"
          />
        </div>
      </section>
    </div>
  );
}
