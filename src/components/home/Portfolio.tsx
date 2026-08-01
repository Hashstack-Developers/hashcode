"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { projects } from "@/data/content";
import { cn } from "@/lib/utils";
import { pinExtras } from "@/lib/mobile";

export function Portfolio() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const track = root.current?.querySelector<HTMLElement>(".portfolio-track");
        const fill = root.current?.querySelector<HTMLElement>(".portfolio-progress-fill");
        if (!track) return;

        const getScroll = () => -(track.scrollWidth - window.innerWidth + 64);

        gsap.set(".portfolio-intro", { y: 20, autoAlpha: 0 });
        gsap.set(".project-card", { rotateY: 8, scale: 0.94 });

        const scrollTween = gsap.to(track, {
          x: getScroll,
          ease: "none",
          scrollTrigger: {
            trigger: ".portfolio-pin",
            start: "top top",
            end: () => `+=${track.scrollWidth * 0.95}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            ...pinExtras(),
            onUpdate: (self) => {
              if (fill) gsap.set(fill, { scaleX: self.progress });
            },
          },
        });

        gsap.to(".portfolio-intro", {
          y: 0,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".portfolio-pin",
            start: "top top",
            end: "+=15%",
            scrub: true,
          },
        });

        gsap.to(".project-card", {
          rotateY: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".portfolio-pin",
            start: "top top",
            end: "+=20%",
            scrub: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
          const burst = card.querySelector(".project-burst");
          if (!burst) return;
          gsap.fromTo(
            burst,
            { scale: 0.88 },
            {
              scale: 1.1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: "left 85%",
                end: "left 25%",
                scrub: true,
              },
            },
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.set(".portfolio-intro", { y: 0, autoAlpha: 1 });
        gsap.set(".portfolio-progress-fill", { scaleX: 1 });
        gsap.set(".project-card", { y: 20, autoAlpha: 0 });

        // Single trigger — avoids per-card ST thrash between sections
        gsap.to(".project-card", {
          y: 0,
          autoAlpha: 1,
          stagger: 0.1,
          duration: 0.55,
          ease: "power2.out",
          overwrite: "auto",
          scrollTrigger: {
            trigger: ".portfolio-pin",
            start: "top 82%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-[#0a0908] py-24 md:py-0">
      <div className="portfolio-pin md:flex md:min-h-screen md:flex-col md:justify-center">
        <div className="portfolio-intro mx-auto mb-8 max-w-7xl px-5 md:mb-10 md:px-8">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#ca8a04]">
            Selected work
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#faf8f0] md:text-5xl">
            Case studies that explode into the frame.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[#faf8f0]/50 md:text-base">
            <span className="md:hidden">Tap through the work — each case in its own frame.</span>
            <span className="hidden md:inline">
              Horizontal scroll gallery — mockups surge as each case locks center stage.
            </span>
          </p>
          <div className="mt-6 hidden h-1 max-w-xs overflow-hidden rounded-full bg-[#faf8f0]/10 md:block">
            <div className="portfolio-progress-fill h-full origin-left scale-x-0 rounded-full bg-[#ca8a04]" />
          </div>
        </div>

        <div
          className="portfolio-track flex w-full flex-col gap-4 px-5 md:w-max md:flex-row md:gap-6 md:px-8"
          style={{ perspective: "1200px" }}
        >
          {projects.map((project, i) => (
            <article
              key={project.id}
              className="project-card group relative h-[360px] w-full overflow-hidden rounded-3xl border border-[#ca8a04]/25 md:h-[520px] md:w-[560px] md:max-w-[560px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className={cn(
                  "project-burst absolute inset-0 bg-gradient-to-br transition duration-700 group-hover:scale-105",
                  project.gradient,
                )}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent" />

              <div className="relative flex h-full flex-col justify-between p-7 md:p-9">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#faf8f0]/50">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>

                <div>
                  <p className="mb-3 inline-flex rounded-full border border-[#ca8a04]/30 bg-[#ca8a04]/10 px-3 py-1 text-xs text-[#ca8a04]">
                    {project.metric}
                  </p>
                  <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#faf8f0] md:text-4xl">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm text-[#faf8f0]/60 md:text-base">
                    {project.description}
                  </p>
                  <Link
                    href="/work"
                    className="mt-6 inline-flex items-center gap-1 text-sm text-[#faf8f0] transition group-hover:text-[#ca8a04]"
                  >
                    Open case study <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 font-[family-name:var(--font-display)] text-7xl font-bold text-[#faf8f0]/5 md:text-8xl">
                0{i + 1}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
