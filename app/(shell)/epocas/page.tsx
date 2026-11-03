import Link from "next/link";
import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow, EmptyState } from "@/components/ui/primitives";
import { romano } from "@/lib/utils";
import type { Epoca } from "@/types/database";

export default async function EpocasPage() {
  const { supabase } = await requirePerfil();

  const { data } = await supabase
    .from("epocas")
    .select("*, obras(count)")
    .order("numero");

  const epocas = (data ?? []) as unknown as (Epoca & { obras: { count: number }[] })[];

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>O eixo do tempo</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Épocas</h1>
      </div>

      {epocas.length === 0 ? (
        <EmptyState titulo="Nenhuma época cadastrada" descricao="As épocas ainda não foram carregadas no banco." />
      ) : (
        <ol className="space-y-3">
          {epocas.map((e) => (
            <li key={e.id}>
              <Link href={`/epocas/${e.id}`} className="block">
                <Card className="flex items-center gap-4 transition hover:border-paideia-gold-400">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paideia-green-900 font-serif text-sm font-bold text-paideia-gold-300">
                    {romano(e.numero)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-lg font-semibold">{e.nome}</p>
                    {e.descricao && <p className="text-sm text-ink/60">{e.descricao}</p>}
                  </div>
                  <span className="shrink-0 text-xs text-ink/50">{e.obras[0]?.count ?? 0} obras</span>
                </Card>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
