import Link from "next/link";
import { FileteProgresso } from "@/components/ui/filete-progresso";
import { nomeCurtoFuncao, progressoFuncao } from "@/lib/progresso-funcoes";
import { cn, romano } from "@/lib/utils";

export type FuncaoComEventos = { id: string; numero: number; nome: string; eventos: number };

// As sete funções, uma por linha: romano, nome curto, filete que se enche
// com os eventos do aluno e a contagem. Cada linha leva à função.
export function ProgressoFuncoes({ funcoes, className }: { funcoes: FuncaoComEventos[]; className?: string }) {
  return (
    <ol className={cn("divide-y-hair divide-rule-strong/40", className)}>
      {funcoes.map((f) => (
        <li key={f.id}>
          <Link
            href={`/funcoes/${f.id}`}
            title={f.nome}
            aria-label={`Função ${f.numero}: ${f.nome}, ${f.eventos === 1 ? "1 evento" : `${f.eventos} eventos`}`}
            className="group grid min-h-11 grid-cols-[2.25rem_minmax(0,1fr)_2rem] items-baseline gap-x-3 rounded-md py-2 transition-colors duration-discreto ease-discreto hover:bg-sunken sm:px-1"
          >
            <span aria-hidden className="t-romano text-interface text-gold-ink">
              {romano(f.numero)}
            </span>
            <span aria-hidden className="min-w-0">
              <span className="block truncate text-interface text-ink group-hover:underline group-hover:underline-offset-4">
                {nomeCurtoFuncao(f)}
              </span>
              <FileteProgresso valor={progressoFuncao(f.eventos)} className="mt-1.5" />
            </span>
            <span aria-hidden className="text-right text-nota tabular-nums text-ink-muted">
              {f.eventos}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
