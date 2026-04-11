import { ARTICLES } from "../data/articles";

/** כל הנתיבים הסטטיים לאינדוקס ולמפת אתר */
export const SEO_STATIC_PATHS: string[] = [
  "/",
  "/about",
  "/articles",
  "/gallery",
  "/testimonials",
  "/fruits",
  "/vegetables",
  "/faq",
  "/cart",
  "/contact",
  "/privacy",
  "/terms",
  "/returns",
  "/accessibility",
];

export function getAllSeoPaths(): string[] {
  const articlePaths = ARTICLES.map((a) => `/articles/${a.slug}`);
  return [...SEO_STATIC_PATHS, ...articlePaths];
}
