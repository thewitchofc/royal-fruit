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
  resolveProductsForFruitPackages,
  sheetHasAnyFruitPackageTier,
} from "../lib/fruitPackageSheet";
import { getGoogleSheetsProductsCsvUrl } from "../lib/sheetProducts";
import { ROUTES } from "../lib/publicRoutes";
import { usePageSeo } from "../lib/seo";
import { useSheetProducts } from "../hooks/useSheetProducts";

type QtyMap = Record<string, number>;

const GOLD_FRUIT_PACKAGE_ADDONS = [
  "סילאן",
  "טחינה",
  "דבש",
  "סירופ בטעם שוקולד (פרווה)",
  "סירופ בטעם מייפל",
] as const;

const MAX_BASIC_PACKAGE_FRUITS = 5;
const MAX_PREMIUM_PACKAGE_FRUITS = 8;
const MAX_GOLD_PACKAGE_FRUITS = 12;
const BASIC_PACKAGE_PRICE = 199;
const PREMIUM_PACKAGE_PRICE = 329;
const GOLD_PACKAGE_PRICE = 549;
const GOLD_FREE_ADDONS = 4;
const GOLD_ADDON_EXTRA_PRICE = 3;

const SHEET_POLL_MS = 45_000;

export function Fruits() {
  const { addItem } = useCart();
  const { pathname } = useLocation();
  const [selectedPackageFruits, setSelectedPackageFruits] = useState<QtyMap>({});
  const [selectedPremiumPackageFruits, setSelectedPremiumPackageFruits] = useState<QtyMap>({});
  const [selectedGoldPackageFruits, setSelectedGoldPackageFruits] = useState<QtyMap>({});
  const [selectedGoldAddons, setSelectedGoldAddons] = useState<QtyMap>({});
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

  const totalSelected = (m: QtyMap) =>
    Object.values(m).reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0);

  const clampSelectionsToPool = (m: QtyMap, pool: { name: string }[], max: number) => {
    const allowed = new Set(pool.map((p) => p.name.trim()));
    const next: Record<string, number> = {};
    for (const [k, v] of Object.entries(m)) {
      const name = k.trim();
      if (!allowed.has(name)) continue;
      const qty = Math.max(0, Math.floor(v));
      if (qty <= 0) continue;
      next[name] = qty;
    }
    // אם חרגנו מהמכסה בעקבות שינויים בגיליון — חותכים מהסוף לפי סדר pool
    let sum = totalSelected(next);
    if (sum <= max) return next;
    const order = pool.map((p) => p.name.trim()).reverse();
    for (const name of order) {
      if (sum <= max) break;
      const cur = next[name] ?? 0;
      if (cur <= 0) continue;
      const drop = Math.min(cur, sum - max);
      const remain = cur - drop;
      if (remain <= 0) delete next[name];
      else next[name] = remain;
      sum -= drop;
    }
    return next;
  };

  const expandSelection = (m: QtyMap) =>
    Object.entries(m).flatMap(([name, qty]) => Array.from({ length: Math.max(0, Math.floor(qty)) }, () => name));

  useEffect(() => {
    if (sheetState.status !== "ok") return;
    setSelectedPackageFruits((prev) => clampSelectionsToPool(prev, poolBasic, MAX_BASIC_PACKAGE_FRUITS));
    setSelectedPremiumPackageFruits((prev) => clampSelectionsToPool(prev, poolPremium, MAX_PREMIUM_PACKAGE_FRUITS));
    setSelectedGoldPackageFruits((prev) => clampSelectionsToPool(prev, poolGold, MAX_GOLD_PACKAGE_FRUITS));
  }, [sheetState.status, sheetState.products, poolBasic, poolPremium, poolGold, tierByKey]);

  usePageSeo({
    title: "Royal Fruit | מחירון פירות פרימיום ומשלוחים בגוש דן",
    description: "מחירון פירות פרימיום עם מלאי עונתי, בשלות לפי מועד שימוש ומשלוחים מתואמים בחולון, בת ים, ראשון לציון, תל אביב וגוש דן.",
  });

  const bumpQty = (
    setState: React.Dispatch<React.SetStateAction<QtyMap>>,
    max: number,
    name: string,
    delta: 1 | -1,
  ) => {
    setState((prev) => {
      const next = { ...prev };
      const cur = next[name] ?? 0;
      const sum = totalSelected(next);
      if (delta > 0 && sum >= max) return prev;
      const value = Math.max(0, cur + delta);
      if (value <= 0) delete next[name];
      else next[name] = value;
      return next;
    });
  };

  const formatAddonList = (m: QtyMap) => {
    const entries = Object.entries(m)
      .map(([name, qty]) => [name, Math.max(0, Math.floor(qty))] as const)
      .filter(([, qty]) => qty > 0);
    if (!entries.length) return "";
    return entries
      .map(([name, qty]) => (qty === 1 ? name : `${name} ×${qty}`))
      .join(", ");
  };

  const addBasicPackageToCart = () => {
    if (totalSelected(selectedPackageFruits) <= 0 || sheetState.status !== "ok") return;
    const filled = fillSelectionToMax(expandSelection(selectedPackageFruits), MAX_BASIC_PACKAGE_FRUITS, poolBasic);
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
    if (totalSelected(selectedPremiumPackageFruits) <= 0 || sheetState.status !== "ok") return;
    const filled = fillSelectionToMax(expandSelection(selectedPremiumPackageFruits), MAX_PREMIUM_PACKAGE_FRUITS, poolPremium);
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
    if (totalSelected(selectedGoldPackageFruits) <= 0 || sheetState.status !== "ok") return;
    const filled = fillSelectionToMax(expandSelection(selectedGoldPackageFruits), MAX_GOLD_PACKAGE_FRUITS, poolGold);
    if (!filled.length) return;
    const addonUnits = totalSelected(selectedGoldAddons);
    const paidAddonCount = Math.max(0, addonUnits - GOLD_FREE_ADDONS);
    const paidAddonTotal = paidAddonCount * GOLD_ADDON_EXTRA_PRICE;
    const addonsList = formatAddonList(selectedGoldAddons);
    const addonsText = addonsList ? ` | תוספות: ${addonsList}` : "";
    addItem({
      id: `fruit-package-gold::${filled.join("|")}::${addonsList}`,
      emoji: "🏆",
      name: `חבילת גולד - ${filled.join(", ")}${addonsText}`,
      priceLabel: `${GOLD_PACKAGE_PRICE + paidAddonTotal} ₪`,
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
            <Link to="/cart" className="btn btn-cart-fill fruits-intro-cta">
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
                {totalSelected(selectedPackageFruits)}/{MAX_BASIC_PACKAGE_FRUITS} נבחרו
              </span>
            </div>

            <div className="fruit-package-options" role="list" aria-label="בחירת פירות לחבילה בסיסית">
              {sheetState.status === "ok" &&
                poolBasic.map((option) => {
                  const name = option.name.trim();
                  const qty = selectedPackageFruits[name] ?? 0;
                  const sum = totalSelected(selectedPackageFruits);
                  const disablePlus = sum >= MAX_BASIC_PACKAGE_FRUITS;
                  return (
                    <label
                      key={name}
                      className={`fruit-package-option${qty > 0 ? " is-selected" : ""}${qty <= 0 && disablePlus ? " is-disabled" : ""}`}
                    >
                      <span className="fruit-package-option-name">{name}</span>
                      <span className="price-menu-add-wrap" aria-label={`כמות ${name} בחבילה`}>
                        <button
                          type="button"
                          className="price-menu-qty-btn"
                          aria-label={`הפחת ${name}`}
                          onClick={() => bumpQty(setSelectedPackageFruits, MAX_BASIC_PACKAGE_FRUITS, name, -1)}
                          disabled={qty <= 0}
                        >
                          −
                        </button>
                        <span className="price-menu-qty-badge" aria-label={`נבחרו: ${qty}`}>
                          {qty}
                        </span>
                        <button
                          type="button"
                          className="price-menu-qty-btn"
                          aria-label={`הוסף ${name}`}
                          onClick={() => bumpQty(setSelectedPackageFruits, MAX_BASIC_PACKAGE_FRUITS, name, 1)}
                          disabled={disablePlus}
                        >
                          +
                        </button>
                      </span>
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
                disabled={totalSelected(selectedPackageFruits) === 0 || sheetState.status !== "ok"}
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
                {totalSelected(selectedPremiumPackageFruits)}/{MAX_PREMIUM_PACKAGE_FRUITS} נבחרו
              </span>
            </div>

            <div className="fruit-package-options" role="list" aria-label="בחירת פירות לחבילת פרימיום">
              {sheetState.status === "ok" &&
                poolPremium.map((option) => {
                  const name = option.name.trim();
                  const qty = selectedPremiumPackageFruits[name] ?? 0;
                  const sum = totalSelected(selectedPremiumPackageFruits);
                  const disablePlus = sum >= MAX_PREMIUM_PACKAGE_FRUITS;
                  const showSpecial = isPremiumTierProduct(option);
                  return (
                    <label
                      key={name}
                      className={`fruit-package-option${qty > 0 ? " is-selected" : ""}${qty <= 0 && disablePlus ? " is-disabled" : ""}`}
                    >
                      <span className="fruit-package-option-name">
                        {name}
                        {showSpecial ? <span className="fruit-package-option-tag">מיוחד</span> : null}
                      </span>
                      <span className="price-menu-add-wrap" aria-label={`כמות ${name} בחבילה`}>
                        <button
                          type="button"
                          className="price-menu-qty-btn"
                          aria-label={`הפחת ${name}`}
                          onClick={() => bumpQty(setSelectedPremiumPackageFruits, MAX_PREMIUM_PACKAGE_FRUITS, name, -1)}
                          disabled={qty <= 0}
                        >
                          −
                        </button>
                        <span className="price-menu-qty-badge" aria-label={`נבחרו: ${qty}`}>
                          {qty}
                        </span>
                        <button
                          type="button"
                          className="price-menu-qty-btn"
                          aria-label={`הוסף ${name}`}
                          onClick={() => bumpQty(setSelectedPremiumPackageFruits, MAX_PREMIUM_PACKAGE_FRUITS, name, 1)}
                          disabled={disablePlus}
                        >
                          +
                        </button>
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
                disabled={totalSelected(selectedPremiumPackageFruits) === 0 || sheetState.status !== "ok"}
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
              {(() => {
                const addonUnits = totalSelected(selectedGoldAddons);
                const paidAddonCount = Math.max(0, addonUnits - GOLD_FREE_ADDONS);
                const paidAddonTotal = paidAddonCount * GOLD_ADDON_EXTRA_PRICE;
                const priceText = paidAddonTotal > 0 ? `${GOLD_PACKAGE_PRICE} ₪ + ${paidAddonTotal} ₪` : `${GOLD_PACKAGE_PRICE} ₪`;
                return (
                  <>
              <span>{MAX_GOLD_PACKAGE_FRUITS} סוגי פירות</span>
              <span>כל הרמות מהגיליון</span>
              <span>{priceText}</span>
              <span>
                {totalSelected(selectedGoldPackageFruits)}/{MAX_GOLD_PACKAGE_FRUITS} נבחרו
              </span>
                  </>
                );
              })()}
            </div>

            <div className="fruit-package-options" role="list" aria-label="בחירת פירות לחבילת גולד">
              {sheetState.status === "ok" &&
                poolGold.map((option) => {
                  const name = option.name.trim();
                  const qty = selectedGoldPackageFruits[name] ?? 0;
                  const sum = totalSelected(selectedGoldPackageFruits);
                  const disablePlus = sum >= MAX_GOLD_PACKAGE_FRUITS;
                  const showSpecial = isPremiumTierProduct(option);
                  return (
                    <label
                      key={name}
                      className={`fruit-package-option${qty > 0 ? " is-selected" : ""}${qty <= 0 && disablePlus ? " is-disabled" : ""}`}
                    >
                      <span className="fruit-package-option-name">
                        {name}
                        {showSpecial ? <span className="fruit-package-option-tag">מיוחד</span> : null}
                      </span>
                      <span className="price-menu-add-wrap" aria-label={`כמות ${name} בחבילה`}>
                        <button
                          type="button"
                          className="price-menu-qty-btn"
                          aria-label={`הפחת ${name}`}
                          onClick={() => bumpQty(setSelectedGoldPackageFruits, MAX_GOLD_PACKAGE_FRUITS, name, -1)}
                          disabled={qty <= 0}
                        >
                          −
                        </button>
                        <span className="price-menu-qty-badge" aria-label={`נבחרו: ${qty}`}>
                          {qty}
                        </span>
                        <button
                          type="button"
                          className="price-menu-qty-btn"
                          aria-label={`הוסף ${name}`}
                          onClick={() => bumpQty(setSelectedGoldPackageFruits, MAX_GOLD_PACKAGE_FRUITS, name, 1)}
                          disabled={disablePlus}
                        >
                          +
                        </button>
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
              <p className="muted small" style={{ margin: "0.35rem 0 0.65rem" }}>
                עד {GOLD_FREE_ADDONS} תוספות בחינם · מעבר לכך {GOLD_ADDON_EXTRA_PRICE}₪ לכל רוטב נוסף
              </p>
              <div className="fruit-package-addons">
                {GOLD_FRUIT_PACKAGE_ADDONS.map((addon) => {
                  const qty = selectedGoldAddons[addon] ?? 0;
                  return (
                    <div key={addon} className={`fruit-package-addon${qty > 0 ? " is-selected" : ""}`}>
                      <span>{addon}</span>
                      <span className="price-menu-add-wrap" aria-label={`כמות ${addon} בתוספות`}>
                        <button
                          type="button"
                          className="price-menu-qty-btn"
                          aria-label={`הפחת ${addon}`}
                          onClick={() => bumpQty(setSelectedGoldAddons, Number.POSITIVE_INFINITY, addon, -1)}
                          disabled={qty <= 0}
                        >
                          −
                        </button>
                        <span className="price-menu-qty-badge" aria-label={`נבחרו: ${qty}`}>
                          {qty}
                        </span>
                        <button
                          type="button"
                          className="price-menu-qty-btn"
                          aria-label={`הוסף ${addon}`}
                          onClick={() => bumpQty(setSelectedGoldAddons, Number.POSITIVE_INFINITY, addon, 1)}
                        >
                          +
                        </button>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="fruit-package-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={addGoldPackageToCart}
                disabled={totalSelected(selectedGoldPackageFruits) === 0 || sheetState.status !== "ok"}
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
              sheetType="פירות"
              listMeta={{
                title: "מחירון פירות",
              }}
              priceMenuEmbedClassName="price-menu-embed--premium-cards"
              showProductImages
              showImagesDisclaimer
              productImageOnlyPrefixes={[
                "אבטיח",
                "אבטיח חתוך",
                "אננס חתוך",
                "אננס קאפי",
                "מלון",
                "מלון כתום",
                "מלון חתוך",
                "קוקוס חתוך",
                "כדורי קוקוס",
                "פטל שחור רובי מארז",
                "פטל שחור בכר",
                "פטל אדום בהר מארז",
                "דובדבן אדום",
                "דובדבן הזהב אדום",
                "דובדבן לבן",
                "פומלה קלופה",
                "מנגו",
                "נקטרינה",
                "פאפאיה",
                "שזיף מיטלי",
                "קיווי צהוב",
                "קיווי ירוק",
                "גויאבה",
                "קלמנטינה",
                "קרמבולה",
                "קרמבולה פרימיום",
                "אפרסק לבן",
                "ענב ירוק ישראלי",
                "ענב אדום ישראלי",
                "תאנים",
                "תאנה",
                "מישמש",
                "דומדמניות",
                "תות פקיסטני",
                "אוכמניות כרמל בינוני",
                "אוכמניות כרמל גדול",
                "אוכמניות ישראלי",
                "אוכמניות פרו סקויה",
              ]}
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
            פירות חתוכים או בחירה מדויקת לעסק. אחרי מילוי הסל ההזמנה נסגרת בתיאום, כדי לוודא מלאי,
            בשלות ומועד משלוח לפני האריזה.
          </p>
        </div>
      </section>
    </div>
  );
}
