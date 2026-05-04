import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { SheetPriceListAsMenu } from "../components/SheetPriceListAsMenu";
import { useCart } from "../context/CartContext";
import {
  fillSelectionToMax,
  isPremiumTierProduct,
  poolBasicSorted,
  poolGoldSorted,
  poolPremiumSorted,
  buildFruitPackageTierByKey,
  repairBasicSelection,
  repairGoldSelection,
  repairPremiumSelection,
  resolveProductsForFruitPackages,
  sheetHasAnyFruitPackageTier,
} from "../lib/fruitPackageSheet";
import { getGoogleSheetsProductsCsvUrl } from "../lib/sheetProducts";
import { ROUTES } from "../lib/publicRoutes";
import { usePageSeo } from "../lib/seo";
import { useSheetProducts } from "../hooks/useSheetProducts";

const GOLD_FRUIT_PACKAGE_ADDONS = ["שוקולד", "טחינה", "דבש"] as const;

const MAX_BASIC_PACKAGE_FRUITS = 5;
const MAX_PREMIUM_PACKAGE_FRUITS = 8;
const MAX_GOLD_PACKAGE_FRUITS = 12;
const BASIC_PACKAGE_PRICE = 199;
const PREMIUM_PACKAGE_PRICE = 329;
const GOLD_PACKAGE_PRICE = 549;

const SHEET_POLL_MS = 45_000;

export function Fruits() {
  const { addItem } = useCart();
  const { pathname } = useLocation();
  const [selectedPackageFruits, setSelectedPackageFruits] = useState<string[]>([]);
  const [selectedPremiumPackageFruits, setSelectedPremiumPackageFruits] = useState<string[]>([]);
  const [selectedGoldPackageFruits, setSelectedGoldPackageFruits] = useState<string[]>([]);
  const [selectedGoldAddons, setSelectedGoldAddons] = useState<string[]>([]);
  const [sheetReloadNonce, setSheetReloadNonce] = useState(0);

  const isFruitBoxesPage = pathname === ROUTES.boxes.fruits;
  const sheetCsvUrl = getGoogleSheetsProductsCsvUrl();
  const sheetState = useSheetProducts(sheetCsvUrl, sheetReloadNonce);

  useEffect(() => {
    const id = window.setInterval(() => setSheetReloadNonce((n) => n + 1), SHEET_POLL_MS);
    return () => window.clearInterval(id);
  }, []);

  const fruitPackageProducts = useMemo(
    () => (sheetState.status === "ok" ? resolveProductsForFruitPackages(sheetState.products) : []),
    [sheetState],
  );

  const tierByKey = useMemo(
    () => (sheetState.status === "ok" ? buildFruitPackageTierByKey(fruitPackageProducts) : new Map()),
    [sheetState.status, fruitPackageProducts],
  );

  const poolBasic = useMemo(
    () => (sheetState.status === "ok" ? poolBasicSorted(fruitPackageProducts) : []),
    [sheetState.status, fruitPackageProducts],
  );

  const poolPremium = useMemo(
    () => (sheetState.status === "ok" ? poolPremiumSorted(fruitPackageProducts) : []),
    [sheetState.status, fruitPackageProducts],
  );

  const poolGold = useMemo(
    () => (sheetState.status === "ok" ? poolGoldSorted(fruitPackageProducts) : []),
    [sheetState.status, fruitPackageProducts],
  );

  useEffect(() => {
    if (sheetState.status !== "ok") return;
    setSelectedPackageFruits((prev) => repairBasicSelection(prev, poolBasic, MAX_BASIC_PACKAGE_FRUITS));
    setSelectedPremiumPackageFruits((prev) =>
      repairPremiumSelection(prev, poolPremium, MAX_PREMIUM_PACKAGE_FRUITS, tierByKey),
    );
    setSelectedGoldPackageFruits((prev) => repairGoldSelection(prev, poolGold, MAX_GOLD_PACKAGE_FRUITS));
  }, [sheetState.status, sheetState.products, poolBasic, poolPremium, poolGold, tierByKey]);

  usePageSeo({
    title: "Royal Fruit | מחירון פירות פרימיום ומשלוחים בגוש דן",
    description: "מחירון פירות פרימיום עם מלאי עונתי, בשלות לפי מועד שימוש ומשלוחים מתואמים בחולון, בת ים, ראשון לציון, תל אביב וגוש דן.",
  });

  const togglePackageFruit = (name: string) => {
    setSelectedPackageFruits((prev) => {
      if (prev.includes(name)) return prev.filter((item) => item !== name);
      if (prev.length >= MAX_BASIC_PACKAGE_FRUITS) return prev;
      return [...prev, name];
    });
  };

  const togglePremiumPackageFruit = (name: string) => {
    setSelectedPremiumPackageFruits((prev) => {
      if (prev.includes(name)) return prev.filter((item) => item !== name);
      if (prev.length >= MAX_PREMIUM_PACKAGE_FRUITS) return prev;
      return [...prev, name];
    });
  };

  const toggleGoldPackageFruit = (name: string) => {
    setSelectedGoldPackageFruits((prev) => {
      if (prev.includes(name)) return prev.filter((item) => item !== name);
      if (prev.length >= MAX_GOLD_PACKAGE_FRUITS) return prev;
      return [...prev, name];
    });
  };

  const toggleGoldAddon = (name: string) => {
    setSelectedGoldAddons((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]));
  };

  const addBasicPackageToCart = () => {
    if (!selectedPackageFruits.length || sheetState.status !== "ok") return;
    const filled = fillSelectionToMax(selectedPackageFruits, MAX_BASIC_PACKAGE_FRUITS, poolBasic);
    if (!filled.length) return;
    addItem({
      id: `fruit-package-basic::${filled.join("|")}`,
      emoji: "🎁",
      name: `חבילה בסיסית - ${filled.join(", ")}`,
      priceLabel: `${BASIC_PACKAGE_PRICE} ₪`,
      unit: "כמות קטנה-בינונית, עד 5 סוגי פירות",
      categoryPath: "מארזי פירות",
      qtyStep: 1,
    });
  };

  const addPremiumPackageToCart = () => {
    if (!selectedPremiumPackageFruits.length || sheetState.status !== "ok") return;
    const filled = fillSelectionToMax(selectedPremiumPackageFruits, MAX_PREMIUM_PACKAGE_FRUITS, poolPremium);
    if (!filled.length) return;
    addItem({
      id: `fruit-package-premium::${filled.join("|")}`,
      emoji: "🎁",
      name: `חבילת פרימיום - ${filled.join(", ")}`,
      priceLabel: `${PREMIUM_PACKAGE_PRICE} ₪`,
      unit: "עד 8 סוגי פירות, בסיסיים ומיוחדים",
      categoryPath: "מארזי פירות",
      qtyStep: 1,
    });
  };

  const addGoldPackageToCart = () => {
    if (!selectedGoldPackageFruits.length || sheetState.status !== "ok") return;
    const filled = fillSelectionToMax(selectedGoldPackageFruits, MAX_GOLD_PACKAGE_FRUITS, poolGold);
    if (!filled.length) return;
    const addonsText = selectedGoldAddons.length ? ` | תוספות: ${selectedGoldAddons.join(", ")}` : "";
    addItem({
      id: `fruit-package-gold::${filled.join("|")}::${selectedGoldAddons.join("|")}`,
      emoji: "🏆",
      name: `חבילת גולד - ${filled.join(", ")}${addonsText}`,
      priceLabel: `${GOLD_PACKAGE_PRICE} ₪`,
      unit: "עד 12 סוגי פירות לפי המלאי והרמות מהגיליון",
      categoryPath: "מארזי פירות",
      qtyStep: 1,
    });
  };

  const sheetNotice =
    sheetState.status === "loading" || sheetState.status === "idle" ? (
      <p className="muted small">טוען פירות מהגיליון…</p>
    ) : sheetState.status === "error" ? (
      <p className="muted small" role="alert">
        {sheetState.message}
      </p>
    ) : null;

  return (
    <div className="page">
      <section className="page-hero fruits-hero">
        <div className="container narrow">
          <p className="eyebrow">פירות פרימיום</p>
          <h1 className="page-title fruits-page-title">ממתקי טבע שנבחרו כמו אבנים נדירות</h1>
          <p className="page-lead muted">
            מחירון פירות שמתעדכן לפי מלאי יומי, בשלות ועונה. מה שמופיע כאן משקף את הבחירה הטרייה
            והמדויקת ביותר כרגע.
          </p>
        </div>
      </section>

      <section id="fruits-price-list" className="section sheet-products-page-section price-menu-body fruits-section">
        <div className="container fruits-premium-shell">
          <div className="fruits-intro-card catalog-intro-card--centered" aria-label="סטנדרט הפירות של רויאל פרוט">
            <div>
              <RoyalFruitWordmark className="fruits-intro-wordmark" />
              <h2>פירות שנבחרים לפי טעם, צבע ובשלות, לא רק לפי מראה.</h2>
            </div>
            <div className="fruits-intro-points">
              <span>בשלות לפי מועד הגשה</span>
              <span>מיון ידני</span>
              <span>מלאי עונתי</span>
            </div>
            <Link to="/cart" className="btn btn-primary fruits-intro-cta">
              מעבר לסל
            </Link>
          </div>

          {isFruitBoxesPage ? sheetNotice : null}

          {isFruitBoxesPage ? (
            <>
          <section className="fruit-package-builder" aria-labelledby="basic-fruit-package-title">
            <div className="fruit-package-builder-head">
              <p className="fruit-package-kicker">מארזי פירות</p>
              <h2 id="basic-fruit-package-title">חבילה בסיסית</h2>
              <p className="fruit-package-tagline">מארז יומי קליל ורענן</p>
            </div>

            <div className="fruit-package-meta" aria-label="מה יש בפנים">
              <span>{MAX_BASIC_PACKAGE_FRUITS} סוגי פירות</span>
              <span>כמות קטנה-בינונית</span>
              <span>{BASIC_PACKAGE_PRICE} ₪</span>
              <span>
                {selectedPackageFruits.length}/{MAX_BASIC_PACKAGE_FRUITS} נבחרו
              </span>
            </div>

            <div className="fruit-package-options" role="list" aria-label="בחירת פירות לחבילה בסיסית">
              {sheetState.status === "ok" &&
                poolBasic.map((option) => {
                  const name = option.name.trim();
                  const checked = selectedPackageFruits.includes(name);
                  const disabled = !checked && selectedPackageFruits.length >= MAX_BASIC_PACKAGE_FRUITS;
                  return (
                    <label
                      key={name}
                      className={`fruit-package-option${checked ? " is-selected" : ""}${disabled ? " is-disabled" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => togglePackageFruit(name)}
                      />
                      <span className="fruit-package-option-name">{name}</span>
                    </label>
                  );
                })}
              {sheetState.status === "ok" && poolBasic.length === 0 ? (
                <p className="muted small">
                  {sheetHasAnyFruitPackageTier(sheetState.products)
                    ? "אין כרגע פירות בסיסיים זמינים במארז — בדקו בגיליון עמודת רמת מארז (basic) וסימון זמינות."
                    : "אין כרגע פירות זמינים המסווגים כפירות במחירון — ודאו שיש שורות עם מדור/קטגוריית פירות ושהן זמינות."}
                </p>
              ) : null}
            </div>

            <div className="fruit-package-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={addBasicPackageToCart}
                disabled={selectedPackageFruits.length === 0 || sheetState.status !== "ok"}
              >
                הוספת חבילה לסל
              </button>
            </div>
          </section>

          <section
            className="fruit-package-builder fruit-package-builder--premium"
            aria-labelledby="premium-fruit-package-title"
          >
            <div className="fruit-package-builder-head">
              <p className="fruit-package-kicker">מארזי פירות</p>
              <h2 id="premium-fruit-package-title">חבילת פרימיום</h2>
              <p className="fruit-package-tagline">שילוב מושלם של פירות מובחרים</p>
            </div>

            <div className="fruit-package-meta" aria-label="מה יש בפנים">
              <span>{MAX_PREMIUM_PACKAGE_FRUITS} סוגי פירות</span>
              <span>{PREMIUM_PACKAGE_PRICE} ₪</span>
              <span>
                {selectedPremiumPackageFruits.length}/{MAX_PREMIUM_PACKAGE_FRUITS} נבחרו
              </span>
            </div>

            <div className="fruit-package-options" role="list" aria-label="בחירת פירות לחבילת פרימיום">
              {sheetState.status === "ok" &&
                poolPremium.map((option) => {
                  const name = option.name.trim();
                  const checked = selectedPremiumPackageFruits.includes(name);
                  const disabled = !checked && selectedPremiumPackageFruits.length >= MAX_PREMIUM_PACKAGE_FRUITS;
                  const showSpecial = isPremiumTierProduct(option);
                  return (
                    <label
                      key={name}
                      className={`fruit-package-option${checked ? " is-selected" : ""}${disabled ? " is-disabled" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => togglePremiumPackageFruit(name)}
                      />
                      <span className="fruit-package-option-name">
                        {name}
                        {showSpecial ? <span className="fruit-package-option-tag">מיוחד</span> : null}
                      </span>
                    </label>
                  );
                })}
              {sheetState.status === "ok" && poolPremium.length === 0 ? (
                <p className="muted small">
                  {sheetHasAnyFruitPackageTier(sheetState.products)
                    ? "אין כרגע פירות זמינים לחבילת פרימיום — בדקו רמות basic/premium וזמינות בגיליון."
                    : "אין כרגע פירות זמינים המסווגים כפירות במחירון — ודאו שיש שורות עם מדור/קטגוריית פירות ושהן זמינות."}
                </p>
              ) : null}
            </div>

            <div className="fruit-package-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={addPremiumPackageToCart}
                disabled={selectedPremiumPackageFruits.length === 0 || sheetState.status !== "ok"}
              >
                הוספת חבילת פרימיום לסל
              </button>
            </div>
          </section>

          <section className="fruit-package-builder fruit-package-builder--gold" aria-labelledby="gold-fruit-package-title">
            <div className="fruit-package-builder-head">
              <p className="fruit-package-kicker">מארזי פירות</p>
              <h2 id="gold-fruit-package-title">חבילת גולד</h2>
              <p className="fruit-package-tagline">חוויה יוקרתית עם פירות פרימיום ותוספות</p>
            </div>

            <div className="fruit-package-meta" aria-label="מה יש בפנים">
              <span>{MAX_GOLD_PACKAGE_FRUITS} סוגי פירות</span>
              <span>כל הרמות מהגיליון</span>
              <span>{GOLD_PACKAGE_PRICE} ₪</span>
              <span>
                {selectedGoldPackageFruits.length}/{MAX_GOLD_PACKAGE_FRUITS} נבחרו
              </span>
            </div>

            <div className="fruit-package-options" role="list" aria-label="בחירת פירות לחבילת גולד">
              {sheetState.status === "ok" &&
                poolGold.map((option) => {
                  const name = option.name.trim();
                  const checked = selectedGoldPackageFruits.includes(name);
                  const disabled = !checked && selectedGoldPackageFruits.length >= MAX_GOLD_PACKAGE_FRUITS;
                  const showSpecial = isPremiumTierProduct(option);
                  return (
                    <label
                      key={name}
                      className={`fruit-package-option${checked ? " is-selected" : ""}${disabled ? " is-disabled" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleGoldPackageFruit(name)}
                      />
                      <span className="fruit-package-option-name">
                        {name}
                        {showSpecial ? <span className="fruit-package-option-tag">מיוחד</span> : null}
                      </span>
                    </label>
                  );
                })}
              {sheetState.status === "ok" && poolGold.length === 0 ? (
                <p className="muted small">
                  {sheetHasAnyFruitPackageTier(sheetState.products)
                    ? "אין כרגע פירות זמינים לחבילת גולד — בדקו רמות המארז וזמינות בגיליון."
                    : "אין כרגע פירות זמינים המסווגים כפירות במחירון — ודאו שיש שורות עם מדור/קטגוריית פירות ושהן זמינות."}
                </p>
              ) : null}
            </div>

            <div className="fruit-package-addon-group" aria-label="תוספות לחבילת גולד">
              <h3>תוספות</h3>
              <div className="fruit-package-addons">
                {GOLD_FRUIT_PACKAGE_ADDONS.map((addon) => {
                  const checked = selectedGoldAddons.includes(addon);
                  return (
                    <label key={addon} className={`fruit-package-addon${checked ? " is-selected" : ""}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleGoldAddon(addon)} />
                      <span>{addon}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="fruit-package-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={addGoldPackageToCart}
                disabled={selectedGoldPackageFruits.length === 0 || sheetState.status !== "ok"}
              >
                הוספת חבילת גולד לסל
              </button>
            </div>
          </section>
            </>
          ) : null}

          {!isFruitBoxesPage ? (
            <SheetPriceListAsMenu
              idPrefix="sheet-fruits"
              defaultEmoji="fruit"
              emojiStrip=""
              showEmojis={false}
              page="fruits"
              listMeta={{
                title: "מחירון פירות",
              }}
              singleCategoryTitle="הפירות הזמינים היום"
              priceMenuEmbedClassName="price-menu-embed--premium-cards"
              showProductImages={false}
            />
          ) : null}
        </div>
      </section>

      <section id="fruits-faq" className="section fruits-guide-section">
        <div className="container narrow fruits-guide-shell">
          <div className="fruits-guide-head">
            <p className="fruits-guide-kicker">לפני שבוחרים</p>
            <h2>שני כללים קטנים שעושים הבדל גדול בטעם.</h2>
          </div>
          <div className="fruits-guide-grid">
            <article className="fruits-guide-card">
              <h3>איך לבחור בשלות לפי מועד שימוש?</h3>
              <p>
                אם ההגשה היא היום, בוחרים פירות בשלים ומוכנים לצלחת. אם ההגשה מחר או מחרתיים, משלבים
                חלק מהפריטים בדרגת בשלות נמוכה יותר כדי לשמור על מרקם וטעם בשיא בזמן הנכון.
              </p>
            </article>
            <article className="fruits-guide-card">
              <h3>איך שומרים טריות אחרי קבלה?</h3>
              <p>
                מפרידים בין פירות שממשיכים להבשיל, כמו מנגו ואבוקדו, לבין פירות עדינים שעדיף לקרר מיד.
                אחסון לפי קבוצות מפחית פחת ושומר על טעם לאורך זמן.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section produce-seo-section">
        <div className="container narrow produce-seo-card">
          <p className="produce-seo-kicker">משלוח פירות באזור המרכז</p>
          <h2>פירות פרימיום עד הבית בחולון, בת ים, ראשון לציון ותל אביב.</h2>
          <p>
            Royal Fruit מתאימה סל פירות לפי עונה, בשלות ומועד שימוש: סל שבועי לבית, פירות לאירוח,
            פירות חתוכים או בחירה מדויקת לעסק. ההזמנה נסגרת בוואטסאפ, כדי לוודא מלאי,
            בשלות ומועד משלוח לפני האריזה.
          </p>
        </div>
      </section>
    </div>
  );
}
