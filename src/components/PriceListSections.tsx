import { useMemo, useState } from "react";
import { Apple, Cherry, Circle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { PriceCategory } from "../data/priceList";
import { BUSINESS_CONTACT_FIRST_NAME, BUSINESS_PHONE, BUSINESS_PHONE_E164 } from "../lib/business";
import { PRICE_LIST_META, type PriceListBannerMeta } from "../data/priceList";
import { getProduceShortDescription } from "../data/priceList";
import { useCart } from "../context/CartContext";
import type { CartLineInput } from "../cart/types";
import type { PriceRow, PriceSubsection } from "../data/priceList";
import { formatPriceLabelForDisplay, formatUnitWordsWithLamed } from "../lib/priceDisplay";
import { isKgPricingLabel } from "../lib/kgPricing";

function makeRowId(catId: string, subKey: string, name: string) {
  return `${catId}::${subKey}::${name}`.replace(/\s+/g, " ").trim();
}

/** קטגוריית «מיוחדים», רוחב מוגבל */
function isSpecialsCategoryTitle(title: string) {
  return title.trim() === "מיוחדים";
}

function rowPricingTextForKg(row: PriceRow, fallbackLabel: string) {
  const parts = [row.price, row.unit].map((s) => s?.trim()).filter(Boolean);
  return parts.length ? parts.join(" ") : fallbackLabel;
}

function formatQty(qty: number) {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(1);
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/["'״׳]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesSearch(value: string, query: string) {
  if (!query) return true;
  return normalizeText(value).includes(query);
}

function rowMatchesSearch(row: PriceRow, query: string) {
  if (!query) return true;
  return matchesSearch(row.name, query);
}

function filterRows(rows: PriceRow[] | undefined, query: string) {
  if (!rows?.length) return [];
  if (!query) return rows;
  return rows.filter((row) => rowMatchesSearch(row, query));
}

function dedupeRowsByName(rows: PriceRow[] | undefined, seenNames: Set<string>) {
  if (!rows?.length) return [];
  const uniqueRows: PriceRow[] = [];
  for (const row of rows) {
    const normalizedName = normalizeText(row.name);
    if (!normalizedName || seenNames.has(normalizedName)) continue;
    seenNames.add(normalizedName);
    uniqueRows.push(row);
  }
  return uniqueRows;
}

function filterSubsections(subsections: PriceSubsection[] | undefined, query: string) {
  if (!subsections?.length) return [];
  return subsections
    .map((sub) => {
      const rows = filterRows(sub.rows, query);
      return {
        ...sub,
        rows,
      };
    })
    .filter((sub) => sub.rows.length > 0);
}

function PriceRowView({
  item,
  description,
  showEmojis,
}: {
  item: CartLineInput;
  description: string;
  showEmojis: boolean;
}) {
  const { addItem, lines, setQty } = useCart();
  const inCartQty = lines.find((l) => l.id === item.id)?.qty ?? 0;
  const step = item.qtyStep ?? 1;

  return (
    <li className={`price-menu-row${showEmojis ? "" : " no-emoji"}`}>
      {showEmojis ? (
        <span className="price-menu-emoji" aria-hidden>
          <ProduceIcon symbol={item.emoji} />
        </span>
      ) : null}
      <span className="price-menu-name-wrap">
        <span className="price-menu-name">{item.name}</span>
        <span className="price-menu-desc">{description}</span>
      </span>
      <div className="price-menu-add-wrap">
        <button
          type="button"
          className="price-menu-qty-btn"
          aria-label={`הפחת כמות ${item.name}`}
          onClick={() => setQty(item.id, inCartQty - step)}
          disabled={inCartQty < step / 2}
        >
          −
        </button>
        <span className="price-menu-qty-badge" aria-label={`בסל: ${formatQty(inCartQty)}`}>
          {formatQty(inCartQty)}
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
      <span className="price-menu-price">
        <span className="price-menu-price-main">{item.priceLabel}</span>
        {item.unit?.trim() ? (
          <span className="price-menu-unit">{item.unit.trim()}</span>
        ) : null}
      </span>
    </li>
  );
}

function ProduceIcon({ symbol }: { symbol: string }) {
  if (symbol === "⭐") return <Star size={18} className="price-menu-icon price-menu-icon--primary" />;
  if (symbol === "veg" || symbol === "🥬" || symbol === "🥑" || symbol === "🥒" || symbol === "🥕" || symbol === "🌽" || symbol === "🧅" || symbol === "🍅") {
    return <Circle size={14} className="price-menu-icon price-menu-icon--primary" />;
  }
  if (symbol === "🧃") return <Circle size={14} className="price-menu-icon price-menu-icon--primary" />;
  if (symbol === "🍓" || symbol === "🍒") return <Cherry size={18} className="price-menu-icon price-menu-icon--primary" />;
  if (symbol === "🍇" || symbol === "🍎" || symbol === "fruit") return <Apple size={18} className="price-menu-icon price-menu-icon--primary" />;
  return <Circle size={14} className="price-menu-icon price-menu-icon--muted" />;
}

type Props = {
  categories: PriceCategory[];
  emojiStrip?: string;
  showEmojis?: boolean;
  /** ברירת מחדל: באנר מחירון מהקוד. null = בלי באנר (למקור חיצוני כמו גיליון) */
  listMeta?: PriceListBannerMeta | null;
  /** רמת כותרת לשם קטגוריה במחירון (ברירת מחדל 2 = h2). בדף הבית משתמשים ב־3 תחת h2 עליון */
  categoryHeadingRank?: 2 | 3;
  /** קידומת ייחודית ל־id של שדה החיפוש (כשיש יותר ממחירון אחד באותו עמוד) */
  searchFieldIdPrefix?: string;
};

export function PriceListSections({
  categories,
  emojiStrip,
  showEmojis = true,
  listMeta,
  categoryHeadingRank = 2,
  searchFieldIdPrefix = "price-menu",
}: Props) {
  const meta = listMeta === undefined ? PRICE_LIST_META : listMeta;
  const [search, setSearch] = useState("");
  const normalizedSearch = normalizeText(search);
  const CategoryHeadingTag = (categoryHeadingRank === 3 ? "h3" : "h2") as "h2" | "h3";
  const SubHeadingTag = (categoryHeadingRank === 3 ? "h4" : "h3") as "h3" | "h4";
  const filteredCategories = useMemo(() => {
    const seenNames = new Set<string>();
    return categories
      .map((cat) => {
        const rows = dedupeRowsByName(filterRows(cat.rows, normalizedSearch), seenNames);
        const subsections = filterSubsections(cat.subsections, normalizedSearch)
          .map((sub) => ({
            ...sub,
            rows: dedupeRowsByName(sub.rows, seenNames),
          }))
          .filter((sub) => sub.rows.length > 0);
        return {
          ...cat,
          rows,
          subsections,
        };
      })
      .filter((cat) => (cat.rows?.length ?? 0) > 0 || (cat.subsections?.length ?? 0) > 0);
  }, [categories, normalizedSearch]);

  return (
    <div className="price-menu-embed">
      {meta ? (
        <p className="price-menu-banner muted">
          <strong>{meta.title}</strong>
          {meta.validRange?.trim() ? (
            <>
              <span className="price-menu-banner-sep">, </span>
              תקף <strong>{meta.validRange.trim()}</strong>
            </>
          ) : null}
        </p>
      ) : null}
      {showEmojis && emojiStrip ? (
        <p className="price-menu-strip" aria-hidden>
          {emojiStrip}
        </p>
      ) : null}

      <div className="price-menu-search price-menu-search--global">
        <label htmlFor={`${searchFieldIdPrefix}-search`}>
          <span className="price-menu-search-label">חיפוש מהיר בדוכן</span>
          <input
            id={`${searchFieldIdPrefix}-search`}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש מהיר בכל המחירון — לדוגמה: ענבים, אבוקדו, בקבוק…"
            autoComplete="off"
          />
        </label>
      </div>

      <div className="price-menu-categories-grid">
        {filteredCategories.map((cat) => (
          <article
            key={cat.id}
            className={`price-menu-category${isSpecialsCategoryTitle(cat.title) ? " price-menu-category--specials" : ""}`}
          >
            <header className="price-menu-category-head">
              {showEmojis ? (
                <span className="price-menu-cat-emoji" aria-hidden>
                  <ProduceIcon symbol={cat.emoji} />
                </span>
              ) : null}
              <CategoryHeadingTag className="price-menu-cat-title">{cat.title}</CategoryHeadingTag>
            </header>
            {cat.intro ? <p className="price-menu-intro muted">{cat.intro}</p> : null}

            {cat.rows?.length ? (
              <ul className="price-menu-list">
                {cat.rows.map((row) => {
                  const priceDisplay = row.price ?? "לפי המחירון";
                  const kgLabel = rowPricingTextForKg(row, priceDisplay);
                  const item: CartLineInput = {
                    id: makeRowId(cat.id, "_", row.name),
                    emoji: row.emoji,
                    name: row.name,
                    priceLabel: formatPriceLabelForDisplay(row.price ?? priceDisplay),
                    unit: row.unit?.trim() ? formatUnitWordsWithLamed(row.unit.trim()) : undefined,
                    categoryPath: cat.title,
                    qtyStep: isKgPricingLabel(kgLabel) ? 0.5 : 1,
                  };
                  const description = row.description ?? getProduceShortDescription(row.name);
                  return (
                    <PriceRowView
                      key={`${cat.id}-${row.name}`}
                      item={item}
                      description={description}
                      showEmojis={showEmojis}
                    />
                  );
                })}
              </ul>
            ) : null}

            {cat.subsections?.map((sub) => {
              const subKey = sub.title.replace(/\s+/g, "-").slice(0, 40);
              return (
                <div key={`${cat.id}-${sub.title}`} className="price-menu-sub">
                  <SubHeadingTag className="price-menu-sub-title">{sub.title}</SubHeadingTag>
                  {sub.note ? <p className="price-menu-sub-note">{sub.note}</p> : null}
                  <ul className="price-menu-list">
                    {sub.rows.map((row) => {
                      const priceDisplay = row.price ?? (sub.note ? `לפי: ${sub.note}` : "לפי המחירון");
                      const kgLabel = rowPricingTextForKg(row, priceDisplay);
                      const item: CartLineInput = {
                        id: makeRowId(cat.id, subKey, row.name),
                        emoji: row.emoji,
                        name: row.name,
                        priceLabel: formatPriceLabelForDisplay(row.price ?? priceDisplay),
                        unit: row.unit?.trim() ? formatUnitWordsWithLamed(row.unit.trim()) : undefined,
                        categoryPath: `${cat.title} › ${sub.title}`,
                        qtyStep: isKgPricingLabel(kgLabel) ? 0.5 : 1,
                      };
                      const description = row.description ?? getProduceShortDescription(row.name);
                      return (
                        <PriceRowView
                          key={`${cat.id}-${sub.title}-${row.name}`}
                          item={item}
                          description={description}
                          showEmojis={showEmojis}
                        />
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </article>
        ))}
      </div>
      {filteredCategories.length === 0 ? (
        <p className="price-menu-no-results muted">לא נמצאו תוצאות לחיפוש הזה. נסו מילה אחרת.</p>
      ) : null}

      <p className="price-menu-footnote muted">
        לשאלות והזמנות:{" "}
        <a href={`tel:${BUSINESS_PHONE_E164}`} className="price-menu-tel">
          {BUSINESS_PHONE}
        </a>{" "}
        ({BUSINESS_CONTACT_FIRST_NAME}), אפשר גם לבנות סל ולשלוח מ־
        <Link to="/cart" className="price-menu-tel">
          עגלת הקניות
        </Link>
      </p>
    </div>
  );
}
