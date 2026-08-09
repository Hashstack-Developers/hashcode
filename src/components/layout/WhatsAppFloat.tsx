"use client";

import { siteConfig } from "@/data/content";
import { cn } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
      <path d="M16.04 2C8.6 2 2.55 7.95 2.55 15.27c0 2.34.67 4.53 1.83 6.4L2 30l8.55-2.24a13.4 13.4 0 0 0 5.49 1.2h.01c7.43 0 13.49-5.95 13.49-13.27C29.54 7.95 23.47 2 16.04 2zm0 24.3h-.01a11.1 11.1 0 0 1-5.66-1.55l-.4-.24-4.98 1.3 1.33-4.85-.27-.43a10.9 10.9 0 0 1-1.68-5.81c0-6.07 5.02-11 11.18-11 6.16 0 11.18 4.93 11.18 11s-5.02 11.58-11.18 11.58zm6.13-8.2c-.34-.17-1.99-.98-2.3-1.09-.31-.11-.53-.16-.76.17-.22.34-.87 1.09-1.07 1.31-.2.23-.39.25-.73.08-.34-.17-1.42-.52-2.7-1.66-1-.89-1.67-1.98-1.87-2.32-.2-.34-.02-.52.15-.69.15-.15.34-.39.51-.58.17-.2.22-.34.34-.56.11-.23.06-.42-.03-.59-.08-.17-.76-1.82-1.04-2.49-.27-.66-.55-.57-.76-.58h-.65c-.22 0-.58.08-.88.42-.31.34-1.15 1.12-1.15 2.73s1.18 3.17 1.34 3.39c.17.22 2.32 3.54 5.62 4.96 2.1.9 2.92.98 3.97.82.64-.1 1.99-.81 2.27-1.59.28-.78.28-1.45.2-1.59-.08-.14-.31-.23-.65-.4z" />
    </svg>
  );
}

/**
 * Always-on WhatsApp FAB — bottom-right with pulse ring.
 * Sits above ScrollToTop when that button is visible.
 */
export function WhatsAppFloat() {
  const href = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    "Hi Hashstack — I’d like to talk about a project.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "group fixed bottom-5 right-5 z-[85] flex h-14 w-14 items-center justify-center",
        "rounded-full bg-[#25D366] text-white",
        "shadow-[0_12px_40px_rgba(37,211,102,0.45)]",
        "transition-transform duration-300 hover:scale-105 active:scale-95",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]",
        "md:bottom-8 md:right-8",
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#25D366]/45"
        style={{ animationDuration: "2.2s" }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -inset-1 rounded-full border-2 border-[#25D366]/50 opacity-70 transition group-hover:opacity-100"
        aria-hidden
      />
      <WhatsAppIcon className="relative z-10 h-7 w-7" />
    </a>
  );
}
