"use client";

import { BookOpenText, Moon, Sun } from "lucide-react";
import { TEMAS, type Tema } from "@/lib/tema";
import { useTema } from "@/components/tema/use-tema";
import { cn } from "@/lib/utils";

const MODOS: Record<Tema, { rotulo: string; icone: typeof Sun }> = {
  claro: { rotulo: "Modo claro", icone: Sun },
  escuro: { rotulo: "Modo escuro", icone: Moon },
  foco: { rotulo: "Modo foco para leitura", icone: BookOpenText },
};

// Troca entre claro, escuro e foco. A escolha fica salva no navegador.
export function SeletorModo({ className }: { className?: string }) {
  const [tema, definir] = useTema();
  return (
    <div role="group" aria-label="Modo de exibição" className={cn("inline-flex rounded-md border border-rule bg-surface p-0.5", className)}>
      {TEMAS.map((t) => {
        const { rotulo, icone: Icone } = MODOS[t];
        const ativo = tema === t;
        return (
          <button
            key={t}
            type="button"
            aria-pressed={ativo}
            aria-label={rotulo}
            title={rotulo}
            onClick={() => definir(t)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded transition-colors duration-discreto ease-discreto [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11",
              ativo ? "bg-action text-on-action" : "text-ink-muted hover:bg-sunken hover:text-ink"
            )}
          >
            <Icone className="h-4 w-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
