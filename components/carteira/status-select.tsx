"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { atualizarStatusCarteira } from "@/app/(shell)/carteira/actions";
import type { StatusCarteira } from "@/types/database";

export const STATUS_LABEL: Record<StatusCarteira, string> = {
  planejado: "Planejado",
  em_andamento: "Em Andamento",
  concluido: "Concluído",
  pausado: "Pausado",
};

const TONE_CLASS: Record<StatusCarteira, string> = {
  planejado: "bg-paideia-cream-200 text-paideia-ink/70",
  em_andamento: "bg-paideia-gold-400/25 text-paideia-gold-700",
  concluido: "bg-paideia-green-800 text-paideia-gold-300",
  pausado: "bg-red-100 text-red-700",
};

export function StatusSelect({ id, status }: { id: string; status: StatusCarteira }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="inline-flex items-center gap-1.5">
      <select
        value={status}
        disabled={pending}
        aria-label="Mover para outro estado"
        onChange={(e) => {
          const novoStatus = e.target.value as StatusCarteira;
          startTransition(async () => {
            await atualizarStatusCarteira(id, novoStatus);
            router.refresh();
          });
        }}
        className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none transition disabled:cursor-wait disabled:opacity-50 ${TONE_CLASS[status]}`}
      >
        {(Object.keys(STATUS_LABEL) as StatusCarteira[]).map((valor) => (
          <option key={valor} value={valor}>
            {STATUS_LABEL[valor]}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="h-3 w-3 animate-spin text-paideia-ink/40" />}
    </div>
  );
}
