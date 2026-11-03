import Link from "next/link";
import { Badge } from "@/components/ui/primitives";
import type { Exercicio } from "@/types/database";

// Exercício em lista, com as ligações para a função e a obra a que pertence.
// Quem chama decide quais ligações mostrar (na ficha da função, por exemplo,
// o link para a própria função seria redundante).
export function ExercicioItem({
  exercicio,
  funcao,
  obra,
}: {
  exercicio: Exercicio;
  funcao?: { id: string; nome: string } | null;
  obra?: { id: string; titulo: string } | null;
}) {
  return (
    <li className="rounded-xl border border-paideia-cream-300 bg-paideia-cream-50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-serif text-base font-semibold text-paideia-ink">{exercicio.titulo}</p>
        {exercicio.metodo && <Badge tone="gold">{exercicio.metodo}</Badge>}
      </div>
      {exercicio.enunciado && (
        <p className="mt-1.5 line-clamp-3 text-sm text-paideia-ink/70">{exercicio.enunciado}</p>
      )}
      {(funcao || obra) && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {funcao && (
            <Link href={`/funcoes/${funcao.id}`} className="font-semibold text-paideia-green-800 hover:underline">
              Função: {funcao.nome}
            </Link>
          )}
          {obra && (
            <Link href={`/obras/${obra.id}`} className="font-semibold text-paideia-green-800 hover:underline">
              Obra: {obra.titulo}
            </Link>
          )}
        </div>
      )}
    </li>
  );
}
