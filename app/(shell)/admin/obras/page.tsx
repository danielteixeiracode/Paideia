import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/data/session";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { classesBotao } from "@/components/ui/botao";
import { TabelaObras, type ObraAdmin } from "./tabela";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Administração: obras" };

type Linha = {
  id: string;
  titulo: string;
  autor: string | null;
  ativo: boolean;
  epoca: { numero: number; nome: string } | null;
  obra_funcoes: { funcao: { numero: number; nome: string } | null }[];
};

export default async function AdminObrasPage() {
  // Só administrador (checado aqui e no middleware); vê também os rascunhos.
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("obras")
    .select("id, titulo, autor, ativo, epoca:epocas(numero, nome), obra_funcoes(funcao:funcoes_pedagogicas(numero, nome))")
    .order("ordem")
    .order("titulo");

  const obras: ObraAdmin[] = ((data ?? []) as unknown as Linha[]).map((o) => ({
    id: o.id,
    titulo: o.titulo,
    autor: o.autor,
    ativo: o.ativo,
    epoca: o.epoca,
    funcoes: o.obra_funcoes
      .map((l) => l.funcao)
      .filter((f): f is { numero: number; nome: string } => !!f)
      .sort((a, b) => a.numero - b.numero),
  }));

  return (
    <div className="space-y-8">
      <header className="filete flex flex-wrap items-end justify-between gap-4 pt-4">
        <div>
          <h1 className="t-titulo">Obras</h1>
          <p className="t-nota mt-1">O acervo da formação, com os rascunhos. Só a administração vê esta tela.</p>
        </div>
        <Link href="/admin/obras/nova" className={classesBotao()}>
          <Plus className="h-4 w-4" aria-hidden /> Nova obra
        </Link>
      </header>

      <AdminTabs />

      {obras.length === 0 ? (
        <div className="filete py-10 text-center">
          <p className="t-subtitulo">Nenhuma obra cadastrada</p>
          <p className="t-nota mt-1">Cadastre a primeira obra da formação. Ela começa como rascunho.</p>
          <Link href="/admin/obras/nova" className={classesBotao({ className: "mt-4" })}>
            <Plus className="h-4 w-4" aria-hidden /> Nova obra
          </Link>
        </div>
      ) : (
        <TabelaObras obras={obras} />
      )}
    </div>
  );
}
