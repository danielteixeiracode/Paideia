"use client";

import { PaginaEspecial } from "@/components/ui/pagina-especial";
import { Botao } from "@/components/ui/botao";

// Erro fora das telas com login (por exemplo, no login).
export default function Erro({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="conteudo" className="min-h-dvh bg-canvas px-gutter">
      <PaginaEspecial
        marcador="Erro"
        titulo="Esta página não abriu"
        texto="Algo falhou ao carregar. Tente de novo em instantes."
        acao={<Botao onClick={reset}>Tentar de novo</Botao>}
      />
    </main>
  );
}
