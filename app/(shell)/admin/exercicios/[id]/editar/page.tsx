import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/data/session";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { FormularioExercicio } from "@/components/admin/formulario-exercicio";
import { Selo } from "@/components/ui/selo";
import { carregarOpcoesExercicio } from "../../opcoes";
import { tituloDaFicha } from "@/lib/metadata";

type ExercicioEdicao = {
  id: string;
  funcao_id: string;
  obra_id: string | null;
  titulo: string;
  enunciado: string | null;
  metodo: string | null;
  ativo: boolean;
};

export function generateMetadata({ params }: { params: { id: string } }) {
  return tituloDaFicha("exercicios", "titulo", params.id, "Editar: ");
}

export default async function EditarExercicioPage({ params }: { params: { id: string } }) {
  const { supabase } = await requireAdmin();

  const [{ data }, opcoes] = await Promise.all([
    supabase.from("exercicios").select("id, funcao_id, obra_id, titulo, enunciado, metodo, ativo").eq("id", params.id).maybeSingle(),
    carregarOpcoesExercicio(supabase),
  ]);
  if (!data) notFound();
  const exercicio = data as ExercicioEdicao;

  return (
    <div className="space-y-8">
      <header className="filete pt-4">
        <Link href="/admin/exercicios" className="alvo-toque t-nota text-accent underline-offset-4 hover:underline">
          Voltar aos exercícios
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <h1 className="t-titulo">{exercicio.titulo}</h1>
          {exercicio.ativo ? <Selo tom="acao">Publicado</Selo> : <Selo>Rascunho</Selo>}
        </div>
        {exercicio.ativo && (
          <p className="t-nota mt-1">
            <Link href={`/funcoes/${exercicio.funcao_id}`} className="text-accent underline-offset-4 hover:underline">
              Ver na ficha da função
            </Link>
          </p>
        )}
      </header>
      <AdminTabs />
      <div className="max-w-3xl">
        <FormularioExercicio
          exercicioId={exercicio.id}
          inicial={{
            funcao_id: exercicio.funcao_id,
            obra_id: exercicio.obra_id,
            titulo: exercicio.titulo,
            enunciado: exercicio.enunciado ?? "",
            metodo: exercicio.metodo ?? "",
            ativo: exercicio.ativo,
          }}
          funcoes={opcoes.funcoes}
          obras={opcoes.obras}
        />
      </div>
    </div>
  );
}
