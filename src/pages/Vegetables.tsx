import { Link } from "react-router-dom";
import { RoyalFruitWordmark } from "../components/RoyalFruitWordmark";
import { SheetPriceListAsMenu } from "../components/SheetPriceListAsMenu";
import { usePageSeo } from "../lib/seo";

export function Vegetables() {
  usePageSeo({
    title: "Royal Fruit | מחירון ירקות פרימיום ומשלוחים בגוש דן",
    description: "מחירון ירקות פרימיום עם דגש על עלים, שורשים, טריות שמחזיקה ומשלוחים מתואמים בחולון, בת ים, ראשון לציון, תל אביב וגוש דן.",
  });

  return (
    <div className="page">
      <section className="page-hero vegetables-hero">
        <div className="container narrow">
          <p className="eyebrow">ירקות פרימיום</p>
          <h1 className="page-title vegetables-page-title">ירקות שמחזיקים קו אחיד מהשדה ועד הסלטייה</h1>
          <p className="page-lead muted">
            מחירון ירקות שמתעדכן לפי איכות, מלאי וטריות. מה שמופיע כאן נבחר כדי להחזיק צבע, קראנץ׳
            ונראות גם אחרי שטיפה, חיתוך והגשה.
          </p>
        </div>
      </section>

      <section id="vegetables-price-list" className="section sheet-products-page-section price-menu-body vegetables-section">
        <div className="container vegetables-premium-shell">
          <div className="vegetables-intro-card catalog-intro-card--centered" aria-label="סטנדרט הירקות של רויאל פרוט">
            <div>
              <RoyalFruitWordmark className="vegetables-intro-wordmark" />
              <h2>ירקות שנבחרים לפי יציבות, צבע ומרקם, לא רק לפי רשימת מלאי.</h2>
            </div>
            <div className="vegetables-intro-points">
              <span>עלים מתוחים</span>
              <span>שורשים יציבים</span>
              <span>אספקה מתואמת</span>
            </div>
            <Link to="/cart" className="btn btn-cart-fill vegetables-intro-cta">
              מעבר לסל
            </Link>
          </div>
          <SheetPriceListAsMenu
            idPrefix="sheet-veg"
            defaultEmoji="veg"
            emojiStrip=""
            showEmojis={false}
            sheetType="ירקות"
            listMeta={{
              title: "מחירון ירקות",
            }}
            priceMenuEmbedClassName="price-menu-embed--premium-cards"
            showProductImages
            showImagesDisclaimer
            productImageOnlyPrefixes={["מיני תפוח אדמה", "מיני מלפפון", "מלפפון יפני", "פאקוס", "מיני גמבה", "עלי בייבי", "עלי רוקט", "עלי תרד", "נבטים סינים", "נבטים סיניים", "רוברבר", "לבבות קיסר", "קולסלאו", "עלי סלרי", "עלי מנגולד", "עגבניות מיובשות", "פטרוזיליה", "בזיליקום", "עירית", "שיבה", "מרווה", "רוזמרין", "שמיר", "למון גראס", "פלפל צ׳ילי", "צ׳ילי תאילנדי", "צ'ילי תאילנדי", "נענע", "בצל שאלוט", "בצל ירוק", "דלעת", "כרוב סיני", "כרוב ניצנים", "במיה", "ג׳ינג׳ר", "ג'ינג'ר", "כורכום צ׳רי", "כורכום צ'רי", "תירס צהוב מארז", "תירס לבן מארז", "אספרגוס", "מיקס כרובית טריו", "כרובית לבנה", "ברוקולי ג׳מבו", "ברוקולי ג'מבו", "שעועית ירוקה", "שעועית צהובה", "קפיר ליים", "עלי קפיר ליים", "אבוקדו מוכן לאכילה", "גוואקמולי", "ממרח אבוקדו", "פטריות שמפיניון", "פטריות שימג׳י", "פטריות שי מג׳י", "פטריות פורטובלו", "מגה פורטובלו", "מגה פורטבלה"]}
          />
        </div>
      </section>

      <section id="vegetables-faq" className="section vegetables-guide-section">
        <div className="container narrow vegetables-guide-shell">
          <div className="vegetables-guide-head">
            <p className="vegetables-guide-kicker">לפני שמכניסים למטבח</p>
            <h2>ירקות טובים נמדדים במה שקורה אחרי החיתוך.</h2>
          </div>
          <div className="vegetables-guide-grid">
            <article className="vegetables-guide-card">
              <h3>איך יודעים שהעלים באמת טריים?</h3>
              <p>
                מחפשים עלה מתוח, צבע אחיד וקצוות נקיים. עלים עם לחות עודפת או קצוות עייפים יאבדו נפח
                מהר, ולכן חשוב לבחור חומר שמחזיק שטיפה, חיתוך והגשה בלי לקרוס.
              </p>
            </article>
            <article className="vegetables-guide-card">
              <h3>מה לשטוף מראש ומה רק לפני שימוש?</h3>
              <p>
                ירקות שורש אפשר להכין חלקית מראש, אבל עלים עדינים עדיף לשטוף ולייבש קרוב לזמן ההגשה.
                כך שומרים על קראנץ׳, צבע ונראות גבוהה בצלחת.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section produce-seo-section">
        <div className="container narrow produce-seo-card">
          <p className="produce-seo-kicker">משלוח ירקות באזור המרכז</p>
          <h2>ירקות פרימיום עד הבית ולעסקים בחולון, גוש דן והמרכז.</h2>
          <p>
            Royal Fruit מספקת ירקות טריים שנבחרים לפי יציבות, צבע ומרקם: עלים לסלט, שורשים לבישול,
            ירקות לאירוח וחומרי גלם לעסקים. לפני המשלוח מתאמים מלאי, כמות ומועד, כדי שהירקות יגיעו
            מסודרים ונוחים לעבודה.
          </p>
        </div>
      </section>
    </div>
  );
}
