"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Plus, MessageSquareQuote, Loader2 } from "lucide-react";
import { criarConversa } from "@/app/(shell)/socrates/actions";
import { cn } from "@/lib/utils";
import type { ConversaSocrates } from "@/types/database";

export function ConversasSidebar({
  conversas,
  ativaId,
}: {
  conversas: ConversaSocrates[];
  ativaId?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex h-full flex-col gap-3">
      <button
        disabled={pending}
        onClick={() => startTransition(() => criarConversa("maieutico"))}
        className="btn-primary w-full text-xs"
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
        Nova Consulta
      </button>

      <div className="flex-1 space-y-1.5 overflow-y-auto scrollbar-thin">
        {conversas.length === 0 && (
          <p className="px-2 text-xs text-ink/40">Nenhum diálogo ainda.</p>
        )}
        {conversas.map((c) => (
          <Link
            key={c.id}
            href={`/socrates?c=${c.id}`}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition",
              c.id === ativaId
                ? "bg-action text-on-action"
                : "text-ink/70 hover:bg-canvas"
            )}
          >
            <MessageSquareQuote className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{c.titulo}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
