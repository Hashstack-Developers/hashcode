"use client";

import { useRef, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { siteConfig } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

export default function ContactPage() {
  const root = useRef<HTMLElement>(null);
  const [budget, setBudget] = useState(60);
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      registerGsap();
      gsap.from(".contact-block", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.75,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Contact"
          title="Tell us what you want the world to feel."
          description="Interactive inquiry form with budget sliders and booking placeholder — ready for Cal.com / Calendly embed."
          className="mb-12 contact-block"
        />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <GlassCard className="contact-block p-7 md:p-9" hover={false}>
            {sent ? (
              <div className="py-16 text-center">
                <p className="font-[family-name:var(--font-display)] text-3xl text-cream">Request received.</p>
                <p className="mt-3 text-cream/55">We&apos;ll reply within one business day.</p>
              </div>
            ) : (
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm text-cream/60">
                    Name
                    <input
                      required
                      className="mt-2 w-full rounded-xl border border-cream/10 bg-cream/5 px-4 py-3 text-cream outline-none focus:border-gold/50"
                      placeholder="Alex Rivera"
                    />
                  </label>
                  <label className="block text-sm text-cream/60">
                    Email
                    <input
                      required
                      type="email"
                      className="mt-2 w-full rounded-xl border border-cream/10 bg-cream/5 px-4 py-3 text-cream outline-none focus:border-gold/50"
                      placeholder="you@company.com"
                    />
                  </label>
                </div>

                <label className="block text-sm text-cream/60">
                  Project type
                  <select className="mt-2 w-full rounded-xl border border-cream/10 bg-[#12141a] px-4 py-3 text-cream outline-none focus:border-gold/50">
                    <option>Marketing website</option>
                    <option>Web app / SaaS</option>
                    <option>Mobile app</option>
                    <option>AI / automation</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="block text-sm text-cream/60">
                  Budget range · ${budget}k+
                  <input
                    type="range"
                    min={20}
                    max={250}
                    step={10}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="mt-4 w-full accent-gold"
                  />
                </label>

                <label className="block text-sm text-cream/60">
                  Brief
                  <textarea
                    required
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-cream/10 bg-cream/5 px-4 py-3 text-cream outline-none focus:border-gold/50"
                    placeholder="Goals, timeline, references…"
                  />
                </label>

                <button
                  type="submit"
                  className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-black"
                >
                  Send inquiry
                </button>
              </form>
            )}
          </GlassCard>

          <div className="space-y-4">
            <GlassCard className="contact-block p-6">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-gold" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cream/40">Email</p>
                  <p className="mt-1 text-cream">{siteConfig.email}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="contact-block p-6">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-gold" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cream/40">Phone</p>
                  <p className="mt-1 text-cream">{siteConfig.phone}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="contact-block p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-gold" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cream/40">Studio</p>
                  <p className="mt-1 text-cream">{siteConfig.location}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="contact-block flex min-h-[220px] flex-col items-center justify-center p-6 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-cream/40">Booking embed</p>
              <p className="mt-3 max-w-xs text-sm text-cream/55">
                Drop Cal.com / Calendly iframe here for instant discovery calls.
              </p>
              <div className="mt-6 h-24 w-full rounded-2xl border border-dashed border-cream/20 bg-cream/[0.03]" />
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
