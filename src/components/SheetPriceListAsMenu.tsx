import { useState } from "react";
import { CloudOff, MessageCircle, Phone } from "lucide-react";
import { PriceListSections } from "./PriceListSections";
import { useSheetProducts } from "../hooks/useSheetProducts";
import { BUSINESS_PHONE, BUSINESS_PHONE_E164 } from "../lib/business";
import { whatsappChatUrl } from "../lib/whatsappOrder";
import { findDuplicateDisplayNamesInCategories, type PriceCategory, type PriceListBannerMeta } from "../data/priceList";
import {
  getGoogleSheetsProductsCsvUrl,
  groupSheetProductsToPriceCategories,
  type SheetPageFilter,
} from "../lib/sheetProducts";

type SheetPriceListAsMenuProps = {
  idPrefix: string;
  defaultEmoji: string;
  emojiStrip?: string;
  showEmojis: boolean;
  /** פירות / מיצים / חלווה / אוכל ביתי / ירקות / הכל */
  page: SheetPageFilter;
  /** מעל הרשימה, כמו באנר המחירון. null = בלי באנר */
  listMeta: PriceListBannerMeta | null;
  categoryHeadingRank?: 2 | 3;
  singleCategoryTitle?: string;
  /** מחלקה על שורש PriceListSections (למשל ערכת צבעים) */
  priceMenuEmbedClassName?: string;
  priceMenuSearchLabel?: string;
  priceMenuSearchPlaceholder?: string;
};

export function SheetPriceListAsMenu({
  idPrefix,
  defaultEmoji,
  emojiStrip,
  showEmojis,
  page,
  listMeta,
  categoryHeadingRank = 2,
  singleCategoryTitle,
  priceMenuEmbedClassName,
  priceMenuSearchLabel,
  priceMenuSearchPlaceholder,
}: SheetPriceListAsMenuProps) {
  const csvUrl = getGoogleSheetsProductsCsvUrl();
  const [reloadNonce, setReloadNonce] = useState(0);
  const state = useSheetProducts(csvUrl, reloadNonce);

  if (!csvUrl) {
    if (!import.meta.env.DEV) {
      return null;
    }
    return (
      <div className="sheet-products-config-hint">
        <p className="muted small">
          (מצב פיתוח) מחירון דינמי: הגדירו <code>VITE_PRICE_SHEET_VIA_PROXY=1</code> ו־
          <code>GOOGLE_SHEETS_PRODUCTS_CSV_URL</code> (מומלץ) או <code>VITE_GOOGLE_SHEETS_PRODUCTS_CSV_URL</code> ב־
          <code>.env</code>, והריצו <code>npm run dev</code>.
        </p>
      </div>
    );
  }

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
    const waUrl = whatsappChatUrl(
      "היי, האתר לא הצליח לטעון את המחירון — אפשר עזרה עם מחירים ומלאי?",
    );
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
          <a
            className="btn btn-primary btn-whatsapp btn-whatsapp-strong sheet-products-error-wa"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="btn-whatsapp-icon" aria-hidden strokeWidth={2} />
            וואטסאפ
          </a>
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
    page,
  });
  const categories = singleCategoryTitle
    ? mergeCategoriesToSingleList(groupedCategories, {
        id: `${idPrefix}-all`,
        title: singleCategoryTitle,
        emoji: defaultEmoji,
      })
    : groupedCategories;

  if (import.meta.env.DEV) {
    const dups = findDuplicateDisplayNamesInCategories(categories);
    if (dups.length) {
      console.warn("[Royal Fruit] שמות מוצר כפולים במחירון, עדכנו את הגיליון או הבחינו בשם:", dups);
    }
  }

  if (!categories.length) {
    const hint =
      page === "all"
        ? "אין כרגע פריטים זמינים להצגה במחירון."
        : page === "juices"
          ? "אין כרגע מיצים או שתייה טבעית במחירון. אפשר לשאול בוואטסאפ מה זמין היום."
          : page === "halva"
            ? "אין כרגע פריטי חלווה במחירון. בהמשך תוסיפו שורות בגיליון עם סוג או קטגוריה «חלווה»."
            : page === "homeFood"
              ? "אין כרגע אוכל ביתי במחירון. בהמשך תוסיפו שורות עם סוג או קטגוריה «אוכל ביתי»."
              : "אין כרגע פריטים זמינים בקטגוריה הזו. אם חסר משהו שחיפשתם, מומלץ לפנות ישירות לעסק.";
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
