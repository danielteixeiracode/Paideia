"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AlertCircle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type TomAviso = "neutro" | "sucesso" | "erro";

interface Aviso {
  id: number;
  mensagem: string;
  tom: TomAviso;
  duracao: number;
  acao?: { rotulo: string; onClick: () => void };
}

type OpcoesAviso = Partial<Pick<Aviso, "tom" | "duracao" | "acao">>;

const AvisoCtx = createContext<((mensagem: string, opcoes?: OpcoesAviso) => void) | null>(null);

// Avisos discretos no rodapé da tela. Fica no layout raiz; qualquer tela
// chama com useAviso().
export function AvisoProvider({ children }: { children: React.ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const proximoId = useRef(0);

  const fechar = useCallback((id: number) => setAvisos((lista) => lista.filter((a) => a.id !== id)), []);

  const avisar = useCallback((mensagem: string, opcoes: OpcoesAviso = {}) => {
    const tom = opcoes.tom ?? "neutro";
    const aviso: Aviso = {
      id: ++proximoId.current,
      mensagem,
      tom,
      duracao: opcoes.duracao ?? (tom === "erro" ? 8000 : 5000),
      acao: opcoes.acao,
    };
    // No máximo três de uma vez; o mais antigo sai.
    setAvisos((lista) => [...lista.slice(-2), aviso]);
  }, []);

  return (
    <AvisoCtx.Provider value={avisar}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[70] flex flex-col items-center gap-2 px-4 md:bottom-6"
      >
        {avisos.map((a) => (
          <ItemAviso key={a.id} aviso={a} fechar={fechar} />
        ))}
      </div>
    </AvisoCtx.Provider>
  );
}

export function useAviso() {
  const avisar = useContext(AvisoCtx);
  if (!avisar) throw new Error("useAviso precisa de um AvisoProvider acima na árvore.");
  return avisar;
}

function ItemAviso({ aviso, fechar }: { aviso: Aviso; fechar: (id: number) => void }) {
  const [pausado, setPausado] = useState(false);
  const onFechar = () => fechar(aviso.id);

  // O tempo para enquanto o mouse ou o foco estão no aviso.
  useEffect(() => {
    if (pausado) return;
    const t = setTimeout(() => fechar(aviso.id), aviso.duracao);
    return () => clearTimeout(t);
  }, [pausado, aviso.duracao, aviso.id, fechar]);

  const Icone = aviso.tom === "erro" ? AlertCircle : aviso.tom === "sucesso" ? Check : null;

  return (
    <div
      // Erro interrompe o leitor de tela; os demais entram pela região polida acima.
      role={aviso.tom === "erro" ? "alert" : undefined}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      className="anim-aviso pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl bg-ink px-4 py-3 text-canvas shadow-overlay"
    >
      {Icone && <Icone className={cn("mt-0.5 h-4 w-4 shrink-0", "text-canvas")} aria-hidden />}
      <p className="min-w-0 flex-1 text-interface">{aviso.mensagem}</p>
      {aviso.acao && (
        <button
          type="button"
          onClick={() => {
            aviso.acao!.onClick();
            onFechar();
          }}
          className="shrink-0 text-interface font-semibold text-canvas underline underline-offset-4"
        >
          {aviso.acao.rotulo}
        </button>
      )}
      <button
        type="button"
        onClick={onFechar}
        aria-label="Fechar aviso"
        className="-m-1 shrink-0 rounded-md p-1 text-canvas/80 hover:text-canvas [@media(pointer:coarse)]:p-2.5"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
