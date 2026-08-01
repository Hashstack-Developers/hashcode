"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Globe, MessageCircle, Share2, Sparkles } from "lucide-react";
import { navLinks, siteConfig } from "@/data/content";

const socials = [
  { label: "X / Twitter", Icon: Share2 },
  { label: "Instagram", Icon: Sparkles },
  { label: "LinkedIn", Icon: Globe },
  { label: "GitHub", Icon: MessageCircle },
] as const;

export function Footer() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => {
      setNow(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        }).format(new Date()),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-cream/10 bg-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(202,138,4,0.08),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 md:px-8">
        <div className="mb-16 grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-cream md:text-6xl">
              {siteConfig.fullName}
            </p>
            <p className="mt-4 max-w-md text-cream/50">{siteConfig.tagline}</p>
            <form
              className="mt-8 flex max-w-md overflow-hidden rounded-full border border-cream/15 bg-cream/[0.03] p-1"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Newsletter email"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-cream outline-none placeholder:text-cream/35"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-full bg-gold px-4 py-2 text-sm font-medium text-black"
              >
                Join <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-cream/35">Navigate</p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream/65 transition hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-cream/35">Studio</p>
            <ul className="space-y-3 text-cream/65">
              <li>{siteConfig.email}</li>
              <li>{siteConfig.phone}</li>
              <li>{siteConfig.location}</li>
              <li className="font-mono text-sm text-gold">{now || "—:—:—"}</li>
            </ul>
            <div className="mt-6 flex gap-3">
              {socials.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition hover:border-gold/50 hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-cream/10 pt-6 text-sm text-cream/35 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.
          </p>
          <p className="tracking-wide">Stacked for craft · engineered for scale</p>
        </div>
      </div>
    </footer>
  );
}
