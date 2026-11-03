import type { Metadata } from "next";
import { PaginaEspecial } from "@/components/ui/pagina-especial";

export const metadata: Metadata = { title: "Página não encontrada" };

// 404 para endereços que não existem (fora das telas com login).
export default function NaoEncontrada() {
  return (
    <main id="conteudo" className="min-h-dvh bg-canvas px-gutter">
      <PaginaEspecial
        marcador="404"
        titulo="Esta página não existe"
        texto="O endereço pode ter mudado ou ter sido digitado de outro jeito. As obras, funções e épocas continuam no lugar de sempre."
      />
    </main>
  );
}
