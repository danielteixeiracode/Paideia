"use client";

import { PaginaEspecial } from "@/components/ui/pagina-especial";
import { Botao } from "@/components/ui/botao";

// Erro numa tela do app: a moldura continua, e dá para tentar de novo.
export default function ErroNoApp({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PaginaEspecial
      marcador="Erro"
      titulo="Esta tela não abriu"
      texto="Algo falhou ao carregar. Tente de novo; se continuar, volte ao Início e abra a tela outra vez."
      acao={<Botao onClick={reset}>Tentar de novo</Botao>}
    />
  );
}
