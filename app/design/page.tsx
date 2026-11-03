import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { romano } from "@/lib/utils";
import { DemoMovimento, SeletorTema } from "./controles";

export const metadata: Metadata = { title: "Sistema de design — Paideia" };

// Página de conferência dos tokens. Só existe em desenvolvimento e não
// aparece em nenhum menu.

const CORES = [
  { nome: "canvas", papel: "Fundo de leitura", classe: "bg-canvas" },
  { nome: "surface", papel: "Superfície", classe: "bg-surface" },
  { nome: "sunken", papel: "Recuo", classe: "bg-sunken" },
  { nome: "muted", papel: "Neutro", classe: "bg-muted" },
  { nome: "rule", papel: "Borda", classe: "bg-rule" },
  { nome: "rule-strong", papel: "Filete", classe: "bg-rule-strong" },
  { nome: "ink", papel: "Texto", classe: "bg-ink" },
  { nome: "accent", papel: "Link e destaque", classe: "bg-accent" },
  { nome: "gold", papel: "Dourado", classe: "bg-gold" },
  { nome: "gold-ink", papel: "Texto dourado", classe: "bg-gold-ink" },
  { nome: "action", papel: "Ação", classe: "bg-action" },
  { nome: "on-action", papel: "Texto da ação", classe: "bg-on-action" },
  { nome: "focus", papel: "Anel de foco", classe: "bg-focus" },
];

const TEMAS_AMOSTRA = [
  { tema: "claro", nome: "Claro" },
  { tema: "escuro", nome: "Escuro" },
  { tema: "foco", nome: "Foco" },
] as const;

const ESPACOS = [1, 2, 3, 4, 5, 6, 7, 8];
const RAIOS = ["rounded-sm", "rounded", "rounded-md", "rounded-xl", "rounded-2xl", "rounded-3xl"];

export default function DesignPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-pagina space-y-secao px-gutter py-secao">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-titulo">Sistema de design</h1>
          <p className="t-nota mt-1">Tokens do Paideia (North Star: O Templo). Página de desenvolvimento, fora do menu.</p>
        </div>
        <SeletorTema />
      </header>

      <Secao numero={1} titulo="Cores nos três modos">
        <div className="grid gap-4 lg:grid-cols-3">
          {TEMAS_AMOSTRA.map(({ tema, nome }) => (
            <div key={tema} data-theme={tema} className="rounded-xl border border-rule bg-canvas p-4 text-ink">
              <p className="t-subtitulo">{nome}</p>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {CORES.map((c) => (
                  <li key={c.nome} className="flex items-center gap-2">
                    <span className={`h-8 w-8 shrink-0 rounded-md border border-ink/10 ${c.classe}`} />
                    <span className="min-w-0">
                      <span className="t-interface block truncate">{c.papel}</span>
                      <span className="t-nota block">{c.nome}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="card mt-4 space-y-3 p-4">
                <p className="t-subtitulo">Eneida</p>
                <p className="t-nota">Texto secundário sobre a superfície.</p>
                <Link href="#" className="t-interface text-accent hover:underline">
                  Link de destaque
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" className="btn-primary">
                    <BookOpen className="h-4 w-4" /> Ação
                  </button>
                  <button type="button" className="btn-secondary">
                    Secundária
                  </button>
                  <Badge tone="gold">selo</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Secao>

      <Secao numero={2} titulo="Tipografia">
        <div className="space-y-6">
          <Amostra rotulo="display, EB Garamond">
            <p className="t-display">Paideia</p>
          </Amostra>
          <Amostra rotulo="título, EB Garamond">
            <p className="t-titulo">Imaginação épica e repertório de modelos humanos</p>
          </Amostra>
          <Amostra rotulo="subtítulo, EB Garamond">
            <p className="t-subtitulo">Obras que exercitam esta função</p>
          </Amostra>
          <Amostra rotulo="algarismos romanos">
            <p className="t-romano text-subtitulo text-gold-ink">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => romano(n)).join("  ")}
            </p>
          </Amostra>
          <Amostra rotulo="leitura, Hanken Grotesk, medida de 66 caracteres">
            <p className="t-leitura">
              O fim da formação é o amor ordenado e a virtude. O app não existe para informar nem para
              acumular conteúdo, e sim para formar a pessoa. Toda decisão de produto deve ajudar a
              ordenar o amor, criar hábito e aprofundar, e não apenas medir ou acumular.
            </p>
          </Amostra>
          <Amostra rotulo="corpo, Hanken Grotesk">
            <p className="t-corpo">Formar, não informar: o espírito é lenha a acender, não vaso a encher.</p>
          </Amostra>
          <Amostra rotulo="interface">
            <p className="t-interface">Guardar na Carteira</p>
          </Amostra>
          <Amostra rotulo="nota">
            <p className="t-nota">3 obras, 4 exercícios</p>
          </Amostra>
        </div>
      </Secao>

      <Secao numero={3} titulo="Filetes e marcadores">
        <div className="space-y-6">
          <Amostra rotulo="filete de 0,5px">
            <div className="filete" />
          </Amostra>
          <Amostra rotulo="borda fina (border-hair)">
            <div className="h-12 rounded-md border-hair border-ink/40" />
          </Amostra>
          <Amostra rotulo="marcador de seção">
            <div className="marcador" aria-hidden>
              IV
            </div>
          </Amostra>
        </div>
      </Secao>

      <Secao numero={4} titulo="Espaço, raios e sombras">
        <div className="space-y-6">
          <Amostra rotulo="escala de espaço (4px)">
            <ul className="space-y-2">
              {ESPACOS.map((n) => (
                <li key={n} className="flex items-center gap-3">
                  <span className="t-nota w-16">space-{n}</span>
                  <span className="h-3 bg-gold" style={{ width: `var(--space-${n})` }} />
                </li>
              ))}
            </ul>
          </Amostra>
          <Amostra rotulo="raios">
            <div className="flex flex-wrap gap-3">
              {RAIOS.map((r) => (
                <div key={r} className={`flex h-16 w-24 items-end border border-rule bg-surface p-2 ${r}`}>
                  <span className="t-nota">{r}</span>
                </div>
              ))}
            </div>
          </Amostra>
          <Amostra rotulo="sombras">
            <div className="flex flex-wrap gap-6">
              <div className="flex h-20 w-40 items-end rounded-xl bg-surface p-3 shadow-card">
                <span className="t-nota">card</span>
              </div>
              <div className="flex h-20 w-40 items-end rounded-xl bg-surface p-3 shadow-overlay">
                <span className="t-nota">overlay</span>
              </div>
            </div>
          </Amostra>
          <Amostra rotulo="grade (4, 8 e 12 colunas)">
            <div className="grade">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="h-8 rounded-sm bg-muted" />
              ))}
            </div>
          </Amostra>
        </div>
      </Secao>

      <Secao numero={5} titulo="Movimento">
        <DemoMovimento />
      </Secao>

      <Secao numero={6} titulo="Foco">
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" className="btn-primary">
            Botão
          </button>
          <Link href="#" className="t-interface text-accent underline underline-offset-4">
            Link
          </Link>
          <input
            placeholder="Campo de texto"
            className="t-interface rounded-md border border-rule bg-surface px-3 py-2 text-ink placeholder:text-ink/40"
          />
          <p className="t-nota">Use Tab para percorrer e conferir o anel de foco.</p>
        </div>
      </Secao>
    </main>
  );
}

function Secao({ numero, titulo, children }: { numero: number; titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <div className="marcador" aria-hidden>
        {romano(numero)}
      </div>
      <h2 className="t-subtitulo -mt-2">{titulo}</h2>
      {children}
    </section>
  );
}

function Amostra({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[12rem_1fr] sm:items-baseline">
      <p className="t-nota">{rotulo}</p>
      <div>{children}</div>
    </div>
  );
}
