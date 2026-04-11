import { Link } from "react-router-dom";
import { ARTICLES, formatArticleDate } from "../data/articles";
import { usePageSeo } from "../lib/seo";

export function ArticlesList() {
  usePageSeo({
    title: "Royal Fruit | מאמרים וטיפים",
    description: "מדריכים קצרים על פירות, ירקות, אחסון, אירוח ואיכות חומרי גלם.",
  });

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">מאמרים וטיפים</p>
          <h1 className="page-title">מהחנות אל השולחן, ידע קטן שעושה הבדל גדול</h1>
          <p className="page-lead muted">
            מדריכים קצרים על בחירת פרי, שמירה על ירקות ומה שקורה מאחורי הקלעים באיכות
            פרימיום.
          </p>
        </div>
      </section>

      <section className="section articles-section">
        <div className="container">
          <ul className="articles-grid">
            {ARTICLES.map((article) => (
              <li key={article.slug}>
                <article className="article-card">
                  <time className="article-card-date" dateTime={article.publishedAt}>
                    {formatArticleDate(article.publishedAt)}
                  </time>
                  <h2 className="article-card-title">
                    <Link to={`/articles/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p className="article-card-excerpt muted">{article.excerpt}</p>
                  <Link to={`/articles/${article.slug}`} className="article-card-more">
                    המשך קריאה
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
