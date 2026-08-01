"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { isMobileViewport } from "@/lib/mobile";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Mobile URL-bar resize thrash + many pins = freeze / “couldn't load”
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
  ScrollTrigger.defaults({
    anticipatePin: 1,
  });
  // Optional mobile-only selectors shouldn't spam the console
  gsap.config({ nullTargetWarn: false });

  if (isMobileViewport()) {
    // Keeps pin math on the JS scroll path — cuts inter-section jumps on iOS/Android
    try {
      ScrollTrigger.normalizeScroll({
        allowNestedScroll: true,
      });
    } catch {
      /* older environments */
    }
  }

  registered = true;
}

export { gsap, ScrollTrigger, useGSAP };
