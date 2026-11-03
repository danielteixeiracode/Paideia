import Link from "next/link";
import { requireAdmin } from "@/lib/data/session";
import { Eyebrow, Badge, EmptyState } from "@/components/ui/primitives";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { romano } from "@/lib/utils";
import type { Epoca, FuncaoPedagogica, Obra } from "@/types/database";

type ObraAdmin = Obra & {
  epoca: Epoca | null;
  obra_funcoes: { funcao: FuncaoPedagogica | null }[];
};

export default async function AdminObrasPage() {
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("obras")
    .select("*, epoca:epocas(*), obra_funcoes(funcao:funcoes_pedagogicas(*))")
    .order("ordem")
    .order("titulo");
  const obras = (data ?? []) as unknown as ObraAdmin[];

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Administratio Paideiae</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Obras</h1>
        <p className="mt-1 text-sm text-paideia-ink/60">
          Página provisória, só de leitura. O cadastro de obras virá numa próxima etapa.
        </p>
      </div>
      <AdminTabs />

      {obras.length === 0 ? (
        <EmptyState titulo="Nenhuma obra cadastrada" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-paideia-cream-300 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-paideia-cream-100 text-left text-[11px] uppercase text-paideia-ink/50">
              <tr>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3">Época</th>
                <th className="px-4 py-3">Funções</th>
                <th className="px-4 py-3">Publicada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paideia-cream-200">
              {obras.map((obra) => (
                <tr key={obra.id}>
                  <td className="px-4 py-3">
                    <Link href={`/obras/${obra.id}`} className="font-medium hover:underline">
                      {obra.titulo}
                    </Link>
                    {obra.autor && <p className="text-xs text-paideia-ink/50">{obra.autor}</p>}
                  </td>
                  <td className="px-4 py-3 text-paideia-ink/60">
                    {obra.epoca ? `${romano(obra.epoca.numero)} • ${obra.epoca.nome}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {obra.obra_funcoes
                        .map((l) => l.funcao)
                        .filter((f): f is FuncaoPedagogica => !!f)
                        .sort((a, b) => a.numero - b.numero)
                        .map((f) => (
                          <Badge key={f.id}>{f.numero}. {f.nome}</Badge>
                        ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={obra.ativo ? "green" : "neutral"}>{obra.ativo ? "Sim" : "Não"}</Badge>
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
