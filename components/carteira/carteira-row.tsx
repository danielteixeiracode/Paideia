"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { Badge, ProgressBar } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusSelect } from "@/components/carteira/status-select";
import { atualizarDetalhesCarteira, removerItemCarteira } from "@/app/(shell)/carteira/actions";
import { formatHoras } from "@/lib/utils";
import type { CarteiraItem } from "@/types/database";

export function CarteiraRow({ item }: { item: CarteiraItem }) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [pending, startTransition] = useTransition();

  const [progresso, setProgresso] = useState(String(item.progresso_percentual));
  const [horas, setHoras] = useState(String(item.horas_investidas));
  const [nota, setNota] = useState(item.nota ? String(item.nota) : "");
  const [anotacoes, setAnotacoes] = useState(item.anotacoes ?? "");

  function salvar() {
    startTransition(async () => {
      await atualizarDetalhesCarteira(item.id, {
        progresso_percentual: Math.min(100, Math.max(0, Number(progresso) || 0)),
        horas_investidas: Math.max(0, Number(horas) || 0),
        nota: nota ? Math.min(5, Math.max(1, Number(nota))) : null,
        anotacoes: anotacoes.trim() || null,
      });
      router.refresh();
      setEditando(false);
    });
  }

  async function excluir() {
    await removerItemCarteira(item.id);
    router.refresh();
  }

  return (
    <>
      <tr>
        <td className="px-4 py-3">
          <p className="font-serif font-semibold text-paideia-ink">{item.ativo_ref?.titulo}</p>
          <p className="text-xs text-paideia-ink/50">{item.ativo_ref?.autor}</p>
        </td>
        <td className="px-4 py-3">
          <Badge tone="neutral">{item.ativo_ref?.eixo?.nome ?? "—"}</Badge>
        </td>
        <td className="px-4 py-3">
          <StatusSelect id={item.id} status={item.status} />
          <div className="mt-1.5 w-32">
            <ProgressBar value={Number(item.progresso_percentual)} />
          </div>
        </td>
        <td className="px-4 py-3 text-right font-semibold">
          {formatHoras(Number(item.horas_investidas))}
        </td>
        <td className="px-2 py-3">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setEditando((v) => !v)}
              aria-label={editando ? "Fechar edição" : "Editar detalhes"}
              className="rounded-lg p-1.5 text-paideia-ink/40 hover:bg-paideia-cream-100 hover:text-paideia-green-800"
            >
              {editando ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </button>
            <DeleteButton
              action={excluir}
              mensagem={`Remover "${item.ativo_ref?.titulo}" da sua carteira? Isso não apaga seu histórico de estudo já registrado.`}
              rotulo="Remover da carteira"
            />
          </div>
        </td>
      </tr>
      {editando && (
        <tr className="bg-paideia-cream-50">
          <td colSpan={5} className="px-4 py-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <label className="text-xs">
                <span className="label-caps mb-1 block">Progresso (%)</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={progresso}
                  onChange={(e) => setProgresso(e.target.value)}
                  className="w-full rounded-md border border-paideia-cream-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-paideia-gold-500"
                />
              </label>
              <label className="text-xs">
                <span className="label-caps mb-1 block">Horas investidas</span>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={horas}
                  onChange={(e) => setHoras(e.target.value)}
                  className="w-full rounded-md border border-paideia-cream-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-paideia-gold-500"
                />
              </label>
              <label className="text-xs">
                <span className="label-caps mb-1 block">Nota (1-5)</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="w-full rounded-md border border-paideia-cream-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-paideia-gold-500"
                />
              </label>
              <div className="flex items-end">
                <button
                  type="button"
                  disabled={pending}
                  onClick={salvar}
                  className="btn-primary w-full px-3 py-1.5 text-xs"
                >
                  {pending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  Salvar
                </button>
              </div>
              <label className="text-xs sm:col-span-4">
                <span className="label-caps mb-1 block">Anotações</span>
                <textarea
                  rows={2}
                  value={anotacoes}
                  onChange={(e) => setAnotacoes(e.target.value)}
                  placeholder="Notas pessoais sobre este estudo…"
                  className="w-full rounded-md border border-paideia-cream-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-paideia-gold-500"
                />
              </label>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
