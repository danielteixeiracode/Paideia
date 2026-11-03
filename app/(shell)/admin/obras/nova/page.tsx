import Link from "next/link";
import { requireAdmin } from "@/lib/data/session";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { FormularioObra } from "@/components/admin/formulario-obra";
import { carregarOpcoes } from "../opcoes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nova obra" };

export default async function NovaObraPage() {
  const { supabase } = await requireAdmin();
  const { epocas, funcoes } = await carregarOpcoes(supabase);

  return (
    <div className="space-y-8">
      <header className="filete pt-4">
        <Link href="/admin/obras" className="t-nota text-accent underline-offset-4 hover:underline">
          Voltar às obras
        </Link>
        <h1 className="t-titulo mt-2">Nova obra</h1>
        <p className="t-nota mt-1">Começa como rascunho; publique quando tiver ao menos uma função.</p>
      </header>
      <AdminTabs />
      <div className="max-w-3xl">
        <FormularioObra
          obraId={null}
          inicial={{ titulo: "", autor: "", descricao: "", epoca_id: null, ativo: false, funcoes: [] }}
          epocas={epocas}
          funcoes={funcoes}
        />
      </div>
    </div>
  );
}
