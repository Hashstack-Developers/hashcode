"use client";

import Image from "next/image";
import { aboutStory, team, values } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AboutPage() {
  return (
    <section className="px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="About"
          title={aboutStory.title}
          description={aboutStory.description}
          className="mb-16"
        />

        <div className="mb-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aboutStory.timeline.map((item) => (
            <GlassCard key={item.year + item.title} className="p-6">
              <p className="font-mono text-sm text-gold">{item.year}</p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl text-cream">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-cream/55">{item.body}</p>
            </GlassCard>
          ))}
        </div>

        <SectionHeading eyebrow="Leadership" title="The desk that ships." className="mb-8" />
        <div className="mb-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <GlassCard
              key={member.name}
              className="group p-6 transition duration-500 hover:-translate-y-1 hover:rotate-1"
            >
              <div className="relative mb-6 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gold/25 to-amber-400/10">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                    priority={member.name === "Mateen Imran"}
                  />
                ) : null}
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-xl text-cream">
                {member.name}
              </h3>
              <p className="text-sm text-gold">{member.role}</p>
              <p className="mt-1 text-sm text-cream/45">{member.focus}</p>
            </GlassCard>
          ))}
        </div>

        <SectionHeading eyebrow="Culture" title="Values we refuse to compromise." className="mb-8" />
        <div className="grid gap-4 md:grid-cols-2">
          {values.map((value) => (
            <GlassCard key={value.title} className="p-7">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-cream">
                {value.title}
              </h3>
              <p className="mt-3 text-cream/55">{value.body}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
