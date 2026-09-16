import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("card p-5", className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("label-caps", className)}>{children}</p>;
}

export function ProgressBar({
  value,
  className,
  trackClassName,
  barClassName,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-paideia-cream-200", trackClassName, className)}>
      <div
        className={cn("h-full rounded-full bg-paideia-green-700", barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gold" | "green" | "red";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-paideia-cream-200 text-paideia-ink/70",
    gold: "bg-paideia-gold-300/40 text-paideia-gold-700",
    green: "bg-paideia-green-800 text-paideia-gold-300",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

export function EmptyState({ titulo, descricao }: { titulo: string; descricao?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-paideia-cream-300 bg-white/60 px-5 py-10 text-center">
      <p className="font-serif text-base font-semibold text-paideia-ink">{titulo}</p>
      {descricao && <p className="mt-1 text-sm text-paideia-ink/60">{descricao}</p>}
    </div>
  );
}
