import type { Metadata } from "next";
import { AirDrawStudio } from "@/components/play/AirDrawStudio";

export const metadata: Metadata = {
  title: "Air Draw · Hashstack",
  description:
    "Draw in the air with your hands — webcam + MediaPipe hand tracking, Instagram-style AR on the web.",
};

export default function PlayPage() {
  return (
    <section className="relative px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-36" data-nav-theme="dark">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(202,138,4,0.12),transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-8 max-w-2xl md:mb-10">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#ca8a04]">Lab · Play</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#faf8f0] md:text-5xl">
            Draw with your hands.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#faf8f0]/55 md:text-base">
            Live camera, hand landmarks, pinch-to-paint — the same idea as Instagram AR filters, built
            into Hashstack with MediaPipe on the web.
          </p>
        </header>

        <AirDrawStudio />

        <ul className="mt-8 grid gap-3 text-sm text-[#faf8f0]/45 sm:grid-cols-3">
          <li className="rounded-2xl border border-[#faf8f0]/8 bg-[rgba(250,248,240,0.03)] px-4 py-3">
            <span className="font-medium text-[#ca8a04]">1.</span> Allow camera access
          </li>
          <li className="rounded-2xl border border-[#faf8f0]/8 bg-[rgba(250,248,240,0.03)] px-4 py-3">
            <span className="font-medium text-[#ca8a04]">2.</span> Pinch thumb + index to draw
          </li>
          <li className="rounded-2xl border border-[#faf8f0]/8 bg-[rgba(250,248,240,0.03)] px-4 py-3">
            <span className="font-medium text-[#ca8a04]">3.</span> Release to lift the pen · Save PNG
          </li>
        </ul>
      </div>
    </section>
  );
}
