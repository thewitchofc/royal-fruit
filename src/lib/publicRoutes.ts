/**
 * נתיבים קנוניים באתר — מקור אחד ל־Navbar, הפניות וקישורים פנימיים.
 * נתיבים ישנים מפנים כאן דרך `<Navigate />` ב־App.
 */
export const ROUTES = {
  shop: {
    fruits: "/shop/fruits",
    vegetables: "/shop/vegetables",
    greensRoots: "/shop/greens-roots",
    juices: "/shop/juices",
  },
  ready: {
    meals: "/ready/meals",
    sweets: "/ready/sweets",
  },
  boxes: {
    fruits: "/boxes/fruits",
  },
  about: "/about",
  gallery: "/gallery",
  reviews: "/reviews",
  faq: "/faq",
  blog: "/blog",
  contact: "/contact",
  cart: "/cart",
} as const;

export function blogArticlePath(slug: string): string {
  return `${ROUTES.blog}/${encodeURIComponent(slug)}`;
}

/** נתיבים שמחממים מטמון מחירון (גיליון) */
export const PRICE_LIST_PREFETCH_PATHS = new Set<string>([
  ROUTES.shop.fruits,
  ROUTES.shop.vegetables,
  ROUTES.shop.greensRoots,
  ROUTES.ready.meals,
  ROUTES.boxes.fruits,
]);
