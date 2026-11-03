import { cn } from "@/lib/utils";

// Bloco de carregamento: ocupa o lugar do conteúdo para não haver tela em
// branco. O pulso para sob movimento reduzido (regra global).
export function Esqueleto({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

// Anuncia o carregamento uma vez para leitores de tela.
function Carregando({ rotulo, className, children }: { rotulo: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{rotulo}</span>
      {children}
    </div>
  );
}

export function EsqueletoCartao({ className, rotulo = "Carregando" }: { className?: string; rotulo?: string }) {
  return (
    <Carregando rotulo={rotulo} className={cn("rounded-2xl border border-rule bg-surface p-5", className)}>
      <Esqueleto className="h-5 w-2/3" />
      <Esqueleto className="mt-2 h-4 w-1/3" />
      <Esqueleto className="mt-5 h-3 w-full" />
      <Esqueleto className="mt-2 h-3 w-5/6" />
    </Carregando>
  );
}

export function EsqueletoLista({ itens = 4, className, rotulo = "Carregando" }: { itens?: number; className?: string; rotulo?: string }) {
  return (
    <Carregando rotulo={rotulo} className={cn("divide-y divide-rule rounded-2xl border border-rule bg-surface", className)}>
      {Array.from({ length: itens }, (_, i) => (
        <div key={i} className="flex items-center gap-3 p-4">
          <Esqueleto className="h-9 w-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <Esqueleto className="h-4 w-1/2" />
            <Esqueleto className="mt-2 h-3 w-1/3" />
          </div>
        </div>
      ))}
    </Carregando>
  );
}

// Grade de cartões em carregamento, para listas como Obras e Funções.
export function EsqueletoGrade({ itens = 6, className, rotulo = "Carregando" }: { itens?: number; className?: string; rotulo?: string }) {
  return (
    <Carregando rotulo={rotulo} className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: itens }, (_, i) => (
        <div key={i} className="rounded-2xl border border-rule bg-surface p-5">
          <Esqueleto className="h-5 w-2/3" />
          <Esqueleto className="mt-2 h-4 w-1/3" />
          <Esqueleto className="mt-5 h-3 w-full" />
        </div>
      ))}
    </Carregando>
  );
}
