const WORDMARK_URL = "/images/brand/royal-fruit-wordmark.svg?v=2";

type RoyalFruitWordmarkProps = {
  className?: string;
};

export function RoyalFruitWordmark({ className = "" }: RoyalFruitWordmarkProps) {
  return (
    <img
      src={WORDMARK_URL}
      alt="Royal Fruit"
      className={`royal-fruit-wordmark ${className}`.trim()}
      width={760}
      height={80}
      loading="lazy"
      decoding="async"
    />
  );
}
