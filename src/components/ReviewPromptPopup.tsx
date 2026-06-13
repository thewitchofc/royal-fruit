import { useEffect, useRef } from "react";
import { GOOGLE_WRITE_REVIEW_URL } from "../lib/business";

interface Props {
  onClose: () => void;
}

export function ReviewPromptPopup({ onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="review-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-popup-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="review-popup">
        <button
          ref={closeRef}
          type="button"
          className="review-popup-close"
          aria-label="סגור"
          onClick={onClose}
        >
          ✕
        </button>

        <p className="review-popup-emoji" aria-hidden>⭐</p>
        <h2 id="review-popup-title" className="review-popup-title">
          נהנתם מהשירות?
        </h2>
        <p className="review-popup-body">
          נשמח לביקורת קצרה בגוגל.
        </p>

        <div className="review-popup-actions">
          <a
            href={GOOGLE_WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            onClick={onClose}
          >
            השארת ביקורת בגוגל
          </a>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            אולי בפעם אחרת
          </button>
        </div>
      </div>
    </div>
  );
}
