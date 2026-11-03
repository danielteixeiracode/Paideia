"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { MarcaFruto } from "@/components/corpo/marca-fruto";
import { cn, quandoRelativo } from "@/lib/utils";

export interface FrutoLinha {
  id: string;
  tipo: string;
  conteudo: string;
  criado_em: string;
  obra: { id: string; titulo: string } | null;
  funcao: { numero: number; nome: string } | null;
  exercicio: { titulo: string } | null;
}

// Frutos em linhas de códice. Cada linha se abre (disclosure) para mostrar o
// texto do aluno, quando houver.
export function FrutosCarteira({ frutos, agora }: { frutos: FrutoLinha[]; agora: string }) {
  if (frutos.length === 0) {
    return (
      <p className="t-corpo text-ink-muted">
        Ainda não há frutos. Eles nascem do que você produz nos exercícios.
      </p>
    );
  }
  return (
    <ol className="filete divide-y-hair divide-rule-strong/40">
      {frutos.map((f) => (
        <LinhaFruto key={f.id} fruto={f} agora={new Date(agora)} />
      ))}
    </ol>
  );
}

function LinhaFruto({ fruto, agora }: { fruto: FrutoLinha; agora: Date }) {
  const [aberto, setAberto] = useState(false);
  const id = useId();
  const titulo = fruto.exercicio?.titulo ?? fruto.obra?.titulo ?? fruto.tipo;
  const temTexto = fruto.conteudo.trim().length > 0;

  const cabeca = (
    <>
      <MarcaFruto numeroFuncao={fruto.funcao?.numero ?? null} />
      <span className="min-w-0 flex-1">
        <span className="block text-interface font-semibold text-ink">{titulo}</span>
        {fruto.funcao && <span className="t-nota block">{fruto.funcao.nome}</span>}
      </span>
    </>
  );

  return (
    <li className="py-3">
      <div className="flex flex-wrap items-start gap-x-3 gap-y-1 sm:flex-nowrap">
        {temTexto ? (
          <button
            type="button"
            aria-expanded={aberto}
            aria-controls={`${id}-texto`}
            onClick={() => setAberto((v) => !v)}
            className="group flex min-h-11 min-w-0 flex-1 items-start gap-3 rounded-md text-left"
          >
            {cabeca}
            <ChevronDown
              aria-hidden
              className={cn("mt-0.5 h-4 w-4 shrink-0 text-ink-muted transition-transform duration-discreto ease-discreto", aberto && "rotate-180")}
            />
            <span className="sr-only">{aberto ? "Esconder o texto" : "Mostrar o texto"}</span>
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-start gap-3">{cabeca}</div>
        )}
        <div className="flex w-full shrink-0 items-baseline justify-between gap-3 pl-11 sm:w-auto sm:flex-col sm:items-end sm:gap-0.5 sm:pl-0">
          {fruto.obra && (
            <Link href={`/obras/${fruto.obra.id}`} className="t-nota text-accent underline-offset-4 hover:underline">
              {fruto.obra.titulo}
            </Link>
          )}
          <time dateTime={fruto.criado_em} className="t-nota">
            {quandoRelativo(fruto.criado_em, agora)}
          </time>
        </div>
      </div>
      {temTexto && (
        <div id={`${id}-texto`} hidden={!aberto} className="mt-2 pl-11">
          <p className="t-leitura whitespace-pre-line">{fruto.conteudo}</p>
        </div>
      )}
    </li>
  );
}
