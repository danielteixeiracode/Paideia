"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareQuote, Loader2 } from "lucide-react";
import { ChatWindow } from "@/components/socrates/chat-window";
import { useContextoTela } from "@/components/socrates/contexto-tela";
import { Gaveta } from "@/components/ui/sobreposicao";
import { abrirConversaAtual } from "@/app/(shell)/socrates/actions";
import { EVENTO_ABRIR_SOCRATES, type DetalheAbrirSocrates } from "@/lib/socrates";
import type { MensagemSocrates } from "@/types/database";

// Botão fixo + gaveta lateral com o mesmo chat e a mesma conversa de /socrates.
// Vive no layout do (shell), então a conversa continua ao navegar entre telas.
// Foco preso, Esc, clique fora e devolução do foco vêm do componente Gaveta.
export function SocratesGaveta() {
  const pathname = usePathname();
  const contexto = useContextoTela();
  const [aberta, setAberta] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [conversa, setConversa] = useState<{ conversaId: string; mensagens: MensagemSocrates[] } | null>(null);
  // Pergunta do Sócrates que o aluno escolheu responder (Início); vale até fechar.
  const [pergunta, setPergunta] = useState<string | null>(null);

  const naPaginaDoSocrates = pathname === "/socrates" || pathname.startsWith("/socrates/");

  useEffect(() => {
    if (naPaginaDoSocrates) setAberta(false);
  }, [naPaginaDoSocrates]);

  // Recarrega a conversa a cada abertura, para trazer o que foi dito em /socrates.
  async function abrir(novaPergunta: string | null = null) {
    setPergunta(novaPergunta);
    setAberta(true);
    setErro(null);
    setCarregando(true);
    try {
      const atual = await abrirConversaAtual();
      if (!atual) throw new Error();
      setConversa(atual);
    } catch {
      setErro("Não foi possível abrir o diálogo com Sócrates. Feche e tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  // A paleta de comandos e os atalhos abrem a gaveta por este evento.
  useEffect(() => {
    if (naPaginaDoSocrates) return;
    const onAbrir = (e: Event) => abrir((e as CustomEvent<DetalheAbrirSocrates>).detail?.pergunta ?? null);
    window.addEventListener(EVENTO_ABRIR_SOCRATES, onAbrir);
    return () => window.removeEventListener(EVENTO_ABRIR_SOCRATES, onAbrir);
  });

  if (naPaginaDoSocrates) return null;

  return (
    <>
      {/* Fica na página mesmo com a gaveta aberta, para receber o foco de volta. */}
      <button
        type="button"
        onClick={() => abrir()}
        aria-label="Conversar com Sócrates"
        className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-paideia-gold-500 bg-paideia-green-900 text-paideia-gold-300 shadow-overlay transition-colors duration-discreto ease-discreto hover:bg-paideia-green-800 md:bottom-6 md:right-6"
      >
        <MessageSquareQuote className="h-5 w-5" aria-hidden />
      </button>

      <Gaveta
        aberta={aberta}
        onFechar={() => {
          setAberta(false);
          setPergunta(null);
        }}
        titulo="Sócrates"
        acaoCabecalho={
          conversa && (
            <Link
              href={`/socrates?c=${conversa.conversaId}`}
              className="t-nota mt-0.5 inline-block font-semibold text-accent underline-offset-4 hover:underline"
            >
              Abrir diálogo completo
            </Link>
          )
        }
        classeCorpo="flex flex-col overflow-hidden pt-2"
      >
        {erro ? (
          <p role="alert" className="t-nota rounded-md border border-rule bg-sunken px-3 py-2 text-ink">
            {erro}
          </p>
        ) : carregando && !conversa ? (
          <div role="status" className="flex flex-1 items-center justify-center text-ink-muted">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            <span className="sr-only">Abrindo o diálogo</span>
          </div>
        ) : conversa ? (
          <>
            {pergunta && (
              <figure className="mb-3 shrink-0 border-b border-rule pb-3">
                <figcaption className="t-nota">Sócrates pergunta</figcaption>
                <blockquote className="mt-1 font-serif text-subtitulo italic leading-snug text-ink">{pergunta}</blockquote>
              </figure>
            )}
            <div className="min-h-0 flex-1">
              <ChatWindow
                conversaId={conversa.conversaId}
                mensagensIniciais={conversa.mensagens}
                contexto={contexto}
                pergunta={pergunta ?? undefined}
              />
            </div>
          </>
        ) : null}
      </Gaveta>
    </>
  );
}
