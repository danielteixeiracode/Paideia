"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { atualizarPapelUsuario } from "@/app/(shell)/admin/actions";
import type { PapelUsuario } from "@/types/database";

export function PapelSelect({ userId, papel }: { userId: string; papel: PapelUsuario }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={papel}
        disabled={pending}
        onChange={(e) =>
          startTransition(() => atualizarPapelUsuario(userId, e.target.value as PapelUsuario))
        }
        className="rounded-md border border-rule bg-surface px-2 py-1 text-xs font-semibold"
      >
        <option value="aluno">Aluno</option>
        <option value="administrador">Administrador</option>
      </select>
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-ink/40" />}
    </div>
  );
}
