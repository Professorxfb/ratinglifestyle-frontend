import Link from "next/link";
import { featuredCategories } from "@/lib/mock-data";
import Placeholder from "@/components/ui/Placeholder";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FeaturedCategories() {
  return (
    <section className="container-luxe py-24">
      <SectionHeading eyebrow="Curated For You" title="Shop by Category" center />
      <div className="grid auto-rows-[230px] grid-cols-2 gap-4 lg:grid-cols-4">
        {featuredCategories.map((cat, i) => (
          <Reveal key={cat.slug} delay={i * 0.05} className={cat.span}>
            <Link
              href={cat.slug === "deals" ? "/deals" : `/shop/${cat.slug}`}
              className="group relative block h-full w-full overflow-hidden rounded-md border border-gold/10 transition-all duration-500 hover:border-gold/50 hover:shadow-gold"
            >
              <div className="h-full w-full transition-transform duration-[900ms] group-hover:scale-110">
                <Placeholder seed={i * 13 + 3} />
              </div>
              {/* base gradient + gold wash on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />
              <div className="absolute inset-0 bg-gold/0 transition-colors duration-500 group-hover:bg-gold/10" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-display text-3xl font-light text-ink">{cat.name}</h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs uppercase tracking-cinematic text-gold opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Explore <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
