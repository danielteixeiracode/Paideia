"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareQuote, X, Loader2 } from "lucide-react";
import { ChatWindow } from "@/components/socrates/chat-window";
import { useContextoTela } from "@/components/socrates/contexto-tela";
import { abrirConversaAtual } from "@/app/(shell)/socrates/actions";
import { cn } from "@/lib/utils";
import type { MensagemSocrates } from "@/types/database";

// Botão fixo + gaveta lateral com o mesmo chat e a mesma conversa de /socrates.
// Vive no layout do (shell), então a conversa continua ao navegar entre telas.
export function SocratesGaveta() {
  const pathname = usePathname();
  const contexto = useContextoTela();
  const [aberta, setAberta] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [conversa, setConversa] = useState<{ conversaId: string; mensagens: MensagemSocrates[] } | null>(null);
  const painelRef = useRef<HTMLDivElement>(null);

  const naPaginaDoSocrates = pathname === "/socrates" || pathname.startsWith("/socrates/");

  useEffect(() => {
    if (!aberta) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAberta(false);
    }
    window.addEventListener("keydown", onKey);
    painelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [aberta]);

  useEffect(() => {
    if (naPaginaDoSocrates) setAberta(false);
  }, [naPaginaDoSocrates]);

  // Recarrega a conversa a cada abertura, para trazer o que foi dito em /socrates.
  async function abrir() {
    setAberta(true);
    setErro(null);
    setCarregando(true);
    try {
      const atual = await abrirConversaAtual();
      if (!atual) throw new Error();
      setConversa(atual);
    } catch {
      setErro("Não foi possível abrir o diálogo com Sócrates.");
    } finally {
      setCarregando(false);
    }
  }

  if (naPaginaDoSocrates) return null;

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        aria-label="Conversar com Sócrates"
        className={cn(
          "fixed right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-paideia-gold-500 bg-paideia-green-900 text-paideia-gold-300 shadow-card transition hover:bg-paideia-green-800",
          "bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-6 lg:right-6",
          aberta && "hidden"
        )}
      >
        <MessageSquareQuote className="h-5 w-5" />
      </button>

      {aberta && (
        <div className="fixed inset-0 z-40 bg-paideia-ink/30" onClick={() => setAberta(false)} aria-hidden />
      )}

      <div
        ref={painelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Diálogo com Sócrates"
        tabIndex={-1}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-card outline-none transition-transform duration-200 sm:max-w-md sm:border-l sm:border-paideia-cream-300",
          aberta ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-paideia-cream-300 px-4 py-3">
          <div className="leading-tight">
            <p className="font-serif text-base font-semibold text-paideia-ink">Sócrates</p>
            {conversa && (
              <Link
                href={`/socrates?c=${conversa.conversaId}`}
                className="text-xs font-semibold text-paideia-green-800 hover:underline"
              >
                Abrir diálogo completo
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => setAberta(false)}
            aria-label="Fechar"
            className="rounded-full p-2 text-paideia-ink/60 hover:bg-paideia-cream-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 px-4 pb-4 pt-2">
          {erro ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{erro}</p>
          ) : carregando && !conversa ? (
            <div className="flex h-full items-center justify-center text-paideia-ink/40">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : conversa ? (
            <ChatWindow conversaId={conversa.conversaId} mensagensIniciais={conversa.mensagens} contexto={contexto} />
          ) : null}
        </div>
      </div>
    </>
  );
}
