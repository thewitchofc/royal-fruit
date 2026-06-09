import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Apple, Cherry, Circle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { PriceCategory } from "../data/priceList";
import { BUSINESS_CONTACT_FIRST_NAME, BUSINESS_PHONE, BUSINESS_PHONE_E164 } from "../lib/business";
import { PRICE_LIST_META, type PriceListBannerMeta } from "../data/priceList";
import { getCatalogProduceImages, getProduceShortDescription, hasDedicatedProduceImage } from "../data/priceList";
import { useCart } from "../context/CartContext";
import type { CartLineInput } from "../cart/types";
import type { PriceRow, PriceSubsection } from "../data/priceList";
import { estimateLineBreakdown, parseBundleDeal } from "../lib/cartEstimate";
import { formatDealLabelForDisplay, formatPriceLabelForDisplay, formatUnitWordsWithLamed } from "../lib/priceDisplay";
import { isKgPricingLabel } from "../lib/kgPricing";
import { formatPremiumCardPriceLine } from "../lib/premiumProductCardPrice";
import { getCatalogCardImageSources } from "../lib/catalogImage";

function makeRowId(catId: string, subKey: string, name: string) {
  return `${catId}::${subKey}::${name}`.replace(/\s+/g, " ").trim();
}

/** קטגוריית «מיוחדים», רוחב מוגבל */
function isSpecialsCategoryTitle(title: string) {
  return title.trim() === "מיוחדים";
}

/** מדור טעמי חלווה בגיליון (כמו halvaSheetCategorySortOrder bucket 0) — יחידה 350 גרם */
function isHalvaFlavorSheetCategory(title: string) {
  const t = title.trim().replace(/\s+/g, " ");
  return t === "חלווה בטעם" || (t.includes("חלווה") && t.includes("בטעם")) || t === "חלווה";
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
    .replace(/קוסברה/g, "כוסברה")
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
  if (matchesSearch(row.name, query)) return true;
  return (row.weightOptions ?? []).some((o) => matchesSearch(o.weight, query));
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

const PRODUCT_CARD_IMG_SIZE = 336;
const CAROUSEL_AUTO_MS = 4000;
const CAROUSEL_SWIPE_PX = 40;
const CARD_IMAGE_PRIORITY_BUDGET = 4;
const CARD_IMAGE_ROOT_MARGIN = "360px 0px";

function useNearViewport(loadImmediately: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(loadImmediately);

  useEffect(() => {
    if (near) return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: CARD_IMAGE_ROOT_MARGIN },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [near]);

  return { ref, near };
}

function ProductCardImage({
  src,
  priority = false,
}: {
  src: string;
  priority?: boolean;
}) {
  const { ref, near } = useNearViewport(priority);
  const { png, webp } = getCatalogCardImageSources(src);

  return (
    <div ref={ref} className="price-menu-card-img-frame">
      {near ? (
        <picture className="price-menu-card-img-picture">
          {webp ? <source srcSet={webp} type="image/webp" /> : null}
          <img
            src={png}
            alt=""
            className="price-menu-card-img"
            width={PRODUCT_CARD_IMG_SIZE}
            height={PRODUCT_CARD_IMG_SIZE}
            sizes="(max-width: 960px) 42vw, 168px"
            decoding="async"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            draggable={false}
          />
        </picture>
      ) : (
        <div className="price-menu-card-img-placeholder" aria-hidden />
      )}
    </div>
  );
}

/** כרטיס מוצר — קרוסלה לפי מספר התמונות במוצר; תמונה בודדת בלי קרוסלה */
function ProductCardCarousel({
  images,
  productName,
  priority = false,
}: {
  images: readonly string[];
  productName: string;
  priority?: boolean;
}) {
  const slides = images;
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(slides.length > 1);
  const [slideStepPx, setSlideStepPx] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const didSwipe = useRef(false);
  const imagesKey = images.join("|");
  const multi = slides.length > 1;
  const shouldLoadSlide = (i: number) => {
    if (!multi) return true;
    const next = (index + 1) % slides.length;
    return i === index || i === next;
  };

  useEffect(() => {
    setIndex(0);
    setAutoPlay(slides.length > 1);
  }, [imagesKey, slides.length]);

  const goTo = useCallback(
    (next: number) => {
      const len = slides.length;
      if (len < 2) return;
      setIndex(((next % len) + len) % len);
    },
    [slides.length],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const stopAuto = useCallback(() => setAutoPlay(false), []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node || !multi) {
      setSlideStepPx(0);
      return;
    }
    const measure = () => setSlideStepPx(node.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [multi, slides.length, imagesKey]);

  useEffect(() => {
    if (!multi || !autoPlay) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, CAROUSEL_AUTO_MS);
    return () => window.clearInterval(id);
  }, [multi, autoPlay, slides.length]);

  if (images.length === 0) return null;

  if (!multi) {
    const src = slides[0];
    if (!src) return null;
    return <ProductCardImage src={src} priority={priority} />;
  }

  return (
    <div
      className="price-menu-card-carousel"
      onClick={() => {
        if (didSwipe.current) {
          didSwipe.current = false;
          return;
        }
        stopAuto();
        goNext();
      }}
      onTouchStart={(e) => {
        stopAuto();
        touchStartX.current = e.touches[0]?.clientX ?? 0;
        touchDeltaX.current = 0;
        didSwipe.current = false;
      }}
      onTouchMove={(e) => {
        touchDeltaX.current = (e.touches[0]?.clientX ?? 0) - touchStartX.current;
      }}
      onTouchEnd={() => {
        const dx = touchDeltaX.current;
        if (dx > CAROUSEL_SWIPE_PX) {
          didSwipe.current = true;
          goPrev();
        } else if (dx < -CAROUSEL_SWIPE_PX) {
          didSwipe.current = true;
          goNext();
        }
        touchDeltaX.current = 0;
      }}
      onPointerDown={stopAuto}
      role="group"
      aria-roledescription="carousel"
      aria-label={`תמונות ${productName}`}
    >
      <div ref={viewportRef} className="price-menu-card-carousel-viewport">
        <div
          className="price-menu-card-carousel-track"
          style={{
            transform:
              slideStepPx > 0
                ? `translate3d(-${index * slideStepPx}px, 0, 0)`
                : `translate3d(-${index * 100}%, 0, 0)`,
          }}
        >
          {slides.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="price-menu-card-carousel-slide"
              aria-hidden={i !== index}
            >
              {shouldLoadSlide(i) ? (
                <ProductCardImage src={src} priority={priority && i === index} />
              ) : (
                <div className="price-menu-card-img-placeholder" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="price-menu-card-carousel-dots" aria-hidden>
        {slides.map((_, i) => (
          <span key={i} className={`price-menu-card-carousel-dot${i === index ? " is-active" : ""}`} />
        ))}
      </div>
    </div>
  );
}

function PriceWeightRowView({
  row,
  catId,
  categoryPath,
  showEmojis,
  productCardLayout,
  showProductImages = true,
  imageLoadPriority = false,
}: {
  row: PriceRow;
  catId: string;
  categoryPath: string;
  showEmojis: boolean;
  productCardLayout?: boolean;
  showProductImages?: boolean;
  imageLoadPriority?: boolean;
}) {
  const options = row.weightOptions ?? [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const safeIdx = options.length > 0 ? Math.min(selectedIdx, options.length - 1) : 0;
  const selected = options[safeIdx];
  const { addItem, lines, setQty } = useCart();
  const description = row.description ?? getProduceShortDescription(row.name);
  const mayShowImage =
    showProductImages && hasDedicatedProduceImage(row.name, description, categoryPath);
  const images = mayShowImage ? getCatalogProduceImages(row.name, description, categoryPath) : [];
  const displayName = selected ? `${row.name} · ${selected.weight}` : row.name;
  const item: CartLineInput = {
    id: makeRowId(catId, "_", displayName),
    emoji: row.emoji,
    name: displayName,
    priceLabel: selected ? formatPriceLabelForDisplay(selected.price) : "לפי המחירון",
    unit: formatUnitWordsWithLamed("לפריט"),
    categoryPath,
    qtyStep: 1,
    deal: row.deal?.trim() ? formatDealLabelForDisplay(row.deal) : undefined,
  };
  const inCartQty = lines.find((l) => l.id === item.id)?.qty ?? 0;
  const step = item.qtyStep ?? 1;
  const dealLabel = item.deal?.trim();

  const qtyBlock = (
    <div className={productCardLayout ? "price-menu-card-actions" : "price-menu-add-wrap"}>
      <button
        type="button"
        className="price-menu-qty-btn"
        aria-label={`הפחת כמות ${displayName}`}
        onClick={() => setQty(item.id, inCartQty - step)}
        disabled={!selected || inCartQty < step / 2}
      >
        −
      </button>
      <span className="price-menu-qty-badge" aria-label={`בסל: ${formatQty(inCartQty)}`}>
        {formatQty(inCartQty)}
      </span>
      <button
        type="button"
        className="price-menu-qty-btn"
        aria-label={`הוסף כמות ${displayName}`}
        onClick={() => {
          if (!selected) return;
          if (inCartQty <= 0) {
            addItem(item);
            return;
          }
          setQty(item.id, inCartQty + step);
        }}
        disabled={!selected}
      >
        +
      </button>
    </div>
  );

  if (!productCardLayout) {
    return (
      <li className="price-menu-row price-menu-row--weight-options">
        <span className="price-menu-name-wrap">
          <span className="price-menu-name">{row.name}</span>
        </span>
        <div className="price-menu-weight-options" role="group" aria-label={`בחירת משקל ל${row.name}`}>
          {options.map((opt, i) => (
            <button
              key={opt.weight}
              type="button"
              className={`price-menu-weight-option${i === safeIdx ? " is-active" : ""}`}
              aria-pressed={i === safeIdx}
              onClick={() => setSelectedIdx(i)}
            >
              <span>{opt.weight}</span>
              <span>{formatPriceLabelForDisplay(opt.price)}</span>
            </button>
          ))}
        </div>
        {qtyBlock}
      </li>
    );
  }

  return (
    <li className="price-menu-row price-menu-row--product-card price-menu-row--weight-product">
      <div className="price-menu-card-media">
        {images.length > 0 ? (
          <ProductCardCarousel images={images} productName={row.name} priority={imageLoadPriority} />
        ) : (
          <div className="price-menu-card-img-placeholder" aria-hidden />
        )}
      </div>
      <div className="price-menu-card-footer">
        <span className="price-menu-card-name">{row.name}</span>
        <div className="price-menu-weight-options" role="group" aria-label={`בחירת משקל ל${row.name}`}>
          {options.map((opt, i) => (
            <button
              key={opt.weight}
              type="button"
              className={`price-menu-weight-option${i === safeIdx ? " is-active" : ""}`}
              aria-pressed={i === safeIdx}
              onClick={() => setSelectedIdx(i)}
            >
              <span className="price-menu-weight-option-weight">{opt.weight}</span>
              <span className="price-menu-weight-option-price">{formatPriceLabelForDisplay(opt.price)}</span>
            </button>
          ))}
        </div>
        {selected ? (
          <span className="price-menu-card-price-line">
            {formatPremiumCardPriceLine(formatPriceLabelForDisplay(selected.price), item.unit)}
          </span>
        ) : null}
        {dealLabel ? <span className="price-menu-deal">{dealLabel}</span> : null}
        {qtyBlock}
      </div>
    </li>
  );
}

function PriceRowView({
  item,
  description,
  showEmojis,
  productCardLayout,
  showProductImages = true,
  imageLoadPriority = false,
}: {
  item: CartLineInput;
  description: string;
  showEmojis: boolean;
  productCardLayout?: boolean;
  /** תמונות מוצר מהקטלוג — רק בדף חלווה; בשאר המחירונים false */
  showProductImages?: boolean;
  imageLoadPriority?: boolean;
}) {
  const { addItem, lines, setQty } = useCart();
  const inCartQty = lines.find((l) => l.id === item.id)?.qty ?? 0;
  const step = item.qtyStep ?? 1;
  const mayShowImage =
    showProductImages && hasDedicatedProduceImage(item.name, description, item.categoryPath);
  const images = mayShowImage ? getCatalogProduceImages(item.name, description, item.categoryPath) : [];
  const thumb = images[0];
  const showLeft = images.length > 0 || showEmojis;
  const dealLabel = item.deal?.trim();
  const bundleDeal = parseBundleDeal(item.deal);
  const inCartEstimate =
    inCartQty > 0 ? estimateLineBreakdown({ ...item, qty: inCartQty }) : null;
  const dealHint =
    bundleDeal && inCartQty > 0 && inCartQty % bundleDeal.bundleQty !== 0
      ? `עוד ${formatQty(bundleDeal.bundleQty - (inCartQty % bundleDeal.bundleQty))} למבצע`
      : null;

  const qtyBlock = (
    <div className={productCardLayout ? "price-menu-card-actions" : "price-menu-add-wrap"}>
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
  );

  const cartSubtotalBlock =
    inCartEstimate?.total !== null && inCartQty > 0 ? (
      <span className="price-menu-cart-subtotal">
        {inCartEstimate.bundleCount > 0
          ? `בסל: ~${Math.round(inCartEstimate.total).toLocaleString("he-IL")} ₪ (כולל מבצע)`
          : `בסל: ~${Math.round(inCartEstimate.total).toLocaleString("he-IL")} ₪`}
      </span>
    ) : null;

  if (productCardLayout) {
    return (
      <li className="price-menu-row price-menu-row--product-card">
        <div className="price-menu-card-media">
          {images.length > 0 ? (
            <ProductCardCarousel images={images} productName={item.name} priority={imageLoadPriority} />
          ) : (
            <div className="price-menu-card-img-placeholder" aria-hidden />
          )}
        </div>
        <div className="price-menu-card-footer">
          <span className="price-menu-card-name">{item.name}</span>
          <span className="price-menu-card-price-line">{formatPremiumCardPriceLine(item.priceLabel, item.unit)}</span>
          {dealLabel ? <span className="price-menu-deal">{dealLabel}</span> : null}
          {dealHint ? <span className="price-menu-deal-hint">{dealHint}</span> : null}
          {cartSubtotalBlock}
          {qtyBlock}
        </div>
      </li>
    );
  }

  return (
    <li className={`price-menu-row${showLeft ? "" : " no-emoji"}${thumb ? " price-menu-row--with-thumb" : ""}`}>
      {thumb ? (
        <span className="price-menu-emoji price-menu-emoji--thumb" aria-hidden>
          <img src={thumb} alt="" className="price-menu-thumb" width={36} height={36} loading="lazy" decoding="async" />
        </span>
      ) : showEmojis ? (
        <span className="price-menu-emoji" aria-hidden>
          <ProduceIcon symbol={item.emoji} />
        </span>
      ) : null}
      <span className="price-menu-name-wrap">
        <span className="price-menu-name">{item.name}</span>
        <span className="price-menu-desc">{description}</span>
      </span>
      {qtyBlock}
      <span className="price-menu-price">
        <span className="price-menu-price-main">{item.priceLabel}</span>
        {item.unit?.trim() ? (
          <span className="price-menu-unit">{item.unit.trim()}</span>
        ) : null}
        {dealLabel ? <span className="price-menu-deal">{dealLabel}</span> : null}
      </span>
    </li>
  );
}

function ProduceIcon({ symbol }: { symbol: string }) {
  if (symbol === "⭐") return <Star size={18} className="price-menu-icon price-menu-icon--primary" />;
  if (symbol === "veg" || symbol === "🥬" || symbol === "🥑" || symbol === "🥒" || symbol === "🥕" || symbol === "🌽" || symbol === "🧅" || symbol === "🍅") {
    return <Circle size={14} className="price-menu-icon price-menu-icon--primary" />;
  }
  if (symbol === "juice" || symbol === "🧃" || symbol === "🍲") return <Circle size={14} className="price-menu-icon price-menu-icon--primary" />;
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
  /** מחלקה נוספת על שורש המחירון (למשל ערכת צבעים לדף חלווה) */
  embedClassName?: string;
  searchFieldLabel?: string;
  searchFieldPlaceholder?: string;
  /** כרטיס מוצר מינימלי (תמונה גדולה, בלי תיאור) — ברירת מחדל לפי מחלקת embed ב־embedClassName */
  productCardLayout?: boolean;
  /** תמונות מוצר — false בפירות/ירקות/מיצים/מטבח; true בחלווה */
  showProductImages?: boolean;
  /** טקסט “התמונות להמחשה בלבד” — לשליטה ברמת עמוד (כדי שיופיע פעם אחת) */
  showImagesDisclaimer?: boolean;
  /** false = בלי שורת חיפוש (לדפים עם מעט פריטים שכבר מוצגים למעלה) */
  showSearch?: boolean;
};

const PREMIUM_PRODUCT_CARD_EMBED = "price-menu-embed--premium-cards";

const DEFAULT_SEARCH_LABEL = "חיפוש מהיר בדוכן";
const DEFAULT_SEARCH_PLACEHOLDER = "חיפוש מהיר בכל המחירון — לדוגמה: ענבים, אבוקדו, בקבוק…";

export function PriceListSections({
  categories,
  emojiStrip,
  showEmojis = true,
  listMeta,
  categoryHeadingRank = 2,
  searchFieldIdPrefix = "price-menu",
  embedClassName,
  searchFieldLabel = DEFAULT_SEARCH_LABEL,
  searchFieldPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
  productCardLayout: productCardLayoutProp,
  showProductImages = true,
  showImagesDisclaimer = false,
  showSearch = true,
}: Props) {
  const productCardLayout =
    productCardLayoutProp ??
    Boolean(
      embedClassName?.includes("price-menu-embed--halva-sweets") ||
        embedClassName?.includes(PREMIUM_PRODUCT_CARD_EMBED),
    );
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
    <div className={["price-menu-embed", embedClassName].filter(Boolean).join(" ")}>
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

      {showSearch ? (
        <div className="price-menu-search price-menu-search--global">
          <label htmlFor={`${searchFieldIdPrefix}-search`}>
            <span className="price-menu-search-label">{searchFieldLabel}</span>
            <input
              id={`${searchFieldIdPrefix}-search`}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchFieldPlaceholder}
              autoComplete="off"
            />
          </label>
        </div>
      ) : null}

      <div className="price-menu-categories-grid">
        {(() => {
          let imagePriorityBudget = CARD_IMAGE_PRIORITY_BUDGET;
          const takeImagePriority = (name: string) => {
            if (!productCardLayout || !showProductImages || !hasDedicatedProduceImage(name)) {
              return false;
            }
            if (imagePriorityBudget <= 0) return false;
            imagePriorityBudget -= 1;
            return true;
          };

          return filteredCategories.map((cat) => {
          const singleWeightProduct =
            cat.rows?.length === 1 && (cat.rows[0]?.weightOptions?.length ?? 0) > 1;
          return (
          <article
            key={cat.id}
            className={`price-menu-category${isSpecialsCategoryTitle(cat.title) ? " price-menu-category--specials" : ""}${singleWeightProduct ? " price-menu-category--weight-product" : ""}`}
          >
            {!singleWeightProduct ? (
            <header className="price-menu-category-head">
              {showEmojis ? (
                <span className="price-menu-cat-emoji" aria-hidden>
                  <ProduceIcon symbol={cat.emoji} />
                </span>
              ) : null}
              <CategoryHeadingTag className="price-menu-cat-title">{cat.title}</CategoryHeadingTag>
            </header>
            ) : null}
            {cat.intro ? <p className="price-menu-intro muted">{cat.intro}</p> : null}

            {cat.rows?.length ? (
              <ul className="price-menu-list">
                {cat.rows.map((row) => {
                  if (row.weightOptions?.length) {
                    return (
                      <PriceWeightRowView
                        key={`${cat.id}-${row.name}`}
                        row={row}
                        catId={cat.id}
                        categoryPath={cat.title}
                        showEmojis={showEmojis}
                        productCardLayout={productCardLayout}
                        showProductImages={showProductImages}
                        imageLoadPriority={takeImagePriority(row.name)}
                      />
                    );
                  }
                  const priceDisplay = row.price ?? "לפי המחירון";
                  const kgLabel = rowPricingTextForKg(row, priceDisplay);
                  const halvaEmbed = embedClassName?.includes("price-menu-embed--halva-sweets") ?? false;
                  const unitFromSheet = row.unit?.trim();
                  const unitDefaultHalva =
                    halvaEmbed && isHalvaFlavorSheetCategory(cat.title) && !unitFromSheet ? "350 גרם" : unitFromSheet;
                  const item: CartLineInput = {
                    id: makeRowId(cat.id, "_", row.name),
                    emoji: row.emoji,
                    name: row.name,
                    priceLabel: formatPriceLabelForDisplay(row.price ?? priceDisplay),
                    unit: unitDefaultHalva ? formatUnitWordsWithLamed(unitDefaultHalva) : undefined,
                    deal: row.deal?.trim() ? formatDealLabelForDisplay(row.deal) : undefined,
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
                      productCardLayout={productCardLayout}
                      showProductImages={showProductImages}
                      imageLoadPriority={takeImagePriority(row.name)}
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
                      const halvaEmbed = embedClassName?.includes("price-menu-embed--halva-sweets") ?? false;
                      const unitFromSheet = row.unit?.trim();
                      const halvaFlavorSection =
                        isHalvaFlavorSheetCategory(cat.title) || isHalvaFlavorSheetCategory(sub.title);
                      const unitDefaultHalva =
                        halvaEmbed && halvaFlavorSection && !unitFromSheet ? "350 גרם" : unitFromSheet;
                      const item: CartLineInput = {
                        id: makeRowId(cat.id, subKey, row.name),
                        emoji: row.emoji,
                        name: row.name,
                        priceLabel: formatPriceLabelForDisplay(row.price ?? priceDisplay),
                        unit: unitDefaultHalva ? formatUnitWordsWithLamed(unitDefaultHalva) : undefined,
                        deal: row.deal?.trim() ? formatDealLabelForDisplay(row.deal) : undefined,
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
                          productCardLayout={productCardLayout}
                          showProductImages={showProductImages}
                          imageLoadPriority={takeImagePriority(row.name)}
                        />
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </article>
          );
        });
        })()}
      </div>
      {filteredCategories.length === 0 ? (
        <p className="price-menu-no-results muted">לא נמצאו תוצאות לחיפוש הזה. נסו מילה אחרת.</p>
      ) : null}

      {showImagesDisclaimer ? <p className="price-menu-images-disclaimer muted">התמונות להמחשה בלבד.</p> : null}

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
