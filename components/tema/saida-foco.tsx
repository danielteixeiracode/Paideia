"use client";

import { useEffect } from "react";
import { temaDoSistema } from "@/lib/tema";
import { useTema } from "@/components/tema/use-tema";

// No modo foco a interface some; isto é a única saída visível, discreta no
// canto, e a tecla Esc faz o mesmo.
export function SaidaFoco() {
  const [tema, definir] = useTema();
  const emFoco = tema === "foco";

  useEffect(() => {
    if (!emFoco) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") definir(temaDoSistema());
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emFoco, definir]);

  if (!emFoco) return null;

  return (
    <button
      type="button"
      onClick={() => definir(temaDoSistema())}
      className="fixed right-4 top-4 z-50 text-nota text-ink-muted transition-colors duration-discreto ease-discreto hover:text-ink"
    >
      Sair do modo foco (Esc)
    </button>
  );
}
