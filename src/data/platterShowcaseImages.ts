/** תמונות למגשים ומארזים, מוצגות בגלריה */

export type PlatterShowcaseItem = { file: string; alt: string };

export const PLATTER_SHOWCASE_IMAGES: PlatterShowcaseItem[] = [
  {
    file: "fruit-tray-open.webp",
    alt: "מגש פירות פרימיום עגול ועשיר: אבטיח, מלון, אננס, ענבים, קיווי, תותים, אוכמניות ועוד, מעוצב על ידי Royal Fruit",
  },
  {
    file: "fruit-tray-wrapped-ribbon.webp",
    alt: "מגש פירות לאירוע, עטוף בסלופן עם סרט ומדבקת Royal Fruit, מוכן למשלוח",
  },
];

/** צילומי מלאי ופרימיום (גלריה) */
export const GALLERY_STOCK_IMAGES: PlatterShowcaseItem[] = [
  {
    file: "strawberries-bee-totes.webp",
    alt: "מגשי תותים טריים באריזת ״בי־תות״, פורת יעקב והראל",
  },
  {
    file: "pineapple-kapi-scale.webp",
    alt: "אננס Kapi על משקילה מקצועית, שקיפות משקל ללקוח",
  },
  {
    file: "diva-green-grapes.webp",
    alt: "ענבים ירוקים ללא גרעינים מותג Diva, יבוא פרו, ארוזים ברשת מגן",
  },
  {
    file: "strawberries-yemini-heart.webp",
    alt: "תותי משק ימיני במגשי לב ארוזים, קופסת משלוח",
  },
  {
    file: "kikoka-gold-kiwi.webp",
    alt: "קיווי זהב Kikoka ארוז 500 גרם, מקור יוון",
  },
  {
    file: "rainbow-carrots-yaakovov.webp",
    alt: "גזר צבעוני טרי עם עלים, תוצרת משק יעקובוב",
  },
  {
    file: "pineapple-sliced-trays.webp",
    alt: "מגשי אננס חתוך באריזות שקופות עם מדבקה בעברית",
  },
  {
    file: "pineapple-kapi-crates.webp",
    alt: "ארגזי אננס Kapi Premium, תוצרת קוסטה ריקה",
  },
  {
    file: "blackberries-patel-bahar.webp",
    alt: "פטל שחור ופטל אדום באריזות פטל בהר",
  },
  {
    file: "young-coconut-drink.webp",
    alt: "קוקוס צעיר לשתייה Young Fresh Coconut, ארוז ומוכן לשתייה",
  },
  {
    file: "cucumbers-trays.webp",
    alt: "מלפפונים טריים במגשי קצף עטופי צלופן",
  },
  {
    file: "passion-fruit-oranges.webp",
    alt: "מגשי פסיפלורה עטופי צלופן ותפוזים בארגזים",
  },
  {
    file: "asparagus-bundles.webp",
    alt: "אספרגוס ירוק טרי, צרורות בארגז דואר",
  },
  {
    file: "premium-delivery-box.webp",
    alt: "ארגז משלוח פרימיום מלא תוצרת טרייה: מלון, אננס משק 32, תירס מתוק Super Sweet, אוכמניות מותג קרמל, תותים, צברים ומדבקת Royal Fruit",
  },
  {
    file: "starfruit-trays.webp",
    alt: "קרמבולה טרייה וחתוכה למגשי אירוח, מסודרת באריזות שקופות",
  },
  {
    file: "dates-walnut-pack.webp",
    alt: "תמרים ממולאים באגוזי מלך באריזת אירוח אישית",
  },
  {
    file: "colorful-cauliflower.webp",
    alt: "כרובית צבעונית טרייה באריזה: סגול, צהוב וירוק",
  },
  {
    file: "red-kissabel-apples.webp",
    alt: "תפוחי Kissabel אדומים טריים, מסודרים במגש תצוגה",
  },
  {
    file: "white-strawberries.webp",
    alt: "תותים לבנים מובחרים באריזות פרימיום",
  },
  {
    file: "mixed-fruit-box.webp",
    alt: "ארגז פירות טריים מגוון: אננס, ענבים, תותים, פטל ואוכמניות",
  },
  {
    file: "fresh-produce-box.webp",
    alt: "ארגז תוצרת טרייה עם פירות וירקות נבחרים למשלוח",
  },
  {
    file: "blueberries-pack.webp",
    alt: "אוכמניות טריות באריזת פרימיום",
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
    if (file === "strawberries-bee-totes.webp") {
      add("בי־תות");
      add("פורת יעקב והראל");
      continue;
    }
    if (file === "pineapple-kapi-scale.webp" || file === "pineapple-kapi-crates.webp") {
      add("Kapi");
      continue;
    }
    if (file === "diva-green-grapes.webp") {
      add("Diva");
      continue;
    }
    if (file === "strawberries-yemini-heart.webp") {
      add("משק ימיני");
      continue;
    }
    if (file === "kikoka-gold-kiwi.webp") {
      add("Kikoka");
      continue;
    }
    if (file === "rainbow-carrots-yaakovov.webp") {
      add("משק יעקובוב");
      continue;
    }
    if (file === "blackberries-patel-bahar.webp") {
      add("פטל בהר");
      continue;
    }
    if (file === "young-coconut-drink.webp") {
      add("Young Fresh Coconut");
      continue;
    }
    if (file === "premium-delivery-box.webp") {
      add("משק 32");
      add("קרמל");
      continue;
    }
  }
  return ordered;
})();
