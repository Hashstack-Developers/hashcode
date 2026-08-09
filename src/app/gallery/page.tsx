"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { galleryCards } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

export default function GalleryPage() {
  const [active, setActive] = useState<string | null>(null);
  const selected = galleryCards.find((c) => c.id === active);

  return (
    <section className="px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Gallery"
          title="Creatives, campaigns, and brand cards."
          description="A living board of graphics and promo pieces we ship — add new cards anytime from the gallery library."
          className="mb-12"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setActive(card.id)}
              className="group text-left"
            >
              <GlassCard className="overflow-hidden p-0" hover>
                <div className="relative aspect-square overflow-hidden bg-[#1a1510]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    priority={card.id === galleryCards[0]?.id}
                  />
                </div>
                <div className="border-t border-cream/10 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
                    {card.category}
                  </p>
                  <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-xl font-semibold text-cream">
                    {card.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-cream/55">{card.description}</p>
                </div>
              </GlassCard>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md sm:p-5">
          <button
            type="button"
            aria-label="Close gallery preview"
            className="absolute inset-0 cursor-default"
            onClick={() => setActive(null)}
          />
          <div className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-cream/10 bg-[#101218] shadow-2xl">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 bg-[#0a0908]/80 text-cream"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative aspect-square w-full bg-[#1a1510] sm:aspect-[4/3]">
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain"
                priority
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
                {selected.category}
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-cream sm:text-3xl">
                {selected.title}
              </h3>
              <p className="mt-3 text-cream/60">{selected.description}</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="rounded-full border border-cream/15 px-5 py-2.5 text-sm text-cream"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
