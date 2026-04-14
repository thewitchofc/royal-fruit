/** מחירון, עדכון תאריכים ומחירים כאן */

export type PriceRow = {
  emoji: string;
  name: string;
  price?: string;
  /** משקל / מארז / יחידה / מדרגות מחיר, מהגיליון או מקוד */
  unit?: string;
  description?: string;
};

export type PriceSubsection = {
  title: string;
  note?: string;
  rows: PriceRow[];
};

export type PriceCategory = {
  id: string;
  title: string;
  emoji: string;
  intro?: string;
  rows?: PriceRow[];
  subsections?: PriceSubsection[];
};

/** באנר מעל מחירון (תאריך תקף אופציונלי) */
export type PriceListBannerMeta = {
  title: string;
  validRange?: string;
};

export const PRICE_LIST_META: PriceListBannerMeta = {
  title: "מחירון ROYAL FRUIT",
  validRange: "29.3.2026 עד 4.4.2026",
};

/** תיאור קצר לכל פריט (טעם/שימוש, בלי השוואה לפריטים אחרים) */
export function getProduceShortDescription(name: string): string {
  const n = name.trim();
  /** תואם גם כשבגיליון השם בלי «בקבוק» או עם ניסוח קרוב */
  const appleCiderVinegarShort =
    "חומץ תפוחים טבעי למטבח: סלטים, מרינדות, רטבים ותיבול יומי. חמיצות נעימה ומאוזנת, לשימוש מזון בלבד, לא כמשקה.";

  const byExact: Record<string, string> = {
    פומלה: "הדר עדין ומתוק־מריר; מתאים לנשנוש, לסלטים ולפריסה על מגש.",
    "אננס חתוך": "מתוק וחמצמץ, מוכן לאכילה מיד; מרקם צפוף ועסיסי.",
    "קוקוס חתוך": "בשר קוקוס טרי ופריך; מתיקות עדינה, מתאים גם לקינוחים.",
    "אבטיח חתוך": "עסיסי ומרענן, מוכן להגשה; מתיקות רכה ומרקם מים.",
    "מלון חתוך": "מתוק ובשרני עם ארומה בולטת; מתאים למגשי אירוח ולקינוח קליל.",
    "קיווי קלוף": "חמצמץ־מתקתק ומוכן לשימוש; חמיצות חדה ומרעננת.",
    סברס: "מתוק עדין וקריר; מרקם גרגירי עדין, ייחודי בצלחת ובסלט פירות.",
    "אוכמניות כרמל": "מתיקות מאוזנת ומרקם יציב; עסיסיות נעימה ונוחה לנשנוש.",
    "אוכמניות גליל ים": "אוכמניה מוצקה ומתוקה, מצוינת לנשנוש וקינוחים.",
    "אוכמניות פרו סקויה": "טעם מאוזן, מתאים לאפייה ולשימוש חם בבישול.",
    "פטל אדום ישראלי": "ארומטי ועדין מאוד; שברירי, כדאי לקירור ולטיפול עדין.",
    "פטל שחור": "טעם עמוק, מתקתק־חמצמץ; בולט בקינוחים ובמגשי פרימיום.",
    "גולדן ברי": "חמצמץ־טרופי עם מתיקות קלה; טעם חד ואקזוטי.",
    "תות לבבות מיוחד": "מתוק ובשל להגשה; שלם ומרשים בצלחת ובאירוח.",
    "תות חצאים": "פתרון מהיר לקינוח או מגש, בלי חיתוך נוסף; מומלץ לצריכה קרובה.",
    "ענב ירוק קריספי": "פריך ומתוק, מושלם לנשנוש; קראנץ' בולט ונקי.",
    "ענב ירוק סוויט גלוב": "ירוק מתוק ופריך, קל לאכילה ישירות מהמארז.",
    "ענב אדום כרימסון": "ענב אדום מאוזן ומתוק, מרקם עדין ונעים.",
    "ענב שחור סייבל": "ארומה עמוקה ומתיקות בולטת; טעם מודגש ועשיר.",
    "ענב אדום סוויט סלבריישן": "אדום מתוק להגשה ואירוח, מרקם עדין.",
    "ענב קריספי": "ענבים פריכים במיוחד עם ביס חד ונקי.",
    "קוקוס לשתייה עם קש": "מי קוקוס לשתייה בלבד, טריים לשימוש מיידי, קלילים ומרעננים.",
    "כדורי קוקוס": "נשנוש קוקוס טבעי מוכן לאכילה, מרקם עשיר וסיבי.",
    "קרמבולה פרימיום": "חמצמץ־מתקתק עם חיתוך כוכב ייחודי; מצוין לקישוט צלחות.",
    "תפוז דם": "הדר ארומטי עם מתיקות־חמיצות עמוקה וצבע בשר בולט.",
    "תפוז פירמיום": "תפוז מתוק ומאוזן לשתייה/אכילה יומית.",
    "קיווי ירוק": "חמצמץ־מתוק עם סיבים עדינים; מרענן וקליל.",
    "מלון כתום": "מתוק וארומטי, בשרני וריח בולט.",
    אבטיח: "מרענן ועסיסי מאוד; מתיקות קלילה ומרקם מים.",
    "פקאן בוואקום": "אגוז טרי ויציב לאורך זמן הודות לאריזת ואקום.",
    "פקאן עם קליפה": "שומר טריות טבעית בתוך הקליפה, מתאים לאחסון ארוך יחסית.",
    "בקבוק חומץ תפוחים": appleCiderVinegarShort,
    "בקבוק מיץ תפוחים 100% טבעי": "מיץ תפוחים נקי בלי תוספות; מתוק ועדין לשתייה קרה.",
    "בקבוק מיץ תפוחים וגזר 100% טבעי": "שילוב מתיקות טבעית עם גוף עדין ומאוזן.",
    "בקבוק מיץ תפוחים וסלק 100% טבעי": "טעם אדמתי־מתקתק עמוק ומלא.",
    "בקבוק מיץ תפוחים וחבוש 100% טבעי": "ארומה פירותית חורפית ועדינה.",
    "ג׳ינג׳ר טרי": "שורש חריף־ארומטי; נותן חום ועומק לתבשילים ולשתייה.",
    "אבוקדו מוכן לאכילה": "בשל להגשה מיידית; קרמי ונוח לפריסה ולסלט.",
    "שום טרי": "ארומה חזקה ונקייה לתיבול; חד וטרי.",
    "תירס מתוק": "גרגרים מתקתקים ועסיסיים; ביס רך ומתוק.",
    "פינגר ליים": "פניני הדר חמצמצות לקישוט וטוויסט יוקרתי במנות.",
    "תרד גוליבר צ׳רי": "עלי תרד רכים ומהירים לסלט או הקפצה; טעם עדין ונעים.",
    "אפונת שלג צ׳רי": "תרמיל פריך ועדין; ביס ירוק ורענן.",
    "אפונת גינה צ׳רי חדש": "אפונה מתוקה יחסית, מתאימה לסלטים ותבשילים קלים.",
    "כורכום צ׳רי": "שורש ארומטי עדין; נותן צבע וטעם אדמתי לתבשילים.",
    "מיקס כרובית טריו": "תערובת צבעונית של כרוביות להגשה עשירה וויזואלית.",
    "כרובית לבנה": "קלאסית, עדינה בטעם ומתאימה לצלייה, אידוי וטיגון.",
    "זר גזר צבעוני": "גזרים צבעוניים עם מתיקות טבעית ומראה מרשים במגש.",
    "נשנושי גזר מתוק": "קטנים ומתוקים לנשנוש מהיר; רכים ונוחים לאכילה.",
    "ברוקולי ג׳מבו משק כהן": "פרחים גדולים ובשרניים, טובים לצלייה/אידוי.",
    "בצל ספרדי משק כהן": "בצל מתוק־עדין יחסית, מתאים גם לצלייה ארוכה.",
    "דלעת משק כהן": "דלעת מתוקה לבישול וצלייה; מרקם עשיר ומתאים לתבשילים איטיים.",
    "כרוב ניצנים משק כהן": "נגיסים ירוקים עם מרירות עדינה שמתאזנת בצלייה.",
    "חרשוף משק כהן": "ירק עונתי ייחודי בטעם ירוק־אגוזי עדין.",
    "קוסביה משק כהן": "תרמילים ירוקים עדינים, טובים להקפצה ולתבשיל קצר.",
    "שעועית ירוקה משק כהן": "פריכה ועדינה; טעם ירוק מודגש ורענן.",
    "שעועית צהובה משק כהן": "רכה ועדינה בשלות, עם טעם מעט מתקתק.",
    "שעועית רחבה משק כהן": "שעועית בשרנית עם טעם עמוק לתבשילים.",
    פרוס: "ירק שורש עונתי בטעם עדין־מתקתק לבישול וצלייה.",
    חזרת: "שורש חריף וחד להגשה לצד דגים ובשרים.",
    "מארז פול": "קטניות טריות ועשירות במרקם, מצוינות לתבשילים אביביים.",
    "אספרגוס טרי": "גבעול עדין ופריך; מתאים לבישול קצר ולטעם אלגנטי בצלחת.",
    "עלי גפן טריים (500 גרם)": "עלים רכים למילוי ביתי; טעם טרי ונקי.",
    "מלפפון ארמטו ענק": "מלפפון גדול ופריך, טוב לסלט ולחיתוך גס.",
    "עגבניות שרי בלה מאיה": "שרי מתוקות ועסיסיות, מצוינות לנשנוש וסלט.",
    "מלפפון אורגני בלה מאיה": "מלפפון אורגני בטעם נקי ורענן, פריך במיוחד.",
    "עגבניות אורגניות בלה מאיה": "עגבניות אורגניות מאוזנות למטבח יומי ולרוטב.",
    "מלפפון חמוץ בעבודת יד": "כבישה ביתית עם קראנץ' וחמיצות מאוזנת.",
  };

  if (byExact[n]) return byExact[n];
  if (n.includes("חומץ") && n.includes("תפוח")) return appleCiderVinegarShort;
  if (n.includes("אבוקדו")) return byExact["אבוקדו מוכן לאכילה"]!;
  if (n.includes("פינגר ליים") || n.includes("finger lime")) return byExact["פינגר ליים"]!;
  if (n.includes("שום")) return byExact["שום טרי"]!;
  if (n.includes("תירס")) return byExact["תירס מתוק"]!;
  if (n.includes("ג׳ינג׳ר") || n.includes("ג'ינג'ר") || n.includes("ginger")) return byExact["ג׳ינג׳ר טרי"]!;
  if (n.startsWith("סברס")) return byExact["סברס"]!;
  if (n.includes("ענב")) return "ענב מתוק לאכילה מיידית; כל זן עם פריכות וארומה משלו.";
  if (n.includes("תות")) return "תות ארומטי ומתוק; עדין, מומלץ קירור וצריכה קרובה.";
  if (n.includes("אוכמניות") || n.includes("פטל")) return "פרי יער עדין עם מתיקות־חמיצות מאוזנת; דורש קירור רציף.";
  if (n.includes("מיץ")) return "מיץ טבעי לשתייה מיידית, עם טעם נקי וללא תוספות.";

  return "תוצרת טרייה לפרימיום יומי, מותאמת לאכילה, בישול או אירוח לפי הצורך.";
}

/** תמונת מוצר מייצגת לפי שם/תיאור, לתצוגה במחירון */
export function getProduceImage(name: string, description?: string): string | undefined {
  const n = name.trim();
  const text = `${n} ${description ?? ""}`.toLowerCase();
  const byExactName: Record<string, string> = {
    קרמבולה: "/images/gallery/starfruit-trays.webp",
    "קרמבולה פרימיום": "/images/gallery/starfruit-trays.webp",
    "תמרים ממולאים אגוזי מלך": "/images/gallery/dates-walnut-pack.webp",
    "תות לבבות מיוחד": "/images/gallery/white-strawberries.webp",
    "תות חצאים": "/images/gallery/white-strawberries.webp",
    "אוכמניות כרמל": "/images/gallery/blueberries-pack.webp",
    "אוכמניות גליל ים": "/images/gallery/blueberries-pack.webp",
    "אוכמניות פרו סקויה": "/images/gallery/blueberries-pack.webp",
    "פטל אדום ישראלי": "/images/gallery/mixed-fruit-box.webp",
    "פטל שחור": "/images/gallery/mixed-fruit-box.webp",
    "ענב ירוק קריספי": "/images/gallery/diva-green-grapes.webp",
    "ענב ירוק סוויט גלוב": "/images/gallery/diva-green-grapes.webp",
    "ענב אדום כרימסון": "/images/gallery/diva-green-grapes.webp",
    "ענב שחור סייבל": "/images/gallery/diva-green-grapes.webp",
    "ענב אדום סוויט סלבריישן": "/images/gallery/diva-green-grapes.webp",
    "ענב קריספי": "/images/gallery/diva-green-grapes.webp",
    "אננס חתוך": "/images/gallery/pineapple-sliced-trays.webp",
    "קיווי קלוף": "/images/gallery/kikoka-gold-kiwi.webp",
    "קיווי ירוק": "/images/gallery/kikoka-gold-kiwi.webp",
    "בקבוק חומץ תפוחים": "/images/gallery/red-kissabel-apples.webp",
    "מיקס כרובית טריו": "/images/gallery/colorful-cauliflower.webp",
    "כרובית לבנה": "/images/gallery/colorful-cauliflower.webp",
    "ברוקולי ג׳מבו משק כהן": "/images/gallery/colorful-cauliflower.webp",
    "זר גזר צבעוני": "/images/gallery/fresh-produce-box.webp",
    "נשנושי גזר מתוק": "/images/gallery/fresh-produce-box.webp",
    "אבוקדו מוכן לאכילה": "/images/gallery/fresh-produce-box.webp",
    "מלפפון אורגני בלה מאיה": "/images/gallery/fresh-produce-box.webp",
    "עגבניות אורגניות בלה מאיה": "/images/gallery/fresh-produce-box.webp",
    "תפוז פירמיום": "/images/gallery/mixed-fruit-box.webp",
    "תפוז דם": "/images/gallery/mixed-fruit-box.webp",
    פומלה: "/images/gallery/mixed-fruit-box.webp",
    אבטיח: "/images/gallery/mixed-fruit-box.webp",
    "אבטיח חתוך": "/images/gallery/mixed-fruit-box.webp",
    "מלון כתום": "/images/gallery/mixed-fruit-box.webp",
    "מלון חתוך": "/images/gallery/mixed-fruit-box.webp",
    "קוקוס חתוך": "/images/gallery/mixed-fruit-box.webp",
    "כדורי קוקוס": "/images/gallery/mixed-fruit-box.webp",
    "קוקוס לשתייה עם קש": "/images/gallery/mixed-fruit-box.webp",
    "ג׳ינג׳ר טרי": "/images/gallery/fresh-produce-box.webp",
    "שום טרי": "/images/gallery/fresh-produce-box.webp",
    "תירס מתוק": "/images/gallery/fresh-produce-box.webp",
    "פינגר ליים": "/images/gallery/starfruit-trays.webp",
    "תרד גוליבר צ׳רי": "/images/gallery/fresh-produce-box.webp",
    "אפונת שלג צ׳רי": "/images/gallery/fresh-produce-box.webp",
    "אפונת גינה צ׳רי חדש": "/images/gallery/fresh-produce-box.webp",
    "כורכום צ׳רי": "/images/gallery/fresh-produce-box.webp",
    "בצל ספרדי משק כהן": "/images/gallery/fresh-produce-box.webp",
    "דלעת משק כהן": "/images/gallery/fresh-produce-box.webp",
    "כרוב ניצנים משק כהן": "/images/gallery/colorful-cauliflower.webp",
    "חרשוף משק כהן": "/images/gallery/fresh-produce-box.webp",
    "קוסביה משק כהן": "/images/gallery/fresh-produce-box.webp",
    "שעועית ירוקה משק כהן": "/images/gallery/fresh-produce-box.webp",
    "שעועית צהובה משק כהן": "/images/gallery/fresh-produce-box.webp",
    "שעועית רחבה משק כהן": "/images/gallery/fresh-produce-box.webp",
    פרוס: "/images/gallery/fresh-produce-box.webp",
    חזרת: "/images/gallery/fresh-produce-box.webp",
    "מארז פול": "/images/gallery/fresh-produce-box.webp",
    "אספרגוס טרי": "/images/gallery/asparagus-bundles.webp",
    "עלי גפן טריים (500 גרם)": "/images/gallery/fresh-produce-box.webp",
    "מלפפון ארמטו ענק": "/images/gallery/fresh-produce-box.webp",
    "עגבניות שרי בלה מאיה": "/images/gallery/fresh-produce-box.webp",
    "מלפפון חמוץ בעבודת יד": "/images/gallery/cucumbers-trays.webp",
    סברס: "/images/gallery/mixed-fruit-box.webp",
    "סברס (לק״ג)": "/images/gallery/mixed-fruit-box.webp",
    "גולדן ברי": "/images/gallery/mixed-fruit-box.webp",
    "פקאן בוואקום": "/images/gallery/dates-walnut-pack.webp",
    "פקאן עם קליפה": "/images/gallery/dates-walnut-pack.webp",
    "בקבוק מיץ תפוחים 100% טבעי": "/images/gallery/red-kissabel-apples.webp",
    "בקבוק מיץ תפוחים וגזר 100% טבעי": "/images/gallery/red-kissabel-apples.webp",
    "בקבוק מיץ תפוחים וסלק 100% טבעי": "/images/gallery/red-kissabel-apples.webp",
    "בקבוק מיץ תפוחים וחבוש 100% טבעי": "/images/gallery/red-kissabel-apples.webp",
  };
  const exact = byExactName[n];
  if (exact) return exact;

  // fallback for dynamic sheet rows so every product gets image
  if (/(תות|strawber)/.test(text)) return "/images/gallery/white-strawberries.webp";
  if (/(אוכמנ|blueber|פטל|berry)/.test(text)) return "/images/gallery/blueberries-pack.webp";
  if (/(ענב|grape)/.test(text)) return "/images/gallery/diva-green-grapes.webp";
  if (/(אננס|pineapple)/.test(text)) return "/images/gallery/pineapple-sliced-trays.webp";
  if (/(קרמבולה|starfruit|כוכב)/.test(text)) return "/images/gallery/starfruit-trays.webp";
  if (/(תמר|אגוז|פקאן|nuts|walnut)/.test(text)) return "/images/gallery/dates-walnut-pack.webp";
  if (/(כרובית|ברוקולי|cauliflower|broccoli)/.test(text)) return "/images/gallery/colorful-cauliflower.webp";
  if (/(תפוח|apple)/.test(text)) return "/images/gallery/red-kissabel-apples.webp";
  if (/(קיווי|kiwi)/.test(text)) return "/images/gallery/kikoka-gold-kiwi.webp";
  if (/(מלפפון|עגבני|גזר|אבוקדו|דלעת|תרד|אפונה|שום|בצל|אספרגוס|ירק|vegetable|veg)/.test(text)) {
    return "/images/gallery/fresh-produce-box.webp";
  }
  return "/images/gallery/mixed-fruit-box.webp";
}

/** דף «פירות פרימיום» */
export const FRUIT_PRICE_CATEGORIES: PriceCategory[] = [
  {
    id: "peeled",
    title: "קלופים",
    emoji: "🍊",
    intro: "פירות מוכנים לאכילה.",
    rows: [{ emoji: "🍊", name: "פומלה", price: "15₪" }],
    subsections: [
      {
        title: "חתוך / קלוף",
        note: "1 יח׳ 25₪, 2 יח׳ 40₪",
        rows: [
          { emoji: "🍍", name: "אננס חתוך" },
          { emoji: "🥥", name: "קוקוס חתוך" },
          { emoji: "🍉", name: "אבטיח חתוך" },
          { emoji: "🍈", name: "מלון חתוך" },
          { emoji: "🥝", name: "קיווי קלוף" },
        ],
      },
      {
        title: "סברס",
        rows: [
          { emoji: "🌵", name: "סברס", price: "35₪, 2 יח׳ 60₪" },
          { emoji: "🌵", name: "סברס (לק״ג)", price: "55₪ לק״ג" },
        ],
      },
    ],
  },
  {
    id: "berries",
    title: "פירות יער",
    emoji: "🫐",
    rows: [
      { emoji: "🫐", name: "אוכמניות כרמל", price: "35₪" },
      { emoji: "🫐", name: "אוכמניות גליל ים", price: "30₪" },
      { emoji: "🫐", name: "אוכמניות פרו סקויה", price: "25₪" },
      { emoji: "🍓", name: "פטל אדום ישראלי", price: "40₪" },
      { emoji: "🫐", name: "פטל שחור", price: "50₪" },
      { emoji: "🟡", name: "גולדן ברי", price: "25₪" },
    ],
  },
  {
    id: "grapes",
    title: "ענבים",
    emoji: "🍇",
    subsections: [
      {
        title: "לפי משקל",
        rows: [{ emoji: "🍇", name: "ענב ירוק קריספי", price: "50₪ לק״ג" }],
      },
      {
        title: "שקיות",
        note: "45₪ לק״ג",
        rows: [
          { emoji: "🍇", name: "ענב ירוק סוויט גלוב" },
          { emoji: "🍇", name: "ענב אדום כרימסון" },
          { emoji: "🍇", name: "ענב שחור סייבל" },
        ],
      },
      {
        title: "מארזים 500 גרם",
        note: "20₪, 2 מארזים 30₪",
        rows: [
          { emoji: "🍇", name: "ענב ירוק סוויט גלוב" },
          { emoji: "🍇", name: "ענב שחור סייבל" },
          { emoji: "🍇", name: "ענב אדום סוויט סלבריישן" },
        ],
      },
    ],
  },
  {
    id: "juices",
    title: "מיצים",
    emoji: "🧃",
    rows: [
      { emoji: "🧃", name: "בקבוק מיץ תפוחים 100% טבעי", price: "25₪" },
      { emoji: "🧃", name: "בקבוק מיץ תפוחים וגזר 100% טבעי", price: "25₪" },
      { emoji: "🧃", name: "בקבוק מיץ תפוחים וסלק 100% טבעי", price: "25₪" },
      { emoji: "🧃", name: "בקבוק מיץ תפוחים וחבוש 100% טבעי", price: "25₪" },
    ],
    subsections: [
      {
        title: "רגיל",
        rows: [{ emoji: "🍇", name: "ענב קריספי", price: "20₪ ליחידה" }],
      },
      {
        title: "תותים",
        rows: [
          { emoji: "🍓", name: "תות לבבות מיוחד", price: "35₪" },
          { emoji: "🍓", name: "תות חצאים", price: "15₪, 2 יח׳ 25₪" },
        ],
      },
    ],
  },
  {
    id: "specials",
    title: "מיוחדים",
    emoji: "✨",
    intro: "פירות לפי ק״ג, אגוזים ועוד.",
    rows: [
      { emoji: "🥥", name: "קוקוס לשתייה עם קש", price: "20₪, 2 יח׳ 30₪" },
      { emoji: "⚪", name: "כדורי קוקוס", price: "20₪, 2 יח׳ 30₪" },
      { emoji: "⭐", name: "קרמבולה פרימיום", price: "40₪ לק״ג" },
      { emoji: "🍊", name: "תפוז דם", price: "12₪ לק״ג" },
      { emoji: "🍊", name: "תפוז פירמיום", price: "15₪ לק״ג" },
      { emoji: "🥝", name: "קיווי ירוק", price: "20₪ לק״ג" },
      { emoji: "🍈", name: "מלון כתום", price: "15₪ לק״ג" },
      { emoji: "🍉", name: "אבטיח", price: "12₪ לק״ג" },
      { emoji: "🥜", name: "פקאן בוואקום", price: "40₪ מארז" },
      { emoji: "🥜", name: "פקאן עם קליפה", price: "30₪ מארז" },
      { emoji: "🍎", name: "בקבוק חומץ תפוחים", price: "25₪" },
    ],
  },
];

/** דף «ירקות פרימיום» */
export const VEGETABLE_PRICE_CATEGORIES: PriceCategory[] = [
  {
    id: "vegetables",
    title: "מחירון ירקות",
    emoji: "🥬",
    intro: "משק כהן, בלה מאיה ועוד, לפי מלאי ועונה.",
    rows: [
      { emoji: "🫚", name: "ג׳ינג׳ר טרי", price: "25₪ לק״ג" },
      { emoji: "🥑", name: "אבוקדו מוכן לאכילה", price: "15₪, 2 יח׳ 25₪" },
      { emoji: "🧄", name: "שום טרי", price: "30₪ לק״ג" },
      { emoji: "🌽", name: "תירס מתוק", price: "30₪ מארז" },
      { emoji: "🍋‍🟩", name: "פינגר ליים", price: "20₪ ליחידה" },
    ],
    subsections: [
      {
        title: "מארזים 20₪, 2 מארזים 30₪",
        rows: [
          { emoji: "🥬", name: "תרד גוליבר צ׳רי" },
          { emoji: "🫛", name: "אפונת שלג צ׳רי" },
          { emoji: "🫛", name: "אפונת גינה צ׳רי חדש" },
          { emoji: "🟠", name: "כורכום צ׳רי" },
          { emoji: "🥦", name: "מיקס כרובית טריו" },
          { emoji: "🥦", name: "כרובית לבנה" },
          { emoji: "🥕", name: "זר גזר צבעוני" },
          { emoji: "🥕", name: "נשנושי גזר מתוק" },
          { emoji: "🥦", name: "ברוקולי ג׳מבו משק כהן" },
          { emoji: "🧅", name: "בצל ספרדי משק כהן" },
          { emoji: "🎃", name: "דלעת משק כהן" },
          { emoji: "🥬", name: "כרוב ניצנים משק כהן" },
          { emoji: "🥬", name: "חרשוף משק כהן" },
          { emoji: "🫛", name: "קוסביה משק כהן" },
          { emoji: "🫛", name: "שעועית ירוקה משק כהן" },
          { emoji: "🫛", name: "שעועית צהובה משק כהן" },
          { emoji: "🫛", name: "שעועית רחבה משק כהן" },
          { emoji: "🥬", name: "פרוס" },
          { emoji: "🤍", name: "חזרת" },
          { emoji: "🫘", name: "מארז פול", price: "15₪, 2 מארזים 25₪" },
        ],
      },
      {
        title: "נוספים",
        rows: [
          { emoji: "🌿", name: "אספרגוס טרי", price: "30₪" },
          { emoji: "🍃", name: "עלי גפן טריים (500 גרם)", price: "35₪" },
          { emoji: "🥒", name: "מלפפון ארמטו ענק", price: "20₪" },
          { emoji: "🍅", name: "עגבניות שרי בלה מאיה", price: "20₪" },
          { emoji: "🥒", name: "מלפפון אורגני בלה מאיה", price: "25₪" },
          { emoji: "🍅", name: "עגבניות אורגניות בלה מאיה", price: "25₪ לק״ג" },
        ],
      },
      {
        title: "בקבוקים",
        rows: [{ emoji: "🥒", name: "מלפפון חמוץ בעבודת יד", price: "20₪" }],
      },
    ],
  },
];

/** שמות שמותר שיופיעו פעמיים (מארז מול שקית וכו׳) */
const INTENTIONAL_DUPLICATE_PRODUCT_NAMES = new Set<string>(["ענב ירוק סוויט גלוב", "ענב שחור סייבל"]);

/**
 * שמות מוצר שמופיעים יותר מהמותר במחירון, לניפוי כפילויות בגיליון או בקוד.
 * ב־DEV אפשר להדפיס אזהרה לפי הרשימה.
 */
export function findDuplicateDisplayNamesInCategories(categories: PriceCategory[]): string[] {
  const counts = new Map<string, number>();
  const bump = (raw: string) => {
    const n = raw.trim().replace(/\s+/g, " ");
    if (!n) return;
    counts.set(n, (counts.get(n) ?? 0) + 1);
  };
  for (const cat of categories) {
    for (const r of cat.rows ?? []) bump(r.name);
    for (const sub of cat.subsections ?? []) {
      for (const r of sub.rows) bump(r.name);
    }
  }
  return [...counts.entries()]
    .filter(([name, c]) => {
      if (INTENTIONAL_DUPLICATE_PRODUCT_NAMES.has(name)) return c > 2;
      return c > 1;
    })
    .map(([name]) => name);
}

/** לשימוש חיצוני (הדפסה / ייצוא), כל הקטגוריות */
export const PRICE_CATEGORIES: PriceCategory[] = [
  ...FRUIT_PRICE_CATEGORIES,
  ...VEGETABLE_PRICE_CATEGORIES,
];
