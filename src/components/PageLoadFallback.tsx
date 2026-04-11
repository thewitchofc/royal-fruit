/** מסך טעינה קצר בזמן טעינת צ׳אנק של דף (code splitting) */
export function PageLoadFallback() {
  return (
    <div className="page page-load-fallback" role="status" aria-live="polite" aria-busy="true">
      <div className="container narrow">
        <p className="page-load-fallback-text">טוען את הדף…</p>
      </div>
    </div>
  );
}
