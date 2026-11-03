import { requirePerfil } from "@/lib/data/session";
import { AtivoCard } from "@/components/biblioteca/ativo-card";
import type { Ativo, Eixo } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Biblioteca" };

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
    <div className="space-y-8">
      <header className="filete pt-4">
        <h1 className="t-titulo">Biblioteca Clássica e Repositório de Ativos</h1>
        <p className="t-leitura mt-2 text-ink-muted">
          Catálogo curado de tratados canônicos, diálogos maiêuticos, cursos guiados e exercícios
          dialéticos para alocação direta na sua Carteira Intelectual.
        </p>
        <p className="t-nota mt-2">{lista.length === 1 ? "1 ativo" : `${lista.length} ativos`}</p>
      </header>

      {lista.length === 0 ? (
        <div className="filete py-10 text-center">
          <p className="t-subtitulo">Nenhum ativo publicado</p>
          <p className="t-nota mt-1">O administrador ainda não publicou ativos no catálogo.</p>
        </div>
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
