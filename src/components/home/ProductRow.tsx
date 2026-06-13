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
    <section className="container-luxe py-16">
      <SectionHeading eyebrow={eyebrow} title={title} viewAllHref={viewAllHref} />
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 0.06}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
