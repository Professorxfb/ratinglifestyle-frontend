import type { Metadata } from "next";
import { getProducts } from "@/lib/api";
import ShopView from "@/components/shop/ShopView";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Deals & Offers",
  description: "Limited-time deals on premium fashion at Rupkotha Trendz. Up to 40% off.",
};

export default async function DealsPage() {
  const all = await getProducts();
  const products = all.filter((p) => p.salePrice !== null);

  return (
    <>
      <PageHeader
        title="Deals & Offers"
        description="A limited edit of seasonal essentials at exclusive prices. While the moment lasts."
        crumbs={[{ label: "Home", href: "/" }, { label: "Deals" }]}
      />
      <div className="container-luxe py-12">
        <ShopView products={products} initialSort="newest" />
      </div>
    </>
  );
}
