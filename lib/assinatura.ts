// Momento de assinatura do Início (colunas que sobem, números que contam):
// acontece uma vez por sessão do navegador. Depois, o <html> leva
// data-assinatura="vista" e o CSS mostra tudo pronto.

export const CHAVE_ASSINATURA = "paideia-assinatura";

// Trecho do script do <head> (ver lib/tema.ts): marca o <html> antes da
// primeira pintura se a assinatura já foi vista nesta sessão.
export const TRECHO_SCRIPT_ASSINATURA = `try{if(sessionStorage.getItem(${JSON.stringify(
  CHAVE_ASSINATURA
)}))document.documentElement.setAttribute("data-assinatura","vista")}catch(e){}`;

export function assinaturaJaVista() {
  return document.documentElement.getAttribute("data-assinatura") === "vista";
}

export function movimentoReduzido() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

// Guarda na sessão que a assinatura foi vista (sem mexer na página atual).
export function registrarAssinatura() {
  try {
    sessionStorage.setItem(CHAVE_ASSINATURA, "1");
  } catch {
    // sem armazenamento: a assinatura volta na próxima visita desta aba
  }
}

// Marca o <html>: da próxima vez que o Início montar nesta aba, tudo já aparece pronto.
export function marcarAssinaturaVista() {
  document.documentElement.setAttribute("data-assinatura", "vista");
}
