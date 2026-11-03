import { Languages, Compass, BrainCircuit } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { AuthCard } from "@/components/auth/auth-card";

const RECURSOS = [
  {
    icone: Languages,
    titulo: "Trivium",
    descricao: "Gramática, Dialética e Retórica para dominar o pensamento ordenado.",
  },
  {
    icone: Compass,
    titulo: "Quadrivium",
    descricao: "Aritmética, Geometria, Música e Astronomia para decifrar o cosmos.",
  },
  {
    icone: BrainCircuit,
    titulo: "Diálogo Socrático",
    descricao: "Mentoria filosófica e dialética contínua na busca das virtudes perenes.",
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-paideia-cream-100 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl border border-paideia-cream-300 bg-paideia-cream-50 px-8 py-5 shadow-card">
            <Logo />
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <span className="label-caps rounded-full border border-paideia-cream-300 bg-paideia-cream-50 px-4 py-1.5">
            Trivium • Quadrivium
          </span>
        </div>

        <h1 className="text-center font-serif text-3xl font-semibold text-paideia-ink sm:text-4xl">
          Bem-vindo ao templo dos seus estudos
        </h1>
        <p className="mx-auto mt-3 max-w-md text-center font-serif italic text-paideia-ink/70">
          &ldquo;A arte milenar da autoformação integral. Retome seu itinerário entre os mestres da
          sabedoria clássica.&rdquo;
        </p>

        <div className="my-6 flex items-center justify-center gap-3 text-paideia-gold-500">
          <span className="h-px w-10 bg-paideia-gold-500/60" />
          <span>★</span>
          <span className="h-px w-10 bg-paideia-gold-500/60" />
        </div>

        <AuthCard />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {RECURSOS.map((r) => (
            <div key={r.titulo} className="rounded-xl border border-paideia-cream-300 bg-white p-5 text-center shadow-card">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-paideia-cream-100">
                <r.icone className="h-5 w-5 text-paideia-green-800" />
              </div>
              <p className="font-serif text-base font-semibold text-paideia-ink">{r.titulo}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-paideia-ink/60">{r.descricao}</p>
            </div>
          ))}
        </div>

        <footer className="mt-10 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-paideia-green-800">
            <a href="#" className="hover:underline">Princípios Formativos</a>
            <span>•</span>
            <a href="#" className="hover:underline">Cânone Clássico</a>
            <span>•</span>
            <a href="#" className="hover:underline">Termos &amp; Ética</a>
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-widest text-paideia-ink/40">
            Paideia: a educação dos homens livres desde a Grécia Clássica.
          </p>
        </footer>
      </div>
    </main>
  );
}
