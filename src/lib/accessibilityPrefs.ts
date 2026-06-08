export type A11yPrefs = {
  fontScale: 0 | 1 | 2 | 3;
  highContrast: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  stopAnimations: boolean;
  grayscale: boolean;
  textSpacing: boolean;
  largeCursor: boolean;
};

export const DEFAULT_A11Y_PREFS: A11yPrefs = {
  fontScale: 0,
  highContrast: false,
  highlightLinks: false,
  readableFont: false,
  stopAnimations: false,
  grayscale: false,
  textSpacing: false,
  largeCursor: false,
};

const STORAGE_KEY = "royal-fruit-a11y-prefs";

function isFontScale(value: unknown): value is A11yPrefs["fontScale"] {
  return value === 0 || value === 1 || value === 2 || value === 3;
}

export function loadA11yPrefs(): A11yPrefs {
  if (typeof window === "undefined") return { ...DEFAULT_A11Y_PREFS };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_A11Y_PREFS };
    const parsed = JSON.parse(raw) as Partial<A11yPrefs>;
    return {
      fontScale: isFontScale(parsed.fontScale) ? parsed.fontScale : 0,
      highContrast: Boolean(parsed.highContrast),
      highlightLinks: Boolean(parsed.highlightLinks),
      readableFont: Boolean(parsed.readableFont),
      stopAnimations: Boolean(parsed.stopAnimations),
      grayscale: Boolean(parsed.grayscale),
      textSpacing: Boolean(parsed.textSpacing),
      largeCursor: Boolean(parsed.largeCursor),
    };
  } catch {
    return { ...DEFAULT_A11Y_PREFS };
  }
}

export function saveA11yPrefs(prefs: A11yPrefs) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function applyA11yPrefs(prefs: A11yPrefs) {
  if (typeof document === "undefined") return;

  const html = document.documentElement;
  html.dataset.a11yFontScale = String(prefs.fontScale);
  html.toggleAttribute("data-a11y-high-contrast", prefs.highContrast);
  html.toggleAttribute("data-a11y-highlight-links", prefs.highlightLinks);
  html.toggleAttribute("data-a11y-readable-font", prefs.readableFont);
  html.toggleAttribute("data-a11y-stop-animations", prefs.stopAnimations);
  html.toggleAttribute("data-a11y-grayscale", prefs.grayscale);
  html.toggleAttribute("data-a11y-text-spacing", prefs.textSpacing);
  html.toggleAttribute("data-a11y-large-cursor", prefs.largeCursor);
}

export function resetA11yPrefs(): A11yPrefs {
  const prefs = { ...DEFAULT_A11Y_PREFS };
  saveA11yPrefs(prefs);
  applyA11yPrefs(prefs);
  return prefs;
}
