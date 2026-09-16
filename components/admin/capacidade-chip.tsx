"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil, X } from "lucide-react";
import { atualizarCapacidade, removerCapacidade } from "@/app/(shell)/admin/actions";
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
          className="flex-1 rounded-md border border-paideia-cream-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-paideia-gold-500"
        />
        <input
          name="descricao"
          defaultValue={capacidade.descricao ?? ""}
          placeholder="Descrição"
          className="flex-1 rounded-md border border-paideia-cream-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-paideia-gold-500"
        />
        <button type="submit" disabled={pending} className="btn-primary px-2.5 py-1.5 text-[11px]">
          {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Salvar"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={pending}
          className="rounded-md border border-paideia-cream-300 px-2.5 py-1.5 text-[11px] text-paideia-ink/70"
        >
          Cancelar
        </button>
      </form>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-paideia-cream-200 px-2.5 py-1 text-[11px] font-semibold text-paideia-ink/70">
      {capacidade.nome}
      <button
        onClick={() => setEditing(true)}
        className="ml-0.5 text-paideia-ink/40 hover:text-paideia-ink"
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
        className="text-paideia-ink/40 hover:text-red-600"
        aria-label={`Remover capacidade ${capacidade.nome}`}
      >
        {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
      </button>
    </span>
  );
}
