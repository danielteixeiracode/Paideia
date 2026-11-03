import Link from "next/link";
import { Selo } from "@/components/ui/selo";
import type { Exercicio } from "@/types/database";

// Exercício em lista: título, método, enunciado e as ligações para a função
// e a obra a que pertence. Quem chama decide quais ligações mostrar (na
// ficha da função, o link para a própria função seria redundante). As linhas
// se separam por filete; a lista que as contém usa divide-y.
export function ExercicioItem({
  exercicio,
  funcao,
  obra,
  especifico = false,
}: {
  exercicio: Pick<Exercicio, "titulo" | "metodo" | "enunciado">;
  funcao?: { id: string; nome: string } | null;
  obra?: { id: string; titulo: string } | null;
  // Escrito só para esta obra (e não geral da função).
  especifico?: boolean;
}) {
  return (
    <li className="py-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <p className="text-interface font-semibold text-ink">{exercicio.titulo}</p>
        {exercicio.metodo && <Selo tom="contorno">{exercicio.metodo}</Selo>}
        {especifico && <Selo>Só desta obra</Selo>}
      </div>
      {exercicio.enunciado && <p className="t-corpo mt-1.5 max-w-leitura">{exercicio.enunciado}</p>}
      {(funcao || obra) && (
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-nota">
          {funcao && (
            <Link href={`/funcoes/${funcao.id}`} className="text-accent underline-offset-4 hover:underline">
              Função: {funcao.nome}
            </Link>
          )}
          {obra && (
            <Link href={`/obras/${obra.id}`} className="text-accent underline-offset-4 hover:underline">
              Obra: {obra.titulo}
            </Link>
          )}
        </p>
      )}
    </li>
  );
}
