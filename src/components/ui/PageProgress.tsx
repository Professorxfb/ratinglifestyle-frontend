"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Fixed gold progress bar at the very top of the viewport, driven by the
 * page's scroll position. Smoothed with a spring for a premium feel.
 */
export default function PageProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gold-gradient"
    >
      <span className="absolute right-0 top-0 h-full w-16 bg-gold-light/80 blur-[2px]" />
    </motion.div>
  );
}
