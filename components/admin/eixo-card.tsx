"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil } from "lucide-react";
import { atualizarEixo, removerEixo, criarCapacidade } from "@/app/(shell)/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { CapacidadeChip } from "@/components/admin/capacidade-chip";
import { Card } from "@/components/ui/primitives";
import type { Capacidade, Eixo } from "@/types/database";

export function EixoCard({ eixo, capacidades }: { eixo: Eixo; capacidades: Capacidade[] }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Card>
      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            startTransition(async () => {
              await atualizarEixo(eixo.id, formData);
              setEditing(false);
            });
          }}
          className="grid gap-2 sm:grid-cols-2"
        >
          <input
            name="nome"
            defaultValue={eixo.nome}
            required
            placeholder="Nome do eixo"
            className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm"
          />
          <input
            name="slug"
            defaultValue={eixo.slug}
            required
            placeholder="slug"
            className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm"
          />
          <input
            name="cor"
            type="color"
            defaultValue={eixo.cor}
            className="h-10 rounded-md border border-paideia-cream-300 px-2"
          />
          <input
            name="descricao"
            defaultValue={eixo.descricao ?? ""}
            placeholder="Descrição breve"
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
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: eixo.cor }} />
              <div>
                <p className="font-serif text-lg font-semibold">{eixo.nome}</p>
                <p className="text-xs text-paideia-ink/50">{eixo.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditing(true)}
                className="rounded-lg p-1.5 text-paideia-ink/40 hover:bg-paideia-cream-200 hover:text-paideia-ink"
                aria-label={`Editar eixo ${eixo.nome}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <DeleteButton action={removerEixo.bind(null, eixo.id)} />
            </div>
          </div>
          {eixo.descricao && <p className="mt-2 text-sm text-paideia-ink/60">{eixo.descricao}</p>}
        </>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {capacidades.map((c) => (
          <CapacidadeChip key={c.id} capacidade={c} />
        ))}
      </div>

      <form action={criarCapacidade} className="mt-4 flex gap-2">
        <input type="hidden" name="eixo_id" value={eixo.id} />
        <input
          name="nome"
          required
          placeholder="Nova capacidade"
          className="flex-1 rounded-md border border-paideia-cream-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-paideia-gold-500"
        />
        <SubmitButton label="Adicionar" small />
      </form>
    </Card>
  );
}
