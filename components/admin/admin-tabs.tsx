"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ABAS = [
  { href: "/admin", label: "Visão geral", exata: true },
  { href: "/admin/obras", label: "Obras" },
  { href: "/admin/exercicios", label: "Exercícios" },
  { href: "/admin/socrates", label: "Sócrates" },
  { href: "/admin/usuarios", label: "Usuários" },
];

// Abas da administração, no padrão da navegação do cabeçalho: aba atual em
// tinta semibold com sublinhado dourado e aria-current, sobre um filete.
export function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Administração" className="border-b border-rule">
      <ul className="-mb-px flex gap-1 overflow-x-auto scrollbar-thin">
        {ABAS.map((aba) => {
          const ativa = aba.exata ? pathname === aba.href : pathname === aba.href || pathname.startsWith(aba.href + "/");
          return (
            <li key={aba.href} className="shrink-0">
              <Link
                href={aba.href}
                aria-current={ativa ? "page" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center px-3 text-interface transition-colors duration-discreto ease-discreto",
                  ativa ? "font-semibold text-ink" : "text-ink-muted hover:text-ink"
                )}
              >
                {aba.label}
                {ativa && <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gold" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
