"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/types";
import Placeholder from "@/components/ui/Placeholder";

export default function ProductGallery({
  images,
  seed,
}: {
  images: ProductImage[];
  seed: number;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {/* thumbnails */}
      <div className="flex gap-3 sm:flex-col">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className={`h-20 w-16 shrink-0 overflow-hidden rounded-sm border transition-colors ${
              active === i ? "border-gold" : "border-line hover:border-gold/50"
            }`}
            aria-label={img.alt}
          >
            <Placeholder seed={seed + i} />
          </button>
        ))}
      </div>

      {/* main image with zoom-on-hover */}
      <div className="group relative aspect-[3/4] flex-1 overflow-hidden rounded-sm bg-card">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
          <Placeholder seed={seed + active} label={images[active]?.alt} />
        </div>
      </div>
    </div>
  );
}
