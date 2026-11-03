"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Comportamento comum de gaveta e diálogo: foco preso dentro do painel, Esc
// fecha, a página de trás não rola, e ao fechar o foco volta para quem abriu.
function useCamadaModal(aberta: boolean, onFechar: () => void) {
  const painelRef = useRef<HTMLDivElement>(null);
  const onFecharRef = useRef(onFechar);
  onFecharRef.current = onFechar;

  useEffect(() => {
    if (!aberta) return;
    const anterior = document.activeElement as HTMLElement | null;
    const painel = painelRef.current;
    const primeiro = painel?.querySelector<HTMLElement>("[data-autofoco]") ?? painel?.querySelector<HTMLElement>(FOCAVEIS);
    (primeiro ?? painel)?.focus();

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onFecharRef.current();
        return;
      }
      if (e.key !== "Tab" || !painel) return;
      const itens = Array.from(painel.querySelectorAll<HTMLElement>(FOCAVEIS)).filter((el) => el.offsetParent !== null);
      if (itens.length === 0) {
        e.preventDefault();
        painel.focus();
        return;
      }
      const inicio = itens[0];
      const fim = itens[itens.length - 1];
      if (e.shiftKey && (document.activeElement === inicio || document.activeElement === painel)) {
        e.preventDefault();
        fim.focus();
      } else if (!e.shiftKey && document.activeElement === fim) {
        e.preventDefault();
        inicio.focus();
      }
    }
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      anterior?.focus?.();
    };
  }, [aberta]);

  return painelRef;
}

// O painel vai direto para o <body>, o que só existe depois de montar no cliente.
function useMontado() {
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  return montado;
}

function Fundo({ onFechar }: { onFechar: () => void }) {
  return <div aria-hidden className="anim-camada fixed inset-0 bg-paideia-ink/40" onClick={onFechar} />;
}

function BotaoFechar({ onFechar }: { onFechar: () => void }) {
  return (
    <button
      type="button"
      onClick={onFechar}
      aria-label="Fechar"
      className="-mr-1 shrink-0 rounded-md p-2 text-ink-muted transition-colors duration-discreto ease-discreto hover:bg-sunken hover:text-ink [@media(pointer:coarse)]:p-3"
    >
      <X className="h-5 w-5" aria-hidden />
    </button>
  );
}

export function Gaveta({
  aberta,
  onFechar,
  titulo,
  descricao,
  acaoCabecalho,
  rodape,
  className,
  children,
}: {
  aberta: boolean;
  onFechar: () => void;
  titulo: string;
  descricao?: string;
  acaoCabecalho?: React.ReactNode;
  rodape?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const montado = useMontado();
  const painelRef = useCamadaModal(aberta && montado, onFechar);
  const id = useId();
  if (!aberta || !montado) return null;

  return createPortal(
      <div className="fixed inset-0 z-[60]">
        <Fundo onFechar={onFechar} />
        <div
          ref={painelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-titulo`}
          aria-describedby={descricao ? `${id}-descricao` : undefined}
          tabIndex={-1}
          className={cn(
            "anim-gaveta fixed inset-y-0 right-0 flex w-full flex-col bg-surface text-ink shadow-overlay outline-none sm:max-w-md sm:border-l sm:border-rule",
            className
          )}
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="flex items-start justify-between gap-3 border-b border-rule px-5 py-4">
            <div className="min-w-0">
              <h2 id={`${id}-titulo`} className="t-subtitulo">
                {titulo}
              </h2>
              {descricao && (
                <p id={`${id}-descricao`} className="t-nota mt-0.5">
                  {descricao}
                </p>
              )}
              {acaoCabecalho}
            </div>
            <BotaoFechar onFechar={onFechar} />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {rodape && <div className="border-t border-rule px-5 py-4">{rodape}</div>}
        </div>
      </div>,
    document.body
  );
}

export function Dialogo({
  aberto,
  onFechar,
  titulo,
  descricao,
  acoes,
  alerta = false,
  className,
  children,
}: {
  aberto: boolean;
  onFechar: () => void;
  titulo: string;
  descricao?: string;
  acoes?: React.ReactNode;
  // Para confirmações que pedem decisão (por exemplo, apagar).
  alerta?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const montado = useMontado();
  const painelRef = useCamadaModal(aberto && montado, onFechar);
  const id = useId();
  if (!aberto || !montado) return null;

  return createPortal(
      <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
        <Fundo onFechar={onFechar} />
        <div
          ref={painelRef}
          role={alerta ? "alertdialog" : "dialog"}
          aria-modal="true"
          aria-labelledby={`${id}-titulo`}
          aria-describedby={descricao ? `${id}-descricao` : undefined}
          tabIndex={-1}
          className={cn(
            "anim-dialogo relative flex max-h-[85dvh] w-full max-w-lg flex-col rounded-2xl border border-rule bg-surface text-ink shadow-overlay outline-none",
            className
          )}
        >
          <div className="flex items-start justify-between gap-3 px-6 pt-5">
            <div className="min-w-0">
              <h2 id={`${id}-titulo`} className="t-subtitulo">
                {titulo}
              </h2>
              {descricao && (
                <p id={`${id}-descricao`} className="t-nota mt-1">
                  {descricao}
                </p>
              )}
            </div>
            <BotaoFechar onFechar={onFechar} />
          </div>
          {children && <div className="min-h-0 overflow-y-auto px-6 pt-4">{children}</div>}
          {acoes && <div className="flex flex-wrap justify-end gap-2 px-6 pb-5 pt-5">{acoes}</div>}
          {!acoes && <div className="pb-5" />}
        </div>
      </div>,
    document.body
  );
}
