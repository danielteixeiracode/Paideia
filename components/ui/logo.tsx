import { cn } from "@/lib/utils";

// O símbolo do Paideia: um pequeno templo em traço.
export function MarcaTemplo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M4 21h16M5 21V9M19 21V9M3 9l9-5 9 5M8 9v8M12 9v8M16 9v8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Logo sobre o fundo de leitura (login). A sidebar tem sua versão sobre a pedra verde.
export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-paideia-gold-500 bg-paideia-green-900 text-paideia-gold-400">
        <MarcaTemplo className="h-6 w-6" />
      </div>
      {!iconOnly && (
        <div className="leading-tight">
          <p className="font-serif text-2xl font-medium text-ink">Paideia</p>
          <p className="t-nota">Formação clássica</p>
        </div>
      )}
    </div>
  );
}
