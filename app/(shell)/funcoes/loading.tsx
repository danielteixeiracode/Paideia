import { Esqueleto, EsqueletoLista } from "@/components/ui/esqueleto";

// Enquanto as funções carregam: cabeçalho, eventos por função e a lista.
export default function CarregandoFuncoes() {
  return (
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
        <div>
          <Esqueleto className="h-3 w-40" />
          <Esqueleto className="mt-4 h-12 w-56" />
          <Esqueleto className="mt-4 h-5 w-full max-w-xl" />
        </div>
        <EsqueletoLista itens={7} rotulo="Carregando seus eventos" />
      </div>
      <EsqueletoLista itens={7} rotulo="Carregando as funções" />
    </div>
  );
}
