import { useState } from "react";
import { Link } from "react-router-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { FAQ_SECTION_LABELS, FAQ_SECTION_ORDER, faqItemsBySection } from "../data/faq";
import { usePageSeo } from "../lib/seo";

export function Faq() {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  usePageSeo({
    title: "Royal Fruit | שאלות נפוצות",
    description: "תשובות מהירות על הזמנות, משלוחים, איכות פרימיום ושירות.",
  });

  return (
    <div className="page">
      <section className="page-hero faq-hero">
        <div className="container narrow">
          <p className="eyebrow">שאלות נפוצות</p>
          <h1 className="page-title">שאלות נפוצות לפני הזמנה</h1>
          <p className="page-lead muted">
            תשובות קצרות על הזמנות, משלוחים, איסוף ואיכות. לשאלה נוספת אפשר להתקשר לאורי ב־
            <a href="tel:0505113009" className="faq-inline-tel">
              050-5113009
            </a>
            .
          </p>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container narrow-block faq-premium-panel">
          <div className="faq-service-card" aria-label="עקרונות השירות של Royal Fruit">
            <div>
              <p className="faq-service-kicker">Premium Service Desk</p>
              <h2>מענה אישי להזמנות, איסוף ומשלוחים.</h2>
            </div>
            <div className="faq-service-points">
              <span>מענה אישי</span>
              <span>תיאום משלוח</span>
              <span>איכות פרימיום</span>
            </div>
            <Link to="/contact" className="btn btn-primary faq-service-cta">
              פנייה לאורי
            </Link>
          </div>

          {FAQ_SECTION_ORDER.map((sectionId) => {
            const items = faqItemsBySection(sectionId);
            if (!items.length) return null;
            return (
              <div key={sectionId} className="faq-section-group">
                <div className="faq-section-head">
                  <RoyalFruitWordmark className="faq-section-wordmark" />
                  <h2 className="faq-section-heading">{FAQ_SECTION_LABELS[sectionId]}</h2>
                </div>
                <div className="faq-list">
                  {items.map((item) => {
                    const isOpen = openItemId === item.id;
                    const answerId = `faq-answer-${item.id}`;
                    return (
                      <article key={item.id} className="faq-item" data-open={isOpen ? "true" : undefined}>
                        <button
                          type="button"
                          className="faq-summary"
                          aria-expanded={isOpen}
                          aria-controls={answerId}
                          onClick={() => setOpenItemId((current) => (current === item.id ? null : item.id))}
                        >
                          {item.question}
                        </button>
                        <div id={answerId} className="faq-answer-shell" aria-hidden={!isOpen}>
                          <div className="faq-answer">
                            <p>{item.answer}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
