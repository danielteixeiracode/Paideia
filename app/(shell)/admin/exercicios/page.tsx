import Link from "next/link";
import { requireAdmin } from "@/lib/data/session";
import { Eyebrow, Badge, EmptyState } from "@/components/ui/primitives";
import { AdminTabs } from "@/components/admin/admin-tabs";
import type { Exercicio } from "@/types/database";

type ExercicioAdmin = Exercicio & {
  funcao: { id: string; numero: number; nome: string } | null;
  obra: { id: string; titulo: string } | null;
};

export default async function AdminExerciciosPage() {
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("exercicios")
    .select("*, funcao:funcoes_pedagogicas(id, numero, nome), obra:obras(id, titulo)")
    .order("ordem");
  const exercicios = ((data ?? []) as unknown as ExercicioAdmin[]).sort(
    (a, b) => (a.funcao?.numero ?? 0) - (b.funcao?.numero ?? 0)
  );

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Administratio Paideiae</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Exercícios</h1>
        <p className="mt-1 text-sm text-paideia-ink/60">
          Página provisória, só de leitura. O cadastro de exercícios virá numa próxima etapa.
        </p>
      </div>
      <AdminTabs />

      {exercicios.length === 0 ? (
        <EmptyState titulo="Nenhum exercício cadastrado" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-paideia-cream-300 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-paideia-cream-100 text-left text-[11px] uppercase text-paideia-ink/50">
              <tr>
                <th className="px-4 py-3">Exercício</th>
                <th className="px-4 py-3">Função</th>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3">Método</th>
                <th className="px-4 py-3">Publicado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paideia-cream-200">
              {exercicios.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-3 font-medium">{e.titulo}</td>
                  <td className="px-4 py-3">
                    {e.funcao && (
                      <Link href={`/funcoes/${e.funcao.id}`} className="hover:underline">
                        {e.funcao.numero}. {e.funcao.nome}
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 text-paideia-ink/60">
                    {e.obra ? (
                      <Link href={`/obras/${e.obra.id}`} className="hover:underline">
                        {e.obra.titulo}
                      </Link>
                    ) : (
                      "Geral da função"
                    )}
                  </td>
                  <td className="px-4 py-3 text-paideia-ink/60">{e.metodo ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={e.ativo ? "green" : "neutral"}>{e.ativo ? "Sim" : "Não"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
