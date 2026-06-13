"use client";

import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Banner } from "@/lib/types";
import Placeholder from "@/components/ui/Placeholder";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export default function Hero({ banners }: { banners: Banner[] }) {
  const [active, setActive] = useState(0);

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        onSlideChange={(s) => setActive(s.realIndex)}
        className="h-full w-full"
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={banner.id}>
            <div className="relative h-full w-full">
              <Placeholder seed={banner.id * 7} className="h-full w-full" />
              <div className="absolute inset-0 bg-hero-overlay" />
              <div className="container-luxe absolute inset-0 flex flex-col items-start justify-center">
                {active === i && (
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.15 } },
                    }}
                    className="max-w-2xl"
                  >
                    <motion.p
                      variants={fadeUp}
                      className="eyebrow mb-4"
                    >
                      Rupkotha Trendz — Est. Dhaka
                    </motion.p>
                    <motion.h1
                      variants={fadeUp}
                      className="font-display text-5xl leading-[1.05] text-ink sm:text-6xl md:text-7xl"
                    >
                      {banner.title}
                    </motion.h1>
                    <motion.p
                      variants={fadeUp}
                      className="mt-5 max-w-lg text-base text-platinum/80 sm:text-lg"
                    >
                      {banner.subtitle}
                    </motion.p>
                    <motion.div variants={fadeUp} className="mt-8">
                      <Link href={banner.ctaLink} className="btn-outline">
                        {banner.ctaText}
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
