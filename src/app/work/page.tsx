"use client";

import { useMemo, useState } from "react";
import { projects } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const filters = ["All", "Web", "Mobile", "AI", "SaaS", "Brand", "Cloud"] as const;

export default function WorkPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [active, setActive] = useState<string | null>(null);

  const list = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((p) => p.category.toLowerCase().includes(filter.toLowerCase())),
    [filter],
  );

  const selected = projects.find((p) => p.id === active);

  return (
    <section className="px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Work"
          title="Launches across every service we offer."
          description="Web, mobile, SaaS, brand, and AI — filter the gallery, open a case, and see the metrics that mattered."
          className="mb-10"
        />

        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm",
                filter === f
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-cream/15 text-cream/60",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {list.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setActive(project.id)}
              className="text-left"
            >
              <GlassCard
                className={cn("min-h-[240px] overflow-hidden bg-gradient-to-br p-6 sm:min-h-[280px] sm:p-7", project.gradient)}
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-cream/50">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <div className="mt-16 sm:mt-24">
                  <p className="text-sm text-gold">{project.metric}</p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-cream sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-cream/60">{project.description}</p>
                </div>
              </GlassCard>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-5 backdrop-blur-md">
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 cursor-default"
            onClick={() => setActive(null)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cream/10 bg-[#101218] p-6 shadow-2xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cream/40">
              {selected.category} · {selected.year}
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-cream sm:text-3xl">
              {selected.title}
            </h3>
            <p className="mt-4 text-cream/60">{selected.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-cream/10 p-4">
                <p className="text-xs text-cream/40">Metric</p>
                <p className="mt-1 text-gold">{selected.metric}</p>
              </div>
              <div className="rounded-2xl border border-cream/10 p-4">
                <p className="text-xs text-cream/40">Media</p>
                <p className="mt-1 text-cream">Gallery ready</p>
              </div>
              <div className="rounded-2xl border border-cream/10 p-4">
                <p className="text-xs text-cream/40">Stack</p>
                <p className="mt-1 text-cream">Next · R3F · GSAP</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="mt-8 rounded-full border border-cream/15 px-5 py-2.5 text-sm text-cream"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
