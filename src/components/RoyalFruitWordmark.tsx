import type { ImgHTMLAttributes } from "react";

const WORDMARK_URL = "/images/brand/royal-fruit-wordmark.svg?v=6";

type RoyalFruitWordmarkProps = {
  className?: string;
  /** מעל הקיפול הראשון — טעינה מידית ועדיפות גבוהה ל-LCP במובייל */
  priority?: boolean;
};

export function RoyalFruitWordmark({ className = "", priority = false }: RoyalFruitWordmarkProps) {
  return (
    <img
      src={WORDMARK_URL}
      alt="Royal Fruit"
      className={`royal-fruit-wordmark ${className}`.trim()}
      width={705}
      height={80}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...(priority ? ({ fetchpriority: "high" } as ImgHTMLAttributes<HTMLImageElement>) : {})}
    />
  );
}
