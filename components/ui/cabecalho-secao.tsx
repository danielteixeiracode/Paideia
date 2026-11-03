import { romano } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Abertura de seção do códice: algarismo romano com filete, e o título logo
// abaixo. Nunca um rótulo pequeno acima do título (eyebrow).
export function CabecalhoSecao({
  numero,
  titulo,
  descricao,
  nivel = 2,
  acao,
  className,
}: {
  numero: number;
  titulo: string;
  descricao?: string;
  nivel?: 2 | 3;
  acao?: React.ReactNode;
  className?: string;
}) {
  const Titulo = nivel === 2 ? "h2" : "h3";
  return (
    <header className={cn("space-y-2", className)}>
      <div className="marcador" aria-hidden>
        {romano(numero)}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <Titulo className="t-subtitulo">{titulo}</Titulo>
          {descricao && <p className="t-nota mt-1 max-w-leitura">{descricao}</p>}
        </div>
        {acao}
      </div>
    </header>
  );
}
