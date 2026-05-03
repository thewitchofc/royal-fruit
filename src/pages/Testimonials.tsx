import { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  GOOGLE_BUSINESS_GPAGE_URL,
  GOOGLE_BUSINESS_PAGE_CTA_LABEL,
  GOOGLE_REVIEW_CTA_HINT,
  GOOGLE_REVIEW_CTA_LABEL,
  GOOGLE_WRITE_REVIEW_URL,
} from "../lib/business";
import { TESTIMONIALS } from "../data/testimonials";
import { usePageSeo } from "../lib/seo";

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function Testimonials() {
  usePageSeo({
    title: "Royal Fruit | המלצות על פירות וירקות פרימיום",
    description: "לקוחות פרטיים ועסקיים מספרים על השירות, האיכות, הטריות והמשלוחים של Royal Fruit באזור המרכז וגוש דן.",
  });

  const testimonials = useMemo(() => shuffle(TESTIMONIALS), [TESTIMONIALS]);
  const [featuredTestimonial, ...restTestimonials] = testimonials;
  const googleReviewUrlDistinct = GOOGLE_WRITE_REVIEW_URL !== GOOGLE_BUSINESS_GPAGE_URL;

  return (
    <div className="page">
      <section className="page-hero testimonials-hero">
        <div className="container narrow">
          <p className="eyebrow">המלצות</p>
          <h1 className="page-title">לקוחות שמרגישים את ההבדל</h1>
          <p className="page-lead muted">
            חוות דעת מלקוחות פרטיים ועסקיים שבחרו בתוצרת טרייה, שירות אישי ואספקה מדויקת. רוצים להצטרף?{" "}
            <Link to="/contact" className="testimonials-inline-link">
              צרו קשר
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="container testimonials-premium-shell">
          <div className="testimonials-proof-card" aria-label="סיכום המלצות לקוחות">
            <div>
              <p className="testimonials-proof-kicker">Customer Notes</p>
              <h2>המלצות שמגיעות מהשטח</h2>
            </div>
            <div className="testimonials-proof-points">
              <span>לקוחות פרטיים</span>
              <span>אירועים ומטבחים</span>
              <span>שירות אישי</span>
            </div>
          </div>

          <div className="testimonials-google-bar" role="navigation" aria-label="Royal Fruit בגוגל">
            <a
              href={GOOGLE_BUSINESS_GPAGE_URL}
              className={
                googleReviewUrlDistinct
                  ? "testimonials-google-bar-link"
                  : "testimonials-google-bar-link testimonials-google-bar-link--accent"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {GOOGLE_BUSINESS_PAGE_CTA_LABEL}
            </a>
            {googleReviewUrlDistinct ? (
              <a
                href={GOOGLE_WRITE_REVIEW_URL}
                className="testimonials-google-bar-link testimonials-google-bar-link--accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                {GOOGLE_REVIEW_CTA_LABEL}
              </a>
            ) : null}
          </div>

          {featuredTestimonial ? (
            <article className="testimonial-card testimonial-card-featured">
              <div className="testimonial-stars" aria-label="דירוג מומלץ">
                <span aria-hidden>★★★★★</span>
              </div>
              <p className="testimonial-quote">{featuredTestimonial.quote}</p>
              <footer className="testimonial-meta">
                <span className="testimonial-author">{featuredTestimonial.author}</span>
                <span className="testimonial-role">{featuredTestimonial.role}</span>
              </footer>
            </article>
          ) : null}

          <ul className="testimonials-grid">
            {restTestimonials.map((t, index) => (
              <Fragment key={t.id}>
                <li>
                  <article className="testimonial-card">
                    <div className="testimonial-stars" aria-label="דירוג מומלץ">
                      <span aria-hidden>★★★★★</span>
                    </div>
                    <p className="testimonial-quote">{t.quote}</p>
                    <footer className="testimonial-meta">
                      <span className="testimonial-author">{t.author}</span>
                      <span className="testimonial-role">{t.role}</span>
                    </footer>
                  </article>
                </li>
                {index === 3 ? (
                  <li>
                    <div className="testimonials-review-inline" aria-label="ביקורות בגוגל">
                      <p>{GOOGLE_REVIEW_CTA_HINT}</p>
                      <div className="testimonials-review-inline-actions">
                        <a
                          href={GOOGLE_BUSINESS_GPAGE_URL}
                          className="testimonials-review-inline-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {GOOGLE_BUSINESS_PAGE_CTA_LABEL}
                        </a>
                        {googleReviewUrlDistinct ? (
                          <a
                            href={GOOGLE_WRITE_REVIEW_URL}
                            className="testimonials-review-inline-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {GOOGLE_REVIEW_CTA_LABEL}
                          </a>
                        ) : null}
                      </div>
                      <span className="testimonials-review-stars" aria-hidden>
                        ★★★★★
                      </span>
                    </div>
                  </li>
                ) : null}
              </Fragment>
            ))}
          </ul>
        </div>
      </section>

    </div>
  );
}
