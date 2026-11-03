import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type VarianteBotao = "primario" | "secundario" | "discreto";
export type TamanhoBotao = "md" | "sm";

const BASE =
  "inline-flex select-none items-center justify-center gap-2 rounded-xl font-sans font-semibold transition-colors duration-discreto ease-discreto active:translate-y-px disabled:pointer-events-none aria-busy:pointer-events-none [@media(pointer:coarse)]:min-h-11";

const VARIANTES: Record<VarianteBotao, string> = {
  primario: "bg-action text-on-action hover:bg-action-hover active:bg-action-hover disabled:bg-muted disabled:text-ink-muted",
  secundario:
    "border border-accent/50 bg-transparent text-accent hover:border-accent hover:bg-accent/[0.06] active:bg-accent/10 disabled:border-rule disabled:text-ink-muted",
  discreto: "bg-transparent text-accent underline-offset-4 hover:underline active:bg-accent/10 disabled:text-ink-muted",
};

const TAMANHOS: Record<TamanhoBotao, string> = {
  md: "min-h-10 px-4 py-2 text-interface",
  sm: "min-h-8 px-3 py-1.5 text-nota",
};

// Classes do botão, para aplicar o mesmo visual a um <Link>.
export function classesBotao({
  variante = "primario",
  tamanho = "md",
  className,
}: { variante?: VarianteBotao; tamanho?: TamanhoBotao; className?: string } = {}) {
  return cn(BASE, VARIANTES[variante], TAMANHOS[tamanho], variante === "discreto" && "px-2", className);
}

export interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
  // Enquanto carrega: fica inativo, anuncia aria-busy e mostra o indicador.
  carregando?: boolean;
  icone?: React.ReactNode;
}

export const Botao = forwardRef<HTMLButtonElement, BotaoProps>(function Botao(
  { variante = "primario", tamanho = "md", carregando = false, icone, className, children, disabled, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      className={classesBotao({ variante, tamanho, className })}
      {...props}
    >
      {carregando ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden /> : icone}
      {children}
    </button>
  );
});
