import { Link } from "react-router-dom";
import { usePageSeo } from "../lib/seo";

export function NotFound() {
  usePageSeo({
    title: "הדף לא נמצא (404) | Royal Fruit",
    description: "העמוד שחיפשת לא קיים באתר Royal Fruit.",
    noIndex: true,
  });

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container narrow">
          <h1 className="page-title">הדף לא נמצא (404)</h1>
          <p className="page-lead muted">העמוד שחיפשת לא קיים</p>
          <p>
            <Link to="/" className="btn btn-primary">
              חזרה לדף הבית
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
