import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductRow from "@/components/home/ProductRow";
import PromoBanner from "@/components/home/PromoBanner";
import UspSection from "@/components/home/UspSection";
import SocialFeed from "@/components/home/SocialFeed";
import Newsletter from "@/components/home/Newsletter";
import {
  getHeroBanners,
  getNewArrivals,
  getBestSellers,
  getHotDeals,
  getPromoBanner,
} from "@/lib/api";

export default async function HomePage() {
  const [heroBanners, newArrivals, bestSellers, hotDeals, promo] = await Promise.all([
    getHeroBanners(),
    getNewArrivals(),
    getBestSellers(),
    getHotDeals(),
    getPromoBanner(),
  ]);

  return (
    <>
      <Hero banners={heroBanners} />
      <FeaturedCategories />
      <ProductRow
        eyebrow="Just Landed"
        title="New Arrivals"
        viewAllHref="/new-arrivals"
        products={newArrivals}
      />
      <PromoBanner banner={promo} />
      <ProductRow
        eyebrow="Most Loved"
        title="Best Sellers"
        viewAllHref="/shop?sort=best_selling"
        products={bestSellers}
      />
      {hotDeals.length > 0 && (
        <ProductRow
          eyebrow="Don't Miss Out"
          title="Hot Deals"
          viewAllHref="/deals"
          products={hotDeals}
        />
      )}
      <UspSection />
      <SocialFeed />
      <Newsletter />
    </>
  );
}
