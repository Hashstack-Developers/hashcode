"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { processSteps, services } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

export default function ServicesPage() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(services[0]?.id ?? null);

  useGSAP(
    () => {
      registerGsap();
      gsap.from(".svc-block", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.75,
        scrollTrigger: { trigger: ".svc-list", start: "top 80%" },
      });
      gsap.from(".process-step", {
        x: -30,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.7,
        scrollTrigger: { trigger: ".process-rail", start: "top 75%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Services"
          title="Deep-dive delivery tracks for every product surface."
          description="Process timelines, sub-features, and accordion tech specs — built for stakeholders who want substance."
          className="mb-16"
        />

        <div className="process-rail mb-20 grid gap-4 md:grid-cols-5">
          {processSteps.map((step) => (
            <GlassCard key={step.step} className="process-step p-5">
              <p className="font-mono text-xs text-gold">{step.step}</p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-cream">{step.title}</h3>
              <p className="mt-2 text-sm text-cream/50">{step.body}</p>
            </GlassCard>
          ))}
        </div>

        <div className="svc-list space-y-3">
          {services.map((service) => {
            const isOpen = open === service.id;
            return (
              <GlassCard key={service.id} className="svc-block overflow-hidden" hover={false}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : service.id)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left md:p-8"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cream/40">{service.subtitle}</p>
                    <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-cream">
                      {service.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-gold transition",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-400",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-cream/10 px-6 pb-6 md:px-8 md:pb-8">
                      <p className="max-w-3xl pt-5 text-cream/60">{service.description}</p>
                      <ul className="mt-5 grid gap-2 text-sm text-cream/70 sm:grid-cols-2">
                        <li>• Discovery workshops & technical audit</li>
                        <li>• Design system + motion language</li>
                        <li>• Production engineering & CI/CD</li>
                        <li>• Launch analytics & iteration plan</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
