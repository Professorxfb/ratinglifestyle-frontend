import Link from "next/link";

export default function SectionHeading({
  eyebrow,
  title,
  viewAllHref,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  viewAllHref?: string;
  center?: boolean;
}) {
  return (
    <div
      className={`mb-10 flex items-end justify-between gap-4 ${center ? "flex-col text-center" : ""}`}
    >
      <div className={center ? "mx-auto" : ""}>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="heading-display">{title}</h2>
        {center && <div className="gold-rule" />}
      </div>
      {viewAllHref && !center && (
        <Link
          href={viewAllHref}
          className="shrink-0 border-b border-gold pb-1 text-sm uppercase tracking-wide text-gold transition-opacity hover:opacity-70"
        >
          View All
        </Link>
      )}
    </div>
  );
}
