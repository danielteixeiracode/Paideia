"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Flame } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { NAV_ALUNO, NAV_ADMIN } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { Perfil } from "@/types/database";

export function Sidebar({
  perfil,
  constanciaDias,
  eixosEquilibrados,
}: {
  perfil: Perfil;
  constanciaDias: number;
  eixosEquilibrados: number;
}) {
  const pathname = usePathname();
  const isAdmin = perfil.papel === "administrador";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-paideia-green-900 text-paideia-cream-100 lg:flex">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/inicio" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-paideia-gold-500 text-paideia-gold-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M4 21h16M5 21V9M19 21V9M3 9l9-5 9 5M8 9v8M12 9v8M16 9v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="font-serif text-base font-bold text-paideia-cream-50">Paideia</p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-paideia-gold-400/80">
              Formação Clássica
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {NAV_ALUNO.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-paideia-gold-500 text-paideia-green-950"
                  : "text-paideia-cream-100/80 hover:bg-white/5 hover:text-paideia-cream-50"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="mx-3 my-3 h-px bg-white/10" />
            {NAV_ADMIN.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-paideia-gold-500 text-paideia-green-950"
                      : "text-paideia-cream-100/80 hover:bg-white/5 hover:text-paideia-cream-50"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="space-y-3 border-t border-white/10 px-4 py-4">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-paideia-gold-300">
              <Flame className="h-3.5 w-3.5" /> Constância: {constanciaDias} dias
            </span>
            <span className="rounded-full bg-paideia-gold-500/20 px-2 py-0.5 text-[10px] font-semibold text-paideia-gold-300">
              Trivium
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-paideia-gold-500"
              style={{ width: `${Math.min(100, (constanciaDias / 21) * 100)}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-paideia-cream-100/60">
            {eixosEquilibrados} eixos equilibrados esta semana
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg px-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-paideia-gold-500/20 text-xs font-bold text-paideia-gold-300">
              {perfil.nome?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
            <div className="leading-tight">
              <p className="text-xs font-semibold">{perfil.nome}</p>
              <p className="text-[10px] text-paideia-cream-100/50">{perfil.grau_atual}</p>
            </div>
          </div>
          <Link href="/configuracoes" className="text-paideia-cream-100/60 hover:text-paideia-gold-300">
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
