import { requireAdmin } from "@/lib/data/session";
import { Cartao } from "@/components/ui/cartao";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { SubmitButton } from "@/components/admin/submit-button";
import { EixoCard } from "@/components/admin/eixo-card";
import { criarEixo } from "@/app/(shell)/admin/actions";
import type { Capacidade, Eixo } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Eixos e capacidades" };

export default async function AdminEixosPage() {
  const { supabase } = await requireAdmin();

  const [{ data: eixos }, { data: capacidades }] = await Promise.all([
    supabase.from("eixos").select("*").order("ordem"),
    supabase.from("capacidades").select("*").order("ordem"),
  ]);

  const listaEixos = (eixos ?? []) as Eixo[];
  const listaCapacidades = (capacidades ?? []) as Capacidade[];

  return (
    <div className="space-y-8">
      <header className="filete pt-4">
        <h1 className="t-titulo">Eixos e capacidades</h1>
        <p className="t-nota mt-1">Tela do modelo antigo (eixos e capacidades), fora das abas.</p>
      </header>
      <AdminTabs />

      <div className="grid gap-5 lg:grid-cols-2">
        {listaEixos.map((eixo) => (
          <EixoCard
            key={eixo.id}
            eixo={eixo}
            capacidades={listaCapacidades.filter((c) => c.eixo_id === eixo.id)}
          />
        ))}
      </div>

      <Cartao>
        <h2 className="t-subtitulo">Novo eixo</h2>
        <form action={criarEixo} className="mt-3 grid gap-3 sm:grid-cols-2">
          <input name="nome" required placeholder="Nome (ex: Filosofia Geral)" className="rounded-md border border-rule px-3 py-2 text-sm" />
          <input name="slug" required placeholder="slug (ex: filosofia-geral)" className="rounded-md border border-rule px-3 py-2 text-sm" />
          <input name="cor" type="color" defaultValue="#153D29" className="h-10 rounded-md border border-rule px-2" />
          <input name="descricao" placeholder="Descrição breve" className="rounded-md border border-rule px-3 py-2 text-sm sm:col-span-2" />
          <SubmitButton label="Criar Eixo" />
        </form>
      </Cartao>
    </div>
  );
}
