"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { atualizarAtivo, removerAtivo } from "@/app/(shell)/admin/actions";
import { PublicarToggle } from "@/components/admin/publicar-toggle";
import { DeleteButton } from "@/components/admin/delete-button";
import { Selo } from "@/components/ui/selo";
import { Botao } from "@/components/ui/botao";
import type { Ativo, Eixo } from "@/types/database";

export function AtivoRow({
  ativo,
  eixos,
}: {
  ativo: Ativo;
  eixos: Eixo[];
}) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const eixoNome = eixos.find((e) => e.id === ativo.eixo_id)?.nome ?? "—";

  if (editing) {
    return (
      <tr>
        <td colSpan={5} className="bg-sunken px-4 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              startTransition(async () => {
                await atualizarAtivo(ativo.id, formData);
                setEditing(false);
              });
            }}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            <input
              name="titulo"
              defaultValue={ativo.titulo}
              required
              placeholder="Título"
              className="rounded-md border border-rule px-3 py-2 text-sm lg:col-span-2"
            />
            <select
              name="tipo"
              defaultValue={ativo.tipo}
              className="rounded-md border border-rule px-3 py-2 text-sm"
            >
              <option value="livro">Livro</option>
              <option value="tratado">Tratado</option>
              <option value="curso">Curso</option>
              <option value="exercicio">Exercício</option>
              <option value="audio">Áudio</option>
              <option value="interativo">Interativo</option>
            </select>
            <input
              name="subtitulo"
              defaultValue={ativo.subtitulo ?? ""}
              placeholder="Subtítulo"
              className="rounded-md border border-rule px-3 py-2 text-sm"
            />
            <input
              name="autor"
              defaultValue={ativo.autor ?? ""}
              placeholder="Autor"
              className="rounded-md border border-rule px-3 py-2 text-sm"
            />
            <select
              name="eixo_id"
              defaultValue={ativo.eixo_id ?? ""}
              className="rounded-md border border-rule px-3 py-2 text-sm"
            >
              <option value="">Eixo...</option>
              {eixos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome}
                </option>
              ))}
            </select>
            <input
              name="duracao_estimada_horas"
              type="number"
              step="0.5"
              defaultValue={ativo.duracao_estimada_horas}
              placeholder="Duração (h)"
              className="rounded-md border border-rule px-3 py-2 text-sm"
            />
            <select
              name="nivel"
              defaultValue={ativo.nivel}
              className="rounded-md border border-rule px-3 py-2 text-sm"
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
            <input
              name="descricao"
              defaultValue={ativo.descricao ?? ""}
              placeholder="Descrição"
              className="rounded-md border border-rule px-3 py-2 text-sm lg:col-span-3"
            />
            <div className="flex items-center gap-2 lg:col-span-3">
              <Botao type="submit" tamanho="sm" carregando={pending}>
                Salvar
              </Botao>
              <Botao variante="secundario" tamanho="sm" onClick={() => setEditing(false)} disabled={pending}>
                Cancelar
              </Botao>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-4 py-3">
        <p className="font-medium">{ativo.titulo}</p>
        <p className="text-nota text-ink-muted">{ativo.autor}</p>
      </td>
      <td className="px-4 py-3 capitalize">{ativo.tipo}</td>
      <td className="px-4 py-3">
        <Selo>{eixoNome}</Selo>
      </td>
      <td className="px-4 py-3">
        <PublicarToggle id={ativo.id} ativo={ativo.ativo} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg p-1.5 text-ink-muted hover:bg-muted hover:text-ink"
            aria-label="Editar ativo"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <DeleteButton action={removerAtivo.bind(null, ativo.id)} />
        </div>
      </td>
    </tr>
  );
}
