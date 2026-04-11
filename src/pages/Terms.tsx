import { Link } from "react-router-dom";
import { usePageSeo } from "../lib/seo";

export function Terms() {
  usePageSeo({
    title: "Royal Fruit | תנאי שימוש",
    description: "תנאי שימוש באתר Royal Fruit, מחירים, הזמנות, אחריות וקניין רוחני.",
  });

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">תנאי שימוש</p>
          <h1 className="page-title">תנאי שימוש באתר</h1>
          <p className="page-lead muted">
            ברוכים הבאים לאתר Royal Fruit. השימוש באתר מהווה הסכמה לתנאים המפורטים להלן.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <div className="prose about-story-bubble legal-prose">
            <h2>1. כללי</h2>
            <p>
              האתר מציג מידע אודות מוצרי פירות וירקות ומאפשר יצירת קשר והזמנות. המידע באתר ניתן כפי
              שהוא (&quot;AS IS&quot;) ועלול להשתנות מעת לעת.
            </p>

            <h2>2. מחירים ומוצרים</h2>
            <p>
              המחירים והמוצרים עשויים להשתנות בהתאם לזמינות יומית. ייתכנו הבדלים בין המוצג באתר לבין
              המלאי בפועל.
            </p>

            <h2>3. הזמנות</h2>
            <p>
              הזמנות מתבצעות באמצעות יצירת קשר (טלפון או וואטסאפ). הזמנה תאושר רק לאחר אישור סופי
              מול העסק.
            </p>

            <h2>4. אחריות</h2>
            <p>
              העסק עושה מאמץ לספק מוצרים איכותיים וטריים. עם זאת, לא תינתן אחריות לנזקים עקיפים או
              תוצאתיים, או לשימוש שאינו נאות במוצרים, ככל שהדבר מותר על פי דין.
            </p>

            <h2>5. קניין רוחני</h2>
            <p>
              כל התוכן באתר (לרבות טקסטים, עיצוב, סימנים ותמונות שלא הועמדו לשימוש חופשי) שייך ל־Royal
              Fruit או לבעלי זכויות אחרים, ואין לעשות בו שימוש ללא אישור בכתב, למעט שימוש אישי סביר
              בצפייה באתר.
            </p>

            <h2>6. שינויים באתר</h2>
            <p>
              העסק רשאי לעדכן את האתר ואת תנאי השימוש בכל עת. עדכון ייחשב כגולש אם המשך השימוש באתר
              נעשה לאחר פרסום התנאים המעודכנים, ככל שהדין מתיר.
            </p>

            <h2>7. דין וסמכות שיפוט</h2>
            <p>השימוש באתר ותנאים אלה כפופים לדין הישראלי בלבד. סמכות השיפוט כפי שיקבע הדין החל.</p>

            <h2>יצירת קשר ומסמכים נוספים</h2>
            <p>
              לשאלות:{" "}
              <a href="tel:0505113009" className="legal-inline-link">
                050-5113009
              </a>
              {", "}
              <Link to="/contact" className="legal-inline-link">
                יצירת קשר
              </Link>
              {", "}
              <Link to="/privacy" className="legal-inline-link">
                מדיניות פרטיות
              </Link>
              {", "}
              <Link to="/returns" className="legal-inline-link">
                ביטולים והחזרות
              </Link>
              .
            </p>

            <p className="legal-foot muted">
              המידע באתר אינו מהווה ייעוץ משפטי. לבדיקה משפטית מלאה פנו ליועץ מתאים.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
