import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/data/session";
import { ExercicioItem } from "@/components/corpo/exercicio-item";
import { ContextoTela } from "@/components/socrates/contexto-tela";
import { CarteiraBotao } from "@/components/corpo/carteira-botao";
import { Colunata, type FuncaoColunata } from "@/components/corpo/colunata";
import { TituloBloco } from "@/components/ui/titulo-bloco";
import { romano } from "@/lib/utils";
import type { Exercicio } from "@/types/database";

type ObraFicha = {
  id: string;
  titulo: string;
  autor: string | null;
  descricao: string | null;
  epoca: { id: string; numero: number; nome: string } | null;
};
type FuncaoDaObra = FuncaoColunata & { nota: string | null };
type ExercicioComFuncao = Exercicio & { funcao: FuncaoColunata | null };

export default async function ObraPage({ params }: { params: { id: string } }) {
  const { supabase, perfil } = await requirePerfil();

  const { data } = await supabase
    .from("obras")
    .select("id, titulo, autor, descricao, epoca:epocas(id, numero, nome)")
    .eq("id", params.id)
    .eq("ativo", true)
    .maybeSingle();
  if (!data) notFound();
  const obra = data as unknown as ObraFicha;

  const [ligacoesR, carteiraR, todasR] = await Promise.all([
    supabase.from("obra_funcoes").select("nota, funcao:funcoes_pedagogicas(id, numero, nome)").eq("obra_id", obra.id),
    supabase.from("carteira_obras").select("estado").eq("user_id", perfil.id).eq("obra_id", obra.id).maybeSingle(),
    supabase.from("funcoes_pedagogicas").select("id, numero, nome").order("numero"),
  ]);

  const funcoes: FuncaoDaObra[] = ((ligacoesR.data ?? []) as unknown as { nota: string | null; funcao: FuncaoColunata | null }[])
    .filter((l) => l.funcao)
    .map((l) => ({ ...l.funcao!, nota: l.nota }))
    .sort((a, b) => a.numero - b.numero);
  const todasFuncoes = (todasR.data ?? []) as FuncaoColunata[];

  // Exercícios pertencem à função: entram os gerais das funções desta obra
  // e os escritos especificamente para ela.
  const funcaoIds = funcoes.map((f) => f.id);
  const filtro = funcaoIds.length
    ? `obra_id.eq.${obra.id},and(obra_id.is.null,funcao_id.in.(${funcaoIds.join(",")}))`
    : `obra_id.eq.${obra.id}`;
  const { data: exerciciosData } = await supabase
    .from("exercicios")
    .select("*, funcao:funcoes_pedagogicas(id, numero, nome)")
    .eq("ativo", true)
    .or(filtro)
    .order("ordem");
  const exercicios = (exerciciosData ?? []) as unknown as ExercicioComFuncao[];

  // Um bloco por função da obra (mais as de exercícios só desta obra, se houver).
  const grupos = new Map<string, { funcao: FuncaoColunata; nota: string | null; exercicios: ExercicioComFuncao[] }>();
  for (const f of funcoes) grupos.set(f.id, { funcao: f, nota: f.nota, exercicios: [] });
  for (const e of exercicios) {
    if (!e.funcao) continue;
    if (!grupos.has(e.funcao_id)) grupos.set(e.funcao_id, { funcao: e.funcao, nota: null, exercicios: [] });
    grupos.get(e.funcao_id)!.exercicios.push(e);
  }
  const blocos = Array.from(grupos.values()).sort((a, b) => a.funcao.numero - b.funcao.numero);

  return (
    <article className="space-y-12">
      <ContextoTela tipo="obra" id={obra.id} />

      <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <div className="marcador max-w-md" aria-hidden>
            {obra.epoca ? romano(obra.epoca.numero) : "II"}
          </div>
          {obra.epoca && <p className="sr-only">Época {obra.epoca.numero}: {obra.epoca.nome}</p>}
          <h1 className="t-display mt-3">{obra.titulo}</h1>
          {obra.autor && <p className="t-leitura mt-2 text-ink-muted">{obra.autor}</p>}
          {obra.descricao && <p className="t-leitura mt-5">{obra.descricao}</p>}
        </div>
        <div className="flex flex-col items-start gap-6 lg:items-end">
          <CarteiraBotao obraId={obra.id} estado={(carteiraR.data as { estado: string } | null)?.estado ?? null} />
          {todasFuncoes.length > 0 && (
            <Colunata funcoes={todasFuncoes} acesas={new Set(funcaoIds)} tamanho="grande" />
          )}
        </div>
      </header>

      <section aria-labelledby="forma-titulo" className="space-y-8">
        <TituloBloco titulo="O que esta obra forma" grande id="forma-titulo" />
        {blocos.length === 0 ? (
          <p className="t-corpo text-ink-muted">
            Esta obra ainda não foi ligada a nenhuma função pedagógica. Quando for, cada função aparece aqui com seus exercícios.
          </p>
        ) : (
          blocos.map(({ funcao, nota, exercicios }) => (
            <section key={funcao.id} aria-labelledby={`funcao-${funcao.id}`} className="grid gap-x-8 gap-y-3 md:grid-cols-[12rem_minmax(0,1fr)]">
              <div>
                <p aria-hidden className="t-romano text-titulo leading-none text-gold-ink">
                  {romano(funcao.numero)}
                </p>
                <h3 id={`funcao-${funcao.id}`} className="mt-2 font-serif text-lg font-medium leading-snug text-ink">
                  <Link href={`/funcoes/${funcao.id}`} className="underline-offset-4 hover:underline">
                    <span className="sr-only">Função {funcao.numero}: </span>
                    {funcao.nome}
                  </Link>
                </h3>
              </div>
              <div className="min-w-0 border-t-hair border-rule-strong/40 pt-3 md:border-l-hair md:border-t-0 md:pl-8 md:pt-0">
                {nota && <p className="t-leitura">{nota}</p>}
                {exercicios.length === 0 ? (
                  <p className={nota ? "t-nota mt-3" : "t-nota"}>Ainda não há exercícios desta função.</p>
                ) : (
                  <ul className={nota ? "mt-3 divide-y-hair divide-rule-strong/40" : "divide-y-hair divide-rule-strong/40"}>
                    {exercicios.map((e) => (
                      <ExercicioItem key={e.id} exercicio={e} especifico={e.obra_id === obra.id} />
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))
        )}
      </section>

      <section className="space-y-4">
        <TituloBloco titulo="Ligações" grande />
        {!obra.epoca && funcoes.length === 0 ? (
          <p className="t-corpo text-ink-muted">Esta obra ainda não tem época nem funções ligadas.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {obra.epoca && (
              <li>
                <Ligacao href={`/epocas/${obra.epoca.id}`} tipo="Época" numero={obra.epoca.numero} nome={obra.epoca.nome} />
              </li>
            )}
            {funcoes.map((f) => (
              <li key={f.id}>
                <Ligacao href={`/funcoes/${f.id}`} tipo="Função" numero={f.numero} nome={f.nome} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}

// Cartão pequeno de ligação: romano, tipo e nome.
function Ligacao({ href, tipo, numero, nome }: { href: string; tipo: string; numero: number; nome: string }) {
  return (
    <Link
      href={href}
      className="group flex h-full items-start gap-3 rounded-xl border border-rule bg-surface p-4 transition-colors duration-discreto ease-discreto hover:border-rule-strong/70 hover:bg-sunken"
    >
      <span aria-hidden className="t-romano w-8 shrink-0 text-subtitulo leading-none text-gold-ink">
        {romano(numero)}
      </span>
      <span className="min-w-0">
        <span className="t-nota block">{tipo}</span>
        <span className="block text-interface font-semibold text-ink group-hover:underline group-hover:underline-offset-4">{nome}</span>
      </span>
    </Link>
  );
}
