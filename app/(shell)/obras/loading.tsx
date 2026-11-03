import { Esqueleto, EsqueletoGrade } from "@/components/ui/esqueleto";

// Enquanto a lista de obras carrega: o lugar do cabeçalho, dos filtros e da grade.
export default function CarregandoObras() {
  return (
    <div className="space-y-10">
      <div>
        <Esqueleto className="h-3 w-40" />
        <Esqueleto className="mt-4 h-12 w-48" />
        <Esqueleto className="mt-4 h-5 w-full max-w-xl" />
      </div>
      <div className="space-y-4">
        <Esqueleto className="h-10 w-full max-w-md" />
        <Esqueleto className="h-8 w-full max-w-3xl" />
        <Esqueleto className="h-8 w-full max-w-sm" />
      </div>
      <EsqueletoGrade itens={6} rotulo="Carregando as obras" />
    </div>
  );
}
