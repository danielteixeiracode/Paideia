import { Esqueleto, EsqueletoLista } from "@/components/ui/esqueleto";

// Enquanto a lista de usuários carrega.
export default function CarregandoUsuarios() {
  return (
    <div className="space-y-8">
      <div>
        <Esqueleto className="h-9 w-40" />
        <Esqueleto className="mt-3 h-4 w-72 max-w-full" />
      </div>
      <Esqueleto className="h-11 w-full" />
      <Esqueleto className="h-10 w-full max-w-sm" />
      <EsqueletoLista itens={5} rotulo="Carregando os usuários" />
    </div>
  );
}
