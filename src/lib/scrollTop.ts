/** Slow ease-out for scroll-to-top (seconds from distance). */
export function scrollTopDurationSec(scrollY = typeof window !== "undefined" ? window.scrollY : 0) {
  // Long cinematic pages need more time; clamp so it never feels endless
  return Math.min(5.2, Math.max(2.8, scrollY / 1800));
}

/**
 * Native animated scroll to top — browser `behavior: "smooth"` is too fast / uncapped.
 * Cancels any in-flight animation when called again.
 */
let scrollTopRaf = 0;

export function slowScrollToTop() {
  if (typeof window === "undefined") return;

  window.cancelAnimationFrame(scrollTopRaf);

  const start = window.scrollY || document.documentElement.scrollTop || 0;
  if (start <= 1) return;

  const duration = scrollTopDurationSec(start) * 1000;
  const t0 = performance.now();
  // easeInOutCubic — gentle start + soft landing
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / duration);
    const y = start * (1 - ease(p));
    window.scrollTo(0, y);
    if (p < 1) scrollTopRaf = window.requestAnimationFrame(step);
  };

  scrollTopRaf = window.requestAnimationFrame(step);
}
