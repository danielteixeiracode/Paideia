"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import type { MensagemSocrates } from "@/types/database";
import type { ContextoTela } from "@/lib/socrates";

export function ChatWindow({
  conversaId,
  mensagensIniciais,
  contexto,
  pergunta,
}: {
  conversaId: string;
  mensagensIniciais: MensagemSocrates[];
  contexto?: ContextoTela;
  // Pergunta do Sócrates que o aluno está respondendo (vai junto, como contexto).
  pergunta?: string;
}) {
  const [mensagens, setMensagens] = useState<MensagemSocrates[]>(mensagensIniciais);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMensagens(mensagensIniciais);
  }, [conversaId, mensagensIniciais]);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, enviando]);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const conteudo = texto.trim();
    if (!conteudo || enviando) return;

    setErro(null);
    setTexto("");
    setEnviando(true);

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
      if (!res.ok) throw new Error(data.error ?? "Falha ao consultar Sócrates.");

      setMensagens((prev) => [
        ...prev.filter((m) => m.id !== otimista.id),
        data.mensagemUsuario,
        data.mensagemSocrates,
      ]);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro inesperado.");
      setMensagens((prev) => prev.filter((m) => m.id !== otimista.id));
      setTexto(conteudo);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin px-1 py-2">
        {mensagens.length === 0 && (
          <div className="rounded-xl border border-dashed border-rule p-6 text-center text-sm text-ink/50">
            Inicie o diálogo maiêutico. Sócrates aguarda sua primeira indagação.
          </div>
        )}
        {mensagens.map((m) => (
          <MensagemBubble key={m.id} mensagem={m} />
        ))}
        {enviando && (
          <div className="flex items-center gap-2 text-xs italic text-ink/40">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sócrates pondera sua resposta...
          </div>
        )}
        <div ref={fimRef} />
      </div>

      {erro && <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{erro}</p>}

      <form onSubmit={enviar} className="flex items-end gap-2 border-t border-rule pt-3">
        <textarea
          data-autofoco
          aria-label="Mensagem para Sócrates"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar(e);
            }
          }}
          rows={2}
          placeholder="Formule sua dúvida, resposta ou silogismo para Sócrates..."
          className="flex-1 resize-none rounded-lg border border-rule bg-surface px-3 py-2.5 text-sm outline-none focus:border-paideia-gold-500"
        />
        <button type="submit" disabled={enviando || !texto.trim()} className="btn-primary h-fit py-2.5">
          {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Responder
        </button>
      </form>
    </div>
  );
}

function MensagemBubble({ mensagem }: { mensagem: MensagemSocrates }) {
  const doUsuario = mensagem.remetente === "usuario";
  return (
    <div className={`flex ${doUsuario ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed shadow-card sm:max-w-[75%] ${
          doUsuario
            ? "bg-action text-on-action"
            : "border border-paideia-gold-300 bg-sunken text-ink"
        }`}
      >
        {!doUsuario && <p className="mb-1 text-xs font-semibold text-gold-ink">Sócrates</p>}
        <p className="whitespace-pre-wrap font-serif italic">{mensagem.conteudo}</p>
      </div>
    </div>
  );
}
