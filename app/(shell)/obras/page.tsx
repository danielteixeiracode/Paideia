import Link from "next/link";
import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow, Badge, EmptyState } from "@/components/ui/primitives";
import { romano } from "@/lib/utils";
import type { Epoca, FuncaoPedagogica, Obra } from "@/types/database";

type ObraLista = Obra & {
  epoca: Epoca | null;
  obra_funcoes: { funcao: FuncaoPedagogica | null }[];
};

export default async function ObrasPage() {
  const { supabase } = await requirePerfil();

  const { data } = await supabase
    .from("obras")
    .select("*, epoca:epocas(*), obra_funcoes(funcao:funcoes_pedagogicas(*))")
    .eq("ativo", true)
    .order("ordem")
    .order("titulo");

  const obras = (data ?? []) as unknown as ObraLista[];

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Formação universal</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Obras</h1>
      </div>

      {obras.length === 0 ? (
        <EmptyState
          titulo="Nenhuma obra publicada ainda"
          descricao="As obras da formação aparecem aqui assim que forem cadastradas."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {obras.map((obra) => {
            const funcoes = obra.obra_funcoes
              .map((l) => l.funcao)
              .filter((f): f is FuncaoPedagogica => !!f)
              .sort((a, b) => a.numero - b.numero);
            return (
              <Link key={obra.id} href={`/obras/${obra.id}`} className="block">
                <Card className="h-full transition hover:border-paideia-gold-400">
                  {obra.epoca && (
                    <Eyebrow>
                      {romano(obra.epoca.numero)} • {obra.epoca.nome}
                    </Eyebrow>
                  )}
                  <p className="mt-1 font-serif text-lg font-semibold">{obra.titulo}</p>
                  {obra.autor && <p className="text-sm text-paideia-ink/60">{obra.autor}</p>}
                  {funcoes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {funcoes.map((f) => (
                        <Badge key={f.id}>{f.nome}</Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
