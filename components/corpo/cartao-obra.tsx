import Link from "next/link";
import { Cartao } from "@/components/ui/cartao";
import { Selo } from "@/components/ui/selo";
import { Colunata, type FuncaoColunata } from "@/components/corpo/colunata";
import { romano } from "@/lib/utils";

export interface ObraLista {
  id: string;
  titulo: string;
  autor: string | null;
  epoca: { id: string; numero: number; nome: string } | null;
  funcoes: string[]; // ids das funções que a obra carrega
  naCarteira: boolean;
}

// Cartão da obra (Obras, Funções, Épocas): o cartão inteiro é um link.
// Época em romano, selo da Carteira, título em serifa, autor, uma nota
// opcional (a de obra_funcoes, na ficha da função) e a colunata das funções.
export function CartaoObra({
  obra,
  funcoes,
  nota,
  nivel = 3,
  mostrarEpoca = true,
}: {
  obra: ObraLista;
  funcoes: FuncaoColunata[];
  nota?: string | null;
  // Nível do título do cartão, conforme a hierarquia da página.
  nivel?: 2 | 3;
  // Desligado onde a época já está no topo da página (ficha da época).
  mostrarEpoca?: boolean;
}) {
  const Titulo = nivel === 2 ? "h2" : "h3";
  return (
    <Link href={`/obras/${obra.id}`} className="group block h-full rounded-2xl">
      <Cartao
        as="article"
        className="flex h-full flex-col transition-colors duration-discreto ease-discreto group-hover:border-rule-strong/70 group-hover:bg-sunken"
      >
        {(mostrarEpoca || obra.naCarteira) && (
          <div className="mb-3 flex items-center justify-between gap-3">
            {mostrarEpoca &&
              (obra.epoca ? (
                <span className="t-nota">
                  <span className="t-romano mr-1 text-gold-ink">{romano(obra.epoca.numero)}</span>
                  {obra.epoca.nome}
                </span>
              ) : (
                <span className="t-nota">Sem época</span>
              ))}
            {obra.naCarteira && <Selo tom="acao" className="ml-auto">Na Carteira</Selo>}
          </div>
        )}
        <Titulo className="font-serif text-xl font-medium leading-snug text-ink group-hover:underline group-hover:decoration-rule-strong group-hover:underline-offset-4">
          {obra.titulo}
        </Titulo>
        {obra.autor && <p className="t-nota mt-1">{obra.autor}</p>}
        {nota && <p className="mt-3 text-interface text-ink">{nota}</p>}
        <Colunata funcoes={funcoes} acesas={new Set(obra.funcoes)} className="mt-auto pt-5" />
      </Cartao>
    </Link>
  );
}
