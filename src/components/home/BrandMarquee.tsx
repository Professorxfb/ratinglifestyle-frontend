// Horizontal auto-scrolling strip of brand values / labels.
// Pure CSS marquee (duplicated track) — no JS, no layout shift.
const ITEMS = [
  "Premium Fabric",
  "Crafted in Bangladesh",
  "Free Nationwide Shipping",
  "7-Day Easy Returns",
  "Authentic Quality",
  "Members-Only Drops",
];

export default function BrandMarquee() {
  return (
    <section className="grain relative overflow-hidden border-y border-line bg-obsidian py-7">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-obsidian to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-obsidian to-transparent" />

      <div className="flex w-max animate-marquee-slow whitespace-nowrap">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
            {ITEMS.map((item) => (
              <span key={item} className="flex items-center">
                <span className="mx-7 font-display text-2xl font-light tracking-cinematic text-ink/70 sm:text-3xl">
                  {item}
                </span>
                <span className="text-gold">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
