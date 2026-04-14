import { useEffect, useState } from "react";
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

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? null : galleryImages[activeIndex];
  const lastIndex = galleryImages.length - 1;

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

  usePageSeo({
    title: "Royal Fruit | גלריה",
    description: "גלריית תמונות של תוצרת טרייה, מארזים ומגשי פירות של Royal Fruit.",
  });

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">גלריה</p>
          <h1 className="page-title">תמונות מהשטח ומהמקררים</h1>
          <p className="page-lead muted">מבחר רגעים של טריות, אריזות פרימיום ומוצרים שמגיעים אליכם הכי יפה שיש.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
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
      {activeImage !== null && activeIndex !== null ? (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="תמונה מוגדלת" onClick={() => setActiveIndex(null)}>
          <button type="button" className="gallery-lightbox-close" onClick={() => setActiveIndex(null)} aria-label="סגור תמונה">
            ×
          </button>
          <button
            type="button"
            className="gallery-lightbox-nav gallery-lightbox-nav-prev"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i === null ? 0 : i <= 0 ? lastIndex : i - 1));
            }}
            aria-label="תמונה קודמת"
          >
            ‹
          </button>
          <button
            type="button"
            className="gallery-lightbox-nav gallery-lightbox-nav-next"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i === null ? 0 : i >= lastIndex ? 0 : i + 1));
            }}
            aria-label="תמונה הבאה"
          >
            ›
          </button>
          <p className="gallery-lightbox-counter" aria-live="polite">
            {activeIndex + 1} / {galleryImages.length}
          </p>
          <img
            className="gallery-lightbox-img"
            src={`/images/gallery/${activeImage}`}
            alt={galleryImageAlt(activeImage, activeIndex)}
            loading="lazy"
            decoding="async"
            width={800}
            height={1000}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
