// Validação do cadastro de obra, a mesma no navegador (mensagens ao lado dos
// campos, na hora) e no servidor (que nunca confia no navegador).

export const LIMITES_OBRA = { titulo: 200, autor: 200, descricao: 2000, nota: 300 };

export interface DadosObra {
  titulo: string;
  autor: string;
  descricao: string;
  epoca_id: string | null;
  ativo: boolean; // publicada (true) ou rascunho (false)
  funcoes: { funcao_id: string; nota: string }[];
}

// Chaves: "titulo", "autor", "descricao", "funcoes" e "nota:<funcao_id>".
export type ErrosObra = Record<string, string>;

export function validarObra(d: DadosObra): ErrosObra {
  const erros: ErrosObra = {};
  const titulo = d.titulo.trim();
  if (!titulo) erros.titulo = "Escreva o título da obra.";
  else if (titulo.length > LIMITES_OBRA.titulo) erros.titulo = `O título passa de ${LIMITES_OBRA.titulo} caracteres.`;
  if (d.autor.trim().length > LIMITES_OBRA.autor) erros.autor = `O autor passa de ${LIMITES_OBRA.autor} caracteres.`;
  if (d.descricao.trim().length > LIMITES_OBRA.descricao) {
    erros.descricao = `A descrição passa de ${LIMITES_OBRA.descricao} caracteres.`;
  }
  if (d.ativo && d.funcoes.length === 0) {
    erros.funcoes = "Para publicar, marque ao menos uma função que a obra carrega. Ou salve como rascunho.";
  }
  for (const f of d.funcoes) {
    if (f.nota.trim().length > LIMITES_OBRA.nota) erros[`nota:${f.funcao_id}`] = `A nota passa de ${LIMITES_OBRA.nota} caracteres.`;
  }
  return erros;
}

export type ResultadoSalvarObra =
  | { ok: true; id: string }
  | { ok: false; erro: string; campos?: ErrosObra };
