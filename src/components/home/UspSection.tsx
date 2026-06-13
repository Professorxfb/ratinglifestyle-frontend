"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";

const stats = [
  { value: 10000, suffix: "+", label: "Happy Customers", decimals: 0 },
  { value: 500, suffix: "+", label: "Premium Styles", decimals: 0 },
  { value: 64, suffix: "", label: "Districts Delivered", decimals: 0 },
  { value: 4.9, suffix: "", label: "Avg. Rating", decimals: 1 },
];

const usps = [
  {
    title: "Free Shipping",
    text: "Complimentary delivery on all orders above ৳1500, nationwide.",
    icon: (
      <path d="M3 7h11v8H3V7zm11 3h4l3 3v2h-7v-5zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    ),
  },
  {
    title: "Easy Returns",
    text: "Not in love with it? Return within 7 days, hassle-free.",
    icon: <path d="M3 12a9 9 0 1 1 3 6.7M3 12V7m0 5h5" />,
  },
  {
    title: "100% Authentic",
    text: "Every piece is crafted with premium, ethically sourced fabric.",
    icon: <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4zm-1 12l5-5-1.4-1.4L11 11.2 9.4 9.6 8 11l3 3z" />,
  },
];

export default function UspSection() {
  return (
    <section className="grain relative overflow-hidden border-y border-line bg-charcoal">
      <div className="container-luxe py-20">
        {/* Animated stats */}
        <div className="grid grid-cols-2 gap-6 border-b border-line pb-14 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-5xl font-light text-gold-grad sm:text-6xl">
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-cinematic text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>

        {/* USP cards */}
        <div className="grid grid-cols-1 gap-6 pt-14 sm:grid-cols-3">
          {usps.map((usp, i) => (
            <Reveal key={usp.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="glass-card flex h-full flex-col items-center gap-4 rounded-lg p-8 text-center transition-colors hover:border-gold/50 hover:shadow-gold"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold transition-transform duration-500 hover:rotate-6">
                  <svg
                    className="h-7 w-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {usp.icon}
                  </svg>
                </span>
                <h3 className="font-display text-2xl text-ink">{usp.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{usp.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
