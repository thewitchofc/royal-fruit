import { useMemo } from "react";
import { getBreadcrumbTrail } from "../lib/breadcrumbTrail";
import { getSiteUrl } from "../lib/siteUrl";

function segmentToAbsoluteItemUrl(base: string, path: string): string {
  if (path === "/") return `${base}/`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Schema.org BreadcrumbList, עוזר לגוגל במבנה האתר */
export function BreadcrumbJsonLd({ pathname }: { pathname: string }) {
  const jsonLd = useMemo(() => {
    const base = getSiteUrl();
    if (!base) return null;

    const trail = getBreadcrumbTrail(pathname);
    if (trail.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: trail.map((seg, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: seg.name,
        item: segmentToAbsoluteItemUrl(base, seg.path),
      })),
    };
  }, [pathname]);

  if (!jsonLd) return null;

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
