import type { ObraLista } from "@/components/corpo/cartao-obra";

// Campos que o cartão da obra precisa; serve num select direto em "obras"
// ou embutido (obra:obras(...)) a partir de outra tabela.
export const CAMPOS_CARTAO_OBRA = "id, titulo, autor, ativo, epoca:epocas(id, numero, nome), obra_funcoes(funcao_id)";

export type ObraBanco = {
  id: string;
  titulo: string;
  autor: string | null;
  ativo: boolean;
  epoca: { id: string; numero: number; nome: string } | null;
  obra_funcoes: { funcao_id: string }[];
};

export function paraObraLista(o: ObraBanco, naCarteira: Set<string>): ObraLista {
  return {
    id: o.id,
    titulo: o.titulo,
    autor: o.autor,
    epoca: o.epoca,
    funcoes: o.obra_funcoes.map((l) => l.funcao_id),
    naCarteira: naCarteira.has(o.id),
  };
}
