import type { ReactNode } from "react";

type CategoryItem = {
  href: string;
  label: string;
  icon?: ReactNode;
};

export function PageCategoryNav({ items }: { items: CategoryItem[] }) {
  if (!items.length) return null;

  return (
    <nav className="page-category-nav" aria-label="קטגוריות בדף">
      {items.map((item) => (
        <a key={item.href} href={item.href} className="page-category-chip">
          {item.icon ? <span className="page-category-icon" aria-hidden>{item.icon}</span> : null}
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
