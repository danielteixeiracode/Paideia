import { cn } from "@/lib/utils";
import { descreverProgresso } from "@/lib/progresso-funcoes";

// Filete de progresso: uma régua de 1px que se enche em dourado (3px), sem número
// escrito. Enche uma vez ao aparecer (movimento discreto); com movimento
// reduzido, aparece pronto. Com `rotulo`, é anunciado como imagem; sem ele,
// é decorativo e quem usa diz o valor em texto.
export function FileteProgresso({ valor, rotulo, className }: { valor: number; rotulo?: string; className?: string }) {
  const v = Math.min(1, Math.max(0, valor));
  return (
    <span
      {...(rotulo ? { role: "img", "aria-label": `${rotulo}: ${descreverProgresso(v)}` } : { "aria-hidden": true })}
      className={cn("relative block h-[3px]", className)}
    >
      {/* Trilho: régua de 1px, para o vazio parecer vazio. */}
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-rule-strong/40" />
      <span className="filete-encher absolute inset-0 origin-left rounded-full bg-gold-ink" style={{ transform: `scaleX(${v})` }} />
    </span>
  );
}
