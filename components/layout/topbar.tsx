"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, LogOut, User, ShieldCheck, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { secaoDaRota } from "@/lib/nav";
import { romano, cn } from "@/lib/utils";
import { useAviso } from "@/components/ui/aviso";
import { SeletorModo } from "@/components/tema/seletor-modo";
import type { Perfil } from "@/types/database";

export function Topbar({ perfil, naoLidas }: { perfil: Perfil; naoLidas: number }) {
  const pathname = usePathname();
  const secao = secaoDaRota(pathname);
  const avisar = useAviso();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-rule bg-canvas/95 px-gutter py-2.5 backdrop-blur-sm">
      {/* Título da tela: romano, filete e nome da seção. */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {secao.numero && (
          <>
            <span aria-hidden className="t-romano text-subtitulo text-gold-ink">
              {romano(secao.numero)}
            </span>
            <span aria-hidden className="filete w-5 shrink-0" />
          </>
        )}
        <p className="t-subtitulo truncate">{secao.label}</p>
      </div>

      {/* Busca: ainda sem função (a paleta de comandos vem numa próxima etapa). */}
      <button
        type="button"
        onClick={() => avisar("A busca chega numa próxima etapa.")}
        aria-keyshortcuts="Control+K"
        aria-label="Buscar ou ir para"
        className="flex h-9 items-center gap-2 rounded-md border border-rule bg-surface px-2.5 text-interface text-ink-muted transition-colors duration-discreto ease-discreto hover:border-ink-muted hover:text-ink [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:px-3"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <span className="hidden md:inline">Buscar ou ir para</span>
        <kbd className="hidden rounded border border-rule bg-sunken px-1.5 py-0.5 font-sans text-micro text-ink-muted md:inline">
          Ctrl K
        </kbd>
      </button>

      <SeletorModo className="hidden sm:inline-flex" />

      <button
        type="button"
        aria-label={naoLidas > 0 ? `Notificações: ${naoLidas} não lidas` : "Notificações"}
        className="relative hidden h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors duration-discreto ease-discreto hover:bg-sunken hover:text-ink sm:flex"
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden />
        {naoLidas > 0 && <span aria-hidden className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold" />}
      </button>

      <MenuConta perfil={perfil} />
    </header>
  );
}

function MenuConta({ perfil }: { perfil: Perfil }) {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Fecha com Esc (devolvendo o foco ao botão) ou com clique fora.
  useEffect(() => {
    if (!aberto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAberto(false);
        botao.current?.focus();
      }
    }
    function onClique(e: MouseEvent) {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberto(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClique);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClique);
    };
  }, [aberto]);

  async function sair() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const item =
    "flex w-full items-center gap-2 px-3 py-2.5 text-left text-interface text-ink transition-colors duration-discreto ease-discreto hover:bg-sunken";

  return (
    <div ref={raiz} className="relative">
      <button
        ref={botao}
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-haspopup="menu"
        aria-label="Conta"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-paideia-gold-500 bg-paideia-green-900 text-paideia-gold-300 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11"
      >
        <User className="h-4 w-4" aria-hidden />
      </button>
      {aberto && (
        <div
          role="menu"
          className="anim-dialogo absolute right-0 top-[calc(100%+0.5rem)] w-60 overflow-hidden rounded-xl border border-rule bg-surface shadow-overlay"
        >
          <div className="border-b border-rule px-3 py-2.5">
            <p className="truncate text-interface font-semibold text-ink">{perfil.nome}</p>
            <p className="t-nota truncate">{perfil.email}</p>
          </div>
          {/* No celular o seletor de modo mora aqui. */}
          <div className="flex items-center justify-between gap-2 border-b border-rule px-3 py-2.5 sm:hidden">
            <span className="t-nota">Modo</span>
            <SeletorModo />
          </div>
          <Link role="menuitem" href="/configuracoes" onClick={() => setAberto(false)} className={item}>
            <Settings className="h-4 w-4 text-ink-muted" aria-hidden /> Configurações
          </Link>
          {perfil.papel === "administrador" && (
            <Link role="menuitem" href="/admin" onClick={() => setAberto(false)} className={item}>
              <ShieldCheck className="h-4 w-4 text-ink-muted" aria-hidden /> Painel administrativo
            </Link>
          )}
          <button role="menuitem" type="button" onClick={sair} className={cn(item, "border-t border-rule")}>
            <LogOut className="h-4 w-4 text-ink-muted" aria-hidden /> Sair
          </button>
        </div>
      )}
    </div>
  );
}
