import { Library, ListChecks, Bot, Users } from "lucide-react";

// Navegação do aluno: cada seção tem seu algarismo romano (I a VI), usado na
// faixa de navegação do cabeçalho e na barra do celular.
export const NAV_ALUNO = [
  { href: "/inicio", label: "Início", numero: 1 },
  { href: "/obras", label: "Obras", numero: 2 },
  { href: "/funcoes", label: "Funções", numero: 3 },
  { href: "/epocas", label: "Épocas", numero: 4 },
  { href: "/carteira", label: "Carteira", numero: 5 },
  { href: "/socrates", label: "Sócrates", numero: 6 },
];

// Administração: no menu da conta, só para o administrador.
export const NAV_ADMIN = [
  { href: "/admin/obras", label: "Obras", icon: Library },
  { href: "/admin/exercicios", label: "Exercícios", icon: ListChecks },
  { href: "/admin/socrates", label: "Sócrates", icon: Bot },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
];

export function rotaAtiva(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}
