// Regra de preenchimento das colunas do templo no Início.
//
// PROVISÓRIA: o fim da formação ainda não foi definido (ver "Em aberto" no
// CLAUDE.md). Por ora cada coluna (função pedagógica) se enche pelos eventos
// do aluno naquela função em registro_eventos, contra uma meta fixa. O valor é
// sempre derivado do registro na hora de mostrar; nunca é guardado no banco.

export const META_EVENTOS_POR_FUNCAO = 10;

// Fração da coluna preenchida, de 0 a 1.
export function preenchimentoColuna(eventosNaFuncao: number) {
  return Math.min(1, Math.max(0, eventosNaFuncao / META_EVENTOS_POR_FUNCAO));
}

// O frontão se acende quando todas as colunas estão cheias.
export function frontaoAceso(preenchimentos: number[]) {
  return preenchimentos.length > 0 && preenchimentos.every((p) => p >= 1);
}
