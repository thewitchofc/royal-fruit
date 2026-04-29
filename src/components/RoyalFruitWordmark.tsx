const WORDMARK_URL = "/images/brand/royal-fruit-wordmark.svg?v=4";

type RoyalFruitWordmarkProps = {
  className?: string;
};

export function RoyalFruitWordmark({ className = "" }: RoyalFruitWordmarkProps) {
  return (
    <img
      src={WORDMARK_URL}
      alt="Royal Fruit"
      className={`royal-fruit-wordmark ${className}`.trim()}
      width={705}
      height={80}
      loading="lazy"
      decoding="async"
    />
  );
}
