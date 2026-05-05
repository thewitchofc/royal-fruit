import { ARTICLES } from "../data/articles";
import { ROUTES, blogArticlePath } from "./publicRoutes";

/** כל הנתיבים הסטטיים לאינדוקס ולמפת אתר */
export const SEO_STATIC_PATHS: string[] = [
  "/",
  ROUTES.about,
  ROUTES.blog,
  ROUTES.gallery,
  ROUTES.reviews,
  ROUTES.shop.fruits,
  ROUTES.shop.vegetables,
  ROUTES.ready.meals,
  ROUTES.boxes.fruits,
  ROUTES.faq,
  ROUTES.contact,
  "/privacy",
  "/terms",
  "/returns",
  "/accessibility",
];

export function getAllSeoPaths(): string[] {
  const articlePaths = ARTICLES.map((a) => blogArticlePath(a.slug));
  return [...SEO_STATIC_PATHS, ...articlePaths];
}
