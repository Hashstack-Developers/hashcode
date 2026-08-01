"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { team, values } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

const timeline = [
  { year: "2019", title: "Studio founded", body: "Two engineers and a motion designer shipping brand sites." },
  { year: "2021", title: "Product studio", body: "Expanded into SaaS, mobile, and design systems." },
  { year: "2023", title: "3D & AI desk", body: "Dedicated WebGL and LLM product teams." },
  { year: "2026", title: "Global remote", body: "40+ clients across continents, still craft-obsessed." },
];

export default function AboutPage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      gsap.from(".about-block", {
        y: 36,
        autoAlpha: 0,
        stagger: 0.1,
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
          eyebrow="About"
          title="A software house obsessed with cinematic product craft."
          description="Hashstack blends strategy, immersive frontend, and production engineering for brands that need to look inevitable."
          className="mb-16 about-block"
        />

        <div className="mb-20 grid gap-4 md:grid-cols-4">
          {timeline.map((item) => (
            <GlassCard key={item.year} className="about-block p-6">
              <p className="font-mono text-sm text-gold">{item.year}</p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl text-cream">{item.title}</h3>
              <p className="mt-2 text-sm text-cream/55">{item.body}</p>
            </GlassCard>
          ))}
        </div>

        <SectionHeading eyebrow="Leadership" title="The desk that ships." className="mb-8 about-block" />
        <div className="mb-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <GlassCard
              key={member.name}
              className="about-block group p-6 transition duration-500 hover:-translate-y-1 hover:rotate-1"
            >
              <div className="mb-6 aspect-square rounded-2xl bg-gradient-to-br from-gold/25 to-amber-400/10" />
              <h3 className="font-[family-name:var(--font-display)] text-xl text-cream">{member.name}</h3>
              <p className="text-sm text-gold">{member.role}</p>
              <p className="mt-1 text-sm text-cream/45">{member.focus}</p>
            </GlassCard>
          ))}
        </div>

        <SectionHeading eyebrow="Culture" title="Values we refuse to compromise." className="mb-8 about-block" />
        <div className="grid gap-4 md:grid-cols-2">
          {values.map((value) => (
            <GlassCard key={value.title} className="about-block p-7">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-cream">{value.title}</h3>
              <p className="mt-3 text-cream/55">{value.body}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
