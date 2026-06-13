import { SITE } from "@/lib/site";

// Scrolling promo announcement strip (top, full width).
// Text comes from site_settings.promo_strip_text in production.
export default function PromoStrip() {
  return (
    <div className="overflow-hidden border-b border-line bg-charcoal py-2">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[0, 1].map((dup) => (
          <span
            key={dup}
            className="mx-8 text-xs uppercase tracking-luxe text-platinum/80"
            aria-hidden={dup === 1}
          >
            {SITE.promoStrip}
            <span className="mx-8 text-gold">✦</span>
            {SITE.promoStrip}
          </span>
        ))}
      </div>
    </div>
  );
}
