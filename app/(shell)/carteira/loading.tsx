import { Esqueleto, EsqueletoGrade, EsqueletoLista } from "@/components/ui/esqueleto";

// Enquanto a Carteira carrega: cabeçalho, sementes e frutos.
export default function CarregandoCarteira() {
  return (
    <div className="space-y-12">
      <div>
        <Esqueleto className="h-3 w-40" />
        <Esqueleto className="mt-4 h-12 w-52" />
        <Esqueleto className="mt-4 h-5 w-full max-w-md" />
      </div>
      <EsqueletoGrade itens={3} rotulo="Carregando a Carteira" />
      <EsqueletoLista itens={3} />
    </div>
  );
}
