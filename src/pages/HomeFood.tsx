import { Link } from "react-router-dom";
import { CloudOff, Phone, ShoppingBag } from "lucide-react";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { PriceListSections } from "../components/PriceListSections";
import { useSheetProducts } from "../hooks/useSheetProducts";
import { BUSINESS_PHONE, BUSINESS_PHONE_E164 } from "../lib/business";
import { ROUTES } from "../lib/publicRoutes";
import { getGoogleSheetsProductsCsvUrl, groupSheetProductsToPriceCategories } from "../lib/sheetProducts";
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

function mergeCategoriesToSingleList(
  categories: import("../data/priceList").PriceCategory[],
): import("../data/priceList").PriceCategory[] {
  const isWeightOnlyName = (raw: string) => {
    const n = raw.trim().replace(/\s+/g, " ");
    // שמות “מוצר” שנכנסו בטעות כמשקל בלבד (למשל 250 גרם / 500 גרם / 1 קילו)
    return /^(\d+(?:[.,]\d+)?)\s*(?:גרם|ג(?:["׳׳']?רם)?|קילו|ק(?:["׳׳']?ג)?|kg)\s*$/i.test(n);
  };

  const rows = categories
    .flatMap((category) => [
      ...(category.rows ?? []),
      ...(category.subsections?.flatMap((subsection) => subsection.rows) ?? []),
    ])
    .filter((row) => !isWeightOnlyName(row.name))
    .sort((a, b) => a.name.localeCompare(b.name, "he"));

  if (!rows.length) return [];
  return [
    {
      id: "sheet-ready-all",
      title: "כל מה שזמין היום",
      emoji: "⭐",
      rows,
    },
  ];
}

/** דף בסיס: מטבח טרי + מחירון מגיליון עם type או category «אוכל ביתי» */
export function HomeFood() {
  usePageSeo({
    title: "Royal Fruit | מטבח טרי ומיצים טבעיים",
    description:
      "מטבח טרי ומיצים טבעיים: ממולאים לפי משקל, חמוצים בעבודת יד, ומיצים טבעיים לפי מלאי. מילוי סל באתר ומשלוחים באזור המרכז וגוש דן.",
  });

  const csvUrl = getGoogleSheetsProductsCsvUrl();
  const state = useSheetProducts(csvUrl);

  const pickleRows = PICKLED_HOME_KITCHEN.flatMap((product) =>
    product.tiers.map((tier) => ({
      emoji: "🍲",
      name: `${product.name} · ${tier.weight}`,
      price: String(tier.price),
      unit: "לפריט",
      description: "עבודת יד · הזמנות יומיים מראש (למוצרי ממולאים בלבד)",
    })),
  );

  if (state.status === "loading") {
    return (
      <div className="page">
        <section className="page-hero juices-hero">
          <div className="container narrow">
            <p className="eyebrow">מטבח טרי</p>
            <h1 className="page-title juices-page-title">מטבח טרי ומיצים טבעיים</h1>
            <p className="page-lead muted">טוענים את המחירון…</p>
          </div>
        </section>
        <section className="section sheet-products-page-section price-menu-body juices-section">
          <div className="container juices-premium-shell">
            <div className="sheet-products-loading" role="status" aria-live="polite">
              <span className="sheet-products-loading-orb" aria-hidden />
              <p className="sheet-products-loading-title">מסדרים את הדוכן…</p>
              <p className="muted small">טוענים מחירים ומלאי עדכניים מהגיליון.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (state.status === "error") {
    const publicMessage =
      "לא הצלחנו לטעון את המחירון כרגע. נסו לרענן את העמוד בעוד רגע, או התקשרו לעדכון מחירים ומלאי.";
    return (
      <div className="page">
        <section className="page-hero juices-hero">
          <div className="container narrow">
            <p className="eyebrow">מטבח טרי</p>
            <h1 className="page-title juices-page-title">מטבח טרי ומיצים טבעיים</h1>
            <p className="page-lead muted">{publicMessage}</p>
          </div>
        </section>
        <section className="section sheet-products-page-section price-menu-body juices-section">
          <div className="container juices-premium-shell">
            <div className="sheet-products-error" role="alert">
              <div className="sheet-products-error-head">
                <span className="sheet-products-error-icon" aria-hidden>
                  <CloudOff size={28} strokeWidth={1.75} />
                </span>
                <p className="sheet-products-error-title">בעיה בטעינת המחירון</p>
                <p className="sheet-products-error-text">{publicMessage}</p>
                {import.meta.env.DEV ? (
                  <p className="muted small sheet-products-error-dev" lang="en">
                    {state.message}
                  </p>
                ) : null}
              </div>
              <div className="sheet-products-error-actions">
                <Link className="btn btn-cart-fill btn-whatsapp-strong sheet-products-error-wa" to={ROUTES.cart}>
                  <ShoppingBag className="btn-whatsapp-icon" aria-hidden strokeWidth={2} />
                  מעבר לסל
                </Link>
                <div className="sheet-products-error-actions-row">
                  <a className="btn btn-ghost sheet-products-error-tel" href={`tel:${BUSINESS_PHONE_E164}`}>
                    <Phone className="sheet-products-error-action-icon" aria-hidden size={18} strokeWidth={2} />
                    {BUSINESS_PHONE}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (state.status !== "ok") return null;

  const juicesCategories = groupSheetProductsToPriceCategories(state.products, {
    idPrefix: "sheet-ready-juices",
    defaultEmoji: "🧃",
    page: "juices",
  });
  const homeFoodCategories = groupSheetProductsToPriceCategories(state.products, {
    idPrefix: "sheet-ready-kitchen",
    defaultEmoji: "🍲",
    page: "homeFood",
  });
  const halvaCategories = groupSheetProductsToPriceCategories(state.products, {
    idPrefix: "sheet-ready-halva",
    defaultEmoji: "⭐",
    page: "halva",
  });

  const isHalvaFlavorSheetCategory = (title: string) => {
    const t = title.trim().replace(/\s+/g, " ");
    return t === "חלווה בטעם" || (t.includes("חלווה") && t.includes("בטעם")) || t === "חלווה";
  };

  const normalizeHalvaFlavorLabel = (raw: string) => {
    const n = raw.trim().replace(/\s+/g, " ");
    // כתיב אחיד: פיסטוק (ולא פיסטק)
    if (n === "פיסטק") return "פיסטוק";
    return n;
  };

  const prefixHalvaRows = (cats: import("../data/priceList").PriceCategory[]) =>
    cats.map((cat) => ({
      ...cat,
      rows: cat.rows?.map((row) => ({
        ...row,
        name:
          isHalvaFlavorSheetCategory(cat.title) && !row.name.trim().startsWith("חלווה")
            ? `חלווה ${normalizeHalvaFlavorLabel(row.name)}`
            : row.name,
      })),
      subsections: cat.subsections?.map((sub) => ({
        ...sub,
        rows: sub.rows.map((row) => ({
          ...row,
          name:
            (isHalvaFlavorSheetCategory(cat.title) || isHalvaFlavorSheetCategory(sub.title)) &&
            !row.name.trim().startsWith("חלווה")
              ? `חלווה ${normalizeHalvaFlavorLabel(row.name)}`
              : row.name,
        })),
      })),
    }));

  // רק מוצרים “מוכנים”: מיצים + מטבח טרי + חלווה. בלי פירות/ירקות.
  const sheetCategories = [...juicesCategories, ...homeFoodCategories, ...prefixHalvaRows(halvaCategories)];
  const merged = mergeCategoriesToSingleList(sheetCategories);
  if (!merged.length && !pickleRows.length) {
    return (
      <div className="page">
        <section className="page-hero juices-hero">
          <div className="container narrow">
            <p className="eyebrow">מטבח טרי</p>
            <h1 className="page-title juices-page-title">מטבח טרי ומיצים טבעיים</h1>
            <p className="page-lead muted">אין כרגע פריטים זמינים להצגה במחירון.</p>
          </div>
        </section>
      </div>
    );
  }

  const categories: import("../data/priceList").PriceCategory[] = merged.length
    ? [
        {
          ...merged[0],
          rows: [...pickleRows, ...(merged[0].rows ?? [])],
        },
      ]
    : [
        {
          id: "ready-static-only",
          title: "כל מה שזמין היום",
          emoji: "⭐",
          rows: pickleRows,
        },
      ];

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

          <PriceListSections
            categories={categories}
            emojiStrip=""
            showEmojis={false}
            listMeta={null}
            categoryHeadingRank={3}
            searchFieldIdPrefix="sheet-ready"
            embedClassName="price-menu-embed--premium-cards"
            showProductImages
            showImagesDisclaimer
          />
        </div>
      </section>
    </div>
  );
}
