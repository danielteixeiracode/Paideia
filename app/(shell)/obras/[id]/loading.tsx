import { Esqueleto, EsqueletoLista } from "@/components/ui/esqueleto";

// Enquanto a ficha carrega: cabeçalho, funções da obra e os blocos.
export default function CarregandoObra() {
  return (
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <Esqueleto className="h-3 w-40" />
          <Esqueleto className="mt-4 h-12 w-full max-w-md" />
          <Esqueleto className="mt-3 h-5 w-48" />
        </div>
        <Esqueleto className="h-11 w-48" />
      </div>
      <EsqueletoLista itens={3} rotulo="Carregando a obra" />
    </div>
  );
}
