import {
  LayoutGrid,
  BookOpen,
  Sprout,
  Hourglass,
  Landmark,
  MessageSquareQuote,
  Library,
  ListChecks,
  Bot,
  Users,
} from "lucide-react";

export const NAV_ALUNO = [
  { href: "/inicio", label: "Início", icon: LayoutGrid },
  { href: "/obras", label: "Obras", icon: BookOpen },
  { href: "/funcoes", label: "Funções", icon: Sprout },
  { href: "/epocas", label: "Épocas", icon: Hourglass },
  { href: "/carteira", label: "Carteira", icon: Landmark },
  { href: "/socrates", label: "Sócrates", icon: MessageSquareQuote },
];

export const NAV_ADMIN = [
  { href: "/admin/obras", label: "Obras", icon: Library },
  { href: "/admin/exercicios", label: "Exercícios", icon: ListChecks },
  { href: "/admin/socrates", label: "Sócrates", icon: Bot },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
];
