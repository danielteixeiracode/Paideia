"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil } from "lucide-react";
import { atualizarTrilha, removerTrilha } from "@/app/(shell)/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import type { Trilha } from "@/types/database";

export function TrilhaHeader({ trilha, totalEtapas }: { trilha: Trilha; totalEtapas: number }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          startTransition(async () => {
            await atualizarTrilha(trilha.id, formData);
            setEditing(false);
          });
        }}
        className="grid gap-2 sm:grid-cols-2"
      >
        <input
          name="nome"
          defaultValue={trilha.nome}
          required
          placeholder="Nome da trilha"
          className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm"
        />
        <input
          name="descricao"
          defaultValue={trilha.descricao ?? ""}
          placeholder="Descrição"
          className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-2 sm:col-span-2">
          <button type="submit" disabled={pending} className="btn-primary px-3 py-1.5 text-xs">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={pending}
            className="rounded-md border border-paideia-cream-300 px-3 py-1.5 text-xs text-paideia-ink/70"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-serif text-lg font-semibold">{trilha.nome}</p>
        {trilha.descricao && <p className="mt-1 text-sm text-paideia-ink/60">{trilha.descricao}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg p-1.5 text-paideia-ink/40 hover:bg-paideia-cream-200 hover:text-paideia-ink"
          aria-label="Editar trilha"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <DeleteButton
          action={removerTrilha.bind(null, trilha.id)}
          rotulo={`Remover trilha ${trilha.nome}`}
          mensagem={
            `Remover a trilha "${trilha.nome}"?\n\n` +
            `Isto apaga tambem ${totalEtapas} etapa(s) dela e TODO o progresso ` +
            `dos alunos nessas etapas. A acao nao pode ser desfeita.`
          }
        />
      </div>
    </div>
  );
}
