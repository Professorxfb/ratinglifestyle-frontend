import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/api";
import { categories } from "@/lib/mock-data";
import ShopView from "@/components/shop/ShopView";
import PageHeader from "@/components/ui/PageHeader";

export async function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = [];
  categories.forEach((c) =>
    c.subcategories?.forEach((s) =>
      params.push({ category: c.slug, subcategory: s.slug }),
    ),
  );
  return params;
}

function find(categorySlug: string, subSlug: string) {
  const cat = categories.find((c) => c.slug === categorySlug);
  const sub = cat?.subcategories?.find((s) => s.slug === subSlug);
  return { cat, sub };
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; subcategory: string };
}): Promise<Metadata> {
  const { sub } = find(params.category, params.subcategory);
  if (!sub) return { title: "Products" };
  return {
    title: sub.name,
    description: `Shop ${sub.name} at Rupkotha Trendz — premium quality, free shipping across Bangladesh.`,
  };
}

export default async function SubcategoryPage({
  params,
}: {
  params: { category: string; subcategory: string };
}) {
  const { cat, sub } = find(params.category, params.subcategory);
  if (!cat || !sub) notFound();

  const all = await getProducts();
  const products = all.filter((p) => p.categorySlug === sub.slug);

  return (
    <>
      <PageHeader
        title={sub.name}
        description={`Curated ${sub.name.toLowerCase()} — refined essentials from the Rupkotha Trendz atelier.`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: cat.name, href: `/shop/${cat.slug}` },
          { label: sub.name },
        ]}
      />
      <div className="container-luxe py-12">
        <ShopView products={products} />
      </div>
    </>
  );
}
