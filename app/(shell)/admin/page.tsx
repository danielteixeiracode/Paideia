import { requireAdmin } from "@/lib/data/session";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { AdminTabs } from "@/components/admin/admin-tabs";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();

  const [
    { count: totalUsuarios },
    { count: totalObras },
    { count: totalExercicios },
    { count: totalConversas },
    { count: totalFrutos },
  ] = await Promise.all([
    supabase.from("perfis").select("id", { count: "exact", head: true }),
    supabase.from("obras").select("id", { count: "exact", head: true }),
    supabase.from("exercicios").select("id", { count: "exact", head: true }),
    supabase.from("conversas_socrates").select("id", { count: "exact", head: true }),
    supabase.from("frutos").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Administratio Paideiae</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Painel Administrativo</h1>
        <p className="mt-1 text-sm text-ink/60">
          Gestão das obras, dos exercícios, dos usuários e da configuração do Sócrates.
        </p>
      </div>

      <AdminTabs />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Discípulos" value={totalUsuarios ?? 0} />
        <StatCard label="Obras" value={totalObras ?? 0} />
        <StatCard label="Exercícios" value={totalExercicios ?? 0} />
        <StatCard label="Diálogos Socráticos" value={totalConversas ?? 0} />
        <StatCard label="Frutos" value={totalFrutos ?? 0} />
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
