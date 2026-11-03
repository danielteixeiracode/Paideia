// Validação do cadastro de exercício, a mesma no navegador e no servidor.

export const LIMITES_EXERCICIO = { titulo: 200, enunciado: 4000, metodo: 120 };

// Sugestões de método: a tabela de métodos do CLAUDE.md. O campo aceita
// também outro texto.
export const METODOS_SUGERIDOS = [
  "narração",
  "memorização e recitação",
  "preleção e repetição",
  "imitação e composição graduada",
  "pergunta socrática e seminário",
  "questão disputada e debate",
  "sabatina oral",
  "caderno de observação",
];

export interface DadosExercicio {
  funcao_id: string;
  obra_id: string | null; // vazio: exercício geral da função
  titulo: string;
  enunciado: string;
  metodo: string;
  ativo: boolean; // publicado (true) ou rascunho (false)
}

// Chaves: "funcao_id", "obra_id", "titulo", "enunciado", "metodo".
export type ErrosExercicio = Record<string, string>;

export function validarExercicio(d: DadosExercicio): ErrosExercicio {
  const erros: ErrosExercicio = {};
  if (!d.funcao_id) erros.funcao_id = "Escolha a função a que o exercício pertence.";
  const titulo = d.titulo.trim();
  if (!titulo) erros.titulo = "Escreva o título do exercício.";
  else if (titulo.length > LIMITES_EXERCICIO.titulo) erros.titulo = `O título passa de ${LIMITES_EXERCICIO.titulo} caracteres.`;
  const enunciado = d.enunciado.trim();
  if (!enunciado) erros.enunciado = "Escreva o enunciado: o que o aluno deve fazer.";
  else if (enunciado.length > LIMITES_EXERCICIO.enunciado) erros.enunciado = `O enunciado passa de ${LIMITES_EXERCICIO.enunciado} caracteres.`;
  if (d.metodo.trim().length > LIMITES_EXERCICIO.metodo) erros.metodo = `O método passa de ${LIMITES_EXERCICIO.metodo} caracteres.`;
  return erros;
}

export type ResultadoSalvarExercicio =
  | { ok: true; id: string }
  | { ok: false; erro: string; campos?: ErrosExercicio };
