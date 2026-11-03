import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ContextoTelaProvider } from "@/components/socrates/contexto-tela";
import { SocratesGaveta } from "@/components/socrates/socrates-gaveta";
import { requirePerfil, getConstanciaDias } from "@/lib/data/session";

export default async function ShellLayout({ children }: { children: React.ReactNode }) {
  const { supabase, perfil } = await requirePerfil();

  const [constanciaDias, { count: naoLidas }, { data: registrosSemana }] = await Promise.all([
    getConstanciaDias(supabase, perfil.id),
    supabase
      .from("notificacoes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", perfil.id)
      .eq("lida", false),
    supabase
      .from("registros_estudo")
      .select("eixo_id")
      .eq("user_id", perfil.id)
      .gte("data", new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)),
  ]);

  const eixosEquilibrados = new Set((registrosSemana ?? []).map((r) => r.eixo_id).filter(Boolean))
    .size;

  return (
    <ContextoTelaProvider>
      <div className="min-h-dvh bg-paideia-cream-100">
        <Sidebar perfil={perfil} constanciaDias={constanciaDias} eixosEquilibrados={eixosEquilibrados} />
        <div className="flex min-h-dvh flex-col lg:pl-64">
          <Topbar perfil={perfil} naoLidas={naoLidas ?? 0} />
          <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8">{children}</main>
        </div>
        <MobileNav />
        <SocratesGaveta />
      </div>
    </ContextoTelaProvider>
  );
}
