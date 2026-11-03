import {
  LayoutGrid,
  CalendarDays,
  Landmark,
  MessageSquareQuote,
  Library,
  CalendarRange,
  ShieldCheck,
} from "lucide-react";

export const NAV_ALUNO = [
  { href: "/inicio", label: "Início / Visão Geral", icon: LayoutGrid },
  { href: "/hoje", label: "Hoje", icon: CalendarDays },
  { href: "/carteira", label: "Carteira Intelectual", icon: Landmark },
  { href: "/socrates", label: "Diálogo com Sócrates", icon: MessageSquareQuote },
  { href: "/biblioteca", label: "Biblioteca Clássica", icon: Library },
  { href: "/planejamento", label: "Planejamento Semanal", icon: CalendarRange },
];

export const NAV_ADMIN = [
  { href: "/admin", label: "Painel Administrativo", icon: ShieldCheck },
];
