"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Visão Geral" },
  { href: "/admin/obras", label: "Obras" },
  { href: "/admin/exercicios", label: "Exercícios" },
  { href: "/admin/socrates", label: "Sócrates" },
  { href: "/admin/usuarios", label: "Usuários" },
];

export function AdminTabs() {
  const pathname = usePathname();
  return (
    <div className="flex flex-wrap gap-2 border-b border-rule pb-3">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition",
              active ? "bg-action text-on-action" : "bg-surface text-ink/70 hover:bg-canvas"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
