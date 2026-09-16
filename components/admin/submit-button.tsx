"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function SubmitButton({ label, small = false }: { label: string; small?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={small ? "btn-primary px-3 py-1.5 text-xs" : "btn-primary"}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
    </button>
  );
}
