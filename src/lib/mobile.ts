/** Shared mobile / coarse-pointer detection for lighter cinema. */
export function isMobileViewport() {
  if (typeof window === "undefined") return false;
  // Prefer width — DevTools device mode often keeps pointer:fine
  if (window.matchMedia("(max-width: 768px)").matches) return true;
  if (window.matchMedia("(pointer: coarse)").matches) return true;
  // Low-memory / low-core phones that report as desktop width
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4 && window.innerWidth < 1024) {
    return true;
  }
  return false;
}

/**
 * Scale pin distances on phones.
 * Higher factor = more scroll travel = slower scrub animation (fixes “too fast”).
 */
export function pinDistance(desktopPct: number, mobileFactor = 0.78) {
  if (isMobileViewport()) return Math.max(160, Math.round(desktopPct * mobileFactor));
  return desktopPct;
}

/** Softer scrub on mobile so progress eases between frames instead of snapping. */
export function scrubFeel(desktop: number) {
  if (!isMobileViewport()) return desktop;
  return Math.min(1.45, Math.max(0.95, desktop * 1.4));
}

/**
 * Pin extras that stabilize handoffs between consecutive pinned sections.
 * preventOverlaps / fastScrollEnd stop the “glitch then recover” between sections.
 */
export function pinExtras() {
  if (!isMobileViewport()) {
    return { anticipatePin: 1 as const };
  }
  return {
    anticipatePin: 1 as const,
    preventOverlaps: true as const,
    fastScrollEnd: true as const,
  };
}
