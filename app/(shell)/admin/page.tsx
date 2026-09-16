import { requireAdmin } from "@/lib/data/session";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { AdminTabs } from "@/components/admin/admin-tabs";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();

  const [
    { count: totalUsuarios },
    { count: totalAtivos },
    { count: totalEixos },
    { count: totalConversas },
    { count: totalCarteiraItens },
  ] = await Promise.all([
    supabase.from("perfis").select("id", { count: "exact", head: true }),
    supabase.from("ativos").select("id", { count: "exact", head: true }),
    supabase.from("eixos").select("id", { count: "exact", head: true }),
    supabase.from("conversas_socrates").select("id", { count: "exact", head: true }),
    supabase.from("carteira_itens").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Administratio Paideiae</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Painel Administrativo</h1>
        <p className="mt-1 text-sm text-paideia-ink/60">
          Gestão da estrutura pedagógica, do catálogo de ativos e da configuração do Sócrates.
        </p>
      </div>

      <AdminTabs />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Discípulos" value={totalUsuarios ?? 0} />
        <StatCard label="Ativos no Catálogo" value={totalAtivos ?? 0} />
        <StatCard label="Eixos Formativos" value={totalEixos ?? 0} />
        <StatCard label="Diálogos Socráticos" value={totalConversas ?? 0} />
        <StatCard label="Itens em Carteiras" value={totalCarteiraItens ?? 0} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="font-serif text-2xl font-bold">{value}</p>
      <Eyebrow className="mt-1">{label}</Eyebrow>
    </Card>
  );
}
