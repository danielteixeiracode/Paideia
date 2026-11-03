"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { classesBotao } from "@/components/ui/botao";

export function SubmitButton({ label, small = false }: { label: string; small?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      className={classesBotao({ tamanho: small ? "sm" : "md" })}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : label}
    </button>
  );
}
