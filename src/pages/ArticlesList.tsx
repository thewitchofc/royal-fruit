import { Link } from "react-router-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { ARTICLES, formatArticleDate } from "../data/articles";
import { blogArticlePath } from "../lib/publicRoutes";
import { usePageSeo } from "../lib/seo";

export function ArticlesList() {
  usePageSeo({
    title: "Royal Fruit | מאמרים וטיפים",
    description: "מדריכים קצרים על פירות, ירקות, אחסון, אירוח ואיכות חומרי גלם.",
  });

  return (
    <div className="page">
      <section className="page-hero articles-hero">
        <div className="container narrow">
          <p className="eyebrow">מאמרים וטיפים</p>
          <h1 className="page-title">ידע קטן שעושה הבדל גדול</h1>
          <p className="page-lead muted">
            מדריכים קצרים על בחירת פרי, שמירה על ירקות ומה שקורה מאחורי הקלעים באיכות
            פרימיום.
          </p>
        </div>
      </section>

      <section className="section articles-section">
        <div className="container articles-premium-shell">
          <div className="articles-intro-card" aria-label="אופי המאמרים">
            <div>
              <RoyalFruitWordmark className="articles-intro-wordmark" />
              <h2>טיפים קצרים לבחירה, אחסון ואירוח נכון.</h2>
            </div>
            <div className="articles-intro-points">
              <span>בחירת תוצרת</span>
              <span>שמירה בבית</span>
              <span>אירוח פרימיום</span>
            </div>
          </div>

          <ul className="articles-grid">
            {ARTICLES.map((article) => (
              <li key={article.slug}>
                <article className="article-card">
                  <time className="article-card-date" dateTime={article.publishedAt}>
                    {formatArticleDate(article.publishedAt)}
                  </time>
                  <h2 className="article-card-title">
                    <Link to={blogArticlePath(article.slug)}>{article.title}</Link>
                  </h2>
                  <p className="article-card-excerpt muted">{article.excerpt}</p>
                  <Link to={blogArticlePath(article.slug)} className="article-card-more">
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
