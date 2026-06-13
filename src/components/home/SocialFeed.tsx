import Placeholder from "@/components/ui/Placeholder";
import SectionHeading from "@/components/ui/SectionHeading";
import { SITE } from "@/lib/site";

export default function SocialFeed() {
  return (
    <section className="container-luxe py-20">
      <SectionHeading
        eyebrow="@rupkothatrendz"
        title="Follow Our Journey"
        center
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <a
            key={i}
            href={SITE.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden rounded-sm"
          >
            <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
              <Placeholder seed={i * 17 + 2} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-obsidian/60 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-gold">♥</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
