import { useEffect, useState } from "react";
import { GALLERY_PARTNER_NAMES, GALLERY_STOCK_IMAGES, PLATTER_SHOWCASE_IMAGES, galleryImageAlt } from "../data/platterShowcaseImages";
import { usePageSeo } from "../lib/seo";

const galleryImages = [
  ...PLATTER_SHOWCASE_IMAGES.map((x) => x.file),
  ...GALLERY_STOCK_IMAGES.map((x) => x.file),
  "IMG_2608-53026900-aa5e-4602-a247-ad3f470d7e6d.png",
  "IMG_2609-514de247-6daa-49ba-b011-65ba70684225.png",
  "IMG_2607-b2af0579-cd03-4488-b547-2ccac78bf75d.png",
  "IMG_2610-ad25b3dd-f247-4ee6-bc88-7162c5c83c49.png",
  "IMG_2603-409fcb77-3e6a-4f4c-a3f7-c3d4869b2dfb.png",
  "IMG_2606-1933002d-d2c0-40ff-9b3a-a534be38379a.png",
  "IMG_2612-26a089a4-ab56-49ce-90c5-e82be84a890c.png",
  "IMG_2611-c16d4eaf-1d72-48e9-b2bd-8e3dfc269ef3.png",
  "IMG_2613-b22168fe-a74f-47c7-a141-258eb18e1737.png",
  "IMG_2602-da8edb59-5f0b-4845-b367-0e75e11e39c8.png",
  "IMG_2605-03a6346f-9767-4e4e-8ed9-8a8d323f7d9a.png",
  "IMG_2604-0929cfb4-6197-4e05-aac2-290b2725fc5e.png",
  "IMG_2601-de42e3c4-45fd-4e56-959c-bf26809ee075.png",
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
                  <img src={`/gallery/${filename}`} alt={galleryImageAlt(filename, index)} loading="lazy" decoding="async" />
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
            src={`/gallery/${activeImage}`}
            alt={galleryImageAlt(activeImage, activeIndex)}
            loading="lazy"
            decoding="async"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
