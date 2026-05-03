/** מקטעי BreadcrumbList, שם תצוגה + נתיב יחסי */

import { ROUTES, blogArticlePath } from "./publicRoutes";

export type BreadcrumbSegment = { name: string; path: string };

const HOME: BreadcrumbSegment = { name: "Royal Fruit", path: "/" };

/** דפים ישירים תחת הבית (לא כולל דף הבית עצמו) */
const ROUTE_CRUMB: Record<string, BreadcrumbSegment> = {
  [ROUTES.about]: { name: "אודות העסק", path: ROUTES.about },
  [ROUTES.gallery]: { name: "גלריה", path: ROUTES.gallery },
  [ROUTES.reviews]: { name: "המלצות לקוחות", path: ROUTES.reviews },
  [ROUTES.shop.fruits]: { name: "פירות מובחרים", path: ROUTES.shop.fruits },
  [ROUTES.shop.juices]: { name: "מיצים טבעיים", path: ROUTES.shop.juices },
  [ROUTES.shop.vegetables]: { name: "ירקות טריים", path: ROUTES.shop.vegetables },
  [ROUTES.ready.meals]: { name: "מטבח טרי", path: ROUTES.ready.meals },
  [ROUTES.ready.sweets]: { name: "חלווה וממרחים", path: ROUTES.ready.sweets },
  [ROUTES.boxes.fruits]: { name: "מארזי פירות", path: ROUTES.boxes.fruits },
  [ROUTES.boxes.gifts]: { name: "מארזי מתנה", path: ROUTES.boxes.gifts },
  [ROUTES.faq]: { name: "שאלות נפוצות", path: ROUTES.faq },
  [ROUTES.blog]: { name: "מאמרים", path: ROUTES.blog },
  [ROUTES.cart]: { name: "סל קניות", path: ROUTES.cart },
  [ROUTES.contact]: { name: "צור קשר", path: ROUTES.contact },
  "/privacy": { name: "מדיניות פרטיות", path: "/privacy" },
  "/terms": { name: "תנאי שימוש", path: "/terms" },
  "/returns": { name: "ביטולים והחזרות", path: "/returns" },
  "/accessibility": { name: "הצהרת נגישות", path: "/accessibility" },
  "/articles": { name: "מאמרים", path: ROUTES.blog },
  "/testimonials": { name: "המלצות לקוחות", path: ROUTES.reviews },
  "/fruits": { name: "פירות מובחרים", path: ROUTES.shop.fruits },
  "/vegetables": { name: "ירקות טריים", path: ROUTES.shop.vegetables },
  "/juices": { name: "מיצים טבעיים", path: ROUTES.shop.juices },
  "/home-food": { name: "מטבח טרי", path: ROUTES.ready.meals },
  "/halva": { name: "חלווה וממרחים", path: ROUTES.ready.sweets },
};

function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

/** שימוש ב-JSON-LD BreadcrumbList לפי נתיב הנוכחי */
export function getBreadcrumbTrail(pathname: string): BreadcrumbSegment[] {
  const path = normalizePath(pathname);

  if (path === "/") {
    return [HOME];
  }

  const direct = ROUTE_CRUMB[path];
  if (direct) {
    return [HOME, direct];
  }

  if (path.startsWith(`${ROUTES.blog}/`) && path !== ROUTES.blog) {
    return [HOME, { name: "מאמרים", path: ROUTES.blog }, { name: "מאמר", path }];
  }

  if (path.startsWith("/articles/") && path !== "/articles") {
    const slug = path.replace(/^\/articles\//, "");
    return [HOME, { name: "מאמרים", path: ROUTES.blog }, { name: "מאמר", path: blogArticlePath(slug) }];
  }

  return [HOME, { name: "עמוד", path }];
}
