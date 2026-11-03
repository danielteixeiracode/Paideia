import { requirePerfil } from "@/lib/data/session";
import { ChatWindow } from "@/components/socrates/chat-window";
import { BotaoNovaConsulta, ConsultasNoCelular, ListaConsultas, type Consulta } from "@/components/socrates/lista-consultas";
import { ContextoTela } from "@/components/socrates/contexto-tela";
import type { MensagemSocrates } from "@/types/database";

export default async function SocratesPage({ searchParams }: { searchParams: { c?: string } }) {
  const { supabase, perfil } = await requirePerfil();

  const { data: conversas } = await supabase
    .from("conversas_socrates")
    .select("id, titulo, atualizado_em")
    .eq("user_id", perfil.id)
    .order("atualizado_em", { ascending: false });

  const consultas = (conversas ?? []) as Consulta[];
  const ativa = searchParams.c ? consultas.find((c) => c.id === searchParams.c) : consultas[0];

  let mensagens: MensagemSocrates[] = [];
  if (ativa) {
    const { data } = await supabase
      .from("mensagens_socrates")
      .select("*")
      .eq("conversa_id", ativa.id)
      .order("criado_em", { ascending: true });
    mensagens = (data ?? []) as MensagemSocrates[];
  }
  const agora = new Date().toISOString();

  return (
    // Altura da tela menos cabeçalho e respiros: a conversa rola por dentro.
    <div className="flex h-[calc(100dvh-var(--header-height)-var(--shell-respiro))] min-h-[28rem] flex-col gap-6">
      <ContextoTela tipo="nenhum" />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="marcador max-w-md" aria-hidden>
            VI
          </div>
          <h1 className="t-titulo mt-3">Sócrates</h1>
          <p className="t-nota mt-1">O diálogo socrático: ele pergunta mais do que responde.</p>
        </div>
        <div className="lg:hidden">
          <ConsultasNoCelular consultas={consultas} ativaId={ativa?.id} agora={agora} />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden min-h-0 lg:block">
          <ListaConsultas consultas={consultas} ativaId={ativa?.id} agora={agora} />
        </aside>

        <section aria-label="Conversa" className="flex min-h-0 flex-col rounded-2xl border border-rule bg-surface p-4 sm:p-6">
          {ativa ? (
            <ChatWindow conversaId={ativa.id} mensagensIniciais={mensagens} />
          ) : (
            <div className="m-auto max-w-sm text-center">
              <p aria-hidden className="font-serif text-titulo leading-none text-gold-ink">
                Σ
              </p>
              <p className="t-subtitulo mt-3">Nenhuma consulta ainda</p>
              <p className="t-nota mt-1">Abra uma consulta e faça a primeira pergunta.</p>
              <BotaoNovaConsulta className="mt-5" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
