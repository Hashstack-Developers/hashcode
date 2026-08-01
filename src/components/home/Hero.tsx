"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { ParallaxBrand } from "@/components/home/ParallaxBrand";
import { ShootingStars } from "@/components/home/ShootingStars";
import { siteConfig } from "@/data/content";

const HeroCanvas = dynamic(() => import("@/components/canvas/HeroCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#141210]" />,
});

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();

      const intro = root.current?.querySelector<HTMLElement>(".film-intro-block");
      const act2 = root.current?.querySelector<HTMLElement>(".film-act-2");
      const act3 = root.current?.querySelector<HTMLElement>(".film-act-3");
      const act4 = root.current?.querySelector<HTMLElement>(".film-act-4");
      const end = root.current?.querySelector<HTMLElement>(".film-end-block");
      const hint = root.current?.querySelector<HTMLElement>(".film-hint");

      if (!intro || !act2 || !act3 || !act4 || !end) return;

      gsap.set([act2, act3, act4, end], { autoAlpha: 0, y: 32 });
      gsap.set(intro, { autoAlpha: 1, y: 0 });
      if (hint) gsap.set(hint, { autoAlpha: 1 });

      gsap.from(".film-fade-in", {
        autoAlpha: 0,
        y: 28,
        duration: 1.1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });

      // Animated scroll cue under "Scroll to play"
      gsap.to(".film-scroll-chevron", {
        y: 8,
        duration: 0.85,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.fromTo(
        ".film-scroll-beam",
        { y: -12, opacity: 0 },
        { y: 28, opacity: 1, duration: 1.4, ease: "none", repeat: -1 },
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
        },
      });

      tl.to(intro, { autoAlpha: 0, y: -30, ease: "none", duration: 1 }, 2);
      if (hint) tl.to(hint, { autoAlpha: 0, ease: "none", duration: 0.5 }, 1.8);
      tl.fromTo(act2, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, ease: "none", duration: 0.9 }, 2.4)
        .to(act2, { autoAlpha: 0, y: -28, ease: "none", duration: 0.9 }, 4)
        .fromTo(act3, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, ease: "none", duration: 0.9 }, 4.3)
        .to(act3, { autoAlpha: 0, y: -28, ease: "none", duration: 0.9 }, 6)
        .fromTo(act4, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, ease: "none", duration: 0.9 }, 6.3)
        .to(act4, { autoAlpha: 0, y: -20, ease: "none", duration: 0.7 }, 7.6)
        .fromTo(end, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, ease: "none", duration: 0.9 }, 7.8);
    },
    { scope: root },
  );

  return (
    <section id="cinematic-film" ref={root} className="relative h-[480vh] bg-[#141210]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <ParallaxBrand trigger={root} />
        <ShootingStars />
        <HeroCanvas triggerRef={root} />

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="film-intro-block absolute inset-0 flex flex-col justify-between px-6 pb-10 pt-28 md:px-12 md:pb-14 md:pt-32">
            <div className="pointer-events-auto max-w-xl">
              <p className="film-fade-in mb-4 text-xs font-bold uppercase tracking-[0.35em] text-gold drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                {siteConfig.fullName}
              </p>
              <h1 className="film-fade-in font-[family-name:var(--font-display)] text-[clamp(3rem,9vw,6.25rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-cream drop-shadow-[0_8px_40px_rgba(0,0,0,0.75)]">
                Stack the
                <span className="mt-2 block text-gold drop-shadow-[0_0_40px_rgba(202,138,4,0.45)]">
                  impossible.
                </span>
              </h1>
              <p className="film-fade-in mt-5 max-w-md text-base font-semibold leading-relaxed text-cream/80 md:text-lg">
                Multi-stack 3D cinema — SDLC nodes, hash towers, and camera paths that punch through the screen.
              </p>
              <div className="film-fade-in mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-extrabold text-black shadow-[0_0_40px_rgba(202,138,4,0.35)] transition hover:brightness-110"
                >
                  Start a project <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#studio"
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-full border-2 border-cream/25 bg-black/40 px-7 py-3.5 text-sm font-bold text-cream backdrop-blur-md"
                >
                  Continue the reel
                </Link>
              </div>
            </div>

            <div className="film-hint mx-auto flex flex-col items-center gap-2 text-cream/70">
              <span className="text-[11px] font-bold uppercase tracking-[0.4em]">Scroll to play</span>
              <span className="film-scroll-arrow relative flex h-10 w-6 items-center justify-center">
                <span className="absolute inset-x-0 top-0 mx-auto h-10 w-[1.5px] overflow-hidden rounded-full bg-gold/25">
                  <span className="film-scroll-beam absolute left-0 top-0 h-3 w-full rounded-full bg-gold shadow-[0_0_10px_#ca8a04]" />
                </span>
                <ArrowDown className="film-scroll-chevron relative z-10 mt-5 h-5 w-5 text-gold" />
              </span>
            </div>
          </div>

          <div className="film-act-2 invisible absolute bottom-28 left-6 max-w-sm opacity-0 md:bottom-36 md:left-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-gold">Act II</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-cream drop-shadow-lg md:text-5xl">
              Orbit the stacks
            </h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-cream/75 md:text-base">
              Five towers + SDLC ring — Plan → Design → Build → Test → Deploy → Scale.
            </p>
          </div>

          <div className="film-act-3 invisible absolute bottom-28 left-6 max-w-sm opacity-0 md:bottom-36 md:left-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-gold">Act III</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-cream drop-shadow-lg md:text-5xl">
              Punch through
            </h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-cream/75 md:text-base">
              Camera dives the hash field — objects break the frame like 4D depth.
            </p>
          </div>

          <div className="film-act-4 invisible absolute bottom-28 left-6 max-w-sm opacity-0 md:bottom-36 md:left-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-gold">Act IV</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-cream drop-shadow-lg md:text-5xl">
              Ship what lasts
            </h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-cream/75 md:text-base">
              Sequence resolves. Craft meets product.
            </p>
          </div>

          <div className="film-end-block invisible absolute inset-x-0 bottom-28 flex flex-col items-center text-center opacity-0 md:bottom-36">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">End title</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold text-cream md:text-5xl">
              Ready when you are.
            </p>
            <Link
              href="/contact"
              className="pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-extrabold text-black"
            >
              Book discovery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Bold act markers */}
        <div className="pointer-events-none absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-5 md:right-8 md:flex">
          {[
            { n: "01", label: "Enter" },
            { n: "02", label: "Orbit" },
            { n: "03", label: "Dive" },
            { n: "04", label: "Ship" },
          ].map((item) => (
            <div key={item.n} className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-wide text-cream">
                  {item.n}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold">{item.label}</p>
              </div>
              <span className="h-8 w-[3px] rounded-full bg-gold shadow-[0_0_12px_#ca8a04]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
