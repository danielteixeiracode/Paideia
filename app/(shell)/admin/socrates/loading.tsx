import { Esqueleto } from "@/components/ui/esqueleto";

// Enquanto a configuração do Sócrates carrega.
export default function CarregandoConfigSocrates() {
  return (
    <div role="status" aria-busy="true" className="space-y-8">
      <span className="sr-only">Carregando a configuração</span>
      <div>
        <Esqueleto className="h-9 w-72 max-w-full" />
        <Esqueleto className="mt-3 h-4 w-96 max-w-full" />
      </div>
      <Esqueleto className="h-11 w-full" />
      <div className="max-w-3xl space-y-5">
        <Esqueleto className="h-80 w-full" />
        <div className="grid gap-5 sm:grid-cols-3">
          <Esqueleto className="h-16 w-full" />
          <Esqueleto className="h-16 w-full" />
          <Esqueleto className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}
