import type { requireAdmin } from "@/lib/data/session";

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];
export type OpcaoNumerada = { id: string; numero: number; nome: string };

// As sete épocas e as sete funções, para as seleções do formulário de obra.
export async function carregarOpcoes(supabase: Supabase) {
  const [epocasR, funcoesR] = await Promise.all([
    supabase.from("epocas").select("id, numero, nome").order("numero"),
    supabase.from("funcoes_pedagogicas").select("id, numero, nome").order("numero"),
  ]);
  return {
    epocas: (epocasR.data ?? []) as OpcaoNumerada[],
    funcoes: (funcoesR.data ?? []) as OpcaoNumerada[],
  };
}
