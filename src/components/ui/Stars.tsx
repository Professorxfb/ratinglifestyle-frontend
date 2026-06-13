import { clsx } from "clsx";

export default function Stars({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const full = Math.round(rating);
  const dim = size === "md" ? "text-base" : "text-xs";
  return (
    <div className="flex items-center gap-1.5">
      <div className={clsx("flex", dim)} aria-label={`Rated ${rating.toFixed(1)} of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < full ? "text-gold" : "text-line"}>
            ★
          </span>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted">
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
