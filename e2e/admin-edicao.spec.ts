import { test, expect, type Page } from "@playwright/test";
import type { SupabaseClient } from "@supabase/supabase-js";
import { criarAdminClient, criarAdminDeTeste } from "./helpers/supabase-admin";

const carimbo = Date.now();
const ATIVO_TESTE = `[QA] Ativo ${carimbo}`;
const EIXO_TESTE = `[QA] Eixo ${carimbo}`;
const CAPACIDADE_TESTE = `[QA] Capacidade ${carimbo}`;

let supabase: SupabaseClient;
let credenciais: { userId: string; email: string; senha: string };
let ativoId: string;
let eixoIdTemporario: string | null = null;
let eixoProprioId: string;
let capacidadeId: string;

test.beforeAll(async () => {
  supabase = criarAdminClient();
  credenciais = await criarAdminDeTeste(supabase);

  // Precisamos de um eixo para vincular o ativo; usa um existente ou cria um descartável.
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
