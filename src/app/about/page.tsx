import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import Placeholder from "@/components/ui/Placeholder";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `The story behind ${SITE.name} — premium, ethically crafted fashion for Men, Women & Kids in Bangladesh.`,
};

const STATS = [
  { value: "2019", label: "Founded in Dhaka" },
  { value: "50k+", label: "Happy customers" },
  { value: "100%", label: "Authentic fabric" },
  { value: "64", label: "Districts delivered" },
];

const VALUES = [
  {
    title: "Craft over volume",
    text: "Every collection is produced in small, considered runs — never fast fashion, always made to last.",
  },
  {
    title: "Ethically sourced",
    text: "We partner with mills and artisans who share our standards for fair work and responsible materials.",
  },
  {
    title: "Designed in Bangladesh",
    text: "Our studio in Banani draws on local heritage and contemporary silhouettes, for the modern wardrobe.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Our Story"
        description={SITE.tagline}
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Intro */}
      <section className="container-luxe grid items-center gap-12 py-16 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Wear the Story</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Premium fashion, made with intention.
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink/75">
            <p>
              {SITE.name} began with a simple belief: that everyday clothing should feel
              extraordinary. What started as a small studio in Dhaka has grown into a destination for
              men, women and kids who want pieces that are beautifully made and built to last.
            </p>
            <p>
              We obsess over fabric, fit and finish — sourcing premium materials, working with
              skilled local artisans, and producing in limited runs so nothing feels disposable.
              Each garment is a small story, and we&apos;d be honoured for you to wear it.
            </p>
          </div>
          <Link href="/shop" className="btn-gold mt-7">
            Explore the Collection
          </Link>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="aspect-[4/5] overflow-hidden rounded-sm border border-line">
            <Placeholder label="Atelier" className="h-full w-full" />
          </div>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="border-y border-line bg-charcoal">
        <div className="container-luxe grid grid-cols-2 gap-6 py-12 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-3xl text-gold sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="container-luxe py-16">
        <Reveal className="text-center">
          <p className="eyebrow">What we stand for</p>
          <h2 className="mt-3 heading-display">Our Values</h2>
          <div className="gold-rule" />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1}>
              <div className="h-full rounded-sm border border-line bg-card p-8 transition-colors hover:border-gold/50">
                <h3 className="font-display text-xl text-ink">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-charcoal">
        <div className="container-luxe py-16 text-center">
          <Reveal>
            <h2 className="heading-display">Become part of the story.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Discover new arrivals, seasonal edits and timeless essentials — crafted for the way you
              live.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="btn-gold">
                Shop Now
              </Link>
              <Link href="/contact" className="btn-outline">
                Get in Touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
