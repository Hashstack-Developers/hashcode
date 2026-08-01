"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const cards = [
  { src: "/images/web.svg", title: "Brand systems", tag: "01" },
  { src: "/images/mobile.svg", title: "Product surfaces", tag: "02" },
  { src: "/images/cloud.svg", title: "Cloud fabric", tag: "03" },
  { src: "/images/ai.svg", title: "Intelligence layer", tag: "04" },
  { src: "/images/design.svg", title: "Motion language", tag: "05" },
];

function DayHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#ca8a04]">{eyebrow}</p>
      )}
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#1a1510] md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-[#5c4a28]/80 md:text-lg">{description}</p>
      )}
    </div>
  );
}

export function ScrollImageStage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const cardsEl = gsap.utils.toArray<HTMLElement>(".img-card");

        cardsEl.forEach((card, i) => {
          gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            x: (i - 2) * 18,
            y: (i - 2) * 12,
            rotateY: -22 + i * 6,
            rotateX: 14,
            scale: 0.78 + i * 0.03,
            z: i * 30,
            filter: "saturate(0.7) brightness(0.95)",
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".img-stage-pin",
            start: "top top",
            end: "+=280%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        cardsEl.forEach((card, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          tl.to(
            card,
            {
              x: (col - 1) * 320,
              y: (row - 0.3) * 260,
              rotateY: 0,
              rotateX: 0,
              rotateZ: 0,
              scale: 1,
              z: 0,
              filter: "saturate(0.85) brightness(1)",
              ease: "none",
              duration: 1,
            },
            0,
          );
        });

        tl.to(
          cardsEl[2],
          {
            scale: 1.28,
            z: 160,
            rotateY: -6,
            filter: "saturate(1) brightness(1.05)",
            ease: "none",
            duration: 0.85,
          },
          1,
        );

        tl.to(
          [cardsEl[0], cardsEl[1], cardsEl[3], cardsEl[4]],
          {
            scale: 0.82,
            autoAlpha: 0.4,
            filter: "blur(2px) saturate(0.5)",
            ease: "none",
            duration: 0.85,
          },
          1,
        );

        cardsEl.forEach((card, i) => {
          const angle = (i / cardsEl.length) * Math.PI * 2;
          tl.to(
            card,
            {
              x: Math.cos(angle) * 480,
              y: Math.sin(angle) * 280,
              rotateZ: (i - 2) * 28,
              scale: 0.4,
              autoAlpha: 0.25,
              ease: "none",
              duration: 1,
            },
            1.85,
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav-theme="light"
      className="relative"
      style={{
        background: "linear-gradient(180deg, #f5edd8 0%, #faf6ec 40%, #fff8e8 100%)",
      }}
    >
      {/* soft day atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,220,140,0.35) 0%, transparent 60%)",
        }}
      />

      <div className="img-stage-pin relative hidden min-h-screen md:block">
        <div className="absolute inset-x-0 top-24 z-20 mx-auto max-w-7xl px-8">
          <DayHeading
            eyebrow="Still frames"
            title="A quieter gallery — still cinematic."
            description="Desaturated panels, precise motion. Scroll to unfold the edit."
          />
        </div>

        <div
          className="relative mx-auto flex h-screen max-w-7xl items-center justify-center pt-24"
          style={{ perspective: "1600px" }}
        >
          <div className="relative h-[70vh] w-full max-w-5xl">
            {cards.map((card) => (
              <article
                key={card.title}
                className="img-card absolute left-1/2 top-1/2 w-[270px] overflow-hidden rounded-xl border border-[#ca8a04]/25 bg-[#fffdf8] shadow-[0_30px_80px_rgba(80,50,10,0.18)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image src={card.src} alt={card.title} fill sizes="270px" className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-mono text-[10px] tracking-[0.25em] text-[#f5d76e]/80">{card.tag}</p>
                    <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg text-[#faf8f0]">
                      {card.title}
                    </h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="relative space-y-4 px-5 py-24 md:hidden">
        <DayHeading eyebrow="Still frames" title="Gallery" className="mb-6" />
        {cards.map((card) => (
          <article
            key={card.title}
            className="overflow-hidden rounded-xl border border-[#ca8a04]/20 bg-white/70 shadow-sm"
          >
            <div className="relative aspect-[16/10]">
              <Image src={card.src} alt={card.title} fill className="object-cover" unoptimized />
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-[#1a1510]">{card.title}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
