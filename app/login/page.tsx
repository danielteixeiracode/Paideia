import { Landmark, BrainCircuit } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { AuthCard } from "@/components/auth/auth-card";

const RECURSOS = [
  {
    icone: Landmark,
    titulo: "Paideia",
    descricao: "Formação clássica com o mínimo de leitura e a máxima profundidade.",
  },
  {
    icone: BrainCircuit,
    titulo: "Diálogo Socrático",
    descricao: "Mentoria filosófica e dialética contínua na busca das virtudes perenes.",
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-canvas px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl border border-rule bg-sunken px-8 py-5 shadow-card">
            <Logo />
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <span className="label-caps rounded-full border border-rule bg-sunken px-4 py-1.5">
            Paideia
          </span>
        </div>

        <h1 className="text-center font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Bem-vindo ao templo dos seus estudos
        </h1>
        <p className="mx-auto mt-3 max-w-md text-center font-serif italic text-ink/70">
          &ldquo;A arte milenar da autoformação integral. Retome seu itinerário entre os mestres da
          sabedoria clássica.&rdquo;
        </p>

        <div className="my-6 flex items-center justify-center gap-3 text-paideia-gold-500">
          <span className="h-px w-10 bg-paideia-gold-500/60" />
          <span>★</span>
          <span className="h-px w-10 bg-paideia-gold-500/60" />
        </div>

        <AuthCard />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {RECURSOS.map((r) => (
            <div key={r.titulo} className="rounded-xl border border-rule bg-surface p-5 text-center shadow-card">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-canvas">
                <r.icone className="h-5 w-5 text-accent" />
              </div>
              <p className="font-serif text-base font-semibold text-ink">{r.titulo}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{r.descricao}</p>
            </div>
          ))}
        </div>

        <footer className="mt-10 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-accent">
            <a href="#" className="hover:underline">Princípios Formativos</a>
            <span>•</span>
            <a href="#" className="hover:underline">Cânone Clássico</a>
            <span>•</span>
            <a href="#" className="hover:underline">Termos &amp; Ética</a>
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-widest text-ink/40">
            Paideia: a educação dos homens livres desde a Grécia Clássica.
          </p>
        </footer>
      </div>
    </main>
  );
}
