import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { GALLERY_PARTNER_NAMES, GALLERY_STOCK_IMAGES, PLATTER_SHOWCASE_IMAGES, galleryImageAlt } from "../data/platterShowcaseImages";
import { usePageSeo } from "../lib/seo";

const galleryImages = [
  ...PLATTER_SHOWCASE_IMAGES.map((x) => x.file),
  ...GALLERY_STOCK_IMAGES.map((x) => x.file),
  "fruit-gallery-01.webp",
  "fruit-gallery-02.webp",
  "fruit-gallery-03.webp",
  "fruit-gallery-04.webp",
  "fruit-gallery-05.webp",
  "fruit-gallery-06.webp",
  "fruit-gallery-07.webp",
  "fruit-gallery-08.webp",
  "fruit-gallery-09.webp",
  "fruit-gallery-10.webp",
  "fruit-gallery-11.webp",
  "fruit-gallery-12.webp",
  "fruit-gallery-13.webp",
];

const SWIPE_MIN_PX = 56;
const SWIPE_DOMINANCE = 1.15;
/** מעל הסף — לא נסגרים מ«קליק» על הרקע (מונע יציאה אחרי החלקה אנכית/צידית על התמונה) */
const LIGHTBOX_TAP_MAX_MOVE_PX = 26;

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipePointerIdRef = useRef<number | null>(null);
  const lightboxMoveStartRef = useRef<{ x: number; y: number } | null>(null);
  const lightboxHadPointerGestureRef = useRef(false);
  const activeImage = activeIndex === null ? null : galleryImages[activeIndex];
  const lastIndex = galleryImages.length - 1;

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? 0 : i >= lastIndex ? 0 : i + 1));
  }, [lastIndex]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? 0 : i <= 0 ? lastIndex : i - 1));
  }, [lastIndex]);

  const onSwipePointerDown = useCallback((e: React.PointerEvent) => {
    if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
    swipePointerIdRef.current = e.pointerId;
  }, []);

  const onSwipePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerId !== swipePointerIdRef.current) return;
      swipePointerIdRef.current = null;
      const start = swipeStartRef.current;
      swipeStartRef.current = null;
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.abs(dx) < SWIPE_MIN_PX) return;
      if (Math.abs(dx) < Math.abs(dy) * SWIPE_DOMINANCE) return;
      if (dx < 0) goNext();
      else goPrev();
    },
    [goNext, goPrev],
  );

  const onSwipePointerCancel = useCallback(() => {
    swipeStartRef.current = null;
    swipePointerIdRef.current = null;
  }, []);

  const onLightboxPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
    lightboxMoveStartRef.current = { x: e.clientX, y: e.clientY };
    lightboxHadPointerGestureRef.current = false;
  }, []);

  const onLightboxPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const start = lightboxMoveStartRef.current;
    if (!start || !e.isPrimary) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (dx * dx + dy * dy > LIGHTBOX_TAP_MAX_MOVE_PX * LIGHTBOX_TAP_MAX_MOVE_PX) {
      lightboxHadPointerGestureRef.current = true;
    }
  }, []);

  const onLightboxPointerEnd = useCallback(() => {
    lightboxMoveStartRef.current = null;
  }, []);

  const onLightboxBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (lightboxHadPointerGestureRef.current) {
      lightboxHadPointerGestureRef.current = false;
      return;
    }
    setActiveIndex(null);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIndex((i) => (i === null ? 0 : i >= lastIndex ? 0 : i + 1));
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIndex((i) => (i === null ? 0 : i <= 0 ? lastIndex : i - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex, lastIndex]);

  useEffect(() => {
    if (activeIndex === null) return;
    closeButtonRef.current?.focus();
  }, [activeIndex]);

  usePageSeo({
    title: "Royal Fruit | גלריה",
    description: "גלריית תמונות של תוצרת טרייה, מארזים ומגשי פירות של Royal Fruit.",
  });

  return (
    <div className="page">
      <section className="page-hero gallery-hero">
        <div className="container narrow">
          <p className="eyebrow">גלריה</p>
          <h1 className="page-title">תוצרת שנראית כמו שהיא מרגישה</h1>
          <p className="page-lead muted">מבט קרוב על פירות, ירקות, מארזים ומגשים שנבחרים בקפדנות ונארזים נקי.</p>
        </div>
      </section>

      <section className="section gallery-section">
        <div className="container gallery-premium-shell">
          <div className="gallery-intro-card" aria-label="אופי הגלריה">
            <div>
              <RoyalFruitWordmark className="gallery-intro-wordmark" />
              <h2>צבע, טריות ודיוק בהגשה.</h2>
            </div>
            <div className="gallery-intro-points">
              <span>תוצרת עונתית</span>
              <span>מגשי פרימיום</span>
              <span>אריזה נקייה</span>
            </div>
            <p className="gallery-tap-hint">
              לחיצה על תמונה פותחת אותה במסך מלא — החליקו ימינה או שמאלה כדי לעבור בין תמונות.
            </p>
          </div>

          <div className="gallery-grid">
            {galleryImages.map((filename, index) => (
              <figure key={filename} className="gallery-card">
                <button
                  type="button"
                  className="gallery-open-btn"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`פתח תמונה ${index + 1} בגדול`}
                >
                  <img
                    src={`/images/gallery/${filename}`}
                    alt={galleryImageAlt(filename, index)}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={1000}
                  />
                </button>
              </figure>
            ))}
          </div>
          <footer className="gallery-partners-footer">
            <p className="gallery-partners-title">שותפים ומותגים מהגלריה</p>
            <p className="gallery-partners-strip" aria-label={`שותפים ומותגים: ${GALLERY_PARTNER_NAMES.join(", ")}`}>
              {GALLERY_PARTNER_NAMES.map((name, i) => (
                <span key={name}>
                  {i > 0 ? (
                    <span className="gallery-partners-sep" aria-hidden="true">
                      {" "}
                      •{" "}
                    </span>
                  ) : null}
                  {name}
                </span>
              ))}
            </p>
          </footer>
        </div>
      </section>
      {/* פורטל ל־body: אחרת ב־Safari/iOS ‎position:fixed‎ נשבר כשיש אב עם ‎transform‎ (‎.page-transition-shell‎) */}
      {activeImage !== null && activeIndex !== null
        ? createPortal(
            <div
              className="gallery-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`תמונה ${activeIndex + 1} מתוך ${galleryImages.length}. החלקה ימינה או שמאלה למעבר בין תמונות; Escape לסגירה.`}
              onPointerDown={onLightboxPointerDown}
              onPointerMove={onLightboxPointerMove}
              onPointerUp={onLightboxPointerEnd}
              onPointerCancel={onLightboxPointerEnd}
              onClick={onLightboxBackdropClick}
            >
              <button
                ref={closeButtonRef}
                type="button"
                className="gallery-lightbox-close"
                onClick={() => setActiveIndex(null)}
                aria-label="סגור תמונה מוגדלת"
              >
                ×
              </button>
              <p className="gallery-lightbox-counter" aria-live="polite">
                {activeIndex + 1} / {galleryImages.length}
              </p>
              <div
                className="gallery-lightbox-stage"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={onSwipePointerDown}
                onPointerUp={onSwipePointerUp}
                onPointerCancel={onSwipePointerCancel}
                role="presentation"
              >
                <img
                  className="gallery-lightbox-img"
                  src={`/images/gallery/${activeImage}`}
                  alt={galleryImageAlt(activeImage, activeIndex)}
                  loading="eager"
                  decoding="async"
                  width={800}
                  height={1000}
                  draggable={false}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
