"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Banner } from "@/lib/types";

export default function Hero({ banners }: { banners: Banner[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const banner = banners[active] ?? FALLBACK;

  // Rotate through banners
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % banners.length), 6500);
    return () => clearInterval(t);
  }, [banners.length]);

  // Parallax on hero content as the user scrolls past
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const words = banner.title.split(" ");

  return (
    <section
      ref={sectionRef}
      className="grain relative flex h-[100svh] min-h-[600px] w-full items-center overflow-hidden bg-obsidian"
    >
      <GoldParticles />

      {/* radial vignette + bottom fade for cinematic depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_30%,rgb(var(--bg-primary)/0.5)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-obsidian to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-luxe relative z-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="eyebrow mb-6"
        >
          Rupkotha Trendz — Est. Dhaka
        </motion.p>

        {/* Word-by-word headline reveal */}
        <motion.h1
          key={banner.id}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
          className="heading-hero max-w-4xl"
        >
          {words.map((w, i) => (
            <span key={`${banner.id}-${i}`} className="mr-[0.25em] inline-block overflow-hidden">
              <motion.span variants={wordReveal} className="inline-block">
                {i === words.length - 1 ? (
                  <span className="text-gold-grad-anim italic">{w}</span>
                ) : (
                  w
                )}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Typewriter subtitle */}
        <Typewriter key={`sub-${banner.id}`} text={banner.subtitle} className="mt-7 max-w-xl text-base text-platinum/80 sm:text-lg" />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link href={banner.ctaLink} className="btn-gold">
            {banner.ctaText}
          </Link>
          <Link href="/new-arrivals" className="btn-outline">
            New Arrivals
          </Link>
        </motion.div>

        {/* Slide indicators */}
        {banners.length > 1 && (
          <div className="mt-12 flex gap-2.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === active ? "w-10 bg-gold" : "w-4 bg-ink/25 hover:bg-ink/50"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Bouncing scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-luxe text-gold/70">Scroll</span>
        <svg className="h-6 w-6 animate-scroll-bounce text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}

/* ── Typewriter ───────────────────────────────────────────────────── */
function Typewriter({ text, className }: { text: string; className?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) clearInterval(id);
      }, 28);
      return () => clearInterval(id);
    }, 700);
    return () => clearTimeout(start);
  }, [text]);

  return (
    <p className={className}>
      {text.slice(0, count)}
      <span className="ml-0.5 inline-block h-[1em] w-px translate-y-[0.12em] animate-caret-blink bg-gold align-middle" />
    </p>
  );
}

/* ── Gold particle canvas ─────────────────────────────────────────── */
function GoldParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number };
    let particles: P[] = [];

    const accent = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "201 168 76";

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(110, Math.floor((w * h) / 14000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.4 + 0.1),
        a: Math.random() * 0.5 + 0.1,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      const rgb = accent();
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.02;
        if (p.y < -5) {
          p.y = h + 5;
          p.x = Math.random() * w;
        }
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        const flicker = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${rgb} / ${flicker})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgb(${rgb} / 0.6)`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    resize();
    if (reduced) {
      // draw a single static frame
      const rgb = accent();
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${rgb} / ${p.a})`;
        ctx.fill();
      }
    } else {
      raf = requestAnimationFrame(draw);
    }
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}

const wordReveal: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const FALLBACK: Banner = {
  id: 0,
  title: "Wear the Story",
  subtitle: "Premium fashion, crafted in Bangladesh.",
  ctaText: "Shop Collection",
  ctaLink: "/shop",
  image: null,
  position: "hero_main",
};
