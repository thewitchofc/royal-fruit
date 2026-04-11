/** תמונות למגשים ומארזים, מוצגות בגלריה */

export type PlatterShowcaseItem = { file: string; alt: string };

export const PLATTER_SHOWCASE_IMAGES: PlatterShowcaseItem[] = [
  {
    file: "platter-fruit-open-tray.png",
    alt: "מגש פירות פרימיום עגול ועשיר: אבטיח, מלון, אננס, ענבים, קיווי, תותים, אוכמניות ועוד, מעוצב על ידי Royal Fruit",
  },
  {
    file: "platter-fruit-wrapped-ribbon-a.png",
    alt: "מגש פירות לאירוע, עטוף בסלופן עם סרט ומדבקת Royal Fruit, מוכן למשלוח",
  },
];

/** צילומי מלאי ופרימיום (גלריה) */
export const GALLERY_STOCK_IMAGES: PlatterShowcaseItem[] = [
  {
    file: "gallery-strawberries-bee-totes.png",
    alt: "מגשי תותים טריים באריזת ״בי־תות״, פורת יעקב והראל",
  },
  {
    file: "gallery-pineapple-kapi-scale.png",
    alt: "אננס Kapi על משקילה מקצועית, שקיפות משקל ללקוח",
  },
  {
    file: "gallery-diva-green-grapes.png",
    alt: "ענבים ירוקים ללא גרעינים מותג Diva, יבוא פרו, ארוזים ברשת מגן",
  },
  {
    file: "gallery-strawberries-yemini-heart.png",
    alt: "תותי משק ימיני במגשי לב ארוזים, קופסת משלוח",
  },
  {
    file: "gallery-kikoka-gold-kiwi.png",
    alt: "קיווי זהב Kikoka ארוז 500 גרם, מקור יוון",
  },
  {
    file: "gallery-rainbow-carrots-yaakovov.png",
    alt: "גזר צבעוני טרי עם עלים, תוצרת משק יעקובוב",
  },
  {
    file: "gallery-pineapple-sliced-trays.png",
    alt: "מגשי אננס חתוך באריזות שקופות עם מדבקה בעברית",
  },
  {
    file: "gallery-pineapple-kapi-crates.png",
    alt: "ארגזי אננס Kapi Premium, תוצרת קוסטה ריקה",
  },
  {
    file: "gallery-blackberries-patel-bahar.png",
    alt: "פטל שחור ופטל אדום באריזות פטל בהר",
  },
  {
    file: "gallery-young-coconut-drink.png",
    alt: "קוקוס צעיר לשתייה Young Fresh Coconut, ארוז ומוכן לשתייה",
  },
  {
    file: "gallery-cucumbers-trays.png",
    alt: "מלפפונים טריים במגשי קצף עטופי צלופן",
  },
  {
    file: "gallery-passion-fruit-oranges.png",
    alt: "מגשי פסיפלורה עטופי צלופן ותפוזים בארגזים",
  },
  {
    file: "gallery-asparagus-bundles.png",
    alt: "אספרגוס ירוק טרי, צרורות בארגז דואר",
  },
  {
    file: "gallery-premium-delivery-box.png",
    alt: "ארגז משלוח פרימיום מלא תוצרת טרייה: מלון, אננס משק 32, תירס מתוק Super Sweet, אוכמניות מותג קרמל, תותים, צברים ומדבקת Royal Fruit",
  },
];

const ALT_BY_FILE = Object.fromEntries([
  ...PLATTER_SHOWCASE_IMAGES.map((x) => [x.file, x.alt] as const),
  ...GALLERY_STOCK_IMAGES.map((x) => [x.file, x.alt] as const),
]);

export function galleryImageAlt(filename: string, indexFallback: number): string {
  return ALT_BY_FILE[filename] ?? `גלריית Royal Fruit ${indexFallback + 1}`;
}

/** מותגים, משקים וספקים שמופיעים בצילומי המלאי בגלריה (לפי סדר הופעה ב־GALLERY_STOCK_IMAGES) */
export const GALLERY_PARTNER_NAMES: string[] = (() => {
  const ordered: string[] = [];
  const seen = new Set<string>();
  const add = (label: string) => {
    const t = label.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    ordered.push(t);
  };
  for (const item of GALLERY_STOCK_IMAGES) {
    const { file } = item;
    if (file === "gallery-strawberries-bee-totes.png") {
      add("בי־תות");
      add("פורת יעקב והראל");
      continue;
    }
    if (file === "gallery-pineapple-kapi-scale.png" || file === "gallery-pineapple-kapi-crates.png") {
      add("Kapi");
      continue;
    }
    if (file === "gallery-diva-green-grapes.png") {
      add("Diva");
      continue;
    }
    if (file === "gallery-strawberries-yemini-heart.png") {
      add("משק ימיני");
      continue;
    }
    if (file === "gallery-kikoka-gold-kiwi.png") {
      add("Kikoka");
      continue;
    }
    if (file === "gallery-rainbow-carrots-yaakovov.png") {
      add("משק יעקובוב");
      continue;
    }
    if (file === "gallery-blackberries-patel-bahar.png") {
      add("פטל בהר");
      continue;
    }
    if (file === "gallery-young-coconut-drink.png") {
      add("Young Fresh Coconut");
      continue;
    }
    if (file === "gallery-premium-delivery-box.png") {
      add("משק 32");
      add("קרמל");
      continue;
    }
  }
  return ordered;
})();
