// Resultado das ações do aluno. A interface já mudou na hora (otimista);
// o resultado só diz se é preciso desfazer, e com que mensagem.
export type ResultadoAcao = { ok: true } | { ok: false; erro: string };

export const ERRO_CONEXAO: ResultadoAcao = { ok: false, erro: "Sem conexão com o servidor. Tente de novo." };
