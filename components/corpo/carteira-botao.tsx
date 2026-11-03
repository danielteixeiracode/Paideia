"use client";

import { useEffect, useRef, useState } from "react";
import { Landmark } from "lucide-react";
import { guardarObra, removerObra } from "@/app/(shell)/obras/actions";
import { Botao } from "@/components/ui/botao";
import { SeloEstadoObra } from "@/components/ui/selo";
import { useAviso } from "@/components/ui/aviso";
import { ERRO_CONEXAO } from "@/lib/acoes";

// Na ficha da obra: guarda a obra na Carteira ou, se já guardada, mostra o
// estado e permite remover. Otimista: a interface muda no clique, com aviso,
// e volta ao que era (com a mensagem do servidor) se a ação falhar.
export function CarteiraBotao({ obraId, estado }: { obraId: string; estado: string | null }) {
  const [estadoLocal, setEstadoLocal] = useState(estado);
  const avisar = useAviso();
  // Conta as ações em voo: só a mais recente pode desfazer a interface.
  const versao = useRef(0);

  // Quando o servidor confirma e a página recarrega os dados, eles mandam.
  useEffect(() => setEstadoLocal(estado), [estado]);

  async function alternar() {
    const anterior = estadoLocal;
    const guardando = anterior === null;
    const minhaVersao = ++versao.current;

    setEstadoLocal(guardando ? "semente" : null);
    avisar(guardando ? "Obra guardada na Carteira." : "Obra removida da Carteira.", {
      tom: guardando ? "sucesso" : "neutro",
    });

    const resultado = await (guardando ? guardarObra(obraId) : removerObra(obraId)).catch(() => ERRO_CONEXAO);

    if (!resultado.ok && minhaVersao === versao.current) {
      setEstadoLocal(anterior);
      avisar(resultado.erro, { tom: "erro", acao: { rotulo: "Tentar de novo", onClick: alternar } });
    }
  }

  if (!estadoLocal) {
    return (
      <Botao tamanho="sm" onClick={alternar} icone={<Landmark className="h-3.5 w-3.5" aria-hidden />}>
        Guardar na Carteira
      </Botao>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="t-nota">Na sua Carteira:</span>
      <SeloEstadoObra estado={estadoLocal} />
      <Botao tamanho="sm" variante="secundario" onClick={alternar}>
        Remover da Carteira
      </Botao>
    </div>
  );
}
