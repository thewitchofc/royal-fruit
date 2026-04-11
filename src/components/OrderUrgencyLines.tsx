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
            👉{" "}
          </span>
        ) : null}
        זמינות להזמנות להיום/מחר
      </span>
      <span className="order-urgency-line order-urgency-line--emphasis">הזמנות מהיום להיום</span>
    </div>
  );
}
