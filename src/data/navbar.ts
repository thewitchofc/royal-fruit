import { ROUTES } from "../lib/publicRoutes";

/** מבנה ניווט עליון — תפריטים נפתחים וקישורי משנה (נתיבים קנוניים) */

export type NavbarDropdownItem = {
  label: string;
  to: string;
};

export type NavbarDropdown = {
  id: string;
  label: string;
  items: NavbarDropdownItem[];
};

export type NavbarTopLink = {
  id: string;
  label: string;
  to: string;
};

export const NAVBAR_HOME: NavbarTopLink = { id: "home", label: "דף הבית", to: "/" };

export const NAVBAR_DROPDOWNS: NavbarDropdown[] = [
  {
    id: "shop",
    label: "חנות",
    items: [
      { label: "פירות מובחרים", to: ROUTES.shop.fruits },
      { label: "ירקות טריים", to: ROUTES.shop.vegetables },
      { label: "מיצים טבעיים", to: ROUTES.shop.juices },
    ],
  },
  {
    id: "ready",
    label: "מטבח טרי",
    items: [
      { label: "מטבח טרי", to: ROUTES.ready.meals },
      { label: "חלווה וממרחים", to: ROUTES.ready.sweets },
    ],
  },
  {
    id: "gifts",
    label: "מארזים",
    items: [
      { label: "מארזי פירות", to: ROUTES.boxes.fruits },
      { label: "מארזי מתנה", to: ROUTES.boxes.gifts },
    ],
  },
  {
    id: "about",
    label: "אודות",
    items: [
      { label: "אודות העסק", to: ROUTES.about },
      { label: "גלריה", to: ROUTES.gallery },
      { label: "המלצות לקוחות", to: ROUTES.reviews },
      { label: "שאלות נפוצות", to: ROUTES.faq },
      { label: "מאמרים", to: ROUTES.blog },
    ],
  },
];

export const NAVBAR_CONTACT: NavbarTopLink = { id: "contact", label: "צור קשר", to: ROUTES.contact };
