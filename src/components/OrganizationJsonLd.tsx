import { useMemo } from "react";
import {
  BUSINESS_AREA_SERVED,
  BUSINESS_FACEBOOK_URL,
  BUSINESS_INSTAGRAM_URL,
  BUSINESS_NAME,
  BUSINESS_OPENING_HOURS_SPECIFICATION,
  BUSINESS_PHONE_E164,
  BUSINESS_SCHEMA_DESCRIPTION,
  GOOGLE_BUSINESS_GPAGE_URL,
  GOOGLE_BUSINESS_PROFILE_URL,
  GOOGLE_MAPS_URL,
} from "../lib/business";
import { absoluteOgImageUrl, getSiteUrl } from "../lib/siteUrl";

/** Schema.org GroceryStore, תואם המלצות Google לעסק מקומי */
export function OrganizationJsonLd() {
  const jsonLd = useMemo(() => {
    const base = getSiteUrl();
    if (!base) return null;

    const googleBusinessListing = GOOGLE_BUSINESS_GPAGE_URL || GOOGLE_BUSINESS_PROFILE_URL;
    const sameAs = [googleBusinessListing, BUSINESS_INSTAGRAM_URL, BUSINESS_FACEBOOK_URL].filter(
      (url, i, arr) => Boolean(url) && arr.indexOf(url) === i,
    );

    const schema = {
      "@context": "https://schema.org",
      "@type": "GroceryStore",
      "@id": `${base}/#grocery`,
      name: BUSINESS_NAME,
      description: BUSINESS_SCHEMA_DESCRIPTION,
      url: `${base}/`,
      telephone: BUSINESS_PHONE_E164,
      areaServed: ["ישראל", BUSINESS_AREA_SERVED],
      priceRange: "₪₪",
      image: absoluteOgImageUrl(),
      logo: absoluteOgImageUrl(),
      hasMap: GOOGLE_MAPS_URL,
      sameAs,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: BUSINESS_PHONE_E164,
        contactType: "customer service",
        areaServed: "IL",
        availableLanguage: ["he"],
      },
      openingHoursSpecification: BUSINESS_OPENING_HOURS_SPECIFICATION,
      address: {
        "@type": "PostalAddress",
        streetAddress: "האורגים 7",
        addressLocality: "חולון",
        addressCountry: "IL",
      },
    };

    return schema;
  }, []);

  if (!jsonLd) return null;

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
