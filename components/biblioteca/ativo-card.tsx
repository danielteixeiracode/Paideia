"use client";

import { useTransition } from "react";
import { Plus, Check, BookOpen, GraduationCap, Dumbbell, ScrollText, Headphones, Sparkles } from "lucide-react";
import { adicionarAtivoCarteira } from "@/app/(shell)/biblioteca/actions";
import { Selo } from "@/components/ui/selo";
import { Botao } from "@/components/ui/botao";
import { Cartao } from "@/components/ui/cartao";
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
    <Cartao className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas">
          <Icon className="h-5 w-5 text-accent" aria-hidden />
        </div>
        {eixo && <Selo>{eixo.nome}</Selo>}
      </div>

      {ativo.subtitulo && <p className="text-nota text-gold-ink">{ativo.subtitulo}</p>}
      <p className="mt-1 font-serif text-lg font-medium text-ink">{ativo.titulo}</p>
      {ativo.autor && <p className="text-nota text-ink-muted">{ativo.autor}</p>}
      {ativo.descricao && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted line-clamp-3">{ativo.descricao}</p>
      )}

      <p className="t-nota mt-3">
        {ativo.duracao_estimada_horas}h estimadas, nível <span className="capitalize">{ativo.nivel}</span>
      </p>

      <Botao
        variante={naCarteira ? "secundario" : "primario"}
        disabled={naCarteira}
        carregando={pending}
        onClick={() => startTransition(() => adicionarAtivoCarteira(ativo.id))}
        icone={naCarteira ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
        className="mt-4"
      >
        {naCarteira ? "Na Carteira" : "Adicionar à Carteira"}
      </Botao>
    </Cartao>
  );
}
