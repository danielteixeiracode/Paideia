"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/data/session";
import { validarObra, type DadosObra, type ResultadoSalvarObra } from "@/lib/validacao-obra";
import type { ResultadoAcao } from "@/lib/acoes";

// Só administrador: requireAdmin no servidor, e a RLS de obras e
// obra_funcoes só deixa o administrador escrever.

function revalidarObra(id: string) {
  revalidatePath("/admin/obras");
  revalidatePath(`/admin/obras/${id}/editar`);
  revalidatePath("/obras");
  revalidatePath(`/obras/${id}`);
  revalidatePath("/funcoes", "layout");
  revalidatePath("/epocas", "layout");
  revalidatePath("/inicio");
  revalidatePath("/carteira");
}

export async function salvarObra(id: string | null, bruto: DadosObra): Promise<ResultadoSalvarObra> {
  const { supabase } = await requireAdmin();

  const dados: DadosObra = {
    titulo: String(bruto.titulo ?? "").trim(),
    autor: String(bruto.autor ?? "").trim(),
    descricao: String(bruto.descricao ?? "").trim(),
    epoca_id: bruto.epoca_id ? String(bruto.epoca_id) : null,
    ativo: Boolean(bruto.ativo),
    funcoes: Array.isArray(bruto.funcoes)
      ? Array.from(new Map(bruto.funcoes.map((f) => [String(f.funcao_id), { funcao_id: String(f.funcao_id), nota: String(f.nota ?? "").trim() }])).values())
      : [],
  };

  const campos = validarObra(dados);

  // Época e funções precisam existir de verdade.
  const [epocaR, funcoesR] = await Promise.all([
    dados.epoca_id ? supabase.from("epocas").select("id").eq("id", dados.epoca_id).maybeSingle() : Promise.resolve({ data: null }),
    supabase.from("funcoes_pedagogicas").select("id"),
  ]);
  if (dados.epoca_id && !epocaR.data) campos.epoca_id = "Escolha uma das sete épocas.";
  const funcoesValidas = new Set(((funcoesR.data ?? []) as { id: string }[]).map((f) => f.id));
  if (dados.funcoes.some((f) => !funcoesValidas.has(f.funcao_id))) campos.funcoes = "Uma das funções marcadas não existe mais. Recarregue a página.";

  if (Object.keys(campos).length > 0) {
    return { ok: false, erro: "Revise os campos indicados antes de salvar.", campos };
  }

  const linha = {
    titulo: dados.titulo,
    autor: dados.autor || null,
    descricao: dados.descricao || null,
    epoca_id: dados.epoca_id,
    ativo: dados.ativo,
  };

  let obraId = id;
  if (obraId) {
    const { data, error } = await supabase.from("obras").update(linha).eq("id", obraId).select("id");
    if (error) return { ok: false, erro: "Não foi possível salvar a obra. Tente de novo." };
    if (!data?.length) return { ok: false, erro: "Esta obra não existe mais." };
  } else {
    const { data, error } = await supabase.from("obras").insert(linha).select("id").single();
    if (error || !data) return { ok: false, erro: "Não foi possível criar a obra. Tente de novo." };
    obraId = (data as { id: string }).id;
  }

  // Funções: tira as desmarcadas e grava as marcadas com a nota.
  const marcadas = dados.funcoes.map((f) => f.funcao_id);
  let remover = supabase.from("obra_funcoes").delete().eq("obra_id", obraId);
  if (marcadas.length) remover = remover.not("funcao_id", "in", `(${marcadas.join(",")})`);
  const { error: erroRemover } = await remover;
  if (erroRemover) return { ok: false, erro: "A obra foi salva, mas as funções não. Tente de novo." };

  if (marcadas.length) {
    const { error } = await supabase
      .from("obra_funcoes")
      .upsert(
        dados.funcoes.map((f) => ({ obra_id: obraId!, funcao_id: f.funcao_id, nota: f.nota || null })),
        { onConflict: "obra_id,funcao_id" }
      );
    if (error) return { ok: false, erro: "A obra foi salva, mas as funções não. Tente de novo." };
  }

  revalidarObra(obraId);
  return { ok: true, id: obraId };
}

// Sem exclusão: despublicar devolve a obra a rascunho (some para os alunos).
export async function despublicarObra(id: string): Promise<ResultadoAcao> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("obras").update({ ativo: false }).eq("id", id).select("id");
  if (error) return { ok: false, erro: "Não foi possível despublicar a obra. Tente de novo." };
  if (!data?.length) return { ok: false, erro: "Esta obra não existe mais." };
  revalidarObra(id);
  return { ok: true };
}
