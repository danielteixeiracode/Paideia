"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SEM_CONTEXTO, type ContextoTela as Contexto, type TipoContexto } from "@/lib/socrates";

const ContextoTelaCtx = createContext<{
  contexto: Contexto;
  setContexto: (c: Contexto) => void;
}>({ contexto: SEM_CONTEXTO, setContexto: () => {} });

// Fica no layout do (shell): guarda o que a página atual está mostrando.
export function ContextoTelaProvider({ children }: { children: React.ReactNode }) {
  const [contexto, setContexto] = useState<Contexto>(SEM_CONTEXTO);
  return <ContextoTelaCtx.Provider value={{ contexto, setContexto }}>{children}</ContextoTelaCtx.Provider>;
}

export function useContextoTela() {
  return useContext(ContextoTelaCtx).contexto;
}

// Cada página o renderiza para dizer ao Sócrates o que o aluno está vendo.
// Ao sair da página, o contexto volta a "nenhum".
export function ContextoTela({ tipo, id }: { tipo: TipoContexto; id?: string }) {
  const { setContexto } = useContext(ContextoTelaCtx);
  useEffect(() => {
    setContexto({ tipo, id });
    return () => setContexto(SEM_CONTEXTO);
  }, [tipo, id, setContexto]);
  return null;
}
