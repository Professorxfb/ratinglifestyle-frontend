import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

/**
 * Section heading — large Cormorant display type with cinematic letter-spacing.
 * The last word of the title is rendered in animated gold gradient for emphasis.
 */
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
  const words = title.trim().split(" ");
  const last = words.pop();
  const head = words.join(" ");

  return (
    <div
      className={`mb-12 flex items-end justify-between gap-4 ${center ? "flex-col text-center" : ""}`}
    >
      <Reveal className={center ? "mx-auto" : ""}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-display font-light tracking-cinematic leading-[1.05] text-4xl text-ink sm:text-5xl md:text-6xl">
          {head ? (
            <>
              {head} <span className="text-gold-grad italic">{last}</span>
            </>
          ) : (
            <span className="text-gold-grad italic">{last}</span>
          )}
        </h2>
        {center && <div className="gold-rule" />}
      </Reveal>
      {viewAllHref && !center && (
        <Link
          href={viewAllHref}
          className="group shrink-0 border-b border-gold pb-1 text-sm uppercase tracking-cinematic text-gold transition-opacity hover:opacity-70"
        >
          View All <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
}
