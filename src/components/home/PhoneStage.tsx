"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ThumbsUp, Share2, Play } from "lucide-react";

type PostChapter = {
  id: string;
  name: string;
  label: string;
  side: "left" | "right";
  mark: string;
  kind: "design" | "instagram" | "facebook" | "reel";
};

const GOLD = "#ca8a04";
const CREAM = "#faf8f0";
const FOOTPRINTS = 6;

const POSTS: PostChapter[] = [
  {
    id: "graphics",
    name: "Graphics",
    label: "Design",
    side: "left",
    mark: "Gx",
    kind: "design",
  },
  {
    id: "instagram",
    name: "Instagram",
    label: "Feed post",
    side: "right",
    mark: "Ig",
    kind: "instagram",
  },
  {
    id: "facebook",
    name: "Facebook",
    label: "Ad / post",
    side: "left",
    mark: "Fb",
    kind: "facebook",
  },
  {
    id: "reel",
    name: "Reels",
    label: "Video",
    side: "right",
    mark: "Vd",
    kind: "reel",
  },
];

export function PhoneStage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (!root.current) return;

      gsap.set(".phone-rig", {
        y: 140,
        rotateX: 18,
        rotateY: 14,
        scale: 0.8,
        autoAlpha: 0.35,
      });
      gsap.set(".phone-intro", { y: 24, autoAlpha: 0 });
      gsap.set(".phone-glow", { opacity: 0 });
      gsap.set(".phone-slide", { autoAlpha: 0, scale: 0.94 });
      gsap.set(".phone-dock-item", { autoAlpha: 0, scale: 0.35, y: 18 });
      gsap.set(".phone-fly", { autoAlpha: 0, scale: 0.3 });
      gsap.set(".phone-print", { autoAlpha: 0, scale: 0, visibility: "hidden" });
      gsap.set(".phone-outro", { autoAlpha: 0, y: 12 });
      gsap.set(".design-layer", { autoAlpha: 0, scale: 0.85 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${260 + POSTS.length * 95}%`,
          scrub: 1.05,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(".phone-glow", { opacity: 1, duration: 0.5, ease: "none" }, 0)
        .to(
          ".phone-rig",
          {
            y: 0,
            rotateX: 4,
            rotateY: -2,
            scale: 1,
            autoAlpha: 1,
            duration: 0.95,
            ease: "none",
          },
          0,
        )
        .to(".phone-intro", { y: 0, autoAlpha: 1, duration: 0.45, ease: "none" }, 0.15);

      let t = 1.0;

      POSTS.forEach((p, i) => {
        const slide = `.phone-slide-${p.id}`;
        const fly = `.phone-fly-${p.id}`;
        const dock = `.phone-dock-${p.id}`;
        const prints = `.phone-print-${p.id}`;

        tl.to(slide, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "none" }, t);

        // Design layers build for graphics chapter
        if (p.kind === "design") {
          tl.to(
            `${slide} .design-layer`,
            { autoAlpha: 1, scale: 1, stagger: 0.12, duration: 0.28, ease: "none" },
            t + 0.15,
          );
        }

        tl.fromTo(
          prints,
          { autoAlpha: 0, scale: 0.3, visibility: "visible" },
          {
            autoAlpha: 1,
            scale: 1.15,
            stagger: 0.04,
            duration: 0.18,
            ease: "none",
          },
          t + 0.45,
        )
          .to(
            prints,
            { autoAlpha: 0, scale: 0, duration: 0.28, ease: "none" },
            t + 0.78,
          )
          .set(prints, { autoAlpha: 0, scale: 0, visibility: "hidden" }, t + 1.08)
          .set(
            fly,
            {
              autoAlpha: 1,
              scale: 1.05,
              left: "50%",
              top: "50%",
              xPercent: -50,
              yPercent: -50,
              rotation: p.side === "left" ? -10 : 10,
            },
            t + 0.48,
          )
          .to(
            fly,
            {
              left: p.side === "left" ? "8%" : "92%",
              top: `${24 + (i % 2) * 24}%`,
              scale: 0.72,
              rotation: 0,
              duration: 0.55,
              ease: "none",
            },
            t + 0.48,
          )
          .to(slide, { autoAlpha: 0, scale: 0.95, duration: 0.3, ease: "none" }, t + 0.7)
          .to(dock, { autoAlpha: 1, scale: 1, y: 0, duration: 0.4, ease: "none" }, t + 0.9)
          .to(fly, { autoAlpha: 0, duration: 0.2, ease: "none" }, t + 1.0)
          .to(
            ".phone-rig",
            {
              rotateY: p.side === "left" ? 8 : -8,
              duration: 0.35,
              ease: "none",
            },
            t + 0.4,
          );

        t += 1.35;
      });

      tl.to(".phone-rig", { rotateY: 0, scale: 0.96, duration: 0.5, ease: "none" }, t).to(
        ".phone-outro",
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "none" },
        t,
      );
    },
    { scope: root },
  );

  return (
    <section
      id="creative"
      ref={root}
      data-nav-theme="light"
      className="relative"
      style={{
        background: "linear-gradient(180deg, #e8dcc4 0%, #f5edd8 40%, #faf6ec 100%)",
      }}
      aria-label="Creative graphics ads posts"
    >
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center gap-5 overflow-hidden px-2 pb-16 pt-28 md:gap-7 md:px-6 md:pb-20 md:pt-32">
        <div
          className="phone-glow pointer-events-none absolute left-1/2 top-[55%] h-[50vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(202,138,4,0.22) 0%, transparent 70%)",
          }}
        />

        <div className="phone-intro relative z-30 w-full max-w-lg shrink-0 px-4 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#8a6a20]">
            Creative desk
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-[#1a1510] md:text-4xl">
            Graphics. Ads. Posts.
          </h2>
          <p className="mt-2 text-sm text-[#5c4a28]">Design → publish — watch it land.</p>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-1 z-20 flex w-[108px] flex-col justify-center gap-7 md:left-5 md:w-[148px] md:gap-8 lg:left-7 lg:w-[168px]">
          {POSTS.filter((p) => p.side === "left").map((p) => (
            <PhoneDock key={p.id} post={p} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-1 z-20 flex w-[108px] flex-col justify-center gap-7 md:right-5 md:w-[148px] md:gap-8 lg:right-7 lg:w-[168px]">
          {POSTS.filter((p) => p.side === "right").map((p) => (
            <PhoneDock key={p.id} post={p} />
          ))}
        </div>

        {/* Footprints */}
        {POSTS.map((p, ci) => (
          <div key={`trail-${p.id}`} className="pointer-events-none absolute inset-0 z-30">
            {Array.from({ length: FOOTPRINTS }).map((_, fi) => {
              const prog = (fi + 1) / (FOOTPRINTS + 1);
              const left = p.side === "left" ? 50 - prog * 38 : 50 + prog * 38;
              const top = 50 + Math.sin(prog * Math.PI) * (ci % 2 === 0 ? -5 : 5) - prog * 6;
              return (
                <span
                  key={fi}
                  className={`phone-print phone-print-${p.id} absolute -translate-x-1/2 -translate-y-1/2 rounded-full`}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: fi % 2 === 0 ? 5 : 8,
                    height: fi % 2 === 0 ? 5 : 8,
                    background: GOLD,
                    boxShadow: `0 0 12px ${GOLD}, 0 0 22px rgba(245,215,110,0.7)`,
                    visibility: "hidden",
                  }}
                />
              );
            })}
          </div>
        ))}

        {POSTS.map((p) => (
          <div
            key={`fly-${p.id}`}
            className={`phone-fly phone-fly-${p.id} pointer-events-none absolute z-40 flex h-20 w-20 items-center justify-center rounded-[1.35rem] border-2 border-[#ca8a04]/50 md:h-24 md:w-24 md:rounded-[1.5rem]`}
            style={{
              background: "linear-gradient(145deg, #2a241c 0%, #0a0a0a 100%)",
              boxShadow: `0 0 28px ${GOLD}88`,
              left: "50%",
              top: "50%",
            }}
          >
            <span className="font-[family-name:var(--font-display)] text-xl font-extrabold text-[#faf8f0] md:text-2xl">
              {p.mark}
            </span>
          </div>
        ))}

        {/* Phone — sits below intro so text never overlaps */}
        <div className="relative z-10 shrink-0" style={{ perspective: "1200px" }}>
          <div
            className="phone-rig relative will-change-transform"
            style={{
              width: "min(270px, 62vw)",
              aspectRatio: "9 / 19.2",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="absolute inset-0 rounded-[2.5rem] border-[3px] border-[#1a1a1a] bg-[#0a0a0a] p-[11px]"
              style={{
                boxShadow:
                  "inset 0 0 0 1px #333, 0 40px 90px rgba(0,0,0,0.4), 0 0 40px rgba(202,138,4,0.08)",
              }}
            >
              <div className="absolute left-1/2 top-3 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

              <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-[#0c0c0c]">
                {POSTS.map((p) => (
                  <div
                    key={p.id}
                    className={`phone-slide phone-slide-${p.id} absolute inset-0 overflow-hidden`}
                  >
                    {p.kind === "design" && <DesignCanvas />}
                    {p.kind === "instagram" && <InstagramPost />}
                    {p.kind === "facebook" && <FacebookPost />}
                    {p.kind === "reel" && <ReelScreen />}
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -left-[3px] top-[22%] h-8 w-[3px] rounded-l bg-[#2a2a2a]" />
            <div className="absolute -left-[3px] top-[32%] h-12 w-[3px] rounded-l bg-[#2a2a2a]" />
            <div className="absolute -right-[3px] top-[28%] h-14 w-[3px] rounded-r bg-[#2a2a2a]" />
          </div>
        </div>

        <p className="phone-outro absolute bottom-10 left-1/2 z-30 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8a6a20]">
          Creative stack ready
        </p>
      </div>
    </section>
  );
}

function PhoneDock({ post }: { post: PostChapter }) {
  return (
    <div className={`phone-dock-item phone-dock-${post.id} flex w-full flex-col items-center gap-2.5`}>
      <div
        className="flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-[1.35rem] border-2 border-[#ca8a04]/60 md:h-[5.75rem] md:w-[5.75rem] md:rounded-[1.5rem]"
        style={{
          background: "linear-gradient(145deg, #2a241c 0%, #0c0a08 100%)",
          boxShadow: "0 12px 32px rgba(202,138,4,0.32), inset 0 0 20px rgba(202,138,4,0.14)",
        }}
      >
        <span
          className="font-[family-name:var(--font-display)] text-xl font-extrabold md:text-2xl"
          style={{ color: CREAM, textShadow: `0 0 14px ${GOLD}` }}
        >
          {post.mark}
        </span>
      </div>
      <p className="text-center font-[family-name:var(--font-display)] text-sm font-bold text-[#1a1510] md:text-base">
        {post.name}
      </p>
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a6a20] md:text-xs">
        {post.label}
      </p>
    </div>
  );
}

/** Graphics being designed — layers assemble */
function DesignCanvas() {
  return (
    <div className="flex h-full flex-col bg-[#111] pt-11">
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
        <span className="text-[9px] font-bold uppercase tracking-wider text-[#ca8a04]">Figma · Hashstack</span>
        <span className="rounded bg-[#ca8a04]/20 px-1.5 py-0.5 text-[8px] font-bold text-[#f5d76e]">Editing</span>
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
        {/* artboard */}
        <div className="relative aspect-square w-[78%] overflow-hidden rounded-xl border border-[#ca8a04]/30 bg-[#1a1510] shadow-[0_0_40px_rgba(202,138,4,0.15)]">
          <div
            className="design-layer absolute inset-3 rounded-lg"
            style={{
              background: "linear-gradient(145deg, #2a241c, #141210)",
              border: "1px solid rgba(202,138,4,0.2)",
            }}
          />
          <div
            className="design-layer absolute left-1/2 top-[28%] h-16 w-16 -translate-x-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 35%, #f5d76e, #ca8a04)",
              boxShadow: "0 0 24px rgba(202,138,4,0.5)",
            }}
          />
          <p className="design-layer absolute inset-x-0 bottom-[22%] text-center font-[family-name:var(--font-display)] text-lg font-extrabold tracking-wide text-[#faf8f0]">
            Hashstack<span className="text-[#ca8a04]">.</span>
          </p>
          <p className="design-layer absolute inset-x-0 bottom-[12%] text-center text-[8px] font-bold uppercase tracking-[0.3em] text-[#ca8a04]/80">
            Launch week
          </p>
        </div>
        {/* tools */}
        <div className="absolute bottom-3 left-3 flex gap-1">
          {["▣", "○", "T"].map((t) => (
            <span
              key={t}
              className="flex h-6 w-6 items-center justify-center rounded border border-[#ca8a04]/30 bg-black/60 text-[10px] text-[#f5d76e]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <p className="pb-3 text-center text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">
        Building visual…
      </p>
    </div>
  );
}

function InstagramPost() {
  return (
    <div className="flex h-full flex-col bg-black pt-10">
      {/* IG header */}
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
        <div
          className="h-8 w-8 rounded-full p-[2px]"
          style={{ background: "linear-gradient(45deg, #ca8a04, #f5d76e, #ca8a04)" }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-black text-[8px] font-bold text-[#f5d76e]">
            H
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold text-white">hashstack.dev</p>
          <p className="text-[8px] text-white/45">Sponsored · Original audio</p>
        </div>
        <MoreHorizontal className="h-4 w-4 text-white/70" />
      </div>

      {/* Media */}
      <div
        className="relative aspect-square w-full"
        style={{
          background:
            "linear-gradient(160deg, #2a241c 0%, #141210 40%, #ca8a04 100%)",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div
            className="mb-4 h-20 w-20 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, #f5d76e, #ca8a04)",
              boxShadow: "0 0 40px rgba(202,138,4,0.45)",
            }}
          />
          <p className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-[#faf8f0]">
            Day breaks.
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#f5d76e]/90">New drop</p>
        </div>
        <div className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[8px] font-bold text-white/80">
          1/3
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        <Heart className="h-5 w-5 text-white" />
        <MessageCircle className="h-5 w-5 text-white" />
        <Send className="h-5 w-5 text-white" />
        <Bookmark className="ml-auto h-5 w-5 text-white" />
      </div>
      <div className="px-3 pb-4">
        <p className="text-[11px] font-bold text-white">12,480 likes</p>
        <p className="mt-1 text-[11px] leading-snug text-white/90">
          <span className="font-bold">hashstack.dev</span> Stack the impossible. Link in bio for
          discovery.
        </p>
        <p className="mt-1 text-[10px] text-white/40">View all 326 comments</p>
      </div>
    </div>
  );
}

function FacebookPost() {
  return (
    <div className="flex h-full flex-col bg-[#18191a] pt-10">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ca8a04] text-xs font-extrabold text-black">
          H
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-bold text-[#e4e6eb]">Hashstack Developers</p>
          <p className="text-[9px] text-[#b0b3b8]">Sponsored · <span className="underline">Learn more</span></p>
        </div>
        <MoreHorizontal className="h-4 w-4 text-[#b0b3b8]" />
      </div>
      <p className="px-3 pb-2 text-[12px] leading-snug text-[#e4e6eb]">
        Ship cinematic product experiences. Web, mobile, AI — one desk. Book a discovery call →
      </p>
      <div
        className="relative mx-0 aspect-[1.2/1] border-y border-black/40"
        style={{
          background: "linear-gradient(180deg, #2a241c 0%, #141210 60%, #0a0a0a 100%)",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-[family-name:var(--font-display)] text-xl font-extrabold text-[#faf8f0]">
            Start a project
          </p>
          <span className="mt-3 rounded-md bg-[#ca8a04] px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-black">
            Get quote
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-2 text-[10px] text-[#b0b3b8]">
        <span className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3 text-[#ca8a04]" /> 2.1k
        </span>
        <span>184 comments · 62 shares</span>
      </div>
      <div className="flex justify-around py-2.5 text-[10px] font-semibold text-[#b0b3b8]">
        <span className="flex items-center gap-1">
          <ThumbsUp className="h-3.5 w-3.5" /> Like
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" /> Comment
        </span>
        <span className="flex items-center gap-1">
          <Share2 className="h-3.5 w-3.5" /> Share
        </span>
      </div>
    </div>
  );
}

function ReelScreen() {
  return (
    <div
      className="relative flex h-full flex-col justify-end pt-10"
      style={{
        background:
          "linear-gradient(180deg, #1a1510 0%, #2a241c 35%, #ca8a04 100%)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40 bg-black/30 backdrop-blur-sm">
          <Play className="h-6 w-6 fill-white text-white" />
        </div>
      </div>
      <div className="absolute right-3 top-1/3 flex flex-col items-center gap-4 text-white">
        <Heart className="h-6 w-6" />
        <span className="text-[9px] font-bold">48.2k</span>
        <MessageCircle className="h-6 w-6" />
        <span className="text-[9px] font-bold">912</span>
        <Send className="h-6 w-6" />
      </div>
      <div className="relative z-10 space-y-2 p-4 pb-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#ca8a04]" />
          <span className="text-[12px] font-bold text-white">hashstack</span>
          <span className="rounded border border-white/40 px-2 py-0.5 text-[9px] font-bold text-white">
            Follow
          </span>
        </div>
        <p className="text-[11px] text-white/90">Reel · Stack the impossible ✨ #hashstack #build</p>
        <div className="h-1 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-2/3 rounded-full bg-[#ca8a04]" />
        </div>
        <p className="text-[8px] font-bold uppercase tracking-wider text-white/50">Video · 0:15</p>
      </div>
    </div>
  );
}
