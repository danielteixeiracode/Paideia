// Perguntas do Sócrates no Início, uma por função pedagógica.
// PROVISÓRIAS: textos de trabalho até o Daniel definir as definitivas.

export const PERGUNTAS_SOCRATES: Record<number, string> = {
  1: "Que verso ou frase você carrega hoje de memória, e o que ele lhe pede?",
  2: "Que figura admirável você tentou imitar esta semana, e em quê?",
  3: "Diante do último dilema que enfrentou, o que a prudência pedia?",
  4: "O que você recebeu de quem veio antes, e o que deve transmitir?",
  5: "Em que você agiu hoje contra o que sabe ser melhor?",
  6: "Se tivesse de convencer alguém de algo justo agora, qual seria o seu primeiro argumento?",
  7: "O que duas das suas leituras dizem em comum, e onde divergem?",
};

export function ehPerguntaSocrates(texto: unknown): texto is string {
  return typeof texto === "string" && Object.values(PERGUNTAS_SOCRATES).includes(texto);
}

// A pergunta do dia vem da função com menos eventos do aluno. No empate, as
// funções empatadas se alternam pelo dia, para a pergunta não ficar parada.
export function perguntaDoDia<T extends { numero: number; eventos: number }>(funcoes: T[], hoje = new Date()) {
  const comPergunta = funcoes.filter((f) => PERGUNTAS_SOCRATES[f.numero]);
  if (comPergunta.length === 0) return null;
  const menor = Math.min(...comPergunta.map((f) => f.eventos));
  const empatadas = comPergunta.filter((f) => f.eventos === menor).sort((a, b) => a.numero - b.numero);
  const dia = Math.floor(hoje.getTime() / 86_400_000);
  const funcao = empatadas[dia % empatadas.length];
  return { funcao, pergunta: PERGUNTAS_SOCRATES[funcao.numero] };
}
