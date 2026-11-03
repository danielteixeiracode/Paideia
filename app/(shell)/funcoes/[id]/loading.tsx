import { Esqueleto, EsqueletoGrade, EsqueletoLista } from "@/components/ui/esqueleto";

// Enquanto a função carrega: cabeçalho com a coluna, obras e exercícios.
export default function CarregandoFuncao() {
  return (
    <div className="space-y-12">
      <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <Esqueleto className="h-3 w-40" />
          <Esqueleto className="mt-4 h-12 w-full max-w-lg" />
          <Esqueleto className="mt-4 h-5 w-full max-w-xl" />
        </div>
        <Esqueleto className="mx-auto h-44 w-16" />
      </div>
      <EsqueletoGrade itens={3} rotulo="Carregando a função" />
      <EsqueletoLista itens={3} />
    </div>
  );
}
