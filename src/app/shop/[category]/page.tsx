import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductsByCategory } from "@/lib/api";
import { categories } from "@/lib/mock-data";
import ShopView from "@/components/shop/ShopView";
import PageHeader from "@/components/ui/PageHeader";

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

function findCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const cat = findCategory(params.category);
  if (!cat) return { title: "Category" };
  return {
    title: `${cat.name} Collection`,
    description: `Shop premium ${cat.name.toLowerCase()} fashion at Rupkotha Trendz. Free shipping across Bangladesh.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cat = findCategory(params.category);
  if (!cat) notFound();

  const products = await getProductsByCategory(params.category);

  return (
    <>
      <PageHeader
        title={`${cat.name} Collection`}
        description={`Discover the latest in ${cat.name.toLowerCase()} fashion — premium fabric, tailored fits, made to make a statement.`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: cat.name },
        ]}
      />
      <div className="container-luxe py-12">
        {cat.subcategories && cat.subcategories.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-3">
            {cat.subcategories.map((sub) => (
              <a
                key={sub.id}
                href={`/shop/${cat.slug}/${sub.slug}`}
                className="btn-ghost"
              >
                {sub.name}
              </a>
            ))}
          </div>
        )}
        <ShopView products={products} />
      </div>
    </>
  );
}
