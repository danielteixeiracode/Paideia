import { Esqueleto, EsqueletoLista } from "@/components/ui/esqueleto";

// Enquanto a administração carrega (visão geral e telas sem esqueleto próprio).
export default function CarregandoAdmin() {
  return (
    <div className="space-y-10">
      <div>
        <Esqueleto className="h-3 w-40" />
        <Esqueleto className="mt-4 h-9 w-56" />
      </div>
      <Esqueleto className="h-11 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Esqueleto key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
      <EsqueletoLista itens={4} rotulo="Carregando a administração" />
    </div>
  );
}
