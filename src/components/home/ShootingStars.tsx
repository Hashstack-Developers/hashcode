"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";

/** Sparse meteors — roughly one streak every ~5 seconds */
export function ShootingStars() {
  const root = useRef<HTMLDivElement>(null);

  const stars = useMemo(
    () => [
      { id: 0, top: "18%", left: "-5%", delay: 0, duration: 1.4, length: 120 },
      { id: 1, top: "42%", left: "-8%", delay: 5.2, duration: 1.55, length: 140 },
      { id: 2, top: "28%", left: "-6%", delay: 10.5, duration: 1.35, length: 110 },
    ],
    [],
  );

  useGSAP(
    () => {
      registerGsap();
      const nodes = gsap.utils.toArray<HTMLElement>(".shoot-star");
      nodes.forEach((node, i) => {
        const star = stars[i];
        const travel = Math.max(window.innerWidth, 360) * 1.15;

        gsap.set(node, { x: 0, y: 0, autoAlpha: 0 });

        gsap
          .timeline({ repeat: -1, delay: star.delay, repeatDelay: 5 })
          .set(node, { x: 0, y: 0, autoAlpha: 0 })
          .to(node, { autoAlpha: 1, duration: 0.12 })
          .to(
            node,
            {
              x: travel,
              y: travel * 0.38,
              duration: star.duration,
              ease: "none",
            },
            0,
          )
          .to(node, { autoAlpha: 0, duration: 0.3 }, `-=${star.duration * 0.3}`);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="shoot-star absolute block h-[2px] origin-left rotate-[32deg]"
          style={{
            top: s.top,
            left: s.left,
            width: s.length,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(250,248,240,0.15) 35%, rgba(202,138,4,0.95) 75%, #faf8f0 100%)",
            boxShadow: "0 0 10px rgba(202,138,4,0.7)",
          }}
        />
      ))}
    </div>
  );
}
