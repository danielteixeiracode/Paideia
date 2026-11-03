import type { createClient } from "@/lib/supabase/server";
import { toISODate } from "@/lib/utils";

type SB = ReturnType<typeof createClient>;

export async function getDashboardData(supabase: SB, userId: string) {
  const hoje = toISODate(new Date());

  const [
    { data: eixos },
    { data: carteira },
    { data: atividadesHoje },
    { data: frequencia },
  ] = await Promise.all([
    supabase.from("eixos").select("*").eq("ativo", true).order("ordem"),
    supabase.from("carteira_itens").select("*, ativo_ref:ativos(*)").eq("user_id", userId),
    supabase
      .from("atividades_planejadas")
      .select("*, eixo:eixos(*)")
      .eq("user_id", userId)
      .eq("data", hoje)
      .order("hora_inicio", { ascending: true, nullsFirst: true }),
    supabase
      .from("constancia_diaria")
      .select("data, estudou")
      .eq("user_id", userId)
      .gte("data", toISODate(new Date(Date.now() - 29 * 86400000))),
  ]);

  return {
    eixos: eixos ?? [],
    carteira: carteira ?? [],
    atividadesHoje: atividadesHoje ?? [],
    frequencia: frequencia ?? [],
    hoje,
  };
}
