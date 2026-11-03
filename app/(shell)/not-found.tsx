import { PaginaEspecial } from "@/components/ui/pagina-especial";

// 404 dentro do app (por exemplo, uma obra que não existe ou foi despublicada):
// a moldura do app continua, e o caminho de volta também.
export default function NaoEncontradaNoApp() {
  return (
    <PaginaEspecial
      marcador="404"
      titulo="Não encontramos o que você procurava"
      texto="Esta obra, função ou época não existe ou não está publicada. Volte ao Início ou use a busca (Ctrl K)."
    />
  );
}
