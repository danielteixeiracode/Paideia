import { cn } from "@/lib/utils";

// Cartão: superfície contornada, com a sombra de contato (mínima).
export function Cartao({
  as: Tag = "div",
  className,
  children,
}: {
  as?: "div" | "article" | "section" | "li";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag className={cn("rounded-2xl border border-rule bg-surface p-5 text-ink shadow-card", className)}>
      {children}
    </Tag>
  );
}

// Painel: região plana sobre o fundo, aberta por um filete de 0,5px, sem sombra.
export function Painel({
  titulo,
  className,
  children,
}: {
  titulo?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("filete pt-4 text-ink", className)}>
      {titulo && <h3 className="t-subtitulo mb-3">{titulo}</h3>}
      {children}
    </section>
  );
}
