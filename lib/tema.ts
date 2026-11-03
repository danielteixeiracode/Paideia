// Tema visual (claro, escuro, foco), aplicado como data-theme no <html>.
// A preferência fica no localStorage; sem preferência salva, segue o sistema.

import { TRECHO_SCRIPT_ASSINATURA } from "@/lib/assinatura";

export const TEMAS = ["claro", "escuro", "foco"] as const;
export type Tema = (typeof TEMAS)[number];

export const CHAVE_TEMA = "paideia-tema";
const EVENTO_TEMA = "paideia:tema";

export function ehTema(valor: unknown): valor is Tema {
  return typeof valor === "string" && (TEMAS as readonly string[]).includes(valor);
}

// Roda no <head>, antes da primeira pintura, para não piscar o tema errado
// (e para o momento de assinatura do Início não se repetir na sessão).
// Fica em texto porque é injetado como script inline em app/layout.tsx.
export const SCRIPT_TEMA = `(function(){var t=null;try{t=localStorage.getItem(${JSON.stringify(
  CHAVE_TEMA
)})}catch(e){}if(t!=="claro"&&t!=="escuro"&&t!=="foco"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"escuro":"claro"}document.documentElement.setAttribute("data-theme",t);${TRECHO_SCRIPT_ASSINATURA}})();`;

export function temaAtual(): Tema {
  const t = document.documentElement.getAttribute("data-theme");
  return ehTema(t) ? t : "claro";
}

// Tema que vale quando o aluno não escolheu nenhum: o do sistema.
export function temaDoSistema(): Tema {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
}

export function definirTema(tema: Tema) {
  document.documentElement.setAttribute("data-theme", tema);
  try {
    localStorage.setItem(CHAVE_TEMA, tema);
  } catch {
    // armazenamento indisponível (modo privado, bloqueio): o tema vale só nesta visita
  }
  window.dispatchEvent(new CustomEvent(EVENTO_TEMA));
}

export function aoMudarTema(callback: () => void) {
  window.addEventListener(EVENTO_TEMA, callback);
  return () => window.removeEventListener(EVENTO_TEMA, callback);
}
