import Link from "next/link";
import { cn, romano } from "@/lib/utils";

export interface FuncaoColunata {
  id: string;
  numero: number;
  nome: string;
}

// Colunata das sete funções: as que a obra carrega ficam acesas em dourado
// (o mesmo ouro em relevo do templo); as outras, apagadas. Pequena nos
// cartões da lista (sem links, porque o cartão inteiro já é um link) e
// grande na ficha, onde cada coluna leva à sua função.
export function Colunata({
  funcoes,
  acesas,
  tamanho = "pequena",
  className,
}: {
  funcoes: FuncaoColunata[];
  acesas: Set<string>; // ids das funções da obra
  tamanho?: "pequena" | "grande";
  className?: string;
}) {
  const grande = tamanho === "grande";
  const ordenadas = [...funcoes].sort((a, b) => a.numero - b.numero);

  return (
    <div className={cn("inline-flex flex-col", className)}>
      {/* arquitrave: a linha que une as colunas */}
      <span aria-hidden className={cn("block rounded-sm bg-rule-strong/70", grande ? "h-1" : "h-0.5")} />
      <ul
        aria-label="Funções pedagógicas desta obra"
        className={cn("flex items-end", grande ? "gap-2 pt-1 sm:gap-3" : "gap-1 pt-0.5")}
      >
        {ordenadas.map((f) => {
          const acesa = acesas.has(f.id);
          const rotulo = `Função ${romano(f.numero)}, ${f.nome}: ${acesa ? "esta obra a exercita" : "esta obra não a exercita"}`;
          const coluna = (
            <>
              <span aria-hidden className={cn("block rounded-[1px]", grande ? "h-1 w-9" : "h-[2px] w-3", acesa ? "bg-gold-ink" : "bg-rule")} />
              <span
                aria-hidden
                className={cn(
                  "block border",
                  grande ? "h-24 w-7" : "h-7 w-2",
                  acesa ? "ouro-relevo border-gold-ink/60" : "border-rule bg-sunken"
                )}
              />
              <span aria-hidden className={cn("block rounded-[1px]", grande ? "h-1 w-8" : "h-[2px] w-2.5", acesa ? "bg-gold-ink" : "bg-rule")} />
              {grande && (
                <span aria-hidden className={cn("t-romano mt-2 text-nota", acesa ? "font-semibold text-gold-ink" : "text-ink-muted")}>
                  {romano(f.numero)}
                </span>
              )}
            </>
          );

          return (
            <li key={f.id}>
              {grande ? (
                <Link
                  href={`/funcoes/${f.id}`}
                  aria-label={rotulo}
                  title={f.nome}
                  className="flex min-w-11 flex-col items-center rounded-md px-1 py-1 transition-colors duration-discreto ease-discreto hover:bg-sunken"
                >
                  {coluna}
                </Link>
              ) : (
                <span role="img" aria-label={rotulo} className="flex flex-col items-center">
                  {coluna}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
