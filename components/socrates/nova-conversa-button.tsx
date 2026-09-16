"use client";

import { useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import { criarConversa } from "@/app/(shell)/socrates/actions";

export function NovaConversaButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => criarConversa("maieutico"))}
      className="btn-primary"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      Iniciar Nova Consulta
    </button>
  );
}
