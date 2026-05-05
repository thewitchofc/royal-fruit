import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { BUSINESS_TRUST_CUSTOMERS_LINE } from "../lib/business";
import { ROUTES } from "../lib/publicRoutes";
import { OrderUrgencyLines } from "./OrderUrgencyLines";

/** CTA למילוי סל לפני הפוטר בכל דף */
export function SiteBottomWhatsappBar() {
  return (
    <aside className="site-bottom-wa" aria-labelledby="site-bottom-wa-heading">
      <div className="container site-bottom-wa-inner">
        <div className="site-bottom-wa-copy">
          <h2 id="site-bottom-wa-heading" className="site-bottom-wa-title">
            מוכנים למלא את הסל?
          </h2>
          <p className="site-bottom-wa-trust">{BUSINESS_TRUST_CUSTOMERS_LINE}</p>
          <p className="site-bottom-wa-trust-secondary">שירות אמין ומהיר עם ניסיון</p>
          <OrderUrgencyLines
            className="order-urgency-lines order-urgency-lines--bar"
            showFinger={false}
          />
        </div>
        <Link
          className="btn btn-cart-fill btn-whatsapp-strong"
          to={ROUTES.cart}
          aria-label="מעבר לסל למילוי הזמנה"
        >
          <ShoppingBag className="btn-whatsapp-icon" aria-hidden strokeWidth={2} />
          מלאו את הסל
        </Link>
      </div>
    </aside>
  );
}
