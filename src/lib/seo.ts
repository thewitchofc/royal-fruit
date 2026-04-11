import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_OG_IMAGE_PATH } from "./siteConfig";
import { absoluteUrl, getSiteUrl } from "./siteUrl";

/** מילות מפתח כלליות לדפים בעברית (Google מתעלם חלקית; עדיין עוזר לכלי מטא ולעקביות) */
export const SITE_META_KEYWORDS =
  "Royal Fruit, פירות פרימיום, ירקות פרימיום, חולון, משלוחי פירות, הזמנת פירות וירקות, פירות טריים, אורי צפניה";

type SeoParams = {
  title: string;
  description: string;
  /** ברירת מחדל website; למאמרים, article */
  ogType?: "website" | "article";
  /** תאריך ISO של המאמר (למשל 2026-03-15) */
  articlePublishedAt?: string;
  /** נתיב מלא מתחיל ב־/ (אופציונלי, אחרת משתמשים ב־location) */
  path?: string;
  noIndex?: boolean;
  /** נתיב יחסי לתמונת OG, ברירת מחדל SITE_OG_IMAGE_PATH (public) */
  ogImagePath?: string;
};

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el?.setAttribute(k, v));
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertHreflangHeIl(href: string) {
  let el = document.head.querySelector('link[rel="alternate"][hreflang="he-IL"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "alternate");
    el.setAttribute("hreflang", "he-IL");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function removeMetaByProperty(property: string) {
  document.head.querySelectorAll(`meta[property="${property}"]`).forEach((m) => m.remove());
}

export function usePageSeo(params: SeoParams) {
  const { pathname, search } = useLocation();
  const path = params.path ?? `${pathname}${search}`;

  useEffect(() => {
    const {
      title,
      description,
      ogType = "website",
      articlePublishedAt,
      noIndex,
      ogImagePath = SITE_OG_IMAGE_PATH,
    } = params;

    document.title = title;

    const base = getSiteUrl();
    const pathOnly = path.split("?")[0] || "/";
    const canonical = base ? (pathOnly === "/" ? `${base}/` : `${base}${pathOnly}`) : "";

    if (canonical) {
      upsertCanonical(canonical);
      upsertHreflangHeIl(canonical);
    }

    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    });

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });

    upsertMeta('meta[name="keywords"]', {
      name: "keywords",
      content: SITE_META_KEYWORDS,
    });

    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: ogType,
    });

    if (canonical) {
      upsertMeta('meta[property="og:url"]', {
        property: "og:url",
        content: canonical,
      });
    }

    const imageAbs = absoluteUrl(ogImagePath);
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: imageAbs,
    });

    if (ogType === "article" && articlePublishedAt) {
      const iso = `${articlePublishedAt}T12:00:00+02:00`;
      upsertMeta('meta[property="article:published_time"]', {
        property: "article:published_time",
        content: iso,
      });
    } else {
      removeMetaByProperty("article:published_time");
    }

    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: imageAbs,
    });
  }, [
    path,
    params.title,
    params.description,
    params.ogType,
    params.articlePublishedAt,
    params.noIndex,
    params.ogImagePath,
  ]);
}
