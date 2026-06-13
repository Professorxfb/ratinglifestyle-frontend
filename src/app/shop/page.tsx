import type { Metadata } from "next";
import { getProducts } from "@/lib/api";
import ShopView from "@/components/shop/ShopView";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the full Rupkotha Trendz collection — premium men's, women's & kids' fashion.",
};

type SortKey = "newest" | "price_asc" | "price_desc" | "best_selling" | "rating";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { sort?: string };
}) {
  const products = await getProducts();
  const sort = (searchParams.sort as SortKey) ?? "newest";

  return (
    <>
      <PageHeader
        title="Shop All"
        description="The complete Rupkotha Trendz edit — crafted for those who dress with intent."
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop All" }]}
      />
      <div className="container-luxe py-12">
        <ShopView products={products} initialSort={sort} />
      </div>
    </>
  );
}
