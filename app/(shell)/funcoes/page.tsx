import Link from "next/link";
import { requirePerfil } from "@/lib/data/session";
import { Templo, type ColunaTemplo } from "@/components/corpo/templo";
import { frontaoAceso, preenchimentoColuna } from "@/lib/templo";
import { romano } from "@/lib/utils";

type Funcao = { id: string; numero: number; nome: string; o_que_forma: string | null };

function plural(n: number, um: string, varios: string) {
  return `${n} ${n === 1 ? um : varios}`;
}

export default async function FuncoesPage() {
  const { supabase, perfil } = await requirePerfil();

  // Pela sessão do aluno (RLS): conteúdo publicado e os eventos dele.
  const [funcoesR, ligacoesR, exerciciosR, eventosR] = await Promise.all([
    supabase.from("funcoes_pedagogicas").select("id, numero, nome, o_que_forma").order("numero"),
    supabase.from("obra_funcoes").select("funcao_id, obra:obras(ativo)"),
    supabase.from("exercicios").select("funcao_id").eq("ativo", true),
    supabase.from("registro_eventos").select("funcao_id").eq("user_id", perfil.id).not("funcao_id", "is", null),
  ]);

  const contar = (linhas: { funcao_id: string }[]) => {
    const mapa = new Map<string, number>();
    for (const l of linhas) mapa.set(l.funcao_id, (mapa.get(l.funcao_id) ?? 0) + 1);
    return mapa;
  };
  const obrasPorFuncao = contar(
    ((ligacoesR.data ?? []) as unknown as { funcao_id: string; obra: { ativo: boolean } | null }[]).filter((l) => l.obra?.ativo)
  );
  const exerciciosPorFuncao = contar((exerciciosR.data ?? []) as { funcao_id: string }[]);
  const eventosPorFuncao = contar((eventosR.data ?? []) as { funcao_id: string }[]);

  const funcoes = (funcoesR.data ?? []) as Funcao[];
  const colunas: ColunaTemplo[] = funcoes.map((f) => {
    const eventos = eventosPorFuncao.get(f.id) ?? 0;
    return { id: f.id, numero: f.numero, nome: f.nome, eventos, preenchimento: preenchimentoColuna(eventos) };
  });
  const totalEventos = colunas.reduce((s, c) => s + c.eventos, 0);

  return (
    <div className="space-y-12">
      <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center">
        <div>
          <div className="marcador max-w-md" aria-hidden>
            III
          </div>
          <h1 className="t-display mt-3">Funções</h1>
          <p className="t-leitura mt-3 text-ink-muted">
            As sete funções pedagógicas: o que cada obra forma em quem a lê. Cada coluna do templo é uma delas; escolha uma para entrar.
          </p>
        </div>
        {colunas.length > 0 && (
          <Templo colunas={colunas} aceso={frontaoAceso(colunas.map((c) => c.preenchimento))} totalEventos={totalEventos} tamanho="grande" />
        )}
      </header>

      {funcoes.length === 0 ? (
        <div className="filete py-10 text-center">
          <p className="t-subtitulo">Nenhuma função cadastrada</p>
          <p className="t-nota mt-1">As funções pedagógicas ainda não foram carregadas no banco.</p>
        </div>
      ) : (
        <ol className="filete divide-y-hair divide-rule-strong/40">
          {funcoes.map((f) => {
            const obras = obrasPorFuncao.get(f.id) ?? 0;
            const exercicios = exerciciosPorFuncao.get(f.id) ?? 0;
            const eventos = eventosPorFuncao.get(f.id) ?? 0;
            return (
              <li key={f.id}>
                <Link
                  href={`/funcoes/${f.id}`}
                  className="group grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 rounded-md py-5 transition-colors duration-discreto ease-discreto hover:bg-sunken sm:grid-cols-[5rem_minmax(0,1fr)] sm:px-2"
                >
                  <span aria-hidden className="t-romano text-titulo leading-none text-gold-ink">
                    {romano(f.numero)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-serif text-xl font-medium leading-snug text-ink group-hover:underline group-hover:decoration-rule-strong group-hover:underline-offset-4">
                      <span className="sr-only">Função {f.numero}: </span>
                      {f.nome}
                    </span>
                    {f.o_que_forma && <span className="t-corpo mt-1.5 block max-w-leitura">{f.o_que_forma}</span>}
                    <span className="t-nota mt-2 block">
                      {plural(obras, "obra", "obras")}, {plural(exercicios, "exercício", "exercícios")}, {plural(eventos, "evento seu", "eventos seus")}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
