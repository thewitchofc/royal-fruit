import { Zap } from "lucide-react";

/** שורות דחיפות קצרות ליד כפתור וואטסאפ */
export function OrderUrgencyLines({
  className,
  showFinger = true,
}: {
  className?: string;
  /** כבוי ברצועת ה־CTA התחתונה ללא אמוג׳י */
  showFinger?: boolean;
}) {
  return (
    <div className={className ?? "order-urgency-lines"} role="status">
      <span className="order-urgency-line">
        {showFinger ? (
          <span className="order-urgency-finger" aria-hidden>
            <Zap className="rf-inline-icon rf-inline-icon--secondary" size={16} />
          </span>
        ) : null}
        זמינות להזמנות להיום/מחר
      </span>
      <span className="order-urgency-line order-urgency-line--emphasis">הזמנות מהיום להיום</span>
    </div>
  );
}
