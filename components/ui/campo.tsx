"use client";

import { forwardRef, useId } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseCampo {
  rotulo: string;
  ajuda?: string;
  erro?: string;
  obrigatorio?: boolean;
}

// 16px no celular para o iOS não aproximar a tela ao focar o campo.
const CONTROLE =
  "w-full rounded-md border bg-surface px-3 py-2 font-sans text-base text-ink transition-colors duration-discreto ease-discreto placeholder:text-ink-muted hover:border-ink-muted disabled:cursor-not-allowed disabled:bg-sunken disabled:text-ink-muted sm:text-interface [@media(pointer:coarse)]:min-h-11";

function bordaControle(erro?: string) {
  return erro ? "border-2 border-gold-ink" : "border-rule";
}

// Rótulo, ajuda e erro ligados ao controle por id (aria-describedby).
function Moldura({
  id,
  rotulo,
  ajuda,
  erro,
  obrigatorio,
  children,
}: BaseCampo & { id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="t-interface block text-ink">
        {rotulo}
        {obrigatorio && <span className="ml-1 font-normal text-ink-muted">(obrigatório)</span>}
      </label>
      {children}
      {ajuda && !erro && (
        <p id={`${id}-ajuda`} className="t-nota">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={`${id}-erro`} className="flex items-start gap-1.5 text-nota font-medium text-ink">
          <AlertCircle className="mt-px h-4 w-4 shrink-0 text-gold-ink" aria-hidden />
          {erro}
        </p>
      )}
    </div>
  );
}

function ariaDoCampo(id: string, { ajuda, erro, obrigatorio }: BaseCampo) {
  return {
    id,
    "aria-invalid": erro ? true : undefined,
    "aria-describedby": erro ? `${id}-erro` : ajuda ? `${id}-ajuda` : undefined,
    required: obrigatorio,
  } as const;
}

export type CampoTextoProps = BaseCampo &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
    // Controle dentro do campo, à direita (por exemplo, mostrar a senha).
    fim?: React.ReactNode;
  };

export const CampoTexto = forwardRef<HTMLInputElement, CampoTextoProps>(function CampoTexto(
  { rotulo, ajuda, erro, obrigatorio, fim, className, ...props },
  ref
) {
  const id = useId();
  const campo = (
    <input
      ref={ref}
      {...ariaDoCampo(id, { rotulo, ajuda, erro, obrigatorio })}
      className={cn(CONTROLE, bordaControle(erro), fim && "pr-12", className)}
      {...props}
    />
  );
  return (
    <Moldura id={id} rotulo={rotulo} ajuda={ajuda} erro={erro} obrigatorio={obrigatorio}>
      {fim ? (
        <div className="relative">
          {campo}
          <div className="absolute inset-y-0 right-1 flex items-center">{fim}</div>
        </div>
      ) : (
        campo
      )}
    </Moldura>
  );
});

export type AreaTextoProps = BaseCampo & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id">;

export const AreaTexto = forwardRef<HTMLTextAreaElement, AreaTextoProps>(function AreaTexto(
  { rotulo, ajuda, erro, obrigatorio, className, rows = 4, ...props },
  ref
) {
  const id = useId();
  return (
    <Moldura id={id} rotulo={rotulo} ajuda={ajuda} erro={erro} obrigatorio={obrigatorio}>
      <textarea
        ref={ref}
        rows={rows}
        {...ariaDoCampo(id, { rotulo, ajuda, erro, obrigatorio })}
        className={cn(CONTROLE, "resize-y leading-relaxed", bordaControle(erro), className)}
        {...props}
      />
    </Moldura>
  );
});

export type SelecaoProps = BaseCampo & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id">;

export const Selecao = forwardRef<HTMLSelectElement, SelecaoProps>(function Selecao(
  { rotulo, ajuda, erro, obrigatorio, className, children, ...props },
  ref
) {
  const id = useId();
  return (
    <Moldura id={id} rotulo={rotulo} ajuda={ajuda} erro={erro} obrigatorio={obrigatorio}>
      <div className="relative">
        <select
          ref={ref}
          {...ariaDoCampo(id, { rotulo, ajuda, erro, obrigatorio })}
          className={cn(CONTROLE, "appearance-none pr-9", bordaControle(erro), className)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
          aria-hidden
        />
      </div>
    </Moldura>
  );
});
