"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ALUNO, rotaAtiva } from "@/lib/nav";
import { cn, romano } from "@/lib/utils";

// Celular: a mesma navegação do cabeçalho, sobre a superfície do tema, com o
// romano dourado e o item ativo sublinhado em dourado. Filete duplo em cima,
// espelhando a base da arquitrave. Alvo de toque de 56px.
export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Seções"
      className="filete-duplo-cima fixed inset-x-0 bottom-0 z-30 bg-surface/95 backdrop-blur-sm md:hidden"
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
                  ativo ? "text-ink" : "text-ink-muted"
                )}
              >
                <span aria-hidden className="t-romano text-corpo leading-none text-gold-ink">
                  {romano(item.numero)}
                </span>
                <span className={cn("max-w-full truncate text-micro", ativo && "font-semibold")}>{item.label}</span>
                {ativo && <span aria-hidden className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-gold" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
