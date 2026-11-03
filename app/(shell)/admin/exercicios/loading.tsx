import { Esqueleto, EsqueletoLista } from "@/components/ui/esqueleto";

// Enquanto a lista de exercícios do admin carrega.
export default function CarregandoAdminExercicios() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Esqueleto className="h-9 w-48" />
          <Esqueleto className="mt-3 h-4 w-80 max-w-full" />
        </div>
        <Esqueleto className="h-10 w-40" />
      </div>
      <Esqueleto className="h-11 w-full" />
      <EsqueletoLista itens={5} rotulo="Carregando os exercícios" />
    </div>
  );
}
