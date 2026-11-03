"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { atualizarEixo, removerEixo, criarCapacidade } from "@/app/(shell)/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { CapacidadeChip } from "@/components/admin/capacidade-chip";
import { Cartao } from "@/components/ui/cartao";
import { Botao } from "@/components/ui/botao";
import type { Capacidade, Eixo } from "@/types/database";

export function EixoCard({ eixo, capacidades }: { eixo: Eixo; capacidades: Capacidade[] }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Cartao>
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
            className="rounded-md border border-rule px-3 py-2 text-sm"
          />
          <input
            name="slug"
            defaultValue={eixo.slug}
            required
            placeholder="slug"
            className="rounded-md border border-rule px-3 py-2 text-sm"
          />
          <input
            name="cor"
            type="color"
            defaultValue={eixo.cor}
            className="h-10 rounded-md border border-rule px-2"
          />
          <input
            name="descricao"
            defaultValue={eixo.descricao ?? ""}
            placeholder="Descrição breve"
            className="rounded-md border border-rule px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-2 sm:col-span-2">
            <Botao type="submit" tamanho="sm" carregando={pending}>
              Salvar
            </Botao>
            <Botao variante="secundario" tamanho="sm" onClick={() => setEditing(false)} disabled={pending}>
              Cancelar
            </Botao>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: eixo.cor }} />
              <div>
                <p className="font-serif text-lg font-semibold">{eixo.nome}</p>
                <p className="text-nota text-ink-muted">{eixo.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditing(true)}
                className="rounded-lg p-1.5 text-ink-muted hover:bg-muted hover:text-ink"
                aria-label={`Editar eixo ${eixo.nome}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <DeleteButton action={removerEixo.bind(null, eixo.id)} />
            </div>
          </div>
          {eixo.descricao && <p className="mt-2 text-sm text-ink-muted">{eixo.descricao}</p>}
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
          className="flex-1 rounded-md border border-rule bg-surface px-2.5 py-1.5 text-nota focus:border-focus"
        />
        <SubmitButton label="Adicionar" small />
      </form>
    </Cartao>
  );
}
