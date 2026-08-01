"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "type",
    title: "What are we building?",
    options: ["Marketing site", "Web app / SaaS", "Mobile app", "AI product"],
  },
  {
    id: "scope",
    title: "How ambitious is the scope?",
    options: ["MVP in 6–8 weeks", "Full v1 launch", "Enterprise rebuild", "Ongoing product team"],
  },
  {
    id: "motion",
    title: "Motion & 3D intensity?",
    options: ["Subtle polish", "Scroll storytelling", "Heavy WebGL", "Social-first (Reels)"],
  },
];

/**
 * Calculator cinema — pin, panels slide in on scrub; choices stay interactive.
 */
export function Calculator() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const estimate = useMemo(() => {
    const base = 28000;
    const typeBoost: Record<string, number> = {
      "Marketing site": 0,
      "Web app / SaaS": 22000,
      "Mobile app": 30000,
      "AI product": 38000,
    };
    const scopeBoost: Record<string, number> = {
      "MVP in 6–8 weeks": 0,
      "Full v1 launch": 25000,
      "Enterprise rebuild": 60000,
      "Ongoing product team": 45000,
    };
    const motionBoost: Record<string, number> = {
      "Subtle polish": 0,
      "Scroll storytelling": 12000,
      "Heavy WebGL": 28000,
      "Social-first (Reels)": 16000,
    };
    const weeks: Record<string, string> = {
      "MVP in 6–8 weeks": "6–8 weeks",
      "Full v1 launch": "12–16 weeks",
      "Enterprise rebuild": "20–28 weeks",
      "Ongoing product team": "Retainer",
    };

    const total =
      base +
      (typeBoost[answers.type] ?? 0) +
      (scopeBoost[answers.scope] ?? 0) +
      (motionBoost[answers.motion] ?? 0);

    return {
      total,
      timeline: weeks[answers.scope] ?? "TBD",
    };
  }, [answers]);

  useGSAP(
    () => {
      registerGsap();
      if (!root.current) return;

      gsap.set(".calc-intro", { y: 24, autoAlpha: 0 });
      gsap.set(".calc-left", { x: -60, autoAlpha: 0 });
      gsap.set(".calc-right", { x: 60, autoAlpha: 0 });
      gsap.set(".calc-glow", { autoAlpha: 0, scale: 0.7 });
      gsap.set(".calc-hint", { autoAlpha: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=220%",
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(".calc-intro", { y: 0, autoAlpha: 1, duration: 0.5, ease: "none" }, 0)
        .to(".calc-glow", { autoAlpha: 0.8, scale: 1, duration: 0.55, ease: "none" }, 0.15)
        .to(".calc-hint", { autoAlpha: 0.45, duration: 0.3, ease: "none" }, 0.2)
        .to(".calc-hint", { autoAlpha: 0, duration: 0.35, ease: "none" }, 0.55)
        .to(".calc-left", { x: 0, autoAlpha: 1, duration: 0.7, ease: "none" }, 0.6)
        .to(".calc-right", { x: 0, autoAlpha: 1, duration: 0.7, ease: "none" }, 0.75)
        .to(".calc-left", { y: -6, duration: 0.5, ease: "none" }, 1.4)
        .to(".calc-right", { y: 6, duration: 0.5, ease: "none" }, 1.4)
        .to(".calc-glow", { scale: 1.12, duration: 0.6, ease: "none" }, 1.6)
        .to(".calc-outro", { autoAlpha: 1, duration: 0.4, ease: "none" }, 2.0);

      gsap.set(".calc-outro", { autoAlpha: 0 });
    },
    { scope: root },
  );

  const current = steps[step];

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] overflow-hidden bg-[#080706]"
      aria-label="Project calculator"
    >
      <div className="relative flex h-[100svh] flex-col px-5 py-16 md:px-8 md:py-20">
        <div
          className="calc-glow pointer-events-none absolute left-1/2 top-1/2 h-[50vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(202,138,4,0.18) 0%, transparent 70%)",
          }}
        />

        <div className="calc-intro relative z-20 mx-auto w-full max-w-3xl text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#ca8a04]">
            Project calculator
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#faf8f0] md:text-5xl">
            Estimate your build in three cinematic steps.
          </h2>
          <p className="mt-3 text-sm text-[#faf8f0]/50 md:text-base">
            Scroll the panels into place — then tap options to shape the range.
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-8 grid w-full max-w-6xl flex-1 gap-4 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div
            className="calc-left rounded-3xl border border-[#ca8a04]/35 bg-[#141210]/92 p-6 backdrop-blur-xl md:p-9"
            style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}
          >
            <div className="mb-7 flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition",
                    i <= step ? "bg-[#ca8a04]" : "bg-[#faf8f0]/10",
                  )}
                />
              ))}
            </div>

            <p className="text-xs uppercase tracking-[0.22em] text-[#faf8f0]/40">Step 0{step + 1}</p>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[#faf8f0] md:text-3xl">
              {current.title}
            </h3>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {current.options.map((option) => {
                const selected = answers[current.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [current.id]: option }))}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm transition",
                      selected
                        ? "border-[#ca8a04] bg-[#ca8a04]/10 text-[#faf8f0]"
                        : "border-[#faf8f0]/10 bg-[rgba(250,248,240,0.03)] text-[#faf8f0]/70 hover:border-[#faf8f0]/25",
                    )}
                  >
                    {option}
                    {selected && <Check className="h-4 w-4 text-[#ca8a04]" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="rounded-full border border-[#faf8f0]/15 px-5 py-2.5 text-sm text-[#faf8f0]/70 disabled:opacity-30"
              >
                Back
              </button>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  disabled={!answers[current.id]}
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#ca8a04] px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-40"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[#faf8f0] px-5 py-2.5 text-sm font-semibold text-[#0a0a0c]"
                >
                  Lock in a call <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          <div
            className="calc-right rounded-3xl border border-[#ca8a04]/30 bg-gradient-to-br from-[#ca8a04]/15 to-[#141210]/95 p-6 md:p-9"
            style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-[#faf8f0]/40">Rough estimate</p>
            <p className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold text-[#faf8f0] md:text-5xl">
              ${estimate.total.toLocaleString()}
              <span className="text-lg font-normal text-[#faf8f0]/45">+</span>
            </p>
            <p className="mt-2 text-sm text-[#faf8f0]/55">Indicative range · final quote after discovery</p>
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between border-b border-[#faf8f0]/10 pb-3 text-[#faf8f0]/70">
                <span>Timeline</span>
                <span className="text-[#faf8f0]">{estimate.timeline}</span>
              </div>
              <div className="flex justify-between border-b border-[#faf8f0]/10 pb-3 text-[#faf8f0]/70">
                <span>Type</span>
                <span className="text-[#faf8f0]">{answers.type ?? "—"}</span>
              </div>
              <div className="flex justify-between border-b border-[#faf8f0]/10 pb-3 text-[#faf8f0]/70">
                <span>Motion</span>
                <span className="text-[#faf8f0]">{answers.motion ?? "—"}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="calc-hint relative z-20 mt-4 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-[#ca8a04]/65">
          Scroll · panels assemble
        </p>
        <p className="calc-outro relative z-20 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#ca8a04]/50">
          Ready when you are
        </p>
      </div>
    </section>
  );
}
