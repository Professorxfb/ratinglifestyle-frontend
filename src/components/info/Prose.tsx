import type { ReactNode } from "react";

/**
 * Shared layout primitives for text-heavy info / legal pages.
 * Keeps typography consistent with the luxury design system without pulling in
 * @tailwindcss/typography.
 */

export function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-10">{children}</div>;
}

export function ProseSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink/75">{children}</div>
    </section>
  );
}

/** A simple bulleted list with gold markers. */
export function ProseList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
