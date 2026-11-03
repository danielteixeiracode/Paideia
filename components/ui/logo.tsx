import { cn } from "@/lib/utils";

export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-paideia-gold-500 bg-paideia-green-900 text-paideia-gold-400">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <path d="M4 21h16M5 21V9M19 21V9M3 9l9-5 9 5M8 9v8M12 9v8M16 9v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {!iconOnly && (
        <div className="leading-tight">
          <p className="font-serif text-xl font-bold tracking-wide text-accent">PAIDEIA</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-ink">
            Formação Clássica
          </p>
        </div>
      )}
    </div>
  );
}
