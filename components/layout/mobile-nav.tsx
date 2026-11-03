"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ALUNO, rotaAtiva } from "@/lib/nav";
import { cn, romano } from "@/lib/utils";

// Mesma lista da sidebar, com o romano no lugar do ícone e alvo de toque de 56px.
export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Seções"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-paideia-green-900 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex">
        {NAV_ALUNO.map((item) => {
          const ativo = rotaAtiva(pathname, item.href);
          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-0.5 transition-colors duration-discreto ease-discreto",
                  ativo ? "text-paideia-gold-300" : "text-paideia-cream-100/80"
                )}
              >
                {ativo && <span aria-hidden className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-paideia-gold-400" />}
                <span aria-hidden className="t-romano text-corpo leading-none">
                  {romano(item.numero)}
                </span>
                <span className={cn("max-w-full truncate text-micro", ativo && "font-semibold")}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
