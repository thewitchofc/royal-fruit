import { SheetPriceListAsMenu } from "../components/SheetPriceListAsMenu";
import { usePageSeo } from "../lib/seo";

export function Fruits() {
  usePageSeo({
    title: "Royal Fruit | פירות פרימיום",
    description: "מחירון פירות פרימיום, זמינות עונתית וטיפים לבחירת בשלות נכונה.",
  });

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">פירות פרימיום</p>
          <h1 className="page-title fruits-page-title">ממתקי טבע שנבחרו כמו אבנים נדירות</h1>
          <p className="page-lead muted">
            המחירון והמלאי מתעדכנים באופן שוטף, מה שמופיע כאן משקף את מה שזמין אצלנו כרגע.
          </p>
        </div>
      </section>

      <section id="fruits-price-list" className="section sheet-products-page-section price-menu-body">
        <div className="container">
          <SheetPriceListAsMenu
            idPrefix="sheet-fruits"
            defaultEmoji="fruit"
            emojiStrip=""
            showEmojis={false}
            page="fruits"
            listMeta={{
              title: "מחירון פירות",
            }}
          />
        </div>
      </section>

      <section id="fruits-faq" className="section">
        <div className="container narrow">
          <div className="prose about-story-bubble">
            <h2>שאלות נפוצות על פירות</h2>
            <p>
              כדי לעזור בבחירה מהירה, ריכזנו תשובות קצרות לשאלות שחוזרות כל הזמן אצל לקוחות פרטיים
              ומקצועיים כאחד.
            </p>
            <h2>איך לבחור בשלות לפי מועד שימוש?</h2>
            <p>
              אם ההגשה היא היום, בוחרים פירות בשלים ומוכנים לצלחת. אם ההגשה מחר או מחרתיים, משלבים חלק
              מהפריטים בדרגת בשלות נמוכה יותר כדי לשמור על מרקם וטעם בשיא בזמן הנכון.
            </p>
            <h2>איך שומרים טריות אחרי קבלה?</h2>
            <p>
              מפרידים בין פירות שממשיכים להבשיל (כמו מנגו ואבוקדו) לבין פירות עדינים שעדיף לקירור מיידי
              (כמו תותים וענבים). אחסון לפי קבוצות מפחית פחת ושומר על טעם לאורך זמן.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
