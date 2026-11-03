"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  mensagem = "Remover permanentemente este item?",
  rotulo,
}: {
  action: () => Promise<void>;
  mensagem?: string;
  rotulo?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      aria-label={rotulo}
      onClick={() => {
        if (confirm(mensagem)) {
          startTransition(action);
        }
      }}
      className="rounded-lg p-1.5 text-ink-muted hover:bg-sunken hover:text-ink"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
