import { test, expect, type Page } from "@playwright/test";
import type { SupabaseClient } from "@supabase/supabase-js";
import { criarAdminClient, criarAdminDeTeste } from "./helpers/supabase-admin";

const carimbo = Date.now();
const TRILHA_TESTE = `[QA] Trilha ${carimbo}`;
const ETAPA_TESTE = `[QA] Etapa ${carimbo}`;
const ATIVO_TESTE = `[QA] Ativo ${carimbo}`;
const EIXO_TESTE = `[QA] Eixo ${carimbo}`;
const CAPACIDADE_TESTE = `[QA] Capacidade ${carimbo}`;

let supabase: SupabaseClient;
let credenciais: { userId: string; email: string; senha: string };
let trilhaId: string;
let etapaId: string;
let ativoId: string;
let eixoIdTemporario: string | null = null;
let eixoProprioId: string;
let capacidadeId: string;

test.beforeAll(async () => {
  supabase = criarAdminClient();
  credenciais = await criarAdminDeTeste(supabase);

  // Precisamos de um eixo para vincular a etapa; usa um existente ou cria um descartável.
  const { data: eixos } = await supabase.from("eixos").select("id").limit(1);
  let eixoId = eixos?.[0]?.id as string | undefined;
  if (!eixoId) {
    const { data, error } = await supabase
      .from("eixos")
      .insert({ nome: `[QA] Eixo ${carimbo}`, slug: `qa-eixo-${carimbo}`, ordem: 999 })
      .select("id")
      .single();
    if (error) throw error;
    eixoId = data.id;
    eixoIdTemporario = data.id;
  }

  const { data: trilha, error: erroTrilha } = await supabase
    .from("trilhas")
    .insert({ nome: TRILHA_TESTE, descricao: "criada pelo teste E2E", ordem: 999 })
    .select("id")
    .single();
  if (erroTrilha) throw erroTrilha;
  trilhaId = trilha.id;

  const { data: etapa, error: erroEtapa } = await supabase
    .from("etapas_trilha")
    .insert({
      trilha_id: trilhaId,
      eixo_id: eixoId,
      codigo: "QA 01",
      titulo: ETAPA_TESTE,
      carga_horas_estimada: 3,
      ordem: 999,
    })
    .select("id")
    .single();
  if (erroEtapa) throw erroEtapa;
  etapaId = etapa.id;

  const { data: ativo, error: erroAtivo } = await supabase
    .from("ativos")
    .insert({ titulo: ATIVO_TESTE, autor: "QA", tipo: "livro", eixo_id: eixoId, ativo: true })
    .select("id")
    .single();
  if (erroAtivo) throw erroAtivo;
  ativoId = ativo.id;

  // Eixo próprio do teste, para editar sem tocar nos eixos reais.
  const { data: eixoProprio, error: erroEixoProprio } = await supabase
    .from("eixos")
    .insert({ nome: EIXO_TESTE, slug: `qa-eixo-proprio-${carimbo}`, cor: "#153D29", ordem: 998 })
    .select("id")
    .single();
  if (erroEixoProprio) throw erroEixoProprio;
  eixoProprioId = eixoProprio.id;

  const { data: capacidade, error: erroCapacidade } = await supabase
    .from("capacidades")
    .insert({ eixo_id: eixoProprioId, nome: CAPACIDADE_TESTE, ordem: 998 })
    .select("id")
    .single();
  if (erroCapacidade) throw erroCapacidade;
  capacidadeId = capacidade.id;
});

test.afterAll(async () => {
  if (capacidadeId) await supabase.from("capacidades").delete().eq("id", capacidadeId);
  if (eixoProprioId) await supabase.from("eixos").delete().eq("id", eixoProprioId);
  if (ativoId) await supabase.from("ativos").delete().eq("id", ativoId);
  if (etapaId) await supabase.from("etapas_trilha").delete().eq("id", etapaId);
  if (trilhaId) await supabase.from("trilhas").delete().eq("id", trilhaId);
  if (eixoIdTemporario) await supabase.from("eixos").delete().eq("id", eixoIdTemporario);
  if (credenciais?.userId) await supabase.auth.admin.deleteUser(credenciais.userId);
});

async function entrar(page: Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill(credenciais.email);
  await page.locator('input[type="password"]').fill(credenciais.senha);
  await page.getByRole("button", { name: /Entrar no Paideia/ }).click();
  await page.waitForURL("**/inicio", { timeout: 30_000 });
}

test("admin edita etapa da trilha e a mudança persiste no banco", async ({ page }) => {
  await entrar(page);
  await page.goto("/admin/trilhas");

  const linha = page.locator("tr", { hasText: ETAPA_TESTE });
  await expect(linha).toBeVisible();

  await linha.getByRole("button", { name: "Editar etapa" }).click();

  const novoTitulo = `${ETAPA_TESTE} EDITADA`;
  // Só o formulário de edição tem botão "Salvar" (os de criação usam outros rótulos).
  const formulario = page.locator("form", { has: page.getByRole("button", { name: "Salvar" }) });
  await formulario.locator('input[name="titulo"]').fill(novoTitulo);
  await formulario.locator('input[name="carga_horas_estimada"]').fill("42");
  await formulario.getByRole("button", { name: "Salvar" }).click();

  await expect(page.locator("tr", { hasText: novoTitulo })).toBeVisible();

  const { data } = await supabase
    .from("etapas_trilha")
    .select("titulo, carga_horas_estimada")
    .eq("id", etapaId)
    .single();

  expect(data?.titulo).toBe(novoTitulo);
  expect(Number(data?.carga_horas_estimada)).toBe(42);
});

test("admin edita ativo da biblioteca e a mudança persiste no banco", async ({ page }) => {
  await entrar(page);
  await page.goto("/admin/ativos");

  const linha = page.locator("tr", { hasText: ATIVO_TESTE });
  await expect(linha).toBeVisible();

  await linha.getByRole("button", { name: "Editar ativo" }).click();

  const novoTitulo = `${ATIVO_TESTE} EDITADO`;
  const formulario = page.locator("form", { has: page.getByRole("button", { name: "Salvar" }) });
  await formulario.locator('input[name="titulo"]').fill(novoTitulo);
  await formulario.locator('input[name="autor"]').fill("Autor Revisado");
  await formulario.getByRole("button", { name: "Salvar" }).click();

  await expect(page.locator("tr", { hasText: novoTitulo })).toBeVisible();

  const { data } = await supabase.from("ativos").select("titulo, autor").eq("id", ativoId).single();

  expect(data?.titulo).toBe(novoTitulo);
  expect(data?.autor).toBe("Autor Revisado");
});

test("admin edita eixo e a mudança persiste no banco", async ({ page }) => {
  await entrar(page);
  await page.goto("/admin/eixos");

  await page.getByRole("button", { name: `Editar eixo ${EIXO_TESTE}` }).click();

  const novoNome = `${EIXO_TESTE} EDITADO`;
  const formulario = page.locator("form", { has: page.getByRole("button", { name: "Salvar" }) });
  await formulario.locator('input[name="nome"]').fill(novoNome);
  await formulario.locator('input[name="descricao"]').fill("descricao revisada");
  await formulario.getByRole("button", { name: "Salvar" }).click();

  await expect(page.getByText(novoNome)).toBeVisible();

  const { data } = await supabase
    .from("eixos")
    .select("nome, descricao")
    .eq("id", eixoProprioId)
    .single();

  expect(data?.nome).toBe(novoNome);
  expect(data?.descricao).toBe("descricao revisada");
});

test("admin edita capacidade e a mudança persiste no banco", async ({ page }) => {
  await entrar(page);
  await page.goto("/admin/eixos");

  await page.getByRole("button", { name: `Editar capacidade ${CAPACIDADE_TESTE}` }).click();

  const novoNome = `${CAPACIDADE_TESTE} EDITADA`;
  const formulario = page.locator("form", { has: page.getByRole("button", { name: "Salvar" }) });
  await formulario.locator('input[name="nome"]').fill(novoNome);
  await formulario.getByRole("button", { name: "Salvar" }).click();

  await expect(page.getByText(novoNome)).toBeVisible();

  const { data } = await supabase.from("capacidades").select("nome").eq("id", capacidadeId).single();

  expect(data?.nome).toBe(novoNome);
});

test("admin remove trilha e as etapas dela somem junto", async ({ page }) => {
  // Trilha descartável exclusiva deste teste, para não interferir nos outros.
  const { data: trilha } = await supabase
    .from("trilhas")
    .insert({ nome: `[QA] Trilha descartavel ${carimbo}`, ordem: 997 })
    .select("id, nome")
    .single();
  const { data: eixoQualquer } = await supabase.from("eixos").select("id").limit(1).single();
  const { data: etapa } = await supabase
    .from("etapas_trilha")
    .insert({
      trilha_id: trilha!.id,
      eixo_id: eixoQualquer!.id,
      codigo: "QA 99",
      titulo: `[QA] Etapa descartavel ${carimbo}`,
      ordem: 997,
    })
    .select("id")
    .single();

  await entrar(page);
  await page.goto("/admin/trilhas");

  page.once("dialog", (dialog) => {
    expect(dialog.message()).toContain("TODO o progresso");
    dialog.accept();
  });
  await page.getByRole("button", { name: `Remover trilha ${trilha!.nome}` }).click();

  await expect(page.getByText(trilha!.nome)).toHaveCount(0);

  const { data: trilhaDepois } = await supabase.from("trilhas").select("id").eq("id", trilha!.id);
  const { data: etapaDepois } = await supabase
    .from("etapas_trilha")
    .select("id")
    .eq("id", etapa!.id);

  expect(trilhaDepois).toHaveLength(0);
  expect(etapaDepois).toHaveLength(0);
});
