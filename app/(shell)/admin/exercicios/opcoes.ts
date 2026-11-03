import type { requireAdmin } from "@/lib/data/session";
import type { ObraOpcao } from "@/components/admin/formulario-exercicio";

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

// As sete funções e as obras (com as funções que carregam), para o formulário.
export async function carregarOpcoesExercicio(supabase: Supabase) {
  const [funcoesR, obrasR] = await Promise.all([
    supabase.from("funcoes_pedagogicas").select("id, numero, nome").order("numero"),
    supabase.from("obras").select("id, titulo, ativo, obra_funcoes(funcao_id)").order("titulo"),
  ]);
  const obras: ObraOpcao[] = ((obrasR.data ?? []) as unknown as { id: string; titulo: string; ativo: boolean; obra_funcoes: { funcao_id: string }[] }[]).map(
    (o) => ({ id: o.id, titulo: o.titulo, ativo: o.ativo, funcoes: o.obra_funcoes.map((l) => l.funcao_id) })
  );
  return { funcoes: (funcoesR.data ?? []) as { id: string; numero: number; nome: string }[], obras };
}
