"use client";

import { useSyncExternalStore } from "react";
import { aoMudarTema, definirTema, temaAtual, type Tema } from "@/lib/tema";

// Tema ativo, sincronizado entre componentes. No servidor não há tema
// conhecido; o valor real chega na hidratação.
export function useTema(): [Tema | null, (tema: Tema) => void] {
  const tema = useSyncExternalStore(aoMudarTema, temaAtual, () => null);
  return [tema, definirTema];
}
