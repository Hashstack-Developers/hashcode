import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-cream/10 bg-cream/[0.03] backdrop-blur-xl",
        "shadow-[inset_0_1px_0_rgba(250,248,240,0.04)]",
        hover && "transition duration-500 hover:border-gold/40 hover:bg-cream/[0.05]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      {children}
    </div>
  );
}
