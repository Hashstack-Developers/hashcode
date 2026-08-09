"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Floating scroll-to-top — shows after leaving the first viewport.
 * Desktop Lenis listens for `hashstack:scroll-top`; mobile uses native smooth scroll.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    window.dispatchEvent(new CustomEvent("hashstack:scroll-top"));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          onClick={goTop}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            // Sit above the WhatsApp FAB
            "fixed bottom-[5.75rem] right-5 z-[80] flex h-11 w-11 items-center justify-center",
            "rounded-full border border-[#ca8a04]/45 bg-[#141210]/88 text-[#ca8a04]",
            "shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md",
            "transition-colors hover:border-[#ca8a04] hover:bg-[#ca8a04] hover:text-[#141210]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ca8a04]",
            "md:bottom-[6.5rem] md:right-8 md:h-12 md:w-12",
          )}
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.25} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
