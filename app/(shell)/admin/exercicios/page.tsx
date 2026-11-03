import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/data/session";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { classesBotao } from "@/components/ui/botao";
import { TabelaExercicios, type ExercicioAdmin } from "./tabela";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Administração: exercícios" };

export default async function AdminExerciciosPage() {
  // Só administrador (checado aqui e no middleware); vê também os rascunhos.
  const { supabase } = await requireAdmin();

  const [exerciciosR, funcoesR] = await Promise.all([
    supabase
      .from("exercicios")
      .select("id, titulo, metodo, ativo, ordem, funcao:funcoes_pedagogicas(id, numero, nome), obra:obras(id, titulo)")
      .order("ordem"),
    supabase.from("funcoes_pedagogicas").select("id, numero, nome").order("numero"),
  ]);

  const exercicios = ((exerciciosR.data ?? []) as unknown as ExercicioAdmin[]).sort(
    (a, b) => (a.funcao?.numero ?? 0) - (b.funcao?.numero ?? 0)
  );

  return (
    <div className="space-y-8">
      <header className="filete flex flex-wrap items-end justify-between gap-4 pt-4">
        <div>
          <h1 className="t-titulo">Exercícios</h1>
          <p className="t-nota mt-1">Os exercícios de cada função, gerais ou de uma obra, com os rascunhos.</p>
        </div>
        <Link href="/admin/exercicios/novo" className={classesBotao()}>
          <Plus className="h-4 w-4" aria-hidden /> Novo exercício
        </Link>
      </header>

      <AdminTabs />

      {exercicios.length === 0 ? (
        <div className="filete py-10 text-center">
          <p className="t-subtitulo">Nenhum exercício cadastrado</p>
          <p className="t-nota mt-1">Cadastre o primeiro exercício de uma função. Ele começa como rascunho.</p>
          <Link href="/admin/exercicios/novo" className={classesBotao({ className: "mt-4" })}>
            <Plus className="h-4 w-4" aria-hidden /> Novo exercício
          </Link>
        </div>
      ) : (
        <TabelaExercicios exercicios={exercicios} funcoes={(funcoesR.data ?? []) as { id: string; numero: number; nome: string }[]} />
      )}
    </div>
  );
}
