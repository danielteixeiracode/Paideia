"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { List, Plus } from "lucide-react";
import { criarConversa } from "@/app/(shell)/socrates/actions";
import { Botao } from "@/components/ui/botao";
import { Gaveta } from "@/components/ui/sobreposicao";
import { cn, quandoRelativo } from "@/lib/utils";

export interface Consulta {
  id: string;
  titulo: string;
  atualizado_em: string;
}

export function BotaoNovaConsulta({ className }: { className?: string }) {
  const [pendente, iniciar] = useTransition();
  return (
    <Botao
      carregando={pendente}
      onClick={() => iniciar(() => criarConversa("maieutico"))}
      icone={<Plus className="h-4 w-4" aria-hidden />}
      className={className}
    >
      Nova consulta
    </Botao>
  );
}

// As consultas do aluno: título, data relativa e a atual destacada.
export function ListaConsultas({
  consultas,
  ativaId,
  agora,
  aoEscolher,
}: {
  consultas: Consulta[];
  ativaId?: string;
  agora: string; // ISO do servidor, para a data relativa não divergir na hidratação
  aoEscolher?: () => void;
}) {
  const quando = new Date(agora);
  return (
    <nav aria-label="Consultas" className="flex h-full min-h-0 flex-col gap-3">
      <BotaoNovaConsulta className="w-full" />
      {consultas.length === 0 ? (
        <p className="t-nota px-1">Nenhuma consulta ainda.</p>
      ) : (
        <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto scrollbar-thin">
          {consultas.map((c) => {
            const ativa = c.id === ativaId;
            return (
              <li key={c.id}>
                <Link
                  href={`/socrates?c=${c.id}`}
                  onClick={aoEscolher}
                  aria-current={ativa ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 flex-col justify-center rounded-md border-l px-3 py-2 transition-colors duration-discreto ease-discreto",
                    ativa ? "border-gold bg-sunken" : "border-transparent hover:bg-sunken"
                  )}
                >
                  <span className={cn("truncate text-interface text-ink", ativa && "font-semibold")}>{c.titulo}</span>
                  <span className="t-nota">{quandoRelativo(c.atualizado_em, quando)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}

// No celular, a lista abre numa gaveta.
export function ConsultasNoCelular(props: { consultas: Consulta[]; ativaId?: string; agora: string }) {
  const [aberta, setAberta] = useState(false);
  return (
    <>
      <Botao variante="secundario" tamanho="sm" onClick={() => setAberta(true)} icone={<List className="h-4 w-4" aria-hidden />} aria-haspopup="dialog">
        Consultas
      </Botao>
      <Gaveta aberta={aberta} onFechar={() => setAberta(false)} titulo="Consultas" classeCorpo="flex flex-col overflow-hidden">
        <ListaConsultas {...props} aoEscolher={() => setAberta(false)} />
      </Gaveta>
    </>
  );
}
