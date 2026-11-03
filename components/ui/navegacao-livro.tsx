import Link from "next/link";
import { romano } from "@/lib/utils";

interface Vizinha {
  href: string;
  numero: number;
  nome: string;
}

// Rodapé de página de livro: anterior à esquerda, próxima à direita, com
// romano e nome. Entre filetes duplos, como a base da arquitrave.
export function NavegacaoLivro({
  rotulo,
  anterior,
  proxima,
}: {
  rotulo: string; // por exemplo "Funções" (para o leitor de tela)
  anterior: Vizinha | null;
  proxima: Vizinha | null;
}) {
  if (!anterior && !proxima) return null;
  return (
    <nav aria-label={`${rotulo}: anterior e próxima`} className="filete-duplo-cima grid gap-3 pt-5 sm:grid-cols-2">
      {anterior ? (
        <Link
          href={anterior.href}
          rel="prev"
          className="group flex flex-col rounded-xl p-3 transition-colors duration-discreto ease-discreto hover:bg-sunken"
        >
          <span className="t-nota">Anterior</span>
          <span className="mt-0.5 text-interface text-ink group-hover:underline group-hover:underline-offset-4">
            <span className="t-romano mr-1.5 text-gold-ink">{romano(anterior.numero)}</span>
            {anterior.nome}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
      {proxima && (
        <Link
          href={proxima.href}
          rel="next"
          className="group flex flex-col rounded-xl p-3 text-left transition-colors duration-discreto ease-discreto hover:bg-sunken sm:items-end sm:text-right"
        >
          <span className="t-nota">Próxima</span>
          <span className="mt-0.5 text-interface text-ink group-hover:underline group-hover:underline-offset-4">
            <span className="t-romano mr-1.5 text-gold-ink">{romano(proxima.numero)}</span>
            {proxima.nome}
          </span>
        </Link>
      )}
    </nav>
  );
}
