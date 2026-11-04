import Link from "next/link";
import { cn, romano } from "@/lib/utils";

export interface FuncaoCurta {
  id: string;
  numero: number;
  nome: string;
}

// As funções que a obra carrega, em romanos pequenos e dourados. Sem links
// nos cartões (o cartão inteiro já é um link); com links na ficha da obra,
// onde cada romano leva à sua função e mostra o nome.
export function RomanosFuncoes({
  funcoes,
  daObra,
  comLinks = false,
  className,
}: {
  funcoes: FuncaoCurta[];
  daObra: Set<string>; // ids das funções da obra
  comLinks?: boolean;
  className?: string;
}) {
  const lista = funcoes.filter((f) => daObra.has(f.id)).sort((a, b) => a.numero - b.numero);
  if (lista.length === 0) return <p className={cn("t-nota", className)}>Sem função ligada</p>;

  if (comLinks) {
    return (
      <ul aria-label="Funções que esta obra exercita" className={cn("flex flex-wrap gap-2", className)}>
        {lista.map((f) => (
          <li key={f.id}>
            <Link
              href={`/funcoes/${f.id}`}
              className="flex min-h-11 items-center gap-2 rounded-md border border-rule px-3 text-interface text-ink transition-colors duration-discreto ease-discreto hover:border-rule-strong hover:bg-sunken"
            >
              <span className="t-romano text-gold-ink">{romano(f.numero)}</span>
              {f.nome}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className={cn("t-romano flex flex-wrap gap-x-2.5 text-nota font-semibold text-gold-ink", className)}>
      <span className="sr-only">Funções: </span>
      {lista.map((f) => (
        <span key={f.id} title={f.nome}>
          <span aria-hidden>{romano(f.numero)}</span>
          <span className="sr-only">{f.nome}; </span>
        </span>
      ))}
    </p>
  );
}
