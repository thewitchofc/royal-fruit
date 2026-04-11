import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
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
    title: "Royal Fruit | המלצות לקוחות",
    description: "לקוחות פרטיים ועסקיים מספרים על השירות, האיכות והטריות של Royal Fruit.",
  });

  const testimonials = useMemo(() => shuffle(TESTIMONIALS), [TESTIMONIALS]);

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">המלצות</p>
          <h1 className="page-title">מה אומרים מי שעובדים איתנו</h1>
          <p className="page-lead muted">
            חוות דעת מלקוחות במטבחים, באירועים ובבתים שבחרו באספקה פרימיום. רוצים להצטרף?{" "}
            <Link to="/contact" className="testimonials-inline-link">
              צרו קשר
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="container">
          <ul className="testimonials-grid">
            {testimonials.map((t) => (
              <li key={t.id}>
                <article className="testimonial-card">
                  <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="testimonial-meta">
                    <span className="testimonial-author">{t.author}</span>
                    <span className="testimonial-role">{t.role}</span>
                  </footer>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-tint testimonials-google-section" aria-label="ביקורת בגוגל">
        <div className="container narrow testimonials-google-inner">
          <p className="google-review-cta-hint">{GOOGLE_REVIEW_CTA_HINT}</p>
          <a
            href={GOOGLE_WRITE_REVIEW_URL}
            className="btn btn-ghost testimonials-google-review-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            {GOOGLE_REVIEW_CTA_LABEL}
          </a>
        </div>
      </section>
    </div>
  );
}
