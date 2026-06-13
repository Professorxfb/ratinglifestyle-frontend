/**
 * Thin gold horizontal divider with a centered diamond — used between sections.
 */
export default function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`container-luxe flex items-center justify-center gap-4 py-2 ${className}`} aria-hidden>
      <span className="h-px max-w-[140px] flex-1 bg-gradient-to-r from-transparent to-gold/50" />
      <span className="relative flex h-2.5 w-2.5 rotate-45 items-center justify-center">
        <span className="absolute inset-0 rotate-0 bg-gold-gradient" />
        <span className="absolute -inset-1.5 rounded-full border border-gold/25" />
      </span>
      <span className="h-px max-w-[140px] flex-1 bg-gradient-to-l from-transparent to-gold/50" />
    </div>
  );
}
