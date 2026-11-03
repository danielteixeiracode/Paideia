import Link from "next/link";
import { requirePerfil } from "@/lib/data/session";
import { cn, romano } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Épocas" };

type Epoca = { id: string; numero: number; nome: string };

export default async function EpocasPage() {
  const { supabase, perfil } = await requirePerfil();

  // Pela sessão do aluno (RLS): obras publicadas e a Carteira dele.
  const [epocasR, obrasR, carteiraR] = await Promise.all([
    supabase.from("epocas").select("id, numero, nome").order("numero"),
    supabase.from("obras").select("epoca_id").eq("ativo", true).not("epoca_id", "is", null),
    supabase.from("carteira_obras").select("obra:obras(epoca_id)").eq("user_id", perfil.id),
  ]);

  const epocas = (epocasR.data ?? []) as Epoca[];
  const obrasPorEpoca = new Map<string, number>();
  for (const o of (obrasR.data ?? []) as { epoca_id: string }[]) {
    obrasPorEpoca.set(o.epoca_id, (obrasPorEpoca.get(o.epoca_id) ?? 0) + 1);
  }
  const naCarteira = new Set(
    ((carteiraR.data ?? []) as unknown as { obra: { epoca_id: string | null } | null }[])
      .map((c) => c.obra?.epoca_id)
      .filter(Boolean)
  );

  return (
    <div className="space-y-12">
      <header>
        <div className="marcador max-w-md" aria-hidden>
          IV
        </div>
        <h1 className="t-display mt-3">Épocas</h1>
        <p className="t-leitura mt-3 text-ink-muted">
          O eixo do tempo da formação, de Roma ao Império Brasileiro. Em dourado, as épocas das obras da sua Carteira.
        </p>
      </header>

      {epocas.length === 0 ? (
        <div className="filete py-10 text-center">
          <p className="t-subtitulo">Nenhuma época cadastrada</p>
          <p className="t-nota mt-1">As épocas ainda não foram carregadas no banco.</p>
        </div>
      ) : (
        // Linha do tempo: horizontal a partir de 768px (o filete corre atrás dos
        // marcos); no celular, lista vertical com o filete à esquerda.
        <div className="relative">
          <span aria-hidden className="absolute bottom-0 left-[1.375rem] top-0 border-l-hair border-rule-strong/60 md:hidden" />
          <span aria-hidden className="absolute inset-x-0 top-[2.125rem] hidden border-t-hair border-rule-strong/60 md:block" />
          <ol className="relative grid gap-0 md:grid-cols-7 md:gap-3">
          {epocas.map((e) => {
            const dourada = naCarteira.has(e.id);
            const obras = obrasPorEpoca.get(e.id) ?? 0;
            return (
              <li key={e.id} className="relative">
                <Link
                  href={`/epocas/${e.id}`}
                  className="group flex items-start gap-4 rounded-md py-3 transition-colors duration-discreto ease-discreto hover:bg-sunken md:flex-col md:items-center md:gap-3 md:px-1 md:text-center"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "t-romano relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-nota",
                      dourada ? "border-gold-ink/70 bg-surface font-semibold text-gold-ink ring-2 ring-gold/40" : "border-rule bg-surface text-ink"
                    )}
                  >
                    {romano(e.numero)}
                  </span>
                  <span className="min-w-0 pt-1 md:pt-0">
                    <span className="block font-serif text-lg font-medium leading-snug text-ink group-hover:underline group-hover:decoration-rule-strong group-hover:underline-offset-4">
                      <span className="sr-only">Época {e.numero}: </span>
                      {e.nome}
                    </span>
                    <span className="t-nota mt-1 block">
                      {obras === 0 ? "Nenhuma obra ainda" : obras === 1 ? "1 obra" : `${obras} obras`}
                      {dourada && <span className="sr-only">, com obra na sua Carteira</span>}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
          </ol>
        </div>
      )}
    </div>
  );
}
