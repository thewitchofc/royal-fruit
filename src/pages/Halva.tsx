import { Link } from "react-router-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { SheetPriceListAsMenu } from "../components/SheetPriceListAsMenu";
import { usePageSeo } from "../lib/seo";

/** דף בסיס: מוצרים מגיליון עם type או category «חלווה» (ראו HALVA_CATEGORY_ALIASES ב־sheetProducts) */
export function Halva() {
  usePageSeo({
    title: "Royal Fruit | חלווה וממרחים — חלווה בטעם",
    description:
      "חלווה וממרחים: חלווה בטעם — יחידה 350 גרם (35 ₪): אגוזי לוז, פיסטק, פקאן, טעם של פעם. ממרחי טחינה וקרם (30 ₪) — טחינה אתיופית, טחינה מלאה עם וניל טהור, טחינה עם אגוזי לוז וקקאו, קרם פיסטוק, קרם אגוזי לוז. מילוי סל באתר.",
  });

  return (
    <div className="page">
      <section className="page-hero fruits-hero">
        <div className="container narrow">
          <h1 className="page-title juices-page-title">חלווה וממרחים</h1>
        </div>
      </section>

      <section id="halva-price-list" className="section sheet-products-page-section price-menu-body fruits-section">
        <div className="container fruits-premium-shell halva-premium-shell">
          <header className="halva-catalog-header" aria-label="Royal Fruit — חלווה וממרחים">
            <RoyalFruitWordmark className="halva-catalog-wordmark" />
            <div className="juices-intro-points halva-catalog-pills">
              <span>מלאי יומי</span>
              <span>הוסיפו לסל מהמחירון</span>
              <span>משלוח באזור המרכז וגוש דן</span>
            </div>
            <Link to="/cart" className="btn btn-cart-fill halva-catalog-cta">
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
            priceMenuEmbedClassName="price-menu-embed--premium-cards"
            priceMenuSearchLabel="חיפוש במחירון"
            priceMenuSearchPlaceholder="למשל: אגוזי לוז, פיסטק, טחינה, קרם…"
            showImagesDisclaimer
          />
        </div>
      </section>
    </div>
  );
}
