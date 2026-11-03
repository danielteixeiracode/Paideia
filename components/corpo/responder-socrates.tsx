"use client";

import { MessageSquareQuote } from "lucide-react";
import { Botao } from "@/components/ui/botao";
import { abrirSocrates } from "@/lib/socrates";

// Abre a gaveta do Sócrates com a pergunta no topo; ela vai junto com a
// resposta do aluno, como contexto.
export function ResponderSocrates({ pergunta }: { pergunta: string }) {
  return (
    <Botao
      variante="secundario"
      onClick={() => abrirSocrates({ pergunta })}
      icone={<MessageSquareQuote className="h-4 w-4" aria-hidden />}
      aria-haspopup="dialog"
    >
      Responder ao Sócrates
    </Botao>
  );
}
