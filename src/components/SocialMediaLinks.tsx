import { FacebookGlyph } from "./FacebookGlyph";
import { InstagramGlyph } from "./InstagramGlyph";
import { BUSINESS_FACEBOOK_URL, BUSINESS_INSTAGRAM_URL } from "../lib/business";

type Props = {
  /** footer = אייקונים בפוטר; inline = שורה עם טקסט בדף הבית */
  variant?: "footer" | "inline";
};

export function SocialMediaLinks({ variant = "footer" }: Props) {
  const rootClass = variant === "inline" ? "social-media-links social-media-links--inline" : "footer-social-links";

  return (
    <div className={rootClass} aria-label="רשתות חברתיות">
      <a
        href={BUSINESS_INSTAGRAM_URL}
        className={
          variant === "inline"
            ? "social-media-link social-media-link--instagram"
            : "footer-social-link footer-social-link--instagram"
        }
        target="_blank"
        rel="noopener noreferrer"
        aria-label="אינסטגרם של Royal Fruit, נפתח בלשונית חדשה"
      >
        <InstagramGlyph className={variant === "inline" ? "social-media-icon" : "footer-social-icon"} />
        {variant === "inline" ? <span>אינסטגרם</span> : null}
      </a>
      <a
        href={BUSINESS_FACEBOOK_URL}
        className={
          variant === "inline"
            ? "social-media-link social-media-link--facebook"
            : "footer-social-link footer-social-link--facebook"
        }
        target="_blank"
        rel="noopener noreferrer"
        aria-label="פייסבוק של Royal Fruit, נפתח בלשונית חדשה"
      >
        <FacebookGlyph className={variant === "inline" ? "social-media-icon" : "footer-social-icon"} />
        {variant === "inline" ? <span>פייסבוק</span> : null}
      </a>
    </div>
  );
}
