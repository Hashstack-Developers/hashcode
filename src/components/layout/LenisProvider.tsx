"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

/**
 * Global inertial scroll via `lenis` (successor to @studio-freight/lenis).
 * Syncs with GSAP ScrollTrigger through the ticker + scroll listener.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    registerGsap();

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenisRef.current = lenis;
    lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const unlock = () => {
      lenis.start();
      ScrollTrigger.refresh();
      // Second refresh after pin spacers settle (dawn/mac/phone/dusk)
      window.setTimeout(() => ScrollTrigger.refresh(), 400);
    };
    const lock = () => lenis.stop();

    window.addEventListener("hashstack:loader-done", unlock);
    window.addEventListener("hashstack:loader-lock", lock);

    // Mobile-friendly failsafe — unlock scroll even if loader event is late
    const failsafe = window.setTimeout(unlock, 7000);

    // Do NOT skip via session — loader plays every refresh
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(failsafe);
      window.removeEventListener("hashstack:loader-done", unlock);
      window.removeEventListener("hashstack:loader-lock", lock);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
