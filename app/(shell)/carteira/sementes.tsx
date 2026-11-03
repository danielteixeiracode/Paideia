"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartaoObra, type ObraLista } from "@/components/corpo/cartao-obra";
import type { FuncaoColunata } from "@/components/corpo/colunata";
import { Botao } from "@/components/ui/botao";
import { useAviso } from "@/components/ui/aviso";
import { guardarObra, removerObra } from "@/app/(shell)/obras/actions";
import { ERRO_CONEXAO } from "@/lib/acoes";

// Sementes da Carteira. Remover é otimista: o cartão sai na hora, com um
// aviso que permite desfazer; se o servidor falhar, ele volta com a mensagem.
export function SementesCarteira({ sementes, funcoes }: { sementes: ObraLista[]; funcoes: FuncaoColunata[] }) {
  const [ocultas, setOcultas] = useState<Set<string>>(new Set());
  const avisar = useAviso();

  // Quando a página recarrega os dados do servidor, eles mandam.
  useEffect(() => setOcultas(new Set()), [sementes]);

  const mostrar = (id: string) =>
    setOcultas((atual) => {
      const novo = new Set(atual);
      novo.delete(id);
      return novo;
    });

  async function desfazer(obra: ObraLista) {
    mostrar(obra.id);
    const resultado = await guardarObra(obra.id).catch(() => ERRO_CONEXAO);
    if (!resultado.ok) avisar(resultado.erro, { tom: "erro" });
  }

  async function remover(obra: ObraLista) {
    setOcultas((atual) => new Set(atual).add(obra.id));
    avisar(`${obra.titulo} saiu da Carteira.`, { acao: { rotulo: "Desfazer", onClick: () => desfazer(obra) } });
    const resultado = await removerObra(obra.id).catch(() => ERRO_CONEXAO);
    if (!resultado.ok) {
      mostrar(obra.id);
      avisar(resultado.erro, { tom: "erro" });
    }
  }

  const visiveis = sementes.filter((s) => !ocultas.has(s.id));

  if (visiveis.length === 0) {
    return (
      <p className="t-corpo text-ink-muted">
        Nenhuma semente na Carteira. Guarde uma obra pela ficha dela, em{" "}
        <Link href="/obras" className="text-accent underline underline-offset-4">
          Obras
        </Link>
        ; ela fica aqui até dar o primeiro fruto.
      </p>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {visiveis.map((obra) => (
        <li key={obra.id} className="flex flex-col gap-2">
          <CartaoObra obra={{ ...obra, naCarteira: false }} funcoes={funcoes} />
          <div className="flex justify-end">
            <Botao
              variante="discreto"
              tamanho="sm"
              onClick={() => remover(obra)}
              aria-label={`Remover ${obra.titulo} da Carteira`}
            >
              Remover da Carteira
            </Botao>
          </div>
        </li>
      ))}
    </ul>
  );
}
