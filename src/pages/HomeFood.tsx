import { Link } from "react-router-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { SheetPriceListAsMenu } from "../components/SheetPriceListAsMenu";
import { useCart } from "../context/CartContext";
import type { CartLineInput } from "../cart/types";
import { formatPriceLabelForDisplay } from "../lib/priceDisplay";
import { usePageSeo } from "../lib/seo";

type PickleTier = { weight: string; price: number };

type PickleProduct = { name: string; tiers: readonly PickleTier[]; image?: string };

const PICKLED_HOME_KITCHEN: readonly PickleProduct[] = [
  {
    name: "עלי גפן חמוצים",
    image: "/images/catalog/kitchen-grape-leaves.png",
    tiers: [
      { weight: "250 גרם", price: 35 },
      { weight: "500 גרם", price: 65 },
      { weight: "1 קילו", price: 125 },
    ],
  },
  {
    name: "כרוב חמוץ",
    image: "/images/catalog/kitchen-sauerkraut.png",
    tiers: [
      { weight: "250 גרם", price: 45 },
      { weight: "500 גרם", price: 80 },
      { weight: "1 קילו", price: 155 },
    ],
  },
  {
    name: "בצל חמוץ מתוק",
    image: "/images/catalog/kitchen-sweet-onion.png",
    tiers: [
      { weight: "250 גרם", price: 40 },
      { weight: "500 גרם", price: 75 },
      { weight: "1 קילו", price: 140 },
    ],
  },
] as const;

function kitchenTierLineId(productName: string, weight: string) {
  return `kitchen::${productName.trim()}::${weight.trim()}`;
}

function kitchenTierCartLine(product: PickleProduct, tier: PickleTier): CartLineInput {
  return {
    id: kitchenTierLineId(product.name, tier.weight),
    emoji: "🍲",
    name: `${product.name} · ${tier.weight}`,
    priceLabel: formatPriceLabelForDisplay(String(tier.price)),
    unit: "לפריט",
    categoryPath: "מטבח טרי",
    qtyStep: 1,
  };
}

function formatQtyBadge(qty: number) {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(1);
}

function KitchenPickleTierQty({ item }: { item: CartLineInput }) {
  const { addItem, lines, setQty } = useCart();
  const inCartQty = lines.find((l) => l.id === item.id)?.qty ?? 0;
  const step = item.qtyStep ?? 1;

  return (
    <div className="kitchen-pickle-qty">
      <div className="price-menu-add-wrap kitchen-pickle-qty-wrap">
        <button
          type="button"
          className="price-menu-qty-btn"
          aria-label={`הפחת כמות ${item.name}`}
          onClick={() => setQty(item.id, inCartQty - step)}
          disabled={inCartQty < step / 2}
        >
          −
        </button>
        <span className="price-menu-qty-badge" aria-label={`בסל: ${formatQtyBadge(inCartQty)}`}>
          {formatQtyBadge(inCartQty)}
        </span>
        <button
          type="button"
          className="price-menu-qty-btn"
          aria-label={`הוסף כמות ${item.name}`}
          onClick={() => {
            if (inCartQty <= 0) {
              addItem(item);
              return;
            }
            setQty(item.id, inCartQty + step);
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

/** דף בסיס: מטבח טרי + מחירון מגיליון עם type או category «אוכל ביתי» */
export function HomeFood() {
  usePageSeo({
    title: "Royal Fruit | מטבח טרי — ממולאים לפי משקל",
    description:
      "מטבח טרי — ממולאים לפי משקל: עלי גפן חמוצים, כרוב חמוץ ובצל חמוץ מתוק. הזמנות יומיים מראש, בעבודת יד. הזמנה בוואטסאפ ומשלוחים באזור המרכז וגוש דן.",
  });

  return (
    <div className="page">
      <section className="page-hero juices-hero">
        <div className="container narrow">
          <p className="eyebrow">מטבח טרי</p>
          <h1 className="page-title juices-page-title">ממולאים לפי משקל</h1>
          <p className="page-lead muted">
            <strong className="kitchen-lead-strong">שימו לב: הזמנות יומיים מראש.</strong>
            <br />
            עלי גפן חמוצים, כרוב חמוץ ובצל חמוץ מתוק — ממולאים בכל טוב בעבודת יד.
          </p>
        </div>
      </section>

      <section id="home-food-price-list" className="section sheet-products-page-section price-menu-body juices-section">
        <div className="container juices-premium-shell">
          <div className="juices-intro-card kitchen-intro-card" aria-label="מטבח טרי ב־Royal Fruit">
            <div>
              <RoyalFruitWordmark className="juices-intro-wordmark" />
              <h2>מטבח טרי — ממולאים לפי משקל</h2>
              <p className="kitchen-intro-note">
                הזמנות יומיים מראש · בישול ביתי בעבודת יד
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
                {product.image ? (
                  <div className="kitchen-pickle-media">
                    <img
                      src={product.image}
                      alt=""
                      aria-hidden
                      className="kitchen-pickle-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : null}
                <h3 className="kitchen-pickle-title">{product.name}</h3>
                <div className="kitchen-pickle-prices">
                  {product.tiers.map((tier) => (
                    <div key={tier.weight} className="kitchen-pickle-row">
                      <div className="kitchen-pickle-row-info">
                        <span className="kitchen-pickle-weight">{tier.weight}</span>
                        <span className="kitchen-pickle-price">{formatPriceLabelForDisplay(String(tier.price))}</span>
                      </div>
                      <KitchenPickleTierQty item={kitchenTierCartLine(product, tier)} />
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <SheetPriceListAsMenu
            idPrefix="sheet-home-food"
            defaultEmoji="🍲"
            emojiStrip=""
            showEmojis={false}
            page="homeFood"
            listMeta={null}
            excludeCategoryTitles={PICKLED_HOME_KITCHEN.map((p) => p.name)}
            priceMenuEmbedClassName="price-menu-embed--premium-cards"
            showProductImages={false}
          />
        </div>
      </section>
    </div>
  );
}
