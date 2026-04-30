import { PriceListSections } from "./PriceListSections";
import { useSheetProducts } from "../hooks/useSheetProducts";
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
  /** פירות / ירקות / הכל */
  page: SheetPageFilter;
  /** מעל הרשימה, כמו באנר המחירון. null = בלי באנר */
  listMeta: PriceListBannerMeta | null;
  categoryHeadingRank?: 2 | 3;
  singleCategoryTitle?: string;
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
}: SheetPriceListAsMenuProps) {
  const csvUrl = getGoogleSheetsProductsCsvUrl();
  const state = useSheetProducts(csvUrl);

  if (!csvUrl) {
    return (
      <div className="sheet-products-error sheet-products-config-hint-prod" role="status">
        <p className="muted small">
          {import.meta.env.DEV ? (
            <>
              מחירון דינמי לא מוגדר: הוסיפו <code>VITE_PRICE_SHEET_VIA_PROXY=1</code> ו־
              <code>GOOGLE_SHEETS_PRODUCTS_CSV_URL</code> ל־<code>.env</code>, או בשינוי ישן:{" "}
              <code>VITE_GOOGLE_SHEETS_PRODUCTS_CSV_URL</code>. לבדיקה מהטלפון ברשת: <code>npm run dev:lan</code>.
            </>
          ) : (
            <>
              לא הצלחנו להציג מחירון כי חסר חיבור לגיליון בהגדרות האתר. מומלץ לנסות שוב מאוחר יותר, לפתוח ממכשיר אחר, או
              ליצור קשר עם העסק לקבלת מחירים עדכניים.
            </>
          )}
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
    return (
      <div className="sheet-products-error" role="alert">
        <p>{import.meta.env.DEV ? state.message : publicMessage}</p>
        <button type="button" className="btn btn-ghost btn-sm sheet-products-retry" onClick={() => window.location.reload()}>
          נסו לטעון שוב
        </button>
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
