import Link from "next/link";
import { BookOpen, Sprout, Hourglass, Landmark, MessageSquareQuote, ArrowRight } from "lucide-react";
import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow } from "@/components/ui/primitives";

export default async function InicioPage() {
  const { supabase, perfil } = await requirePerfil();

  const contar = (tabela: "obras" | "funcoes_pedagogicas" | "epocas") =>
    supabase.from(tabela).select("id", { count: "exact", head: true });

  const [{ count: obras }, { count: funcoes }, { count: epocas }, { count: naCarteira }, { count: frutos }] =
    await Promise.all([
      contar("obras").eq("ativo", true),
      contar("funcoes_pedagogicas"),
      contar("epocas"),
      supabase.from("carteira_obras").select("id", { count: "exact", head: true }).eq("user_id", perfil.id),
      supabase.from("frutos").select("id", { count: "exact", head: true }).eq("user_id", perfil.id),
    ]);

  const secoes = [
    { href: "/obras", titulo: "Obras", detalhe: `${obras ?? 0} obras`, icon: BookOpen },
    { href: "/funcoes", titulo: "Funções", detalhe: `${funcoes ?? 0} funções pedagógicas`, icon: Sprout },
    { href: "/epocas", titulo: "Épocas", detalhe: `${epocas ?? 0} épocas`, icon: Hourglass },
    {
      href: "/carteira",
      titulo: "Carteira",
      detalhe: `${naCarteira ?? 0} obras • ${frutos ?? 0} frutos`,
      icon: Landmark,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow className="mb-2">Paideia</Eyebrow>
        <h1 className="font-serif text-2xl font-semibold text-paideia-ink sm:text-3xl">
          Salve, {perfil.nome.split(" ")[0]}.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-paideia-ink/60">
          Formação clássica com o mínimo de leitura e a máxima profundidade.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {secoes.map((s) => (
          <Link key={s.href} href={s.href} className="block">
            <Card className="flex h-full items-center gap-4 transition hover:border-paideia-gold-400">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paideia-cream-100">
                <s.icon className="h-5 w-5 text-paideia-green-800" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-lg font-semibold">{s.titulo}</p>
                <p className="text-xs text-paideia-ink/50">{s.detalhe}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-paideia-green-800" />
            </Card>
          </Link>
        ))}
      </div>

      <Card className="flex flex-col gap-3 bg-paideia-cream-50/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paideia-cream-200 text-paideia-green-800">
            <MessageSquareQuote className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-paideia-ink/80">Sócrates</p>
            <p className="text-xs text-paideia-ink/50">
              Tire uma dúvida no diálogo socrático quando quiser.
            </p>
          </div>
        </div>
        <Link href="/socrates" className="btn-secondary shrink-0 px-3 py-1.5 text-xs">
          Abrir Diálogo <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Card>
    </div>
  );
}
