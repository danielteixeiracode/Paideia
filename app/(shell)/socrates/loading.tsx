import { Esqueleto, EsqueletoLista } from "@/components/ui/esqueleto";

// Enquanto o diálogo carrega: cabeçalho, consultas e a conversa.
export default function CarregandoSocrates() {
  return (
    <div className="space-y-6">
      <div>
        <Esqueleto className="h-3 w-40" />
        <Esqueleto className="mt-4 h-10 w-44" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <EsqueletoLista itens={4} rotulo="Carregando as consultas" className="hidden lg:block" />
        <div className="space-y-4 rounded-2xl border border-rule bg-surface p-6">
          <Esqueleto className="h-4 w-3/4" />
          <Esqueleto className="ml-auto h-10 w-1/2" />
          <Esqueleto className="h-4 w-2/3" />
          <Esqueleto className="mt-8 h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
