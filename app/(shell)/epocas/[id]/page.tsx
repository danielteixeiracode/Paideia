import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow, EmptyState } from "@/components/ui/primitives";
import { romano } from "@/lib/utils";
import { ContextoTela } from "@/components/socrates/contexto-tela";
import type { Epoca, Obra } from "@/types/database";

export default async function EpocaPage({ params }: { params: { id: string } }) {
  const { supabase } = await requirePerfil();

  const { data } = await supabase.from("epocas").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const epoca = data as Epoca;

  const { data: obrasData } = await supabase
    .from("obras")
    .select("*")
    .eq("epoca_id", epoca.id)
    .eq("ativo", true)
    .order("ordem")
    .order("titulo");
  const obras = (obrasData ?? []) as Obra[];

  return (
    <div className="space-y-6">
      <ContextoTela tipo="epoca" id={epoca.id} />
      <div>
        <Link href="/epocas" className="text-xs font-semibold text-accent hover:underline">
          ← Épocas
        </Link>
        <Eyebrow className="mt-3">Época {romano(epoca.numero)}</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">{epoca.nome}</h1>
        {epoca.descricao && <p className="mt-2 max-w-2xl text-sm text-ink/70">{epoca.descricao}</p>}
      </div>

      <section className="space-y-3">
        <p className="font-serif text-lg font-semibold">Obras desta época</p>
        {obras.length === 0 ? (
          <EmptyState titulo="Nenhuma obra desta época ainda" />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {obras.map((obra) => (
              <li key={obra.id}>
                <Link href={`/obras/${obra.id}`} className="block">
                  <Card className="h-full transition hover:border-paideia-gold-400">
                    <p className="font-serif text-base font-semibold">{obra.titulo}</p>
                    {obra.autor && <p className="text-sm text-ink/60">{obra.autor}</p>}
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
