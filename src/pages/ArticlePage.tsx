import { Link, Navigate, useParams } from "react-router-dom";
import {
  type Article,
  type ArticleFaqItem,
  type ArticleNumberedList,
  type ArticleTable,
  formatArticleDate,
  getArticleBySlug,
} from "../data/articles";
import { usePageSeo } from "../lib/seo";
import { ROUTES, blogArticlePath } from "../lib/publicRoutes";
import { absoluteBrandLogoUrl, absoluteUrl } from "../lib/siteUrl";

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  const canonicalArticlePath = article ? blogArticlePath(article.slug) : ROUTES.blog;

  usePageSeo({
    title: article ? `Royal Fruit | ${article.title}` : "Royal Fruit | מאמר",
    description: article?.excerpt ?? "מדריכים וטיפים מקצועיים על פירות וירקות פרימיום.",
    ogType: article ? "article" : "website",
    articlePublishedAt: article?.publishedAt,
  });

  if (!article) {
    return <Navigate to={ROUTES.blog} replace />;
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: `${article.publishedAt}T12:00:00+02:00`,
    ...(article.updatedAt
      ? { dateModified: `${article.updatedAt}T12:00:00+02:00` }
      : {}),
    description: article.excerpt,
    author: {
      "@type": "Organization",
      name: article.author.name,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: "Royal Fruit",
      logo: { "@type": "ImageObject", url: absoluteBrandLogoUrl() },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(canonicalArticlePath),
    },
    keywords: article.seoTag,
    articleSection: article.category,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="page-hero articles-hero article-detail-hero">
        <div className="container narrow">
          <p className="eyebrow">
            <Link to={ROUTES.blog} className="article-back-link">
              ← חזרה למאמרים
            </Link>
          </p>
          <p className="article-detail-category">{article.category}</p>
          <h1 className="page-title">{article.title}</h1>
          <ArticleMeta article={article} />
        </div>
      </section>

      <section className="section article-detail-section">
        <div className="container narrow prose article-prose">

          {/* תשובה מהירה */}
          <QuickAnswerBox answer={article.quickAnswer} />

          {/* נקודות עיקריות */}
          <KeyPointsBox points={article.keyPoints} />

          {/* גוף המאמר */}
          {article.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {/* טבלאות */}
          {article.tables?.map((table, i) => (
            <DataTable key={i} table={table} />
          ))}

          {/* רשימות ממוספרות */}
          {article.numberedLists?.map((list, i) => (
            <NumberedListBox key={i} list={list} />
          ))}

          {/* טיפים מהצוות */}
          <TeamTipsBox tips={article.tips} />

          {/* FAQ */}
          <FaqSection faq={article.faq} />

          {/* CTA */}
          <p className="article-cta muted">
            רוצים ליישם את זה בסל הבא?{" "}
            <Link to={ROUTES.shop.fruits}>פירות מובחרים</Link>
            {", "}
            <Link to={ROUTES.ready.meals}>מיצים טבעיים</Link>
            {", "}
            <Link to={ROUTES.shop.vegetables}>ירקות טריים</Link>
            {", "}
            <Link to={ROUTES.contact}>צור קשר</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

/* ── Sub-components ── */

function QuickAnswerBox({ answer }: { answer: string }) {
  return (
    <aside className="article-quick-answer" aria-label="תשובה מהירה">
      <p className="article-quick-answer-label">תשובה מהירה</p>
      <p className="article-quick-answer-text">{answer}</p>
    </aside>
  );
}

function DataTable({ table }: { table: ArticleTable }) {
  return (
    <div className="article-table-wrap">
      <table className="article-table">
        <caption className="article-table-caption">{table.caption}</caption>
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} scope="col">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                ci === 0
                  ? <th key={ci} scope="row">{cell}</th>
                  : <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NumberedListBox({ list }: { list: ArticleNumberedList }) {
  return (
    <div className="article-numbered-list">
      <p className="article-numbered-list-title">{list.title}</p>
      <ol className="article-numbered-list-items">
        {list.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    </div>
  );
}

function ArticleMeta({ article }: { article: Article }) {
  return (
    <div className="article-detail-meta">
      <span className="article-detail-meta-item">
        <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
      </span>
      {article.updatedAt && (
        <span className="article-detail-meta-item article-detail-updated">
          עודכן: <time dateTime={article.updatedAt}>{formatArticleDate(article.updatedAt)}</time>
        </span>
      )}
      <span className="article-detail-meta-item">⏱ {article.readingMinutes} דקות קריאה</span>
      <span className="article-detail-meta-item article-detail-author">
        ✍ {article.author.name} · {article.author.role}
      </span>
    </div>
  );
}

function KeyPointsBox({ points }: { points: string[] }) {
  return (
    <aside className="article-key-points" aria-label="נקודות עיקריות">
      <p className="article-key-points-label">נקודות עיקריות</p>
      <ul className="article-key-points-list">
        {points.map((pt, i) => (
          <li key={i}>{pt}</li>
        ))}
      </ul>
    </aside>
  );
}

function TeamTipsBox({ tips }: { tips: string[] }) {
  return (
    <aside className="article-tips" aria-label="טיפים מהצוות">
      <p className="article-tips-label">
        <span aria-hidden>🌿</span> טיפים מהצוות של Royal Fruit
      </p>
      <ul className="article-tips-list">
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </aside>
  );
}

function FaqSection({ faq }: { faq: ArticleFaqItem[] }) {
  return (
    <section className="article-faq" aria-labelledby="article-faq-title">
      <h2 id="article-faq-title" className="article-faq-title">שאלות נפוצות</h2>
      <dl className="article-faq-list">
        {faq.map((item, i) => (
          <div key={i} className="article-faq-item">
            <dt className="article-faq-q">{item.q}</dt>
            <dd className="article-faq-a">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
