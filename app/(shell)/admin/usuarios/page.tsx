import { requireAdmin } from "@/lib/data/session";
import { Eyebrow } from "@/components/ui/primitives";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { PapelSelect } from "@/components/admin/papel-select";
import type { Perfil } from "@/types/database";

export default async function AdminUsuariosPage() {
  const { supabase } = await requireAdmin();

  const { data: usuarios } = await supabase
    .from("perfis")
    .select("*")
    .order("criado_em", { ascending: false });

  const lista = (usuarios ?? []) as Perfil[];

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Administratio Paideiae</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Discípulos &amp; Administradores</h1>
      </div>
      <AdminTabs />

      <div className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-canvas text-left text-[11px] uppercase text-ink/50">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Grau</th>
              <th className="px-4 py-3">Papel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {lista.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium">{u.nome}</td>
                <td className="px-4 py-3 text-ink/60">{u.email}</td>
                <td className="px-4 py-3 text-ink/60">{u.grau_atual}</td>
                <td className="px-4 py-3">
                  <PapelSelect userId={u.id} papel={u.papel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
