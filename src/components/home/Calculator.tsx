"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { pinDistance, pinExtras } from "@/lib/mobile";
import {
  calculatorPricing,
  isQuoteAbovePublicPrice,
  type CalculatorCurrency,
  type CalculatorOption,
} from "@/data/content";

const steps = calculatorPricing.steps;

function findOption(stepId: string, label?: string) {
  if (!label) return undefined;
  const stepDef = steps.find((s) => s.id === stepId);
  return stepDef?.options.find((o) => o.label === label);
}

function formatMoney(usd: number, currency: CalculatorCurrency) {
  if (currency === "PKR") {
    const pkr = Math.round(usd * calculatorPricing.usdToPkr);
    return `Rs ${pkr.toLocaleString("en-PK")}`;
  }
  return `$${usd.toLocaleString("en-US")}`;
}

/** Type deals use base + add-on; extras use their own add-on only. */
function optionDealUsd(stepId: string, option: CalculatorOption) {
  if (stepId === "type") return calculatorPricing.basePrice + option.price;
  return option.price;
}

function isContactDeal(stepId: string, option: CalculatorOption) {
  if (option.quoteOnly) return true;
  return isQuoteAbovePublicPrice(optionDealUsd(stepId, option));
}

function optionPriceLabel(
  stepId: string,
  option: CalculatorOption,
  currency: CalculatorCurrency,
) {
  if (isContactDeal(stepId, option)) return "Contact for quote";
  if (option.price === 0) {
    return `included in ${formatMoney(calculatorPricing.basePrice, currency)} base`;
  }
  return `+${formatMoney(option.price, currency)}`;
}

/**
 * Project calculator — prices from content.ts.
 * Starter/small options show ballpark; medium/large are quote-only.
 */
export function Calculator() {
  const root = useRef<HTMLElement>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currency, setCurrency] = useState<CalculatorCurrency>(
    calculatorPricing.defaultCurrency,
  );
  const current = steps[0];

  const estimate = useMemo(() => {
    let totalUsd = calculatorPricing.basePrice;
    let needsQuote = false;
    for (const s of steps) {
      const picked = findOption(s.id, answers[s.id]);
      if (!picked) continue;
      if (isContactDeal(s.id, picked)) {
        needsQuote = true;
        continue;
      }
      totalUsd += picked.price;
    }
    // Combined starter picks that cross ~Rs 50k also go to contact
    if (!needsQuote && isQuoteAbovePublicPrice(totalUsd)) {
      needsQuote = true;
    }
    const typeOpt = findOption("type", answers.type);
    return {
      totalUsd,
      needsQuote,
      timeline: typeOpt?.timeline ?? "TBD",
    };
  }, [answers]);

  useGSAP(
    () => {
      registerGsap();
      if (!root.current) return;

      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px)", () => {
        gsap.set([".calc-intro", ".calc-left", ".calc-right", ".calc-glow"], {
          clearProps: "all",
        });
      });

      mm.add("(min-width: 768px)", () => {
        gsap.set(".calc-intro", { y: 16, autoAlpha: 0 });
        gsap.set(".calc-left", { y: 20, autoAlpha: 0 });
        gsap.set(".calc-right", { y: 20, autoAlpha: 0 });
        gsap.set(".calc-glow", { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: `+=${pinDistance(180)}%`,
            scrub: 0.8,
            pin: true,
            ...pinExtras(),
          },
        });

        tl.to(".calc-glow", { autoAlpha: 0.7, duration: 0.4, ease: "none" }, 0)
          .to(".calc-intro", { y: 0, autoAlpha: 1, duration: 0.4, ease: "none" }, 0.08)
          .to(".calc-left", { y: 0, autoAlpha: 1, duration: 0.5, ease: "none" }, 0.28)
          .to(".calc-right", { y: 0, autoAlpha: 1, duration: 0.5, ease: "none" }, 0.36);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative bg-[#080706] md:h-[100svh] md:overflow-hidden"
      aria-label="Project calculator"
    >
      <div
        className="calc-glow pointer-events-none absolute left-1/2 top-1/2 h-[40vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(202,138,4,0.16) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-5 py-14 md:px-8 md:pb-8 md:pt-24">
        <header className="calc-intro shrink-0 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#ca8a04]">
            Project calculator
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-[#faf8f0] md:text-3xl lg:text-[2.5rem]">
            From a simple page to a full rebuild.
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#faf8f0]/50">
            Starter & small jobs show ballpark prices from{" "}
            {formatMoney(calculatorPricing.basePrice, currency)}. Bigger builds — contact for a
            quote.
          </p>
        </header>

        <div className="mt-6 grid shrink-0 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)] lg:items-start">
          <div
            className="calc-left flex flex-col overflow-hidden rounded-3xl border border-[#ca8a04]/35 bg-[#141210]"
            style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}
          >
            <div className="shrink-0 px-5 pt-5 md:px-6 md:pt-6">
              <div className="mt-0 flex items-end justify-between gap-3">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#faf8f0] md:text-2xl">
                  {current.title}
                </h3>
                <span className="shrink-0 pb-0.5 text-[10px] uppercase tracking-[0.18em] text-[#faf8f0]/30">
                  Scroll ↓
                </span>
              </div>
            </div>

            <div
              data-lenis-prevent
              className="calc-options-scroll mt-3 overflow-y-auto overscroll-contain px-5 md:px-6 [-webkit-overflow-scrolling:touch] max-h-[min(360px,40vh)] md:max-h-[min(320px,38svh)]"
            >
              <div className="grid grid-cols-1 gap-2.5 pb-1 sm:grid-cols-2">
                {current.options.map((option) => {
                  const selected = answers[current.id] === option.label;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [current.id]: option.label }))}
                      className={cn(
                        "flex items-start justify-between gap-2 rounded-2xl border px-3.5 py-3 text-left text-sm transition",
                        selected
                          ? "border-[#ca8a04] bg-[#ca8a04]/10 text-[#faf8f0]"
                          : "border-[#faf8f0]/10 bg-[rgba(250,248,240,0.03)] text-[#faf8f0]/75 hover:border-[#faf8f0]/25",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block font-medium leading-snug">{option.label}</span>
                        {option.hint && (
                          <span className="mt-0.5 block text-[11px] leading-snug text-[#faf8f0]/40">
                            {option.hint}
                          </span>
                        )}
                        <span className="mt-1.5 block text-[11px] font-medium text-[#ca8a04]">
                          {optionPriceLabel(current.id, option, currency)}
                        </span>
                      </span>
                      {selected && <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ca8a04]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 border-t border-[#faf8f0]/8 px-5 py-4 md:px-6">
              <Link
                href="/contact"
                aria-disabled={!answers[current.id]}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
                  answers[current.id]
                    ? "bg-[#faf8f0] text-[#0a0a0c]"
                    : "pointer-events-none bg-[#faf8f0]/25 text-[#faf8f0]/40",
                )}
              >
                {estimate.needsQuote ? "Get a custom quote" : "Lock in a call"}{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside
            className="calc-right rounded-3xl border border-[#ca8a04]/30 bg-gradient-to-br from-[#ca8a04]/15 to-[#141210] p-6 md:p-7"
            style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#faf8f0]/40">
                Rough estimate
              </p>
              <div
                className="inline-flex rounded-full border border-[#faf8f0]/15 bg-[#0a0908]/70 p-0.5"
                role="group"
                aria-label="Currency"
              >
                {(["USD", "PKR"] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-bold tracking-wide transition",
                      currency === code
                        ? "bg-[#ca8a04] text-[#141210]"
                        : "text-[#faf8f0]/55 hover:text-[#faf8f0]",
                    )}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {estimate.needsQuote ? (
              <>
                <p className="mt-5 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#faf8f0] md:text-4xl">
                  Contact for quote
                </p>
                <p className="mt-2 text-sm text-[#faf8f0]/55">
                  This build depends on scope — we&apos;ll price it after a short discovery call.
                </p>
              </>
            ) : (
              <>
                <p className="mt-5 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[#faf8f0] md:text-5xl">
                  {formatMoney(estimate.totalUsd, currency)}
                  <span className="text-lg font-normal text-[#faf8f0]/45">+</span>
                </p>
                <p className="mt-2 text-sm text-[#faf8f0]/55">
                  Indicative · final quote after discovery
                  {currency === "PKR" && (
                    <span className="mt-1 block text-[11px] text-[#faf8f0]/35">
                      ~{calculatorPricing.usdToPkr} PKR / USD
                    </span>
                  )}
                </p>
              </>
            )}

            <div className="mt-6 space-y-0 text-sm">
              {(
                [
                  ...(!estimate.needsQuote
                    ? [["Base", formatMoney(calculatorPricing.basePrice, currency)]]
                    : []),
                  ["Timeline", estimate.timeline],
                  ["Type", answers.type ?? "—"],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-3 border-b border-[#faf8f0]/10 py-3 text-[#faf8f0]/70"
                >
                  <span className="shrink-0">{label}</span>
                  <span className="text-right text-[#faf8f0]">{value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
