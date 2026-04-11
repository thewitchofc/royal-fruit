import { Link } from "react-router-dom";
import { FAQ_SECTION_LABELS, FAQ_SECTION_ORDER, faqItemsBySection } from "../data/faq";
import { usePageSeo } from "../lib/seo";

export function Faq() {
  usePageSeo({
    title: "Royal Fruit | שאלות נפוצות",
    description: "תשובות מהירות על הזמנות, משלוחים, איכות פרימיום ושירות.",
  });

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">שאלות נפוצות</p>
          <h1 className="page-title">תשובות קצרות לשאלות שחוזרות</h1>
          <p className="page-lead muted">
            אם לא מצאתם מה שחיפשתם, תמיד אפשר להתקשר ל־
            <a href="tel:0505113009" className="faq-inline-tel">
              050-5113009
            </a>{" "}
            (אורי) או לכתוב ב־
            <Link to="/contact" className="faq-inline-link">
              יצירת קשר
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container narrow-block">
          {FAQ_SECTION_ORDER.map((sectionId) => {
            const items = faqItemsBySection(sectionId);
            if (!items.length) return null;
            return (
              <div key={sectionId} className="faq-section-group">
                <h2 className="faq-section-heading">{FAQ_SECTION_LABELS[sectionId]}</h2>
                <div className="faq-list">
                  {items.map((item) => (
                    <details key={item.id} className="faq-item">
                      <summary className="faq-summary">{item.question}</summary>
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
