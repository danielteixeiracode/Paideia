import { requirePerfil } from "@/lib/data/session";
import { Eyebrow, EmptyState } from "@/components/ui/primitives";
import { AtivoCard } from "@/components/biblioteca/ativo-card";
import type { Ativo, Eixo } from "@/types/database";

export default async function BibliotecaPage() {
  const { supabase, perfil } = await requirePerfil();

  const [{ data: ativos }, { data: eixos }, { data: carteira }] = await Promise.all([
    supabase.from("ativos").select("*").eq("ativo", true).order("ordem"),
    supabase.from("eixos").select("*"),
    supabase.from("carteira_itens").select("ativo_id").eq("user_id", perfil.id),
  ]);

  const eixosMap = new Map((eixos ?? []).map((e) => [e.id, e as Eixo]));
  const naCarteira = new Set((carteira ?? []).map((c) => c.ativo_id));

  const lista = (ativos ?? []) as Ativo[];

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Repositório Perene • Paideia • {lista.length} Ativos Indexados</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">
          Biblioteca Clássica &amp; Repositório de Ativos
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-paideia-ink/60">
          Catálogo curado de tratados canônicos, diálogos maiêuticos, cursos guiados e exercícios
          dialéticos para alocação direta na sua Carteira Intelectual.
        </p>
      </div>

      {lista.length === 0 ? (
        <EmptyState titulo="Nenhum ativo publicado" descricao="O administrador ainda não publicou ativos no catálogo." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((ativo) => (
            <AtivoCard
              key={ativo.id}
              ativo={ativo}
              eixo={ativo.eixo_id ? eixosMap.get(ativo.eixo_id) : undefined}
              naCarteira={naCarteira.has(ativo.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
