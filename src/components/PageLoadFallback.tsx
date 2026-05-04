/** מסך טעינה בזמן טעינת צ׳אנק דף (Suspense) — אנימציית CSS בלבד */
export function PageLoadFallback() {
  return (
    <div className="page-load-fallback page" role="status" aria-live="polite" aria-busy="true">
      <div className="page-load-fallback-inner">
        <div className="page-load-fallback-visual" aria-hidden>
          <span className="page-load-fallback-spinner">
            <span className="page-load-fallback-spinner__ring" />
            <span className="page-load-fallback-spinner__ring page-load-fallback-spinner__ring--inner" />
          </span>
        </div>
        <p className="page-load-fallback-text">טוען את הדף…</p>
      </div>
    </div>
  );
}
