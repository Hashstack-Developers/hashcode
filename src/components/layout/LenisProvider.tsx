"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { isMobileViewport } from "@/lib/mobile";
import { scrollTopDurationSec, slowScrollToTop } from "@/lib/scrollTop";

/**
 * Desktop: Lenis smooth scroll + ScrollTrigger sync.
 * Mobile: native scroll + ScrollTrigger.normalizeScroll (in registerGsap).
 * Soft-touch Lenis is NOT used on mobile — it fights normalizeScroll / pins.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    registerGsap();
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    const mobile = isMobileViewport();
    let refreshTimer: number | undefined;

    const hardRefresh = () => {
      // Debounce — rapid refresh mid-scroll is what makes section anims “break then fix”
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 80);
    };

    if (mobile) {
      const onScrollTop = () => {
        slowScrollToTop();
      };
      window.addEventListener("hashstack:scroll-top", onScrollTop);

      const onDone = () => {
        // One settle pass after loader + fonts — avoid a refresh storm
        hardRefresh();
        window.setTimeout(() => ScrollTrigger.refresh(true), 400);
      };

      window.addEventListener("hashstack:loader-done", onDone);
      const failsafe = window.setTimeout(onDone, 2500);

      const onOrient = () => {
        window.setTimeout(() => ScrollTrigger.refresh(true), 200);
      };
      window.addEventListener("orientationchange", onOrient);

      void document.fonts?.ready?.then(() => {
        window.setTimeout(() => ScrollTrigger.refresh(true), 100);
      });

      return () => {
        window.clearTimeout(failsafe);
        window.clearTimeout(refreshTimer);
        window.removeEventListener("hashstack:loader-done", onDone);
        window.removeEventListener("orientationchange", onOrient);
        window.removeEventListener("hashstack:scroll-top", onScrollTop);
      };
    }

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
      hardRefresh();
      window.setTimeout(() => ScrollTrigger.refresh(true), 400);
    };
    const lock = () => lenis.stop();
    const onScrollTop = () => {
      lenis.scrollTo(0, {
        duration: scrollTopDurationSec(),
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
        force: true,
      });
    };

    window.addEventListener("hashstack:loader-done", unlock);
    window.addEventListener("hashstack:loader-lock", lock);
    window.addEventListener("hashstack:scroll-top", onScrollTop);
    const failsafe = window.setTimeout(unlock, 7000);
    const onResize = () => hardRefresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(failsafe);
      window.clearTimeout(refreshTimer);
      window.removeEventListener("hashstack:loader-done", unlock);
      window.removeEventListener("hashstack:loader-lock", lock);
      window.removeEventListener("hashstack:scroll-top", onScrollTop);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
