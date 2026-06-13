import { clsx } from "clsx";

/**
 * Luxury gradient placeholder used wherever a real product/banner image will go.
 * Theme-aware: built from CSS variables so it adapts across all palettes
 * (obsidian → secondary base with an accent radial shimmer + monogram).
 */
const TINTS = [
  "210deg",
  "260deg",
  "150deg",
  "40deg",
  "330deg",
];

export default function Placeholder({
  seed = 0,
  label,
  className,
}: {
  seed?: number;
  label?: string;
  className?: string;
}) {
  const angle = TINTS[Math.abs(seed) % TINTS.length];
  return (
    <div
      className={clsx(
        "group/ph relative flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
      aria-hidden={!label}
      style={{
        background: `
          radial-gradient(120% 80% at 70% 15%, rgb(var(--accent) / 0.12), transparent 55%),
          linear-gradient(${angle}, rgb(var(--bg-secondary)) 0%, rgb(var(--bg-primary)) 55%, rgb(var(--card-bg)) 100%)
        `,
      }}
    >
      {/* diagonal gold sheen */}
      <span
        className="pointer-events-none absolute inset-0 opacity-60 transition-transform duration-700 group-hover/ph:translate-x-[20%]"
        style={{
          background:
            "linear-gradient(115deg, transparent 35%, rgb(var(--accent) / 0.08) 48%, transparent 60%)",
        }}
      />
      {/* subtle gold monogram */}
      <span className="select-none font-logo text-4xl tracking-luxe text-gold/15">RT</span>
      {label && (
        <span className="absolute bottom-3 left-3 font-serif text-xs uppercase tracking-luxe text-ink/40">
          {label}
        </span>
      )}
    </div>
  );
}
