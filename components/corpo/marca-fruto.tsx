import { cn, romano } from "@/lib/utils";

// Marca de um fruto na Carteira. Por enquanto, só o romano da função em que
// o fruto nasceu.
//
// EM ABERTO (CLAUDE.md, "Símbolo visual do ativo/fruto na Carteira"): quando
// o Daniel definir o símbolo do fruto, ele entra aqui, ao lado ou no lugar do
// romano, e passa a valer em todo lugar que mostra um fruto. Não inventar
// ícone antes disso.
export function MarcaFruto({ numeroFuncao, className }: { numeroFuncao: number | null; className?: string }) {
  return (
    <span aria-hidden className={cn("t-romano inline-block w-8 shrink-0 text-nota text-gold-ink", className)}>
      {numeroFuncao ? romano(numeroFuncao) : ""}
    </span>
  );
}
