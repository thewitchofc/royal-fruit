import { useState } from "react";
import { Link } from "react-router-dom";
import { CloudOff, Phone, ShoppingBag } from "lucide-react";
import { PriceListSections } from "./PriceListSections";
import { useSheetProducts } from "../hooks/useSheetProducts";
import { BUSINESS_PHONE, BUSINESS_PHONE_E164 } from "../lib/business";
import { ROUTES } from "../lib/publicRoutes";
import { findDuplicateDisplayNamesInCategories, type PriceCategory, type PriceListBannerMeta } from "../data/priceList";
import { getGoogleSheetsProductsCsvUrl, groupSheetProductsToPriceCategories } from "../lib/sheetProducts";

type SheetPriceListAsMenuProps = {
  idPrefix: string;
  defaultEmoji: string;
  emojiStrip?: string;
  showEmojis: boolean;
  /** ערך עמודת type בגיליון (פירות, ירקות, ירק ושורשים, מטבח טרי) */
  sheetType: string;
  /** מעל הרשימה, כמו באנר המחירון. null = בלי באנר */
  listMeta: PriceListBannerMeta | null;
  categoryHeadingRank?: 2 | 3;
  singleCategoryTitle?: string;
  /** מחלקה על שורש PriceListSections (למשל ערכת צבעים) */
  priceMenuEmbedClassName?: string;
  priceMenuSearchLabel?: string;
  priceMenuSearchPlaceholder?: string;
  /** תמונות מוצר בכרטיס/שורה — false בפירות/ירקות/מיצים/מטבח */
  showProductImages?: boolean;
  /** טקסט “התמונות להמחשה בלבד” — לשליטה ברמת עמוד (כדי שיופיע פעם אחת) */
  showImagesDisclaimer?: boolean;
  /** אם מוגדר — רק שמות שמתאימים לקידומות יקבלו תמונה (למשל דף פירות עם תמונות ייעודיות בלבד) */
  productImageOnlyPrefixes?: readonly string[];
  /** כותרות קטגוריה מהגיליון שלא להציג (למשל כשכבר יש כרטיסים סטטיים לאותם מוצרים) */
  excludeCategoryTitles?: readonly string[];
  /** false = בלי חיפוש במחירון */
  showPriceMenuSearch?: boolean;
};

export function SheetPriceListAsMenu({
  idPrefix,
  defaultEmoji,
  emojiStrip,
  showEmojis,
  sheetType,
  listMeta,
  categoryHeadingRank = 2,
  singleCategoryTitle,
  priceMenuEmbedClassName,
  priceMenuSearchLabel,
  priceMenuSearchPlaceholder,
  showProductImages = true,
  showImagesDisclaimer = false,
  productImageOnlyPrefixes,
  excludeCategoryTitles,
  showPriceMenuSearch = true,
}: SheetPriceListAsMenuProps) {
  const csvUrl = getGoogleSheetsProductsCsvUrl();
  const [reloadNonce, setReloadNonce] = useState(0);
  const state = useSheetProducts(csvUrl, reloadNonce);

  if (state.status === "loading") {
    return (
      <div className="sheet-products-loading" role="status" aria-live="polite">
        <span className="sheet-products-loading-orb" aria-hidden />
        <p className="sheet-products-loading-title">מסדרים את הדוכן הטרי...</p>
        <p className="muted small">טוענים מחירים ומלאי עדכניים מהגיליון.</p>
      </div>
    );
  }

  if (state.status === "error") {
    const publicMessage =
      "לא הצלחנו לטעון את המחירון כרגע. נסו לרענן את העמוד בעוד רגע, או התקשרו לעדכון מחירים ומלאי.";
    return (
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
          <Link
            className="btn btn-cart-fill btn-whatsapp-strong sheet-products-error-wa"
            to={ROUTES.cart}
          >
            <ShoppingBag className="btn-whatsapp-icon" aria-hidden strokeWidth={2} />
            מעבר לסל
          </Link>
          <div className="sheet-products-error-actions-row">
            <button
              type="button"
              className="btn btn-primary sheet-products-retry"
              onClick={() => setReloadNonce((n) => n + 1)}
            >
              נסו לטעון שוב
            </button>
            <a className="btn btn-ghost sheet-products-error-tel" href={`tel:${BUSINESS_PHONE_E164}`}>
              <Phone className="sheet-products-error-action-icon" aria-hidden size={18} strokeWidth={2} />
              {BUSINESS_PHONE}
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (state.status !== "ok") {
    return null;
  }

  const groupedCategories = groupSheetProductsToPriceCategories(state.products, {
    idPrefix,
    defaultEmoji,
    sheetType,
  });
  let categories: PriceCategory[] = singleCategoryTitle
    ? mergeCategoriesToSingleList(groupedCategories, {
        id: `${idPrefix}-all`,
        title: singleCategoryTitle,
        emoji: defaultEmoji,
      })
    : groupedCategories;

  if (excludeCategoryTitles?.length) {
    const drop = new Set(excludeCategoryTitles.map((t) => t.trim()));
    categories = categories.filter((c) => !drop.has(c.title.trim()));
  }

  if (import.meta.env.DEV) {
    const dups = findDuplicateDisplayNamesInCategories(categories);
    if (dups.length) {
      console.warn("[Royal Fruit] שמות מוצר כפולים במחירון, עדכנו את הגיליון או הבחינו בשם:", dups);
    }
  }

  if (!categories.length) {
    if (excludeCategoryTitles?.length) {
      return null;
    }
    const hint = sheetType.trim()
      ? `אין כרגע פריטים זמינים תחת «${sheetType.trim()}» במחירון. אם חסר משהו שחיפשתם, מומלץ לפנות ישירות לעסק.`
      : "אין כרגע פריטים זמינים להצגה במחירון.";
    return <p className="muted">{hint}</p>;
  }

  return (
    <PriceListSections
      categories={categories}
      emojiStrip={emojiStrip}
      showEmojis={showEmojis}
      listMeta={listMeta}
      categoryHeadingRank={categoryHeadingRank}
      searchFieldIdPrefix={idPrefix}
      embedClassName={priceMenuEmbedClassName}
      searchFieldLabel={priceMenuSearchLabel}
      searchFieldPlaceholder={priceMenuSearchPlaceholder}
      showProductImages={showProductImages}
      showImagesDisclaimer={showImagesDisclaimer}
      productImageOnlyPrefixes={productImageOnlyPrefixes}
      showSearch={showPriceMenuSearch}
    />
  );
}

function mergeCategoriesToSingleList(
  categories: PriceCategory[],
  merged: Pick<PriceCategory, "id" | "title" | "emoji">,
): PriceCategory[] {
  const rows = categories.flatMap((category) => [
    ...(category.rows ?? []),
    ...(category.subsections?.flatMap((subsection) => subsection.rows) ?? []),
  ]).sort((a, b) => a.name.localeCompare(b.name, "he"));

  if (!rows.length) return [];

  return [
    {
      ...merged,
      rows,
    },
  ];
}
