import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow, Badge, EmptyState } from "@/components/ui/primitives";
import { ExercicioItem } from "@/components/corpo/exercicio-item";
import { ContextoTela } from "@/components/socrates/contexto-tela";
import { romano } from "@/lib/utils";
import type { Epoca, Exercicio, FuncaoPedagogica, Obra } from "@/types/database";

type ExercicioComFuncao = Exercicio & { funcao: FuncaoPedagogica | null };

export default async function ObraPage({ params }: { params: { id: string } }) {
  const { supabase, perfil } = await requirePerfil();

  const { data } = await supabase
    .from("obras")
    .select("*, epoca:epocas(*)")
    .eq("id", params.id)
    .eq("ativo", true)
    .maybeSingle();
  if (!data) notFound();
  const obra = data as unknown as Obra & { epoca: Epoca | null };

  const [{ data: ligacoes }, { data: carteira }] = await Promise.all([
    supabase
      .from("obra_funcoes")
      .select("nota, funcao:funcoes_pedagogicas(*)")
      .eq("obra_id", obra.id),
    supabase
      .from("carteira_obras")
      .select("estado")
      .eq("user_id", perfil.id)
      .eq("obra_id", obra.id)
      .maybeSingle(),
  ]);

  const funcoes = ((ligacoes ?? []) as unknown as { nota: string | null; funcao: FuncaoPedagogica | null }[])
    .filter((l) => l.funcao)
    .map((l) => ({ ...l.funcao!, nota: l.nota }))
    .sort((a, b) => a.numero - b.numero);

  // Exercícios pertencem à função: entram os gerais das funções desta obra
  // e os escritos especificamente para ela.
  const funcaoIds = funcoes.map((f) => f.id);
  const filtro = funcaoIds.length
    ? `obra_id.eq.${obra.id},and(obra_id.is.null,funcao_id.in.(${funcaoIds.join(",")}))`
    : `obra_id.eq.${obra.id}`;
  const { data: exerciciosData } = await supabase
    .from("exercicios")
    .select("*, funcao:funcoes_pedagogicas(*)")
    .eq("ativo", true)
    .or(filtro)
    .order("ordem");
  const exercicios = (exerciciosData ?? []) as unknown as ExercicioComFuncao[];

  const grupos = new Map<string, { funcao: FuncaoPedagogica; nota: string | null; exercicios: ExercicioComFuncao[] }>();
  for (const f of funcoes) grupos.set(f.id, { funcao: f, nota: f.nota, exercicios: [] });
  for (const e of exercicios) {
    if (!e.funcao) continue;
    if (!grupos.has(e.funcao_id)) grupos.set(e.funcao_id, { funcao: e.funcao, nota: null, exercicios: [] });
    grupos.get(e.funcao_id)!.exercicios.push(e);
  }
  const listaGrupos = Array.from(grupos.values()).sort((a, b) => a.funcao.numero - b.funcao.numero);

  return (
    <div className="space-y-6">
      <ContextoTela tipo="obra" id={obra.id} />
      <div>
        <Link href="/obras" className="text-xs font-semibold text-paideia-green-800 hover:underline">
          ← Obras
        </Link>
        {obra.epoca && (
          <Eyebrow className="mt-3">
            <Link href={`/epocas/${obra.epoca.id}`} className="hover:underline">
              Época {romano(obra.epoca.numero)} • {obra.epoca.nome}
            </Link>
          </Eyebrow>
        )}
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">{obra.titulo}</h1>
        {obra.autor && <p className="mt-1 text-sm text-paideia-ink/60">{obra.autor}</p>}
        {carteira && (
          <div className="mt-3">
            <Link href="/carteira">
              <Badge tone="green">Na sua Carteira: {carteira.estado}</Badge>
            </Link>
          </div>
        )}
      </div>

      {obra.descricao && (
        <Card>
          <p className="text-sm leading-relaxed text-paideia-ink/80">{obra.descricao}</p>
        </Card>
      )}

      <section className="space-y-4">
        <p className="font-serif text-lg font-semibold">Funções pedagógicas e exercícios</p>
        {listaGrupos.length === 0 ? (
          <EmptyState
            titulo="Nenhuma função ligada a esta obra ainda"
            descricao="As funções e os exercícios aparecem aqui quando forem cadastrados."
          />
        ) : (
          listaGrupos.map(({ funcao, nota, exercicios }) => (
            <Card key={funcao.id}>
              <Link href={`/funcoes/${funcao.id}`} className="hover:underline">
                <Eyebrow>Função {funcao.numero}</Eyebrow>
                <p className="mt-0.5 font-serif text-lg font-semibold">{funcao.nome}</p>
              </Link>
              {nota && <p className="mt-1 text-sm text-paideia-ink/70">{nota}</p>}
              {exercicios.length === 0 ? (
                <p className="mt-3 text-sm text-paideia-ink/50">Nenhum exercício desta função ainda.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {exercicios.map((e) => (
                    <ExercicioItem
                      key={e.id}
                      exercicio={e}
                      funcao={e.funcao}
                      obra={e.obra_id === obra.id ? { id: obra.id, titulo: obra.titulo } : null}
                    />
                  ))}
                </ul>
              )}
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
