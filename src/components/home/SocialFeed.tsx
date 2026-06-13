import Placeholder from "@/components/ui/Placeholder";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

export default function SocialFeed() {
  return (
    <section className="container-luxe py-24">
      <SectionHeading eyebrow="@rupkothatrendz" title="Follow Our Journey" center />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-md border border-gold/15 transition-all duration-300 hover:border-gold/60 hover:shadow-gold"
            >
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-110">
                <Placeholder seed={i * 17 + 2} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-obsidian/60 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
                <svg className="h-7 w-7 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
