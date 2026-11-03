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
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", trackClassName, className)}>
      <div
        className={cn("h-full rounded-full bg-gradient-to-r from-paideia-green-600 to-paideia-green-500", barClassName)}
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
    neutral: "bg-muted text-ink/70",
    gold: "bg-paideia-gold-400/25 text-gold-ink",
    green: "bg-action text-on-action",
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
    <div className="rounded-xl border border-dashed border-rule bg-surface/60 px-5 py-10 text-center">
      <p className="font-serif text-base font-semibold text-ink">{titulo}</p>
      {descricao && <p className="mt-1 text-sm text-ink/60">{descricao}</p>}
    </div>
  );
}
