import { MessageCircle } from "lucide-react";
import { BUSINESS_TRUST_CUSTOMERS_LINE } from "../lib/business";
import { OrderUrgencyLines } from "./OrderUrgencyLines";
import { whatsappChatUrl, WHATSAPP_WEBSITE_PREFILL } from "../lib/whatsappOrder";

/** CTA וואטסאפ חוזר לפני הפוטר בכל דף */
export function SiteBottomWhatsappBar() {
  return (
    <aside className="site-bottom-wa" aria-labelledby="site-bottom-wa-heading">
      <div className="container site-bottom-wa-inner">
        <div className="site-bottom-wa-copy">
          <h2 id="site-bottom-wa-heading" className="site-bottom-wa-title">
            מוכנים להזמין?
          </h2>
          <p className="site-bottom-wa-trust">{BUSINESS_TRUST_CUSTOMERS_LINE}</p>
          <p className="site-bottom-wa-trust-secondary">שירות אמין ומהיר עם ניסיון</p>
          <OrderUrgencyLines
            className="order-urgency-lines order-urgency-lines--bar"
            showFinger={false}
          />
        </div>
        <a
          className="btn btn-primary btn-whatsapp btn-whatsapp-strong"
          href={whatsappChatUrl(WHATSAPP_WEBSITE_PREFILL)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="btn-whatsapp-icon" aria-hidden />
          שלחו הודעה בוואטסאפ עכשיו
        </a>
      </div>
    </aside>
  );
}
