import Link from "next/link";
import { featuredCategories } from "@/lib/mock-data";
import Placeholder from "@/components/ui/Placeholder";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FeaturedCategories() {
  return (
    <section className="container-luxe py-20">
      <SectionHeading eyebrow="Curated For You" title="Shop by Category" center />
      <div className="grid auto-rows-[220px] grid-cols-2 gap-4 lg:grid-cols-4">
        {featuredCategories.map((cat, i) => (
          <Reveal key={cat.slug} delay={i * 0.05} className={cat.span}>
            <Link
              href={cat.slug === "deals" ? "/deals" : `/shop/${cat.slug}`}
              className="group relative block h-full w-full overflow-hidden rounded-sm"
            >
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-110">
                <Placeholder seed={i * 13 + 3} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />
              <div className="absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-gold" />
              <div className="absolute bottom-5 left-5">
                <h3 className="font-display text-2xl text-ink">{cat.name}</h3>
                <span className="mt-1 inline-block text-xs uppercase tracking-luxe text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
