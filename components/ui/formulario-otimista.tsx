"use client";

import { useRef } from "react";
import { useAviso } from "@/components/ui/aviso";
import { ERRO_CONEXAO, type ResultadoAcao } from "@/lib/acoes";

// Formulário que responde na hora: ao enviar, o aviso de sucesso aparece de
// imediato e os campos já mostram o novo valor. Se o servidor falhar, os
// campos voltam ao último valor salvo e um aviso explica o que houve.
export function FormularioOtimista({
  action,
  sucesso,
  className,
  children,
}: {
  action: (dados: FormData) => Promise<ResultadoAcao>;
  sucesso: string;
  className?: string;
  children: React.ReactNode;
}) {
  const avisar = useAviso();
  const formRef = useRef<HTMLFormElement>(null);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const dados = new FormData(form);
    avisar(sucesso, { tom: "sucesso" });
    const resultado = await action(dados).catch(() => ERRO_CONEXAO);
    if (!resultado.ok) {
      // reset() devolve cada campo ao valor que veio do servidor (defaultValue).
      formRef.current?.reset();
      avisar(resultado.erro, { tom: "erro" });
    }
  }

  return (
    <form ref={formRef} onSubmit={enviar} className={className}>
      {children}
    </form>
  );
}
