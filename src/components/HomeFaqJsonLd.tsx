import { useMemo } from "react";
import { HOME_PAGE_FAQ_ITEMS } from "../data/homePageFaq";

/** JSON-LD FAQPage לדף הבית */
export function HomeFaqJsonLd() {
  const payload = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: HOME_PAGE_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    }),
    [],
  );

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />;
}
