/** שלד טעינה לכרטיסי מחירון — שומר גובה ורשת כדי לצמצם CLS */
export function SheetProductsSkeleton({ embedClassName }: { embedClassName?: string }) {
  return (
    <div
      className={["price-menu-embed", "sheet-products-skeleton", embedClassName].filter(Boolean).join(" ")}
      aria-busy="true"
    >
      <ul className="price-menu-list sheet-products-skeleton-grid" aria-hidden>
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i} className="price-menu-row price-menu-row--product-card sheet-products-skeleton-card">
            <div className="sheet-products-skeleton-media" />
            <div className="sheet-products-skeleton-footer">
              <span className="sheet-products-skeleton-line sheet-products-skeleton-line--title" />
              <span className="sheet-products-skeleton-line sheet-products-skeleton-line--price" />
            </div>
          </li>
        ))}
      </ul>
      <p className="sheet-products-skeleton-status" role="status" aria-live="polite">
        מסדרים את הדוכן הטרי…
      </p>
    </div>
  );
}
