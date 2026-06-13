import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductRow from "@/components/home/ProductRow";
import PromoBanner from "@/components/home/PromoBanner";
import UspSection from "@/components/home/UspSection";
import SocialFeed from "@/components/home/SocialFeed";
import Newsletter from "@/components/home/Newsletter";
import BrandMarquee from "@/components/home/BrandMarquee";
import GoldDivider from "@/components/ui/GoldDivider";
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

      <BrandMarquee />

      <FeaturedCategories />

      {/* alternating deeper background for depth */}
      <div className="bg-charcoal">
        <ProductRow
          eyebrow="Just Landed"
          title="New Arrivals"
          viewAllHref="/new-arrivals"
          products={newArrivals}
        />
      </div>

      <PromoBanner banner={promo} />

      <GoldDivider />

      <ProductRow
        eyebrow="Most Loved"
        title="Best Sellers"
        viewAllHref="/shop?sort=best_selling"
        products={bestSellers}
      />

      {hotDeals.length > 0 && (
        <div className="bg-charcoal">
          <ProductRow
            eyebrow="Don't Miss Out"
            title="Hot Deals"
            viewAllHref="/deals"
            products={hotDeals}
          />
        </div>
      )}

      <UspSection />

      <SocialFeed />

      <Newsletter />
    </>
  );
}
