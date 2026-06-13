import { clsx } from "clsx";

// Luxury gradient placeholder used wherever a real product/banner image will go.
// Deterministic gradient based on a seed so the same product looks consistent.
const GRADIENTS = [
  "from-[#1B2A4A] via-[#0A0A0A] to-[#161616]",
  "from-[#2A1B2A] via-[#0A0A0A] to-[#161616]",
  "from-[#1B2A22] via-[#0A0A0A] to-[#161616]",
  "from-[#2A241B] via-[#0A0A0A] to-[#161616]",
  "from-[#241B2A] via-[#0A0A0A] to-[#161616]",
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
  const gradient = GRADIENTS[Math.abs(seed) % GRADIENTS.length];
  return (
    <div
      className={clsx(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className,
      )}
      aria-hidden={!label}
    >
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
