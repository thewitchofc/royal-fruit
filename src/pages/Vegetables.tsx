import { SheetPriceListAsMenu } from "../components/SheetPriceListAsMenu";
import { usePageSeo } from "../lib/seo";

export function Vegetables() {
  usePageSeo({
    title: "Royal Fruit | ירקות פרימיום",
    description: "מחירון ירקות פרימיום, איכות עלים ושורשים, וטיפים לאחסון טריות.",
  });

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">ירקות פרימיום</p>
          <h1 className="page-title">ירקות שמחזיקים קו אחיד מהשדה ועד הסלטייה</h1>
          <p className="page-lead muted">
            המחירון והמלאי מתעדכנים באופן שוטף, מה שמופיע כאן משקף את מה שזמין אצלנו כרגע.
          </p>
        </div>
      </section>

      <section id="vegetables-price-list" className="section sheet-products-page-section price-menu-body">
        <div className="container">
          <SheetPriceListAsMenu
            idPrefix="sheet-veg"
            defaultEmoji="veg"
            emojiStrip=""
            showEmojis={false}
            page="vegetables"
            listMeta={{
              title: "מחירון ירקות",
            }}
          />
        </div>
      </section>

      <section id="vegetables-faq" className="section">
        <div className="container narrow">
          <div className="prose about-story-bubble">
            <h2>שאלות נפוצות על ירקות</h2>
            <p>
              כשעובדים עם כמויות, טריות היא ניהול נכון. הנה כמה נקודות שעוזרות לשמור על חומר גלם יציב
              לאורך השבוע.
            </p>
            <h2>איך יודעים שהעלים באמת טריים?</h2>
            <p>
              מחפשים עלה מתוח, צבע אחיד וקצוות נקיים. עלים עם לחות עודפת או קצוות עייפים יאבדו נפח מהר,
              ולכן חשוב לבחור מראש חומר שמחזיק שטיפה, חיתוך והגשה בלי לקרוס.
            </p>
            <h2>מה עדיף לשטוף מראש ומה רק לפני שימוש?</h2>
            <p>
              ירקות שורש אפשר להכין חלקית מראש, אבל עלים עדינים עדיף לשטוף ולייבש קרוב לזמן ההגשה.
              כך שומרים על קראנץ', צבע ונראות גבוהה בצלחת.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
