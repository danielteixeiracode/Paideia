import { Esqueleto, EsqueletoLista } from "@/components/ui/esqueleto";

// Enquanto as épocas carregam: cabeçalho e a linha do tempo.
export default function CarregandoEpocas() {
  return (
    <div className="space-y-12">
      <div>
        <Esqueleto className="h-3 w-40" />
        <Esqueleto className="mt-4 h-12 w-52" />
        <Esqueleto className="mt-4 h-5 w-full max-w-xl" />
      </div>
      <EsqueletoLista itens={7} rotulo="Carregando as épocas" />
    </div>
  );
}
