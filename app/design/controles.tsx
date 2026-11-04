"use client";

import { useEffect, useState } from "react";
import { TEMAS, type Tema } from "@/lib/tema";
import { useTema } from "@/components/tema/use-tema";
import { cn } from "@/lib/utils";
import { FileteProgresso } from "@/components/ui/filete-progresso";
import { Botao } from "@/components/ui/botao";

const NOMES: Record<Tema, string> = { claro: "Claro", escuro: "Escuro", foco: "Foco" };

// Troca o tema da página inteira e grava a preferência.
export function SeletorTema() {
  const [tema, definir] = useTema();
  return (
    <div role="group" aria-label="Tema" className="inline-flex overflow-hidden rounded-md border border-rule">
      {TEMAS.map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={tema === t}
          onClick={() => definir(t)}
          className={cn(
            "t-interface px-4 py-2 transition-colors duration-discreto ease-discreto",
            tema === t ? "bg-action text-on-action" : "bg-surface text-ink hover:bg-canvas"
          )}
        >
          {NOMES[t]}
        </button>
      ))}
    </div>
  );
}

// Movimento: o filete de progresso que se enche e o discreto.
export function DemoMovimento() {
  const [rodada, setRodada] = useState(0);
  const [aberto, setAberto] = useState(false);
  const [reduzido, setReduzido] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduzido(mq.matches);
    const atualizar = () => setReduzido(mq.matches);
    mq.addEventListener("change", atualizar);
    return () => mq.removeEventListener("change", atualizar);
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-3">
        <p className="t-interface text-ink">Progresso</p>
        <div className="flex h-40 flex-col justify-center gap-3 rounded-md border border-rule bg-sunken p-4">
          {[1, 0.7, 0.45, 0.25].map((valor, i) => (
            <FileteProgresso key={`${rodada}-${i}`} valor={valor} />
          ))}
        </div>
        <Botao variante="secundario" onClick={() => setRodada((r) => r + 1)}>
          Reproduzir
        </Botao>
      </div>

      <div className="space-y-3">
        <p className="t-interface text-ink">Discreto</p>
        <div className="flex h-40 items-center justify-center rounded-md border border-rule bg-sunken p-4">
          <div
            className={cn(
              "rounded-md bg-action px-4 py-2 text-on-action transition duration-discreto ease-discreto",
              aberto ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
          >
            Confirmado
          </div>
        </div>
        <Botao variante="secundario" onClick={() => setAberto((a) => !a)}>
          {aberto ? "Esconder" : "Mostrar"}
        </Botao>
      </div>

      <p className="t-nota sm:col-span-2">
        {reduzido === null
          ? "Verificando a preferência de movimento do sistema."
          : reduzido
            ? "O sistema pede movimento reduzido: as animações estão desligadas."
            : "O sistema permite movimento. Ative “reduzir movimento” no sistema para conferir o modo reduzido."}
      </p>
    </div>
  );
}
