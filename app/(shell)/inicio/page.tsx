import Link from "next/link";
import { BookOpen, Sprout, Hourglass, Landmark, MessageSquareQuote, ArrowRight } from "lucide-react";
import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { Templo, type ColunaTemplo } from "@/components/corpo/templo";
import { preenchimentoColuna, frontaoAceso } from "@/lib/templo";
import type { FuncaoPedagogica, RegistroEvento } from "@/types/database";

type UltimoEvento = RegistroEvento & {
  obra: { id: string; titulo: string } | null;
  funcao: { id: string; nome: string } | null;
  exercicio: { id: string; titulo: string; funcao_id: string } | null;
};

const ATALHOS = [
  { href: "/obras", label: "Obras", icon: BookOpen },
  { href: "/funcoes", label: "Funções", icon: Sprout },
  { href: "/epocas", label: "Épocas", icon: Hourglass },
  { href: "/carteira", label: "Carteira", icon: Landmark },
  { href: "/socrates", label: "Sócrates", icon: MessageSquareQuote },
];

export default async function InicioPage() {
  const { supabase, perfil } = await requirePerfil();

  const [{ data: funcoesData }, { data: eventosFuncao }, { data: ultimoData }] = await Promise.all([
    supabase.from("funcoes_pedagogicas").select("*").order("numero"),
    supabase.from("registro_eventos").select("funcao_id").eq("user_id", perfil.id).not("funcao_id", "is", null),
    supabase
      .from("registro_eventos")
      .select("*, obra:obras(id, titulo), funcao:funcoes_pedagogicas(id, nome), exercicio:exercicios(id, titulo, funcao_id)")
      .eq("user_id", perfil.id)
      .order("criado_em", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  // Preenchimento derivado do registro, nunca guardado.
  const eventosPorFuncao = new Map<string, number>();
  for (const e of (eventosFuncao ?? []) as { funcao_id: string }[]) {
    eventosPorFuncao.set(e.funcao_id, (eventosPorFuncao.get(e.funcao_id) ?? 0) + 1);
  }
  const colunas: ColunaTemplo[] = ((funcoesData ?? []) as FuncaoPedagogica[]).map((f) => ({
    id: f.id,
    numero: f.numero,
    nome: f.nome,
    preenchimento: preenchimentoColuna(eventosPorFuncao.get(f.id) ?? 0),
  }));
  const aceso = frontaoAceso(colunas.map((c) => c.preenchimento));

  const continuar = destinoContinuar(ultimoData as unknown as UltimoEvento | null);

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow className="mb-2">Paideia</Eyebrow>
        <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          Salve, {perfil.nome.split(" ")[0]}.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Formação clássica com o mínimo de leitura e a máxima profundidade.
        </p>
      </div>

      {colunas.length > 0 && (
        <Card className="px-3 py-6 sm:px-6">
          <Templo colunas={colunas} aceso={aceso} />
        </Card>
      )}

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Eyebrow>Continuar</Eyebrow>
          <p className="mt-1 font-serif text-lg font-semibold text-ink">
            {continuar ? continuar.titulo : "Comece pelas Obras"}
          </p>
          <p className="text-sm text-ink/60">
            {continuar ? continuar.detalhe : "Escolha uma obra e veja a que funções ela serve."}
          </p>
        </div>
        <Link href={continuar?.href ?? "/obras"} className="btn-primary shrink-0">
          {continuar ? "Continuar" : "Ver as Obras"} <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>

      <nav aria-label="Atalhos" className="flex flex-wrap gap-2">
        {ATALHOS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-surface px-3 py-1.5 text-xs font-semibold text-ink/70 transition hover:bg-canvas"
          >
            <a.icon className="h-3.5 w-3.5 text-accent" />
            {a.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

// Para onde o "Continuar" leva: o exercício (pela sua função), a obra ou a
// função do último evento. Sem nenhum desses, não há para onde continuar.
function destinoContinuar(evento: UltimoEvento | null) {
  if (!evento) return null;
  if (evento.exercicio) {
    return {
      titulo: evento.exercicio.titulo,
      detalhe: "Último exercício",
      href: `/funcoes/${evento.exercicio.funcao_id}`,
    };
  }
  if (evento.obra) {
    return { titulo: evento.obra.titulo, detalhe: "Última obra", href: `/obras/${evento.obra.id}` };
  }
  if (evento.funcao) {
    return { titulo: evento.funcao.nome, detalhe: "Última função", href: `/funcoes/${evento.funcao.id}` };
  }
  return null;
}
