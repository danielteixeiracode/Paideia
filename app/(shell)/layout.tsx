import { Cabecalho } from "@/components/layout/cabecalho";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ContextoTelaProvider } from "@/components/socrates/contexto-tela";
import { SocratesGaveta } from "@/components/socrates/socrates-gaveta";
import { SaidaFoco } from "@/components/tema/saida-foco";
import { Comandos } from "@/components/comandos/comandos";
import { requirePerfil } from "@/lib/data/session";

export default async function ShellLayout({ children }: { children: React.ReactNode }) {
  const { perfil } = await requirePerfil();

  return (
    <ContextoTelaProvider>
      <Comandos isAdmin={perfil.papel === "administrador"}>
        {/* data-chrome: interface que some no modo foco (ver globals.css). */}
        <div className="min-h-dvh bg-canvas">
          <div data-shell-content className="flex min-h-dvh flex-col">
            <div data-chrome className="contents">
              <Cabecalho perfil={perfil} />
            </div>
            <main className="mx-auto w-full max-w-pagina flex-1 px-gutter pb-24 pt-6 md:pb-10">{children}</main>
          </div>
          <div data-chrome className="contents">
            <MobileNav />
            <SocratesGaveta />
          </div>
          <SaidaFoco />
        </div>
      </Comandos>
    </ContextoTelaProvider>
  );
}
