// Progresso do aluno por função pedagógica.
//
// PROVISÓRIO: o fim da formação ainda não foi definido (ver "Em aberto" no
// CLAUDE.md). Por ora cada função se enche pelos eventos do aluno naquela
// função em registro_eventos, contra uma meta fixa. O valor é sempre derivado
// do registro na hora de mostrar; nunca é guardado no banco.

export const META_EVENTOS_POR_FUNCAO = 10;

// Fração preenchida, de 0 a 1: eventos da função divididos pela meta.
export function progressoFuncao(eventosNaFuncao: number) {
  return Math.min(1, Math.max(0, eventosNaFuncao / META_EVENTOS_POR_FUNCAO));
}

// Descrição sem número, para leitores de tela: o progresso não se escreve em porcentagem.
export function descreverProgresso(p: number) {
  if (p <= 0) return "ainda não começou";
  if (p >= 1) return "completo";
  if (p < 0.5) return "começando";
  return "mais da metade";
}

// Nomes curtos das sete funções, para listas estreitas. O nome inteiro vem
// do banco e continua no rótulo acessível e na ficha da função.
const NOMES_CURTOS: Record<number, string> = {
  1: "Memória e ouvido",
  2: "Imaginação épica",
  3: "Raciocínio moral",
  4: "Identidade histórica",
  5: "Exame interior",
  6: "Retórica",
  7: "Síntese crítica",
};

export function nomeCurtoFuncao(f: { numero: number; nome: string }) {
  return NOMES_CURTOS[f.numero] ?? f.nome;
}
