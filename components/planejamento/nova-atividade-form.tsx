"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { criarAtividade } from "@/app/(shell)/planejamento/actions";
import type { Eixo } from "@/types/database";

export function NovaAtividadeForm({ dataPadrao, eixos }: { dataPadrao: string; eixos: Eixo[] }) {
  const [aberto, setAberto] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!aberto) {
    return (
      <button onClick={() => setAberto(true)} className="btn-secondary w-full text-xs">
        <Plus className="h-3.5 w-3.5" /> Agendar Atividade
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(fd) =>
        startTransition(async () => {
          await criarAtividade(fd);
          formRef.current?.reset();
          setAberto(false);
        })
      }
      className="space-y-2 rounded-lg border border-paideia-cream-300 bg-paideia-cream-50 p-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-paideia-ink/70">Nova atividade</p>
        <button type="button" onClick={() => setAberto(false)}>
          <X className="h-3.5 w-3.5 text-paideia-ink/40" />
        </button>
      </div>
      <input
        name="titulo"
        required
        placeholder="Título da atividade"
        className="w-full rounded-md border border-paideia-cream-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-paideia-gold-500"
      />
      <input type="date" name="data" required defaultValue={dataPadrao} className="w-full rounded-md border border-paideia-cream-300 bg-white px-2.5 py-1.5 text-xs outline-none" />
      <div className="grid grid-cols-2 gap-2">
        <select name="periodo" className="rounded-md border border-paideia-cream-300 bg-white px-2 py-1.5 text-xs">
          <option value="matutino">Matutino</option>
          <option value="vespertino">Vespertino</option>
          <option value="noturno">Noturno</option>
        </select>
        <input
          type="number"
          name="duracao_min"
          min={5}
          step={5}
          defaultValue={30}
          className="rounded-md border border-paideia-cream-300 bg-white px-2 py-1.5 text-xs"
        />
      </div>
      <select name="eixo_id" className="w-full rounded-md border border-paideia-cream-300 bg-white px-2 py-1.5 text-xs">
        <option value="">Sem eixo específico</option>
        {eixos.map((e) => (
          <option key={e.id} value={e.id}>
            {e.nome}
          </option>
        ))}
      </select>
      <button disabled={pending} type="submit" className="btn-primary w-full py-1.5 text-xs">
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Adicionar"}
      </button>
    </form>
  );
}
