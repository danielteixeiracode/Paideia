import { requireAdmin } from "@/lib/data/session";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { SubmitButton } from "@/components/admin/submit-button";
import { EixoCard } from "@/components/admin/eixo-card";
import { criarEixo } from "@/app/(shell)/admin/actions";
import type { Capacidade, Eixo } from "@/types/database";

export default async function AdminEixosPage() {
  const { supabase } = await requireAdmin();

  const [{ data: eixos }, { data: capacidades }] = await Promise.all([
    supabase.from("eixos").select("*").order("ordem"),
    supabase.from("capacidades").select("*").order("ordem"),
  ]);

  const listaEixos = (eixos ?? []) as Eixo[];
  const listaCapacidades = (capacidades ?? []) as Capacidade[];

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Administratio Paideiae</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Eixos &amp; Capacidades</h1>
      </div>
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

      <Card>
        <p className="font-serif text-lg font-semibold">Novo Eixo</p>
        <form action={criarEixo} className="mt-3 grid gap-3 sm:grid-cols-2">
          <input name="nome" required placeholder="Nome (ex: Filosofia Geral)" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm" />
          <input name="slug" required placeholder="slug (ex: filosofia-geral)" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm" />
          <input name="cor" type="color" defaultValue="#153D29" className="h-10 rounded-md border border-paideia-cream-300 px-2" />
          <input name="descricao" placeholder="Descrição breve" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm sm:col-span-2" />
          <SubmitButton label="Criar Eixo" />
        </form>
      </Card>
    </div>
  );
}
