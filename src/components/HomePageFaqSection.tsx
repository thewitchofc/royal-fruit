import { Link } from "react-router-dom";
import { HOME_PAGE_FAQ_ITEMS } from "../data/homePageFaq";
import { HomeFaqJsonLd } from "./HomeFaqJsonLd";

export function HomePageFaqSection() {
  return (
    <section id="home-faq" className="section section-tint" aria-labelledby="home-faq-heading">
      <HomeFaqJsonLd />
      <div className="container narrow">
        <h2 id="home-faq-heading" className="section-title">
          שאלות נפוצות
        </h2>
        <p className="muted wide home-faq-intro">
          תשובות קצרות, לרשימה מלאה ניתן לעבור ל־
          <Link to="/faq" className="price-menu-tel">
            עמוד השאלות הנפוצות
          </Link>
          .
        </p>
        <dl className="home-faq-list">
          {HOME_PAGE_FAQ_ITEMS.map((item) => (
            <div key={item.question} className="home-faq-item">
              <dt className="home-faq-q">{item.question}</dt>
              <dd className="home-faq-a">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
