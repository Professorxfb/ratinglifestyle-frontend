import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getRelated, getReviews } from "@/lib/api";
import { SITE } from "@/lib/site";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import ProductTabs from "@/components/product/ProductTabs";
import ProductRow from "@/components/home/ProductRow";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product Not Found" };
  const price = product.salePrice ?? product.basePrice;
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: "website",
      url: `${SITE.url}/product/${product.slug}`,
    },
    other: {
      "product:price:amount": String(price),
      "product:price:currency": "BDT",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([
    getRelated(product),
    getReviews(product),
  ]);

  const price = product.salePrice ?? product.basePrice;

  // JSON-LD structured data for SEO (Product + Breadcrumb)
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand ?? SITE.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.reviewsCount,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/product/${product.slug}`,
      priceCurrency: "BDT",
      price: price,
      availability:
        product.stockQuantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-luxe py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: product.categoryName, href: `/shop/${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ProductGallery images={product.images} seed={product.id} />
          <ProductPurchase product={product} />
        </div>

        <ProductTabs product={product} reviews={reviews} />
      </div>

      {related.length > 0 && (
        <ProductRow eyebrow="You May Also Like" title="Related Products" products={related} />
      )}
    </>
  );
}
