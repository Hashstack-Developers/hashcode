"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { navLinks, siteConfig } from "@/data/content";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [dawnLight, setDawnLight] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Dawn section flips nav after sunrise (custom event from DawnTransition)
  useEffect(() => {
    const onDawn = (e: Event) => {
      const next = Boolean((e as CustomEvent<boolean>).detail);
      setDawnLight((prev) => (prev === next ? prev : next));
    };
    window.addEventListener("hashstack:dawn-light", onDawn);
    return () => window.removeEventListener("hashstack:dawn-light", onDawn);
  }, []);

  // Switch to dark-on-cream when light sections (Mac / Phone / cream stages) are under the header
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-nav-theme="light"]');
    if (!sections.length) {
      setLight(false);
      return;
    }

    const observers: IntersectionObserver[] = [];
    const visible = new Set<Element>();

    sections.forEach((section) => {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) visible.add(entry.target);
            else visible.delete(entry.target);
          });
          setLight(visible.size > 0);
        },
        {
          // Header band at top of viewport
          root: null,
          rootMargin: "-8px 0px -70% 0px",
          threshold: 0,
        },
      );
      io.observe(section);
      observers.push(io);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [pathname]);

  const navLight = light || dawnLight;

  useGSAP(
    () => {
      registerGsap();
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        gsap.fromTo(
          ".nav-pop",
          {
            y: -80,
            z: -120,
            rotateX: -55,
            autoAlpha: 0,
            transformPerspective: 900,
          },
          {
            y: 0,
            z: 0,
            rotateX: 0,
            autoAlpha: 1,
            duration: 1.05,
            stagger: 0.07,
            ease: "power4.out",
            delay: 0.15,
            clearProps: "transform",
          },
        );
      };

      const onReady = () => play();
      window.addEventListener("hashstack:loader-done", onReady);
      const t = window.setTimeout(play, 12000);

      return () => {
        window.removeEventListener("hashstack:loader-done", onReady);
        window.clearTimeout(t);
      };
    },
    { scope: headerRef },
  );

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        navLight && "bg-[#f5edd8]/85 shadow-[0_1px_0_rgba(80,50,10,0.08)] backdrop-blur-md",
      )}
      style={{ perspective: "1200px" }}
    >
      <div className="nav-pop mx-auto flex h-16 max-w-7xl items-center justify-between px-5 opacity-0 md:h-[5.25rem] md:px-8">
        <Link
          href="/"
          className={cn(
            "group relative font-[family-name:var(--font-display)] text-xl font-extrabold tracking-[0.14em] transition-colors duration-500 md:text-2xl",
            navLight
              ? "text-[#1a1510] drop-shadow-none"
              : "text-cream drop-shadow-[0_8px_30px_rgba(0,0,0,0.65)]",
          )}
        >
          {siteConfig.name}
          <span className="text-gold">.</span>
          <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gold shadow-[0_0_12px_#ca8a04] transition-all duration-500 group-hover:w-full" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold tracking-wide transition-colors duration-500",
                pathname === link.href
                  ? "text-gold"
                  : navLight
                    ? "text-[#1a1510]/65 hover:text-[#1a1510]"
                    : "text-cream/70 hover:text-cream",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={cn(
              "ml-3 inline-flex items-center gap-1.5 rounded-full border-2 px-5 py-2.5 text-sm font-extrabold transition duration-500",
              navLight
                ? "border-[#ca8a04] bg-[#1a1510] text-[#faf8f0] shadow-[0_8px_24px_rgba(80,50,10,0.15)] hover:bg-[#2a241c]"
                : "border-gold/50 bg-gold/15 text-cream shadow-[0_0_24px_rgba(202,138,4,0.25)] hover:border-gold hover:bg-gold/25",
            )}
          >
            Start a project
            <ArrowUpRight className="h-3.5 w-3.5 text-gold" />
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors duration-500 md:hidden",
            navLight
              ? "border-[#1a1510]/20 bg-[#1a1510]/5 text-[#1a1510]"
              : "border-cream/20 bg-cream/5 text-cream",
          )}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              "border-t px-5 py-6 backdrop-blur-xl md:hidden",
              navLight
                ? "border-[#1a1510]/10 bg-[#f5edd8]/95"
                : "border-cream/10 bg-[#141210]/95",
            )}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-lg font-bold",
                    pathname === link.href
                      ? "text-gold"
                      : navLight
                        ? "text-[#1a1510]/85"
                        : "text-cream/85",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
