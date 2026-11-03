import { Esqueleto, EsqueletoGrade } from "@/components/ui/esqueleto";

// Enquanto a próxima tela carrega, a moldura do app fica e o conteúdo é
// substituído por um esqueleto: nunca uma tela em branco.
export default function Carregando() {
  return (
    <div className="space-y-6">
      <div>
        <Esqueleto className="h-8 w-64 max-w-full" />
        <Esqueleto className="mt-3 h-4 w-96 max-w-full" />
      </div>
      <EsqueletoGrade itens={6} rotulo="Carregando a página" />
    </div>
  );
}
