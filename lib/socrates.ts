// O que o aluno está vendo na tela, enviado ao Sócrates junto com cada mensagem.
export const TIPOS_CONTEXTO = ["obra", "funcao", "epoca", "exercicio"] as const;

export type TipoContexto = (typeof TIPOS_CONTEXTO)[number] | "nenhum";

export interface ContextoTela {
  tipo: TipoContexto;
  id?: string;
}

export const SEM_CONTEXTO: ContextoTela = { tipo: "nenhum" };

// Pede à gaveta do Sócrates que se abra (usado pela paleta de comandos).
export const EVENTO_ABRIR_SOCRATES = "paideia:abrir-socrates";
