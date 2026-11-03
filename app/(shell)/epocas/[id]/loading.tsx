import { Esqueleto, EsqueletoGrade } from "@/components/ui/esqueleto";

// Enquanto a época carrega: cabeçalho e as obras.
export default function CarregandoEpoca() {
  return (
    <div className="space-y-12">
      <div>
        <Esqueleto className="h-3 w-40" />
        <Esqueleto className="mt-4 h-12 w-full max-w-md" />
        <Esqueleto className="mt-4 h-5 w-full max-w-xl" />
      </div>
      <EsqueletoGrade itens={3} rotulo="Carregando a época" />
    </div>
  );
}
