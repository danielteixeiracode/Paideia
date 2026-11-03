import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { ConversasSidebar } from "@/components/socrates/conversas-sidebar";
import { ChatWindow } from "@/components/socrates/chat-window";
import { NovaConversaButton } from "@/components/socrates/nova-conversa-button";
import type { ConversaSocrates, MensagemSocrates } from "@/types/database";

export default async function SocratesPage({
  searchParams,
}: {
  searchParams: { c?: string };
}) {
  const { supabase, perfil } = await requirePerfil();

  const { data: conversas } = await supabase
    .from("conversas_socrates")
    .select("*")
    .eq("user_id", perfil.id)
    .order("atualizado_em", { ascending: false });

  const lista = (conversas ?? []) as ConversaSocrates[];
  const conversaAtiva = searchParams.c
    ? lista.find((c) => c.id === searchParams.c)
    : lista[0];

  let mensagens: MensagemSocrates[] = [];
  if (conversaAtiva) {
    const { data } = await supabase
      .from("mensagens_socrates")
      .select("*")
      .eq("conversa_id", conversaAtiva.id)
      .order("criado_em", { ascending: true });
    mensagens = (data ?? []) as MensagemSocrates[];
  }

  return (
    <div className="flex h-[calc(100dvh-var(--header-height)-var(--shell-respiro))] min-h-[24rem] flex-col gap-5">
      <div>
        <Eyebrow>Mentor Diático em Vigília • Atenas, 399 a.C. (simbólico)</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Diálogo com Sócrates</h1>
      </div>

      <div className="grid flex-1 gap-5 overflow-hidden lg:grid-cols-[240px_1fr]">
        <Card className="hidden overflow-hidden lg:flex">
          <ConversasSidebar conversas={lista} ativaId={conversaAtiva?.id} />
        </Card>

        <Card className="flex flex-1 flex-col overflow-hidden">
          {conversaAtiva ? (
            <ChatWindow conversaId={conversaAtiva.id} mensagensIniciais={mensagens} />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <p className="font-serif text-lg text-ink/70">
                Nenhum diálogo iniciado. Comece uma nova consulta com Sócrates.
              </p>
              <NovaConversaButton />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
