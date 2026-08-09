"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { processSteps, services } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

export default function ServicesPage() {
  const [open, setOpen] = useState<string | null>(services[0]?.id ?? null);

  return (
    <section className="px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Services"
          title="Every digital surface — one technology partner."
          description="Web, mobile, UI/UX, graphics, cloud, AI, and product care. Process timelines and deep specs for stakeholders who want substance, not brochure fluff."
          className="mb-16"
        />

        <div className="mb-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step) => (
            <GlassCard key={step.step} className="p-5">
              <p className="font-mono text-xs text-gold">{step.step}</p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-cream">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-cream/50">{step.body}</p>
            </GlassCard>
          ))}
        </div>

        <div className="space-y-3">
          {services.map((service) => {
            const isOpen = open === service.id;
            return (
              <GlassCard key={service.id} className="overflow-hidden" hover={false}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : service.id)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left md:p-8"
                >
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-cream/40">
                      {service.subtitle}
                    </p>
                    <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl text-cream sm:text-2xl">
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
                {isOpen && (
                  <div className="border-t border-cream/10 px-6 pb-6 md:px-8 md:pb-8">
                    <p className="max-w-3xl pt-5 text-cream/60">{service.description}</p>
                    <ul className="mt-5 grid gap-2 text-sm text-cream/70 sm:grid-cols-2">
                      <li>• Discovery workshops & technical audit</li>
                      <li>• Design system + motion language</li>
                      <li>• Production engineering & CI/CD</li>
                      <li>• Launch analytics & iteration plan</li>
                    </ul>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
