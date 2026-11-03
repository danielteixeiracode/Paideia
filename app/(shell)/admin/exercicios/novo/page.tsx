import Link from "next/link";
import { requireAdmin } from "@/lib/data/session";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { FormularioExercicio } from "@/components/admin/formulario-exercicio";
import { carregarOpcoesExercicio } from "../opcoes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo exercício" };

export default async function NovoExercicioPage() {
  const { supabase } = await requireAdmin();
  const { funcoes, obras } = await carregarOpcoesExercicio(supabase);

  return (
    <div className="space-y-8">
      <header className="filete pt-4">
        <Link href="/admin/exercicios" className="alvo-toque t-nota text-accent underline-offset-4 hover:underline">
          Voltar aos exercícios
        </Link>
        <h1 className="t-titulo mt-2">Novo exercício</h1>
        <p className="t-nota mt-1">Pertence a uma função; pode valer para todas as obras dela ou só para uma. Começa como rascunho.</p>
      </header>
      <AdminTabs />
      <div className="max-w-3xl">
        <FormularioExercicio
          exercicioId={null}
          inicial={{ funcao_id: "", obra_id: null, titulo: "", enunciado: "", metodo: "", ativo: false }}
          funcoes={funcoes}
          obras={obras}
        />
      </div>
    </div>
  );
}
