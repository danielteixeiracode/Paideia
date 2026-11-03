// O Next monta este template de novo a cada navegação, então a tela nova
// entra com o movimento discreto (fade curto com leve deslocamento). A
// animação começa quando o conteúdo já chegou: nunca atrasa a navegação.
// Sem animação para quem pede movimento reduzido (ver .anim-pagina).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="anim-pagina">{children}</div>;
}
