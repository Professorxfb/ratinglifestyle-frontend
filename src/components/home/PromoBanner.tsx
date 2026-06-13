import Link from "next/link";
import type { Banner } from "@/lib/types";
import Placeholder from "@/components/ui/Placeholder";
import Reveal from "@/components/ui/Reveal";

export default function PromoBanner({ banner }: { banner: Banner }) {
  return (
    <section className="container-luxe py-10">
      <Reveal>
        <Link
          href={banner.ctaLink}
          className="group relative block h-[340px] w-full overflow-hidden rounded-sm"
        >
          <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
            <Placeholder seed={banner.id * 5} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-10 sm:p-16">
            <p className="eyebrow mb-3">Limited Time</p>
            <h2 className="max-w-md font-display text-4xl leading-tight text-ink sm:text-5xl">
              {banner.title}
            </h2>
            <p className="mt-4 max-w-sm text-platinum/80">{banner.subtitle}</p>
            <span className="mt-7 inline-flex w-fit border-b border-gold pb-1 text-sm uppercase tracking-wide text-gold">
              {banner.ctaText} →
            </span>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
