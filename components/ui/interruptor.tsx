"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

// Interruptor liga/desliga (role="switch"), com rótulo e ajuda ligados por id.
// Espaço e Enter alternam (é um botão); o estado é anunciado por aria-checked.
export function Interruptor({
  rotulo,
  ajuda,
  ligado,
  aoMudar,
  name,
  disabled,
}: {
  rotulo: string;
  ajuda?: string;
  ligado: boolean;
  aoMudar: (ligado: boolean) => void;
  name?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        name={name}
        aria-checked={ligado}
        aria-labelledby={`${id}-rotulo`}
        aria-describedby={ajuda ? `${id}-ajuda` : undefined}
        disabled={disabled}
        onClick={() => aoMudar(!ligado)}
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-discreto ease-discreto disabled:opacity-50",
          ligado ? "border-action bg-action" : "border-rule bg-muted"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block h-4 w-4 rounded-full shadow-card transition-transform duration-discreto ease-discreto",
            ligado ? "translate-x-6 bg-on-action" : "translate-x-1 bg-surface"
          )}
        />
      </button>
      <div className="min-w-0">
        {/* Clicar no rótulo também alterna, como num campo comum. */}
        <span
          id={`${id}-rotulo`}
          onClick={() => !disabled && aoMudar(!ligado)}
          className={cn("t-interface block text-ink", !disabled && "cursor-pointer")}
        >
          {rotulo}
        </span>
        {ajuda && (
          <span id={`${id}-ajuda`} className="t-nota block">
            {ajuda}
          </span>
        )}
      </div>
    </div>
  );
}
