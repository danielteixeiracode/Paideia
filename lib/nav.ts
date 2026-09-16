import {
  LayoutGrid,
  CalendarDays,
  Landmark,
  TrendingUp,
  MessageSquareQuote,
  Network,
  Library,
  CalendarRange,
  ShieldCheck,
} from "lucide-react";

export const NAV_ALUNO = [
  { href: "/inicio", label: "Início / Visão Geral", icon: LayoutGrid },
  { href: "/hoje", label: "Hoje", icon: CalendarDays },
  { href: "/carteira", label: "Carteira Intelectual", icon: Landmark },
  { href: "/trilha", label: "Trilha de Formação", icon: TrendingUp },
  { href: "/socrates", label: "Diálogo com Sócrates", icon: MessageSquareQuote },
  { href: "/mapa", label: "Mapa dos Estudos", icon: Network },
  { href: "/biblioteca", label: "Biblioteca Clássica", icon: Library },
  { href: "/planejamento", label: "Planejamento Semanal", icon: CalendarRange },
];

export const NAV_ADMIN = [
  { href: "/admin", label: "Painel Administrativo", icon: ShieldCheck },
];
