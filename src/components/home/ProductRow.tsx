import type { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function ProductRow({
  eyebrow,
  title,
  viewAllHref,
  products,
}: {
  eyebrow?: string;
  title: string;
  viewAllHref?: string;
  products: Product[];
}) {
  return (
    <section className="container-luxe py-20">
      <SectionHeading eyebrow={eyebrow} title={title} viewAllHref={viewAllHref} />

      {/* Mobile: horizontal momentum snap-scroll. Desktop: grid. */}
      <div className="snap-row -mx-5 flex gap-5 overflow-x-auto px-5 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {products.map((p, i) => (
          <Reveal
            key={p.id}
            delay={(i % 4) * 0.06}
            className="w-[68vw] shrink-0 sm:w-auto"
          >
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
