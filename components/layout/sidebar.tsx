"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { MarcaTemplo } from "@/components/ui/logo";
import { NAV_ALUNO, NAV_ADMIN, rotaAtiva } from "@/lib/nav";
import { cn, romano } from "@/lib/utils";
import type { Perfil } from "@/types/database";

// Pedra verde fixa em todos os modos (DESIGN.md › Navigation).
const ITEM =
  "flex min-h-9 items-center gap-3 rounded-md px-2.5 py-1.5 text-interface transition-colors duration-discreto ease-discreto";
const ATIVO = "bg-paideia-gold-500 font-semibold text-paideia-green-950";
const INATIVO = "text-paideia-cream-100/85 hover:bg-white/[0.06] hover:text-paideia-cream-50";

export function Sidebar({ perfil }: { perfil: Perfil }) {
  const pathname = usePathname();
  const isAdmin = perfil.papel === "administrador";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col bg-paideia-green-900 text-paideia-cream-100 lg:flex">
      <div className="border-b border-white/10 px-4 py-4">
        <Link href="/inicio" className="flex items-center gap-2.5 rounded-md">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-paideia-gold-500 text-paideia-gold-400">
            <MarcaTemplo className="h-[18px] w-[18px]" />
          </span>
          <span className="font-serif text-xl font-medium text-paideia-cream-50">Paideia</span>
        </Link>
      </div>

      <nav aria-label="Seções" className="flex-1 overflow-y-auto px-2.5 py-3 scrollbar-thin">
        <ul className="space-y-0.5">
          {NAV_ALUNO.map((item) => {
            const ativo = rotaAtiva(pathname, item.href);
            return (
              <li key={item.href}>
                <Link href={item.href} aria-current={ativo ? "page" : undefined} className={cn(ITEM, ativo ? ATIVO : INATIVO)}>
                  <span
                    aria-hidden
                    className={cn("t-romano w-6 shrink-0 text-right text-nota", ativo ? "text-paideia-green-950" : "text-paideia-gold-400")}
                  >
                    {romano(item.numero)}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {isAdmin && (
          <div className="mt-5 border-t-hair border-paideia-gold-500/50 pt-3">
            <p className="px-2.5 pb-1.5 text-nota text-paideia-cream-100/70">Administração</p>
            <ul className="space-y-0.5">
              {NAV_ADMIN.map((item) => {
                const ativo = rotaAtiva(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={ativo ? "page" : undefined} className={cn(ITEM, ativo ? ATIVO : INATIVO)}>
                      <item.icon aria-hidden className="ml-2 h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-white/10 px-4 py-3">
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paideia-gold-500/20 font-serif text-sm text-paideia-gold-300"
        >
          {perfil.nome?.charAt(0)?.toUpperCase() ?? "A"}
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-nota font-semibold text-paideia-cream-50">{perfil.nome}</p>
          <p className="truncate text-micro text-paideia-cream-100/70">{perfil.grau_atual}</p>
        </div>
        <Link
          href="/configuracoes"
          aria-label="Configurações"
          className="rounded-md p-1.5 text-paideia-cream-100/70 hover:text-paideia-gold-300"
        >
          <Settings className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </aside>
  );
}
