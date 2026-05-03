import { Link } from "react-router-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { SheetPriceListAsMenu } from "../components/SheetPriceListAsMenu";
import { usePageSeo } from "../lib/seo";

type PickleTier = { weight: string; price: number };

type PickleProduct = { name: string; tiers: readonly PickleTier[] };

const PICKLED_HOME_KITCHEN: readonly PickleProduct[] = [
  {
    name: "עלי גפן חמוצים",
    tiers: [
      { weight: "250 גרם", price: 35 },
      { weight: "500 גרם", price: 65 },
      { weight: "1 קילו", price: 125 },
    ],
  },
  {
    name: "כרוב חמוץ",
    tiers: [
      { weight: "250 גרם", price: 45 },
      { weight: "500 גרם", price: 80 },
      { weight: "1 קילו", price: 155 },
    ],
  },
  {
    name: "בצל חמוץ מתוק",
    tiers: [
      { weight: "250 גרם", price: 40 },
      { weight: "500 גרם", price: 75 },
      { weight: "1 קילו", price: 140 },
    ],
  },
] as const;

/** דף בסיס: מטבח טרי + מחירון מגיליון עם type או category «אוכל ביתי» */
export function HomeFood() {
  usePageSeo({
    title: "Royal Fruit | מטבח טרי — חמוצים בעבודת יד",
    description:
      "מטבח טרי: הזמנות יומיים מראש. עלי גפן חמוצים, כרוב חמוץ ובצל חמוץ מתוק — לפי משקל. ממולאים בכל טוב בעבודת יד. הזמנה בוואטסאפ ומשלוחים באזור המרכז וגוש דן.",
  });

  return (
    <div className="page">
      <section className="page-hero juices-hero">
        <div className="container narrow">
          <p className="eyebrow">מטבח טרי</p>
          <h1 className="page-title juices-page-title">חמוצים ובישול ביתי</h1>
          <p className="page-lead muted">
            <strong className="kitchen-lead-strong">שימו לב: הזמנות יומיים מראש.</strong>
            <br />
            ממולאים בכל טוב בעבודת יד.
          </p>
        </div>
      </section>

      <section id="home-food-price-list" className="section sheet-products-page-section price-menu-body juices-section">
        <div className="container juices-premium-shell">
          <div className="juices-intro-card kitchen-intro-card" aria-label="מטבח טרי ב־Royal Fruit">
            <div>
              <RoyalFruitWordmark className="juices-intro-wordmark" />
              <h2>מטבח טרי — חמוצים לפי משקל</h2>
              <p className="kitchen-intro-note">
                הזמנות יומיים מראש · ממולאים בכל טוב בעבודת יד
              </p>
            </div>
            <div className="juices-intro-points">
              <span>מלאי לפי יום</span>
              <span>הזמנה בוואטסאפ</span>
              <span>משלוח באזור המרכז וגוש דן</span>
            </div>
            <Link to="/cart" className="btn btn-primary juices-intro-cta">
              מעבר לסל
            </Link>
          </div>

          <div className="kitchen-pickles-grid" role="list">
            {PICKLED_HOME_KITCHEN.map((product) => (
              <article key={product.name} className="kitchen-pickle-card" role="listitem">
                <h3 className="kitchen-pickle-title">{product.name}</h3>
                <dl className="kitchen-pickle-prices">
                  {product.tiers.map((tier) => (
                    <div key={tier.weight} className="kitchen-pickle-row">
                      <dt>{tier.weight}</dt>
                      <dd>
                        {tier.price}
                        &nbsp;₪
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <SheetPriceListAsMenu
            idPrefix="sheet-home-food"
            defaultEmoji="🍲"
            emojiStrip=""
            showEmojis={false}
            page="homeFood"
            listMeta={{ title: "מטבח טרי" }}
            singleCategoryTitle="אוכל ביתי זמין היום"
          />
        </div>
      </section>
    </div>
  );
}
