import type { Metadata } from "next";
import { getProducts } from "@/lib/api";
import ShopView from "@/components/shop/ShopView";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest drops at Rupkotha Trendz — fresh styles added weekly.",
};

export default async function NewArrivalsPage() {
  const all = await getProducts();
  const products = all.filter((p) => p.isNewArrival);

  return (
    <>
      <PageHeader
        title="New Arrivals"
        description="Fresh off the atelier floor — the newest additions to the Rupkotha Trendz collection."
        crumbs={[{ label: "Home", href: "/" }, { label: "New Arrivals" }]}
      />
      <div className="container-luxe py-12">
        <ShopView products={products} initialSort="newest" />
      </div>
    </>
  );
}
