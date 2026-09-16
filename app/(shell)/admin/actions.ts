"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/data/session";

export async function criarEixo(formData: FormData) {
  await requireAdmin();
  const supabase = createClient();
  const nome = String(formData.get("nome") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const cor = String(formData.get("cor") ?? "#153D29");
  if (!nome || !slug) return;

  await supabase.from("eixos").insert({ nome, slug, descricao, cor, ordem: 99 });
  revalidatePath("/admin/eixos");
}

export async function atualizarEixo(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createClient();
  const payload = {
    nome: String(formData.get("nome") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    descricao: String(formData.get("descricao") ?? "").trim() || null,
    cor: String(formData.get("cor") ?? "#153D29"),
  };
  if (!id || !payload.nome || !payload.slug) return;

  await supabase.from("eixos").update(payload).eq("id", id);
  revalidatePath("/admin/eixos");
  revalidatePath("/mapa");
  revalidatePath("/biblioteca");
}

export async function removerEixo(id: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("eixos").delete().eq("id", id);
  revalidatePath("/admin/eixos");
}

export async function criarCapacidade(formData: FormData) {
  await requireAdmin();
  const supabase = createClient();
  const eixo_id = String(formData.get("eixo_id") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  if (!eixo_id || !nome) return;

  await supabase.from("capacidades").insert({ eixo_id, nome, descricao, ordem: 99 });
  revalidatePath("/admin/eixos");
}

export async function atualizarCapacidade(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createClient();
  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  if (!id || !nome) return;

  await supabase.from("capacidades").update({ nome, descricao }).eq("id", id);
  revalidatePath("/admin/eixos");
  revalidatePath("/mapa");
}

export async function removerCapacidade(id: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("capacidades").delete().eq("id", id);
  revalidatePath("/admin/eixos");
  revalidatePath("/mapa");
}

export async function criarAtivo(formData: FormData) {
  await requireAdmin();
  const supabase = createClient();
  const payload = {
    titulo: String(formData.get("titulo") ?? "").trim(),
    subtitulo: String(formData.get("subtitulo") ?? "").trim() || null,
    autor: String(formData.get("autor") ?? "").trim() || null,
    tipo: String(formData.get("tipo") ?? "livro"),
    eixo_id: String(formData.get("eixo_id") ?? "") || null,
    descricao: String(formData.get("descricao") ?? "").trim() || null,
    duracao_estimada_horas: Number(formData.get("duracao_estimada_horas") ?? 0),
    nivel: String(formData.get("nivel") ?? "intermediario"),
    ativo: true,
  };
  if (!payload.titulo) return;

  await supabase.from("ativos").insert(payload);
  revalidatePath("/admin/ativos");
  revalidatePath("/biblioteca");
}

export async function atualizarAtivo(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createClient();
  const payload = {
    titulo: String(formData.get("titulo") ?? "").trim(),
    subtitulo: String(formData.get("subtitulo") ?? "").trim() || null,
    autor: String(formData.get("autor") ?? "").trim() || null,
    tipo: String(formData.get("tipo") ?? "livro"),
    eixo_id: String(formData.get("eixo_id") ?? "") || null,
    descricao: String(formData.get("descricao") ?? "").trim() || null,
    duracao_estimada_horas: Number(formData.get("duracao_estimada_horas") ?? 0),
    nivel: String(formData.get("nivel") ?? "intermediario"),
  };
  if (!id || !payload.titulo) return;

  await supabase.from("ativos").update(payload).eq("id", id);
  revalidatePath("/admin/ativos");
  revalidatePath("/biblioteca");
}

export async function alternarAtivoPublicado(id: string, ativo: boolean) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("ativos").update({ ativo }).eq("id", id);
  revalidatePath("/admin/ativos");
  revalidatePath("/biblioteca");
}

export async function removerAtivo(id: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("ativos").delete().eq("id", id);
  revalidatePath("/admin/ativos");
  revalidatePath("/biblioteca");
}

export async function criarTrilha(formData: FormData) {
  await requireAdmin();
  const supabase = createClient();
  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  if (!nome) return;
  await supabase.from("trilhas").insert({ nome, descricao, ordem: 99 });
  revalidatePath("/admin/trilhas");
}

export async function atualizarTrilha(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createClient();
  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  if (!id || !nome) return;

  await supabase.from("trilhas").update({ nome, descricao }).eq("id", id);
  revalidatePath("/admin/trilhas");
  revalidatePath("/trilha");
}

export async function removerTrilha(id: string) {
  await requireAdmin();
  const supabase = createClient();
  // Cascateia: apaga as etapas da trilha e o progresso dos alunos nelas.
  await supabase.from("trilhas").delete().eq("id", id);
  revalidatePath("/admin/trilhas");
  revalidatePath("/trilha");
}

export async function criarEtapa(formData: FormData) {
  await requireAdmin();
  const supabase = createClient();
  const payload = {
    trilha_id: String(formData.get("trilha_id") ?? ""),
    eixo_id: String(formData.get("eixo_id") ?? ""),
    codigo: String(formData.get("codigo") ?? "").trim(),
    titulo: String(formData.get("titulo") ?? "").trim(),
    descricao: String(formData.get("descricao") ?? "").trim() || null,
    carga_horas_estimada: Number(formData.get("carga_horas_estimada") ?? 0),
    selo_titulo: String(formData.get("selo_titulo") ?? "").trim() || null,
    ordem: Number(formData.get("ordem") ?? 99),
  };
  if (!payload.trilha_id || !payload.eixo_id || !payload.titulo) return;

  await supabase.from("etapas_trilha").insert(payload);
  revalidatePath("/admin/trilhas");
  revalidatePath("/trilha");
}

export async function atualizarEtapa(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = createClient();
  const payload = {
    eixo_id: String(formData.get("eixo_id") ?? ""),
    codigo: String(formData.get("codigo") ?? "").trim(),
    titulo: String(formData.get("titulo") ?? "").trim(),
    descricao: String(formData.get("descricao") ?? "").trim() || null,
    carga_horas_estimada: Number(formData.get("carga_horas_estimada") ?? 0),
    selo_titulo: String(formData.get("selo_titulo") ?? "").trim() || null,
    ordem: Number(formData.get("ordem") ?? 99),
  };
  if (!id || !payload.eixo_id || !payload.titulo) return;

  await supabase.from("etapas_trilha").update(payload).eq("id", id);
  revalidatePath("/admin/trilhas");
  revalidatePath("/trilha");
}

export async function removerEtapa(id: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("etapas_trilha").delete().eq("id", id);
  revalidatePath("/admin/trilhas");
  revalidatePath("/trilha");
}

export async function atualizarConfigSocrates(formData: FormData) {
  const { supabase, perfil } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const payload = {
    system_prompt: String(formData.get("system_prompt") ?? "").trim(),
    modelo: String(formData.get("modelo") ?? "claude-sonnet-5").trim(),
    temperatura: Number(formData.get("temperatura") ?? 0.7),
    max_tokens: Number(formData.get("max_tokens") ?? 1024),
    atualizado_por: perfil.id,
  };
  if (!payload.system_prompt) return;

  if (id) {
    await supabase.from("config_socrates").update(payload).eq("id", id);
  } else {
    await supabase.from("config_socrates").insert({ ...payload, nome: "Sócrates", ativo: true });
  }
  revalidatePath("/admin/socrates");
}

export async function atualizarPapelUsuario(userId: string, papel: "aluno" | "administrador") {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("perfis").update({ papel }).eq("id", userId);
  revalidatePath("/admin/usuarios");
}
