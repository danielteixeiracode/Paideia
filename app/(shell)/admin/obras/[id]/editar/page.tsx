import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/data/session";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { FormularioObra } from "@/components/admin/formulario-obra";
import { Selo } from "@/components/ui/selo";
import { carregarOpcoes } from "../../opcoes";
import { tituloDaFicha } from "@/lib/metadata";

type ObraEdicao = {
  id: string;
  titulo: string;
  autor: string | null;
  descricao: string | null;
  epoca_id: string | null;
  ativo: boolean;
  obra_funcoes: { funcao_id: string; nota: string | null }[];
};

export function generateMetadata({ params }: { params: { id: string } }) {
  return tituloDaFicha("obras", "titulo", params.id, "Editar: ");
}

export default async function EditarObraPage({ params }: { params: { id: string } }) {
  const { supabase } = await requireAdmin();

  const [{ data }, opcoes] = await Promise.all([
    supabase
      .from("obras")
      .select("id, titulo, autor, descricao, epoca_id, ativo, obra_funcoes(funcao_id, nota)")
      .eq("id", params.id)
      .maybeSingle(),
    carregarOpcoes(supabase),
  ]);
  if (!data) notFound();
  const obra = data as unknown as ObraEdicao;

  return (
    <div className="space-y-8">
      <header className="filete pt-4">
        <Link href="/admin/obras" className="t-nota text-accent underline-offset-4 hover:underline">
          Voltar às obras
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <h1 className="t-titulo">{obra.titulo}</h1>
          {obra.ativo ? <Selo tom="acao">Publicada</Selo> : <Selo>Rascunho</Selo>}
        </div>
        {obra.ativo && (
          <p className="t-nota mt-1">
            <Link href={`/obras/${obra.id}`} className="text-accent underline-offset-4 hover:underline">
              Ver como o aluno vê
            </Link>
          </p>
        )}
      </header>
      <AdminTabs />
      <div className="max-w-3xl">
        <FormularioObra
          obraId={obra.id}
          inicial={{
            titulo: obra.titulo,
            autor: obra.autor ?? "",
            descricao: obra.descricao ?? "",
            epoca_id: obra.epoca_id,
            ativo: obra.ativo,
            funcoes: obra.obra_funcoes.map((f) => ({ funcao_id: f.funcao_id, nota: f.nota ?? "" })),
          }}
          epocas={opcoes.epocas}
          funcoes={opcoes.funcoes}
        />
      </div>
    </div>
  );
}
