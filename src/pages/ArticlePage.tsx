import { Link, Navigate, useParams } from "react-router-dom";
import { formatArticleDate, getArticleBySlug } from "../data/articles";
import { usePageSeo } from "../lib/seo";
import { absoluteOgImageUrl, absoluteUrl } from "../lib/siteUrl";

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;


  usePageSeo({
    title: article ? `Royal Fruit | ${article.title}` : "Royal Fruit | מאמר",
    description: article?.excerpt ?? "מדריכים וטיפים מקצועיים על פירות וירקות פרימיום.",
    ogType: article ? "article" : "website",
    articlePublishedAt: article?.publishedAt,
  });

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            datePublished: `${article.publishedAt}T12:00:00+02:00`,
            description: article.excerpt,
            author: { "@type": "Organization", name: "Royal Fruit" },
            publisher: {
              "@type": "Organization",
              name: "Royal Fruit",
              logo: { "@type": "ImageObject", url: absoluteOgImageUrl() },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": absoluteUrl(`/articles/${article.slug}`),
            },
          }),
        }}
      />
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">
            <Link to="/articles" className="article-back-link">
              ← חזרה למאמרים
            </Link>
          </p>
          <h1 className="page-title">{article.title}</h1>
          <p className="page-meta muted">
            <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow prose article-prose">
          {article.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="article-cta muted">
            רוצים ליישם את זה בסל הבא?{" "}
            <Link to="/fruits">פירות פרימיום</Link>
            {", "}
            <Link to="/vegetables">ירקות פרימיום</Link>
            {", "}
            <Link to="/contact">יצירת קשר</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
