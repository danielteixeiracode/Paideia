import { Esqueleto } from "@/components/ui/esqueleto";

// Enquanto o formulário do exercício carrega.
export default function CarregandoFormularioExercicio() {
  return (
    <div role="status" aria-busy="true" className="space-y-8">
      <span className="sr-only">Carregando o formulário</span>
      <div>
        <Esqueleto className="h-4 w-28" />
        <Esqueleto className="mt-3 h-9 w-64 max-w-full" />
      </div>
      <Esqueleto className="h-11 w-full" />
      <div className="max-w-3xl space-y-5">
        <Esqueleto className="h-16 w-full" />
        <div className="grid gap-5 lg:grid-cols-2">
          <Esqueleto className="h-16 w-full" />
          <Esqueleto className="h-16 w-full" />
        </div>
        <Esqueleto className="h-28 w-full" />
        <Esqueleto className="h-72 w-full" />
      </div>
    </div>
  );
}
