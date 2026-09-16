"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil } from "lucide-react";
import { atualizarEtapa, removerEtapa } from "@/app/(shell)/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/primitives";
import type { Eixo, EtapaTrilha } from "@/types/database";

export function EtapaRow({ etapa, eixos }: { etapa: EtapaTrilha; eixos: Eixo[] }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const eixoNome = eixos.find((e) => e.id === etapa.eixo_id)?.nome ?? "—";

  if (editing) {
    return (
      <tr>
        <td colSpan={5} className="bg-paideia-cream-50 px-3 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              startTransition(async () => {
                await atualizarEtapa(etapa.id, formData);
                setEditing(false);
              });
            }}
            className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
          >
            <input
              name="codigo"
              defaultValue={etapa.codigo}
              required
              placeholder="Código (ETAPA 12)"
              className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm"
            />
            <select
              name="eixo_id"
              defaultValue={etapa.eixo_id}
              required
              className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm"
            >
              <option value="">Eixo...</option>
              {eixos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome}
                </option>
              ))}
            </select>
            <input
              name="ordem"
              type="number"
              defaultValue={etapa.ordem}
              placeholder="Ordem"
              className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm"
            />
            <input
              name="titulo"
              defaultValue={etapa.titulo}
              required
              placeholder="Título da etapa"
              className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm lg:col-span-2"
            />
            <input
              name="carga_horas_estimada"
              type="number"
              step="0.5"
              defaultValue={etapa.carga_horas_estimada}
              placeholder="Carga (h)"
              className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm"
            />
            <input
              name="descricao"
              defaultValue={etapa.descricao ?? ""}
              placeholder="Descrição"
              className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm lg:col-span-2"
            />
            <input
              name="selo_titulo"
              defaultValue={etapa.selo_titulo ?? ""}
              placeholder="Selo de conclusão"
              className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-2 lg:col-span-3">
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
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-3 py-2 text-xs text-paideia-ink/50">{etapa.codigo}</td>
      <td className="px-3 py-2 font-medium">{etapa.titulo}</td>
      <td className="px-3 py-2">
        <Badge tone="neutral">{eixoNome}</Badge>
      </td>
      <td className="px-3 py-2">{etapa.carga_horas_estimada}h</td>
      <td className="px-3 py-2 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg p-1.5 text-paideia-ink/40 hover:bg-paideia-cream-200 hover:text-paideia-ink"
            aria-label="Editar etapa"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <DeleteButton action={removerEtapa.bind(null, etapa.id)} />
        </div>
      </td>
    </tr>
  );
}
