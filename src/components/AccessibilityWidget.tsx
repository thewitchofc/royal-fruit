import { useEffect, useId, useRef, useState } from "react";
import { Accessibility, Link2, Minus, Plus, RotateCcw, Type, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  applyA11yPrefs,
  loadA11yPrefs,
  resetA11yPrefs,
  saveA11yPrefs,
  type A11yPrefs,
} from "../lib/accessibilityPrefs";

type ToggleKey = Exclude<keyof A11yPrefs, "fontScale">;

const TOGGLE_OPTIONS: { key: ToggleKey; label: string }[] = [
  { key: "highContrast", label: "ניגודיות גבוהה" },
  { key: "highlightLinks", label: "הדגשת קישורים" },
  { key: "readableFont", label: "גופן קריא" },
  { key: "textSpacing", label: "ריווח טקסט" },
  { key: "stopAnimations", label: "עצירת אנימציות" },
  { key: "grayscale", label: "גווני אפור" },
  { key: "largeCursor", label: "סמן עכבר מוגדל" },
];

export function AccessibilityWidget() {
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yPrefs>(() => loadA11yPrefs());

  useEffect(() => {
    applyA11yPrefs(prefs);
    saveA11yPrefs(prefs);
  }, [prefs]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleBtnRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const firstControl = panelRef.current?.querySelector<HTMLElement>(
      "button, a[href], input, [tabindex]:not([tabindex='-1'])",
    );
    firstControl?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 640px)").matches) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const updatePrefs = (patch: Partial<A11yPrefs>) => {
    setPrefs((current) => ({ ...current, ...patch }));
  };

  const increaseFont = () => {
    setPrefs((current) => ({
      ...current,
      fontScale: current.fontScale >= 3 ? 3 : ((current.fontScale + 1) as A11yPrefs["fontScale"]),
    }));
  };

  const decreaseFont = () => {
    setPrefs((current) => ({
      ...current,
      fontScale: current.fontScale <= 0 ? 0 : ((current.fontScale - 1) as A11yPrefs["fontScale"]),
    }));
  };

  const handleReset = () => {
    setPrefs(resetA11yPrefs());
    setOpen(false);
    toggleBtnRef.current?.focus();
  };

  const fontScaleLabel =
    prefs.fontScale === 0 ? "רגיל" : prefs.fontScale === 1 ? "בינוני" : prefs.fontScale === 2 ? "גדול" : "גדול מאוד";

  return (
    <div className={`accessibility-widget${open ? " is-open" : ""}`} lang="he">
      {open ? (
        <button
          type="button"
          className="accessibility-widget-backdrop"
          aria-label="סגירת תפריט נגישות"
          onClick={() => setOpen(false)}
        />
      ) : null}
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          className="accessibility-widget-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${panelId}-title`}
        >
          <div className="accessibility-widget-panel-header">
            <h2 id={`${panelId}-title`} className="accessibility-widget-title">
              <Accessibility aria-hidden strokeWidth={2.2} />
              התאמות נגישות
            </h2>
            <button
              type="button"
              className="accessibility-widget-close"
              onClick={() => setOpen(false)}
              aria-label="סגירת תפריט נגישות"
            >
              <X aria-hidden strokeWidth={2.2} />
            </button>
          </div>

          <div className="accessibility-widget-section">
            <p className="accessibility-widget-section-label">גודל טקסט</p>
            <div className="accessibility-widget-font-row">
              <button
                type="button"
                className="accessibility-widget-icon-btn"
                onClick={decreaseFont}
                disabled={prefs.fontScale <= 0}
                aria-label="הקטנת טקסט"
              >
                <Minus aria-hidden strokeWidth={2.4} />
              </button>
              <span className="accessibility-widget-font-value" aria-live="polite">
                <Type aria-hidden strokeWidth={2.2} />
                {fontScaleLabel}
              </span>
              <button
                type="button"
                className="accessibility-widget-icon-btn"
                onClick={increaseFont}
                disabled={prefs.fontScale >= 3}
                aria-label="הגדלת טקסט"
              >
                <Plus aria-hidden strokeWidth={2.4} />
              </button>
            </div>
          </div>

          <ul className="accessibility-widget-options" role="list">
            {TOGGLE_OPTIONS.map(({ key, label }) => (
              <li key={key}>
                <button
                  type="button"
                  className={`accessibility-widget-option${prefs[key] ? " is-active" : ""}`}
                  aria-pressed={prefs[key]}
                  onClick={() => updatePrefs({ [key]: !prefs[key] })}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className="accessibility-widget-actions">
            <button type="button" className="accessibility-widget-reset" onClick={handleReset}>
              <RotateCcw aria-hidden strokeWidth={2.2} />
              איפוס הגדרות
            </button>
            <Link to="/accessibility" className="accessibility-widget-statement" onClick={() => setOpen(false)}>
              <Link2 aria-hidden strokeWidth={2.2} />
              הצהרת נגישות
            </Link>
          </div>
        </div>
      ) : null}

      <button
        ref={toggleBtnRef}
        type="button"
        className="accessibility-widget-fab"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={open ? "סגירת תפריט נגישות" : "פתיחת תפריט נגישות"}
        onClick={() => setOpen((value) => !value)}
      >
        <Accessibility className="accessibility-widget-fab-icon" aria-hidden strokeWidth={2.2} />
        <span className="accessibility-widget-fab-label">נגישות</span>
      </button>
    </div>
  );
}

export function initAccessibilityPrefs() {
  applyA11yPrefs(loadA11yPrefs());
}
