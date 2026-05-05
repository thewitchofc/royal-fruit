import { ArrowLeft, ShoppingBag, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { NAVBAR_CONTACT, NAVBAR_DROPDOWNS, NAVBAR_HOME } from "../data/navbar";
import { PRICE_LIST_PREFETCH_PATHS, ROUTES } from "../lib/publicRoutes";
import { getGoogleSheetsProductsCsvUrl } from "../lib/sheetProducts";
import { warmSheetProductsCache } from "../hooks/useSheetProducts";
import "./Navbar.css";

type NavbarProps = {
  mobileOpen: boolean;
  onNavigate: () => void;
};

function pathsForDropdown(id: string): string[] {
  const d = NAVBAR_DROPDOWNS.find((x) => x.id === id);
  return d ? d.items.map((i) => i.to) : [];
}

function isActivePath(pathname: string, paths: string[]): boolean {
  return paths.some((p) => {
    if (pathname === p) return true;
    if (p === ROUTES.blog && pathname.startsWith(`${ROUTES.blog}/`)) return true;
    return pathname.startsWith(`${p}/`);
  });
}

export function Navbar({ mobileOpen, onNavigate }: NavbarProps) {
  const { pathname } = useLocation();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>(null);
  const navRootRef = useRef<HTMLElement>(null);
  const closeDropdownTimerRef = useRef<number | null>(null);

  const prefetchIfPricePage = useCallback((to: string) => {
    if (PRICE_LIST_PREFETCH_PATHS.has(to)) {
      void import("../pages/Fruits");
      void import("../pages/Halva");
      void import("../pages/HomeFood");
      void import("../pages/Vegetables");
      warmSheetProductsCache(getGoogleSheetsProductsCsvUrl());
    }
  }, []);

  const cancelCloseDropdown = useCallback(() => {
    if (closeDropdownTimerRef.current == null) return;
    window.clearTimeout(closeDropdownTimerRef.current);
    closeDropdownTimerRef.current = null;
  }, []);

  const scheduleCloseDropdown = useCallback(
    (id: string) => {
      cancelCloseDropdown();
      /**
       * הפאנל הלבן absolutely-positioned מחוץ ל-box של הטריגר ויש gap קטן ב־CSS,
       * אז מעבר עכבר טריגר→פאנל יכול “לברוח” לרגע ולסגור. דיליי קצר מונע את זה.
       */
      closeDropdownTimerRef.current = window.setTimeout(() => {
        setOpenDropdownId((cur) => (cur === id ? null : cur));
        closeDropdownTimerRef.current = null;
      }, 140);
    },
    [cancelCloseDropdown],
  );

  useEffect(() => {
    setOpenDropdownId(null);
    setExpandedMobileGroup(null);
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const root = navRootRef.current;
      if (!root || !openDropdownId) return;
      if (e.target instanceof Node && !root.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [openDropdownId]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const toggleMobileAccordion = (id: string) => {
    setExpandedMobileGroup((cur) => (cur === id ? null : id));
  };

  return (
    <>
      <nav ref={navRootRef} className="rf-navbar" aria-label="ניווט ראשי">
        <div className="rf-navbar__desktop rf-navbar__desktop--classic">
          <NavLink
            to={NAVBAR_HOME.to}
            end
            className={({ isActive }) => `rf-navbar__link${isActive ? " is-active" : ""}`}
            onClick={onNavigate}
          >
            {NAVBAR_HOME.label}
          </NavLink>

          {NAVBAR_DROPDOWNS.map((group) => {
            const childPaths = pathsForDropdown(group.id);
            const active = isActivePath(pathname, childPaths);
            const isOpen = openDropdownId === group.id;
            return (
              <div
                key={group.id}
                className={`rf-navbar__dropdown${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => {
                  cancelCloseDropdown();
                  setOpenDropdownId(group.id);
                }}
                onMouseLeave={() => scheduleCloseDropdown(group.id)}
                onFocusCapture={() => {
                  cancelCloseDropdown();
                  setOpenDropdownId(group.id);
                }}
                onBlurCapture={(e) => {
                  const next = e.relatedTarget;
                  if (next instanceof Node && e.currentTarget.contains(next)) return;
                  scheduleCloseDropdown(group.id);
                }}
              >
                <button
                  type="button"
                  className={`rf-navbar__trigger${active ? " is-active" : ""}`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-controls={`rf-nav-panel-${group.id}`}
                  id={`rf-nav-trigger-${group.id}`}
                  onClick={() => setOpenDropdownId((id) => (id === group.id ? null : group.id))}
                >
                  {group.label}
                  <ChevronDown className="rf-navbar__trigger-chevron" aria-hidden strokeWidth={2.4} />
                </button>
                <div
                  className="rf-navbar__panel"
                  id={`rf-nav-panel-${group.id}`}
                  role="menu"
                  aria-labelledby={`rf-nav-trigger-${group.id}`}
                  onMouseEnter={cancelCloseDropdown}
                  onMouseLeave={() => scheduleCloseDropdown(group.id)}
                >
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      role="menuitem"
                      className={({ isActive }) => `rf-navbar__panel-link${isActive ? " is-active" : ""}`}
                      onClick={() => {
                        onNavigate();
                        setOpenDropdownId(null);
                      }}
                      onMouseEnter={() => prefetchIfPricePage(item.to)}
                      onFocus={() => prefetchIfPricePage(item.to)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}

          <NavLink
            to={NAVBAR_CONTACT.to}
            className={({ isActive }) => `rf-navbar__link${isActive ? " is-active" : ""}`}
            onClick={onNavigate}
          >
            {NAVBAR_CONTACT.label}
          </NavLink>
        </div>

        <NavLink
          to={ROUTES.cart}
          className={({ isActive }) => `rf-navbar__cta${isActive ? " is-active" : ""}`}
          onClick={onNavigate}
          aria-label="מעבר לסל למילוי הזמנה"
        >
          <ShoppingBag className="rf-navbar__cta-icon" aria-hidden strokeWidth={2} />
          מילוי סל
        </NavLink>
      </nav>

      <button
        type="button"
        className={`rf-navbar__backdrop${mobileOpen ? " is-open" : ""}`}
        aria-label="סגירת תפריט"
        tabIndex={mobileOpen ? 0 : -1}
        onClick={onNavigate}
      />

      <div
        id="main-nav"
        className={`rf-navbar__sheet${mobileOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        aria-label="תפריט ניווט"
      >
        <div className="rf-navbar__sheet-inner">
          <div className="rf-navbar__sheet-head">
            <button
              type="button"
              className="rf-navbar__sheet-back"
              onClick={onNavigate}
              aria-label="סגירת תפריט וחזרה"
            >
              <ArrowLeft className="rf-navbar__sheet-back-icon" aria-hidden strokeWidth={2.4} />
            </button>
            <div className="rf-navbar__sheet-head-text">
              <p className="rf-navbar__sheet-kicker">Royal Fruit</p>
              <p className="rf-navbar__sheet-title">תפריט</p>
            </div>
          </div>

          <NavLink
            to={NAVBAR_HOME.to}
            end
            className={({ isActive }) =>
              `rf-navbar__sheet-link rf-navbar__sheet-link--solo${isActive ? " is-active" : ""}`
            }
            onClick={onNavigate}
          >
            {NAVBAR_HOME.label}
          </NavLink>

          <div className="rf-navbar__accordion">
            {NAVBAR_DROPDOWNS.map((group) => {
              const expanded = expandedMobileGroup === group.id;
              const childPaths = pathsForDropdown(group.id);
              const sectionActive = isActivePath(pathname, childPaths);
              return (
                <div key={group.id} className={`rf-navbar__acc-item${expanded ? " is-open" : ""}`}>
                  <button
                    type="button"
                    className={`rf-navbar__acc-trigger${sectionActive ? " has-active-child" : ""}`}
                    aria-expanded={expanded}
                    aria-controls={`rf-acc-panel-${group.id}`}
                    id={`rf-acc-head-${group.id}`}
                    onClick={() => toggleMobileAccordion(group.id)}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className="rf-navbar__acc-chevron" aria-hidden strokeWidth={2.4} />
                  </button>
                  <div
                    className="rf-navbar__acc-panel"
                    id={`rf-acc-panel-${group.id}`}
                    role="region"
                    aria-labelledby={`rf-acc-head-${group.id}`}
                  >
                    <div className="rf-navbar__acc-panel-inner">
                      <div className="rf-navbar__acc-links">
                        {group.items.map((item) => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `rf-navbar__sheet-link${isActive ? " is-active" : ""}`}
                            onClick={() => {
                              onNavigate();
                              prefetchIfPricePage(item.to);
                            }}
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <NavLink
            to={NAVBAR_CONTACT.to}
            className={({ isActive }) =>
              `rf-navbar__sheet-link rf-navbar__sheet-link--solo${isActive ? " is-active" : ""}`
            }
            onClick={onNavigate}
          >
            {NAVBAR_CONTACT.label}
          </NavLink>

          <div className="rf-navbar__sheet-footer">
            <NavLink
              className={({ isActive }) => `rf-navbar__sheet-cta${isActive ? " is-active" : ""}`}
              to={ROUTES.cart}
              onClick={onNavigate}
              aria-label="מעבר לסל למילוי הזמנה"
            >
              <ShoppingBag className="rf-navbar__cta-icon" aria-hidden strokeWidth={2} />
              מילוי סל
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
