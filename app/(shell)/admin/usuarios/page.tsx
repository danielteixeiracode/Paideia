import { requireAdmin } from "@/lib/data/session";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { TabelaUsuarios, type UsuarioAdmin } from "./tabela";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Administração: usuários" };

export default async function AdminUsuariosPage() {
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("perfis")
    .select("id, nome, email, papel, criado_em")
    .order("criado_em", { ascending: false });
  const usuarios = (data ?? []) as UsuarioAdmin[];

  return (
    <div className="space-y-8">
      <header className="filete pt-4">
        <h1 className="t-titulo">Usuários</h1>
        <p className="t-nota mt-1">Quem usa o Paideia e com que papel. Mudar um papel pede confirmação.</p>
      </header>

      <AdminTabs />

      {usuarios.length === 0 ? (
        <div className="filete py-10 text-center">
          <p className="t-subtitulo">Nenhum usuário cadastrado</p>
          <p className="t-nota mt-1">As contas aparecem aqui assim que alguém se cadastra no login.</p>
        </div>
      ) : (
        <TabelaUsuarios usuarios={usuarios} />
      )}
    </div>
  );
}
