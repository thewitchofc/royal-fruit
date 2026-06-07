import { Link } from "react-router-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { SheetPriceListAsMenu } from "../components/SheetPriceListAsMenu";
import { usePageSeo } from "../lib/seo";

export function GreensRoots() {
  usePageSeo({
    title: "Royal Fruit | ירק ושורשים — עלים, שורשים וטריות",
    description:
      "מחירון ירק ושורשים: עלים, שורשים וירקות טריים שנבחרים לפי יציבות, צבע ומרקם. משלוחים בחולון, גוש דן והמרכז.",
  });

  return (
    <div className="page">
      <section className="page-hero vegetables-hero">
        <div className="container narrow">
          <p className="eyebrow">ירק ושורשים</p>
          <h1 className="page-title vegetables-page-title">עלים מתוחים ושורשים יציבים — מהשדה ועד הצלחת</h1>
          <p className="page-lead muted">
            מחירון שמתעדכן לפי איכות ומלאי. מה שמופיע כאן נבחר כדי להחזיק צבע, קראנץ׳ ונראות גם אחרי שטיפה, חיתוך
            והגשה.
          </p>
        </div>
      </section>

      <section
        id="greens-roots-price-list"
        className="section sheet-products-page-section price-menu-body vegetables-section"
      >
        <div className="container vegetables-premium-shell">
          <div className="vegetables-intro-card catalog-intro-card--centered" aria-label="ירק ושורשים ב־Royal Fruit">
            <div>
              <RoyalFruitWordmark className="vegetables-intro-wordmark" />
              <h2>עלים, שורשים וירקות שנבחרים לפי יציבות וטריות — לא רק לפי רשימת מלאי.</h2>
            </div>
            <div className="vegetables-intro-points">
              <span>עלים מתוחים</span>
              <span>שורשים יציבים</span>
              <span>אספקה מתואמת</span>
            </div>
            <Link to="/cart" className="btn btn-cart-fill vegetables-intro-cta">
              מעבר לסל
            </Link>
          </div>
          <SheetPriceListAsMenu
            idPrefix="sheet-greens-roots"
            defaultEmoji="veg"
            emojiStrip=""
            showEmojis={false}
            sheetType="ירק ושורשים"
            listMeta={{
              title: "מחירון ירק ושורשים",
            }}
            priceMenuEmbedClassName="price-menu-embed--premium-cards"
            showProductImages={false}
          />
        </div>
      </section>
    </div>
  );
}
