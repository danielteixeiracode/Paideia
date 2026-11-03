"use client";

import { useEffect } from "react";

// Aviso de saída com alterações não salvas: ao fechar ou recarregar a aba,
// e ao seguir um link interno do app (que o Next não permite bloquear de
// outro jeito). Usado pelos formulários do admin.
export function useAvisoDeSaida(sujo: boolean, mensagem = "Há alterações não salvas. Sair mesmo assim?") {
  useEffect(() => {
    if (!sujo) return;
    const antesDeSair = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const aoClicar = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || e.defaultPrevented) return;
      const destino = new URL(link.href, window.location.href);
      if (destino.origin !== window.location.origin || destino.pathname === window.location.pathname) return;
      if (!window.confirm(mensagem)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", antesDeSair);
    document.addEventListener("click", aoClicar, true);
    return () => {
      window.removeEventListener("beforeunload", antesDeSair);
      document.removeEventListener("click", aoClicar, true);
    };
  }, [sujo, mensagem]);
}
