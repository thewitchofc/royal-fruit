const CATALOG_PNG_RE = /^(\/images\/catalog\/[^/]+)\.png$/;

/** מקורות תמונה לכרטיס מוצר — WebP קטן לכרטיסים, PNG כגיבוי */
export function getCatalogCardImageSources(src: string): { png: string; webp: string | null } {
  const match = src.match(CATALOG_PNG_RE);
  if (!match) return { png: src, webp: null };
  return { png: src, webp: `${match[1]}.mobile.webp` };
}
