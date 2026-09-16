import { requireAdmin } from "@/lib/data/session";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { SubmitButton } from "@/components/admin/submit-button";
import { AtivoRow } from "@/components/admin/ativo-row";
import { criarAtivo } from "@/app/(shell)/admin/actions";
import type { Ativo, Eixo } from "@/types/database";

export default async function AdminAtivosPage() {
  const { supabase } = await requireAdmin();

  const [{ data: ativos }, { data: eixos }] = await Promise.all([
    supabase.from("ativos").select("*").order("criado_em", { ascending: false }),
    supabase.from("eixos").select("*").order("ordem"),
  ]);

  const listaAtivos = (ativos ?? []) as Ativo[];
  const listaEixos = (eixos ?? []) as Eixo[];

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Administratio Paideiae</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Catálogo de Ativos</h1>
      </div>
      <AdminTabs />

      <Card>
        <p className="font-serif text-lg font-semibold">Novo Ativo</p>
        <form action={criarAtivo} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input name="titulo" required placeholder="Título" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm lg:col-span-2" />
          <select name="tipo" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm">
            <option value="livro">Livro</option>
            <option value="tratado">Tratado</option>
            <option value="curso">Curso</option>
            <option value="exercicio">Exercício</option>
            <option value="audio">Áudio</option>
            <option value="interativo">Interativo</option>
          </select>
          <input name="subtitulo" placeholder="Subtítulo" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm" />
          <input name="autor" placeholder="Autor" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm" />
          <select name="eixo_id" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm">
            <option value="">Eixo...</option>
            {listaEixos.map((e) => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </select>
          <input name="duracao_estimada_horas" type="number" step="0.5" placeholder="Duração (h)" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm" />
          <select name="nivel" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm">
            <option value="iniciante">Iniciante</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
          <input name="descricao" placeholder="Descrição" className="rounded-md border border-paideia-cream-300 px-3 py-2 text-sm lg:col-span-3" />
          <div className="lg:col-span-3">
            <SubmitButton label="Publicar Ativo" />
          </div>
        </form>
      </Card>

      <div className="overflow-hidden rounded-2xl border border-paideia-cream-300 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-paideia-cream-100 text-left text-[11px] uppercase text-paideia-ink/50">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Eixo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-paideia-cream-200">
            {listaAtivos.map((ativo) => (
              <AtivoRow key={ativo.id} ativo={ativo} eixos={listaEixos} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
