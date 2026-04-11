/** מקטעי BreadcrumbList, שם תצוגה + נתיב יחסי */

export type BreadcrumbSegment = { name: string; path: string };

const HOME: BreadcrumbSegment = { name: "Royal Fruit", path: "/" };

/** דפים ישירים תחת הבית (לא כולל דף הבית עצמו) */
const ROUTE_CRUMB: Record<string, BreadcrumbSegment> = {
  "/about": { name: "אודות העסק", path: "/about" },
  "/articles": { name: "מאמרים", path: "/articles" },
  "/gallery": { name: "גלריה", path: "/gallery" },
  "/testimonials": { name: "המלצות", path: "/testimonials" },
  "/fruits": { name: "פירות פרימיום", path: "/fruits" },
  "/vegetables": { name: "ירקות פרימיום", path: "/vegetables" },
  "/faq": { name: "שאלות נפוצות", path: "/faq" },
  "/cart": { name: "סל קניות", path: "/cart" },
  "/contact": { name: "יצירת קשר", path: "/contact" },
  "/privacy": { name: "מדיניות פרטיות", path: "/privacy" },
  "/terms": { name: "תנאי שימוש", path: "/terms" },
  "/returns": { name: "ביטולים והחזרות", path: "/returns" },
  "/accessibility": { name: "הצהרת נגישות", path: "/accessibility" },
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

  if (path.startsWith("/articles/") && path !== "/articles") {
    return [HOME, { name: "מאמרים", path: "/articles" }, { name: "מאמר", path }];
  }

  return [HOME, { name: "עמוד", path }];
}
