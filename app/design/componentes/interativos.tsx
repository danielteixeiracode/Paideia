"use client";

import { useState } from "react";
import { Botao } from "@/components/ui/botao";
import { CampoTexto } from "@/components/ui/campo";
import { Dialogo, Gaveta } from "@/components/ui/sobreposicao";
import { useAviso } from "@/components/ui/aviso";

// Os componentes que só existem em uso: gaveta, diálogo, aviso e carregamento.
// Gaveta, diálogo e aviso seguem o tema da página (seletor no topo).
export function DemosInterativos() {
  const avisar = useAviso();
  const [gaveta, setGaveta] = useState(false);
  const [dialogo, setDialogo] = useState(false);
  const [carregando, setCarregando] = useState(false);

  function simularEnvio() {
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      avisar("Obra guardada na Carteira.", { tom: "sucesso" });
    }, 1500);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Botao variante="secundario" onClick={() => setGaveta(true)}>
        Abrir gaveta
      </Botao>
      <Botao variante="secundario" onClick={() => setDialogo(true)}>
        Abrir diálogo
      </Botao>
      <Botao variante="secundario" onClick={() => avisar("Alterações salvas.")}>
        Aviso neutro
      </Botao>
      <Botao variante="secundario" onClick={() => avisar("Obra guardada na Carteira.", { tom: "sucesso" })}>
        Aviso de sucesso
      </Botao>
      <Botao
        variante="secundario"
        onClick={() =>
          avisar("Não foi possível guardar a obra. Verifique a conexão.", {
            tom: "erro",
            acao: { rotulo: "Tentar de novo", onClick: simularEnvio },
          })
        }
      >
        Aviso de erro
      </Botao>
      <Botao carregando={carregando} onClick={simularEnvio}>
        {carregando ? "Guardando" : "Guardar (simula carregamento)"}
      </Botao>

      <Gaveta
        aberta={gaveta}
        onFechar={() => setGaveta(false)}
        titulo="Gaveta"
        descricao="Foco preso dentro dela; Esc ou clique fora fecham, e o foco volta ao botão."
        rodape={
          <div className="flex justify-end gap-2">
            <Botao variante="discreto" onClick={() => setGaveta(false)}>
              Cancelar
            </Botao>
            <Botao onClick={() => setGaveta(false)}>Salvar</Botao>
          </div>
        }
      >
        <div className="space-y-4">
          <CampoTexto rotulo="Título" placeholder="Eneida" />
          <CampoTexto rotulo="Autor" ajuda="Como aparece na ficha da obra." />
        </div>
      </Gaveta>

      <Dialogo
        aberto={dialogo}
        onFechar={() => setDialogo(false)}
        alerta
        titulo="Remover da Carteira?"
        descricao="A obra sai da sua Carteira. Os frutos dela continuam guardados."
        acoes={
          <>
            <Botao variante="discreto" onClick={() => setDialogo(false)}>
              Cancelar
            </Botao>
            <Botao
              onClick={() => {
                setDialogo(false);
                avisar("Obra removida da Carteira.");
              }}
            >
              Remover
            </Botao>
          </>
        }
      />
    </div>
  );
}
