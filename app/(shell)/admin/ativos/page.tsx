import { requireAdmin } from "@/lib/data/session";
import { Cartao } from "@/components/ui/cartao";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { SubmitButton } from "@/components/admin/submit-button";
import { AtivoRow } from "@/components/admin/ativo-row";
import { criarAtivo } from "@/app/(shell)/admin/actions";
import type { Ativo, Eixo } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Catálogo de ativos" };

export default async function AdminAtivosPage() {
  const { supabase } = await requireAdmin();

  const [{ data: ativos }, { data: eixos }] = await Promise.all([
    supabase.from("ativos").select("*").order("criado_em", { ascending: false }),
    supabase.from("eixos").select("*").order("ordem"),
  ]);

  const listaAtivos = (ativos ?? []) as Ativo[];
  const listaEixos = (eixos ?? []) as Eixo[];

  return (
    <div className="space-y-8">
      <header className="filete pt-4">
        <h1 className="t-titulo">Catálogo de ativos</h1>
        <p className="t-nota mt-1">Tela do modelo antigo (ativos e eixos), fora das abas.</p>
      </header>
      <AdminTabs />

      <Cartao>
        <h2 className="t-subtitulo">Novo ativo</h2>
        <form action={criarAtivo} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input name="titulo" required placeholder="Título" className="rounded-md border border-rule px-3 py-2 text-sm lg:col-span-2" />
          <select name="tipo" className="rounded-md border border-rule px-3 py-2 text-sm">
            <option value="livro">Livro</option>
            <option value="tratado">Tratado</option>
            <option value="curso">Curso</option>
            <option value="exercicio">Exercício</option>
            <option value="audio">Áudio</option>
            <option value="interativo">Interativo</option>
          </select>
          <input name="subtitulo" placeholder="Subtítulo" className="rounded-md border border-rule px-3 py-2 text-sm" />
          <input name="autor" placeholder="Autor" className="rounded-md border border-rule px-3 py-2 text-sm" />
          <select name="eixo_id" className="rounded-md border border-rule px-3 py-2 text-sm">
            <option value="">Eixo...</option>
            {listaEixos.map((e) => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </select>
          <input name="duracao_estimada_horas" type="number" step="0.5" placeholder="Duração (h)" className="rounded-md border border-rule px-3 py-2 text-sm" />
          <select name="nivel" className="rounded-md border border-rule px-3 py-2 text-sm">
            <option value="iniciante">Iniciante</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
          <input name="descricao" placeholder="Descrição" className="rounded-md border border-rule px-3 py-2 text-sm lg:col-span-3" />
          <div className="lg:col-span-3">
            <SubmitButton label="Publicar Ativo" />
          </div>
        </form>
      </Cartao>

      <div className="overflow-hidden rounded-2xl border border-rule bg-surface shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-canvas text-left text-nota text-ink-muted">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Eixo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {listaAtivos.map((ativo) => (
              <AtivoRow key={ativo.id} ativo={ativo} eixos={listaEixos} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
