import Link from "next/link";
import type { Banner } from "@/lib/types";
import Placeholder from "@/components/ui/Placeholder";
import Reveal from "@/components/ui/Reveal";

export default function PromoBanner({ banner }: { banner: Banner }) {
  return (
    <section className="container-luxe py-12">
      <Reveal>
        <Link
          href={banner.ctaLink}
          className="group relative block h-[380px] w-full overflow-hidden rounded-xl border border-gold/15"
        >
          <div className="h-full w-full transition-transform duration-[900ms] group-hover:scale-105">
            <Placeholder seed={banner.id * 5} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-10 sm:p-16">
            <p className="eyebrow mb-3">Limited Time</p>
            <h2 className="max-w-md font-display font-light tracking-cinematic text-4xl leading-tight text-ink sm:text-6xl">
              {banner.title}
            </h2>
            <p className="mt-4 max-w-sm text-platinum/80">{banner.subtitle}</p>
            <span className="mt-8 inline-flex w-fit items-center gap-2 border-b border-gold pb-1 text-sm uppercase tracking-cinematic text-gold">
              {banner.ctaText}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
