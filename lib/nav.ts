import { Library, ListChecks, Bot, Users } from "lucide-react";

// Navegação do aluno: cada seção tem seu algarismo romano (I a VI), usado na
// sidebar, no menu do celular e no título do topo.
export const NAV_ALUNO = [
  { href: "/inicio", label: "Início", numero: 1 },
  { href: "/obras", label: "Obras", numero: 2 },
  { href: "/funcoes", label: "Funções", numero: 3 },
  { href: "/epocas", label: "Épocas", numero: 4 },
  { href: "/carteira", label: "Carteira", numero: 5 },
  { href: "/socrates", label: "Sócrates", numero: 6 },
];

export const NAV_ADMIN = [
  { href: "/admin/obras", label: "Obras", icon: Library },
  { href: "/admin/exercicios", label: "Exercícios", icon: ListChecks },
  { href: "/admin/socrates", label: "Sócrates", icon: Bot },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
];

export function rotaAtiva(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

// Título da tela atual para o topo: a seção do aluno (com seu romano), uma
// seção do admin, ou uma tela avulsa.
export function secaoDaRota(pathname: string): { label: string; numero?: number } {
  const aluno = NAV_ALUNO.find((item) => rotaAtiva(pathname, item.href));
  if (aluno) return { label: aluno.label, numero: aluno.numero };
  if (pathname.startsWith("/admin")) {
    const admin = NAV_ADMIN.find((item) => rotaAtiva(pathname, item.href));
    return { label: admin ? `Administração: ${admin.label}` : "Administração" };
  }
  if (pathname.startsWith("/configuracoes")) return { label: "Configurações" };
  if (pathname.startsWith("/biblioteca")) return { label: "Biblioteca" };
  return { label: "Paideia" };
}
