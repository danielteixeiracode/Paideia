"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/data/session";
import { validarExercicio, type DadosExercicio, type ResultadoSalvarExercicio } from "@/lib/validacao-exercicio";
import type { ResultadoAcao } from "@/lib/acoes";

// Só administrador: requireAdmin no servidor, e a RLS de exercicios só deixa
// o administrador escrever.

function revalidarExercicio(id: string) {
  revalidatePath("/admin/exercicios");
  revalidatePath(`/admin/exercicios/${id}/editar`);
  revalidatePath("/obras", "layout");
  revalidatePath("/funcoes", "layout");
  revalidatePath("/inicio");
}

export async function salvarExercicio(id: string | null, bruto: DadosExercicio): Promise<ResultadoSalvarExercicio> {
  const { supabase } = await requireAdmin();

  const dados: DadosExercicio = {
    funcao_id: String(bruto.funcao_id ?? ""),
    obra_id: bruto.obra_id ? String(bruto.obra_id) : null,
    titulo: String(bruto.titulo ?? "").trim(),
    enunciado: String(bruto.enunciado ?? "").trim(),
    metodo: String(bruto.metodo ?? "").trim(),
    ativo: Boolean(bruto.ativo),
  };

  const campos = validarExercicio(dados);

  // A função precisa existir, e a obra (se houver) precisa carregar essa função.
  if (dados.funcao_id) {
    const { data: funcao } = await supabase.from("funcoes_pedagogicas").select("id").eq("id", dados.funcao_id).maybeSingle();
    if (!funcao) campos.funcao_id = "Escolha uma das sete funções.";
    else if (dados.obra_id) {
      const { data: ligacao } = await supabase
        .from("obra_funcoes")
        .select("obra_id")
        .eq("obra_id", dados.obra_id)
        .eq("funcao_id", dados.funcao_id)
        .maybeSingle();
      if (!ligacao) campos.obra_id = "Esta obra não carrega a função escolhida. Escolha outra obra ou deixe o exercício geral.";
    }
  }

  if (Object.keys(campos).length > 0) {
    return { ok: false, erro: "Revise os campos indicados antes de salvar.", campos };
  }

  const linha = {
    funcao_id: dados.funcao_id,
    obra_id: dados.obra_id,
    titulo: dados.titulo,
    enunciado: dados.enunciado,
    metodo: dados.metodo || null,
    ativo: dados.ativo,
  };

  let exercicioId = id;
  if (exercicioId) {
    const { data, error } = await supabase.from("exercicios").update(linha).eq("id", exercicioId).select("id");
    if (error) return { ok: false, erro: "Não foi possível salvar o exercício. Tente de novo." };
    if (!data?.length) return { ok: false, erro: "Este exercício não existe mais." };
  } else {
    // Novo exercício entra no fim da lista da função.
    const { data: ultimo } = await supabase
      .from("exercicios")
      .select("ordem")
      .eq("funcao_id", dados.funcao_id)
      .order("ordem", { ascending: false })
      .limit(1)
      .maybeSingle();
    const ordem = ((ultimo as { ordem: number } | null)?.ordem ?? 0) + 1;
    const { data, error } = await supabase.from("exercicios").insert({ ...linha, ordem }).select("id").single();
    if (error || !data) return { ok: false, erro: "Não foi possível criar o exercício. Tente de novo." };
    exercicioId = (data as { id: string }).id;
  }

  revalidarExercicio(exercicioId);
  return { ok: true, id: exercicioId };
}

// Sem exclusão: despublicar devolve o exercício a rascunho (some para os alunos).
export async function despublicarExercicio(id: string): Promise<ResultadoAcao> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("exercicios").update({ ativo: false }).eq("id", id).select("id");
  if (error) return { ok: false, erro: "Não foi possível despublicar o exercício. Tente de novo." };
  if (!data?.length) return { ok: false, erro: "Este exercício não existe mais." };
  revalidarExercicio(id);
  return { ok: true };
}
