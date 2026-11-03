"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, ArrowDown, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Botao } from "@/components/ui/botao";
import { cn } from "@/lib/utils";
import type { MensagemSocrates } from "@/types/database";
import type { ContextoTela } from "@/lib/socrates";

// Chat com o Sócrates, o mesmo na página /socrates e na gaveta (compacto).
// Só interface: a chamada à API (/api/socrates) e o que ela recebe não mudam.

const SUGESTOES = ["O que devo ler primeiro?", "Ajude-me a entender esta obra", "Pergunte-me algo sobre o que li"];

// De onde vem o nome do que o aluno está vendo, para a faixa de contexto.
const FONTE_CONTEXTO = {
  obra: { tabela: "obras", coluna: "titulo", prefixo: "" },
  funcao: { tabela: "funcoes_pedagogicas", coluna: "nome", prefixo: "função " },
  epoca: { tabela: "epocas", coluna: "nome", prefixo: "época " },
  exercicio: { tabela: "exercicios", coluna: "titulo", prefixo: "exercício " },
} as const;

const ALTURA_MAX_CAMPO = 160; // px: o campo cresce até aqui e depois rola

// useLayoutEffect só no navegador (no servidor o React avisa que não faz nada).
const useEfeitoDeLayout = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useNomeDoContexto(contexto?: ContextoTela) {
  const [nome, setNome] = useState<string | null>(null);
  useEffect(() => {
    setNome(null);
    if (!contexto?.id || contexto.tipo === "nenhum") return;
    const fonte = FONTE_CONTEXTO[contexto.tipo];
    let cancelado = false;
    createClient()
      .from(fonte.tabela)
      .select(fonte.coluna)
      .eq("id", contexto.id)
      .maybeSingle()
      .then(({ data }) => {
        const valor = (data as Record<string, string> | null)?.[fonte.coluna];
        if (!cancelado && valor) setNome(`${fonte.prefixo}${valor}`);
      });
    return () => {
      cancelado = true;
    };
  }, [contexto?.tipo, contexto?.id]);
  return nome;
}

function movimentoReduzido() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function ChatWindow({
  conversaId,
  mensagensIniciais,
  contexto,
  pergunta,
  compacto = false,
}: {
  conversaId: string;
  mensagensIniciais: MensagemSocrates[];
  contexto?: ContextoTela;
  // Pergunta do Sócrates que o aluno está respondendo (vai junto, como contexto).
  pergunta?: string;
  // Na gaveta: menos respiro, botão de enviar só com ícone.
  compacto?: boolean;
}) {
  const [mensagens, setMensagens] = useState<MensagemSocrates[]>(mensagensIniciais);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState("");
  const [novaAbaixo, setNovaAbaixo] = useState(false);
  const rolagemRef = useRef<HTMLDivElement>(null);
  const campoRef = useRef<HTMLTextAreaElement>(null);
  const pertoDoFim = useRef(true);
  const nomeContexto = useNomeDoContexto(contexto);

  useEffect(() => {
    setMensagens(mensagensIniciais);
  }, [conversaId, mensagensIniciais]);

  const irAoFim = useCallback((suave: boolean) => {
    const el = rolagemRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: suave && !movimentoReduzido() ? "smooth" : "auto" });
    setNovaAbaixo(false);
  }, []);

  // Abre já no fim da conversa.
  useEfeitoDeLayout(() => {
    irAoFim(false);
  }, [conversaId, irAoFim]);

  // Mensagem nova: acompanha só se o aluno já estava no fim; se estava lendo
  // mais acima, não pula, e oferece um atalho para descer.
  useEffect(() => {
    if (pertoDoFim.current) irAoFim(true);
    else setNovaAbaixo(true);
  }, [mensagens.length, enviando, irAoFim]);

  function aoRolar() {
    const el = rolagemRef.current;
    if (!el) return;
    pertoDoFim.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (pertoDoFim.current) setNovaAbaixo(false);
  }

  // O campo cresce com o texto até um limite.
  useEfeitoDeLayout(() => {
    const el = campoRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, ALTURA_MAX_CAMPO)}px`;
  }, [texto]);

  async function enviar(conteudoForcado?: string) {
    const conteudo = (conteudoForcado ?? texto).trim();
    if (!conteudo || enviando) return;

    setErro(null);
    setTexto("");
    setEnviando(true);
    setAnuncio("Sócrates está respondendo.");
    pertoDoFim.current = true; // a própria mensagem sempre leva ao fim

    const otimista: MensagemSocrates = {
      id: `temp-${Date.now()}`,
      conversa_id: conversaId,
      user_id: "",
      remetente: "usuario",
      conteudo,
      metadata: {},
      criado_em: new Date().toISOString(),
    };
    setMensagens((prev) => [...prev, otimista]);

    try {
      const res = await fetch("/api/socrates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversaId, conteudo, contexto, pergunta }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sócrates não respondeu. Tente de novo.");

      setMensagens((prev) => [...prev.filter((m) => m.id !== otimista.id), data.mensagemUsuario, data.mensagemSocrates]);
      setAnuncio(`Sócrates respondeu: ${data.mensagemSocrates?.conteudo ?? ""}`);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Sócrates não respondeu. Tente de novo.");
      setMensagens((prev) => prev.filter((m) => m.id !== otimista.id));
      setTexto(conteudo); // a mensagem volta ao campo
      setAnuncio("");
    } finally {
      setEnviando(false);
    }
  }

  function aoEnviar(e: FormEvent) {
    e.preventDefault();
    enviar();
  }

  function preencher(sugestao: string) {
    setTexto(sugestao);
    campoRef.current?.focus();
  }

  const temFaixa = Boolean(nomeContexto || pergunta);

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* A fala nova do Sócrates é anunciada uma vez, sem reler a conversa. */}
      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>

      <div className="relative min-h-0 flex-1">
        <div ref={rolagemRef} onScroll={aoRolar} className="h-full overflow-y-auto scrollbar-thin">
          <div className={cn("mx-auto w-full max-w-leitura", compacto ? "space-y-5 py-2" : "space-y-7 px-1 py-4 sm:px-4")}>
            {mensagens.length === 0 && !enviando && (
              <div className={cn("text-center", compacto ? "py-4" : "py-10")}>
                <p aria-hidden className="font-serif text-titulo leading-none text-gold-ink">
                  Σ
                </p>
                <p className="t-subtitulo mt-3">Comece o diálogo</p>
                <p className="t-nota mt-1">Faça uma pergunta. Sócrates responde perguntando de volta.</p>
                <ul className="mt-5 flex flex-col items-center gap-2" aria-label="Sugestões de primeira pergunta">
                  {SUGESTOES.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => preencher(s)}
                        className="min-h-9 rounded-full border border-rule bg-surface px-4 py-1.5 text-interface text-ink transition-colors duration-discreto ease-discreto hover:border-rule-strong/70 hover:bg-sunken [@media(pointer:coarse)]:min-h-11"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mensagens.map((m) => (
              <Fala key={m.id} mensagem={m} />
            ))}

            {enviando && (
              <div className="flex items-center gap-3 text-ink-muted" aria-hidden>
                <span className="w-6 shrink-0 font-serif text-subtitulo text-gold-ink">Σ</span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-muted" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-muted [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-muted [animation-delay:300ms]" />
                </span>
                <span className="t-nota">Sócrates está respondendo</span>
              </div>
            )}
          </div>
        </div>
        {novaAbaixo && (
          <button
            type="button"
            onClick={() => irAoFim(true)}
            className="absolute bottom-3 left-1/2 flex min-h-9 -translate-x-1/2 items-center gap-1.5 rounded-full border border-rule bg-surface px-3 py-1.5 text-nota text-ink shadow-overlay"
          >
            <ArrowDown className="h-3.5 w-3.5" aria-hidden /> Nova fala abaixo
          </button>
        )}
      </div>

      <div className={cn("shrink-0 border-t border-rule", compacto ? "pt-3" : "pt-4")}>
        {erro && (
          <div role="alert" className="mx-auto mb-3 flex max-w-leitura flex-wrap items-center gap-x-3 gap-y-2 rounded-md border-[3px] border-double border-gold-ink bg-sunken px-3 py-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-gold-ink" aria-hidden />
            <p className="min-w-0 flex-1 text-nota text-ink">{erro}</p>
            <Botao tamanho="sm" variante="secundario" onClick={() => enviar()} disabled={enviando || !texto.trim()}>
              Tentar de novo
            </Botao>
          </div>
        )}

        {temFaixa && (
          <div className="mx-auto mb-2 max-w-leitura space-y-0.5">
            {nomeContexto && <p className="t-nota truncate">Vendo: {nomeContexto}</p>}
            {/* A pergunta fica sempre inteira: o aluno responde a ela (cabe em até 3 linhas). */}
            {pergunta && <p className="t-nota">Respondendo: “{pergunta}”</p>}
          </div>
        )}

        <form onSubmit={aoEnviar} className="mx-auto flex max-w-leitura items-end gap-2">
          <label className="sr-only" htmlFor={`campo-${conversaId}`}>
            Mensagem para Sócrates
          </label>
          <textarea
            id={`campo-${conversaId}`}
            ref={campoRef}
            data-autofoco
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              // Enter envia; Shift+Enter quebra a linha (e o IME em composição não envia).
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                enviar();
              }
            }}
            rows={1}
            placeholder="Escreva sua pergunta ou resposta"
            aria-describedby={`dica-${conversaId}`}
            className="min-h-11 flex-1 resize-none rounded-md border border-rule bg-surface px-3 py-2.5 font-sans text-base leading-normal text-ink transition-colors duration-discreto ease-discreto placeholder:text-ink-muted hover:border-ink-muted sm:text-interface"
          />
          <Botao
            type="submit"
            carregando={enviando}
            disabled={!texto.trim()}
            aria-label={compacto ? "Enviar mensagem" : undefined}
            icone={enviando ? undefined : <Send className="h-4 w-4" aria-hidden />}
            className="min-h-11 shrink-0"
          >
            {compacto ? null : "Enviar"}
          </Botao>
        </form>
        <p id={`dica-${conversaId}`} className={cn("t-nota mx-auto mt-1.5 max-w-leitura", compacto && "sr-only")}>
          Enter envia; Shift+Enter quebra a linha.
        </p>
      </div>
    </div>
  );
}

// Fala do Sócrates: serifa, marca Σ, sem balão. Fala do aluno: sans, à
// direita, num bloco discreto com filete.
function Fala({ mensagem }: { mensagem: MensagemSocrates }) {
  if (mensagem.remetente === "usuario") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-md border-r-hair border-rule-strong/70 bg-sunken px-4 py-2.5">
          <span className="sr-only">Você: </span>
          <p className="t-corpo whitespace-pre-wrap">{mensagem.conteudo}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <span aria-hidden className="w-6 shrink-0 pt-0.5 font-serif text-subtitulo leading-none text-gold-ink">
        Σ
      </span>
      <div className="min-w-0">
        <span className="sr-only">Sócrates: </span>
        <p className="whitespace-pre-wrap font-serif text-leitura leading-relaxed text-ink">{mensagem.conteudo}</p>
      </div>
    </div>
  );
}
