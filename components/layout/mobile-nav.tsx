"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CalendarDays, Landmark, MessageSquareQuote, CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/inicio", label: "Início", icon: LayoutGrid },
  { href: "/hoje", label: "Hoje", icon: CalendarDays },
  { href: "/carteira", label: "Carteira", icon: Landmark },
  { href: "/socrates", label: "Sócrates", icon: MessageSquareQuote },
  { href: "/planejamento", label: "Semana", icon: CalendarRange },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-paideia-cream-300 bg-paideia-green-900 px-1 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium",
              active ? "text-paideia-gold-400" : "text-paideia-cream-100/60"
            )}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
