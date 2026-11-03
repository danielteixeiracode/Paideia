import Link from "next/link";
import { cn } from "@/lib/utils";

// Título pequeno de bloco, aberto por filete, com atalho opcional para o
// membro correspondente. Não é eyebrow: é o próprio título do bloco.
export function TituloBloco({
  titulo,
  href,
  link,
  nivel = 2,
  grande = false,
  id,
  className,
}: {
  titulo: string;
  href?: string;
  link?: string;
  nivel?: 2 | 3;
  // Título de seção principal da página (serifa), em vez de título de bloco.
  grande?: boolean;
  id?: string;
  className?: string;
}) {
  const Titulo = nivel === 2 ? "h2" : "h3";
  return (
    <div className={cn("filete flex items-baseline justify-between gap-3 pt-3", className)}>
      <Titulo id={id} className={grande ? "t-subtitulo" : "text-interface font-semibold text-ink"}>
        {titulo}
      </Titulo>
      {href && link && (
        <Link href={href} className="t-nota text-accent underline-offset-4 hover:underline">
          {link}
        </Link>
      )}
    </div>
  );
}
