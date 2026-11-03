"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, LogOut, Settings, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NAV_ALUNO, NAV_ADMIN, rotaAtiva } from "@/lib/nav";
import { cn, romano } from "@/lib/utils";
import { MarcaTemplo } from "@/components/ui/logo";
import { useComandos } from "@/components/comandos/comandos";
import { SeletorModo } from "@/components/tema/seletor-modo";
import type { Perfil } from "@/types/database";

// Cabeçalho do app em faixa dupla, a "arquitrave": em cima a marca, a busca, o
// modo e a conta; embaixo a navegação com os romanos, entre um filete fino e
// um filete duplo. Fixo ao rolar. No celular só fica a faixa de cima; a
// navegação vai para a barra inferior (MobileNav).
export function Cabecalho({ perfil }: { perfil: Perfil }) {
  const rolado = useRolado();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-surface/95 backdrop-blur-sm transition-shadow duration-discreto ease-discreto",
        rolado && "shadow-[0_1px_0_rgb(var(--c-rule-strong)/0.35),0_8px_16px_-14px_rgb(var(--c-ink)/0.35)]"
      )}
    >
      <div className="mx-auto flex h-14 max-w-pagina items-center gap-3 px-gutter max-md:border-b max-md:border-rule">
        <Link href="/inicio" className="mr-auto flex items-center gap-2 rounded-md">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-rule-strong/70 text-gold-ink">
            <MarcaTemplo className="h-[18px] w-[18px]" />
          </span>
          <span className="font-serif text-xl font-medium text-ink">Paideia</span>
        </Link>
        <BotaoBusca />
        <SeletorModo className="hidden sm:inline-flex" />
        <MenuConta perfil={perfil} />
      </div>
      <NavegacaoPrincipal />
    </header>
  );
}

// Verdadeiro depois que a página rola: o cabeçalho ganha a sombra de filete.
function useRolado() {
  const [rolado, setRolado] = useState(false);
  useEffect(() => {
    const atualizar = () => setRolado(window.scrollY > 4);
    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
    return () => window.removeEventListener("scroll", atualizar);
  }, []);
  return rolado;
}

function NavegacaoPrincipal() {
  const pathname = usePathname();
  return (
    <nav aria-label="Seções" className="filete filete-duplo-baixo hidden md:block">
      <ul className="mx-auto flex max-w-pagina items-center justify-center gap-1 px-gutter lg:gap-3">
        {NAV_ALUNO.map((item) => {
          const ativo = rotaAtiva(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center gap-2 px-3 text-interface transition-colors duration-discreto ease-discreto",
                  ativo ? "font-semibold text-ink" : "text-ink-muted hover:text-ink"
                )}
              >
                <span aria-hidden className="t-romano text-nota text-gold-ink">
                  {romano(item.numero)}
                </span>
                {item.label}
                {ativo && <span aria-hidden className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-gold" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Abre a paleta de comandos (o mesmo que Ctrl K).
function BotaoBusca() {
  const { abrirPaleta } = useComandos();
  return (
    <button
      type="button"
      onClick={abrirPaleta}
      aria-haspopup="dialog"
      aria-keyshortcuts="Control+K"
      aria-label="Buscar ou ir para"
      className="flex h-9 items-center gap-2 rounded-md border border-rule bg-surface px-2.5 text-interface text-ink-muted transition-colors duration-discreto ease-discreto hover:border-ink-muted hover:text-ink max-md:w-9 max-md:justify-center max-md:px-0 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:max-md:w-11"
    >
      <Search className="h-4 w-4 shrink-0" aria-hidden />
      <span className="hidden md:inline">Buscar ou ir para</span>
      <kbd className="hidden rounded border border-rule bg-sunken px-1.5 py-0.5 font-sans text-micro text-ink-muted md:inline">
        Ctrl K
      </kbd>
    </button>
  );
}

function MenuConta({ perfil }: { perfil: Perfil }) {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = perfil.papel === "administrador";

  // Fecha com Esc (devolvendo o foco ao botão), com clique fora e ao navegar.
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

  useEffect(() => setAberto(false), [pathname]);

  async function sair() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const item =
    "flex w-full items-center gap-2 px-3 py-2.5 text-left text-interface text-ink transition-colors duration-discreto ease-discreto hover:bg-sunken [@media(pointer:coarse)]:min-h-11";

  return (
    <div ref={raiz} className="relative">
      <button
        ref={botao}
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-haspopup="menu"
        aria-label={`Conta de ${perfil.nome}`}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-rule-strong/70 bg-sunken font-serif text-subtitulo leading-none text-gold-ink transition-colors duration-discreto ease-discreto hover:border-gold [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11"
      >
        {perfil.nome?.charAt(0)?.toUpperCase() ?? "A"}
      </button>
      {aberto && (
        <div
          role="menu"
          aria-label="Conta"
          className="anim-dialogo absolute right-0 top-[calc(100%+0.5rem)] w-64 overflow-hidden rounded-xl border border-rule bg-surface shadow-overlay"
        >
          <div className="border-b border-rule px-3 py-2.5">
            <p className="truncate text-interface font-semibold text-ink">{perfil.nome}</p>
            <p className="t-nota truncate">{perfil.grau_atual}</p>
          </div>
          {/* No celular o seletor de modo mora aqui. */}
          <div className="flex items-center justify-between gap-2 border-b border-rule px-3 py-2.5 sm:hidden">
            <span className="t-nota">Modo</span>
            <SeletorModo />
          </div>
          <Link role="menuitem" href="/configuracoes" className={item}>
            <Settings className="h-4 w-4 text-ink-muted" aria-hidden /> Configurações
          </Link>
          {isAdmin && (
            <div role="group" aria-labelledby="menu-conta-admin" className="border-t border-rule py-1">
              <p id="menu-conta-admin" className="px-3 pb-1 pt-1.5 text-nota text-ink-muted">
                Administração
              </p>
              <Link role="menuitem" href="/admin" className={item}>
                <ShieldCheck className="h-4 w-4 text-ink-muted" aria-hidden /> Painel
              </Link>
              {NAV_ADMIN.map((a) => (
                <Link key={a.href} role="menuitem" href={a.href} className={item}>
                  <a.icon className="h-4 w-4 text-ink-muted" aria-hidden /> {a.label}
                </Link>
              ))}
            </div>
          )}
          <button role="menuitem" type="button" onClick={sair} className={cn(item, "border-t border-rule")}>
            <LogOut className="h-4 w-4 text-ink-muted" aria-hidden /> Sair
          </button>
        </div>
      )}
    </div>
  );
}
