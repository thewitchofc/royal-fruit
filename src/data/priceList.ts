/** מחירון, עדכון תאריכים ומחירים כאן */

export type PriceWeightOption = {
  weight: string;
  price: string;
};

export type PriceRow = {
  emoji: string;
  name: string;
  price?: string;
  /** משקל / מארז / יחידה / מדרגות מחיר, מהגיליון או מקוד */
  unit?: string;
  description?: string;
  /** מוצר אחד עם מדרגות משקל (שם = מוצר, מחיר לפי בחירה) */
  weightOptions?: PriceWeightOption[];
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
    "אננס חתוך מארז": "אננס חתוך במארז מוכן לאכילה; מתוק, חמצמץ ועסיסי.",
    "אננס קאפי": "אננס Kapi פרימיום מקוסטה ריקה; מתוק, עסיסי וארומטי עם סרט סגול מובחר.",
    "אננס קאפי יחידה": "אננס Kapi פרימיום מקוסטה ריקה; מתוק, עסיסי וארומטי — יחידה עם סרט סגול.",
    "קוקוס חתוך": "בשר קוקוס טרי ופריך; מתיקות עדינה, מתאים גם לקינוחים.",
    "אבטיח חתוך": "עסיסי ומרענן, מוכן להגשה; מתיקות רכה ומרקם מים.",
    "מלון חתוך": "מתוק ובשרני עם ארומה בולטת; מתאים למגשי אירוח ולקינוח קליל.",
    "פומלה קלופה": "פומלה קלופה מוכנה לאכילה; מתוקה־עדינה, עסיסית ומרעננת — מושלמת לנשנוש ולמגש.",
    "פומלה קלופה מארז": "פומלה קלופה במארז מוכן לאכילה; מתוקה־עדינה, עסיסית ומרעננת.",
    "קיווי קלוף": "חמצמץ־מתקתק ומוכן לשימוש; חמיצות חדה ומרעננת.",
    סברס: "מתוק עדין וקריר; מרקם גרגירי עדין, ייחודי בצלחת ובסלט פירות.",
    "אוכמניות כרמל": "מתיקות מאוזנת ומרקם יציב; עסיסיות נעימה ונוחה לנשנוש.",
    "אוכמניות כרמל בינוני": "אוכמניות כרמל בינוניות מרמת הגולן; עסיסיות, מתוקות וטריות — 125 גרם במארז.",
    "אוכמניות כרמל בינוני מארז": "אוכמניות כרמל בינוניות במארז; עסיסיות, מתוקות וטריות.",
    "אוכמניות כרמל גדול": "אוכמניות כרמל גדולות; עסיסיות, מתוקות ומובחרות — 125 גרם במארז.",
    "אוכמניות כרמל גדול מארז": "אוכמניות כרמל גדולות במארז; עסיסיות, מתוקות ומובחרות.",
    "אוכמניות ישראלי": "אוכמניות מחקלאות מקומית; גדולות, עסיסיות וטריות — 250 גרם במארז.",
    "אוכמניות ישראלי מארז": "אוכמניות מחקלאות מקומית במארז; גדולות, עסיסיות וטריות.",
    "אוכמניות גליל ים": "אוכמניה מוצקה ומתוקה, מצוינת לנשנוש וקינוחים.",
    "אוכמניות פרו סקויה": "אוכמניות סקויה גדולות ומובחרות; מתוקות, עסיסיות ואחידות במארז.",
    "פטל אדום ישראלי": "ארומטי ועדין מאוד; שברירי, כדאי לקירור ולטיפול עדין.",
    "פטל שחור": "טעם עמוק, מתקתק־חמצמץ; בולט בקינוחים ובמגשי פרימיום.",
    "פטל שחור רובי מארז": "פטל שחור רובי במארז; עסיסי, מתוק־חמצמץ ומושלם לנשנוש וקינוח.",
    "פטל שחור בכר": "פטל שחור אסנה משק בכר; עסיסי, מתוק־חמצמץ ומושלם לנשנוש וקינוח.",
    "פטל שחור בכר מארז": "פטל שחור אסנה משק בכר במארז; עסיסי, מתוק־חמצמץ ומושלם לנשנוש וקינוח.",
    "פטל אדום בהר מארז": "פטל אדום «פטל בהר» במארז; מתוק, עסיסי וטרי לנשנוש וקינוח.",
    "דובדבן אדום": "דובדבן אדום עסיסי ומתוק; בוהק, טרי ומושלם לעונה — דובדבני אבו עלם.",
    "דובדבן הזהב אדום": "דובדבן הזהב אדום מתוק; מובחר, עסיסי וטרי — 250 גרם במארז.",
    מישמש: "משמש ארומה קוט מתוק ועסיסי; כתום־אדום, רך וארומטי — פירות בן־דור איכות עלית.",
    משמש: "משמש ארומה קוט מתוק ועסיסי; כתום־אדום, רך וארומטי — פירות בן־דור איכות עלית.",
    דומדמניות: "דומדמניות אדומות טריות; חמצמצות־מתוקות, עסיסיות ומושלמות לקינוח ולמגש.",
    "דומדמניות מארז": "דומדמניות אדומות במארז 125 גרם; טריות, עסיסיות ומובחרות.",
    "תות פקיסטני": "תות עץ פקיסטני ארוך ומתוק; עסיסי, מיוחד ומושלם לעונה — 125 גרם במארז.",
    "תות עץ": "תות עץ פקיסטני ארוך ומתוק; עסיסי, מיוחד ומושלם לעונה.",
    "דובדבן לבן": "דובדבן לבן־צהוב עם סומק אדום; מתוק, עסיסי ומיוחד לעונה.",
    "גולדן ברי": "חמצמץ־טרופי עם מתיקות קלה; טעם חד ואקזוטי.",
    "תות לבבות מיוחד": "מתוק ובשל להגשה; שלם ומרשים בצלחת ובאירוח.",
    "תות חצאים": "פתרון מהיר לקינוח או מגש, בלי חיתוך נוסף; מומלץ לצריכה קרובה.",
    "ענב ירוק קריספי": "פריך ומתוק, מושלם לנשנוש; קראנץ' בולט ונקי.",
    "ענב ירוק סוויט גלוב": "ירוק מתוק ופריך, קל לאכילה ישירות מהמארז.",
    "ענב ירוק ישראלי": "ענב ירוק ישראלי «ביג פרל»; גדול, עסיסי ומתוק — ארבעונות איכותי.",
    "ענב אדום ישראלי": "ענב אדום ישראלי «פייר קיס»; ללא חרצנים, מתוק ועסיסי — ארבעונות איכותי.",
    "ענב אדום כרימסון": "ענב אדום מאוזן ומתוק, מרקם עדין ונעים.",
    "ענב שחור סייבל": "ארומה עמוקה ומתיקות בולטת; טעם מודגש ועשיר.",
    "ענב אדום סוויט סלבריישן": "אדום מתוק להגשה ואירוח, מרקם עדין.",
    "ענב קריספי": "ענבים פריכים במיוחד עם ביס חד ונקי.",
    "קוקוס לשתייה עם קש": "מי קוקוס לשתייה בלבד, טריים לשימוש מיידי, קלילים ומרעננים.",
    "כדורי קוקוס": "נשנוש קוקוס טבעי מוכן לאכילה, מרקם עשיר וסיבי.",
    "כדורי קוקוס יחידה": "נשנוש קוקוס טבעי מוכן לאכילה, מרקם עשיר וסיבי.",
    קרמבולה: "חמצמץ־מתקתק עם חיתוך כוכב ייחודי; מצוין לקישוט צלחות ולמגשי אירוח.",
    "קרמבולה פרימיום": "חמצמץ־מתקתק עם חיתוך כוכב ייחודי; מצוין לקישוט צלחות ולמגשי אירוח.",
    "תפוז דם": "הדר ארומטי עם מתיקות־חמיצות עמוקה וצבע בשר בולט.",
    "תפוז פירמיום": "תפוז מתוק ומאוזן לשתייה/אכילה יומית.",
    "קיווי ירוק": "חמצמץ־מתוק עם סיבים עדינים; קליפה חומה ופרווה, בשר ירוק עז — מרענן וקליל.",
    "קיווי צהוב": "מתוק ועסיסי, בלי שיער; בשר צהוב־זהב רך ומרענן — SunGold מובחר.",
    "מלון כתום": "מתוק וארומטי, בשרני וריח בולט.",
    מלון: "מתוק וארומטי, בשרני וריח בולט; טרי ועסיסי לעונה.",
    אבטיח: "מרענן ועסיסי מאוד; מתיקות קלילה ומרקם מים.",
    מנגו: "מתוק, עסיסי וארומטי; בשר רך ועשיר — מושלם לנשנוש ולקינוח.",
    נקטרינה: "מתוקה, עסיסה וחלקה; קליפה דקה וטעם אפרסקי עדין — מושלמת לעונה.",
    פאפאיה: "מתוקה, עסיסה וטרופית; בשר רך וריח עדין — מושלמת לעונה.",
    "פאפאיה זוג מארז": "פאפאיה טרייה במארז זוג; מתוקה, עסיסה וטרופית.",
    "שזיף מיטלי": "שזיף מתוק־חמצמץ, עסיסי ורך; קליפה סגולה־אדומה ובשר בוהק — מושלם לעונה.",
    גויאבה: "מתוקה־חמצמצה, ארומטית ועסיסה; קליפה ירוקה ובשר לבן רך — טרופית ומרעננת.",
    קלמנטינה: "מתוקה, עסיסה וקלה לקליפה; הדר קטן ונוח לנשנוש — טרי ומרענן.",
    "אפרסק לבן": "מתוק ועסיסי, קליפה בהירה ובשר לבן־קרם רך; עדין ומושלם לעונה.",
    תאנים: "תאנים טריות מישראל; מתוקות, רכות ועסיסיות — מושלמות לעונה.",
    תאנה: "תאנים טריות מישראל; מתוקות, רכות ועסיסיות — מושלמות לעונה.",
    "תאנה מארז": "תאנים טריות במארז מישראל; מתוקות, רכות ועסיסיות.",
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
    "עלי גפן חמוצים": "עלי גפן ממולאים בעבודת יד; חמיצות מאוזנת ומרקם רך.",
    "כרוב חמוץ": "כרוב כבוש בעבודת יד; חמיצות נעימה ופריך טבעי.",
    "בצל חמוץ מתוק": "בצל ממולא ובישול מתוק־חמוץ; עבודת יד ומאוזן לצד מנות.",
    "מלפפון ארמטו ענק": "מלפפון גדול ופריך, טוב לסלט ולחיתוך גס.",
    "עגבניות שרי בלה מאיה": "שרי מתוקות ועסיסיות, מצוינות לנשנוש וסלט.",
    "מלפפון אורגני בלה מאיה": "מלפפון אורגני בטעם נקי ורענן, פריך במיוחד.",
    "עגבניות אורגניות בלה מאיה": "עגבניות אורגניות מאוזנות למטבח יומי ולרוטב.",
    "מלפפון חמוץ": "מלפפונים חמוצים בצנצנת; קראנץ' וחמיצות מאוזנות לצד מנות וסלטים.",
    "מלפפון חמוץ בעבודת יד": "כבישה ביתית עם קראנץ' וחמיצות מאוזנת.",
    "חלפיניו מוחמץ": "חלפיניו פרוס במלחלוח חמוץ־חריף; מתאים לסנדוויצ'ים, סלטים ותיבול.",
    שיפקה: "פלפל שיפקה מוחמץ שלם; חריפות נעימה לצד מנות, סלטים וכריכים.",
    "כרובית חמוצה": "כרובית מוחמצת בצנצנת; חמיצות נעימה ופריכות לצד מנות וסלטים.",
    "לפת מוחמץ": "לפת מוחמצת בצבע ורוד־סגול; חמיצות קלאסית לסלטים, פיתות ומנות ביתיות.",
    "לפת מוחמצת": "לפת מוחמצת בצבע ורוד־סגול; חמיצות קלאסית לסלטים, פיתות ומנות ביתיות.",
    זיתים: "זיתים ירוקים מוחמצים בצנצנת; מתאימים למזנונים, סלטים וארוחות ביתיות.",
    "מיקס חמוצים": "תערובת ירקות מוחמצים בצנצנת; מגוון טעמים וצבעים לצד מנות וסלטים.",
    "תות קפוא": "תות שדה מוקפא 100% פרי; מתאים לשייקים, קינוחים ואפייה.",
    "תות שדה מוקפא": "תות שדה מוקפא 100% פרי; מתאים לשייקים, קינוחים ואפייה.",
    "אננס קפוא": "חתיכות אננס מוקפאות 100% פרי; מתאימות לשייקים, קינוחים ואפייה.",
    "חתיכות אננס מוקפאות": "חתיכות אננס מוקפאות 100% פרי; מתאימות לשייקים, קינוחים ואפייה.",
    "תות בננה קפוא": "תות שדה ופרוסות בננה מוקפאים 100% פרי; מתאים לשייקים וקינוחים.",
    "תות בננה": "תות שדה ופרוסות בננה מוקפאים 100% פרי; מתאים לשייקים וקינוחים.",
    גוואקמולי: "ממרח אבוקדו בשל ומתובל; מוכן למריחה, טוסטים ומנות.",
    "ממרח אבוקדו": "ממרח אבוקדו בשל ומתובל; מוכן למריחה, טוסטים ומנות.",
    "פטל מצופה בפיסטוק": "פטל בציפוי שוקולד לבן ופיסטוק קפוא; מתוק־מלוח לקינוח ונשנוש.",
    "פטל מצופה בשוקולד חלב ושוקולד לבן":
      "פטל בציפוי כפול — שוקולד לבן ושוקולד חלב; מתוק וקרמי לקינוח ונשנוש.",
    "פטל מצופה בשוקולד מריר": "פטל קפוא מצופה בשוקולד מריר; עמוק ומתוק לקינוח ונשנוש.",
    "פטל שחור מצופה בשוקולד חלב ושוקולד לבן":
      "פטל שחור קפוא בציפוי כפול — שוקולד לבן ושוקולד חלב; מתוק ועשיר לקינוח.",
    "פטל מצופה בשוקולד לבן ועוגיות":
      "פטל קפוא בשוקולד לבן ועוגיות; מתוק וקרמי לקינוח ונשנוש.",
    "פטל מצופה בשוקולד לבן": "פטל קפוא בשוקולד לבן ועוגיות; מתוק וקרמי לקינוח ונשנוש.",
    "תות מצופה בשוקולד לבן ושוקולד חלב":
      "תות שדה מצופה בציפוי כפול — שוקולד לבן ושוקולד חלב; מתוק לקינוח ונשנוש.",
    "תות מצופה בשוקולד חלב ושוקולד לבן":
      "תות שדה מצופה בציפוי כפול — שוקולד לבן ושוקולד חלב; מתוק לקינוח ונשנוש.",
    "תות מצופה שוקולד מריר": "תות שדה מצופה בשוקולד מריר קפוא; עמוק ומתוק לקינוח ונשנוש.",
    "אגוזי לוז": "חלווה שומשום עם אגוזי לוז; יחידה 350 גרם. טעם אגוזי קלאסי ומרקם פריך.",
    פיסטק: "חלווה שומשום עם פיסטוק; יחידה 350 גרם. טעם אגוזי־ירוק ומרקם עשיר.",
    פקאן: "חלווה שומשום עם פקאן; יחידה 350 גרם. קראנץ' אגוזי ומתיקות עמוקה.",
    "טעם של פעם": "חלווה קלאסית בטעם מסורתי; יחידה 350 גרם. רכה ומתקתקת.",
    "טחינה אתיופית": "טחינה גולמית ארומטית; למריחה, למרקים ולתיבול.",
    "טחינה מלאה עם וניל טהור": "טחינה מלאה עם ניחוח וניל עדין; מתאימה למתיקות קלה.",
    "טחינה וניל": "טחינה עם וניל; טעם עדין ומרקם קרמי.",
    "טחינה עם אגוזי לוז וקקאו": "שילוב אגוזי לוז וקקאו בטחינה; גוף קרמי ועשיר.",
    "טחינה אגוזי לוז וקקאו": "שילוב אגוזי לוז וקקאו בטחינה; גוף קרמי ועשיר.",
    "טחינה אגוז לוז וקקאו": "שילוב אגוזי לוז וקקאו בטחינה; גוף קרמי ועשיר.",
    "קרם פיסטוק": "ממרח קרם פיסטוק; מתיקות מאוזנת ומרקם חלק.",
    "קרם אגוזי לוז": "ממרח קרם אגוזי לוז; קרמי, אגוזי ונוח למריחה.",
    "קרם אגוז לוז": "ממרח קרם אגוזי לוז; קרמי, אגוזי ונוח למריחה.",
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

/** ערך יחיד או עד 4 תמונות למוצר */
export type ProductImageEntry = string | readonly string[];

export const MAX_PRODUCT_IMAGES = 4;

/** מוצרים שמוצגים בלי תמונה (placeholder בלבד) */
const PRODUCTS_WITHOUT_IMAGES = ["קולסלאו", "עגבניות מיובשות", "גוואקמולי"] as const;

function productHasNoImage(name: string) {
  const n = name.trim();
  return PRODUCTS_WITHOUT_IMAGES.some(
    (prefix) => n === prefix || n.startsWith(`${prefix} `) || n.startsWith(`${prefix}·`),
  );
}

/** ממפה שם מוצר → תמונה/ות (גלריה WebP; קטלוג PNG) */
const BY_EXACT_PRODUCT_IMAGES: Record<string, ProductImageEntry> = {
    קרמבולה: ["/images/catalog/carambola-whole.png", "/images/catalog/carambola-sliced.png"],
    "קרמבולה פרימיום": ["/images/catalog/carambola-whole.png", "/images/catalog/carambola-sliced.png"],
    "תמרים ממולאים אגוזי מלך": "/images/gallery/dates-walnut-pack.webp",
    "תות לבבות מיוחד": "/images/gallery/white-strawberries.webp",
    "תות חצאים": "/images/gallery/white-strawberries.webp",
    "אוכמניות כרמל": "/images/gallery/blueberries-pack.webp",
    "אוכמניות כרמל בינוני": [
      "/images/catalog/blueberry-carmel-medium-pack.png",
      "/images/catalog/blueberry-carmel-medium-open.png",
    ],
    "אוכמניות כרמל בינוני מארז": [
      "/images/catalog/blueberry-carmel-medium-pack.png",
      "/images/catalog/blueberry-carmel-medium-open.png",
    ],
    "אוכמניות כרמל גדול": [
      "/images/catalog/blueberry-carmel-large-pack.png",
      "/images/catalog/blueberry-carmel-large-open.png",
    ],
    "אוכמניות כרמל גדול מארז": [
      "/images/catalog/blueberry-carmel-large-pack.png",
      "/images/catalog/blueberry-carmel-large-open.png",
    ],
    "אוכמניות ישראלי": [
      "/images/catalog/blueberry-israeli-pack.png",
      "/images/catalog/blueberry-israeli-open.png",
    ],
    "אוכמניות ישראלי מארז": [
      "/images/catalog/blueberry-israeli-pack.png",
      "/images/catalog/blueberry-israeli-open.png",
    ],
    "אוכמניות גליל ים": "/images/gallery/blueberries-pack.webp",
    "אוכמניות פרו סקויה": [
      "/images/catalog/blueberry-peru-sekoya-pack.png",
      "/images/catalog/blueberry-peru-sekoya-open.png",
    ],
    "פטל אדום ישראלי": "/images/gallery/mixed-fruit-box.webp",
    "פטל שחור": "/images/gallery/mixed-fruit-box.webp",
    "פטל שחור רובי מארז": [
      "/images/catalog/blackberry-ruby-pack.png",
      "/images/catalog/blackberry-ruby-open-1.png",
      "/images/catalog/blackberry-ruby-open-2.png",
    ],
    "פטל שחור בכר": [
      "/images/catalog/blackberry-bechar-pack.png",
      "/images/catalog/blackberry-bechar-open.png",
    ],
    "פטל שחור בכר מארז": [
      "/images/catalog/blackberry-bechar-pack.png",
      "/images/catalog/blackberry-bechar-open.png",
    ],
    "פטל אדום בהר מארז": [
      "/images/catalog/raspberry-bahar-pack.png",
      "/images/catalog/raspberry-bahar-open-1.png",
      "/images/catalog/raspberry-bahar-open-2.png",
    ],
    "דובדבן אדום": ["/images/catalog/red-cherry-pack.png", "/images/catalog/red-cherry-open.png"],
    "דובדבן הזהב אדום": [
      "/images/catalog/golden-cherry-red-pack.png",
      "/images/catalog/golden-cherry-red-open.png",
    ],
    מישמש: ["/images/catalog/apricot-pack.png", "/images/catalog/apricot-open.png"],
    משמש: ["/images/catalog/apricot-pack.png", "/images/catalog/apricot-open.png"],
    דומדמניות: ["/images/catalog/red-currant-pack.png", "/images/catalog/red-currant-open.png"],
    "דומדמניות מארז": ["/images/catalog/red-currant-pack.png", "/images/catalog/red-currant-open.png"],
    "תות פקיסטני": [
      "/images/catalog/pakistani-mulberry-pack.png",
      "/images/catalog/pakistani-mulberry-open.png",
    ],
    "תות עץ": ["/images/catalog/pakistani-mulberry-pack.png", "/images/catalog/pakistani-mulberry-open.png"],
    "דובדבן לבן": [
      "/images/catalog/white-cherry-pack.png",
      "/images/catalog/white-cherry-open.png",
    ],
    "פומלה קלופה": ["/images/catalog/peeled-pomelo-pack.png", "/images/catalog/peeled-pomelo-open.png"],
    "פומלה קלופה מארז": ["/images/catalog/peeled-pomelo-pack.png", "/images/catalog/peeled-pomelo-open.png"],
    "ענב ירוק ישראלי": "/images/catalog/green-grapes-israeli-pack.png",
    "ענב אדום ישראלי": "/images/catalog/red-grapes-israeli-pack.png",
    "ענב ירוק קריספי": "/images/gallery/diva-green-grapes.webp",
    "ענב ירוק סוויט גלוב": "/images/gallery/diva-green-grapes.webp",
    "ענב אדום כרימסון": "/images/gallery/diva-green-grapes.webp",
    "ענב שחור סייבל": "/images/gallery/diva-green-grapes.webp",
    "ענב אדום סוויט סלבריישן": "/images/gallery/diva-green-grapes.webp",
    "ענב קריספי": "/images/gallery/diva-green-grapes.webp",
    "אננס חתוך": [
      "/images/catalog/pineapple-sliced-pack.png",
      "/images/catalog/pineapple-sliced-open.png",
    ],
    "אננס חתוך מארז": [
      "/images/catalog/pineapple-sliced-pack.png",
      "/images/catalog/pineapple-sliced-open.png",
    ],
    "אננס קאפי": [
      "/images/catalog/pineapple-kapi-labeled.png",
      "/images/catalog/pineapple-kapi-slice.png",
    ],
    "אננס קאפי יחידה": [
      "/images/catalog/pineapple-kapi-labeled.png",
      "/images/catalog/pineapple-kapi-slice.png",
    ],
    "קיווי קלוף": "/images/gallery/kikoka-gold-kiwi.webp",
    "קיווי ירוק": "/images/catalog/green-kiwi-tray.png",
    "קיווי צהוב": ["/images/catalog/yellow-kiwi-whole.png", "/images/catalog/yellow-kiwi-cut.png"],
    "בקבוק חומץ תפוחים": "/images/catalog/apple-cider-vinegar.png",
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
    אבטיח: ["/images/catalog/watermelon-whole.png", "/images/catalog/watermelon-half.png"],
    מנגו: ["/images/catalog/mango-whole.png", "/images/catalog/mango-halves.png"],
    נקטרינה: "/images/catalog/nectarine-tray.png",
    פאפאיה: ["/images/catalog/papaya-pack.png", "/images/catalog/papaya-open.png"],
    "פאפאיה זוג מארז": ["/images/catalog/papaya-pack.png", "/images/catalog/papaya-open.png"],
    "שזיף מיטלי": "/images/catalog/plum-methley-tray.png",
    גויאבה: ["/images/catalog/guava-whole.png", "/images/catalog/guava-cut.png"],
    קלמנטינה: ["/images/catalog/clementine-whole.png", "/images/catalog/clementine-peeled.png"],
    "אפרסק לבן": "/images/catalog/white-peach-tray.png",
    תאנים: ["/images/catalog/figs-pack.png", "/images/catalog/figs-open.png"],
    תאנה: ["/images/catalog/figs-pack.png", "/images/catalog/figs-open.png"],
    "תאנה מארז": ["/images/catalog/figs-pack.png", "/images/catalog/figs-open.png"],
    "אבטיח חתוך": "/images/catalog/watermelon-sliced.png",
    מלון: "/images/catalog/melon-whole.png",
    "מלון כתום": "/images/catalog/melon-whole.png",
    "מלון חתוך": "/images/catalog/melon-sliced.png",
    "קוקוס חתוך": "/images/catalog/coconut-sliced.png",
    "כדורי קוקוס": [
      "/images/catalog/coconut-ball-whole.png",
      "/images/catalog/coconut-ball-halves-tray.png",
    ],
    "כדורי קוקוס יחידה": [
      "/images/catalog/coconut-ball-whole.png",
      "/images/catalog/coconut-ball-halves-tray.png",
    ],
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
    "מלפפון חמוץ": "/images/catalog/pickled-cucumber.png",
    "מלפפון חמוץ בעבודת יד": "/images/catalog/pickled-cucumber.png",
    סברס: "/images/gallery/mixed-fruit-box.webp",
    "סברס (לק״ג)": "/images/gallery/mixed-fruit-box.webp",
    "גולדן ברי": "/images/gallery/mixed-fruit-box.webp",
    "פקאן בוואקום": "/images/catalog/pecan-vacuum.png",
    "פקאן עם קליפה": "/images/catalog/pecan-in-shell.png",
    "מיץ תפוחים": "/images/catalog/juice-apple.png",
    "מיץ תפוחים וגזר": "/images/catalog/juice-apple-carrot.png",
    "מיץ תפוחים וסלק": "/images/catalog/juice-apple-beet.png",
    "מיץ תפוחים וחבוש": "/images/catalog/juice-apple-quince.png",
    "בקבוק מיץ תפוחים 100% טבעי": "/images/catalog/juice-apple.png",
    "בקבוק מיץ תפוחים וגזר 100% טבעי": "/images/catalog/juice-apple-carrot.png",
    "בקבוק מיץ תפוחים וסלק 100% טבעי": "/images/catalog/juice-apple-beet.png",
    "בקבוק מיץ תפוחים וחבוש 100% טבעי": "/images/catalog/juice-apple-quince.png",
    "אגוזי לוז": "/images/catalog/halva-oznei-looz.png",
    פיסטק: "/images/catalog/halva-pistachio.png",
    פקאן: "/images/catalog/halva-pecan.png",
    "טעם של פעם": "/images/catalog/halva-taam-shel-paam.png",
    "טחינה אתיופית": "/images/catalog/tahini-ethiopian.png",
    "טחינה מלאה עם וניל טהור": "/images/catalog/tahini-vanilla.png",
    "טחינה וניל": "/images/catalog/tahini-vanilla.png",
    "טחינה עם אגוזי לוז וקקאו": "/images/catalog/tahini-hazelnut-cocoa.png",
    "טחינה אגוזי לוז וקקאו": "/images/catalog/tahini-hazelnut-cocoa.png",
    "טחינה אגוז לוז וקקאו": "/images/catalog/tahini-hazelnut-cocoa.png",
    "קרם פיסטוק": "/images/catalog/cream-pistachio.png",
    "קרם אגוזי לוז": "/images/catalog/cream-hazelnut.png",
    "קרם אגוז לוז": "/images/catalog/cream-hazelnut.png",
    "עלי גפן חמוצים": "/images/catalog/kitchen-grape-leaves.png",
    "כרוב חמוץ": "/images/catalog/kitchen-sauerkraut.png",
    "בצל חמוץ מתוק": "/images/catalog/kitchen-sweet-onion.png",
    "חלפיניו מוחמץ": "/images/catalog/pickled-jalapeno.png",
    שיפקה: "/images/catalog/pickled-shipka.png",
    "כרובית חמוצה": "/images/catalog/pickled-cauliflower.png",
    "לפת מוחמץ": "/images/catalog/pickled-turnip.png",
    "לפת מוחמצת": "/images/catalog/pickled-turnip.png",
    זיתים: "/images/catalog/pickled-olives.png",
    "מיקס חמוצים": "/images/catalog/pickled-mix.png",
    "תות קפוא": "/images/catalog/frozen-strawberry.png",
    "תות שדה מוקפא": "/images/catalog/frozen-strawberry.png",
    "אננס קפוא": "/images/catalog/frozen-pineapple.png",
    "חתיכות אננס מוקפאות": "/images/catalog/frozen-pineapple.png",
    "תות בננה קפוא": "/images/catalog/frozen-strawberry-banana.png",
    "תות בננה": "/images/catalog/frozen-strawberry-banana.png",
    "ממרח אבוקדו": "/images/catalog/guacamole.png",
    "פטל מצופה בפיסטוק": "/images/catalog/raspberry-pistachio-coated.png",
    "פטל מצופה בשוקולד חלב ושוקולד לבן": "/images/catalog/raspberry-double-chocolate.png",
    "פטל מצופה בשוקולד מריר": "/images/catalog/raspberry-dark-chocolate.png",
    "פטל שחור מצופה בשוקולד חלב ושוקולד לבן":
      "/images/catalog/black-raspberry-double-chocolate.png",
    "פטל מצופה בשוקולד לבן ועוגיות": "/images/catalog/raspberry-white-chocolate-cookies.png",
    "פטל מצופה בשוקולד לבן": "/images/catalog/raspberry-white-chocolate-cookies.png",
    "תות מצופה בשוקולד לבן ושוקולד חלב": "/images/catalog/strawberry-double-chocolate.png",
    "תות מצופה בשוקולד חלב ושוקולד לבן": "/images/catalog/strawberry-double-chocolate.png",
    "תות מצופה שוקולד מריר": "/images/catalog/strawberry-dark-chocolate.png",
};

/** מנרמל לרשימת עד 4 נתיבים ייחודיים */
export function normalizeProduceImages(entry: ProductImageEntry | undefined): readonly string[] {
  if (!entry) return [];
  const list = typeof entry === "string" ? [entry] : [...entry];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of list) {
    const src = raw.trim();
    if (!src || seen.has(src)) continue;
    seen.add(src);
    out.push(src);
    if (out.length >= MAX_PRODUCT_IMAGES) break;
  }
  return out;
}

function resolveProduceImageEntry(
  name: string,
  description?: string,
  categoryTitle?: string,
): ProductImageEntry | undefined {
  const n = name.trim();
  if (productHasNoImage(n)) return undefined;

  const text = `${n} ${description ?? ""}`.toLowerCase();

  const exact = BY_EXACT_PRODUCT_IMAGES[n];
  if (exact) return exact;

  const cat = categoryTitle?.trim() ?? "";
  if (cat) {
    const catExact = BY_EXACT_PRODUCT_IMAGES[cat];
    if (catExact) return catExact;
  }

  if (n.startsWith("חלווה ")) {
    const rest = n.replace(/^חלווה\s+/, "").trim();
    const img =
      BY_EXACT_PRODUCT_IMAGES[rest] ??
      BY_EXACT_PRODUCT_IMAGES[`חלווה ${rest}`] ??
      (rest === "אגוזי לוז" ? BY_EXACT_PRODUCT_IMAGES["אגוזי לוז"] : undefined) ??
      (rest === "פיסטק" || rest === "פיסטוק" ? BY_EXACT_PRODUCT_IMAGES["פיסטק"] : undefined) ??
      (rest === "פקאן" ? BY_EXACT_PRODUCT_IMAGES["פקאן"] : undefined) ??
      (rest === "טעם של פעם" ? BY_EXACT_PRODUCT_IMAGES["טעם של פעם"] : undefined);
    if (img) return img;
  }

  if (n.startsWith("עלי גפן חמוצים")) return BY_EXACT_PRODUCT_IMAGES["עלי גפן חמוצים"];
  if (n.startsWith("כרוב חמוץ")) return BY_EXACT_PRODUCT_IMAGES["כרוב חמוץ"];
  if (n.startsWith("בצל חמוץ מתוק")) return BY_EXACT_PRODUCT_IMAGES["בצל חמוץ מתוק"];
  if (n.startsWith("מלפפון חמוץ")) return "/images/catalog/pickled-cucumber.png";
  if (n.startsWith("אבטיח חתוך")) return "/images/catalog/watermelon-sliced.png";
  if (n.startsWith("אננס חתוך")) return BY_EXACT_PRODUCT_IMAGES["אננס חתוך"];
  if (n.startsWith("אננס קאפי")) return BY_EXACT_PRODUCT_IMAGES["אננס קאפי"];
  if (n.startsWith("מלון חתוך")) return BY_EXACT_PRODUCT_IMAGES["מלון חתוך"];
  if (n.startsWith("קוקוס חתוך")) return BY_EXACT_PRODUCT_IMAGES["קוקוס חתוך"];
  if (n.startsWith("כדורי קוקוס")) return BY_EXACT_PRODUCT_IMAGES["כדורי קוקוס"];
  if (n.startsWith("פומלה קלופה")) return BY_EXACT_PRODUCT_IMAGES["פומלה קלופה"];
  if (n.startsWith("פאפאיה")) return BY_EXACT_PRODUCT_IMAGES["פאפאיה"];
  if (n.startsWith("תאנ")) return BY_EXACT_PRODUCT_IMAGES["תאנים"];
  if (n.startsWith("דובדבן הזהב")) return BY_EXACT_PRODUCT_IMAGES["דובדבן הזהב אדום"];
  if (n.startsWith("מישמש") || n.startsWith("משמש")) return BY_EXACT_PRODUCT_IMAGES["מישמש"];
  if (n.startsWith("דומדמניות")) return BY_EXACT_PRODUCT_IMAGES["דומדמניות"];
  if (n.startsWith("תות פקיסטני") || n.startsWith("תות עץ")) return BY_EXACT_PRODUCT_IMAGES["תות פקיסטני"];
  if (n.startsWith("פטל שחור בכר")) return BY_EXACT_PRODUCT_IMAGES["פטל שחור בכר"];
  if (n.startsWith("אוכמניות כרמל גדול")) return BY_EXACT_PRODUCT_IMAGES["אוכמניות כרמל גדול"];
  if (n.startsWith("אוכמניות כרמל בינוני")) return BY_EXACT_PRODUCT_IMAGES["אוכמניות כרמל בינוני"];
  if (n.startsWith("אוכמניות ישראלי")) return BY_EXACT_PRODUCT_IMAGES["אוכמניות ישראלי"];
  if (n.startsWith("אוכמניות פרו סקויה") || n.startsWith("אוכמניות פרו סויקה"))
    return BY_EXACT_PRODUCT_IMAGES["אוכמניות פרו סקויה"];

  if (n.includes("חומץ") && n.includes("תפוח")) return "/images/catalog/apple-cider-vinegar.png";
  if (n.includes("מיץ תפוחים") && n.includes("גזר")) return "/images/catalog/juice-apple-carrot.png";
  if (n.includes("מיץ תפוחים") && n.includes("סלק")) return "/images/catalog/juice-apple-beet.png";
  if (n.includes("מיץ תפוחים") && n.includes("חבוש")) return "/images/catalog/juice-apple-quince.png";
  if (n.includes("מיץ תפוחים") && !/(גזר|סלק|חבוש)/.test(n)) return "/images/catalog/juice-apple.png";
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
  if (/(טחינה|קרם\s*פיסטוק|קרם\s*אגוזי)/.test(n)) return "/images/gallery/premium-delivery-box.webp";
  if (/(חלווה|halva|halvah)/.test(text)) return "/images/gallery/dates-walnut-pack.webp";
  return "/images/gallery/mixed-fruit-box.webp";
}

/** עד 4 תמונות למוצר — לקרוסלה בכרטיס */
export function getProduceImages(
  name: string,
  description?: string,
  categoryTitle?: string,
): readonly string[] {
  return normalizeProduceImages(resolveProduceImageEntry(name, description, categoryTitle));
}

/** תמונת מוצר ראשונה (תאימות לאחור) */
export function getProduceImage(
  name: string,
  description?: string,
  categoryTitle?: string,
): string | undefined {
  return getProduceImages(name, description, categoryTitle)[0];
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
        rows: [{ emoji: "🌵", name: "סברס", price: "35₪, 2 יח׳ 60₪ · 55₪ לק״ג" }],
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
      { emoji: "🍎", name: "בקבוק חומץ תפוחים", price: "25₪" },
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
