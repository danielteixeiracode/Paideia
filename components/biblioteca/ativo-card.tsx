"use client";

import { useTransition } from "react";
import { Loader2, Plus, Check, BookOpen, GraduationCap, Dumbbell, ScrollText, Headphones, Sparkles } from "lucide-react";
import { adicionarAtivoCarteira } from "@/app/(shell)/biblioteca/actions";
import { Badge } from "@/components/ui/primitives";
import type { Ativo, Eixo } from "@/types/database";

const ICONS: Record<string, typeof BookOpen> = {
  livro: BookOpen,
  curso: GraduationCap,
  exercicio: Dumbbell,
  tratado: ScrollText,
  audio: Headphones,
  interativo: Sparkles,
};

export function AtivoCard({
  ativo,
  eixo,
  naCarteira,
}: {
  ativo: Ativo;
  eixo?: Eixo;
  naCarteira: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const Icon = ICONS[ativo.tipo] ?? BookOpen;

  return (
    <div className="flex flex-col rounded-2xl border border-rule bg-surface p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        {eixo && <Badge tone="neutral">{eixo.nome}</Badge>}
      </div>

      {ativo.subtitulo && <p className="text-[11px] uppercase tracking-wide text-gold-ink">{ativo.subtitulo}</p>}
      <p className="mt-1 font-serif text-lg font-semibold text-ink">{ativo.titulo}</p>
      {ativo.autor && <p className="text-xs text-ink/50">{ativo.autor}</p>}
      {ativo.descricao && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60 line-clamp-3">{ativo.descricao}</p>
      )}

      <div className="mt-3 flex items-center gap-3 text-[11px] text-ink/50">
        <span>{ativo.duracao_estimada_horas}h estimadas</span>
        <span>•</span>
        <span className="capitalize">{ativo.nivel}</span>
      </div>

      <button
        disabled={naCarteira || pending}
        onClick={() => startTransition(() => adicionarAtivoCarteira(ativo.id))}
        className={`mt-4 ${naCarteira ? "btn-secondary" : "btn-primary"}`}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : naCarteira ? (
          <>
            <Check className="h-4 w-4" /> Na Carteira
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" /> Adicionar à Carteira
          </>
        )}
      </button>
    </div>
  );
}
