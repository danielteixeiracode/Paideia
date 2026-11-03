import { Logo } from "@/components/ui/logo";
import { AuthCard } from "@/components/auth/auth-card";
import { CabecalhoSecao } from "@/components/ui/cabecalho-secao";
import { SeletorModo } from "@/components/tema/seletor-modo";

const RECURSOS = [
  {
    titulo: "Paideia",
    descricao: "Formação clássica com o mínimo de leitura e a máxima profundidade.",
  },
  {
    titulo: "Diálogo Socrático",
    descricao: "Mentoria filosófica e dialética contínua na busca das virtudes perenes.",
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-canvas px-gutter py-10 sm:py-16">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <SeletorModo />
        </div>

        <h1 className="t-titulo mt-12 text-center">Bem-vindo ao templo dos seus estudos</h1>
        <p className="t-corpo mx-auto mt-3 max-w-md text-center text-ink-muted">
          A arte milenar da autoformação integral. Retome seu itinerário entre os mestres da sabedoria
          clássica.
        </p>

        <div aria-hidden className="filete mx-auto my-8 w-24" />

        <AuthCard />

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {RECURSOS.map((r, i) => (
            <CabecalhoSecao key={r.titulo} numero={i + 1} titulo={r.titulo} descricao={r.descricao} />
          ))}
        </div>

        <footer className="mt-12 space-y-3 border-t-hair border-rule-strong/60 pt-6 text-center">
          <nav aria-label="Sobre o Paideia" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-nota">
            <a href="#" className="text-accent underline-offset-4 hover:underline">
              Princípios Formativos
            </a>
            <a href="#" className="text-accent underline-offset-4 hover:underline">
              Cânone Clássico
            </a>
            <a href="#" className="text-accent underline-offset-4 hover:underline">
              Termos &amp; Ética
            </a>
          </nav>
          <p className="t-nota">Paideia: a educação dos homens livres desde a Grécia Clássica.</p>
        </footer>
      </div>
    </main>
  );
}
