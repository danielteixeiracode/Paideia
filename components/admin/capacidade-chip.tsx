"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil, X } from "lucide-react";
import { atualizarCapacidade, removerCapacidade } from "@/app/(shell)/admin/actions";
import { Botao } from "@/components/ui/botao";
import type { Capacidade } from "@/types/database";

export function CapacidadeChip({ capacidade }: { capacidade: Capacidade }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          startTransition(async () => {
            await atualizarCapacidade(capacidade.id, formData);
            setEditing(false);
          });
        }}
        className="flex w-full items-center gap-1.5"
      >
        <input
          name="nome"
          defaultValue={capacidade.nome}
          required
          placeholder="Nome da capacidade"
          className="flex-1 rounded-md border border-rule bg-surface px-2.5 py-1.5 text-nota focus:border-focus"
        />
        <input
          name="descricao"
          defaultValue={capacidade.descricao ?? ""}
          placeholder="Descrição"
          className="flex-1 rounded-md border border-rule bg-surface px-2.5 py-1.5 text-nota focus:border-focus"
        />
        <Botao type="submit" tamanho="sm" carregando={pending}>
          Salvar
        </Botao>
        <Botao variante="secundario" tamanho="sm" onClick={() => setEditing(false)} disabled={pending}>
          Cancelar
        </Botao>
      </form>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-nota font-semibold text-ink">
      {capacidade.nome}
      <button
        onClick={() => setEditing(true)}
        className="ml-0.5 text-ink-muted hover:text-ink"
        aria-label={`Editar capacidade ${capacidade.nome}`}
      >
        <Pencil className="h-3 w-3" />
      </button>
      <button
        onClick={() => {
          if (confirm(`Remover a capacidade "${capacidade.nome}"?`)) {
            startTransition(() => removerCapacidade(capacidade.id));
          }
        }}
        disabled={pending}
        className="text-ink-muted hover:text-ink"
        aria-label={`Remover capacidade ${capacidade.nome}`}
      >
        {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
      </button>
    </span>
  );
}
