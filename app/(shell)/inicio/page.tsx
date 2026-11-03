import Link from "next/link";
import { requirePerfil } from "@/lib/data/session";
import { Templo, type ColunaTemplo } from "@/components/corpo/templo";
import { ResponderSocrates } from "@/components/corpo/responder-socrates";
import { Cartao } from "@/components/ui/cartao";
import { TituloBloco } from "@/components/ui/titulo-bloco";
import { ListaAtividade } from "@/components/corpo/lista-atividade";
import { Contador } from "@/components/ui/contador";
import { classesBotao } from "@/components/ui/botao";
import { preenchimentoColuna, frontaoAceso } from "@/lib/templo";
import { perguntaDoDia } from "@/lib/perguntas-socrates";
import { descreverEvento } from "@/lib/eventos";
import { cn, quandoRelativo, romano } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Início" };

// Formas que vêm do banco nas consultas abaixo (todas pela sessão do aluno,
// sob a RLS: só os dados dele e o conteúdo publicado).
type Funcao = { id: string; numero: number; nome: string };
type EventoRecente = {
  id: string;
  tipo: string;
  criado_em: string;
  obra: { id: string; titulo: string } | null;
  funcao: Funcao | null;
  exercicio: { id: string; titulo: string; funcao_id: string; ordem: number } | null;
};
type ItemCarteira = {
  obra_id: string;
  obra: {
    id: string;
    titulo: string;
    autor: string | null;
    epoca_id: string | null;
    obra_funcoes: { funcao: { numero: number } | null }[];
  } | null;
};
type FrutoRecente = {
  id: string;
  tipo: string;
  criado_em: string;
  obra: { titulo: string } | null;
  funcao: { numero: number; nome: string } | null;
  exercicio: { titulo: string } | null;
};
type Epoca = { id: string; numero: number; nome: string };

export default async function InicioPage() {
  const { supabase, perfil } = await requirePerfil();
  const uid = perfil.id;

  const [funcoesR, eventosFuncaoR, totalR, recentesR, carteiraR, frutosR, frutosObrasR, epocasR, totalFrutosR] = await Promise.all([
    supabase.from("funcoes_pedagogicas").select("id, numero, nome").order("numero"),
    supabase.from("registro_eventos").select("funcao_id").eq("user_id", uid).not("funcao_id", "is", null),
    supabase.from("registro_eventos").select("id", { count: "exact", head: true }).eq("user_id", uid),
    supabase
      .from("registro_eventos")
      .select(
        "id, tipo, criado_em, obra:obras(id, titulo), funcao:funcoes_pedagogicas(id, numero, nome), exercicio:exercicios(id, titulo, funcao_id, ordem)"
      )
      .eq("user_id", uid)
      .order("criado_em", { ascending: false })
      .limit(6),
    supabase
      .from("carteira_obras")
      .select("obra_id, obra:obras(id, titulo, autor, epoca_id, obra_funcoes(funcao:funcoes_pedagogicas(numero)))")
      .eq("user_id", uid)
      .order("atualizado_em", { ascending: false }),
    supabase
      .from("frutos")
      .select("id, tipo, criado_em, obra:obras(titulo), funcao:funcoes_pedagogicas(numero, nome), exercicio:exercicios(titulo)")
      .eq("user_id", uid)
      .order("criado_em", { ascending: false })
      .limit(3),
    supabase.from("frutos").select("obra_id").eq("user_id", uid).not("obra_id", "is", null),
    supabase.from("epocas").select("id, numero, nome").order("numero"),
    supabase.from("frutos").select("id", { count: "exact", head: true }).eq("user_id", uid),
  ]);

  const funcoes = (funcoesR.data ?? []) as Funcao[];
  const recentes = (recentesR.data ?? []) as unknown as EventoRecente[];
  const carteira = ((carteiraR.data ?? []) as unknown as ItemCarteira[]).filter((i) => i.obra);
  const frutos = (frutosR.data ?? []) as unknown as FrutoRecente[];
  const epocas = (epocasR.data ?? []) as Epoca[];
  const totalEventos = totalR.count ?? 0;
  const totalFrutos = totalFrutosR.count ?? 0;

  // Templo: eventos por função, preenchimento derivado (regra provisória).
  const eventosPorFuncao = new Map<string, number>();
  for (const e of (eventosFuncaoR.data ?? []) as { funcao_id: string }[]) {
    eventosPorFuncao.set(e.funcao_id, (eventosPorFuncao.get(e.funcao_id) ?? 0) + 1);
  }
  const colunas: ColunaTemplo[] = funcoes.map((f) => {
    const eventos = eventosPorFuncao.get(f.id) ?? 0;
    return { ...f, eventos, preenchimento: preenchimentoColuna(eventos) };
  });
  const aceso = frontaoAceso(colunas.map((c) => c.preenchimento));

  // Sementes: obras guardadas que ainda não deram fruto (como na Carteira).
  const obrasComFruto = new Set(((frutosObrasR.data ?? []) as { obra_id: string }[]).map((f) => f.obra_id));
  const sementes = carteira.filter((i) => !obrasComFruto.has(i.obra_id));
  const epocasNaCarteira = new Set(carteira.map((i) => i.obra!.epoca_id).filter(Boolean));

  const continuar = await montarContinuar(supabase, recentes[0] ?? null);
  const socrates = perguntaDoDia(colunas);
  const agora = new Date();
  const primeiroNome = perfil.nome.split(" ")[0];

  return (
    <div className="space-y-12">
      {/* Frontispício: título à esquerda, o templo como selo à direita. */}
      <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <div className="marcador max-w-md" aria-hidden>
            I
          </div>
          <h1 className="t-display mt-3">Início</h1>
          <p className="t-leitura mt-3 text-ink-muted">Bem-vindo de volta, {primeiroNome}.</p>
        </div>
        {colunas.length > 0 && <Templo colunas={colunas} aceso={aceso} totalEventos={totalEventos} />}
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <BlocoContinuar dados={continuar} agora={agora} />

        <Cartao as="section" className="flex flex-col">
          <TituloBloco titulo="Sócrates pergunta" href="/socrates" link="Diálogos" />
          {socrates ? (
            <>
              <p className="t-nota mt-4">
                <span className="t-romano mr-1.5 text-gold-ink">{romano(socrates.funcao.numero)}</span>
                {socrates.funcao.nome}
              </p>
              <blockquote className="mt-2 font-serif text-subtitulo italic leading-snug text-ink">{socrates.pergunta}</blockquote>
              <div className="mt-auto pt-5">
                <ResponderSocrates pergunta={socrates.pergunta} />
              </div>
            </>
          ) : (
            <p className="t-nota mt-4">As funções pedagógicas ainda não foram carregadas.</p>
          )}
        </Cartao>
      </div>

      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        <section>
          <TituloBloco titulo="Na Carteira, sementes" href="/carteira" link="Carteira" />
          <p className="t-nota mt-1">
            <Contador valor={sementes.length} /> {sementes.length === 1 ? "obra à espera de fruto" : "obras à espera de fruto"}
          </p>
          {sementes.length === 0 ? (
            <p className="t-corpo mt-4 text-ink-muted">
              Nenhuma obra guardada ainda. Guarde uma pela ficha dela, em{" "}
              <Link href="/obras" className="text-accent underline underline-offset-4">
                Obras
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-3 divide-y-hair divide-rule-strong/40">
              {sementes.slice(0, 4).map((s) => {
                const numeros = Array.from(
                  new Set(s.obra!.obra_funcoes.map((l) => l.funcao?.numero).filter((n): n is number => !!n))
                ).sort((a, b) => a - b);
                return (
                  <li key={s.obra_id}>
                    <Link href={`/obras/${s.obra!.id}`} className="group flex items-baseline justify-between gap-3 py-2.5">
                      <span className="min-w-0">
                        <span className="block truncate font-serif text-lg leading-snug text-ink group-hover:underline group-hover:underline-offset-4">
                          {s.obra!.titulo}
                        </span>
                        {s.obra!.autor && <span className="t-nota block truncate">{s.obra!.autor}</span>}
                      </span>
                      {numeros.length > 0 && (
                        <span className="t-romano shrink-0 space-x-1.5 text-nota text-gold-ink" aria-label={`Funções ${numeros.join(", ")}`}>
                          {numeros.map((n) => (
                            <span key={n}>{romano(n)}</span>
                          ))}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <TituloBloco titulo="Frutos recentes" href="/carteira" link="Carteira" />
          <p className="t-nota mt-1">
            <Contador valor={totalFrutos} /> {totalFrutos === 1 ? "fruto colhido" : "frutos colhidos"}
          </p>
          {frutos.length === 0 ? (
            <p className="t-corpo mt-4 text-ink-muted">Os frutos aparecem aqui quando você responde a um exercício.</p>
          ) : (
            <ul className="mt-3 divide-y-hair divide-rule-strong/40">
              {frutos.map((f) => (
                <li key={f.id} className="flex items-baseline gap-3 py-2.5">
                  <span className="t-romano w-8 shrink-0 text-nota text-gold-ink">{f.funcao ? romano(f.funcao.numero) : ""}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-interface text-ink">{f.exercicio?.titulo ?? f.obra?.titulo ?? f.tipo}</span>
                    <span className="t-nota block">{quandoRelativo(f.criado_em, agora)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <TituloBloco titulo="Épocas" href="/epocas" link="Épocas" />
          <ul className="mt-4 grid grid-cols-7 gap-0.5 sm:gap-1.5" aria-label="As sete épocas">
            {epocas.map((e) => {
              const naCarteira = epocasNaCarteira.has(e.id);
              return (
                <li key={e.id}>
                  <Link
                    href={`/epocas/${e.id}`}
                    title={e.nome}
                    aria-label={`Época ${e.numero}: ${e.nome}${naCarteira ? ", com obra na sua Carteira" : ""}`}
                    className={cn(
                      "t-romano flex min-h-11 items-center justify-center rounded-md border text-nota transition-colors duration-discreto ease-discreto",
                      naCarteira
                        ? "border-rule-strong/70 bg-gold/15 font-semibold text-gold-ink"
                        : "border-rule text-ink-muted hover:border-ink-muted hover:text-ink"
                    )}
                  >
                    {romano(e.numero)}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="t-nota mt-3">
            {epocasNaCarteira.size > 0
              ? "Em dourado, as épocas das obras da sua Carteira."
              : "Ao guardar obras, as épocas delas aparecem aqui em dourado."}
          </p>
        </section>
      </div>

      <section>
        <TituloBloco titulo="Atividade recente" href="/carteira" link="Carteira" />
        <div className="mt-2">
          <ListaAtividade eventos={recentes} agora={agora} vazio="Nada registrado ainda. O que você fizer no Paideia aparece aqui." />
        </div>
      </section>
    </div>
  );
}

type DadosContinuar = {
  evento: EventoRecente;
  obra: { id: string; titulo: string } | null;
  funcao: Funcao | null;
  proximo: { id: string; titulo: string } | null;
} | null;

// O "Continuar" parte do último evento: a obra e a função dele (se o evento
// só tem a obra, a primeira função da obra) e o próximo exercício da função.
async function montarContinuar(supabase: Awaited<ReturnType<typeof requirePerfil>>["supabase"], evento: EventoRecente | null): Promise<DadosContinuar> {
  if (!evento) return null;
  const obra = evento.obra;
  let funcao = evento.funcao;

  if (!funcao && evento.exercicio) {
    const { data } = await supabase.from("funcoes_pedagogicas").select("id, numero, nome").eq("id", evento.exercicio.funcao_id).maybeSingle();
    funcao = (data as Funcao | null) ?? null;
  }
  if (!funcao && obra) {
    const { data } = await supabase.from("obra_funcoes").select("funcao:funcoes_pedagogicas(id, numero, nome)").eq("obra_id", obra.id);
    const lista = ((data ?? []) as unknown as { funcao: Funcao | null }[])
      .map((l) => l.funcao)
      .filter((f): f is Funcao => !!f)
      .sort((a, b) => a.numero - b.numero);
    funcao = lista[0] ?? null;
  }
  if (!obra && !funcao) return null;

  let proximo: { id: string; titulo: string } | null = null;
  if (funcao) {
    const filtro = obra ? `obra_id.is.null,obra_id.eq.${obra.id}` : "obra_id.is.null";
    const { data } = await supabase
      .from("exercicios")
      .select("id, titulo, ordem")
      .eq("funcao_id", funcao.id)
      .eq("ativo", true)
      .or(filtro)
      .order("ordem");
    const lista = (data ?? []) as { id: string; titulo: string; ordem: number }[];
    const feito = evento.exercicio ? lista.findIndex((x) => x.id === evento.exercicio!.id) : -1;
    proximo = lista[feito + 1] ?? null;
  }
  return { evento, obra, funcao, proximo };
}

// O único bloco escuro do Início: a pedra verde, fixa em todos os modos.
function BlocoContinuar({ dados, agora }: { dados: DadosContinuar; agora: Date }) {
  const botaoClaro = "bg-paideia-gold-400 text-paideia-green-950 hover:bg-paideia-gold-300 active:bg-paideia-gold-300";
  const botaoContorno = "border-paideia-cream-100/70 text-paideia-cream-50 hover:border-paideia-cream-50 hover:bg-paideia-cream-50/10 active:bg-paideia-cream-50/15";

  return (
    <section aria-labelledby="continuar-titulo" className="flex flex-col rounded-2xl bg-paideia-green-800 p-6 text-paideia-cream-50 sm:p-8 lg:col-span-2">
      <div className="flex items-center gap-3">
        <h2 id="continuar-titulo" className="text-interface font-semibold text-paideia-gold-300">
          Continuar
        </h2>
        <span aria-hidden className="flex-1 border-t-hair border-paideia-gold-400/60" />
      </div>

      {dados ? (
        <>
          <p className="mt-5 font-serif text-titulo leading-tight">{dados.obra?.titulo ?? dados.funcao?.nome}</p>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {dados.funcao && (
              <div>
                <dt className="text-nota text-paideia-cream-200">Função</dt>
                <dd className="mt-0.5 text-interface">
                  <span className="t-romano mr-1.5 text-paideia-gold-300">{romano(dados.funcao.numero)}</span>
                  {dados.funcao.nome}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-nota text-paideia-cream-200">Próximo exercício</dt>
              <dd className="mt-0.5 text-interface">{dados.proximo?.titulo ?? "Nenhum exercício desta função ainda"}</dd>
            </div>
          </dl>
          <p className="mt-5 text-nota text-paideia-cream-200">
            Último registro: {descreverEvento(dados.evento)}, {quandoRelativo(dados.evento.criado_em, agora)}.
          </p>
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <Link
              href={dados.funcao ? `/funcoes/${dados.funcao.id}` : `/obras/${dados.obra!.id}`}
              className={classesBotao({ className: botaoClaro })}
            >
              Retomar
            </Link>
            {dados.obra && (
              <Link href={`/obras/${dados.obra.id}`} className={classesBotao({ variante: "secundario", className: botaoContorno })}>
                Ver a obra
              </Link>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="mt-5 font-serif text-titulo leading-tight">Comece pelas Obras</p>
          <p className="mt-3 max-w-leitura text-corpo text-paideia-cream-200">
            Escolha uma obra e veja a que funções ela serve. O que você fizer aparece aqui para retomar depois.
          </p>
          <div className="mt-auto pt-6">
            <Link href="/obras" className={classesBotao({ className: botaoClaro })}>
              Começar pelas Obras
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
