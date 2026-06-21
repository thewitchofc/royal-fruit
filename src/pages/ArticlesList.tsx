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

  const [featured, ...rest] = ARTICLES;

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
            {/* כרטיס מוביל */}
            <li className="article-grid-featured">
              <ArticleCard article={featured} featured />
            </li>

            {/* שאר הכרטיסים */}
            {rest.map((article) => (
              <li key={article.slug}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function ArticleCard({
  article,
  featured = false,
}: {
  article: (typeof ARTICLES)[0];
  featured?: boolean;
}) {
  const href = blogArticlePath(article.slug);

  return (
    <article className={`article-card${featured ? " article-card--featured" : ""}`}>
      {/* Hero */}
      <Link to={href} className="article-card-hero" tabIndex={-1} aria-hidden>
        <div
          className="article-card-hero-inner"
          style={{ background: article.heroGradient }}
        >
          <span className="article-card-hero-emoji" aria-hidden>
            {article.heroEmoji}
          </span>
        </div>
        <span className="article-card-category">{article.category}</span>
        <span className="article-card-seo-tag">{article.seoTag}</span>
      </Link>

      {/* גוף */}
      <div className="article-card-body">
        <div className="article-card-meta">
          <time className="article-card-date" dateTime={article.publishedAt}>
            {formatArticleDate(article.publishedAt)}
          </time>
          <span className="article-card-reading" aria-label={`זמן קריאה: ${article.readingMinutes} דקות`}>
            ⏱ {article.readingMinutes} דקות קריאה
          </span>
        </div>

        <h2 className="article-card-title">
          <Link to={href}>{article.title}</Link>
        </h2>

        <p className="article-card-excerpt muted">{article.excerpt}</p>

        <div className="article-card-footer">
          {article.views !== undefined && (
            <span className="article-card-views" aria-label={`${article.views} צפיות`}>
              👁 {article.views.toLocaleString("he-IL")}
            </span>
          )}
          <Link to={href} className="article-card-more">
            המשך קריאה
            <span className="article-card-more-arrow" aria-hidden>←</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
