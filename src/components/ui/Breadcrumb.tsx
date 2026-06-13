import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-gold">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink/80">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="text-line">/</span>}
        </span>
      ))}
    </nav>
  );
}
