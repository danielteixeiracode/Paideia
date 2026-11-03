import { Esqueleto, EsqueletoLista } from "@/components/ui/esqueleto";

// Enquanto a lista de obras do admin carrega.
export default function CarregandoAdminObras() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Esqueleto className="h-9 w-40" />
          <Esqueleto className="mt-3 h-4 w-72 max-w-full" />
        </div>
        <Esqueleto className="h-10 w-32" />
      </div>
      <Esqueleto className="h-11 w-full" />
      <EsqueletoLista itens={5} rotulo="Carregando as obras" />
    </div>
  );
}
