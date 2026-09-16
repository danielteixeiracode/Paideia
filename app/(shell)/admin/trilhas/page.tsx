import { requireAdmin } from "@/lib/data/session";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { SubmitButton } from "@/components/admin/submit-button";
import { EtapaRow } from "@/components/admin/etapa-row";
import { TrilhaHeader } from "@/components/admin/trilha-header";
import { criarTrilha, criarEtapa } from "@/app/(shell)/admin/actions";
import type { Eixo, EtapaTrilha, Trilha } from "@/types/database";

export default async function AdminTrilhasPage() {
  const { supabase } = await requireAdmin();

  const [{ data: trilhas }, { data: etapas }, { data: eixos }] = await Promise.all([
    supabase.from("trilhas").select("*").order("ordem"),
    supabase.from("etapas_trilha").select("*").order("ordem"),
    supabase.from("eixos").select("*").order("ordem"),
  ]);

  const listaTrilhas = (trilhas ?? []) as Trilha[];
  const listaEtapas = (etapas ?? []) as EtapaTrilha[];
  const listaEixos = (eixos ?? []) as Eixo[];

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Administratio Paideiae</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Trilhas &amp; Etapas</h1>
      </div>
      <AdminTabs />

      {listaTrilhas.map((trilha) => (
        <Card key={trilha.id}>
          <TrilhaHeader
            trilha={trilha}
            totalEtapas={listaEtapas.filter((e) => e.trilha_id === trilha.id).length}
          />

          <div className="mt-4 overflow-hidden rounded-xl border border-paideia-cream-300">
            <table className="w-full text-sm">
              <thead className="bg-paideia-cream-100 text-left text-[11px] uppercase text-paideia-ink/50">
                <tr>
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Título</th>
                  <th className="px-3 py-2">Eixo</th>
                  <th className="px-3 py-2">Carga</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-paideia-cream-200">
                {listaEtapas
                  .filter((e) => e.trilha_id === trilha.id)
                  .map((etapa) => (
                    <EtapaRow key={etapa.id} etapa={etapa} eixos={listaEixos} />
                  ))}
              </tbody>
            </table>
          </div>

          <form action={criarEtapa} className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <input type="hidden" name="trilha_id" value={trilha.id} />
            <input name="codigo" required placeholder="Código (ETAPA 12)" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm" />
            <select name="eixo_id" required className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm">
              <option value="">Eixo...</option>
              {listaEixos.map((e) => (
                <option key={e.id} value={e.id}>{e.nome}</option>
              ))}
            </select>
            <input name="ordem" type="number" placeholder="Ordem" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm" />
            <input name="titulo" required placeholder="Título da etapa" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm lg:col-span-2" />
            <input name="carga_horas_estimada" type="number" step="0.5" placeholder="Carga (h)" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm" />
            <input name="descricao" placeholder="Descrição" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm lg:col-span-2" />
            <input name="selo_titulo" placeholder="Selo de conclusão" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm" />
            <div className="lg:col-span-3">
              <SubmitButton label="Adicionar Etapa" small />
            </div>
          </form>
        </Card>
      ))}

      <Card>
        <p className="font-serif text-lg font-semibold">Nova Trilha</p>
        <form action={criarTrilha} className="mt-3 grid gap-3 sm:grid-cols-2">
          <input name="nome" required placeholder="Nome da trilha" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm" />
          <input name="descricao" placeholder="Descrição" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm" />
          <SubmitButton label="Criar Trilha" />
        </form>
      </Card>
    </div>
  );
}
