import { Sprout } from "lucide-react";
import { cn, romano } from "@/lib/utils";

export type TomSelo = "neutro" | "dourado" | "acao" | "contorno";

const TONS: Record<TomSelo, string> = {
  neutro: "bg-muted text-ink",
  dourado: "bg-gold/25 text-gold-ink",
  acao: "bg-action text-on-action",
  contorno: "border border-rule-strong/70 text-gold-ink",
};

export function Selo({
  tom = "neutro",
  icone,
  className,
  children,
}: {
  tom?: TomSelo;
  icone?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-0.5 text-nota font-semibold",
        TONS[tom],
        className
      )}
    >
      {icone}
      <span className="truncate">{children}</span>
    </span>
  );
}

// Estado da obra na Carteira. Só "semente" está definido no conceito; outros
// estados aparecem com o próprio nome até serem decididos.
const ESTADOS_OBRA: Record<string, { rotulo: string; tom: TomSelo; icone?: React.ReactNode }> = {
  semente: { rotulo: "Semente", tom: "neutro", icone: <Sprout className="h-3.5 w-3.5" aria-hidden /> },
};

export function SeloEstadoObra({ estado, className }: { estado: string; className?: string }) {
  const conhecido = ESTADOS_OBRA[estado];
  const rotulo = conhecido?.rotulo ?? estado.charAt(0).toUpperCase() + estado.slice(1);
  return (
    <Selo tom={conhecido?.tom ?? "neutro"} icone={conhecido?.icone} className={className}>
      {rotulo}
    </Selo>
  );
}

// Grau de iniciação, com o número em algarismo romano. Os nomes dos graus
// ainda estão em aberto; quando houver, entram em `nome`.
export function SeloGrau({ grau, nome, className }: { grau: number; nome?: string; className?: string }) {
  return (
    <Selo tom="contorno" className={className}>
      <span aria-hidden>
        Grau <span className="t-romano">{romano(grau)}</span>
        {nome && `: ${nome}`}
      </span>
      <span className="sr-only">{`Grau ${grau}${nome ? `: ${nome}` : ""}`}</span>
    </Selo>
  );
}
